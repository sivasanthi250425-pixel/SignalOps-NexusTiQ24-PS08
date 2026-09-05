#!/usr/bin/env python3
"""SignalOps Control Tower — NexusTiQ24 PS08.
Python-only, zero third-party runtime dependencies.
"""
from __future__ import annotations
import json, os, re, sqlite3, subprocess, sys, threading
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "supply_chain.db"
ENGINE_PATH = ROOT / "engine" / "ps08_engine.py"
STATIC_PATH = ROOT / "static"
PORT = int(os.getenv("PORT", "8000"))


def local_extract(notice: str):
    shipment = re.search(r"\b(SH-\d{3})\b", notice, re.I)
    days = re.search(r"(\d+)\s*(?:calendar\s*)?(?:days?|business days?)", notice, re.I)
    lower = notice.lower()
    if any(x in lower for x in ("carrier", "ocean", "vessel", "port", "typhoon", "container")):
        source, title = "Carrier Notice", "Vessel Berth & Port Congestion Advisory"
    elif any(x in lower for x in ("supplier", "foundry", "furnace", "smelt", "factory")):
        source, title = "Supplier Email", "Supplier Facility & Production Disruption"
    elif any(x in lower for x in ("warehouse", "terminal", "maintenance")):
        source, title = "Warehouse Incident", "Warehouse / Terminal Incident"
    elif any(x in lower for x in ("customs", "regulatory", "clearance")):
        source, title = "Customs Alert", "Customs / Regulatory Hold"
    else:
        source, title = "Supplier Email", "Supply Chain Disruption Advisory"
    return {"incidentTitle": title, "sourceType": source,
            "shipmentId": shipment.group(1).upper() if shipment else None,
            "delayDurationDays": int(days.group(1)) if days else None}


def gemini_extract(notice: str, base: dict):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        return base
    # Gemini REST call using Python stdlib: no google-genai package required.
    prompt = ("You are the entity extraction module for SignalOps Control Tower, NexusTiQ24 PS08. "
              "Extract ONLY entities explicitly stated in the notice. Never invent IDs, quantities, "
              "dates, costs, suppliers or customers. Missing fields must be null. Return JSON only "
              "with keys incidentTitle, sourceType, carrierOrFacility, supplierName, shipmentId, sku, "
              "delayDurationDays, revisedEta.\n\nNOTICE:\n" + notice)
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json"}}
    req = Request(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode())
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(text)
        return {**base, **parsed}
    except Exception as exc:
        print(f"Gemini extraction unavailable; deterministic extraction used: {exc}", file=sys.stderr)
        return base


def run_engine(payload):
    proc = subprocess.run([sys.executable, str(ENGINE_PATH), "--stdin"],
                          input=json.dumps(payload), text=True,
                          capture_output=True, timeout=50)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr[-2000:] or "PS08 engine failed")
    return json.loads(proc.stdout)


def json_response(handler, status, data):
    raw = json.dumps(data, ensure_ascii=False).encode()
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(raw)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(raw)


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args))

    def do_GET(self):
        if self.path == "/api/health":
            return json_response(self, 200, {"status":"ok","system":"SignalOps Supply Chain Control Tower",
                "track":"NexusTiQ24 · PS08","validationKey":"PS08","backend":"Python",
                "databaseEngine":"SQLite","geminiConfigured":bool(os.getenv("GEMINI_API_KEY"))})
        if self.path == "/api/network-records":
            return self.network_records()
        if self.path.startswith("/api/"):
            return json_response(self, 404, {"error":"API route not found"})
        path = self.path.split("?", 1)[0].lstrip("/")
        if not path or path == "index.html": path = "index.html"
        target = STATIC_PATH / path
        if not target.exists() or not target.is_file(): target = STATIC_PATH / "index.html"
        data = target.read_bytes()
        ctype = "text/html; charset=utf-8" if target.suffix == ".html" else "text/plain; charset=utf-8"
        self.send_response(200); self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data))); self.end_headers(); self.wfile.write(data)

    def body(self):
        length = int(self.headers.get("Content-Length", "0"))
        return json.loads(self.rfile.read(length).decode() or "{}")

    def do_POST(self):
        try:
            if self.path == "/api/analyze-disruption":
                req = self.body(); notice = str(req.get("noticeText", "")).strip()
                if not notice: return json_response(self, 400, {"error":"noticeText is required"})
                horizon = req.get("decisionHorizon", "14D")
                extracted = gemini_extract(notice, local_extract(notice))
                result = run_engine({"noticeText":notice,"decisionHorizon":horizon,"extractedEntities":extracted})
                summary = result.get("impactSummary", {})
                if result.get("hasOperationalImpact") and "shortageAgainstDemand" in summary:
                    summary["unitsAtRisk"] = summary["shortageAgainstDemand"]
                return json_response(self, 200, result)
            if self.path == "/api/approve-action":
                req = self.body(); action_id = str(req.get("actionId", "")).strip()
                if not action_id: return json_response(self, 400, {"error":"actionId is required"})
                now = datetime.now().astimezone().isoformat()
                conn = sqlite3.connect(DB_PATH)
                try:
                    conn.execute("CREATE TABLE IF NOT EXISTS approval_audit (audit_id INTEGER PRIMARY KEY AUTOINCREMENT, action_id TEXT NOT NULL, operator_name TEXT NOT NULL, authorized_at TEXT NOT NULL, notes TEXT)")
                    conn.execute("INSERT INTO approval_audit(action_id,operator_name,authorized_at,notes) VALUES(?,?,?,?)",
                                 (action_id, req.get("operatorName","Command Desk Operator"), now, req.get("notes") or "Authorized by human operator after review."))
                    conn.commit()
                finally: conn.close()
                return json_response(self, 200, {"success":True,"actionId":action_id,"authorizedBy":req.get("operatorName","Command Desk Operator"),"authorizedAt":now,"auditStatus":"LOGGED_TO_LOCAL_AUDIT_LEDGER","externalActionExecuted":False})
            return json_response(self, 404, {"error":"API route not found"})
        except Exception as exc:
            print(f"Request error: {exc}", file=sys.stderr)
            return json_response(self, 500, {"error":str(exc)})

    def network_records(self):
        if not DB_PATH.exists(): return json_response(self, 500, {"error":"supply_chain.db not found"})
        tables = ["suppliers","materials","inventory","shipments","customer_orders","logistics_contracts"]
        conn = sqlite3.connect(DB_PATH); conn.row_factory = sqlite3.Row; data = {}
        try:
            for table in tables:
                try: data[table] = [dict(r) for r in conn.execute(f"SELECT * FROM {table}").fetchall()]
                except sqlite3.Error: data[table] = []
        finally: conn.close()
        return json_response(self, 200, data)


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"SignalOps PS08 running at http://localhost:{PORT}")
    print("Python stdlib backend · SQLite operational truth · Gemini extraction when GEMINI_API_KEY is set")
    try: server.serve_forever()
    except KeyboardInterrupt: pass
    finally: server.server_close()

if __name__ == "__main__": main()
