import React, { useState } from 'react';
import { Radio, FileText, ChevronDown, ChevronUp, AlertCircle, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { DisruptionSignal } from '../types';

interface DisruptionSignalCardProps {
  signal: DisruptionSignal;
}

export const DisruptionSignalCard: React.FC<DisruptionSignalCardProps> = ({ signal }) => {
  const [showFullRaw, setShowFullRaw] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#f0eee9] bg-[#fdfdfc] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#ef4444]/10 text-[#dc2626] flex items-center justify-center">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-[#18181b]">
            Disruption Signal
          </h3>
        </div>

        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
          {signal.sourceType}
        </span>
      </div>

      <div className="p-5 space-y-4 flex-1 overflow-y-auto">
        {/* Incident Summary Card */}
        <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#e4e4e7]">
          <span className="text-[10.5px] font-medium text-[#71717a] uppercase tracking-wider block">
            Incident Identification
          </span>
          <h4 className="font-semibold text-xs text-[#18181b] mt-1 leading-snug">
            {signal.incidentTitle}
          </h4>
          {signal.carrierOrFacility && (
            <p className="text-xs text-[#52525b] mt-1">
              Node: <span className="font-medium text-[#18181b]">{signal.carrierOrFacility}</span>
            </p>
          )}
        </div>

        {/* Extracted Facts List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#71717a]">
            <span>Extracted Parameters</span>
            <span className="text-[10.5px] text-[#a1a1aa]">Parsed by AI</span>
          </div>

          <div className="divide-y divide-[#f4f4f5] text-xs">
            {signal.extractedFacts.map((fact, idx) => (
              <div
                key={idx}
                className={`py-2 flex items-center justify-between gap-3 ${
                  fact.highlight ? 'text-[#ea580c] font-semibold' : 'text-[#52525b]'
                }`}
              >
                <span className="text-[#71717a]">{fact.label}</span>
                <span className={`text-right font-medium ${fact.highlight ? 'text-[#ea580c]' : 'text-[#18181b]'}`}>
                  {fact.value}
                </span>
              </div>
            ))}

            {/* Delay Window Pill */}
            <div className="py-2 flex items-center justify-between gap-3 font-semibold text-[#ea580c]">
              <span>Slip Window</span>
              <span className="px-2 py-0.5 rounded-md bg-[#fff7ed] border border-[#fed7aa] text-xs">
                +{signal.delayDurationDays} Days Slip
              </span>
            </div>
          </div>
        </div>

        {/* Raw Signal Accordion */}
        <div className="pt-2 border-t border-[#f4f4f5]">
          <button
            onClick={() => setShowFullRaw(!showFullRaw)}
            className="w-full flex items-center justify-between text-xs font-medium text-[#71717a] hover:text-[#18181b] transition-colors py-1 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Original Notice Record</span>
            </div>
            {showFullRaw ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFullRaw && (
            <div className="mt-2 p-3 rounded-xl bg-[#faf9f6] border border-[#e4e4e7] text-[11px] font-mono text-[#52525b] leading-relaxed max-h-48 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono">{signal.rawNotice}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
