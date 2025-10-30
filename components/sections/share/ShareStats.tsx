export default function ShareStats() {
  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden animate-[referralGlow_3s_ease-in-out_infinite]">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Your Referral Network</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-custom"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-orbitron font-bold text-neon-blue animate-[statsCount_2s_ease-out]">
                247
              </div>
              <p className="text-xs text-gray-400 mt-1">Total Referrals</p>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-orbitron font-bold text-electric-purple animate-[statsCount_2s_ease-out]"
                style={{ animationDelay: "0.2s" }}
              >
                $3,530
              </div>
              <p className="text-xs text-gray-400 mt-1">Total Earned</p>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-orbitron font-bold text-green-400 animate-[statsCount_2s_ease-out]"
                style={{ animationDelay: "0.4s" }}
              >
                89
              </div>
              <p className="text-xs text-gray-400 mt-1">Active This Week</p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Referral Link Performance</span>
              <span className="text-xs text-green-400">+23% this week</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-neon-blue to-electric-purple rounded-full racing-track"></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>Clicks: 1,234</span>
              <span>Conversion: 20%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
