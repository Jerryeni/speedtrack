interface FilterControlsProps {
  filterType: string;
  setFilterType: (value: string) => void;
  filterDate: string;
  setFilterDate: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}

export default function FilterControls({
  filterType,
  setFilterType,
  filterDate,
  setFilterDate,
  activeFilter,
  setActiveFilter,
}: FilterControlsProps) {
  const filters = [
    { label: "All", value: "all" },
    { label: "High Value", value: "high" },
    { label: "Recent", value: "recent" },
    { label: "Recurring", value: "recurring" },
  ];

  const resetFilters = () => {
    setFilterType("all");
    setFilterDate("all");
    setActiveFilter("all");
  };

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron font-semibold">Filter Income</h3>
          <button
            onClick={resetFilters}
            className="text-xs text-neon-blue hover:text-electric-purple transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-neon-blue focus:outline-none appearance-none"
            >
              <option value="all">All Income Types</option>
              <option value="pool">Pool Income</option>
              <option value="level">Level Income</option>
              <option value="withdrawal">Withdrawal Commission</option>
              <option value="daily">Daily Rewards</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>

          <div className="relative">
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-electric-purple focus:outline-none appearance-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilter === filter.value
                  ? "bg-neon-blue text-dark-primary"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
