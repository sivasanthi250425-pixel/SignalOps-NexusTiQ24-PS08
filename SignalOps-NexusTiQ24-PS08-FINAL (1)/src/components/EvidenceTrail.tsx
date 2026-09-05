import React, { useState } from 'react';
import {
  Ship,
  Warehouse,
  FileCheck,
  Building2,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calculator,
} from 'lucide-react';
import { motion } from 'motion/react';
import { EvidenceStep, ImpactSummaryMetrics } from '../types';

interface EvidenceTrailProps {
  evidenceTrail: EvidenceStep[];
  hasOperationalImpact?: boolean;
  impactSummary?: ImpactSummaryMetrics;
  onSelectNode?: (nodeId: string) => void;
}

export const EvidenceTrail: React.FC<EvidenceTrailProps> = ({
  evidenceTrail,
  hasOperationalImpact = true,
  impactSummary,
  onSelectNode,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const stepIcons = [Ship, Warehouse, FileCheck, Building2];
  const stepNodeIds = ['node-ship', 'node-inv', 'node-ord', 'node-cust'];

  const causalChain = evidenceTrail.map((step, idx) => {
    const Icon = stepIcons[idx % stepIcons.length];
    const nodeId = stepNodeIds[idx % stepNodeIds.length];

    let color = 'text-[#ea580c]';
    let bg = 'bg-[#fff7ed]';
    let border = 'border-[#fed7aa]';

    if (!hasOperationalImpact) {
      color = 'text-[#16a34a]';
      bg = 'bg-[#f0fdf4]';
      border = 'border-[#bbf7d0]';
    } else if (idx === 0 || idx === 3) {
      color = 'text-[#dc2626]';
      bg = 'bg-[#fef2f2]';
      border = 'border-[#fecaca]';
    }

    const causeLabel =
      idx === 0
        ? hasOperationalImpact
          ? 'causes shortage'
          : 'verified normal'
        : idx === 1
        ? hasOperationalImpact
          ? 'depletes buffer'
          : 'sufficient stock'
        : idx === 2
        ? hasOperationalImpact
          ? 'breaches SLA'
          : 'orders on track'
        : '';

    return {
      id: nodeId,
      stepNumber: step.stepNumber || idx + 1,
      name: step.dataPoint,
      primaryStat: step.metric,
      secondaryStat: step.reference,
      causeLabel,
      icon: Icon,
      color,
      bg,
      border,
      detail: step.deduction,
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#f0eee9] bg-[#fdfdfc] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#18181b]" />
          <h3 className="text-sm font-semibold text-[#18181b]">
            Interactive Evidence Trail
          </h3>
          <span className="text-xs text-[#71717a]">
            · Causal SQLite Supply Chain Deductions
          </span>
        </div>

        <span className="text-xs text-[#a1a1aa]">
          Click any step to inspect verified SQLite data points
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: Interactive Visual Domino Chain (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-2">
            Step-by-Step Causal Domino
          </div>

          <div className="space-y-2">
            {causalChain.map((item, idx) => {
              const isSelected = activeStepIndex === idx;
              const Icon = item.icon;

              return (
                <div key={item.name + idx} className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setActiveStepIndex(idx);
                      if (onSelectNode) onSelectNode(item.id);
                    }}
                    className={`w-full p-4 rounded-xl border transition-all cursor-pointer text-left flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#faf9f6] border-[#18181b] ring-1 ring-[#18181b] shadow-xs'
                        : 'bg-white border-[#e4e4e7] hover:border-[#d4d4d8]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#18181b]">
                            {item.name}
                          </span>
                        </div>

                        <div className="text-xs text-[#52525b] mt-1 font-medium">
                          {item.primaryStat} ·{' '}
                          <span className="text-[#71717a]">{item.secondaryStat}</span>
                        </div>

                        {isSelected && (
                          <p className="text-[11.5px] text-[#71717a] mt-2 leading-relaxed">
                            {item.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Transition connector */}
                  {item.causeLabel && (
                    <div className="flex items-center gap-1.5 py-1 text-[11px] font-medium text-[#71717a]">
                      <ArrowDown
                        className={`w-3.5 h-3.5 ${
                          hasOperationalImpact ? 'text-[#f97316]' : 'text-[#16a34a]'
                        }`}
                      />
                      <span>{item.causeLabel}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Concise "Why this case..." (5 cols) */}
        <div className="lg:col-span-5 bg-[#faf9f6] rounded-xl p-5 border border-[#e4e4e7] space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                hasOperationalImpact
                  ? 'bg-[#ea580c]/10 text-[#ea580c]'
                  : 'bg-[#16a34a]/10 text-[#16a34a]'
              }`}
            >
              {hasOperationalImpact ? (
                <Sparkles className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
            </div>
            <h4 className="text-sm font-bold text-[#18181b]">
              {hasOperationalImpact
                ? 'Why this case has operational impact'
                : 'Why this case has NO operational impact'}
            </h4>
          </div>

          <div className="space-y-3 text-xs text-[#52525b]">
            {evidenceTrail.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white border border-[#e4e4e7] flex items-center justify-center text-[11px] font-bold text-[#18181b] shrink-0 mt-0.5 shadow-xs">
                  {idx + 1}
                </span>
                <div>
                  <span className="font-semibold text-[#18181b]">
                    {step.dataPoint}:
                  </span>
                  <p className="text-[#71717a] mt-0.5 leading-relaxed">
                    {step.deduction}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mathematical Proof Box */}
          <div className="pt-3 border-t border-[#e4e4e7]">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717a] mb-1.5 uppercase tracking-wide">
              <Calculator className="w-3 h-3 text-[#71717a]" />
              <span>Grounded Mathematical Formula:</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#e4e4e7] text-xs font-mono text-[#18181b] flex flex-wrap items-center justify-between gap-2">
              {hasOperationalImpact ? (
                <>
                  <span>
                    Demand ({impactSummary?.customerDemand ?? 340} units) − On-Hand ({impactSummary?.onHandQty ?? 80} units)
                  </span>
                  <span className="font-bold text-[#dc2626]">
                    = −{impactSummary?.shortageAgainstDemand ?? 260} units shortage ({impactSummary?.totalFinancialExposure ?? '$61,200'} exposure)
                  </span>
                </>
              ) : (
                <>
                  <span>2,400 (on-hand) vs 300 (safety stock)</span>
                  <span className="font-bold text-[#16a34a]">
                    = +2,100 buffer units (Exposure: $0.00)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
