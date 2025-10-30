export default function TeamStatistics() {
  const stats = [
    { icon: "fa-chart-line", value: "89", label: "Active This Week", change: "+12%", color: "neon-blue", changeColor: "green-400" },
    { icon: "fa-fire", value: "23", label: "Inactive Members", change: "-3%", color: "electric-purple", changeColor: "red-400" },
    { icon: "fa-rocket", value: "$1,247", label: "Weekly Earnings", change: "+25%", color: "green-400", changeColor: "green-400" },
    { icon: "fa-users", value: "15", label: "New Members", change: "+8%", color: "yellow-400", changeColor: "yellow-400" },
  ];

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Team Statistics</h3>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <i className={`fas ${stat.icon} text-${stat.color}`}></i>
                <span className={`text-xs text-${stat.changeColor}`}>{stat.change}</span>
              </div>
              <p className={`text-xl font-bold text-${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Team Growth Trend</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-green-400">Growing</span>
            </div>
          </div>
          <div className="h-24 flex items-end space-x-1">
            {[10, 15, 12, 20, 18, 25, 30, 35, 40, 45].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-neon-blue rounded-t"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
