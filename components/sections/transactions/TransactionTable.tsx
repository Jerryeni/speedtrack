"use client";

interface TransactionTableProps {
  onViewTransaction: (id: string) => void;
}

export default function TransactionTable({ onViewTransaction }: TransactionTableProps) {
  const transactions = [
    {
      id: "TX2847291",
      hash: "0x1234...5678",
      type: "Investment",
      typeColor: "neon-blue",
      icon: "fa-coins",
      amount: "+$1,250.00",
      description: "Pool Alpha",
      status: "Completed",
      statusColor: "green-400",
      date: "Oct 24, 2024",
      time: "14:32:15",
    },
    {
      id: "TX2847290",
      hash: "0x2345...6789",
      type: "Reward",
      typeColor: "electric-purple",
      icon: "fa-gift",
      amount: "+$89.50",
      description: "Daily Bonus",
      status: "Completed",
      statusColor: "green-400",
      date: "Oct 24, 2024",
      time: "12:15:42",
    },
    {
      id: "TX2847289",
      hash: "0x3456...7890",
      type: "Referral",
      typeColor: "green-400",
      icon: "fa-users",
      amount: "+$156.75",
      description: "Level 5 Comm",
      status: "Completed",
      statusColor: "green-400",
      date: "Oct 24, 2024",
      time: "10:45:28",
    },
    {
      id: "TX2847288",
      hash: "0x4567...8901",
      type: "Withdrawal",
      typeColor: "yellow-400",
      icon: "fa-hand-holding-usd",
      amount: "-$500.00",
      description: "To Wallet",
      status: "Pending",
      statusColor: "yellow-400",
      date: "Oct 24, 2024",
      time: "09:22:11",
    },
    {
      id: "TX2847287",
      hash: "0x5678...9012",
      type: "Investment",
      typeColor: "neon-blue",
      icon: "fa-swimming-pool",
      amount: "+$2,500.00",
      description: "Pool Beta",
      status: "Completed",
      statusColor: "green-400",
      date: "Oct 23, 2024",
      time: "18:45:33",
    },
    {
      id: "TX2847286",
      hash: "0x6789...0123",
      type: "Withdrawal",
      typeColor: "red-400",
      icon: "fa-times",
      amount: "-$750.00",
      description: "Failed TX",
      status: "Failed",
      statusColor: "red-400",
      date: "Oct 23, 2024",
      time: "16:12:45",
    },
  ];

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold">Transaction History</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Showing 1-20 of 1,247</span>
              <button className="text-xs text-neon-blue hover:text-electric-purple transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700">
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400">
                <div className="col-span-3">Transaction ID</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3">Date & Time</div>
              </div>
            </div>

            <div className="divide-y divide-gray-700/50">
              {transactions.map((tx, index) => (
                <div
                  key={tx.id}
                  onClick={() => onViewTransaction(tx.id)}
                  className="px-4 py-3 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-neon-blue/5 hover:to-electric-purple/5 hover:translate-x-0.5"
                  style={{
                    animation: `slideUp 0.4s ease ${(index * 0.1) + 0.8}s both`,
                  }}
                >
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full bg-${tx.typeColor}/20 flex items-center justify-center`}>
                          <i className={`fas ${tx.icon} text-${tx.typeColor} text-xs`}></i>
                        </div>
                        <div>
                          <p className={`text-xs font-medium text-${tx.typeColor}`}>{tx.id}</p>
                          <p className="text-xs text-gray-500">{tx.hash}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className={`text-xs bg-${tx.typeColor}/20 text-${tx.typeColor} px-2 py-1 rounded-full`}>
                        {tx.type}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className={`text-sm font-bold text-${tx.typeColor}`}>{tx.amount}</p>
                      <p className="text-xs text-gray-400">{tx.description}</p>
                    </div>
                    <div className="col-span-2">
                      <div
                        className={`text-xs bg-${tx.statusColor}/20 text-${tx.statusColor} px-2 py-1 rounded-full ${
                          tx.status === "Pending" ? "animate-pulse-custom" : ""
                        }`}
                      >
                        {tx.status}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <p className="text-xs text-white">{tx.date}</p>
                      <p className="text-xs text-gray-400">{tx.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center disabled:opacity-50">
                <i className="fas fa-chevron-left text-gray-300 text-xs"></i>
              </button>
              <span className="text-xs text-gray-400">Page 1 of 63</span>
              <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Rows per page:</span>
              <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
