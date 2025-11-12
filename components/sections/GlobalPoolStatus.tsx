"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getGlobalPoolStatus, isEligibleForGlobal, type GlobalPoolInfo } from "@/lib/web3/teamStats";

export default function GlobalPoolStatus() {
  const { account, isConnected } = useWeb3();
  const [poolInfo, setPoolInfo] = useState<GlobalPoolInfo | null>(null);
  const [isEligible, setIsEligible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPoolStatus() {
      if (!account || !isConnected) {
        setIsLoading(false);
        return;
      }

      try {
        const [info, eligible] = await Promise.all([
          getGlobalPoolStatus(),
          isEligibleForGlobal(account)
        ]);

        setPoolInfo(info);
        setIsEligible(eligible);
      } catch (error) {
        console.error("Error loading global pool status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPoolStatus();
    const interval = setInterval(loadPoolStatus, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected]);

  if (!isConnected || isLoading) {
    return null;
  }

  if (!poolInfo) {
    return null;
  }

  const percentFilled = parseInt(poolInfo.percentFilled);
  const hoursLeft = Math.floor(parseInt(poolInfo.estimatedTimeLeft) / 3600);

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <i className="fas fa-globe text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-orbitron font-bold text-white">Global Pool #{poolInfo.currentPoolNumber}</h3>
                <p className="text-xs text-gray-400">Community Investment Pool</p>
              </div>
            </div>
            {isEligible && (
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                <i className="fas fa-check-circle mr-1"></i>
                Eligible
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Pool Progress</span>
              <span className="text-sm font-bold text-white">{percentFilled}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(percentFilled, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Total Invested</p>
              <p className="text-lg font-bold text-white">${parseFloat(poolInfo.totalInvested).toFixed(2)}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Pool Capacity</p>
              <p className="text-lg font-bold text-white">${parseFloat(poolInfo.poolCapacity).toFixed(2)}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Participants</p>
              <p className="text-lg font-bold text-white">{poolInfo.totalParticipants}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Est. Time Left</p>
              <p className="text-lg font-bold text-white">{hoursLeft}h</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${poolInfo.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-400">
                {poolInfo.isActive ? 'Active & Accepting Investments' : 'Pool Closed'}
              </span>
            </div>
            {poolInfo.isActive && isEligible && (
              <button
                onClick={() => window.location.href = '/trade'}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Invest Now
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
