"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getDirectReferralsSummary, type DirectReferral } from "@/lib/web3/directReferrals";

const LEVEL_NAMES = ['Starter', 'Bronze', 'Silver', 'Gold', 'Platinum'];
const LEVEL_COLORS = ['gray', 'orange', 'blue', 'yellow', 'purple'];

export default function DirectReferralsList() {
  const { account, isConnected } = useWeb3();
  const [referrals, setReferrals] = useState<DirectReferral[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    async function loadReferrals() {
      if (!account || !isConnected) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getDirectReferralsSummary(account);
        setSummary(data);
        setReferrals(data.referrals);
      } catch (error) {
        console.error("Error loading referrals:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReferrals();
  }, [account, isConnected]);

  if (!isConnected) return null;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const filteredReferrals = referrals.filter(r => {
    if (filter === 'active') return r.isActivated;
    if (filter === 'inactive') return !r.isActivated;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-700/30">
            <p className="text-sm text-gray-400 mb-1">Total Referrals</p>
            <p className="text-2xl font-bold text-white">{summary.totalReferrals}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-4 border border-green-700/30">
            <p className="text-sm text-gray-400 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-400">{summary.activeReferrals}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 rounded-xl p-4 border border-gray-700/30">
            <p className="text-sm text-gray-400 mb-1">Inactive</p>
            <p className="text-2xl font-bold text-gray-400">{summary.inactiveReferrals}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-4 border border-purple-700/30">
            <p className="text-sm text-gray-400 mb-1">Total Invested</p>
            <p className="text-2xl font-bold text-purple-400">${parseFloat(summary.totalInvested).toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-neon-blue text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          All ({referrals.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Active ({summary?.activeReferrals || 0})
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'inactive'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Inactive ({summary?.inactiveReferrals || 0})
        </button>
      </div>

      {/* Referrals List */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-orbitron font-bold mb-4 text-white flex items-center">
          <i className="fas fa-users text-neon-blue mr-3"></i>
          Direct Referrals
        </h3>

        {filteredReferrals.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-user-slash text-gray-600 text-4xl mb-3"></i>
            <p className="text-gray-400">No referrals found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReferrals.map((referral, index) => {
              const levelIndex = parseInt(referral.activationLevel);
              const levelColor = LEVEL_COLORS[levelIndex] || 'gray';
              const levelName = LEVEL_NAMES[levelIndex] || 'Not Activated';

              return (
                <div
                  key={referral.address}
                  className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-${levelColor}-500/20 flex items-center justify-center`}>
                        <span className="text-sm font-bold text-white">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {referral.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {referral.userId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        referral.isActivated
                          ? `bg-${levelColor}-500/20 text-${levelColor}-400`
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {referral.isActivated ? levelName : 'Not Activated'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="text-gray-400">Address: </span>
                        <span className="text-white font-mono">
                          {referral.address.slice(0, 6)}...{referral.address.slice(-4)}
                        </span>
                      </div>
                      {parseFloat(referral.investedAmount) > 0 && (
                        <div>
                          <span className="text-gray-400">Invested: </span>
                          <span className="text-green-400 font-semibold">
                            ${parseFloat(referral.investedAmount).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
