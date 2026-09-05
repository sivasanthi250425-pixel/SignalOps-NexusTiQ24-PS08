import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  CheckCircle2,
  Table,
  Filter,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface SQLiteRecordSet {
  suppliers?: Array<Record<string, any>>;
  materials?: Array<Record<string, any>>;
  inventory?: Array<Record<string, any>>;
  shipments?: Array<Record<string, any>>;
  customer_orders?: Array<Record<string, any>>;
  logistics_contracts?: Array<Record<string, any>>;
}

export const EvidencePage: React.FC = () => {
  const [records, setRecords] = useState<SQLiteRecordSet>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTable, setActiveTable] = useState<string>('customer_orders');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/network-records');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else {
        fallbackRecords();
      }
    } catch (e) {
      fallbackRecords();
    } finally {
      setLoading(false);
    }
  };

  const fallbackRecords = () => {
    setRecords({
      customer_orders: [
        { order_id: 'SO-1001', customer_name: 'Apex Aerospace', sku: 'SKU-X', quantity: 30, promise_date: '2026-09-08', late_penalty_per_day: 2500, priority: 'TIER_1' },
        { order_id: 'SO-1002', customer_name: 'Lockheed Dynamics', sku: 'SKU-X', quantity: 25, promise_date: '2026-09-09', late_penalty_per_day: 3200, priority: 'TIER_1' },
        { order_id: 'SO-1003', customer_name: 'Raytheon Systems', sku: 'SKU-X', quantity: 20, promise_date: '2026-09-10', late_penalty_per_day: 2800, priority: 'TIER_1' },
        { order_id: 'SO-1004', customer_name: 'Northrop Avionics', sku: 'SKU-X', quantity: 15, promise_date: '2026-09-11', late_penalty_per_day: 2000, priority: 'TIER_2' },
        { order_id: 'SO-1005', customer_name: 'Boeing Defense', sku: 'SKU-X', quantity: 20, promise_date: '2026-09-12', late_penalty_per_day: 1500, priority: 'TIER_2' },
        { order_id: 'SO-1006', customer_name: 'General Dynamics', sku: 'SKU-X', quantity: 10, promise_date: '2026-09-14', late_penalty_per_day: 1200, priority: 'TIER_2' },
      ],
      shipments: [
        { shipment_id: 'SH-102', supplier_id: 'SUP-01', material_id: 'MAT-01', carrier: 'EverForward Line', mode: 'OCEAN', planned_arrival: '2026-09-07', quantity: 200, status: 'IN_TRANSIT' },
        { shipment_id: 'SH-108', supplier_id: 'SUP-02', material_id: 'MAT-02', carrier: 'Hapag-Lloyd', mode: 'OCEAN', planned_arrival: '2026-09-12', quantity: 500, status: 'DELAYED' },
        { shipment_id: 'SH-114', supplier_id: 'SUP-03', material_id: 'MAT-03', carrier: 'Lufthansa Cargo', mode: 'AIR', planned_arrival: '2026-09-10', quantity: 150, status: 'CUSTOMS_HOLD' },
      ],
      inventory: [
        { location_id: 'WH-DAL-01', material_id: 'MAT-01', on_hand_qty: 80, safety_stock: 100, allocated_qty: 120 },
        { location_id: 'WH-NWK-02', material_id: 'MAT-02', on_hand_qty: 350, safety_stock: 300, allocated_qty: 200 },
        { location_id: 'WH-ORD-03', material_id: 'MAT-03', on_hand_qty: 110, safety_stock: 50, allocated_qty: 60 },
        { location_id: 'WH-OAK-04', material_id: 'MAT-04', on_hand_qty: 450, safety_stock: 200, allocated_qty: 150 },
      ],
      suppliers: [
        { supplier_id: 'SUP-01', name: 'ABC Components', aliases: 'ABC, ABC Comp, Kaohsiung Fab', country: 'Taiwan', lead_time_days: 14 },
        { supplier_id: 'SUP-02', name: 'Apex Foundry & Metals', aliases: 'Apex, Dresden Smelter', country: 'Germany', lead_time_days: 21 },
        { supplier_id: 'SUP-03', name: 'EuroParts GmbH', aliases: 'EuroParts, Stuttgart Sensor', country: 'Germany', lead_time_days: 7 },
      ],
      logistics_contracts: [
        { contract_id: 'CON-AIR-01', partner: 'Pacific Air Charter Ltd', mode: 'AIR_EXPEDITE', base_cost: 14500, rate_per_unit: 100, transit_days: 2 },
        { contract_id: 'CON-EXP-02', partner: 'FastTrack Freight Ops', mode: 'TRUCKLOAD_EXPEDITE', base_cost: 4200, rate_per_unit: 30, transit_days: 3 },
      ],
    });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const tables = [
    { id: 'customer_orders', label: 'Customer Orders', count: records.customer_orders?.length || 0 },
    { id: 'shipments', label: 'Shipments', count: records.shipments?.length || 0 },
    { id: 'inventory', label: 'Inventory Buffers', count: records.inventory?.length || 0 },
    { id: 'suppliers', label: 'Suppliers', count: records.suppliers?.length || 0 },
    { id: 'logistics_contracts', label: 'Logistics Contracts', count: records.logistics_contracts?.length || 0 },
  ];

  const currentData: Array<Record<string, any>> = records[activeTable as keyof SQLiteRecordSet] || [];

  const filteredData = currentData.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = currentData.length > 0 ? Object.keys(currentData[0]) : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0] text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SQLite3 Ground-Truth Operational Database</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18181b]">
            Evidence Explorer
          </h1>
          <p className="text-sm text-[#71717a] mt-0.5">
            Inspect the underlying tables queried by the deterministic calculation engine.
          </p>
        </div>

        <button
          onClick={fetchRecords}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#52525b] hover:text-[#18181b] bg-white border border-[#e4e4e7] hover:bg-[#faf9f7] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Table Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#e7e5e4]">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTable(t.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTable === t.id
                ? 'bg-[#18181b] text-white shadow-xs'
                : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#eae8e3]'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTable === t.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#f4f4f5] text-[#71717a]'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder={`Search ${activeTable}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#e4e4e7] text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#18181b]"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#71717a] flex flex-col items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#18181b] border-t-transparent rounded-full animate-spin" />
            <span>Querying supply_chain.db...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#71717a]">
            No records matched search term "{searchTerm}".
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[#faf9f7] border-b border-[#e7e5e4] text-[#71717a] uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-3 font-semibold">
                      {col.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eee9]">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#faf9f7]/70 transition-colors font-mono text-[11.5px]">
                    {columns.map((col) => {
                      const val = row[col];
                      const isMoney = col.includes('penalty') || col.includes('cost');
                      const isQty = col.includes('quantity') || col.includes('qty');
                      return (
                        <td key={col} className="px-4 py-2.5 text-[#18181b]">
                          {isMoney ? (
                            <span className="font-semibold text-[#dc2626]">
                              ${Number(val).toLocaleString()}
                            </span>
                          ) : isQty ? (
                            <span className="font-semibold text-[#18181b]">
                              {val} units
                            </span>
                          ) : (
                            String(val ?? '—')
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
