import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Layers,
  Search,
} from 'lucide-react';
import { motion } from 'motion/react';
import { DecisionHorizon } from '../types';
import { PRESET_DISRUPTIONS } from '../data/mockSupplyChain';

interface HomePageProps {
  noticeText: string;
  onNoticeChange: (text: string) => void;
  decisionHorizon: DecisionHorizon;
  onHorizonChange: (horizon: DecisionHorizon) => void;
  onAnalyze: (text?: string, horizon?: DecisionHorizon) => void;
  isAnalyzing: boolean;
  onSelectCase: (presetId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  noticeText,
  onNoticeChange,
  decisionHorizon,
  onHorizonChange,
  onAnalyze,
  isAnalyzing,
  onSelectCase,
}) => {
  const horizonOptions: { id: DecisionHorizon; label: string }[] = [
    { id: '7D', label: '7 days' },
    { id: '14D', label: '14 days' },
    { id: '30D', label: '30 days' },
  ];

  const examplePrompts = [
    {
      title: 'Carrier delay',
      tag: 'Carrier Delay',
      presetId: 'typhoon-sh102',
      snippet: 'Port congestion delaying vessel EverForward by 14 days (SH-102)',
    },
    {
      title: 'Supplier disruption',
      tag: 'Supplier Disruption',
      presetId: 'foundry-incident',
      snippet: 'Apex Foundry furnace outage in Dresden delaying SKU-Y by 18 days',
    },
    {
      title: 'Warehouse incident',
      tag: 'Warehouse Incident',
      presetId: 'routine-no-impact',
      snippet: 'Conveyor sortation overhaul at Northern Logistics warehouse (No Impact)',
    },
  ];

  const recentCases = [
    {
      id: 'case-01',
      presetId: 'typhoon-sh102',
      severity: 'Critical',
      severityClass: 'text-[#dc2626] bg-[#fef2f2] border-[#fecaca]',
      supplier: 'ABC Components',
      summary: '6 customer orders affected · $62,200 exposure',
      timeAgo: '12 min ago',
      shipment: 'SH-102',
    },
    {
      id: 'case-02',
      presetId: 'foundry-incident',
      severity: 'High',
      severityClass: 'text-[#ea580c] bg-[#fff7ed] border-[#fed7aa]',
      supplier: 'Apex Foundry & Metals',
      summary: '1 inbound shipment delayed 18 days (SKU-Y buffer low)',
      timeAgo: '2 hours ago',
      shipment: 'SH-108',
    },
    {
      id: 'case-03',
      presetId: 'customs-hold',
      severity: 'Medium',
      severityClass: 'text-[#ca8a04] bg-[#fefce8] border-[#fef08a]',
      supplier: 'EuroParts GmbH',
      summary: 'Customs regulatory review hold · 8-11 day gate delay',
      timeAgo: 'Yesterday',
      shipment: 'SH-114',
    },
    {
      id: 'case-04',
      presetId: 'routine-no-impact',
      severity: 'Resolved',
      severityClass: 'text-[#16a34a] bg-[#f0fdf4] border-[#bbf7d0]',
      supplier: 'Northern Logistics',
      summary: 'No operational impact · Safety inventory buffer intact',
      timeAgo: '2 days ago',
      shipment: 'SUP-05',
    },
  ];

  const activeRisks = [
    {
      title: 'Pacific Corridor Congestion',
      risk: 'High',
      desc: 'Port of Long Beach berth dwell time +14 days above scheduled ETA',
      impact: 'Correlated to SH-102',
    },
    {
      title: 'Central DC (Dallas) Microcontroller Stock',
      risk: 'Critical',
      desc: 'MCU-8400 buffer at 80 units vs. 100 minimum threshold',
      impact: 'Depletes Sept 7',
    },
  ];

  const handlePromptClick = (presetId: string) => {
    const preset = PRESET_DISRUPTIONS.find((p) => p.id === presetId);
    if (preset) {
      onNoticeChange(preset.noticeText);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      {/* 1. Centered Main Experience */}
      <section className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#18181b] leading-tight">
          What's happening in your supply chain?
        </h1>
        <p className="text-sm sm:text-base text-[#71717a] leading-relaxed">
          Paste a supplier, carrier or warehouse disruption notice. SignalOps traces the
          downstream impact and helps you decide what to do next.
        </p>
      </section>

      {/* 2. Large Modern Composer Area */}
      <section className="w-full">
        <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-lg shadow-stone-200/40 focus-within:border-[#18181b] focus-within:ring-1 focus-within:ring-[#18181b] transition-all overflow-hidden">
          <div className="p-4 sm:p-5">
            <textarea
              id="home-composer-input"
              rows={5}
              value={noticeText}
              onChange={(e) => onNoticeChange(e.target.value)}
              placeholder="Paste a disruption notice..."
              className="w-full text-sm sm:text-base text-[#18181b] placeholder:text-[#a1a1aa] bg-transparent outline-none resize-y leading-relaxed"
            />
          </div>

          {/* Composer Footer Bar */}
          <div className="px-4 py-3 bg-[#faf9f7] border-t border-[#f0eee9] flex flex-wrap items-center justify-between gap-3">
            {/* Planning Horizon */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#71717a]">
                Planning horizon:
              </span>
              <div className="inline-flex rounded-lg bg-[#eae8e3] p-0.5">
                {horizonOptions.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => onHorizonChange(h.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      decisionHorizon === h.id
                        ? 'bg-white text-[#18181b] shadow-xs'
                        : 'text-[#71717a] hover:text-[#18181b]'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => onAnalyze()}
              disabled={isAnalyzing || !noticeText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#18181b] text-white hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing disruption...</span>
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

        {/* Example Prompt Chips under Composer */}
        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {examplePrompts.map((prompt) => (
            <button
              key={prompt.title}
              onClick={() => handlePromptClick(prompt.presetId)}
              className="text-left p-3 rounded-xl bg-white border border-[#e4e4e7] hover:border-[#a1a1aa] transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px] text-[#71717a] mb-1">
                <span className="font-mono uppercase text-[10px] text-[#a1a1aa]">
                  {prompt.tag}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#18181b]">
                  →
                </span>
              </div>
              <div className="text-xs font-semibold text-[#18181b] group-hover:text-[#f97316] transition-colors leading-snug">
                "{prompt.title}"
              </div>
              <div className="text-[11px] text-[#71717a] mt-1 line-clamp-1">
                {prompt.snippet}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Secondary Content: Recent Investigations & Active Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-[#e7e5e4]">
        {/* RECENT INVESTIGATIONS (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">
              Recent Investigations
            </h2>
            <span className="text-[11px] text-[#a1a1aa]">
              Click any case to inspect impact
            </span>
          </div>

          <div className="space-y-2">
            {recentCases.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCase(c.presetId)}
                className="p-3.5 rounded-xl bg-white border border-[#e4e4e7] hover:border-[#18181b] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${c.severityClass}`}
                  >
                    {c.severity}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-[#18181b] group-hover:text-[#f97316] transition-colors flex items-center gap-1.5">
                      <span>{c.supplier}</span>
                      <span className="text-[#a1a1aa] font-normal">·</span>
                      <span className="text-[#71717a] font-normal">{c.summary}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#a1a1aa] shrink-0">
                  <span className="font-mono">{c.shipment}</span>
                  <span>·</span>
                  <span>{c.timeAgo}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#18181b] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE RISKS (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">
              Active Network Risks
            </h2>
          </div>

          <div className="space-y-2.5">
            {activeRisks.map((risk, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#fbfbfa] border border-[#e4e4e7] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#18181b]">{risk.title}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      risk.risk === 'Critical'
                        ? 'bg-[#fef2f2] text-[#dc2626]'
                        : 'bg-[#fff7ed] text-[#ea580c]'
                    }`}
                  >
                    {risk.risk}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#71717a] leading-relaxed">
                  {risk.desc}
                </p>
                <div className="text-[10.5px] font-mono text-[#a1a1aa] pt-0.5">
                  {risk.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
