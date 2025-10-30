"use client";

interface LeaderboardTableProps {
  onViewProfile: (username: string) => void;
}

export default function LeaderboardTable({ onViewProfile }: LeaderboardTableProps) {
  const rankings = [
    { rank: 4, name: "SpeedRacer88", address: "0x4567...8901", earnings: "$64,890.00", referrals: 1234, change: +2, pool: "Pool Alpha", status: "Active", avatar: "avatar-2.jpg" },
    { rank: 5, name: "CryptoQueen", address: "0x5678...9012", earnings: "$58,720.00", referrals: 987, change: 0, pool: "Pool Beta", status: "VIP", avatar: "avatar-1.jpg" },
    { rank: 6, name: "PoolShark", address: "0x6789...0123", earnings: "$52,340.00", referrals: 756, change: +1, pool: "Pool Alpha", status: "Active", avatar: "avatar-4.jpg" },
    { rank: 7, name: "TokenHunter", address: "0x7890...1234", earnings: "$47,890.00", referrals: 623, change: +3, pool: "Pool Beta", status: "Rising", avatar: "avatar-9.jpg" },
    { rank: 8, name: "DiamondHands", address: "0x8901...2345", earnings: "$43,210.00", referrals: 534, change: -1, pool: "Pool Alpha", status: "Veteran", avatar: "avatar-6.jpg" },
  ];

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold">Rankings</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Showing 4-25 of 10,247</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-custom"></div>
              <span className="text-xs text-green-400">Live</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-700/50">
          {rankings.map((racer, index) => (
            <div
              key={racer.rank}
              onClick={() => onViewProfile(racer.name)}
              className="px-4 py-4 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-neon-blue/5 hover:to-electric-purple/5 hover:translate-x-2"
              style={{ animation: `slideInRank 0.6s ease-out ${index * 0.1}s both` }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${racer.rank <= 5 ? 'bg-electric-purple/20' : 'bg-gray-600/20'} flex items-center justify-center font-orbitron font-bold ${racer.rank <= 5 ? 'text-electric-purple' : 'text-gray-400'}`}>
                    {racer.rank}
                  </div>
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${racer.rank <= 5 ? 'border-electric-purple/30' : 'border-gray-600/30'}`}>
                    <img
                      src={`https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/${racer.avatar}`}
                      alt={racer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-orbitron font-semibold text-white">{racer.name}</h4>
                      <p className="text-xs text-gray-400">{racer.address}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`text-xs ${racer.rank <= 5 ? 'bg-electric-purple/20 text-electric-purple' : 'bg-neon-blue/20 text-neon-blue'} px-2 py-0.5 rounded-full`}>
                          {racer.pool}
                        </div>
                        <div className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          {racer.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${racer.rank <= 5 ? 'text-electric-purple' : 'text-white'}`}>
                        {racer.earnings}
                      </p>
                      <div className="flex items-center justify-end space-x-4 text-xs text-gray-400 mt-1">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-users"></i>
                          <span>{racer.referrals}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className={`fas fa-arrow-${racer.change > 0 ? 'up' : racer.change < 0 ? 'down' : 'minus'} ${racer.change > 0 ? 'text-green-400' : racer.change < 0 ? 'text-red-400' : 'text-gray-400'}`}></i>
                          <span className={racer.change > 0 ? 'text-green-400' : racer.change < 0 ? 'text-red-400' : 'text-gray-400'}>
                            {racer.change > 0 ? '+' : ''}{racer.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div
            onClick={() => onViewProfile("You")}
            className="px-4 py-4 bg-gradient-to-r from-neon-blue/10 to-electric-purple/10 border-y-2 border-neon-blue/30 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-neon-blue/30 flex items-center justify-center font-orbitron font-bold text-neon-blue animate-[statsGlow_4s_ease-in-out_infinite]">
                  47
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neon-blue/50">
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg"
                    alt="Your Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-orbitron font-semibold text-neon-blue">You (RaceTrader)</h4>
                    <p className="text-xs text-gray-400">0x9012...3456</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-full">Pool Alpha</div>
                      <div className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Active</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neon-blue text-lg">$8,950.00</p>
                    <div className="flex items-center justify-end space-x-4 text-xs text-gray-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-users"></i>
                        <span className="text-neon-blue">89</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-arrow-up text-green-400"></i>
                        <span className="text-green-400">+5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <button className="bg-gradient-to-r from-neon-blue/20 to-electric-purple/20 border border-neon-blue/30 rounded-xl px-4 py-2 text-sm font-medium text-neon-blue hover:border-electric-purple/40 transition-all">
              Load More Rankings
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Auto-refresh:</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-custom"></div>
              <span className="text-xs text-green-400">30s</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
