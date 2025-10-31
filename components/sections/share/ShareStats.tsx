interface ShareStatsProps {
  stats: any;
  isLoading: boolean;
}

export default function ShareStats({ stats, isLoading }: ShareStatsProps) {
  const totalReferrals = stats?.totalReferrals || 0;
  const totalEarned = parseFloat(stats?.totalEarned || '0').toFixed(2);
  const directReferrals = stats?.directReferrals || 0;

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden animate-[referralGlow_3s_ease-in-out_infinite]">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Your Referral Network</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-custom"></div>
              <span className="text-xs text-green-400">
                {isLoading ? 'Loading...' : 'Active'}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-orbitron font-bold text-neon-blue animate-[statsCount_2s_ease-out]">
                {isLoading ? '...' : totalReferrals}
              </div>
              <p className="text-xs text-gray-400 mt-1">Total Referrals</p>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-orbitron font-bold text-electric-purple animate-[statsCount_2s_ease-out]"
                style={{ animationDelay: "0.2s" }}
              >
                {isLoading ? '...' : `$${totalEarned}`}
              </div>
              <p className="text-xs text-gray-400 mt-1">Total Earned</p>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-orbitron font-bold text-green-400 animate-[statsCount_2s_ease-out]"
                style={{ animationDelay: "0.4s" }}
              >
                {isLoading ? '...' : directReferrals}
              </div>
              <p className="text-xs text-gray-400 mt-1">Direct Referrals</p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Referral Network Status</span>
              <span className="text-xs text-green-400">
                {totalReferrals > 0 ? 'Growing' : 'Start Sharing'}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-blue to-electric-purple rounded-full racing-track"
                style={{ width: totalReferrals > 0 ? '100%' : '0%' }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>Direct: {directReferrals}</span>
              <span>Network: {totalReferrals}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
