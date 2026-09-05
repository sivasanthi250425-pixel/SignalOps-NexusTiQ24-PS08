import React from 'react';
import { ArrowRight, Clock, Sparkles, FileText } from 'lucide-react';
import { DecisionHorizon } from '../types';
import { PRESET_DISRUPTIONS } from '../data/mockSupplyChain';

interface NewInvestigationPageProps {
  noticeText: string;
  onNoticeChange: (text: string) => void;
  decisionHorizon: DecisionHorizon;
  onHorizonChange: (horizon: DecisionHorizon) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const NewInvestigationPage: React.FC<NewInvestigationPageProps> = ({
  noticeText,
  onNoticeChange,
  decisionHorizon,
  onHorizonChange,
  onAnalyze,
  isAnalyzing,
}) => {
  const horizonOptions: { id: DecisionHorizon; label: string }[] = [
    { id: '7D', label: '7 days' },
    { id: '14D', label: '14 days' },
    { id: '30D', label: '30 days' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Top Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#18181b]">
          New Investigation
        </h1>
        <p className="text-sm text-[#71717a]">
          Describe the disruption or paste raw communication to calculate downstream supply chain impact.
        </p>
      </div>

      {/* Main Composer Box */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-sm overflow-hidden focus-within:border-[#18181b] focus-within:ring-1 focus-within:ring-[#18181b] transition-all">
        {/* Preset Quick Select bar */}
        <div className="px-4 py-2.5 bg-[#faf9f7] border-b border-[#f0eee9] flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-medium text-[#71717a] shrink-0">
            Quick Templates:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {PRESET_DISRUPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onNoticeChange(p.noticeText)}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white hover:bg-[#eae8e3] text-[#52525b] hover:text-[#18181b] border border-[#e4e4e7] transition-colors shrink-0 cursor-pointer"
              >
                {p.id === 'typhoon-sh102'
                  ? 'Port Typhoon (SH-102)'
                  : p.id === 'foundry-incident'
                  ? 'Smelter Outage (SH-108)'
                  : p.id === 'customs-hold'
                  ? 'Customs Hold (SH-114)'
                  : 'Routine Maint (No Impact)'}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="p-4 sm:p-5">
          <textarea
            id="new-investigation-input"
            rows={10}
            value={noticeText}
            onChange={(e) => onNoticeChange(e.target.value)}
            placeholder="Describe the disruption... Paste an email, carrier EDI memo, port notice, supplier force majeure alert, or customs hold notice."
            className="w-full text-sm text-[#18181b] placeholder:text-[#a1a1aa] bg-transparent outline-none resize-y leading-relaxed font-sans"
          />
        </div>

        {/* Footer controls */}
        <div className="px-4 py-3 bg-[#faf9f7] border-t border-[#f0eee9] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#71717a] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#a1a1aa]" />
              <span>Planning horizon:</span>
            </span>
            <div className="inline-flex rounded-lg bg-[#eae8e3] p-0.5">
              {horizonOptions.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => onHorizonChange(h.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    decisionHorizon === h.id
                      ? 'bg-white text-[#18181b] shadow-xs font-semibold'
                      : 'text-[#71717a] hover:text-[#18181b]'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || !noticeText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-[#18181b] text-white hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Deterministic Calculation...</span>
              </>
            ) : (
              <>
                <span>Analyze disruption</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/80" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
