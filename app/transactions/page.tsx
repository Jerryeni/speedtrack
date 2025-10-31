"use client";

import { useState, useMemo } from "react";
import { useTransactions } from "@/lib/web3/hooks/useTransactions";
import { formatTimestamp, getTransactionStyle, Transaction } from "@/lib/web3/events";
import { NETWORK_CONFIG } from "@/lib/web3/config";
import TransactionSummary from "@/components/sections/transactions/TransactionSummary";
import FilterControls from "@/components/sections/transactions/FilterControls";
import ExportOptions from "@/components/sections/transactions/ExportOptions";
import TransactionModal from "@/components/modals/TransactionModal";

export default function TransactionsPage() {
  const { transactions, isLoading } = useTransactions(50);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    startDate: "",
    endDate: "",
    period: "all",
  });

  // Filter transactions based on selected filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (filters.type !== "all") {
        const typeMap: Record<string, Transaction['type'][]> = {
          'deposit': ['pool_invest'],
          'withdrawal': ['reward_claim'],
          'trade': ['st_buy', 'st_sell'],
          'reward': ['reward_claim'],
        };
        if (!typeMap[filters.type]?.includes(tx.type)) return false;
      }
      return true;
    });
  }, [transactions, filters]);

  return (
    <main className="min-h-screen pb-20">
      <header className="relative z-50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Transactions</h1>
              <p className="text-xs text-gray-400">Complete Transaction History</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <i className="fas fa-sync-alt text-neon-blue text-sm"></i>
            </button>
            <button className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center">
              <i className="fas fa-filter text-electric-purple text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      <TransactionSummary transactions={transactions} />
      <FilterControls filters={filters} setFilters={setFilters} />

      <section className="px-4 mb-8">
        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <i className="fas fa-receipt text-gray-600 text-2xl"></i>
            </div>
            <p className="text-gray-400">No transactions found</p>
            <p className="text-sm text-gray-500 mt-2">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => {
              const style = getTransactionStyle(tx.type);
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700 cursor-pointer hover:border-neon-blue/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center`}>
                        <i className={`fas ${style.icon} ${style.color} text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-semibold">{tx.title}</p>
                        <p className="text-xs text-gray-400">{formatTimestamp(tx.timestamp)}</p>
                        <a
                          href={`${NETWORK_CONFIG.blockExplorer}/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neon-blue hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                        </a>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${style.color}`}>{tx.amount}</p>
                      {tx.usdValue && (
                        <p className="text-sm text-gray-400">{tx.usdValue}</p>
                      )}
                      <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full mt-1 inline-block">
                        Success
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <ExportOptions />
    </main>
  );
}
