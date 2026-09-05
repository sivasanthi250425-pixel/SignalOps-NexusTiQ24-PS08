import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock, AlertCircle, FileText, CheckCircle2, ChevronRight, CornerDownLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { DecisionHorizon } from '../types';
import { PRESET_DISRUPTIONS } from '../data/mockSupplyChain';

interface DisruptionIntakeProps {
  noticeText: string;
  onNoticeChange: (text: string) => void;
  decisionHorizon: DecisionHorizon;
  onHorizonChange: (horizon: DecisionHorizon) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  error?: string | null;
}

export const DisruptionIntake: React.FC<DisruptionIntakeProps> = ({
  noticeText,
  onNoticeChange,
  decisionHorizon,
  onHorizonChange,
  onAnalyze,
  isAnalyzing,
  error,
}) => {
  const horizons: { id: DecisionHorizon; label: string; tag: string }[] = [
    { id: '7D', label: '7 Days', tag: 'Immediate' },
    { id: '14D', label: '14 Days', tag: 'Standard' },
    { id: '30D', label: '30 Days', tag: 'Tactical' },
    { id: '60D', label: '60 Days', tag: 'Quarterly' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-4 mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff] border border-[#e4e4e7] shadow-xs text-xs text-[#52525b]">
          <span className="flex h-2 w-2 rounded-full bg-[#f97316]"></span>
          <span className="font-medium text-[#18181b]">AI-Powered Supply Chain Investigation</span>
          <span className="text-[#a1a1aa]">·</span>
          <span>NexusTiQ24 PS08</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#18181b] leading-[1.1]">
          Trace the impact.<br />
          <span className="text-[#52525b] font-medium">Decide the response.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#71717a] max-w-2xl mx-auto leading-relaxed">
          Turn an unstructured disruption notice into an evidence-backed supply-chain response.
        </p>
      </motion.div>

      {/* Floating AI Investigation Workspace */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-[#e4e4e7] shadow-xl shadow-stone-200/50 overflow-hidden"
      >
        {/* Preset Signals Bar */}
        <div className="px-5 py-3.5 bg-[#fbfbfa] border-b border-[#f0eee9] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#71717a]">
            <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
            <span className="font-medium text-[#18181b]">Sample Disruption Signals:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_DISRUPTIONS.map((preset) => {
              const isActive = noticeText.includes(preset.id === 'typhoon-sh102' ? 'SH-102' : preset.id === 'routine-no-impact' ? 'Northern Logistics' : preset.id === 'apex-foundry' ? 'Apex Industrial' : 'Hamburg');
              return (
                <button
                  key={preset.id}
                  onClick={() => onNoticeChange(preset.noticeText)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    preset.id === 'routine-no-impact'
                      ? 'bg-[#ecfdf5] text-[#059669] hover:bg-[#d1fae5] border border-[#a7f3d0]'
                      : isActive
                      ? 'bg-[#18181b] text-white shadow-xs'
                      : 'bg-white text-[#52525b] hover:bg-[#f4f4f5] border border-[#e4e4e7]'
                  }`}
                >
                  {preset.id === 'typhoon-sh102' && '⚡ '}
                  {preset.id === 'routine-no-impact' ? '✓ No-Impact Case' : preset.name.split(':')[1]?.split('(')[0]?.trim() || preset.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea AI Workspace */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="relative">
            <textarea
              id="disruption-raw-input"
              rows={8}
              value={noticeText}
              onChange={(e) => onNoticeChange(e.target.value)}
              placeholder="Paste raw notice from carrier advisory, supplier email, port memo, or warehouse bulletin..."
              className="w-full p-4 text-sm text-[#18181b] bg-[#faf9f6]/70 focus:bg-white rounded-xl border border-[#e4e4e7] focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b] outline-none transition-all resize-y leading-relaxed font-sans placeholder:text-[#a1a1aa]"
            />
            <div className="flex items-center justify-between text-xs text-[#a1a1aa] px-1 mt-1.5">
              <span>Supports raw EDI 214, carrier memos, weather alerts, BOM IDs</span>
              <span className="font-mono text-[11px]">{noticeText.length} chars</span>
            </div>
          </div>

          {/* Controls: Horizon & Analyze */}
          <div className="pt-4 border-t border-[#f0eee9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Decision Horizon selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#52525b] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#71717a]" />
                <span>Planning Horizon:</span>
              </span>

              <div className="inline-flex rounded-xl bg-[#f4f4f5] p-1 border border-[#e4e4e7]">
                {horizons.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => onHorizonChange(h.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      decisionHorizon === h.id
                        ? 'bg-white text-[#18181b] shadow-xs'
                        : 'text-[#71717a] hover:text-[#18181b]'
                    }`}
                  >
                    <span>{h.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              id="btn-analyze-disruption"
              type="button"
              onClick={onAnalyze}
              disabled={isAnalyzing || !noticeText.trim()}
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                isAnalyzing || !noticeText.trim()
                  ? 'bg-[#e4e4e7] text-[#a1a1aa] cursor-not-allowed'
                  : 'bg-[#18181b] hover:bg-[#27272a] text-white shadow-md shadow-black/10 hover:shadow-lg active:scale-[0.99]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Tracing Impact Network...</span>
                </>
              ) : (
                <>
                  <span>Analyze Disruption</span>
                  <ArrowRight className="w-4 h-4 text-[#f97316]" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Feature Highlights beneath */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center sm:text-left">
        <div className="p-4 rounded-xl bg-white/60 border border-[#e7e5e4] shadow-xs">
          <div className="font-semibold text-xs text-[#18181b] flex items-center justify-center sm:justify-start gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
            Multi-Tier Dependency Tracing
          </div>
          <p className="text-xs text-[#71717a] mt-1 leading-relaxed">
            Connects vessel tracking, warehouse stock, BOM requirements, and sales orders in real-time.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/60 border border-[#e7e5e4] shadow-xs">
          <div className="font-semibold text-xs text-[#18181b] flex items-center justify-center sm:justify-start gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            Verifiable Mathematical Proof
          </div>
          <p className="text-xs text-[#71717a] mt-1 leading-relaxed">
            Every shortage is deduced step-by-step from physical inventory audits and delivery promise dates.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/60 border border-[#e7e5e4] shadow-xs">
          <div className="font-semibold text-xs text-[#18181b] flex items-center justify-center sm:justify-start gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
            Cost & SLA Response Trade-offs
          </div>
          <p className="text-xs text-[#71717a] mt-1 leading-relaxed">
            Evaluates charter expediting, buffer reallocation, and part-ship options with quantified financial deltas.
          </p>
        </div>
      </div>
    </div>
  );
};
