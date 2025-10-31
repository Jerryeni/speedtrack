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

  const summaryCards = [
    {
      title: "Total Earnings",
      amount: `${parseFloat(rewardData?.totalEarned || '0').toFixed(2)} USDT`,
      icon: "fa-coins",
      color: "neon-blue",
      badge: "Total",
      progress: 80,
      change: "+18.5%",
      animation: "reward-pulse",
    },
    {
      title: "Daily Reward",
      amount: `${parseFloat(rewardData?.dailyReward || '0').toFixed(4)} USDT`,
      icon: "fa-chart-line",
      color: "electric-purple",
      badge: "Today",
      progress: 60,
      change: "+12.3%",
      animation: "",
    },
    {
      title: "Available to Claim",
      amount: `${parseFloat(rewardData?.availableToClaim || '0').toFixed(4)} USDT`,
      icon: "fa-calendar-week",
      color: "green-400",
      badge: "Claimable",
      progress: 66,
      change: "+8.7%",
      animation: "",
    },
    {
      title: "Level Income",
      amount: `${parseFloat(rewardData?.levelIncome || '0').toFixed(4)} USDT`,
      icon: "fa-users",
      color: "yellow-400",
      badge: "Referral",
      progress: 75,
      change: "+15.2%",
      animation: "",
    },
  ];

  return (
    <section className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {summaryCards.slice(0, 2).map((card, index) => (
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

      <div className="grid grid-cols-2 gap-4">
        {summaryCards.slice(2).map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-${card.color}/20 to-${card.color}/5 rounded-2xl p-4 border border-${card.color}/30`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-full bg-${card.color}/20 flex items-center justify-center`}>
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
                  className={`h-full bg-${card.color} rounded-full`}
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
