import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Clock,
  Users,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { DecisionOption, RiskSeverity } from '../types';

interface DecisionPanelProps {
  severity: RiskSeverity;
  recommendedAction: DecisionOption;
  alternativeActions: DecisionOption[];
  onApproveAction: (actionId: string, operatorName: string, notes: string) => void;
  approvalState: {
    approved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    authorizedActionId?: string;
  };
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  severity,
  recommendedAction,
  alternativeActions,
  onApproveAction,
  approvalState,
}) => {
  const [selectedActionId, setSelectedActionId] = useState<string>(recommendedAction.id);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [operatorName, setOperatorName] = useState('Alex Morgan (Supply Lead)');
  const [notes, setNotes] = useState('Approved charter allocation to preserve Tier-1 customer SLA.');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const allActions = [recommendedAction, ...alternativeActions];
  const activeAction = allActions.find((a) => a.id === selectedActionId) || recommendedAction;

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      onApproveAction(activeAction.id, operatorName, notes);
      setIsAuthorizing(false);
      setShowApprovalModal(false);
    }, 450);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#f0eee9] bg-[#fdfdfc] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#f97316]/10 text-[#ea580c] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#18181b]">
              AI Decision & Response Strategy
            </h2>
          </div>
        </div>

        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
          {severity === 'CRITICAL' ? 'Immediate Mitigation Required' : 'Standard Advisory'}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Recommended Action Hero Block */}
        <div
          onClick={() => setSelectedActionId(recommendedAction.id)}
          className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
            selectedActionId === recommendedAction.id
              ? 'bg-[#faf9f6] border-[#18181b] ring-1 ring-[#18181b] shadow-xs'
              : 'bg-white border-[#e4e4e7] hover:border-[#d4d4d8]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#ea580c] text-white">
                Recommended Response
              </span>
              <span className="text-xs font-semibold text-[#71717a]">
                Highest SLA Preservation
              </span>
            </div>

            <span className="text-xs font-medium text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded border border-[#bbf7d0]">
              Low Operational Risk
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-[#18181b] mt-1">
            {recommendedAction.title}
          </h3>

          <p className="text-xs text-[#52525b] mt-2 leading-relaxed">
            {recommendedAction.description}
          </p>

          {/* 3 Strong Metrics: Cost, Expected recovery, Customer impact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#e7e5e4]">
            <div className="p-2.5 rounded-lg bg-white border border-[#e4e4e7]">
              <span className="text-[10.5px] font-medium text-[#71717a] block">Financial Delta</span>
              <span className="text-sm font-bold text-[#ea580c] mt-0.5 block">
                {recommendedAction.financialCost}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#e4e4e7]">
              <span className="text-[10.5px] font-medium text-[#71717a] block">Expected Recovery</span>
              <span className="text-sm font-bold text-[#18181b] mt-0.5 block">
                {recommendedAction.leadTimeImpact}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#e4e4e7]">
              <span className="text-[10.5px] font-medium text-[#71717a] block">Customer Impact</span>
              <span className="text-sm font-bold text-[#16a34a] mt-0.5 block">
                {recommendedAction.customerDelayImpact}
              </span>
            </div>
          </div>

          {/* Trade-offs pill row */}
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {recommendedAction.tradeOffs.pros.map((pro, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]">
                ✓ {pro}
              </span>
            ))}
          </div>
        </div>

        {/* Two Smaller Alternatives */}
        {alternativeActions.length > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#71717a] uppercase tracking-wider block">
              Evaluated Alternatives & Trade-Offs
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternativeActions.map((alt) => {
                const isSelected = selectedActionId === alt.id;
                return (
                  <div
                    key={alt.id}
                    onClick={() => setSelectedActionId(alt.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#faf9f6] border-[#18181b] ring-1 ring-[#18181b]'
                        : 'bg-white border-[#e4e4e7] hover:border-[#d4d4d8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-[#18181b]">
                        {alt.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f4f4f5] text-[#71717a] font-medium">
                        {alt.actionType}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#71717a] line-clamp-2 leading-relaxed">
                      {alt.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-[#f4f4f5] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#a1a1aa] block">Cost</span>
                        <span className="font-semibold text-[#18181b]">{alt.financialCost}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#a1a1aa] block">Customer Delay</span>
                        <span className="font-semibold text-[#ea580c]">{alt.customerDelayImpact}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Authorization Action Card */}
        <div className="pt-2">
          {approvalState.approved ? (
            <div className="p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#14532d]">
                    Mitigation Plan Authorized & Dispatched
                  </div>
                  <div className="text-[11px] text-[#15803d]">
                    Authorized by {approvalState.approvedBy} · {approvalState.approvedAt?.substring(0, 19).replace('T', ' ')}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-medium px-2 py-0.5 bg-white text-[#166534] rounded border border-[#86efac]">
                LEDGER STAMP: OK
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-[#faf9f6] border border-[#e4e4e7]">
              <div>
                <div className="text-xs font-semibold text-[#18181b]">
                  Response Execution Requires Confirmation
                </div>
                <div className="text-xs text-[#71717a]">
                  Selected plan: <span className="font-medium text-[#18181b]">{activeAction.title}</span>
                </div>
              </div>

              <button
                id="btn-authorize-plan"
                onClick={() => setShowApprovalModal(true)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-medium bg-[#18181b] hover:bg-[#27272a] text-white transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#f97316]" />
                <span>Authorize Response</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modern Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e4e4e7] shadow-xl space-y-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#18181b] text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#18181b]">
                  Authorize Mitigation Plan
                </h4>
                <p className="text-xs text-[#71717a]">
                  SignalOps Supply Chain Control Tower
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e4e4e7] text-xs space-y-1">
              <div className="text-[#71717a]">Action: <span className="font-semibold text-[#18181b]">{activeAction.title}</span></div>
              <div className="text-[#71717a]">Budget authorization: <span className="font-semibold text-[#ea580c]">{activeAction.financialCost}</span></div>
              <div className="text-[#71717a]">Protection: <span className="font-semibold text-[#16a34a]">{activeAction.customerDelayImpact}</span></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#52525b] block mb-1">Authorizing Lead</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e4e4e7] text-xs outline-none focus:border-[#18181b]"
                />
              </div>

              <div>
                <label className="font-medium text-[#52525b] block mb-1">Authorization Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e4e4e7] text-xs outline-none focus:border-[#18181b]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-[#52525b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAuthorize}
                disabled={isAuthorizing}
                className="px-5 py-2 rounded-lg text-xs font-medium bg-[#18181b] hover:bg-[#27272a] text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isAuthorizing ? (
                  <span>Signing ledger...</span>
                ) : (
                  <>
                    <span>Confirm & Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
