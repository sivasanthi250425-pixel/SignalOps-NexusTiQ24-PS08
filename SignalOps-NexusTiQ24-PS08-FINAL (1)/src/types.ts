export type RiskSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export type DecisionHorizon = '7D' | '14D' | '30D' | '60D';

export interface ExtractedFact {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface DisruptionSignal {
  rawNotice: string;
  sourceType: 'Carrier Notice' | 'Supplier Email' | 'Warehouse Incident' | 'Port Advisory' | 'Customs Alert';
  incidentTitle: string;
  carrierOrFacility?: string;
  supplierName: string;
  supplierId: string;
  shipmentId?: string;
  skuAffected: string;
  skuName: string;
  delayDurationDays: number;
  originalEta?: string;
  revisedEta?: string;
  extractedFacts: ExtractedFact[];
}

export interface ImpactNode {
  id: string;
  type: 'SUPPLIER' | 'SHIPMENT' | 'INVENTORY' | 'ORDER' | 'CUSTOMER';
  title: string;
  subtitle: string;
  dataValue: string;
  status: 'DISRUPTED' | 'AT_RISK' | 'BUFFERED' | 'NORMAL';
  evidenceDetails: {
    label: string;
    value: string;
    note?: string;
  }[];
}

export interface ImpactEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ImpactSummaryMetrics {
  unitsAtRisk: number;
  ordersAffected: number;
  customersAffected: number;
  earliestDeliveryRiskDate: string;
  totalFinancialExposure: string;
  hasOperationalImpact: boolean;
  onHandQty?: number;
  safetyStockThreshold?: number;
  safetyStockDeficit?: number;
  customerDemand?: number;
  shortageAgainstDemand?: number;
  immediateShortfall?: number;
}

export interface OperationalUncertainty {
  hasUncertainty: boolean;
  factor: string;
  variance: string;
  impact: string;
}

export interface EvidenceStep {
  stepNumber: number;
  dataPoint: string;
  reference: string;
  metric: string;
  deduction: string;
}

export interface AffectedOrder {
  priority: 'P1' | 'P2' | 'P3';
  orderId: string;
  customerName: string;
  requiredQty: number;
  allocatedQty: number;
  shortfallQty: number;
  promiseDate: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  slaPenaltyPerDay: number;
  tier: string;
}

export interface DecisionOption {
  id: string;
  title: string;
  actionType: 'EXPEDITE' | 'PART-SHIP' | 'REALLOCATE' | 'HOLD';
  isRecommended: boolean;
  description: string;
  financialCost: string;
  leadTimeImpact: string;
  customerDelayImpact: string;
  tradeOffs: {
    pros: string[];
    cons: string[];
  };
  operationalRisk: 'Low' | 'Moderate' | 'High';
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  decisionHorizon: DecisionHorizon;
  hasOperationalImpact: boolean;
  noImpactExplanation?: string;
  disruptionSignal: DisruptionSignal;
  impactSummary: ImpactSummaryMetrics;
  impactChain: {
    nodes: ImpactNode[];
    edges: ImpactEdge[];
  };
  evidenceTrail: EvidenceStep[];
  affectedOrders: AffectedOrder[];
  recommendedAction: DecisionOption;
  alternativeActions: DecisionOption[];
  operationalUncertainty?: OperationalUncertainty;
  approvalState: {
    approved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    authorizedActionId?: string;
  };
}
