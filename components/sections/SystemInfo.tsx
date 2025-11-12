"use client";

import { useEffect, useState } from "react";
import { getSystemConfig, getLevelPercents, type SystemConfig, type LevelPercent } from "@/lib/web3/systemConfig";

export default function SystemInfo() {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [levelPercents, setLevelPercents] = useState<LevelPercent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSystemInfo() {
      try {
        const [sysConfig, levels] = await Promise.all([
          getSystemConfig(),
          getLevelPercents()
        ]);
        setConfig(sysConfig);
        setLevelPercents(levels);
      } catch (error) {
        console.error("Error loading system info:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSystemInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!config) return null;

  const formatPercent = (value: string) => {
    return `${(parseFloat(value) / 100).toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Platform Percentages */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-orbitron font-bold mb-4 text-white flex items-center">
          <i className="fas fa-cog text-neon-blue mr-3"></i>
          Platform Configuration
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Daily ROI</span>
              <i className="fas fa-percentage text-green-400"></i>
            </div>
            <p className="text-2xl font-bold text-green-400">{formatPercent(config.dailyROI)}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Capital Return</span>
              <i className="fas fa-undo text-yellow-400"></i>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{formatPercent(config.capitalReturn)}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Level Income</span>
              <i className="fas fa-users text-purple-400"></i>
            </div>
            <p className="text-2xl font-bold text-purple-400">{formatPercent(config.levelIncome)}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Reserve</span>
              <i className="fas fa-vault text-blue-400"></i>
            </div>
            <p className="text-2xl font-bold text-blue-400">{formatPercent(config.reserve)}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Reward</span>
              <i className="fas fa-gift text-pink-400"></i>
            </div>
            <p className="text-2xl font-bold text-pink-400">{formatPercent(config.reward)}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">ST Liquidity</span>
              <i className="fas fa-coins text-orange-400"></i>
            </div>
            <p className="text-2xl font-bold text-orange-400">{formatPercent(config.stLiquidity)}</p>
          </div>
        </div>
      </div>

      {/* Pool Configuration */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-orbitron font-bold mb-4 text-white flex items-center">
          <i className="fas fa-swimming-pool text-neon-blue mr-3"></i>
          Pool Settings
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Initial Pool Size</p>
            <p className="text-xl font-bold text-white">${config.initialPoolSize}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Pool Multiplier</p>
            <p className="text-xl font-bold text-white">{config.poolMultiplier}x</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Personal Pools Limit</p>
            <p className="text-xl font-bold text-white">{config.personalPoolsLimit}</p>
          </div>
        </div>
      </div>

      {/* Level Income Distribution */}
      {levelPercents.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-orbitron font-bold mb-4 text-white flex items-center">
            <i className="fas fa-layer-group text-neon-blue mr-3"></i>
            Level Income Distribution
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {levelPercents.map((level) => (
              <div key={level.level} className="bg-gray-800/50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Level {level.level}</p>
                <p className="text-lg font-bold text-neon-blue">{level.formattedPercent}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-400">
              <i className="fas fa-info-circle mr-2"></i>
              Income is distributed across 10 levels of your downline network
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
