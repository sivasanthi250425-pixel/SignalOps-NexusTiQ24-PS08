#!/usr/bin/env python3
import os
import json
import sqlite3

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'supply_chain.db')

def dump_all_records():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    tables = ['suppliers', 'materials', 'inventory', 'shipments', 'customer_orders', 'logistics_contracts']
    data = {}
    for t in tables:
        try:
            rows = c.execute(f"SELECT * FROM {t}").fetchall()
            data[t] = [dict(r) for r in rows]
        except Exception as e:
            data[t] = []
    conn.close()
    return data

if __name__ == '__main__':
    records = dump_all_records()
    print(json.dumps(records))
