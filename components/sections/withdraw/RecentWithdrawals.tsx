export default function RecentWithdrawals() {
  const withdrawals = [
    {
      amount: "$2,500.00",
      date: "Dec 20, 2024 • 14:30",
      status: "Completed",
      statusColor: "green-400",
      icon: "fa-check",
      txHash: "0x9a8b...",
    },
    {
      amount: "$1,000.00",
      date: "Dec 18, 2024 • 09:15",
      status: "Processing",
      statusColor: "yellow-400",
      icon: "fa-clock",
      txHash: "ETA: 2-5 mins",
    },
    {
      amount: "$750.00",
      date: "Dec 15, 2024 • 16:45",
      status: "Completed",
      statusColor: "green-400",
      icon: "fa-check",
      txHash: "0x7f2c...",
    },
  ];

  return (
    <section className="px-4 mb-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Recent Withdrawals</h3>
            <button className="text-neon-blue hover:text-electric-purple transition-colors text-sm">
              View All
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {withdrawals.map((withdrawal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full bg-${withdrawal.statusColor}/20 flex items-center justify-center`}
                  >
                    <i className={`fas ${withdrawal.icon} text-${withdrawal.statusColor} text-sm`}></i>
                  </div>
                  <div>
                    <div className="font-medium text-white">{withdrawal.amount}</div>
                    <div className="text-xs text-gray-400">{withdrawal.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm text-${withdrawal.statusColor} font-medium`}>
                    {withdrawal.status}
                  </div>
                  <div className="text-xs text-gray-500">
                    {withdrawal.txHash.startsWith("0x") ? `TxHash: ${withdrawal.txHash}` : withdrawal.txHash}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
