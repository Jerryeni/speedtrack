"use client";

import { useState, useMemo, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getRecentActions, formatActionType, formatTimestamp } from "@/lib/web3/transactions";
import TransactionSummary from "@/components/sections/transactions/TransactionSummary";
import FilterControls from "@/components/sections/transactions/FilterControls";
import ExportOptions from "@/components/sections/transactions/ExportOptions";

export default function TransactionsPage() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    startDate: "",
    endDate: "",
    period: "all",
  });

  useEffect(() => {
    async function fetchActions() {
      if (!account || !isConnected || !isCorrectChain) return;
      
      try {
        setIsLoading(true);
        const actions = await getRecentActions(account);
        setRecentActions(actions);
      } catch (error) {
        console.error("Failed to fetch actions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActions();
    const interval = setInterval(fetchActions, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  // Filter transactions based on selected filters
  const filteredTransactions = useMemo(() => {
    return recentActions.filter(action => {
      if (filters.type !== "all") {
        const typeMap: Record<string, string[]> = {
          'deposit': ['INVEST'],
          'withdrawal': ['ROI_CLAIM', 'CAPITAL_RETURN'],
          'reward': ['LEVEL_INCOME', 'ST_REWARD'],
          'activation': ['ACTIVATION', 'PROFILE_COMPLETE'],
        };
        if (!typeMap[filters.type]?.includes(action.action)) return false;
      }
      return true;
    });
  }, [recentActions, filters]);

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

      <TransactionSummary transactions={recentActions} />
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
            {filteredTransactions.map((action, index) => {
              const style = formatActionType(action.action);
              return (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700 hover:border-neon-blue/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center`}>
                        <i className={`fas ${style.icon} ${style.color} text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-semibold">{style.title}</p>
                        <p className="text-xs text-gray-400">{formatTimestamp(action.timestamp)}</p>
                        {action.fromUser !== "0x0000000000000000000000000000000000000000" && (
                          <p className="text-xs text-gray-500">
                            From: {action.fromUser.slice(0, 6)}...{action.fromUser.slice(-4)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${style.color}`}>
                        {parseFloat(action.amount).toFixed(4)} USDT
                      </p>
                      {action.poolIndex > 0 && (
                        <p className="text-sm text-gray-400">Pool #{action.poolIndex}</p>
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
