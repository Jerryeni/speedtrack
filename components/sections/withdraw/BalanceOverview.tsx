"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getRewardSummary } from "@/lib/web3/rewards";

export default function BalanceOverview() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [rewardData, setRewardData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!account || !isConnected || !isCorrectChain) return;

      try {
        const rewards = await getRewardSummary(account);
        setRewardData(rewards);
      } catch (error) {
        console.error("Failed to fetch balance data:", error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  const poolBalance = parseFloat(rewardData?.availableToClaim || '0');
  const refBalance = parseFloat(rewardData?.levelIncome || '0');
  const totalBalance = poolBalance + refBalance;

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden animate-[balanceGlow_3s_ease-in-out_infinite]">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Available Balance</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-custom"></div>
              <span className="text-xs text-green-400">Real-time</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-orbitron font-bold text-neon-blue mb-2 animate-[counterUpdate_2s_ease-out]">
              ${totalBalance.toFixed(2)}
            </div>
            <p className="text-gray-400 text-sm">Total Available for Withdrawal</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-neon-blue/10 to-neon-blue/20 rounded-xl p-4 border border-neon-blue/30 animate-[balanceSplit_2s_ease-out]">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
                  <i className="fas fa-swimming-pool text-neon-blue text-sm"></i>
                </div>
                <span className="text-xs text-neon-blue font-medium">POOL</span>
              </div>
              <div className="text-xl font-orbitron font-bold text-neon-blue">
                ${poolBalance.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400 mt-1">Racing Pool Earnings</p>
            </div>

            <div
              className="bg-gradient-to-r from-electric-purple/10 to-electric-purple/20 rounded-xl p-4 border border-electric-purple/30 animate-[balanceSplit_2s_ease-out]"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center">
                  <i className="fas fa-users text-electric-purple text-sm"></i>
                </div>
                <span className="text-xs text-electric-purple font-medium">REF</span>
              </div>
              <div className="text-xl font-orbitron font-bold text-electric-purple">
                ${refBalance.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400 mt-1">Referral Commissions</p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-green-400 font-medium">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-400">Next Pool Cycle</span>
              <span className="text-yellow-400 font-medium">6h 23m</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
