"use client";

import { showToast } from "@/lib/toast";

interface ReferralTreeProps {
  levels: any[];
  isLoading: boolean;
}

export default function ReferralTree({ levels, isLoading }: ReferralTreeProps) {
  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron font-bold">Referral Tree</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => showToast("Tree expanded to show all levels")}
            className="text-neon-blue text-sm font-medium"
          >
            Expand All
          </button>
          <button
            onClick={() => showToast("Tree collapsed to show main branches")}
            className="text-gray-400 text-sm"
          >
            Collapse
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <i className="fas fa-spinner fa-spin text-3xl mb-2"></i>
              <p>Loading network tree...</p>
            </div>
          </div>
        ) : levels.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <i className="fas fa-users-slash text-5xl mb-4 opacity-50"></i>
              <p className="font-medium mb-2">No Network Yet</p>
              <p className="text-sm">Start sharing your referral link to build your network!</p>
            </div>
          </div>
        ) : (
          <div className="h-80 overflow-auto">
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-neon-blue/20 border-2 border-neon-blue flex items-center justify-center transition-transform hover:scale-105">
                  <span className="font-bold text-neon-blue">You</span>
                </div>
              </div>

              {levels.slice(0, 3).map((level, index) => (
                <div key={level.level} className="flex flex-col items-center space-y-2">
                  <div className="w-1 h-8 bg-neon-blue/30"></div>
                  <div className="flex justify-center space-x-4">
                    {Array.from({ length: Math.min(level.users, 6) }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${
                          index === 0 ? 'bg-electric-purple/20 border-2 border-electric-purple' :
                          index === 1 ? 'bg-green-400/20 border-2 border-green-400' :
                          'bg-yellow-400/20 border-2 border-yellow-400'
                        } flex items-center justify-center transition-transform hover:scale-105`}>
                          <span className={`text-xs font-semibold ${
                            index === 0 ? 'text-electric-purple' :
                            index === 1 ? 'text-green-400' :
                            'text-yellow-400'
                          }`}>
                            L{level.level}
                          </span>
                        </div>
                      </div>
                    ))}
                    {level.users > 6 && (
                      <div className="flex items-center justify-center">
                        <span className="text-xs text-gray-400">+{level.users - 6}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-neon-blue"></div>
              <span className="text-xs text-gray-400">Level 1-3</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-electric-purple"></div>
              <span className="text-xs text-gray-400">Level 4-6</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-xs text-gray-400">Level 7-10</span>
            </div>
          </div>
          <button
            onClick={() => showToast("Full screen tree view coming soon")}
            className="text-gray-400 hover:text-neon-blue transition-colors"
          >
            <i className="fas fa-expand"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
