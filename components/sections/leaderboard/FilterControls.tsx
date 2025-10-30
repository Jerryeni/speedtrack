"use client";

import { showToast } from "@/lib/toast";

interface FilterControlsProps {
  filters: {
    time: string;
    category: string;
    scope: string;
  };
  setFilters: (filters: any) => void;
}

export default function FilterControls({ filters, setFilters }: FilterControlsProps) {
  const scopes = ["global", "friends", "pool-alpha", "pool-beta", "newcomers"];

  const resetFilters = () => {
    setFilters({ time: "all-time", category: "total-earnings", scope: "global" });
    showToast("Filters reset successfully!");
  };

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron font-semibold">Filter Rankings</h3>
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
              value={filters.time}
              onChange={(e) => setFilters({ ...filters, time: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-neon-blue focus:outline-none appearance-none"
            >
              <option value="all-time">All Time</option>
              <option value="monthly">This Month</option>
              <option value="weekly">This Week</option>
              <option value="daily">Today</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>

          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-electric-purple focus:outline-none appearance-none"
            >
              <option value="total-earnings">Total Earnings</option>
              <option value="referrals">Most Referrals</option>
              <option value="pool-income">Pool Income</option>
              <option value="level-income">Level Income</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {scopes.map((scope) => (
            <button
              key={scope}
              onClick={() => setFilters({ ...filters, scope })}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filters.scope === scope
                  ? "bg-neon-blue text-dark-primary"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {scope.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
