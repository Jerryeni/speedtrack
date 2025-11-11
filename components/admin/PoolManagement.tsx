"use client";

import { useState } from "react";
import { getPoolInfo } from "@/lib/web3/pools";
import Button from "@/components/ui/Button";

export default function PoolManagement() {
  const [poolIndex, setPoolIndex] = useState("");
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchPool = async () => {
    if (!poolIndex) return;
    
    try {
      setIsLoading(true);
      const info = await getPoolInfo(parseInt(poolIndex));
      setPoolInfo(info);
    } catch (error) {
      console.error("Error fetching pool info:", error);
      alert("Error fetching pool info");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <h3 className="font-semibold mb-4">Pool Information</h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={poolIndex}
            onChange={(e) => setPoolIndex(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white"
            placeholder="Enter pool index"
          />
          <Button
            onClick={handleSearchPool}
            disabled={isLoading}
            className="px-6"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </Button>
        </div>

        {poolInfo && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Pool Index</span>
              <span className="text-white font-semibold">{poolInfo.poolIndex}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Pool Size</span>
              <span className="text-white font-semibold">{parseFloat(poolInfo.size).toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Current Filled</span>
              <span className="text-white font-semibold">{parseFloat(poolInfo.currentFilled).toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neon-blue rounded-full"
                    style={{ width: `${poolInfo.progress}%` }}
                  ></div>
                </div>
                <span className="text-white font-semibold">{poolInfo.progress.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Type</span>
              <span className={`font-semibold ${poolInfo.isGlobal ? 'text-green-400' : 'text-blue-400'}`}>
                {poolInfo.isGlobal ? "Global Pool" : "Personal Pool"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Owner</span>
              <span className="text-white font-mono text-xs">
                {poolInfo.owner.slice(0, 10)}...{poolInfo.owner.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Unpaid Capital</span>
              <span className="text-white font-semibold">{parseFloat(poolInfo.unpaidCapital).toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Queue Length</span>
              <span className="text-white font-semibold">{poolInfo.queueLength}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <h3 className="font-semibold mb-4">Pool Statistics</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Active Pools</p>
            <p className="text-xl font-bold text-neon-blue">-</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Completed Pools</p>
            <p className="text-xl font-bold text-green-400">-</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Total Pool Value</p>
            <p className="text-xl font-bold text-electric-purple">-</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Avg Fill Rate</p>
            <p className="text-xl font-bold text-yellow-400">-</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          <i className="fas fa-info-circle mr-1"></i>
          Pool statistics require event tracking
        </p>
      </div>
    </div>
  );
}
