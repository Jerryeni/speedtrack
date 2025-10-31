"use client";

import { useState, useEffect } from 'react';
import { useWeb3 } from '../Web3Context';
import { getUserTransactions, setupEventListeners, Transaction } from '../events';

export function useTransactions(limit: number = 10) {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      if (!account || !isConnected || !isCorrectChain) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const txs = await getUserTransactions(account, limit);
        setTransactions(txs);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, [account, isConnected, isCorrectChain, limit]);

  // Setup real-time event listeners
  useEffect(() => {
    if (!account || !isConnected || !isCorrectChain) return;

    const cleanup = setupEventListeners(account, (newTransaction) => {
      setTransactions(prev => [newTransaction, ...prev].slice(0, limit));
    });

    return cleanup;
  }, [account, isConnected, isCorrectChain, limit]);

  return {
    transactions,
    isLoading,
    error
  };
}
