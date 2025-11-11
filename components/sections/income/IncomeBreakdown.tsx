"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getRewardSummary } from "@/lib/web3/rewards";
import IncomeCard from "@/components/ui/IncomeCard";

interface IncomeBreakdownProps {
  filterType: string;
}

export default function IncomeBreakdown({ filterType }: IncomeBreakdownProps) {
  const { account, isConnected } = useWeb3();
  const [rewardData, setRewardData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!account || !isConnected) return;
      
      try {
        const data = await getRewardSummary(account);
        setRewardData(data);
      } catch (error) {
        console.error('Error fetching reward data:', error);
      }
    }

    fetchData();
  }, [account, isConnected]);

  const totalEarned = parseFloat(rewardData?.totalEarned || '0');
  const levelIncome = parseFloat(rewardData?.levelIncome || '0');
  const capitalReturned = parseFloat(rewardData?.capitalReturned || '0');

  const incomeTypes = [
    {
      title: "ROI Income",
      description: "Daily ROI earnings from investments",
      amount: `$${totalEarned.toFixed(2)}`,
      change: "+0.5% daily",
      icon: "fa-chart-line",
      color: "neon-blue",
      stats: [
        { label: "Daily Rate", value: "0.5%" },
        { label: "Total Earned", value: `$${totalEarned.toFixed(2)}` },
        { label: "Status", value: "Active" },
      ],
      progressLabel: "ROI Progress",
      progressValue: "Earning Daily",
      progressPercent: 50,
      actionLabel: "View ROI Details",
      badgeIcon: "fa-trending-up",
      badgeText: "Active",
    },
    {
      title: "Level Income",
      description: "Referral level commissions",
      amount: `$${levelIncome.toFixed(2)}`,
      change: "10 Levels",
      icon: "fa-layer-group",
      color: "electric-purple",
      stats: [
        { label: "Total Earned", value: `$${levelIncome.toFixed(2)}` },
        { label: "Levels", value: "10" },
        { label: "Status", value: "Active" },
      ],
      progressLabel: "Level Progress",
      progressValue: "10 Levels Active",
      progressPercent: 100,
      actionLabel: "View Team Structure",
      badgeIcon: "fa-users",
      badgeText: "Referrals",
    },
    {
      title: "Capital Return",
      description: "200% capital return on investments",
      amount: `$${capitalReturned.toFixed(2)}`,
      change: "200% Target",
      icon: "fa-undo",
      color: "green-400",
      stats: [
        { label: "Returned", value: `$${capitalReturned.toFixed(2)}` },
        { label: "Target", value: "200%" },
        { label: "Status", value: "Active" },
      ],
      progressLabel: "Return Progress",
      progressValue: "Returning Capital",
      progressPercent: 78,
      actionLabel: "View Withdrawal History",
      badgeIcon: "fa-chart-bar",
      badgeText: "$93.8K Volume",
    },
    {
      title: "Daily Rewards",
      description: "Daily bonus earnings",
      amount: "$1,329.70",
      change: "+12.1%",
      icon: "fa-gift",
      color: "yellow-400",
      stats: [
        { label: "Streak", value: "23" },
        { label: "Daily Avg", value: "$57.8" },
        { label: "Next Reward", value: "18h 42m" },
      ],
      progressLabel: "Reward Multiplier",
      progressValue: "2.3x Active",
      progressPercent: 66,
      actionLabel: "View Reward Calendar",
      badgeIcon: "fa-fire",
      badgeText: "23 Day Streak",
    },
  ];

  const filteredTypes = filterType === "all" 
    ? incomeTypes 
    : incomeTypes.filter(type => type.title.toLowerCase().includes(filterType));

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Income Breakdown</h3>
      {filteredTypes.map((type, index) => (
        <IncomeCard key={index} {...type} />
      ))}
    </section>
  );
}
