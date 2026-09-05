import React, { useState } from 'react';
import {
  Network,
  Factory,
  Ship,
  Warehouse,
  FileCheck,
  Building2,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface NetworkTier {
  id: string;
  name: string;
  count: number;
  description: string;
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    detail: string;
  }>;
}

export const SupplyNetworkPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('inventory');
  const [selectedItemId, setSelectedItemId] = useState<string>('INV-01');

  const tiers: NetworkTier[] = [
    {
      id: 'suppliers',
      name: 'Suppliers',
      count: 5,
      description: 'Tier-1 component fabricators & foundries',
      items: [
        {
          id: 'SUP-01',
          title: 'ABC Components',
          subtitle: 'Kaohsiung, TW · Microcontrollers',
          status: 'CRITICAL',
          detail: 'Primary sole-source fabricator for MCU-8400 (SKU-X). Contract standard SLA: 14 business days.',
        },
        {
          id: 'SUP-02',
          title: 'Apex Foundry & Metals',
          subtitle: 'Dresden, DE · Titanium Ingot',
          status: 'WARNING',
          detail: 'Vacuum induction melting facility Line 3 under maintenance hold for refractory recasting.',
        },
        {
          id: 'SUP-03',
          title: 'EuroParts GmbH',
          subtitle: 'Stuttgart, DE · Optic Sensors',
          status: 'WARNING',
          detail: 'Dual-use export compliance re-validation under Annex IV.',
        },
        {
          id: 'SUP-04',
          title: 'Pacific Micro Devices',
          subtitle: 'Yokohama, JP · Flash Memory',
          status: 'NORMAL',
          detail: 'Operating at 98.4% on-time shipment compliance.',
        },
        {
          id: 'SUP-05',
          title: 'Northern Logistics Materials',
          subtitle: 'Rotterdam, NL · Dunnage & Pallets',
          status: 'NORMAL',
          detail: 'Automated consolidation terminal operating with standard 48h buffer.',
        },
      ],
    },
    {
      id: 'shipments',
      name: 'Shipments',
      count: 3,
      description: 'Active inbound multi-modal transit legs',
      items: [
        {
          id: 'SH-102',
          title: 'OceanEver Line (Vessel EverForward)',
          subtitle: 'Port of Kaohsiung → Port of Long Beach / Central DC',
          status: 'CRITICAL',
          detail: 'Delayed 14 days due to port berth congestion. Scheduled ETA: 2026-09-08, Revised ETA: 2026-09-22.',
        },
        {
          id: 'SH-108',
          title: 'Maersk Line (Maersk Mc-Kinney)',
          subtitle: 'Port of Hamburg → Newark Port / East DC',
          status: 'WARNING',
          detail: 'Scheduled ETA: 2026-09-12. Delayed by 18 days due to supplier production incident.',
        },
        {
          id: 'SH-114',
          title: 'DHL Global Forwarding (Flight DHK412)',
          subtitle: 'Frankfurt Hub → Chicago Midwest DC',
          status: 'WARNING',
          detail: 'Scheduled ETA: 2026-09-10. Consignment on regulatory document clearance hold.',
        },
      ],
    },
    {
      id: 'inventory',
      name: 'Inventory Buffers',
      count: 4,
      description: 'Regional distribution centers & stock buffers',
      items: [
        {
          id: 'INV-01',
          title: 'Central DC (Dallas) · SKU-X',
          subtitle: 'MCU-8400 Microcontrollers',
          status: 'CRITICAL',
          detail: '80 units on-hand vs. 100 minimum threshold. 120 units committed. Depletes Sept 7.',
        },
        {
          id: 'INV-02',
          title: 'Newark East DC · SKU-Y',
          subtitle: 'Ti-6Al-4V Titanium Forged Ingot',
          status: 'WARNING',
          detail: '350 kg on-hand vs. 300 kg safety buffer. Buffer expected to drop below minimum threshold by Sept 18.',
        },
        {
          id: 'INV-03',
          title: 'Chicago Midwest DC · SKU-Z',
          subtitle: 'Sensor Node Opto-440',
          status: 'WARNING',
          detail: '110 units on-hand. Buffer adequate for next 9 days before depletion risk.',
        },
        {
          id: 'INV-04',
          title: 'West Coast Hub (Oakland) · SKU-W',
          subtitle: 'Power Converter Sub-assembly',
          status: 'NORMAL',
          detail: '450 units on-hand. Nominal operating inventory with 45-day runway.',
        },
      ],
    },
    {
      id: 'orders',
      name: 'Customer Orders',
      count: 9,
      description: 'Downstream sales commitments & SLA penalties',
      items: [
        {
          id: 'SO-1001',
          title: 'Order SO-1001 (Apex Aerospace)',
          subtitle: 'Promise: Sept 8 · 30 units SKU-X',
          status: 'CRITICAL',
          detail: 'Contractual penalty: $2,500/day late fee. First exposed delivery breach.',
        },
        {
          id: 'SO-1002',
          title: 'Order SO-1002 (Lockheed Dynamics)',
          subtitle: 'Promise: Sept 9 · 25 units SKU-X',
          status: 'CRITICAL',
          detail: 'Contractual penalty: $3,200/day late fee. High-priority Tier 1 defense contract.',
        },
        {
          id: 'SO-1003',
          title: 'Order SO-1003 (Raytheon Systems)',
          subtitle: 'Promise: Sept 10 · 20 units SKU-X',
          status: 'CRITICAL',
          detail: 'Contractual penalty: $2,800/day late fee.',
        },
        {
          id: 'SO-1004',
          title: 'Order SO-1004 (Northrop Avionics)',
          subtitle: 'Promise: Sept 11 · 15 units SKU-X',
          status: 'CRITICAL',
          detail: 'Contractual penalty: $2,000/day late fee.',
        },
      ],
    },
  ];

  const currentTierData = tiers.find((t) => t.id === selectedTier) || tiers[2];
  const activeItem =
    currentTierData.items.find((i) => i.id === selectedItemId) ||
    currentTierData.items[0];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#18181b]">
          Supply Network Overview
        </h1>
        <p className="text-sm text-[#71717a] mt-0.5">
          End-to-end topological map: Suppliers → Shipments → Inventory → Customer Orders.
        </p>
      </div>

      {/* 4 Connected Pipeline Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tiers.map((t, idx) => {
          const isSelected = selectedTier === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTier(t.id);
                setSelectedItemId(t.items[0].id);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#18181b] ring-1 ring-[#18181b] shadow-xs'
                  : 'bg-white border-[#e4e4e7] hover:border-[#a1a1aa]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
                <span className="font-mono text-[10px] text-[#a1a1aa] uppercase">
                  Stage 0{idx + 1}
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#f4f4f5] text-[10px] font-mono">
                  {t.count}
                </span>
              </div>
              <div className="text-sm font-bold text-[#18181b]">{t.name}</div>
              <div className="text-[11px] text-[#71717a] mt-0.5 line-clamp-1">
                {t.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tier Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="text-xs font-semibold text-[#71717a] uppercase tracking-wider px-1">
            {currentTierData.name} ({currentTierData.items.length} records)
          </div>

          <div className="space-y-2">
            {currentTierData.items.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#18181b] ring-1 ring-[#18181b] shadow-xs'
                      : 'bg-white border-[#e4e4e7] hover:border-[#a1a1aa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.status === 'CRITICAL'
                            ? 'bg-[#dc2626]'
                            : item.status === 'WARNING'
                            ? 'bg-[#f97316]'
                            : 'bg-[#16a34a]'
                        }`}
                      />
                      <span className="text-xs font-bold text-[#18181b]">
                        {item.title}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#a1a1aa]">
                      {item.id}
                    </span>
                  </div>

                  <div className="text-xs text-[#71717a] mt-1 pl-4">
                    {item.subtitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e4e4e7] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0eee9] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#a1a1aa] uppercase">
                Node Inspector
              </span>
              <h3 className="text-base font-bold text-[#18181b] mt-0.5">
                {activeItem.title}
              </h3>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                activeItem.status === 'CRITICAL'
                  ? 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]'
                  : activeItem.status === 'WARNING'
                  ? 'bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]'
                  : 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]'
              }`}
            >
              {activeItem.status}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-[#71717a] block">
                Identifier:
              </span>
              <span className="font-mono font-bold text-[#18181b]">
                {activeItem.id}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#71717a] block">
                Routing & Facility:
              </span>
              <span className="text-[#18181b]">{activeItem.subtitle}</span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#71717a] block">
                Operational Ledger Notes:
              </span>
              <p className="text-[#52525b] mt-1 leading-relaxed bg-[#faf9f7] p-3 rounded-xl border border-[#e4e4e7]">
                {activeItem.detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
