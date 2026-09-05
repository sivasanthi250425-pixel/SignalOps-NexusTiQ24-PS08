import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { PRESET_DISRUPTIONS } from '../data/mockSupplyChain';

interface CaseItem {
  id: string;
  presetId: string;
  title: string;
  incidentType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Resolved';
  supplier: string;
  shipmentId: string;
  impactSummary: string;
  ordersBreached: number;
  exposure: string;
  date: string;
}

interface CasesPageProps {
  onSelectCase: (presetId: string) => void;
  onNewInvestigation: () => void;
}

export const CasesPage: React.FC<CasesPageProps> = ({
  onSelectCase,
  onNewInvestigation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'RESOLVED'>('ALL');

  const cases: CaseItem[] = [
    {
      id: 'CASE-2026-0901',
      presetId: 'typhoon-sh102',
      title: 'EverForward Typhoon Mawar Maritime Berthing Delay',
      incidentType: 'Weather & Port Congestion',
      severity: 'Critical',
      supplier: 'ABC Components (Kaohsiung)',
      shipmentId: 'SH-102',
      impactSummary: '40-unit SKU-X shortage across 6 tier-1 aerospace & defense contracts',
      ordersBreached: 6,
      exposure: '$62,200',
      date: 'Sept 5, 2026',
    },
    {
      id: 'CASE-2026-0902',
      presetId: 'foundry-incident',
      title: 'Apex Foundry Induction Furnace Transformer Fault',
      incidentType: 'Manufacturing Facility Outage',
      severity: 'High',
      supplier: 'Apex Foundry & Metals (Dresden)',
      shipmentId: 'SH-108',
      impactSummary: '500 units SKU-Y titanium ingot delayed 18 days via Hamburg',
      ordersBreached: 1,
      exposure: '$18,500',
      date: 'Sept 5, 2026',
    },
    {
      id: 'CASE-2026-0903',
      presetId: 'customs-hold',
      title: 'EuroParts Dual-Use Optic Sensor Regulatory Clearance Hold',
      incidentType: 'Export Compliance Hold',
      severity: 'Medium',
      supplier: 'EuroParts GmbH (Stuttgart)',
      shipmentId: 'SH-114',
      impactSummary: '150 units SKU-Z delayed 8-11 business days at Frankfurt cargo hub',
      ordersBreached: 0,
      exposure: '$4,200',
      date: 'Sept 4, 2026',
    },
    {
      id: 'CASE-2026-0904',
      presetId: 'routine-no-impact',
      title: 'Northern Logistics Routine Gantry Crane Overhaul',
      incidentType: 'Scheduled Facility Maintenance',
      severity: 'Resolved',
      supplier: 'Northern Logistics B.V. (Rotterdam)',
      shipmentId: 'SUP-05',
      impactSummary: 'Zero operational disruption; existing warehouse buffer absorbs nominal delay',
      ordersBreached: 0,
      exposure: '$0.00',
      date: 'Sept 3, 2026',
    },
  ];

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterSeverity === 'CRITICAL') return c.severity === 'Critical' || c.severity === 'High';
    if (filterSeverity === 'RESOLVED') return c.severity === 'Resolved';
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18181b]">
            Disruption Cases
          </h1>
          <p className="text-sm text-[#71717a] mt-0.5">
            Historical and active supply chain disruption investigations.
          </p>
        </div>

        <button
          onClick={onNewInvestigation}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#18181b] text-white hover:bg-[#27272a] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <span>New Investigation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search cases, suppliers, shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#e4e4e7] text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#18181b]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['ALL', 'CRITICAL', 'RESOLVED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterSeverity(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterSeverity === filter
                  ? 'bg-[#18181b] text-white'
                  : 'bg-white text-[#71717a] hover:text-[#18181b] border border-[#e4e4e7]'
              }`}
            >
              {filter === 'ALL' ? 'All Cases' : filter === 'CRITICAL' ? 'Critical & High' : 'Resolved'}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectCase(item.presetId)}
            className="bg-white rounded-2xl border border-[#e4e4e7] p-4 sm:p-5 hover:border-[#18181b] transition-all cursor-pointer group shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    item.severity === 'Critical'
                      ? 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]'
                      : item.severity === 'High'
                      ? 'bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]'
                      : item.severity === 'Medium'
                      ? 'bg-[#fefce8] text-[#ca8a04] border border-[#fef08a]'
                      : 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]'
                  }`}
                >
                  {item.severity}
                </span>

                <span className="text-xs font-mono text-[#a1a1aa]">
                  {item.id}
                </span>
                <span className="text-[#d4d4d8]">·</span>
                <span className="text-xs text-[#71717a]">
                  {item.incidentType}
                </span>
              </div>

              <div className="text-xs text-[#a1a1aa] flex items-center gap-2">
                <span>{item.date}</span>
                <ChevronRight className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#18181b] transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#18181b] group-hover:text-[#f97316] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#52525b] mt-1 leading-relaxed">
                {item.impactSummary}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#f0eee9] text-xs">
              <div className="flex items-center gap-3 text-[#71717a]">
                <span>
                  Supplier: <strong className="text-[#18181b] font-medium">{item.supplier}</strong>
                </span>
                <span>·</span>
                <span>
                  Shipment: <strong className="text-[#18181b] font-mono">{item.shipmentId}</strong>
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[#71717a]">
                  Orders breached:{' '}
                  <strong className="text-[#18181b]">{item.ordersBreached}</strong>
                </span>
                <span className="text-[#71717a]">
                  Exposure:{' '}
                  <strong className={item.exposure !== '$0.00' ? 'text-[#dc2626]' : 'text-[#16a34a]'}>
                    {item.exposure}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
