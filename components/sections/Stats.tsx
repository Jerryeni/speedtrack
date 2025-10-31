"use client";

import { useEffect, useState } from "react";
import { getCurrentPool, getPoolInfo } from "@/lib/web3/pools";
import { getSpeedTrackReadOnly } from "@/lib/web3/contracts";
import { ethers } from "ethers";
import StatCard from "@/components/ui/StatCard";

export default function Stats() {
  const [stats, setStats] = useState({
    currentPool: 0,
    totalLiquidity: "0",
    poolProgress: 0,
    investorCount: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const poolNum = await getCurrentPool();
        const poolInfo = await getPoolInfo(poolNum);
        const speedTrack = await getSpeedTrackReadOnly();
        const liquidity = await speedTrack.getTotalLiquidity();

        setStats({
          currentPool: poolNum,
          totalLiquidity: ethers.formatEther(liquidity),
          poolProgress: poolInfo.progress,
          investorCount: poolInfo.investorCount
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-4 mb-8">
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-3xl p-6 border border-gray-700 backdrop-blur-sm">
        <h3 className="text-center text-lg font-orbitron font-bold mb-6 text-neon-blue">
          Live Racing Stats
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard 
            value={`Pool #${stats.currentPool}`}
            label="Current Pool" 
            color="text-neon-blue"
            progress={stats.poolProgress}
          />
          <StatCard 
            value={`${parseFloat(stats.totalLiquidity).toFixed(0)} USDT`}
            label="Total Liquidity" 
            color="text-electric-purple"
            progress={75}
          />
          <StatCard 
            value={stats.currentPool > 0 ? (stats.currentPool - 1).toString() : "0"}
            label="Pools Completed" 
            color="text-green-400"
            progress={100}
          />
          <StatCard 
            value={stats.investorCount.toString()}
            label="Active Investors" 
            color="text-yellow-400"
            progress={66}
          />
        </div>

        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse-custom"></div>
            <span className="text-gray-400">Live Updates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-custom"></div>
            <span className="text-gray-400">Real-time Rewards</span>
          </div>
        </div>
      </div>
    </section>
  );
}
