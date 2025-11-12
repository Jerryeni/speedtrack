"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getRootLeaderDashboard } from "@/lib/web3/rootLeader";

export default function RootLeaderDashboard() {
  const { account, isConnected } = useWeb3();
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!account || !isConnected) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getRootLeaderDashboard(account);
        setDashboard(data);
      } catch (error) {
        console.error("Error loading root leader dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected]);

  if (!isConnected || isLoading) return null;

  // Don't show if not a root leader
  if (!dashboard || !dashboard.isRootLeader) return null;

  return (
    <div className="space-y-6">
      {/* Root Leader Badge */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border border-yellow-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <i className="fas fa-crown text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-orbitron font-bold text-white">Root Leader</h3>
              <p className="text-sm text-gray-400">You have exclusive pool ownership privileges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Pools</span>
            <i className="fas fa-swimming-pool text-blue-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{dashboard.totalPools}</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-4 border border-green-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Active Pools</span>
            <i className="fas fa-play-circle text-green-400"></i>
          </div>
          <p className="text-2xl font-bold text-green-400">{dashboard.activePools}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-4 border border-purple-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Completed</span>
            <i className="fas fa-check-circle text-purple-400"></i>
          </div>
          <p className="text-2xl font-bold text-purple-400">{dashboard.completedPools}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl p-4 border border-yellow-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Size</span>
            <i className="fas fa-chart-line text-yellow-400"></i>
          </div>
          <p className="text-2xl font-bold text-yellow-400">${parseFloat(dashboard.totalSize).toFixed(0)}</p>
        </div>
      </div>

      {/* Pools List */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-orbitron font-bold mb-4 text-white flex items-center">
          <i className="fas fa-list text-neon-blue mr-3"></i>
          Your Pools
        </h3>

        {dashboard.pools.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-swimming-pool text-gray-600 text-4xl mb-3"></i>
            <p className="text-gray-400">No pools created yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.pools.map((pool: any, index: number) => (
              <div
                key={pool.poolId}
                className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      pool.isActive
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      <span className="text-white font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Pool ID: {pool.poolId}</p>
                      <p className="text-xs text-gray-400">
                        {pool.isActive ? 'Active & Accepting Investments' : 'Completed'}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    pool.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {pool.isActive ? 'Active' : 'Completed'}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Fill Progress</span>
                    <span className="text-xs font-semibold text-white">
                      {pool.percentFilled.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        pool.percentFilled >= 100
                          ? 'bg-green-500'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}
                      style={{ width: `${Math.min(pool.percentFilled, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pool Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-900/50 rounded-lg p-2">
                    <p className="text-gray-400 mb-1">Pool Size</p>
                    <p className="font-semibold text-white">${parseFloat(pool.size).toFixed(0)}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-2">
                    <p className="text-gray-400 mb-1">Filled</p>
                    <p className="font-semibold text-white">${parseFloat(pool.currentFilled).toFixed(0)}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-2">
                    <p className="text-gray-400 mb-1">Unpaid Capital</p>
                    <p className="font-semibold text-yellow-400">${parseFloat(pool.unpaidCapital).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial Summary */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-orbitron font-bold mb-4 text-white flex items-center">
          <i className="fas fa-chart-pie text-neon-blue mr-3"></i>
          Financial Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-2">Total Pool Size</p>
            <p className="text-2xl font-bold text-white">${parseFloat(dashboard.totalSize).toFixed(2)}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-2">Total Filled</p>
            <p className="text-2xl font-bold text-green-400">${parseFloat(dashboard.totalFilled).toFixed(2)}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-2">Unpaid Capital</p>
            <p className="text-2xl font-bold text-yellow-400">${parseFloat(dashboard.totalUnpaid).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
