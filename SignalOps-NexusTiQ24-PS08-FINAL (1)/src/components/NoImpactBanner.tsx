import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight, Layers, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface NoImpactBannerProps {
  explanation?: string;
  onIntakeNewNotice: () => void;
}

export const NoImpactBanner: React.FC<NoImpactBannerProps> = ({
  explanation,
  onIntakeNewNotice,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      id="no-impact-banner"
      className="bg-white rounded-2xl border border-[#a7f3d0] p-8 sm:p-10 shadow-sm text-center max-w-4xl mx-auto my-6 relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#34d399] via-[#10b981] to-[#059669]" />

      <div className="flex flex-col items-center space-y-4">
        {/* Large serene checkmark icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center shadow-xs border border-[#a7f3d0]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-semibold">
            <span>Verified Supply Chain Audit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#064e3b]">
            NO CURRENT OPERATIONAL IMPACT
          </h2>
        </div>

        {/* Explanatory text */}
        <p className="text-sm sm:text-base text-[#065f46] max-w-2xl mx-auto leading-relaxed">
          {explanation ||
            'The reported disruption does not connect to any pending shipment, inventory shortage or customer order in the current planning horizon.'}
        </p>

        {/* 3 Calm Assurance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl pt-4 text-xs text-left">
          <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
            <div>
              <span className="font-semibold text-[#14532d] block">Safety Stock</span>
              <span className="text-[#15803d]">Fully covers window</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-[#16a34a] shrink-0" />
            <div>
              <span className="font-semibold text-[#14532d] block">Promise Dates</span>
              <span className="text-[#15803d]">Zero orders delayed</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center gap-2.5">
            <FileCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
            <div>
              <span className="font-semibold text-[#14532d] block">Mitigation Needed</span>
              <span className="text-[#15803d]">None (Log & monitor)</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={onIntakeNewNotice}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#065f46] hover:bg-[#064e3b] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            <span>Intake Another Notice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
