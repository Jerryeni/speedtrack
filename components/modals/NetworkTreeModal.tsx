"use client";

import { useState, useEffect } from "react";
import { getNetworkLevels } from "@/lib/web3/referrals";
import { getLevelPercentages } from "@/lib/web3/rewards";

interface NetworkTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string;
}

export default function NetworkTreeModal({ isOpen, onClose, userAddress }: NetworkTreeModalProps) {
  const [levels, setLevels] = useState<any[]>([]);
  const [percentages, setPercentages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!isOpen || !userAddress) return;

      try {
        setIsLoading(true);
        const [networkLevels, levelPercs] = await Promise.all([
          getNetworkLevels(userAddress),
          getLevelPercentages()
        ]);

        setLevels(networkLevels);
        setPercentages(levelPercs);
      } catch (error) {
        console.error('Error fetching network tree data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [isOpen, userAddress]);

  if (!isOpen) return null;

  const allLevels = Array.from({ length: 10 }, (_, i) => {
    const existingLevel = levels.find(l => l.level === i + 1);
    return {
      level: i + 1,
      users: existingLevel?.users || 0,
      earned: existingLevel?.earned || '0',
      percentage: percentages[i] || 0
    };
  });

  const totalUsers = allLevels.reduce((sum, l) => sum + l.users, 0);
  const totalEarned = allLevels.reduce((sum, l) => sum + parseFloat(l.earned), 0);

  const getLevelColor = (level: number) => {
    const colors = [
      { gradient: 'from-neon-blue to-blue-400', text: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30' },
      { gradient: 'from-electric-purple to-purple-400', text: 'text-electric-purple', bg: 'bg-electric-purple/10', border: 'border-electric-purple/30' },
      { gradient: 'from-green-400 to-green-500', text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
      { gradient: 'from-yellow-400 to-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
      { gradient: 'from-pink-400 to-pink-500', text: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/30' },
      { gradient: 'from-cyan-400 to-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
      { gradient: 'from-orange-400 to-orange-500', text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
      { gradient: 'from-red-400 to-red-500', text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
      { gradient: 'from-indigo-400 to-indigo-500', text: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/30' },
      { gradient: 'from-teal-400 to-teal-500', text: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/30' }
    ];
    return colors[(level - 1) % colors.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700 relative">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-neon-blue mb-2">
                Full Network Tree
              </h2>
              <p className="text-sm text-gray-400">10-Level Referral Network Visualization</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <i className="fas fa-times text-gray-400"></i>
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-orbitron font-bold text-neon-blue">
                {isLoading ? '...' : totalUsers}
              </div>
              <p className="text-xs text-gray-400 mt-1">Total Network</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-orbitron font-bold text-green-400">
                ${isLoading ? '...' : totalEarned.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400 mt-1">Total Earned</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-orbitron font-bold text-electric-purple">
                {levels.length}
              </div>
              <p className="text-xs text-gray-400 mt-1">Active Levels</p>
            </div>
          </div>
        </div>

        {/* Network Tree */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {isLoading ? (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-4xl text-neon-blue mb-4"></i>
              <p className="text-gray-400">Loading network tree...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allLevels.map((level, index) => {
                const colors = getLevelColor(level.level);
                const isActive = level.users > 0;
                const isSelected = selectedLevel === level.level;

                return (
                  <div
                    key={level.level}
                    className={`relative transition-all duration-300 ${
                      isSelected ? 'scale-105' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Connection Line */}
                    {index > 0 && (
                      <div className="absolute left-8 -top-4 w-0.5 h-4 bg-gradient-to-b from-gray-600 to-transparent"></div>
                    )}

                    <div
                      onClick={() => setSelectedLevel(isSelected ? null : level.level)}
                      className={`${colors.bg} rounded-xl p-4 border ${colors.border} cursor-pointer hover:scale-[1.02] transition-all ${
                        !isActive ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Level Info */}
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                            <span className="font-orbitron font-bold text-xl text-white">
                              L{level.level}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`font-orbitron font-bold text-lg ${colors.text}`}>
                                Level {level.level}
                              </h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                                {level.percentage}%
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>
                                <i className="fas fa-users mr-1"></i>
                                {level.users} {level.users === 1 ? 'User' : 'Users'}
                              </span>
                              {isActive && (
                                <span>
                                  <i className="fas fa-coins mr-1"></i>
                                  ${level.earned} Earned
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Earnings */}
                        <div className="text-right">
                          <div className={`text-2xl font-orbitron font-bold ${colors.text}`}>
                            ${level.earned}
                          </div>
                          <p className="text-xs text-gray-400">Commission</p>
                        </div>

                        {/* Expand Icon */}
                        <div className="ml-4">
                          <i className={`fas fa-chevron-${isSelected ? 'up' : 'down'} ${colors.text}`}></i>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isSelected && isActive && (
                        <div className="mt-4 pt-4 border-t border-gray-700 animate-slide-down">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">Commission Rate</p>
                              <p className={`text-lg font-orbitron font-bold ${colors.text}`}>
                                {level.percentage}%
                              </p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">Active Members</p>
                              <p className={`text-lg font-orbitron font-bold ${colors.text}`}>
                                {level.users}
                              </p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">Total Earned</p>
                              <p className="text-lg font-orbitron font-bold text-green-400">
                                ${level.earned}
                              </p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">Avg per User</p>
                              <p className="text-lg font-orbitron font-bold text-electric-purple">
                                ${level.users > 0 ? (parseFloat(level.earned) / level.users).toFixed(2) : '0.00'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Empty State */}
                      {isSelected && !isActive && (
                        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
                          <i className="fas fa-users-slash text-3xl text-gray-600 mb-2"></i>
                          <p className="text-sm text-gray-400">No members in this level yet</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Share your referral link to grow your network
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              <i className="fas fa-info-circle mr-1"></i>
              Click on any level to see detailed statistics
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-2 px-6 rounded-xl hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
