"use client";

import { usePlatformStats } from "@/lib/web3/hooks/usePlatformStats";
import StatCard from "@/components/ui/StatCard";

export default function Stats() {
  const { stats, isLoading } = usePlatformStats();

  if (isLoading && !stats) {
    return (
      <section className="px-4 mb-8">
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-3xl p-6 border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center justify-center py-8">
            <i className="fas fa-spinner fa-spin text-2xl text-neon-blue"></i>
          </div>
        </div>
      </section>
    );
  }

  const activationRate = stats && stats.totalUsers > 0 
    ? (stats.totalActivations / stats.totalUsers) * 100 
    : 0;

  return (
    <section className="px-4 mb-8">
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-3xl p-6 border border-gray-700 backdrop-blur-sm">
        <h3 className="text-center text-lg font-orbitron font-bold mb-6 text-neon-blue">
          Live Platform Stats
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard 
            value={stats?.totalUsers.toLocaleString() || "0"}
            label="Total Users" 
            color="text-neon-blue"
            progress={activationRate}
          />
          <StatCard 
            value={`$${parseFloat(stats?.totalInvested || '0').toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            label="Total Invested" 
            color="text-electric-purple"
            progress={75}
          />
          <StatCard 
            value={stats?.activePools.toString() || "0"}
            label="Active Pools" 
            color="text-green-400"
            progress={100}
          />
          <StatCard 
            value={stats?.totalActivations.toString() || "0"}
            label="Activations" 
            color="text-yellow-400"
            progress={activationRate}
          />
        </div>

        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse-custom"></div>
            <span className="text-gray-400">Live Updates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-custom"></div>
            <span className="text-gray-400">Real-time Data</span>
          </div>
        </div>
      </div>
    </section>
  );
}
