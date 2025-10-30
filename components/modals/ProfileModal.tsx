interface ProfileModalProps {
  username: string | null;
  onClose: () => void;
}

export default function ProfileModal({ username, onClose }: ProfileModalProps) {
  if (!username) return null;

  const isCurrentUser = username === "You";
  const displayName = isCurrentUser ? "RaceTrader" : username;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold">Racer Profile</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-times text-gray-300"></i>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-4 border-neon-blue/50">
              <img
                src={`https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-${Math.floor(Math.random() * 9) + 1}.jpg`}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-orbitron font-bold text-neon-blue text-xl">{displayName}</h4>
            <p className="text-xs text-gray-400">0x{Math.random().toString(16).substr(2, 4)}...{Math.random().toString(16).substr(2, 4)}</p>
            {isCurrentUser && (
              <div className="text-xs bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-full inline-block mt-2">
                Your Profile
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Current Rank</p>
              <p className="font-bold text-neon-blue text-2xl">#{isCurrentUser ? "47" : Math.floor(Math.random() * 100 + 1)}</p>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
              <p className="font-bold text-electric-purple text-lg">
                ${isCurrentUser ? "8,950" : (Math.random() * 50000 + 10000).toFixed(0)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Referrals</p>
              <p className="font-bold text-green-400 text-lg">
                {isCurrentUser ? "89" : Math.floor(Math.random() * 1000 + 100)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Rank Change</p>
              <p className="font-bold text-green-400 text-lg">+{Math.floor(Math.random() * 10 + 1)}</p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            {isCurrentUser ? (
              <button className="flex-1 bg-neon-blue text-dark-primary py-2 rounded-xl font-medium text-sm">
                Edit Profile
              </button>
            ) : (
              <button className="flex-1 bg-neon-blue text-dark-primary py-2 rounded-xl font-medium text-sm">
                Follow Racer
              </button>
            )}
            <button className="flex-1 bg-gray-700 text-white py-2 rounded-xl font-medium text-sm hover:bg-gray-600 transition-colors">
              {isCurrentUser ? "Share Profile" : "View Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
