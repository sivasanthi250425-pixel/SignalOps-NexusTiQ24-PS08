TRACK_ID=PS08

# SignalOps — Supply Chain Disruption Intelligence

SignalOps is a NexusTiQ24 PS08 Supply Chain Disruption Response Assistant. It turns an unstructured disruption notice into a traceable impact assessment using Gemini for extraction and a deterministic Python + SQLite engine for operational truth.

## Why this architecture

**Notice → Gemini extraction → entity resolution → SQLite dependency graph → deterministic impact calculation → ranked response options → human approval**

Gemini never decides quantities, dates, customer exposure, shortage, or financial liability. Those facts are calculated from the committed SQLite ledger by Python. This prevents a severe-sounding notice from becoming a fabricated operational impact.

## Run

Python 3.11 is required by the event environment.

```bash
pip install -r requirements.txt
python app.py
```

Open `http://localhost:8000`.

Set the Gemini API key only as an environment variable:

```bash
GEMINI_API_KEY=your_key_here
```

No key is committed to the repository.

## PS08 workflow

1. Paste a supplier, carrier, or warehouse disruption notice.
2. Gemini extracts only entities explicitly present in the notice.
3. Python resolves those entities against the local SQLite ledger.
4. Python traces **Supplier → Shipment → Inventory → Orders → Customers**.
5. Shortage, breach dates, affected orders, customers, and SLA exposure are calculated deterministically.
6. If a matched shipment has no confirmed delay duration or revised ETA, the system returns **NEEDS CLARIFICATION** and refuses to fabricate impact.
7. Response options are ranked with cost/lead-time trade-offs.
8. A human operator must authorize the recommended response; the system does not execute an external action.
9. If no pending dependency is connected to the notice, the result is **NO CURRENT OPERATIONAL IMPACT**.

## Difficult case

A disruption can sound critical while being operationally irrelevant. SignalOps explicitly tests that case by refusing to force an impact when the local ledger contains no connected pending dependency.

## Data

The committed `supply_chain.db` is synthetic demonstration data containing suppliers, materials, inventory, inbound shipments, customer orders, and logistics contracts. The application does not claim to connect to a real ERP or logistics provider.

## Repository structure

- `app.py` — Python standard-library HTTP entrypoint and API (zero third-party runtime dependencies)
- `engine/ps08_engine.py` — deterministic PS08 impact and response engine
- `supply_chain.db` — committed synthetic operational ledger
- `static/index.html` — self-contained submission UI served by Python
- `src/` — original SignalOps React source used during development
- `server.ts` — original development server retained for provenance; it is **not** the NexusTiQ24 runtime

## Security and constraints

- Gemini is the only external AI API used.
- `GEMINI_API_KEY` is read from the environment.
- Operational facts come from local SQLite/Python calculations.
- No hosted vector database or third-party RAG/memory service is used.
- No external operational action is executed automatically.
