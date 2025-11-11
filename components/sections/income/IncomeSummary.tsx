"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getRewardSummary } from "@/lib/web3/rewards";

export default function IncomeSummary() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [rewardData, setRewardData] = useState<any>(null);

  useEffect(() => {
    async function fetchRewards() {
      if (!account || !isConnected || !isCorrectChain) return;
      
      try {
        const data = await getRewardSummary(account);
        setRewardData(data);
      } catch (error) {
        console.error("Failed to fetch rewards:", error);
      }
    }

    fetchRewards();
    const interval = setInterval(fetchRewards, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  const totalEarned = parseFloat(rewardData?.totalEarned || '0');
  const dailyReward = parseFloat(rewardData?.dailyReward || '0');
  const availableToClaim = parseFloat(rewardData?.availableToClaim || '0');
  const levelIncome = parseFloat(rewardData?.levelIncome || '0');
  const capitalReturned = parseFloat(rewardData?.capitalReturned || '0');
  const stRewarded = parseFloat(rewardData?.stRewarded || '0');

  const summaryCards = [
    {
      title: "Total ROI Earned",
      amount: `${totalEarned.toFixed(2)} USDT`,
      icon: "fa-coins",
      color: "neon-blue",
      badge: "Total",
      progress: totalEarned > 0 ? Math.min((totalEarned / 1000) * 100, 100) : 0,
      change: dailyReward > 0 ? `+${dailyReward.toFixed(4)}` : '+0',
      animation: "reward-pulse",
    },
    {
      title: "Daily ROI",
      amount: `${dailyReward.toFixed(4)} USDT`,
      icon: "fa-chart-line",
      color: "electric-purple",
      badge: "0.5%",
      progress: 50,
      change: "Daily",
      animation: "",
    },
    {
      title: "Available to Claim",
      amount: `${availableToClaim.toFixed(4)} USDT`,
      icon: "fa-hand-holding-usd",
      color: "green-400",
      badge: "Claimable",
      progress: availableToClaim > 0 ? Math.min((availableToClaim / 100) * 100, 100) : 0,
      change: availableToClaim > 0 ? 'Ready' : 'None',
      animation: "",
    },
    {
      title: "Level Income",
      amount: `${levelIncome.toFixed(4)} USDT`,
      icon: "fa-users",
      color: "yellow-400",
      badge: "Referral",
      progress: levelIncome > 0 ? Math.min((levelIncome / 500) * 100, 100) : 0,
      change: "10 Levels",
      animation: "",
    },
    {
      title: "Capital Returned",
      amount: `${capitalReturned.toFixed(2)} USDT`,
      icon: "fa-undo",
      color: "cyan-400",
      badge: "200%",
      progress: capitalReturned > 0 ? Math.min((capitalReturned / 1000) * 100, 100) : 0,
      change: "Refund",
      animation: "",
    },
    {
      title: "ST Tokens Earned",
      amount: `${stRewarded.toFixed(4)} USDT`,
      icon: "fa-gift",
      color: "pink-400",
      badge: "Bonus",
      progress: stRewarded > 0 ? Math.min((stRewarded / 100) * 100, 100) : 0,
      change: "10%",
      animation: "",
    },
  ];

  return (
    <section className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-${card.color}/20 to-${card.color}/5 rounded-2xl p-4 border border-${card.color}/30 ${card.animation}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-full bg-${card.color}/20 flex items-center justify-center ${index === 0 ? 'animate-[coinSpin_4s_linear_infinite]' : ''}`}>
                <i className={`fas ${card.icon} text-${card.color}`}></i>
              </div>
              <div className={`text-xs bg-${card.color}/20 text-${card.color} px-2 py-1 rounded-full`}>
                {card.badge}
              </div>
            </div>
            <p className={`text-2xl font-bold text-${card.color} animate-[countUp_2s_ease-out]`}>
              {card.amount}
            </p>
            <p className="text-xs text-gray-400 mb-2">{card.title}</p>
            <div className="flex items-center space-x-2">
              <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${index === 0 ? 'racing-track' : `bg-${card.color} rounded-full ${index === 1 ? 'animate-[incomeWave_3s_ease-in-out_infinite]' : ''}`}`}
                  style={{ width: `${card.progress}%` }}
                ></div>
              </div>
              <span className={`text-xs text-${card.color}`}>{card.change}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
