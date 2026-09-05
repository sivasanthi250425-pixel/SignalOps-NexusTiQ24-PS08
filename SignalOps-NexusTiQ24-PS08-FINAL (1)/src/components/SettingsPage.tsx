import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Database,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { DecisionHorizon } from '../types';

interface SettingsPageProps {
  defaultHorizon: DecisionHorizon;
  onHorizonChange: (horizon: DecisionHorizon) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  defaultHorizon,
  onHorizonChange,
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#18181b]">
          Settings & System Architecture
        </h1>
        <p className="text-sm text-[#71717a] mt-0.5">
          SignalOps environment configurations, default horizons, and validation compliance.
        </p>
      </div>

      {/* Track & Compliance Card */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0eee9] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#18181b] text-white flex items-center justify-center font-bold text-xs">
              PS
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#18181b]">
                NexusTiQ24 Validation Architecture
              </h2>
              <p className="text-xs text-[#71717a]">
                Strict division of responsibility between Gemini and Python engine
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#18181b] text-white">
            TRACK PS08
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#faf9f7] border border-[#e4e4e7] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#18181b]">
              <Cpu className="w-3.5 h-3.5 text-[#f97316]" />
              <span>Python & SQLite Role (Ground Truth)</span>
            </div>
            <ul className="space-y-1 text-[#52525b] list-disc list-inside text-[11px]">
              <li>Query physical inventory from SQLite</li>
              <li>Calculate shortage quantities deterministically</li>
              <li>Filter and rank affected customer orders</li>
              <li>Sum financial exposure using contract rates</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#faf9f7] border border-[#e4e4e7] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#18181b]">
              <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
              <span>Gemini AI Role (Language & Synthesis)</span>
            </div>
            <ul className="space-y-1 text-[#52525b] list-disc list-inside text-[11px]">
              <li>Extract entities from unstructured notice</li>
              <li>Resolve carrier and port alias names</li>
              <li>Synthesize human-readable executive briefing</li>
              <li>Formulate proactive response options</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preferences Form */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] p-5 sm:p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-[#18181b] border-b border-[#f0eee9] pb-3">
          Investigation Preferences
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-[#18181b] block">
                Default Decision Horizon
              </span>
              <span className="text-[#71717a] text-[11px]">
                Time window for forward simulation of order impact and stockout dates.
              </span>
            </div>

            <div className="inline-flex rounded-xl bg-[#f4f4f5] p-1 border border-[#e4e4e7]">
              {(['7D', '14D', '30D', '60D'] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => onHorizonChange(h)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    defaultHorizon === h
                      ? 'bg-white text-[#18181b] shadow-xs font-semibold'
                      : 'text-[#71717a] hover:text-[#18181b]'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#f0eee9] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#16a34a] text-xs">
              {saved && (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Preferences saved.</span>
                </>
              )}
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#18181b] text-white hover:bg-[#27272a] transition-all cursor-pointer shadow-xs"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
