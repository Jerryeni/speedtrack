export default function AchievementBadges() {
  const badges = [
    { icon: "fa-trophy", title: "Top 10", subtitle: "Achiever", color: "yellow-400", glow: true },
    { icon: "fa-users", title: "100+ Refs", subtitle: "Network Builder", color: "neon-blue", glow: false },
    { icon: "fa-coins", title: "$10K+", subtitle: "High Earner", color: "electric-purple", glow: false },
  ];

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Achievement Unlocked</h3>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-12 h-12 rounded-full bg-${badge.color}/20 flex items-center justify-center mx-auto mb-2 ${
                  badge.glow ? "animate-[rankGlow_3s_ease-in-out_infinite]" : ""
                }`}
              >
                <i className={`fas ${badge.icon} text-${badge.color}`}></i>
              </div>
              <p className={`text-xs font-semibold text-${badge.color}`}>{badge.title}</p>
              <p className="text-xs text-gray-500">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
