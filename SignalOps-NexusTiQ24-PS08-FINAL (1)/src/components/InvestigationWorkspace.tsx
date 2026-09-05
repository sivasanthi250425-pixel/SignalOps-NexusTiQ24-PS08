import React, { useState } from 'react';
import { ArrowLeft, Printer, RefreshCw, Layers, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { AnalysisResult, DecisionHorizon } from '../types';
import { ImpactSummaryBar } from './ImpactSummaryBar';
import { ImpactChainGraph } from './ImpactChainGraph';
import { DecisionPanel } from './DecisionPanel';
import { EvidenceTrail } from './EvidenceTrail';
import { DisruptionSignalCard } from './DisruptionSignalCard';
import { PriorityQueueTable } from './PriorityQueueTable';
import { NoImpactBanner } from './NoImpactBanner';

interface InvestigationWorkspaceProps {
  analysis: AnalysisResult;
  onNewIntake: () => void;
  onHorizonChange: (horizon: DecisionHorizon) => void;
  onApproveAction: (actionId: string, operatorName: string, notes: string) => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  analysis,
  onNewIntake,
  onHorizonChange,
  onApproveAction,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    analysis.impactChain.nodes[1]?.id || analysis.impactChain.nodes[0]?.id || null
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6"
    >
      {/* Sub-toolbar: Minimal Navigation & Case Ref */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewIntake}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#52525b] hover:text-[#18181b] bg-white border border-[#e4e4e7] shadow-xs hover:bg-[#faf9f6] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Intake</span>
          </button>

          <span className="text-[#d4d4d8]">|</span>

          <div className="flex items-center gap-2 text-[#71717a]">
            <span>Case ID:</span>
            <span className="font-semibold text-[#18181b]">
              {analysis.disruptionSignal.shipmentId || 'SIG-ACTIVE'}
            </span>
            <span>·</span>
            <span>Horizon:</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#e4e4e7] font-semibold text-[#18181b]">
              {analysis.decisionHorizon}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#71717a] hover:text-[#18181b] bg-white border border-[#e4e4e7] shadow-xs hover:bg-[#faf9f6] transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4. Impact Summary: Modern metric cards */}
      <ImpactSummaryBar
        summary={analysis.impactSummary}
        hasOperationalImpact={analysis.hasOperationalImpact}
      />

      {/* 8. No-Impact State (if zero operational disruption) */}
      {!analysis.hasOperationalImpact ? (
        <NoImpactBanner
          explanation={analysis.noImpactExplanation}
          onIntakeNewNotice={onNewIntake}
        />
      ) : null}

      {/* 3. CENTER HERO: Visual Impact Network (The connected graph) */}
      <ImpactChainGraph
        nodes={analysis.impactChain.nodes}
        edges={analysis.impactChain.edges}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
      />

      {/* 5. AI Decision Panel + Disruption Signal in a balanced 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <DecisionPanel
            severity={analysis.hasOperationalImpact ? 'CRITICAL' : 'NONE'}
            recommendedAction={analysis.recommendedAction}
            alternativeActions={analysis.alternativeActions}
            onApproveAction={onApproveAction}
            approvalState={analysis.approvalState}
          />
        </div>

        <div className="lg:col-span-4">
          <DisruptionSignalCard signal={analysis.disruptionSignal} />
        </div>
      </div>

      {/* 6. & 7. Interactive Evidence Trail & Explanation */}
      <EvidenceTrail
        evidenceTrail={analysis.evidenceTrail}
        hasOperationalImpact={analysis.hasOperationalImpact}
        onSelectNode={setSelectedNodeId}
      />

      {/* Customer Orders Priority Queue (Only when impact exists) */}
      {analysis.hasOperationalImpact && analysis.affectedOrders.length > 0 && (
        <PriorityQueueTable orders={analysis.affectedOrders} />
      )}
    </motion.div>
  );
};
