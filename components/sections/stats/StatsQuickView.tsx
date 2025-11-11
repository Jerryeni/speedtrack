"use client";

import { usePlatformStats } from "@/lib/web3/hooks/usePlatformStats";
import Link from "next/link";

export default function StatsQuickView() {
  const { stats, isLoading } = usePlatformStats(true);

  if (isLoading && !stats) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-center py-8">
          <i className="fas fa-spinner fa-spin text-2xl text-neon-blue"></i>
        </div>
      </div>
    );
  }

  const totalPaid = stats ? 
    parseFloat(stats.totalROIPaid) + 
    parseFloat(stats.totalLevelIncome) + 
    parseFloat(stats.totalCapitalReturned) : 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
            <i className="fas fa-chart-bar text-neon-blue"></i>
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-white">Platform Stats</h3>
            <p className="text-xs text-gray-400">Live blockchain data</p>
          </div>
        </div>
        <Link
          href="/stats"
          className="text-xs text-neon-blue hover:text-electric-purple transition-colors font-semibold"
        >
          View All <i className="fas fa-arrow-right ml-1"></i>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-2">
            <i className="fas fa-users text-neon-blue text-sm"></i>
            <span className="text-xs text-gray-400">Users</span>
          </div>
          <p className="text-xl font-bold text-white">
            {stats?.totalUsers.toLocaleString() || '0'}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-2">
            <i className="fas fa-coins text-yellow-400 text-sm"></i>
            <span className="text-xs text-gray-400">Invested</span>
          </div>
          <p className="text-xl font-bold text-white">
            ${parseFloat(stats?.totalInvested || '0').toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-2">
            <i className="fas fa-hand-holding-usd text-green-400 text-sm"></i>
            <span className="text-xs text-gray-400">Paid Out</span>
          </div>
          <p className="text-xl font-bold text-white">
            ${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-2">
            <i className="fas fa-swimming-pool text-cyan-400 text-sm"></i>
            <span className="text-xs text-gray-400">Pools</span>
          </div>
          <p className="text-xl font-bold text-white">
            {stats?.activePools || '0'}
          </p>
        </div>
      </div>

      <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fas fa-chart-line text-neon-blue text-sm"></i>
            <span className="text-xs text-gray-300">Platform Health</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-semibold">Active</span>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">Activation Rate</span>
            <span className="text-white font-semibold">
              {stats && stats.totalUsers > 0 
                ? ((stats.totalActivations / stats.totalUsers) * 100).toFixed(1) 
                : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-neon-blue to-electric-purple h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${stats && stats.totalUsers > 0 
                  ? (stats.totalActivations / stats.totalUsers) * 100 
                  : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
