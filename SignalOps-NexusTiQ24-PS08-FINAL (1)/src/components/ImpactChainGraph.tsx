import React from 'react';
import {
  Factory,
  Ship,
  Warehouse,
  FileCheck,
  Building2,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImpactNode, ImpactEdge } from '../types';

interface ImpactChainGraphProps {
  nodes: ImpactNode[];
  edges: ImpactEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

export const ImpactChainGraph: React.FC<ImpactChainGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}) => {
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const getNodeIcon = (type: ImpactNode['type']) => {
    switch (type) {
      case 'SUPPLIER':
        return <Factory className="w-5 h-5" />;
      case 'SHIPMENT':
        return <Ship className="w-5 h-5" />;
      case 'INVENTORY':
        return <Warehouse className="w-5 h-5" />;
      case 'ORDER':
        return <FileCheck className="w-5 h-5" />;
      case 'CUSTOMER':
        return <Building2 className="w-5 h-5" />;
    }
  };

  const getNodeTheme = (status: ImpactNode['status'], isSelected: boolean) => {
    if (isSelected) {
      return {
        card: 'bg-white border-[#18181b] ring-2 ring-[#18181b]/15 shadow-md scale-[1.02]',
        iconBg: 'bg-[#18181b] text-white',
        badge: 'bg-[#18181b] text-white',
        pulse: false,
      };
    }
    switch (status) {
      case 'DISRUPTED':
        return {
          card: 'bg-white border-[#fca5a5] hover:border-[#ef4444] shadow-xs shadow-red-100/50',
          iconBg: 'bg-[#fef2f2] text-[#dc2626]',
          badge: 'bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]',
          pulse: true,
        };
      case 'AT_RISK':
        return {
          card: 'bg-white border-[#fed7aa] hover:border-[#f97316] shadow-xs shadow-orange-100/50',
          iconBg: 'bg-[#fff7ed] text-[#ea580c]',
          badge: 'bg-[#ffedd5] text-[#c2410c] border border-[#fed7aa]',
          pulse: true,
        };
      case 'BUFFERED':
        return {
          card: 'bg-white border-[#bbf7d0] hover:border-[#22c55e] shadow-xs shadow-emerald-100/50',
          iconBg: 'bg-[#f0fdf4] text-[#16a34a]',
          badge: 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]',
          pulse: false,
        };
      case 'NORMAL':
      default:
        return {
          card: 'bg-white/90 border-[#e4e4e7] hover:border-[#a1a1aa] shadow-xs',
          iconBg: 'bg-[#f4f4f5] text-[#52525b]',
          badge: 'bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]',
          pulse: false,
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-sm overflow-hidden flex flex-col">
      {/* Network Header */}
      <div className="px-5 py-3.5 border-b border-[#f0eee9] flex flex-wrap items-center justify-between gap-3 bg-[#fdfdfc]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
          <h2 className="text-sm font-semibold text-[#18181b]">
            Supply Chain Impact Network
          </h2>
          <span className="text-xs text-[#71717a] hidden sm:inline">
            · Connected Causal Graph
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#71717a]">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]" /> Disrupted
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f97316]" /> At Risk
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Buffered
          </span>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="p-6 overflow-x-auto">
        <div className="min-w-[760px] flex items-center justify-between gap-2 relative py-4">
          {nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const theme = getNodeTheme(node.status, isSelected);
            const edge = edges.find((e) => e.from === node.id);

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  onClick={() => onSelectNode(node.id)}
                  className={`flex-1 min-w-[150px] max-w-[210px] p-3.5 rounded-xl border transition-all cursor-pointer select-none text-left relative ${theme.card}`}
                >
                  {/* Top indicator & Type */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${theme.iconBg}`}>
                        {getNodeIcon(node.type)}
                      </div>
                      <span className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">
                        {node.type}
                      </span>
                    </div>

                    {theme.pulse && !isSelected && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea580c] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ea580c]"></span>
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-semibold text-xs text-[#18181b] truncate" title={node.title}>
                    {node.title}
                  </h3>
                  <p className="text-[11px] text-[#71717a] truncate mt-0.5" title={node.subtitle}>
                    {node.subtitle}
                  </p>

                  {/* Metric Pill */}
                  <div className="mt-3 pt-2 border-t border-[#f4f4f5] flex items-center justify-between">
                    <span className="text-[10.5px] font-medium text-[#52525b] truncate">
                      {node.dataValue}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${theme.badge}`}>
                      {node.status}
                    </span>
                  </div>
                </motion.div>

                {/* Animated Edge connector */}
                {index < nodes.length - 1 && (
                  <div className="flex flex-col items-center justify-center shrink-0 px-1 relative">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.08 + 0.1 }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-6 sm:w-10 h-0.5 bg-gradient-to-r from-[#d4d4d8] to-[#f97316] relative overflow-hidden">
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                          className="w-1/2 h-full bg-[#f97316]"
                        />
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#f97316] shrink-0 -ml-1" />
                    </motion.div>
                    {edge?.label && (
                      <span className="text-[10px] text-[#a1a1aa] font-medium mt-1 whitespace-nowrap hidden lg:block">
                        {edge.label}
                      </span>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Evidence Inspector Banner */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[#f0eee9] bg-[#faf9f6] p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#18181b] text-white flex items-center justify-center text-xs">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#18181b]">
                    Evidence Audit · {selectedNode.type} [{selectedNode.title}]
                  </span>
                  <span className="text-xs text-[#71717a] ml-2">
                    Verified through ERP & logistics records
                  </span>
                </div>
              </div>

              <span className="text-xs font-medium text-[#71717a]">
                Status: <span className="text-[#18181b] font-semibold">{selectedNode.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 text-xs">
              {selectedNode.evidenceDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white border border-[#e4e4e7] shadow-xs"
                >
                  <span className="text-[10.5px] text-[#71717a] block">
                    {detail.label}
                  </span>
                  <span className="font-medium text-[#18181b] block mt-0.5 truncate" title={detail.value}>
                    {detail.value}
                  </span>
                  {detail.note && (
                    <span className="text-[10px] text-[#a1a1aa] block mt-0.5">
                      {detail.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
