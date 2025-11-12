interface TeamStatisticsProps {
  stats: any;
  isLoading: boolean;
}

export default function TeamStatistics({ stats, isLoading }: TeamStatisticsProps) {
  const totalReferrals = stats?.totalReferrals || 0;
  const directReferrals = stats?.directReferrals || 0;
  const totalEarned = parseFloat(stats?.levelIncome || '0');

  const displayStats = [
    { icon: "fa-users", value: totalReferrals.toString(), label: "Total Network", change: "+0%", color: "neon-blue", changeColor: "green-400" },
    { icon: "fa-user-friends", value: directReferrals.toString(), label: "Direct Referrals", change: "+0%", color: "electric-purple", changeColor: "green-400" },
    { icon: "fa-coins", value: `$${totalEarned.toFixed(2)}`, label: "Level Income", change: "+0%", color: "green-400", changeColor: "green-400" },
    { icon: "fa-layer-group", value: "10", label: "Max Levels", change: "100%", color: "yellow-400", changeColor: "yellow-400" },
  ];

  if (isLoading) {
    return (
      <section className="px-2 sm:px-4 mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-lg font-orbitron font-bold mb-3 sm:mb-4">Team Statistics</h3>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700">
          <div className="text-center text-gray-400">
            <i className="fas fa-spinner fa-spin text-xl sm:text-2xl mb-2"></i>
            <p className="text-sm sm:text-base">Loading statistics...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-2 sm:px-4 mb-4 sm:mb-6">
      <h3 className="text-sm sm:text-lg font-orbitron font-bold mb-3 sm:mb-4">Team Statistics</h3>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-700">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
          {displayStats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <i className={`fas ${stat.icon} text-${stat.color} text-xs sm:text-sm`}></i>
                <span className={`text-xs text-${stat.changeColor}`}>{stat.change}</span>
              </div>
              <p className={`text-base sm:text-xl font-bold text-${stat.color} truncate`}>{stat.value}</p>
              <p className="text-xs text-gray-400 truncate">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Removed hardcoded growth trend chart - will be replaced with real historical data in future update */}
      </div>
    </section>
  );
}
