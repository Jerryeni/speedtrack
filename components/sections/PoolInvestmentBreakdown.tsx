"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getAllUserPoolInvestments, getUserTotalPoolInvestments, type UserPoolInvestment } from "@/lib/web3/poolInvestments";

export default function PoolInvestmentBreakdown() {
  const { account, isConnected } = useWeb3();
  const [investments, setInvestments] = useState<UserPoolInvestment[]>([]);
  const [totalInvested, setTotalInvested] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInvestments() {
      if (!account || !isConnected) {
        setIsLoading(false);
        return;
      }

      try {
        const [poolInvestments, total] = await Promise.all([
          getAllUserPoolInvestments(account),
          getUserTotalPoolInvestments(account)
        ]);
        
        setInvestments(poolInvestments);
        setTotalInvested(total);
      } catch (error) {
        console.error("Error loading pool investments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInvestments();
    const interval = setInterval(loadInvestments, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected]);

  if (!isConnected) return null;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-orbitron font-bold text-white flex items-center">
          <i className="fas fa-swimming-pool text-neon-blue mr-3"></i>
          Pool Investments
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Invested</p>
          <p className="text-2xl font-bold text-neon-blue">${parseFloat(totalInvested).toFixed(2)}</p>
        </div>
      </div>

      {investments.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-water text-gray-600 text-4xl mb-3"></i>
          <p className="text-gray-400 mb-2">No pool investments yet</p>
          <p className="text-sm text-gray-500">Start investing in pools to see your breakdown here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {investments.map((investment) => (
            <div
              key={investment.poolIndex}
              className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    investment.isGlobal 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}>
                    <i className={`fas ${investment.isGlobal ? 'fa-globe' : 'fa-user'} text-white`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Pool #{investment.poolIndex}
                    </p>
                    <p className="text-xs text-gray-400">
                      {investment.isGlobal ? 'Global Pool' : 'Personal Pool'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">
                    ${parseFloat(investment.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">Your Investment</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Pool Progress</span>
                  <span className="text-xs font-semibold text-white">
                    {investment.percentFilled.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      investment.percentFilled >= 100
                        ? 'bg-green-500'
                        : 'bg-gradient-to-r from-neon-blue to-electric-purple'
                    }`}
                    style={{ width: `${Math.min(investment.percentFilled, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Pool Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-900/50 rounded-lg p-2">
                  <p className="text-gray-400 mb-1">Pool Size</p>
                  <p className="font-semibold text-white">${parseFloat(investment.poolSize).toFixed(0)}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-2">
                  <p className="text-gray-400 mb-1">Filled</p>
                  <p className="font-semibold text-white">${parseFloat(investment.poolFilled).toFixed(0)}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-2">
                  <p className="text-gray-400 mb-1">Unpaid</p>
                  <p className="font-semibold text-yellow-400">${parseFloat(investment.unpaidCapital).toFixed(2)}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-3 flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  investment.percentFilled >= 100
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {investment.percentFilled >= 100 ? 'Completed' : 'Active'}
                </div>
                {!investment.isGlobal && (
                  <div className="text-xs text-gray-400">
                    Owner: {investment.owner.slice(0, 6)}...{investment.owner.slice(-4)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {investments.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Pools</p>
              <p className="text-xl font-bold text-white">{investments.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Pools</p>
              <p className="text-xl font-bold text-blue-400">
                {investments.filter(i => i.percentFilled < 100).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Completed</p>
              <p className="text-xl font-bold text-green-400">
                {investments.filter(i => i.percentFilled >= 100).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
