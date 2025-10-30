import IncomeCard from "@/components/ui/IncomeCard";

interface IncomeBreakdownProps {
  filterType: string;
}

export default function IncomeBreakdown({ filterType }: IncomeBreakdownProps) {
  const incomeTypes = [
    {
      title: "Pool Income",
      description: "Investment pool earnings",
      amount: "$12,450.30",
      change: "+24.5%",
      icon: "fa-swimming-pool",
      color: "neon-blue",
      stats: [
        { label: "Active Pools", value: "8" },
        { label: "Avg. ROI", value: "18.5%" },
        { label: "Next Payout", value: "2h 15m" },
      ],
      progressLabel: "Pool Performance",
      progressValue: "87% Complete",
      progressPercent: 87,
      actionLabel: "View Pool Details",
      badgeIcon: "fa-trending-up",
      badgeText: "Trending Up",
    },
    {
      title: "Level Income",
      description: "Referral level commissions",
      amount: "$8,765.90",
      change: "+16.2%",
      icon: "fa-layer-group",
      color: "electric-purple",
      stats: [
        { label: "Active Levels", value: "12" },
        { label: "Team Size", value: "156" },
        { label: "Commission", value: "8.5%" },
      ],
      progressLabel: "Level Progress",
      progressValue: "Level 12 of 15",
      progressPercent: 80,
      actionLabel: "View Team Structure",
      badgeIcon: "fa-users",
      badgeText: "156 Members",
    },
    {
      title: "Withdrawal Commission",
      description: "Commission from withdrawals",
      amount: "$2,345.60",
      change: "+8.9%",
      icon: "fa-hand-holding-usd",
      color: "green-400",
      stats: [
        { label: "Withdrawals", value: "47" },
        { label: "Commission Rate", value: "2.5%" },
        { label: "Volume", value: "$93.8K" },
      ],
      progressLabel: "Monthly Target",
      progressValue: "78% Achieved",
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
