import { Transaction } from "@/lib/web3/events";

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export default function TransactionSummary({ transactions }: TransactionSummaryProps) {
  const totalCount = transactions.length;
  const completedCount = totalCount; // All fetched transactions are completed
  const completedPercent = totalCount > 0 ? 100 : 0;

  // Count by type
  const activations = transactions.filter(tx => tx.type === 'activation').length;
  const poolInvests = transactions.filter(tx => tx.type === 'pool_invest').length;
  const rewards = transactions.filter(tx => tx.type === 'reward_claim').length;
  const trades = transactions.filter(tx => tx.type === 'st_buy' || tx.type === 'st_sell').length;

  const stats = [
    {
      icon: "fa-list",
      label: "Total Transactions",
      value: totalCount.toString(),
      badge: "Total",
      color: "neon-blue",
      progress: 100,
    },
    {
      icon: "fa-swimming-pool",
      label: "Pool Investments",
      value: poolInvests.toString(),
      badge: "Pools",
      color: "green-400",
      progress: totalCount > 0 ? (poolInvests / totalCount) * 100 : 0,
    },
    {
      icon: "fa-gift",
      label: "Rewards Claimed",
      value: rewards.toString(),
      badge: "Rewards",
      color: "yellow-400",
      progress: totalCount > 0 ? (rewards / totalCount) * 100 : 0,
    },
    {
      icon: "fa-exchange-alt",
      label: "Token Trades",
      value: trades.toString(),
      badge: "Trades",
      color: "electric-purple",
      progress: totalCount > 0 ? (trades / totalCount) * 100 : 0,
    },
  ];

  return (
    <section className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-${stat.color}/20 to-${stat.color}/5 rounded-2xl p-4 border border-${stat.color}/30`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-full bg-${stat.color}/20 flex items-center justify-center`}>
                <i className={`fas ${stat.icon} text-${stat.color}`}></i>
              </div>
              <div className={`text-xs bg-${stat.color}/20 text-${stat.color} px-2 py-1 rounded-full`}>
                {stat.badge}
              </div>
            </div>
            <p className={`text-2xl font-bold text-${stat.color} animate-[countUp_2s_ease-out]`}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
            <div className="flex items-center space-x-2">
              <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    stat.progress === 100 ? "racing-track" : `bg-${stat.color}`
                  } rounded-full ${stat.badge === "Pending" ? "animate-pulse-custom" : ""}`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
              <span className={`text-xs text-${stat.color}`}>{stat.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
