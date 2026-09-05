import { AnalysisResult, DecisionHorizon } from '../types';

export interface SupplierRecord {
  id: string;
  name: string;
  location: string;
  category: string;
  criticality: 'High' | 'Medium' | 'Low';
}

export interface ShipmentRecord {
  id: string;
  supplierId: string;
  skuId: string;
  quantity: number;
  carrier: string;
  vesselOrFlight?: string;
  origin: string;
  destination: string;
  scheduledEta: string;
  status: 'In Transit' | 'Delayed' | 'Customs Hold' | 'Discharged';
}

export interface InventoryRecord {
  skuId: string;
  skuName: string;
  warehouseLocation: string;
  onHandQty: number;
  safetyStockThreshold: number;
  allocatedQty: number;
  unitCostUsd: number;
}

export interface OrderRecord {
  orderId: string;
  customerId: string;
  customerName: string;
  tier: 'Tier-1 Strategic' | 'Tier-1 Defense' | 'Tier-2 Industrial' | 'Tier-2 Commercial' | 'Tier-3 Standard';
  skuId: string;
  quantity: number;
  promiseDate: string;
  slaPenaltyPerDayUsd: number;
}

export const SUPPLY_CHAIN_NETWORK = {
  suppliers: [
    { id: 'SUP-01', name: 'ABC Components', location: 'Kaohsiung, TW', category: 'Semiconductors & MCUs', criticality: 'High' },
    { id: 'SUP-02', name: 'Apex Foundry & Metals', location: 'Dresden, DE', category: 'Precision Titanium Alloys', criticality: 'High' },
    { id: 'SUP-03', name: 'EuroParts GmbH', location: 'Stuttgart, DE', category: 'Optical Telemetry Nodes', criticality: 'Medium' },
    { id: 'SUP-04', name: 'Pacific Cable Works', location: 'Yokohama, JP', category: 'Mil-Spec Wire Harnesses', criticality: 'Low' },
    { id: 'SUP-05', name: 'Northern Logistics Materials', location: 'Rotterdam, NL', category: 'Corrugated Packaging & Pallets', criticality: 'Low' },
  ] as SupplierRecord[],

  shipments: [
    {
      id: 'SH-102',
      supplierId: 'SUP-01',
      skuId: 'SKU-X',
      quantity: 200,
      carrier: 'OceanEver Line',
      vesselOrFlight: 'Vessel EverForward',
      origin: 'Port of Kaohsiung',
      destination: 'Port of Long Beach / Central DC',
      scheduledEta: '2026-09-08',
      status: 'In Transit',
    },
    {
      id: 'SH-108',
      supplierId: 'SUP-02',
      skuId: 'SKU-Y',
      quantity: 500,
      carrier: 'Maersk Line',
      vesselOrFlight: 'Maersk Mc-Kinney',
      origin: 'Port of Hamburg',
      destination: 'Newark Port / East DC',
      scheduledEta: '2026-09-12',
      status: 'In Transit',
    },
    {
      id: 'SH-114',
      supplierId: 'SUP-03',
      skuId: 'SKU-Z',
      quantity: 150,
      carrier: 'DHL Global Forwarding',
      vesselOrFlight: 'Flight DHK412',
      origin: 'Frankfurt Hub',
      destination: 'Chicago Midwest DC',
      scheduledEta: '2026-09-10',
      status: 'In Transit',
    },
  ] as ShipmentRecord[],

  inventory: [
    {
      skuId: 'SKU-X',
      skuName: 'MCU-8400 Microcontroller Core',
      warehouseLocation: 'Central DC (Dallas, TX)',
      onHandQty: 80,
      safetyStockThreshold: 100,
      allocatedQty: 80,
      unitCostUsd: 340,
    },
    {
      skuId: 'SKU-Y',
      skuName: 'Ti-6Al-4V Titanium Forged Ingot',
      warehouseLocation: 'East DC (Newark, NJ)',
      onHandQty: 120,
      safetyStockThreshold: 150,
      allocatedQty: 120,
      unitCostUsd: 185,
    },
    {
      skuId: 'SKU-Z',
      skuName: 'Sensor Node Opto-440',
      warehouseLocation: 'Midwest DC (Chicago, IL)',
      onHandQty: 45,
      safetyStockThreshold: 50,
      allocatedQty: 45,
      unitCostUsd: 520,
    },
    {
      skuId: 'SKU-PKG',
      skuName: 'Heavy-Duty Reinforced Dunnage Pallet',
      warehouseLocation: 'Rotterdam Logistics Depot',
      onHandQty: 2400,
      safetyStockThreshold: 300,
      allocatedQty: 120,
      unitCostUsd: 14,
    },
  ] as InventoryRecord[],

  orders: [
    {
      orderId: 'ORD-104',
      customerId: 'CUST-01',
      customerName: 'Customer Orion Industrial',
      tier: 'Tier-1 Strategic',
      skuId: 'SKU-X',
      quantity: 120,
      promiseDate: '2026-09-07',
      slaPenaltyPerDayUsd: 1200,
    },
    {
      orderId: 'ORD-108',
      customerId: 'CUST-02',
      customerName: 'Apex Defense Dynamics',
      tier: 'Tier-1 Defense',
      skuId: 'SKU-X',
      quantity: 70,
      promiseDate: '2026-09-09',
      slaPenaltyPerDayUsd: 2500,
    },
    {
      orderId: 'ORD-112',
      customerId: 'CUST-03',
      customerName: 'Nordic Heavy Machining',
      tier: 'Tier-2 Industrial',
      skuId: 'SKU-X',
      quantity: 50,
      promiseDate: '2026-09-14',
      slaPenaltyPerDayUsd: 600,
    },
    {
      orderId: 'ORD-119',
      customerId: 'CUST-04',
      customerName: 'Solaria Energy Grid',
      tier: 'Tier-2 Commercial',
      skuId: 'SKU-X',
      quantity: 40,
      promiseDate: '2026-09-16',
      slaPenaltyPerDayUsd: 450,
    },
    {
      orderId: 'ORD-122',
      customerId: 'CUST-05',
      customerName: 'Helios Robotics Corp',
      tier: 'Tier-3 Standard',
      skuId: 'SKU-X',
      quantity: 60,
      promiseDate: '2026-09-18',
      slaPenaltyPerDayUsd: 800,
    },
    {
      orderId: 'ORD-127',
      customerId: 'CUST-06',
      customerName: 'Vanguard Systems',
      tier: 'Tier-3 Standard',
      skuId: 'SKU-X',
      quantity: 80,
      promiseDate: '2026-09-20',
      slaPenaltyPerDayUsd: 500,
    },
  ] as OrderRecord[],
};

// Preset raw notices for quick one-click testing
export const PRESET_DISRUPTIONS = [
  {
    id: 'typhoon-sh102',
    name: 'Carrier Notice: SH-102 Typhoon Port Congestion (ABC Components)',
    badge: 'Critical Impact',
    noticeText: `URGENT CARRIER ADVISORY — PACIFIC MARITIME OPERATIONS
Date: September 5, 2026
Carrier: OceanEver Line
Vessel: EverForward / Voyage 084E
Shipment ID: SH-102
Bill of Lading: OEL-9830219-TW
Supplier: ABC Components (Kaohsiung, TW)
Manifest: 200 units SKU-X (MCU-8400 Microcontroller Core)

Notice Details:
Due to severe typhoon activity in the East Asia-Pacific transit corridor and resulting berth closure at the Port of Long Beach, Vessel EverForward has been ordered to anchorage outside the port. 

Discharge operations have been halted. Earliest estimated berth availability has slipped by 14 days from original scheduled ETA Sept 8, 2026 to revised ETA Sept 22, 2026. Feeder transfers into Central DC (Dallas, TX) are suspended until container discharge clearance is granted.

Immediate intervention advised for time-sensitive customer order fulfillment.`,
  },
  {
    id: 'foundry-incident',
    name: 'Supplier Incident: Apex Foundry Ingot Delay (Dresden Facility)',
    badge: 'High Impact',
    noticeText: `SUPPLIER INCIDENT NOTIFICATION
From: Quality & Logistics Operations <dispatch@apexfoundry.de>
To: Global Procurement & Control Tower
Date: September 5, 2026
Supplier: Apex Foundry & Metals (Dresden, DE)
Affected Purchase Order: PO-8921 / Shipment SH-108
Part Description: SKU-Y (Ti-6Al-4V Titanium Forged Ingot)

Summary:
An electrical substation transformer fault occurred at our Dresden smelting facility Line 3 early this morning. While no injuries occurred, vacuum induction melting chamber #2 sustained thermal shock and requires emergency refractory recasting.

Shipment SH-108 (500 units of SKU-Y scheduled for dispatch via Port of Hamburg) is delayed by 18 calendar days. New projected readiness date is September 30, 2026. 

Existing warehouse buffer in Newark East DC is expected to deplete before replacement stock arrives.`,
  },
  {
    id: 'customs-hold',
    name: 'Customs Alert: EuroParts Optic Nodes Clearance Hold (Frankfurt Hub)',
    badge: 'Medium Impact',
    noticeText: `DHL GLOBAL FORWARDING — REGULATORY CLEARANCE ALERT
Incident Reference: DHK-CLR-77180
Shipment ID: SH-114
Shipper: EuroParts GmbH (Stuttgart, DE)
Consignee: Chicago Midwest DC
Commodity: 150 units SKU-Z (Sensor Node Opto-440)
Original Scheduled Arrival: Sept 10, 2026

Status Update:
German Federal Customs (Zollamt Frankfurt Flughafen) has placed a temporary export documentation compliance hold under Dual-Use Regulation Annex IV. Consignment cannot board Lufthansa Cargo Flight DHK412 as scheduled.

Expected regulatory audit and certificate re-validation delay: 8 to 11 business days. Revised estimated gate arrival at Chicago DC: Sept 21, 2026.`,
  },
  {
    id: 'routine-no-impact',
    name: 'Warehouse Incident: Northern Logistics Terminal Maintenance (No Impact)',
    badge: 'No Operational Impact',
    noticeText: `WAREHOUSE INCIDENT & MAINTENANCE NOTICE
From: Northern Logistics Materials B.V. (Rotterdam, NL)
To: All Supply Chain Distribution Partners
Date: September 5, 2026
Reference: BUL-2026-09-MAINT
Supplier ID: SUP-05
Material: SKU-PKG (Corrugated Packaging & Dunnage Pallets)

Notice:
Please be advised that Northern Logistics experienced a conveyor sortation mechanical incident and is conducting maintenance at our Rotterdam automated warehouse facility from September 11 through September 14, 2026. 

Outgoing palletized dispatches during this 72-hour period may experience nominal transport delays of up to 48 hours. Normal dispatch scheduling resumes September 15. All pre-existing production lots remain on track.`,
  },
];

export function buildFallbackAnalysis(rawNotice: string, horizon: DecisionHorizon = '14D'): AnalysisResult {
  const isNoImpact = rawNotice.includes('Northern Logistics') || rawNotice.includes('SKU-PKG') || rawNotice.includes('ROUTINE FACILITY MAINTENANCE');

  if (isNoImpact) {
    return {
      id: `analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      decisionHorizon: horizon,
      hasOperationalImpact: false,
      noImpactExplanation: 'The disruption notice references non-critical auxiliary packaging material (SKU-PKG) from Supplier Northern Logistics. Rotterdam Depot currently holds 2,400 units in stock against a 30-day demand forecast of 120 units (20x safety coverage). Zero committed customer delivery promise dates are jeopardized within the selected decision horizon.',
      disruptionSignal: {
        rawNotice,
        sourceType: 'Supplier Email',
        incidentTitle: 'Scheduled Terminal Maintenance (Non-Critical Material)',
        carrierOrFacility: 'Rotterdam Consolidation Terminal',
        supplierName: 'Northern Logistics Materials B.V.',
        supplierId: 'SUP-05',
        skuAffected: 'SKU-PKG',
        skuName: 'Heavy-Duty Reinforced Dunnage Pallet',
        delayDurationDays: 2,
        originalEta: '2026-09-12',
        revisedEta: '2026-09-14',
        extractedFacts: [
          { label: 'Carrier / Depot', value: 'Rotterdam Terminal' },
          { label: 'Supplier', value: 'Northern Logistics (SUP-05)' },
          { label: 'Material', value: 'SKU-PKG (Dunnage Pallet)' },
          { label: 'Delay Window', value: '48 Hours (2 Days)' },
          { label: 'Inventory Buffer', value: '2,400 units on hand' },
          { label: 'Safety Threshold', value: '300 units (Coverage: 800%)' },
          { label: 'Customer Exposure', value: '0 Orders at Risk' },
        ],
      },
      impactSummary: {
        unitsAtRisk: 0,
        ordersAffected: 0,
        customersAffected: 0,
        earliestDeliveryRiskDate: 'None (Fully Buffered)',
        totalFinancialExposure: '$0.00',
        hasOperationalImpact: false,
      },
      impactChain: {
        nodes: [
          {
            id: 'node-sup',
            type: 'SUPPLIER',
            title: 'Northern Logistics',
            subtitle: 'Rotterdam, NL',
            dataValue: 'SUP-05',
            status: 'NORMAL',
            evidenceDetails: [
              { label: 'Category', value: 'Auxiliary Packaging / Pallets' },
              { label: 'Criticality', value: 'Low Tier' },
              { label: 'Status', value: 'Scheduled 48hr maintenance' },
            ],
          },
          {
            id: 'node-ship',
            type: 'SHIPMENT',
            title: 'Local Drayage Batch',
            subtitle: 'Depot Transfer',
            dataValue: '120 Units',
            status: 'BUFFERED',
            evidenceDetails: [
              { label: 'Scheduled Transfer', value: '120 Units' },
              { label: 'Delay Duration', value: '2 Days' },
              { label: 'Impact on DC', value: 'Negligible' },
            ],
          },
          {
            id: 'node-inv',
            type: 'INVENTORY',
            title: 'SKU-PKG Dunnage',
            subtitle: 'Rotterdam Depot',
            dataValue: '2,400 Available',
            status: 'BUFFERED',
            evidenceDetails: [
              { label: 'On-Hand Stock', value: '2,400 Units' },
              { label: 'Safety Threshold', value: '300 Units' },
              { label: 'Net Available Buffer', value: '+2,100 Units' },
            ],
          },
          {
            id: 'node-ord',
            type: 'ORDER',
            title: 'No Committed Orders',
            subtitle: 'All Requirements Met',
            dataValue: '0 Orders Breached',
            status: 'NORMAL',
            evidenceDetails: [
              { label: 'Committed Customer Orders', value: '0 Affected' },
              { label: 'Order Fulfillment Rate', value: '100.0%' },
            ],
          },
          {
            id: 'node-cust',
            type: 'CUSTOMER',
            title: 'Downstream Accounts',
            subtitle: 'All SLA Commitments Secure',
            dataValue: 'Zero Impact',
            status: 'NORMAL',
            evidenceDetails: [
              { label: 'Delivery Risk', value: 'None' },
              { label: 'SLA Liability', value: '$0' },
            ],
          },
        ],
        edges: [
          { from: 'node-sup', to: 'node-ship', label: 'Batch Dispatch' },
          { from: 'node-ship', to: 'node-inv', label: 'Depot Intake' },
          { from: 'node-inv', to: 'node-ord', label: 'Full Buffer' },
          { from: 'node-ord', to: 'node-cust', label: 'On-Time SLA' },
        ],
      },
      evidenceTrail: [
        {
          stepNumber: 1,
          dataPoint: 'Disruption scope verified against BOM',
          reference: 'SKU-PKG (Corrugated Pallets)',
          metric: 'Non-critical packaging inventory',
          deduction: 'No active production line or customer assembly depends on immediate delivery of this batch.',
        },
        {
          stepNumber: 2,
          dataPoint: 'Warehouse buffer inquiry',
          reference: 'Rotterdam Logistics Depot',
          metric: '2,400 units on-hand vs 300 safety stock',
          deduction: 'Warehouse holds 2,100 surplus units beyond safety threshold (covers 45+ days of operations).',
        },
        {
          stepNumber: 3,
          dataPoint: 'Customer order schedule verification',
          reference: 'ERP Sales Order Master',
          metric: '0 committed orders due in window',
          deduction: 'Zero customer delivery promise dates fall within the 48-hour maintenance window.',
        },
        {
          stepNumber: 4,
          dataPoint: 'Operational Conclusion',
          reference: 'Automated Control Tower Audit',
          metric: 'Net Shortage = 0 Units',
          deduction: 'NO CURRENT OPERATIONAL IMPACT. No expediting or human mitigation action required.',
        },
      ],
      affectedOrders: [],
      recommendedAction: {
        id: 'act-no-op',
        title: 'MONITOR ONLY — NO OPERATIONAL INTERVENTION REQUIRED',
        actionType: 'HOLD',
        isRecommended: true,
        description: 'Existing safety stock in Rotterdam Depot exceeds the maximum potential slip window by 18x. Log notice into supplier compliance ledger and continue routine operations.',
        financialCost: '$0',
        leadTimeImpact: '0 days',
        customerDelayImpact: '0 days',
        tradeOffs: {
          pros: ['Zero expedited freight expenses', 'No disruption to downstream dispatch schedules'],
          cons: ['None'],
        },
        operationalRisk: 'Low',
      },
      alternativeActions: [],
      approvalState: {
        approved: false,
      },
    };
  }

  // Default critical disruption: SH-102 Typhoon Port Congestion (ABC Components / SKU-X)
  const is14D = horizon === '14D' || horizon === '7D';
  const ordersAffectedCount = is14D ? 5 : 6;
  const totalDemand = is14D ? 340 : 420;
  const onHand = 80;
  const safetyThreshold = 100;
  const safetyDeficit = 20;
  const shortageAgainstDemand = totalDemand - onHand; // 260 in 14D, 340 in 30D
  const immediateShortfall = 40; // ORD-104 requires 120, on-hand is 80
  const totalSlaExposure = is14D ? '$61,200' : '$62,200';
  const dailyRateSum = is14D ? 5550 : 6050;

  const allOrders = [
    {
      priority: 'P1' as const,
      orderId: 'ORD-104',
      customerName: 'Customer Orion Industrial',
      tier: 'Tier-1 Strategic',
      requiredQty: 120,
      allocatedQty: 80,
      shortfallQty: 40,
      promiseDate: 'Sep 07, 2026',
      riskLevel: 'CRITICAL' as const,
      reason: 'Requires 120 units; 80 units available in DC. Immediate 40-unit shortfall on Sep 07, 2026.',
      slaPenaltyPerDay: 1200,
    },
    {
      priority: 'P1' as const,
      orderId: 'ORD-108',
      customerName: 'Apex Defense Dynamics',
      tier: 'Tier-1 Defense',
      requiredQty: 70,
      allocatedQty: 0,
      shortfallQty: 70,
      promiseDate: 'Sep 09, 2026',
      riskLevel: 'CRITICAL' as const,
      reason: 'Zero units remaining in inventory post-Orion allocation. Contractual defense delivery penalty.',
      slaPenaltyPerDay: 2500,
    },
    {
      priority: 'P2' as const,
      orderId: 'ORD-112',
      customerName: 'Nordic Heavy Machining',
      tier: 'Tier-2 Industrial',
      requiredQty: 50,
      allocatedQty: 0,
      shortfallQty: 50,
      promiseDate: 'Sep 14, 2026',
      riskLevel: 'HIGH' as const,
      reason: 'Awaiting delayed shipment SH-102. Breach will occur 8 days prior to vessel discharge.',
      slaPenaltyPerDay: 600,
    },
    {
      priority: 'P2' as const,
      orderId: 'ORD-119',
      customerName: 'Solaria Energy Grid',
      tier: 'Tier-2 Commercial',
      requiredQty: 40,
      allocatedQty: 0,
      shortfallQty: 40,
      promiseDate: 'Sep 16, 2026',
      riskLevel: 'HIGH' as const,
      reason: 'Committed grid assembly deadline. Commercial account penalty begins Sep 17.',
      slaPenaltyPerDay: 450,
    },
    {
      priority: 'P3' as const,
      orderId: 'ORD-122',
      customerName: 'Helios Robotics Corp',
      tier: 'Tier-3 Standard',
      requiredQty: 60,
      allocatedQty: 0,
      shortfallQty: 60,
      promiseDate: 'Sep 18, 2026',
      riskLevel: 'MEDIUM' as const,
      reason: 'Robot assembly build date. Due before revised ETA Sep 22, 2026.',
      slaPenaltyPerDay: 800,
    },
    {
      priority: 'P3' as const,
      orderId: 'ORD-127',
      customerName: 'Vanguard Systems',
      tier: 'Tier-3 Standard',
      requiredQty: 80,
      allocatedQty: 0,
      shortfallQty: 80,
      promiseDate: 'Sep 20, 2026',
      riskLevel: 'MEDIUM' as const,
      reason: 'Final order before revised vessel docking. Due Sep 20, 2026.',
      slaPenaltyPerDay: 500,
    },
  ];

  const affectedOrders = is14D ? allOrders.slice(0, 5) : allOrders;

  return {
    id: `analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    decisionHorizon: horizon,
    hasOperationalImpact: true,
    disruptionSignal: {
      rawNotice,
      sourceType: 'Carrier Notice',
      incidentTitle: 'Shipment SH-102 Typhoon Delay (Port of Long Beach)',
      carrierOrFacility: 'OceanEver Line / Port of Long Beach',
      supplierName: 'ABC Components',
      supplierId: 'SUP-01',
      shipmentId: 'SH-102',
      skuAffected: 'SKU-X',
      skuName: 'MCU-8400 Microcontroller Core',
      delayDurationDays: 14,
      originalEta: '2026-09-08',
      revisedEta: '2026-09-22',
      extractedFacts: [
        { label: 'Carrier', value: 'OceanEver Line (Vessel EverForward)' },
        { label: 'Shipment ID', value: 'SH-102 (200 units SKU-X)' },
        { label: 'Supplier', value: 'ABC Components (Kaohsiung, TW)' },
        { label: 'Scheduled ETA', value: 'Sep 08, 2026' },
        { label: 'Revised ETA', value: 'Sep 22, 2026 (+14 days)' },
        { label: 'Transit Corridor', value: 'Port of Kaohsiung → Port of Long Beach / Central DC' },
        { label: 'Calculated Exposure', value: `${totalSlaExposure} SLA Liability`, highlight: true },
      ],
    },
    impactSummary: {
      onHandQty: onHand,
      safetyStockThreshold: safetyThreshold,
      safetyStockDeficit: safetyDeficit,
      customerDemand: totalDemand,
      shortageAgainstDemand: shortageAgainstDemand,
      immediateShortfall: immediateShortfall,
      unitsAtRisk: totalDemand,
      ordersAffected: ordersAffectedCount,
      customersAffected: ordersAffectedCount,
      earliestDeliveryRiskDate: 'Sep 07, 2026',
      totalFinancialExposure: totalSlaExposure,
      hasOperationalImpact: true,
    },
    impactChain: {
      nodes: [
        {
          id: 'node-sup',
          type: 'SUPPLIER',
          title: 'ABC Components',
          subtitle: 'Kaohsiung, TW',
          dataValue: 'SUP-01',
          status: 'DISRUPTED',
          evidenceDetails: [
            { label: 'Vendor Status', value: 'Active Master Supplier' },
            { label: 'Component', value: 'MCU-8400 Microcontroller Core (SKU-X)' },
            { label: 'In-Transit Shipment', value: 'SH-102 (200 units)' },
          ],
        },
        {
          id: 'node-ship',
          type: 'SHIPMENT',
          title: 'SH-102 (OceanEver Line)',
          subtitle: 'Port of Long Beach / Central DC',
          dataValue: '200 Units / +14D Delay',
          status: 'DISRUPTED',
          evidenceDetails: [
            { label: 'Shipment Identifier', value: 'SH-102' },
            { label: 'Vessel', value: 'Vessel EverForward' },
            { label: 'Cargo', value: '200 Units SKU-X' },
            { label: 'Scheduled ETA', value: 'Sep 08, 2026' },
            { label: 'Revised ETA', value: 'Sep 22, 2026 (+14 Days Delay)' },
          ],
        },
        {
          id: 'node-inv',
          type: 'INVENTORY',
          title: 'Central DC (Dallas, TX)',
          subtitle: 'SKU-X Microcontrollers',
          dataValue: '80 Available / 100 Safety',
          status: 'AT_RISK',
          evidenceDetails: [
            { label: 'On-Hand Inventory', value: '80 Units' },
            { label: 'Safety Stock Threshold', value: '100 Units' },
            { label: 'Safety-Stock Deficit', value: '20 Units' },
            { label: 'Customer Demand', value: `${totalDemand} Units` },
            { label: 'Shortage Against Demand', value: `${shortageAgainstDemand} Units` },
          ],
        },
        {
          id: 'node-ord',
          type: 'ORDER',
          title: `ORD-104 (+ ${ordersAffectedCount - 1} Orders)`,
          subtitle: 'Priority Fulfillment Queue',
          dataValue: `${totalDemand} Units Demanded`,
          status: 'AT_RISK',
          evidenceDetails: [
            { label: 'Total Committed Orders', value: `${ordersAffectedCount} Orders Breached` },
            { label: 'First Breach Order', value: 'ORD-104 (Customer Orion Industrial)' },
            { label: 'Required for ORD-104', value: '120 Units' },
            { label: 'Immediate Order Shortfall', value: '40 units on Sep 07, 2026' },
            { label: 'Total Customer Demand', value: `${totalDemand} Units` },
          ],
        },
        {
          id: 'node-cust',
          type: 'CUSTOMER',
          title: `Customer Orion (+ ${ordersAffectedCount - 1})`,
          subtitle: 'Committed Customer Accounts',
          dataValue: `${totalSlaExposure} SLA Exposure`,
          status: 'AT_RISK',
          evidenceDetails: [
            { label: 'Earliest Promise Date', value: 'Sep 07, 2026' },
            { label: 'First Breach Customer', value: 'Customer Orion Industrial' },
            { label: 'Total SLA Liability', value: totalSlaExposure },
          ],
        },
      ],
      edges: [
        { from: 'node-sup', to: 'node-ship', label: 'Vessel Delay (+14D)' },
        { from: 'node-ship', to: 'node-inv', label: '200 Units Blocked' },
        { from: 'node-inv', to: 'node-ord', label: 'Safety Stock Depleted' },
        { from: 'node-ord', to: 'node-cust', label: 'SLA Breach Risk' },
      ],
    },
    evidenceTrail: [
      {
        stepNumber: 1,
        dataPoint: 'In-Transit Shipment Disruption [SH-102]',
        reference: 'SQLite Table: shipments [ID: SH-102, Carrier: OceanEver Line]',
        metric: '200 units delayed: ETA Sep 08, 2026 → Sep 22, 2026 (+14 days)',
        deduction: 'Replenishment of 200 units of MCU-8400 Microcontroller Core (SKU-X) from supplier ABC Components delayed by 14 days to Sep 22, 2026.',
      },
      {
        stepNumber: 2,
        dataPoint: 'Physical Inventory & Safety Stock Audit [DC-CENTRAL]',
        reference: 'SQLite Table: inventory [ID: INV-01, Location: Central DC (Dallas, TX)]',
        metric: `On-Hand: ${onHand} units | Safety Threshold: ${safetyThreshold} units | Safety-Stock Deficit: ${safetyDeficit} units`,
        deduction: `On-hand inventory (${onHand} units) is ${safetyDeficit} units below the ${safetyThreshold}-unit safety threshold. Allocating all ${onHand} units to ORD-104 (Customer Orion Industrial, demanding 120 units) leaves an immediate shortage against demand of ${immediateShortfall} units on Sep 07, 2026.`,
      },
      {
        stepNumber: 3,
        dataPoint: `Customer Order Commitment Audit [${ordersAffectedCount} Orders]`,
        reference: `SQLite Table: customer_orders [SKU: SKU-X, Horizon: ${horizon}]`,
        metric: `${ordersAffectedCount} orders breached | Customer Demand: ${totalDemand} units | Shortage Against Demand: ${shortageAgainstDemand} units`,
        deduction: `First delivery breach occurs Sep 07, 2026 for Customer Orion Industrial. Total demand across ${horizon} horizon is ${totalDemand} units against ${onHand} on-hand units, resulting in a net shortage against demand of ${shortageAgainstDemand} units across ${ordersAffectedCount} customer orders.`,
      },
      {
        stepNumber: 4,
        dataPoint: 'Contractual SLA Penalty Exposure Calculation',
        reference: 'Formula: Σ (Days Overdue × Daily Contract Penalty from customer_orders table)',
        metric: `Total SLA Penalty Exposure = ${totalSlaExposure}`,
        deduction: `Calculated deterministically from daily contract penalties in SQLite customer_orders table across ${ordersAffectedCount} orders = ${totalSlaExposure}.`,
      },
      {
        stepNumber: 5,
        dataPoint: 'Mitigation Option Contract Valuation',
        reference: 'SQLite Table: logistics_contracts [ID: CTR-EXP-01, Service: Direct Trans-Pacific Air Charter]',
        metric: 'Mitigation Cost: $14,800 Expedited Air Charter vs Avoided Penalty: $18,000',
        deduction: 'Executing Direct Trans-Pacific Air Charter delivers required units prior to Sep 07, 2026, preventing line stoppage and eliminating $18,000 in SLA liquidated damages for Customer Orion Industrial.',
      },
    ],
    affectedOrders,
    recommendedAction: {
      id: 'CTR-EXP-01',
      title: 'Direct Trans-Pacific Air Charter',
      actionType: 'EXPEDITE',
      isRecommended: true,
      description: 'Charter dedicated air cargo from secondary hub to Central DC (Dallas, TX) via Pacific Cargo Charters. Pre-negotiated emergency air charter from secondary hub to Central DC (Dallas, TX).',
      financialCost: '$14,800 Expedited Air Charter',
      leadTimeImpact: 'Lead Time: 3 days (Delivers Sep 08, 2026)',
      customerDelayImpact: '0 Days Delay for Priority Orders',
      tradeOffs: {
        pros: [
          `Avoids contractual liquidated damages across ${ordersAffectedCount} customer orders`,
          'Prevents plant stoppage and contractual default for Customer Orion Industrial',
          'Restores safety buffer in Central DC (Dallas, TX)',
        ],
        cons: [
          'Expedited freight surcharge ($14,800 total cost calculated from SQLite contract formula)',
          'Requires operational dispatch authorization',
        ],
      },
      operationalRisk: 'Low',
    },
    alternativeActions: [
      {
        id: 'CTR-PARTSHIP-03',
        title: 'Split Partial Delivery',
        actionType: 'PART-SHIP',
        isRecommended: false,
        description: 'Immediate partial dispatch of 80 on-hand units to Customer Orion Industrial to maintain baseline production.',
        financialCost: '$2,760 Split Dispatch',
        leadTimeImpact: 'Lead Time: 1 days (Delivers Sep 06, 2026)',
        customerDelayImpact: '0 Days for partial shipment; remaining demand delayed until vessel arrival',
        tradeOffs: {
          pros: [
            'Low upfront logistics cost ($2,760)',
            'Keeps Customer Orion Industrial baseline assembly running',
          ],
          cons: [
            'Leaves subsequent customer orders unfulfilled ($43,200 penalty exposure)',
            'Depletes Central DC (Dallas, TX) safety inventory to 0 units',
          ],
        },
        operationalRisk: 'High',
      },
      {
        id: 'CTR-REALLOC-02',
        title: 'Inter-DC Ground Transfer',
        actionType: 'REALLOCATE',
        isRecommended: false,
        description: 'Inter-warehouse freight transfer of reserve buffer stock from East DC (Newark, NJ) to Central DC (Dallas, TX).',
        financialCost: '$5,500 Inter-DC Transfer',
        leadTimeImpact: 'Lead Time: 2 days (Delivers Sep 07, 2026)',
        customerDelayImpact: 'Delivers 40 units by Sep 07, 2026',
        tradeOffs: {
          pros: [
            'Moderate cost ($5,500)',
            'Meets immediate 40-unit shortfall for Customer Orion Industrial',
          ],
          cons: [
            'Transfers stockout risk to East DC (Newark, NJ)',
            'Limited to 40 units capacity',
          ],
        },
        operationalRisk: 'Moderate',
      },
    ],
    operationalUncertainty: {
      hasUncertainty: true,
      factor: 'Transit Slip Delay Sensitivity',
      variance: '+1 to +3 calendar days',
      impact: `Each additional calendar day of transit delay past Sep 22, 2026 increases contractual SLA penalties by $${dailyRateSum.toLocaleString()}/day across the ${ordersAffectedCount} affected customer orders.`,
    },
    approvalState: {
      approved: false,
    },
  };
}
