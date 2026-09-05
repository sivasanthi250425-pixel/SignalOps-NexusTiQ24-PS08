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
