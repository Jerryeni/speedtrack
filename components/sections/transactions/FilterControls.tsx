"use client";

import { showToast } from "@/lib/toast";

interface FilterControlsProps {
  filters: {
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    period: string;
  };
  setFilters: (filters: any) => void;
}

export default function FilterControls({ filters, setFilters }: FilterControlsProps) {
  const periods = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Large Amount", value: "large" },
  ];

  const resetFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      startDate: "",
      endDate: "",
      period: "all",
    });
    showToast("Filters reset successfully!");
  };

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron font-semibold">Filter Transactions</h3>
          <button
            onClick={resetFilters}
            className="text-xs text-neon-blue hover:text-electric-purple transition-colors"
          >
            Reset All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-neon-blue focus:outline-none appearance-none"
            >
              <option value="all">All Types</option>
              <option value="investment">Investment</option>
              <option value="reward">Reward</option>
              <option value="referral">Referral</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>

          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-electric-purple focus:outline-none appearance-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-neon-blue focus:outline-none"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-electric-purple focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setFilters({ ...filters, period: period.value })}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filters.period === period.value
                  ? "bg-neon-blue text-dark-primary"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
