"use client";

import { usePlatformStats } from "@/lib/web3/hooks/usePlatformStats";
import { useState } from "react";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  badge?: string;
  badgeBg?: string;
}

function StatCard({ icon, label, value, subValue, color, bgGradient, borderColor, iconBg, badge, badgeBg }: StatCardProps) {
  return (
    <div className={`${bgGradient} rounded-2xl p-4 border ${borderColor} hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
          <i className={`${icon} ${color}`}></i>
        </div>
        {badge && (
          <div className={`text-xs ${badgeBg} ${color} px-2 py-1 rounded-full`}>
            {badge}
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
      {subValue && (
        <p className="text-xs text-gray-500 mt-1">{subValue}</p>
      )}
    </div>
  );
}

interface PlatformStatsDashboardProps {
  showHeader?: boolean;
  compact?: boolean;
}

export default function PlatformStatsDashboard({ showHeader = true, compact = false }: PlatformStatsDashboardProps) {
  const { stats, isLoading, error, refresh } = usePlatformStats(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
        <i className="fas fa-exclamation-triangle text-red-400 text-3xl mb-3"></i>
        <p className="text-red-400 font-semibold mb-2">Failed to Load Statistics</p>
        <p className="text-sm text-gray-400 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <i className="fas fa-redo mr-2"></i>
          Retry
        </button>
      </div>
    );
  }

  if (isLoading && !stats) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-spinner fa-spin text-4xl text-neon-blue mb-4"></i>
        <p className="text-gray-400">Loading platform statistics...</p>
        <p className="text-xs text-gray-500 mt-2">Fetching data from blockchain</p>
      </div>
    );
  }

  const totalPaid = stats ? 
    parseFloat(stats.totalROIPaid) + 
    parseFloat(stats.totalLevelIncome) + 
    parseFloat(stats.totalCapitalReturned) : 0;

  const avgInvestmentPerUser = stats && stats.totalUsers > 0 ? 
    parseFloat(stats.totalInvested) / stats.totalUsers : 0;

  return (
    <div>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-1">
              Platform Statistics
            </h2>
            <p className="text-sm text-gray-400">Real-time blockchain data</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt mr-2 ${isRefreshing ? 'fa-spin' : ''}`}></i>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      )}

      {/* Primary Stats */}
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-4 mb-6`}>
        <StatCard
          icon="fas fa-users"
          label="Total Users"
          value={stats?.totalUsers.toLocaleString() || '0'}
          color="text-neon-blue"
          bgGradient="bg-gradient-to-br from-neon-blue/20 to-neon-blue/5"
          borderColor="border-neon-blue/30"
          iconBg="bg-neon-blue/20"
          badge="Registered"
          badgeBg="bg-neon-blue/20"
        />

        <StatCard
          icon="fas fa-check-circle"
          label="Activations"
          value={stats?.totalActivations.toLocaleString() || '0'}
          color="text-green-400"
          bgGradient="bg-gradient-to-br from-green-500/20 to-green-500/5"
          borderColor="border-green-500/30"
          iconBg="bg-green-500/20"
          badge="Active"
          badgeBg="bg-green-500/20"
        />

        <StatCard
          icon="fas fa-swimming-pool"
          label="Active Pools"
          value={stats?.activePools.toLocaleString() || '0'}
          color="text-cyan-400"
          bgGradient="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5"
          borderColor="border-cyan-500/30"
          iconBg="bg-cyan-500/20"
          badge="Pools"
          badgeBg="bg-cyan-500/20"
        />
      </div>

      {/* Financial Stats */}
      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mb-6`}>
        <StatCard
          icon="fas fa-coins"
          label="Total Invested"
          value={`$${parseFloat(stats?.totalInvested || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`Avg: $${avgInvestmentPerUser.toFixed(2)} per user`}
          color="text-yellow-400"
          bgGradient="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5"
          borderColor="border-yellow-500/30"
          iconBg="bg-yellow-500/20"
          badge="USDT"
          badgeBg="bg-yellow-500/20"
        />

        <StatCard
          icon="fas fa-hand-holding-usd"
          label="Total Paid Out"
          value={`$${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue="ROI + Level Income + Capital"
          color="text-green-400"
          bgGradient="bg-gradient-to-br from-green-500/20 to-green-500/5"
          borderColor="border-green-500/30"
          iconBg="bg-green-500/20"
          badge="USDT"
          badgeBg="bg-green-500/20"
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          icon="fas fa-chart-line"
          label="ROI Distributed"
          value={`$${parseFloat(stats?.totalROIPaid || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          color="text-electric-purple"
          bgGradient="bg-gradient-to-br from-electric-purple/20 to-electric-purple/5"
          borderColor="border-electric-purple/30"
          iconBg="bg-electric-purple/20"
        />

        <StatCard
          icon="fas fa-network-wired"
          label="Level Income"
          value={`$${parseFloat(stats?.totalLevelIncome || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          color="text-orange-400"
          bgGradient="bg-gradient-to-br from-orange-500/20 to-orange-500/5"
          borderColor="border-orange-500/30"
          iconBg="bg-orange-500/20"
        />

        <StatCard
          icon="fas fa-undo"
          label="Capital Returned"
          value={`$${parseFloat(stats?.totalCapitalReturned || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          color="text-cyan-400"
          bgGradient="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5"
          borderColor="border-cyan-500/30"
          iconBg="bg-cyan-500/20"
        />

        <StatCard
          icon="fas fa-gift"
          label="ST Tokens"
          value={`$${parseFloat(stats?.totalSTDistributed || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          color="text-pink-400"
          bgGradient="bg-gradient-to-br from-pink-500/20 to-pink-500/5"
          borderColor="border-pink-500/30"
          iconBg="bg-pink-500/20"
        />
      </div>

      {/* Platform Health Indicators */}
      {!compact && stats && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-orbitron font-bold mb-4 text-white">
            <i className="fas fa-heartbeat text-red-400 mr-2"></i>
            Platform Health
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Activation Rate</span>
                <span className="text-white font-semibold">
                  {stats.totalUsers > 0 ? ((stats.totalActivations / stats.totalUsers) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-neon-blue to-electric-purple h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalUsers > 0 ? (stats.totalActivations / stats.totalUsers) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Payout Ratio</span>
                <span className="text-white font-semibold">
                  {parseFloat(stats.totalInvested) > 0 
                    ? ((totalPaid / parseFloat(stats.totalInvested)) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${parseFloat(stats.totalInvested) > 0 
                      ? Math.min((totalPaid / parseFloat(stats.totalInvested)) * 100, 100) 
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      {stats && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            <i className="fas fa-clock mr-1"></i>
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
