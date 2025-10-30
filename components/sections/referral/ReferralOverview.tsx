export default function ReferralOverview() {
  return (
    <section className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-neon-blue/10 to-transparent rounded-2xl p-4 border border-neon-blue/20 animate-[referralGlow_3s_ease-in-out_infinite]">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-users text-neon-blue text-xl"></i>
            <div className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">Active</div>
          </div>
          <p className="text-2xl font-bold text-neon-blue animate-[countUp_2s_ease-out]">127</p>
          <p className="text-xs text-gray-400">Total Referrals</p>
          <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-neon-blue rounded-full racing-track"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-electric-purple/10 to-transparent rounded-2xl p-4 border border-electric-purple/20 animate-[referralGlow_3s_ease-in-out_infinite]">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-coins text-electric-purple text-xl"></i>
            <div className="text-xs bg-electric-purple/20 text-electric-purple px-2 py-1 rounded-full">Earning</div>
          </div>
          <p className="text-2xl font-bold text-electric-purple animate-[countUp_2s_ease-out]">$2,847</p>
          <p className="text-xs text-gray-400">Total Earned</p>
          <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-electric-purple rounded-full racing-track"></div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Team Performance</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-custom"></div>
            <span className="text-xs text-green-400">Growing</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-green-400">89</p>
            <p className="text-xs text-gray-400">Active Today</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-yellow-400">38</p>
            <p className="text-xs text-gray-400">New This Week</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-neon-blue">10</p>
            <p className="text-xs text-gray-400">Max Levels</p>
          </div>
        </div>
      </div>
    </section>
  );
}
