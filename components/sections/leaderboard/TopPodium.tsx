interface TopPodiumProps {
  onViewProfile: (username: string) => void;
}

export default function TopPodium({ onViewProfile }: TopPodiumProps) {
  const champion = {
    rank: 1,
    name: "CryptoKing92",
    address: "0x1234...5678",
    earnings: "$127,450.00",
    referrals: "2,847",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
  };

  const runners = [
    {
      rank: 2,
      name: "PoolMaster",
      address: "0x2345...6789",
      earnings: "$89,720.00",
      referrals: "1,923",
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
    },
    {
      rank: 3,
      name: "RaceHero",
      address: "0x3456...7890",
      earnings: "$76,340.00",
      referrals: "1,567",
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg",
    },
  ];

  return (
    <section className="px-4 mb-8">
      <div className="relative">
        <div className="text-center mb-6">
          <div
            onClick={() => onViewProfile(champion.name)}
            className="relative inline-block animate-[championAura_3s_ease-in-out_infinite] rounded-2xl p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/50 cursor-pointer"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center animate-[crownFloat_4s_ease-in-out_infinite]">
                <i className="fas fa-crown text-yellow-900 text-xl"></i>
              </div>
            </div>
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-4 border-yellow-500/50">
              <img src={champion.avatar} alt="Champion" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-orbitron font-bold text-yellow-400 text-lg">{champion.name}</h3>
            <p className="text-xs text-gray-400 mb-3">{champion.address}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <i className="fas fa-coins text-yellow-400"></i>
                <span className="font-bold text-yellow-400 animate-[countUp_2s_ease-out]">
                  {champion.earnings}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <i className="fas fa-users text-yellow-400"></i>
                <span className="text-yellow-400">{champion.referrals} Referrals</span>
              </div>
            </div>
            <div className="mt-3 text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full inline-block">
              <i className="fas fa-trophy mr-1"></i>Champion
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {runners.map((runner) => (
            <div
              key={runner.rank}
              onClick={() => onViewProfile(runner.name)}
              className={`${
                runner.rank === 2
                  ? "bg-gradient-to-br from-gray-400/20 to-gray-500/10 border-gray-400/30 animate-[podiumPulse_4s_ease-in-out_infinite]"
                  : "bg-gradient-to-br from-orange-600/20 to-orange-700/10 border-orange-600/30"
              } rounded-2xl p-4 border text-center cursor-pointer`}
            >
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full ${
                    runner.rank === 2 ? "bg-gray-400" : "bg-orange-600"
                  } flex items-center justify-center mx-auto mb-3 animate-[medalBounce_2s_ease-in-out_infinite]`}
                >
                  <span
                    className={`font-orbitron font-bold ${
                      runner.rank === 2 ? "text-gray-900" : "text-orange-900"
                    } text-sm`}
                  >
                    {runner.rank}
                  </span>
                </div>
                <div
                  className={`w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 ${
                    runner.rank === 2 ? "border-gray-400/50" : "border-orange-600/50"
                  }`}
                >
                  <img src={runner.avatar} alt={runner.name} className="w-full h-full object-cover" />
                </div>
                <h4
                  className={`font-orbitron font-semibold ${
                    runner.rank === 2 ? "text-gray-300" : "text-orange-400"
                  } text-sm`}
                >
                  {runner.name}
                </h4>
                <p className="text-xs text-gray-500 mb-2">{runner.address}</p>
                <div className="space-y-1">
                  <p
                    className={`font-bold ${
                      runner.rank === 2 ? "text-gray-300" : "text-orange-400"
                    } text-sm animate-[countUp_2s_ease-out]`}
                  >
                    {runner.earnings}
                  </p>
                  <p className="text-xs text-gray-400">{runner.referrals} Referrals</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
