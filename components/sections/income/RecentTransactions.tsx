"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getRecentActions, formatActionType, formatTimestamp } from "@/lib/web3/transactions";

interface RecentTransactionsProps {
  filterDate: string;
}

export default function RecentTransactions({ filterDate }: RecentTransactionsProps) {
  const { account, isConnected } = useWeb3();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      if (!account || !isConnected) {
        setIsLoading(false);
        return;
      }

      try {
        const actions = await getRecentActions(account);
        setTransactions(actions.slice(0, 5)); // Show last 5
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, [account, isConnected, filterDate]);

  if (isLoading) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-orbitron font-bold mb-4">Recent Transactions</h3>
        <div className="text-center text-gray-400 py-8">Loading transactions...</div>
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-orbitron font-bold mb-4">Recent Transactions</h3>
        <div className="text-center text-gray-400 py-8">No transactions yet</div>
      </section>
    );
  }

  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron font-bold">Recent Transactions</h3>
        <button 
          onClick={() => window.location.href = '/transactions'}
          className="text-neon-blue text-sm font-medium"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((action, index) => {
          const style = formatActionType(action.action);
          return (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl p-4 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center`}>
                    <i className={`fas ${style.icon} ${style.color}`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{style.title}</p>
                    <p className="text-xs text-gray-400">{formatTimestamp(action.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${style.color}`}>
                    {parseFloat(action.amount).toFixed(4)} USDT
                  </p>
                  <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Completed
                  </div>
                </div>
              </div>
              {action.poolIndex > 0 && (
                <div className="text-xs text-gray-400">
                  Pool #{action.poolIndex}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
