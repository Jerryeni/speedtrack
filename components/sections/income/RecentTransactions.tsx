interface RecentTransactionsProps {
  filterDate: string;
}

export default function RecentTransactions({ filterDate }: RecentTransactionsProps) {
  const transactions = [
    {
      title: "Pool Income #2847",
      time: "2 minutes ago",
      amount: "+$125.50",
      icon: "fa-swimming-pool",
      color: "neon-blue",
      detail1: "Pool: RacePool Alpha",
      detail2: "TX: 0x1234...5678",
    },
    {
      title: "Level 8 Commission",
      time: "15 minutes ago",
      amount: "+$89.25",
      icon: "fa-layer-group",
      color: "electric-purple",
      detail1: "From: User #4521",
      detail2: "Commission: 8.5%",
    },
    {
      title: "Daily Reward Bonus",
      time: "1 hour ago",
      amount: "+$57.80",
      icon: "fa-gift",
      color: "yellow-400",
      detail1: "Streak Day: 23",
      detail2: "Multiplier: 2.3x",
    },
    {
      title: "Withdrawal Commission",
      time: "3 hours ago",
      amount: "+$31.25",
      icon: "fa-hand-holding-usd",
      color: "green-400",
      detail1: "Amount: $1,250",
      detail2: "Rate: 2.5%",
    },
  ];

  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron font-bold">Recent Transactions</h3>
        <button className="text-neon-blue text-sm font-medium">View All</button>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full bg-${transaction.color}/20 flex items-center justify-center`}>
                  <i className={`fas ${transaction.icon} text-${transaction.color}`}></i>
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.title}</p>
                  <p className="text-xs text-gray-400">{transaction.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-${transaction.color}`}>{transaction.amount}</p>
                <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  Completed
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{transaction.detail1}</span>
              <span>{transaction.detail2}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
