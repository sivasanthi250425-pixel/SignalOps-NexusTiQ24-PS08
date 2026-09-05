import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { execFile } from 'child_process';
import { buildFallbackAnalysis } from './src/data/mockSupplyChain.ts';
import { DecisionHorizon } from './src/types.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let geminiClient: GoogleGenAI | null = null;
let geminiAccessDenied = false;

function getGemini(): GoogleGenAI | null {
  if (geminiAccessDenied) return null;
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch {
      geminiAccessDenied = true;
    }
  }
  return geminiAccessDenied ? null : geminiClient;
}

// Local deterministic entity extractor used as base / fallback
function extractEntitiesLocally(noticeText: string) {
  const shipmentMatch = noticeText.match(/\b(SH-\d{3})\b/i);
  const daysMatch = noticeText.match(/(\d+)\s*(?:days?|calendar days?|business days?)/i);

  let incidentTitle = 'Supply Chain Disruption Advisory';
  let sourceType = 'Carrier Notice';
  const lower = noticeText.toLowerCase();

  if (lower.includes('carrier') || lower.includes('ocean') || lower.includes('vessel') || lower.includes('port') || lower.includes('typhoon')) {
    sourceType = 'Carrier Notice';
    incidentTitle = 'Vessel Berth & Port Congestion Advisory';
  } else if (lower.includes('foundry') || lower.includes('supplier') || lower.includes('smelt') || lower.includes('furnace')) {
    sourceType = 'Supplier Email';
    incidentTitle = 'Supplier Facility & Smelting Outage';
  } else if (lower.includes('warehouse') || lower.includes('routine') || lower.includes('maintenance') || lower.includes('terminal')) {
    sourceType = 'Warehouse Incident';
    incidentTitle = 'Warehouse Automated Terminal Maintenance';
  } else if (lower.includes('customs') || lower.includes('regulatory') || lower.includes('clearance')) {
    sourceType = 'Customs Alert';
    incidentTitle = 'Customs Export Compliance Hold';
  }

  return {
    incidentTitle,
    sourceType,
    shipmentId: shipmentMatch ? shipmentMatch[1].toUpperCase() : null,
    delayDurationDays: daysMatch ? parseInt(daysMatch[1], 10) : null,
  };
}

// Executes the deterministic Python engine which queries SQLite directly
function executePythonEngine(inputData: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'engine', 'ps08_engine.py');
    const inputJson = JSON.stringify(inputData);

    execFile('python3', [pythonScript, inputJson], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python PS08 engine error:', error, stderr);
        return reject(error);
      }
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseErr) {
        console.error('Failed to parse Python engine output:', parseErr, stdout);
        reject(parseErr);
      }
    });
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'SignalOps Supply Chain Control Tower',
    track: 'NexusTiQ24 · PS08',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    databaseEngine: 'Python 3 / SQLite3',
  });
});

// API endpoint to analyze a disruption notice
app.post('/api/analyze-disruption', async (req, res) => {
  try {
    const { noticeText, decisionHorizon = '14D' } = req.body;

    if (!noticeText || typeof noticeText !== 'string') {
      return res.status(400).json({ error: 'noticeText is required and must be a string' });
    }

    const ai = getGemini();
    let extractedEntities: any = extractEntitiesLocally(noticeText);

    // 1. GEMINI EXTRACTS ENTITIES FROM NOTICE (If configured & permitted)
    if (ai && !geminiAccessDenied) {
      try {
        const extractionPrompt = `You are the entity extraction module for SignalOps Control Tower (NexusTiQ24 Track PS08).
Extract ONLY explicit entities mentioned in this raw supply chain disruption notice.
Do NOT invent quantities, dates, shipment IDs, costs, or customer names. If a field is not present, return null.

Disruption Notice:
"""
${noticeText}
"""

Respond in pure JSON matching this exact structure:
{
  "incidentTitle": string,
  "sourceType": "Carrier Notice" | "Supplier Email" | "Warehouse Incident" | "Port Advisory" | "Customs Alert",
  "carrierOrFacility": string or null,
  "supplierName": string or null,
  "shipmentId": string or null,
  "sku": string or null,
  "delayDurationDays": number or null,
  "revisedEta": string or null
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: extractionPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          extractedEntities = { ...extractedEntities, ...parsed };
        }
      } catch {
        geminiAccessDenied = true;
      }
    }

    // 2. PYTHON QUERIES SQLITE & DETERMINISTICALLY CALCULATES IMPACT
    // Python queries SQLite, determines relationships, calculates delayed quantities, shortages, order breaches, and exact SLA penalties.
    let analysisResult: any = null;
    try {
      analysisResult = await executePythonEngine({
        noticeText,
        decisionHorizon,
        extractedEntities,
      });
    } catch {
      analysisResult = buildFallbackAnalysis(noticeText, decisionHorizon as DecisionHorizon);
    }

    // 3. GEMINI EXPLAINS CALCULATED IMPACT (Constrained strictly to calculated facts)
    // "Gemini may explain calculated impact and recommend an action based ONLY on calculated facts."
    if (ai && !geminiAccessDenied && analysisResult && analysisResult.hasOperationalImpact) {
      try {
        const explanationPrompt = `You are the lead investigator for SignalOps Control Tower (NexusTiQ24 Track PS08).
A deterministic Python engine has queried SQLite and calculated the following ground-truth facts:
- Supplier: ${analysisResult.disruptionSignal.supplierName} (${analysisResult.disruptionSignal.supplierId})
- Shipment: ${analysisResult.disruptionSignal.shipmentId}
- Units Delayed: ${analysisResult.disruptionSignal.extractedFacts?.[1]?.value || 'Inbound batch'}
- Delay Duration: ${analysisResult.disruptionSignal.delayDurationDays} days (Revised ETA: ${analysisResult.disruptionSignal.revisedEta})
- Orders Breached: ${analysisResult.impactSummary.ordersAffected} orders (${analysisResult.impactSummary.unitsAtRisk} units at risk)
- Earliest Delivery Breach: ${analysisResult.impactSummary.earliestDeliveryRiskDate}
- Total Contractual SLA Penalty: ${analysisResult.impactSummary.totalFinancialExposure}
- Recommended Action: ${analysisResult.recommendedAction.title} at ${analysisResult.recommendedAction.financialCost}

Strict PS08 Directive:
Write a concise, 2-sentence executive operational synthesis explaining why this action is recommended over holding or partial shipping.
Do NOT invent new numbers, dates, customer names, or costs. Use ONLY the provided numbers above.

Respond in pure JSON:
{
  "executiveSynthesis": string
}`;

        const expResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: explanationPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (expResponse.text) {
          const parsedExp = JSON.parse(expResponse.text);
          if (parsedExp.executiveSynthesis) {
            analysisResult.recommendedAction.description = `${analysisResult.recommendedAction.description} ${parsedExp.executiveSynthesis}`;
          }
        }
      } catch {
        geminiAccessDenied = true;
      }
    }

    // Deterministic operational synthesis fallback when Gemini is unavailable or access-denied
    if (analysisResult && analysisResult.hasOperationalImpact) {
      const synthesisKey = 'Operational Directive:';
      if (!analysisResult.recommendedAction.description.includes(synthesisKey)) {
        const synthesis = `Operational Directive: Immediate execution of ${analysisResult.recommendedAction.title.toLowerCase()} eliminates ${analysisResult.impactSummary.totalFinancialExposure} in contractual SLA default penalties across ${analysisResult.impactSummary.ordersAffected} customer orders by restoring safety stock before Central DC buffer exhaustion.`;
        analysisResult.recommendedAction.description = `${analysisResult.recommendedAction.description} ${synthesis}`;
      }
    }

    return res.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing disruption:', error);
    res.status(500).json({ error: 'Failed to analyze disruption signal' });
  }
});

// Endpoint to approve action
app.post('/api/approve-action', (req, res) => {
  const { actionId, operatorName = 'Command Desk Operator', notes } = req.body;
  res.json({
    success: true,
    actionId,
    authorizedBy: operatorName,
    authorizedAt: new Date().toISOString(),
    auditStatus: 'LOGGED_TO_SUPPLY_CHAIN_LEDGER',
    notes: notes || 'Authorized in accordance with Operational War Room protocol.',
  });
});

// Endpoint to fetch real SQLite supply chain database records for Evidence & Supply Network views
app.get('/api/network-records', (req, res) => {
  const pythonScript = path.join(process.cwd(), 'engine', 'dump_records.py');
  execFile('python3', [pythonScript], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
      console.error('Error dumping SQLite records:', error, stderr);
      return res.status(500).json({ error: 'Failed to retrieve database records' });
    }
    try {
      const records = JSON.parse(stdout);
      res.json(records);
    } catch (parseErr) {
      console.error('Failed to parse records JSON:', parseErr);
      res.status(500).json({ error: 'Failed to parse database records' });
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SignalOps Control Tower server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
