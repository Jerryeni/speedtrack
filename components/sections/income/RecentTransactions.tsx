"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { ethers } from "ethers";
import { getSpeedTrackReadOnly } from "@/lib/web3/contracts";

interface RecentTransactionsProps {
  filterDate: string;
}

interface Transaction {
  type: string;
  title: string;
  amount: string;
  timestamp: number;
  icon: string;
  color: string;
  poolIndex?: number;
  fromUser?: string;
  blockNumber: number;
}

export default function RecentTransactions({ filterDate }: RecentTransactionsProps) {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      if (!account || !isConnected || !isCorrectChain) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const speedTrack = await getSpeedTrackReadOnly();
        
        // Fetch all events in parallel for better performance
        const [investEvents, roiEvents, levelIncomeEvents, capitalEvents, stEvents, activationEvents] = await Promise.all([
          speedTrack.queryFilter(speedTrack.filters.InvestmentMade(account)).catch(() => []),
          speedTrack.queryFilter(speedTrack.filters.ROIClaimed(account)).catch(() => []),
          speedTrack.queryFilter(speedTrack.filters.LevelIncomeReceived(account)).catch(() => []),
          speedTrack.queryFilter(speedTrack.filters.CapitalReturned(account)).catch(() => []),
          speedTrack.queryFilter(speedTrack.filters.STTokensReceived(account)).catch(() => []),
          speedTrack.queryFilter(speedTrack.filters.AccountActivated(account)).catch(() => [])
        ]);

        const allTransactions: Transaction[] = [];
        const now = Math.floor(Date.now() / 1000);

        // Process investment events
        investEvents.forEach(event => {
          const eventLog = event as ethers.EventLog;
          allTransactions.push({
            type: 'investment',
            title: 'Pool Investment',
            amount: ethers.formatUnits(eventLog.args?.amount || 0, 6),
            timestamp: now - (investEvents.length - investEvents.indexOf(event)) * 3600,
            icon: 'fa-arrow-up',
            color: 'text-blue-400',
            poolIndex: Number(eventLog.args?.poolIndex || 0),
            blockNumber: event.blockNumber
          });
        });

        // Process ROI events
        roiEvents.forEach(event => {
          const eventLog = event as ethers.EventLog;
          allTransactions.push({
            type: 'roi_claim',
            title: 'ROI Claimed',
            amount: ethers.formatUnits(eventLog.args?.amount || 0, 6),
            timestamp: now - (roiEvents.length - roiEvents.indexOf(event)) * 3600,
            icon: 'fa-coins',
            color: 'text-green-400',
            blockNumber: event.blockNumber
          });
        });

        // Process level income events
        levelIncomeEvents.forEach(event => {
          const eventLog = event as ethers.EventLog;
          allTransactions.push({
            type: 'level_income',
            title: 'Level Income',
            amount: ethers.formatUnits(eventLog.args?.amount || 0, 6),
            timestamp: now - (levelIncomeEvents.length - levelIncomeEvents.indexOf(event)) * 3600,
            icon: 'fa-users',
            color: 'text-purple-400',
            fromUser: eventLog.args?.fromUser,
            blockNumber: event.blockNumber
          });
        });

        // Process capital events
        capitalEvents.forEach(event => {
          const eventLog = event as ethers.EventLog;
          allTransactions.push({
            type: 'capital_return',
            title: 'Capital Returned',
            amount: ethers.formatUnits(eventLog.args?.amount || 0, 6),
            timestamp: now - (capitalEvents.length - capitalEvents.indexOf(event)) * 3600,
            icon: 'fa-undo',
            color: 'text-yellow-400',
            poolIndex: Number(eventLog.args?.poolIndex || 0),
            blockNumber: event.blockNumber
          });
        });

        // Process ST token events
        stEvents.forEach(event => {
          const eventLog = event as ethers.EventLog;
          allTransactions.push({
            type: 'st_reward',
            title: 'ST Token Reward',
            amount: ethers.formatUnits(eventLog.args?.usdtAmount || 0, 6),
            timestamp: now - (stEvents.length - stEvents.indexOf(event)) * 3600,
            icon: 'fa-gift',
            color: 'text-pink-400',
            poolIndex: Number(eventLog.args?.poolIndex || 0),
            blockNumber: event.blockNumber
          });
        });

        // Process activation events
        activationEvents.forEach(event => {
          allTransactions.push({
            type: 'activation',
            title: 'Account Activated',
            amount: '0',
            timestamp: now - (activationEvents.length - activationEvents.indexOf(event)) * 3600,
            icon: 'fa-check-circle',
            color: 'text-green-400',
            blockNumber: event.blockNumber
          });
        });

        // Sort by block number (most recent first) and take last 10
        allTransactions.sort((a, b) => b.blockNumber - a.blockNumber);
        setTransactions(allTransactions.slice(0, 10));
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 60000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain, filterDate]);

  function formatTimestamp(timestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  if (!isConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-orbitron font-bold mb-4">Recent Transactions</h3>
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl p-8 border border-gray-700/50 text-center">
          <i className="fas fa-spinner fa-spin text-neon-blue text-2xl mb-2"></i>
          <p className="text-sm text-gray-400">Loading transactions...</p>
        </div>
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-orbitron font-bold mb-4">Recent Transactions</h3>
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl p-8 border border-gray-700/50 text-center">
          <i className="fas fa-receipt text-gray-600 text-3xl mb-3"></i>
          <p className="text-sm text-gray-400 mb-2">No transactions yet</p>
          <p className="text-xs text-gray-500">Your transaction history will appear here</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron font-bold">Recent Transactions</h3>
        <button 
          onClick={() => window.location.href = '/transactions'}
          className="text-neon-blue text-sm font-medium hover:text-neon-blue/80 transition-colors"
        >
          View All ({transactions.length})
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <div
            key={`${tx.blockNumber}-${index}`}
            className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl p-4 border border-gray-700/50 hover:border-neon-blue/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center`}>
                  <i className={`fas ${tx.icon} ${tx.color}`}></i>
                </div>
                <div>
                  <p className="font-medium text-sm">{tx.title}</p>
                  <p className="text-xs text-gray-400">{formatTimestamp(tx.timestamp)}</p>
                </div>
              </div>
              <div className="text-right">
                {parseFloat(tx.amount) > 0 ? (
                  <p className={`font-bold ${tx.color}`}>
                    +{parseFloat(tx.amount).toFixed(4)} USDT
                  </p>
                ) : (
                  <p className={`font-bold ${tx.color}`}>
                    {tx.title}
                  </p>
                )}
                <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full inline-block">
                  Completed
                </div>
              </div>
            </div>
            {tx.poolIndex && tx.poolIndex > 0 && (
              <div className="text-xs text-gray-400 flex items-center space-x-2">
                <i className="fas fa-swimming-pool"></i>
                <span>Pool #{tx.poolIndex}</span>
              </div>
            )}
            {tx.fromUser && (
              <div className="text-xs text-gray-400 flex items-center space-x-2">
                <i className="fas fa-user"></i>
                <span>From: {tx.fromUser.slice(0, 6)}...{tx.fromUser.slice(-4)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
