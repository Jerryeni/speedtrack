"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getPoolInfo } from "@/lib/web3/pools";
import { usePlatformStats } from "@/lib/web3/hooks/usePlatformStats";

export default function PoolProgress() {
  const { isConnected, isCorrectChain } = useWeb3();
  const { stats } = usePlatformStats();
  const [poolData, setPoolData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoolData() {
      if (!isConnected || !isCorrectChain) {
        setLoading(false);
        return;
      }

      try {
        // Use the most recent active pool (activePools gives us the count)
        const currentPoolNum = stats?.activePools || 1;
        const poolInfo = await getPoolInfo(currentPoolNum);
        
        // Transform to expected format
        setPoolData({
          poolNumber: poolInfo.poolIndex,
          capacity: poolInfo.size,
          currentAmount: poolInfo.currentFilled,
          filled: poolInfo.progress >= 100,
          progress: poolInfo.progress,
          investorCount: poolInfo.queueLength
        });
      } catch (error: any) {
        console.error("Failed to fetch pool data:", error?.message || error);
        // Set default pool data on error
        setPoolData({
          poolNumber: stats?.activePools || 1,
          capacity: '0',
          currentAmount: '0',
          filled: false,
          progress: 0,
          investorCount: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPoolData();
    const interval = setInterval(fetchPoolData, 30000);
    return () => clearInterval(interval);
  }, [isConnected, isCorrectChain, stats]);

  if (loading || !poolData) {
    return (
      <section className="px-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700">
          <div className="text-center text-gray-400">Loading pool data...</div>
        </div>
      </section>
    );
  }

  const cycleNumber = poolData.poolNumber || 1;
  const completion = Math.round(poolData.progress || 0);
  const participants = poolData.investorCount || 0;
  const currentAmount = parseFloat(poolData.currentAmount || '0');
  const totalPool = `${currentAmount.toFixed(2)} USDT`;
  const timeLeft = poolData.filled ? "Completed" : "Active";
  return (
    <section className="px-4 mb-8">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-orbitron font-bold text-neon-blue">
              Active Pool Progress
            </h2>
            <p className="text-sm text-gray-400">Racing Cycle #{cycleNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-electric-purple">{completion}%</div>
            <div className="text-xs text-gray-400">Completion</div>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="h-16 bg-gray-800 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 pool-progress-track opacity-30"></div>
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-neon-blue via-electric-purple to-neon-blue rounded-2xl transition-all duration-1000 ease-out"
              style={{ width: `${completion}%` }}
            ></div>

            <div
              className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out animate-floating"
              style={{ left: `${completion - 4}%` }}
            >
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                <i className="fas fa-car text-dark-primary text-sm"></i>
              </div>
            </div>

            <div className="absolute top-0 left-1/4 w-1 h-full bg-gray-600 opacity-50"></div>
            <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-600 opacity-50"></div>
            <div className="absolute top-0 left-3/4 w-1 h-full bg-gray-600 opacity-50"></div>
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Start</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>Finish</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-neon-blue">{participants}</div>
            <div className="text-xs text-gray-400">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-electric-purple">{totalPool}</div>
            <div className="text-xs text-gray-400">Total Pool</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{timeLeft}</div>
            <div className="text-xs text-gray-400">Time Left</div>
          </div>
        </div>
      </div>
    </section>
  );
}
