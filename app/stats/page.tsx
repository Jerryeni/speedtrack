"use client";

import { useRouter } from "next/navigation";
import PlatformStatsDashboard from "@/components/sections/stats/PlatformStatsDashboard";
import LiveActivityFeed from "@/components/sections/stats/LiveActivityFeed";
import { usePlatformStats } from "@/lib/web3/hooks/usePlatformStats";
import { useState, useEffect } from "react";

export default function StatsPage() {
  const router = useRouter();
  const { stats } = usePlatformStats(true);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">("all");

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="relative z-50 px-4 py-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-white">
                Platform Statistics
              </h1>
              <p className="text-xs text-gray-400">Live blockchain analytics</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
            <i className="fas fa-chart-bar text-neon-blue"></i>
          </div>
        </div>
      </header>

      {/* Time Range Selector */}
      <section className="px-4 py-4 bg-gray-900/50">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { value: "24h", label: "24 Hours" },
            { value: "7d", label: "7 Days" },
            { value: "30d", label: "30 Days" },
            { value: "all", label: "All Time" }
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                timeRange === range.value
                  ? "bg-gradient-to-r from-neon-blue to-electric-purple text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Statistics Dashboard */}
      <section className="px-4 py-6">
        <PlatformStatsDashboard showHeader={false} />
      </section>

      {/* Additional Insights */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-orbitron font-bold mb-4 text-white">
          Key Insights
        </h2>
        
        <div className="space-y-4">
          {/* Growth Metrics */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                <i className="fas fa-arrow-trend-up text-green-400"></i>
              </div>
              <div>
                <h3 className="font-semibold text-white">Growth Metrics</h3>
                <p className="text-xs text-gray-400">Platform expansion</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-2xl font-bold text-green-400">
                  {stats?.totalUsers || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Total Members</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-2xl font-bold text-neon-blue">
                  {stats?.activePools || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Active Pools</p>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                <i className="fas fa-dollar-sign text-yellow-400"></i>
              </div>
              <div>
                <h3 className="font-semibold text-white">Financial Overview</h3>
                <p className="text-xs text-gray-400">Money flow</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">Total Volume</span>
                <span className="text-white font-semibold">
                  ${parseFloat(stats?.totalInvested || '0').toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">ROI Paid</span>
                <span className="text-green-400 font-semibold">
                  ${parseFloat(stats?.totalROIPaid || '0').toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">Referral Income</span>
                <span className="text-electric-purple font-semibold">
                  ${parseFloat(stats?.totalLevelIncome || '0').toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400">Capital Returned</span>
                <span className="text-cyan-400 font-semibold">
                  ${parseFloat(stats?.totalCapitalReturned || '0').toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Token Distribution */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
                <i className="fas fa-coins text-pink-400"></i>
              </div>
              <div>
                <h3 className="font-semibold text-white">Token Distribution</h3>
                <p className="text-xs text-gray-400">ST Token rewards</p>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-pink-400 mb-2">
                ${parseFloat(stats?.totalSTDistributed || '0').toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-400">Total ST Tokens Distributed</p>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  <i className="fas fa-info-circle mr-1"></i>
                  ST Tokens are distributed as rewards for pool participation
                </p>
              </div>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center mr-3">
                <i className="fas fa-tachometer-alt text-neon-blue"></i>
              </div>
              <div>
                <h3 className="font-semibold text-white">Performance Metrics</h3>
                <p className="text-xs text-gray-400">Platform efficiency</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">User Activation Rate</span>
                  <span className="text-white font-semibold">
                    {stats && stats.totalUsers > 0 
                      ? ((stats.totalActivations / stats.totalUsers) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-neon-blue to-electric-purple h-2 rounded-full"
                    style={{ 
                      width: `${stats && stats.totalUsers > 0 
                        ? (stats.totalActivations / stats.totalUsers) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Average Investment</span>
                  <span className="text-white font-semibold">
                    ${stats && stats.totalUsers > 0 
                      ? (parseFloat(stats.totalInvested) / stats.totalUsers).toFixed(2) 
                      : '0.00'}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Pools per User</span>
                  <span className="text-white font-semibold">
                    {stats && stats.totalUsers > 0 
                      ? (stats.activePools / stats.totalUsers).toFixed(2) 
                      : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="px-4 py-6">
        <LiveActivityFeed maxItems={15} />
      </section>

      {/* Info Footer */}
      <section className="px-4 pb-6">
        <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <i className="fas fa-info-circle text-neon-blue mt-1"></i>
            <div>
              <p className="text-sm text-gray-300 mb-2">
                <strong className="text-white">Real-time Data:</strong> All statistics are fetched directly from the blockchain and updated every 5 minutes.
              </p>
              <p className="text-xs text-gray-400">
                Data includes all transactions since contract deployment. Historical data may take longer to load.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
