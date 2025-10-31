"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";
import NetworkTreeModal from "@/components/modals/NetworkTreeModal";

interface NetworkTreeProps {
  levels: any[];
  isLoading: boolean;
  userAddress?: string;
}

export default function NetworkTree({ levels, isLoading, userAddress }: NetworkTreeProps) {
  const [showFullTree, setShowFullTree] = useState(false);
  const levelConfigs = [
    {
      name: "Direct Referrals",
      gradient: "from-neon-blue to-electric-purple",
      bgColor: "bg-neon-blue/10",
      borderColor: "border-neon-blue/30",
      textColor: "text-neon-blue",
      delay: "0s",
    },
    {
      name: "Level 2 Network",
      gradient: "from-electric-purple to-green-400",
      bgColor: "bg-electric-purple/10",
      borderColor: "border-electric-purple/30",
      textColor: "text-electric-purple",
      delay: "0.2s",
    },
    {
      name: "Level 3 Network",
      gradient: "from-green-400 to-yellow-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
      textColor: "text-green-400",
      delay: "0.4s",
    },
  ];

  const displayLevels = levels.map((level, index) => ({
    ...level,
    ...levelConfigs[Math.min(index, levelConfigs.length - 1)],
    name: levelConfigs[Math.min(index, levelConfigs.length - 1)].name
  }));

  return (
    <section className="px-4 md:px-6 lg:px-8 mb-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-base md:text-lg">Your Network Tree</h3>
            <button
              onClick={() => showToast("Expanding network tree view...")}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neon-blue hover:text-electric-purple transition-colors active:scale-95"
            >
              <i className="fas fa-expand-alt"></i>
            </button>
          </div>
        </div>
        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
              <p>Loading network data...</p>
            </div>
          ) : displayLevels.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-users text-4xl mb-4 opacity-50"></i>
              <p className="font-medium mb-2">No Network Yet</p>
              <p className="text-sm">Start sharing your referral link to build your network!</p>
            </div>
          ) : (
            displayLevels.map((level) => (
              <div key={level.level} className="mb-4 md:mb-6 last:mb-0">
                <div
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${level.bgColor} rounded-xl p-4 border ${level.borderColor} animate-[treeNodeFloat_4s_ease-in-out_infinite]`}
                  style={{ animationDelay: level.delay }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`min-w-[40px] min-h-[40px] md:w-10 md:h-10 rounded-full bg-gradient-to-r ${level.gradient} flex items-center justify-center`}
                    >
                      <span className="font-orbitron font-bold text-sm">L{level.level}</span>
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm md:text-base">{level.name}</div>
                      <div className="text-xs text-gray-400">{level.users} Active Users</div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right ml-[52px] sm:ml-0">
                    <div className={`text-base md:text-lg font-orbitron font-bold ${level.textColor}`}>
                      ${level.earned}
                    </div>
                    <div className="text-xs text-gray-400">Total Earned</div>
                  </div>
                </div>
              </div>
            ))
          )}

          {displayLevels.length > 0 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowFullTree(true)}
                className="bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 px-4 md:px-6 rounded-xl hover:shadow-lg transition-all active:scale-95 min-h-[48px] w-full sm:w-auto text-sm md:text-base"
              >
                <i className="fas fa-sitemap mr-2"></i>
                View Full Network Tree
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Network Tree Modal */}
      {userAddress && (
        <NetworkTreeModal
          isOpen={showFullTree}
          onClose={() => setShowFullTree(false)}
          userAddress={userAddress}
        />
      )}
    </section>
  );
}
