export default function CommissionStructure() {
  const levels = [
    {
      level: 1,
      name: "Level 1 - Direct Referrals",
      description: "Your direct team members",
      commission: "15%",
      activeMembers: 42,
      earned: "$1,247",
      progress: 80,
      color: "neon-blue",
    },
    {
      level: 2,
      name: "Level 2 - Second Tier",
      description: "Referrals of your referrals",
      commission: "10%",
      activeMembers: 28,
      earned: "$832",
      progress: 60,
      color: "electric-purple",
    },
    {
      level: 3,
      name: "Level 3 - Third Tier",
      description: "Extended network",
      commission: "7%",
      activeMembers: 19,
      earned: "$456",
      progress: 40,
      color: "green-400",
    },
  ];

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Commission Structure</h3>
      <div className="space-y-3">
        {levels.map((level) => (
          <div
            key={level.level}
            className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full bg-${level.color}/20 flex items-center justify-center animate-[levelPulse_2s_ease-in-out_infinite]`}>
                  <span className={`text-xs font-bold text-${level.color}`}>L{level.level}</span>
                </div>
                <div>
                  <p className="font-semibold">{level.name}</p>
                  <p className="text-xs text-gray-400">{level.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold text-${level.color}`}>{level.commission}</p>
                <p className="text-xs text-gray-400">Commission</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Active Members: {level.activeMembers}</span>
                <span className={`text-${level.color} font-semibold`}>{level.earned} Earned</span>
              </div>
              <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${level.color} rounded-full`}
                  style={{ width: `${level.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-3 border border-gray-700/50">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <i className="fas fa-ellipsis-h"></i>
            <span className="text-sm">Levels 4-10 available</span>
            <button className="text-neon-blue text-sm font-medium">View All</button>
          </div>
        </div>
      </div>
    </section>
  );
}
