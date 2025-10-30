export default function GlobalStats() {
  const stats = [
    { icon: "fa-users", value: "10,247", label: "Active Racers", badge: "Total", color: "neon-blue", progress: 100 },
    { icon: "fa-coins", value: "$2.4M", label: "Total Earnings", badge: "Volume", color: "electric-purple", progress: 80 },
    { icon: "fa-trophy", value: "156", label: "Top Performers", badge: "Champions", color: "green-400", progress: 15.2 },
    { icon: "fa-network-wired", value: "45,892", label: "Total Referrals", badge: "Network", color: "yellow-400", progress: 60 },
  ];

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Global Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-${stat.color}/20 to-${stat.color}/5 rounded-2xl p-4 border border-${stat.color}/30 animate-[statsGlow_4s_ease-in-out_infinite]`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-full bg-${stat.color}/20 flex items-center justify-center`}>
                {stat.icon === "fa-trophy" ? (
                  <div className={`w-6 h-6 rounded-full bg-${stat.color} animate-[trophySpin_8s_linear_infinite]`}></div>
                ) : (
                  <i className={`fas ${stat.icon} text-${stat.color}`}></i>
                )}
              </div>
              <div className={`text-xs bg-${stat.color}/20 text-${stat.color} px-2 py-1 rounded-full`}>
                {stat.badge}
              </div>
            </div>
            <p className={`text-2xl font-bold text-${stat.color} animate-[countUp_2s_ease-out]`}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
            <div className="flex items-center space-x-2">
              <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    stat.progress === 100 ? "racing-track" : `bg-${stat.color}`
                  } rounded-full ${stat.color === "yellow-400" ? "animate-pulse-custom" : ""}`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
              <span className={`text-xs text-${stat.color}`}>{stat.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
