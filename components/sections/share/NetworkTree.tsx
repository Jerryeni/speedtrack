"use client";

import { showToast } from "@/lib/toast";

export default function NetworkTree() {
  const levels = [
    {
      level: 1,
      name: "Direct Referrals",
      users: 89,
      earned: "$2,145.30",
      gradient: "from-neon-blue to-electric-purple",
      bgColor: "bg-neon-blue/10",
      borderColor: "border-neon-blue/30",
      textColor: "text-neon-blue",
      delay: "0s",
    },
    {
      level: 2,
      name: "Level 2 Network",
      users: 134,
      earned: "$1,072.65",
      gradient: "from-electric-purple to-green-400",
      bgColor: "bg-electric-purple/10",
      borderColor: "border-electric-purple/30",
      textColor: "text-electric-purple",
      delay: "0.2s",
    },
    {
      level: 3,
      name: "Level 3 Network",
      users: 24,
      earned: "$312.25",
      gradient: "from-green-400 to-yellow-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
      textColor: "text-green-400",
      delay: "0.4s",
    },
  ];

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Your Network Tree</h3>
            <button
              onClick={() => showToast("Expanding network tree view...")}
              className="text-neon-blue hover:text-electric-purple transition-colors"
            >
              <i className="fas fa-expand-alt"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          {levels.map((level) => (
            <div key={level.level} className="mb-6 last:mb-0">
              <div
                className={`flex items-center justify-between ${level.bgColor} rounded-xl p-4 border ${level.borderColor} animate-[treeNodeFloat_4s_ease-in-out_infinite]`}
                style={{ animationDelay: level.delay }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${level.gradient} flex items-center justify-center`}
                  >
                    <span className="font-orbitron font-bold text-sm">L{level.level}</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{level.name}</div>
                    <div className="text-xs text-gray-400">{level.users} Active Users</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-orbitron font-bold ${level.textColor}`}>
                    {level.earned}
                  </div>
                  <div className="text-xs text-gray-400">Total Earned</div>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              onClick={() => showToast("Opening full network visualization...")}
              className="bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
            >
              <i className="fas fa-sitemap mr-2"></i>
              View Full Network Tree
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
