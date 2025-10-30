"use client";

export default function DashboardHeader() {
  return (
    <header className="relative z-50 px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center">
            <i className="fas fa-rocket text-dark-primary text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-orbitron font-bold text-neon-blue">Speed Track</h1>
            <p className="text-xs text-gray-400">Web3 Racing Finance</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center">
              <i className="fas fa-bell text-electric-purple text-sm"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
            <i className="fas fa-cog text-neon-blue text-sm"></i>
          </div>
          <img 
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border-2 border-neon-blue/50"
          />
        </div>
      </div>
    </header>
  );
}
