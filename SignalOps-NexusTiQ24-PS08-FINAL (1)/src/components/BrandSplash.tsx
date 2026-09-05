import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BrandSplashProps {
  onComplete: () => void;
}

export const BrandSplash: React.FC<BrandSplashProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onComplete}
        className="fixed inset-0 z-50 bg-[#faf9f6] flex flex-col items-center justify-center p-6 select-none cursor-pointer"
      >
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 max-w-md"
        >
          {/* Logo Mark */}
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#18181b] text-white flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12h5l3 7 4-14 3 7h5" />
            </svg>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-[#18181b]">
              SignalOps
            </h1>
            <p className="text-sm text-[#71717a] font-normal tracking-normal">
              Supply Chain Disruption Intelligence
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
            <span className="text-[11px] font-mono text-[#a1a1aa] tracking-wider uppercase">
              NexusTiQ24 · PS08
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
