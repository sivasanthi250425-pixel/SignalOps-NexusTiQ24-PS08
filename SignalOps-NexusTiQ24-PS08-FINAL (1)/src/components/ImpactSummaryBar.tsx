import React from 'react';
import { AlertCircle, CheckCircle2, DollarSign, Calendar, Users, Package, ShoppingBag, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { ImpactSummaryMetrics } from '../types';

interface ImpactSummaryBarProps {
  summary: ImpactSummaryMetrics;
  hasOperationalImpact: boolean;
}

export const ImpactSummaryBar: React.FC<ImpactSummaryBarProps> = ({
  summary,
  hasOperationalImpact,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Units at Risk */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white rounded-xl p-4 border border-[#e4e4e7] shadow-xs hover:border-[#d4d4d8] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#71717a] mb-2 font-medium">
            <span>Units at Risk</span>
            <Package className="w-4 h-4 text-[#a1a1aa]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              id="summary-units-at-risk"
              className={`text-3xl font-bold tracking-tight ${
                hasOperationalImpact && summary.unitsAtRisk > 0
                  ? 'text-[#ea580c]'
                  : 'text-[#18181b]'
              }`}
            >
              {summary.unitsAtRisk}
            </span>
            <span className="text-xs text-[#71717a]">units short</span>
          </div>
          <p className="text-[11px] text-[#a1a1aa] mt-1.5">
            {hasOperationalImpact ? 'Safety buffer breached' : 'Fully covered by DC inventory'}
          </p>
        </motion.div>

        {/* Card 2: Orders Affected */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-[#e4e4e7] shadow-xs hover:border-[#d4d4d8] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#71717a] mb-2 font-medium">
            <span>Orders Affected</span>
            <ShoppingBag className="w-4 h-4 text-[#a1a1aa]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              id="summary-orders-affected"
              className="text-3xl font-bold tracking-tight text-[#18181b]"
            >
              {summary.ordersAffected}
            </span>
            <span className="text-xs text-[#71717a]">sales commitments</span>
          </div>
          <p className="text-[11px] text-[#a1a1aa] mt-1.5">
            {hasOperationalImpact ? 'Priority fulfillment queued' : 'Zero promise dates slipped'}
          </p>
        </motion.div>

        {/* Card 3: Customers Affected */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white rounded-xl p-4 border border-[#e4e4e7] shadow-xs hover:border-[#d4d4d8] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#71717a] mb-2 font-medium">
            <span>Customers Affected</span>
            <Users className="w-4 h-4 text-[#a1a1aa]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              id="summary-customers-affected"
              className="text-3xl font-bold tracking-tight text-[#18181b]"
            >
              {summary.customersAffected}
            </span>
            <span className="text-xs text-[#71717a]">accounts</span>
          </div>
          <p className="text-[11px] text-[#a1a1aa] mt-1.5">
            {hasOperationalImpact ? 'Tier-1 contractual accounts' : 'No account notification required'}
          </p>
        </motion.div>

        {/* Card 4: Earliest Delivery Risk */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-[#e4e4e7] shadow-xs hover:border-[#d4d4d8] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#71717a] mb-2 font-medium">
            <span>Earliest Delivery Risk</span>
            <Calendar className="w-4 h-4 text-[#a1a1aa]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              id="summary-earliest-risk"
              className={`text-2xl font-bold tracking-tight ${
                hasOperationalImpact ? 'text-[#dc2626]' : 'text-[#10b981]'
              }`}
            >
              {summary.earliestDeliveryRiskDate}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#a1a1aa] mt-1.5">
            <span>Exposure: {summary.totalFinancialExposure}</span>
            {hasOperationalImpact && (
              <span className="text-[#dc2626] font-medium">Immediate</span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
