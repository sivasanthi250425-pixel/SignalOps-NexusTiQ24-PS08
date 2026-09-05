import React from 'react';
import { RefreshCw, ArrowUpRight, Activity, Layers, Sparkles } from 'lucide-react';
import { DecisionHorizon } from '../types';

interface TopHeaderProps {
  horizon: DecisionHorizon;
  onReset: () => void;
  hasActiveAnalysis: boolean;
  onNewAnalysisClick: () => void;
  hasImpact?: boolean;
  activeShipmentId?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  horizon,
  onReset,
  hasActiveAnalysis,
  onNewAnalysisClick,
  hasImpact = true,
  activeShipmentId,
}) => {
  return (
    <header
      id="signalops-header"
      className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#e7e5e4] px-4 sm:px-6 py-3 select-none transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#18181b] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-[#f97316] transition-colors">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h5l3 7 4-14 3 7h5" />
              </svg>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base tracking-tight text-[#18181b]">
                  SignalOps
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                  v2.6
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Live Case Status Pill */}
        <div className="flex items-center">
          {hasActiveAnalysis ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#ffffff] border border-[#e4e4e7] shadow-xs">
              {hasImpact ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]"></span>
                  </span>
                  <span className="text-[#18181b] font-medium">
                    Investigation Active
                  </span>
                  <span className="text-[#a1a1aa]">·</span>
                  <span className="font-mono text-[#71717a] text-[11px]">
                    {activeShipmentId || 'CRITICAL SHORTAGE'}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
                  <span className="text-[#18181b] font-medium">
                    Zero Operational Deficit
                  </span>
                  <span className="text-[#a1a1aa]">·</span>
                  <span className="text-[#71717a] text-[11px]">Fully Buffered</span>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-[#71717a] bg-[#ffffff] border border-[#e4e4e7] shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
              <span>Intake Ready · Supply Chain Graph Engine Online</span>
            </div>
          )}
        </div>

        {/* Right: Track Badge & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
            <Layers className="w-3.5 h-3.5 text-[#71717a]" />
            <span>NexusTiQ24 · PS08</span>
          </div>

          {hasActiveAnalysis && (
            <button
              id="btn-new-intake"
              onClick={onNewAnalysisClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#18181b] bg-[#ffffff] hover:bg-[#f4f4f5] border border-[#d4d4d8] rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <span>New Intake</span>
            </button>
          )}

          <button
            id="btn-reset-view"
            onClick={onReset}
            title="Reset workspace"
            className="p-1.5 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] border border-transparent hover:border-[#e4e4e7] transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
