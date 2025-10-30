"use client";

export default function ProfileHeader() {
  return (
    <section className="px-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-neon-blue/50 animate-[avatarGlow_3s_ease-in-out_infinite]">
            <img 
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg" 
              alt="Profile Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-electric-purple flex items-center justify-center border-2 border-dark-primary"
          >
            <i className="fas fa-camera text-white text-sm"></i>
          </button>
        </div>

        <h2 className="font-orbitron font-bold text-2xl text-neon-blue mb-2">RaceTrader</h2>
        <p className="text-gray-400 text-sm mb-4">Racing Pool Champion</p>

        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-electric-purple animate-[statsCount_2s_ease-out]">47</p>
            <p className="text-xs text-gray-400">Global Rank</p>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-blue animate-[statsCount_2s_ease-out]">$8,950</p>
            <p className="text-xs text-gray-400">Total Earnings</p>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400 animate-[statsCount_2s_ease-out]">89</p>
            <p className="text-xs text-gray-400">Referrals</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Profile Completion</span>
            <span>85%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-neon-blue to-electric-purple rounded-full animate-[completionProgress_3s_ease-out] w-[85%]"></div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center space-x-1 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full animate-[verificationPulse_3s_ease-in-out_infinite]">
            <i className="fas fa-shield-alt"></i>
            <span>Verified</span>
          </div>
          <div className="flex items-center space-x-1 text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full animate-[achievementFloat_6s_ease-in-out_infinite]">
            <i className="fas fa-trophy"></i>
            <span>Top 50</span>
          </div>
        </div>
      </div>
    </section>
  );
}
