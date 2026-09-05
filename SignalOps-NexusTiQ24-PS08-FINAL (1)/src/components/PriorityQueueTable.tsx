import React, { useState } from 'react';
import { ListOrdered, AlertTriangle, Search, Filter, ChevronRight, User, Calendar, DollarSign } from 'lucide-react';
import { AffectedOrder } from '../types';

interface PriorityQueueTableProps {
  orders: AffectedOrder[];
}

export const PriorityQueueTable: React.FC<PriorityQueueTableProps> = ({ orders }) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((order) => {
    if (filterPriority !== 'ALL' && order.priority !== filterPriority) return false;
    if (
      searchTerm &&
      !order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#f0eee9] bg-[#fdfdfc] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ea580c]" />
          <h3 className="text-sm font-semibold text-[#18181b]">
            Affected Customer Orders Queue
          </h3>
          <span className="text-xs text-[#71717a]">
            ({orders.length} orders at risk)
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="inline-flex rounded-lg bg-[#f4f4f5] p-0.5 border border-[#e4e4e7]">
            {['ALL', 'P1', 'P2', 'P3'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  filterPriority === p
                    ? 'bg-white text-[#18181b] shadow-xs'
                    : 'text-[#71717a] hover:text-[#18181b]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search customer or order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1 bg-white border border-[#e4e4e7] rounded-lg text-xs text-[#18181b] outline-none focus:border-[#18181b] placeholder:text-[#a1a1aa] w-48"
            />
            <Search className="w-3.5 h-3.5 text-[#a1a1aa] absolute left-2 top-2" />
          </div>
        </div>
      </div>

      {/* Modern Order Cards List */}
      <div className="divide-y divide-[#f4f4f5]">
        {filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#71717a]">
            No orders found matching criteria.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="p-4 hover:bg-[#faf9f6] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`px-2 py-1 rounded-lg text-[10.5px] font-bold shrink-0 mt-0.5 ${
                    order.priority === 'P1'
                      ? 'bg-[#fee2e2] text-[#dc2626] border border-[#fecaca]'
                      : order.priority === 'P2'
                      ? 'bg-[#ffedd5] text-[#ea580c] border border-[#fed7aa]'
                      : 'bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]'
                  }`}
                >
                  {order.priority}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#18181b] text-sm">
                      {order.orderId}
                    </span>
                    <span className="text-[#a1a1aa]">·</span>
                    <span className="font-medium text-[#18181b]">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#f4f4f5] text-[#71717a]">
                      {order.tier}
                    </span>
                  </div>

                  <p className="text-[#71717a] text-[11.5px] mt-1 leading-snug">
                    {order.reason}
                  </p>
                </div>
              </div>

              {/* Stats & Promise Date */}
              <div className="flex items-center gap-4 sm:shrink-0 text-right">
                <div>
                  <span className="text-[10px] text-[#a1a1aa] block uppercase">Promise Date</span>
                  <span className="font-semibold text-[#18181b]">{order.promiseDate}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#a1a1aa] block uppercase">Shortfall</span>
                  <span className="font-bold text-[#dc2626]">
                    {order.shortfallQty} / {order.requiredQty} units
                  </span>
                </div>

                <div className="hidden md:block">
                  <span className="text-[10px] text-[#a1a1aa] block uppercase">SLA Liability</span>
                  <span className="font-medium text-[#71717a]">${order.slaPenaltyPerDay}/day</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
