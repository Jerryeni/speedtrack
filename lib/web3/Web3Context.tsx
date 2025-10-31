"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  connectWallet, 
  getCurrentAccount, 
  getCurrentChainId, 
  isCorrectNetwork,
  setupAccountChangeListener,
  setupChainChangeListener,
  removeAccountChangeListener,
  removeChainChangeListener,
  getBalance,
  switchToBSCTestnet
} from './wallet';
import { getTokenBalances } from './contracts';
import { showToast } from '../toast';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isCorrectChain: boolean;
  balances: {
    bnb: string;
    usdt: string;
    st: string;
  };
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
  refreshBalances: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isCorrectChain, setIsCorrectChain] = useState(false);
  const [balances, setBalances] = useState({
    bnb: '0',
    usdt: '0',
    st: '0'
  });
  const [isLoading, setIsLoading] = useState(true);

  const isConnected = !!account;

  const refreshBalances = async () => {
    if (!account) return;

    try {
      const [bnbBalance, tokenBalances] = await Promise.all([
        getBalance(account),
        getTokenBalances(account)
      ]);

      setBalances({
        bnb: bnbBalance,
        usdt: tokenBalances.usdt,
        st: tokenBalances.st
      });
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  const connect = async () => {
    try {
      setIsLoading(true);
      const address = await connectWallet();
      setAccount(address);
      showToast('Wallet connected successfully!');
    } catch (error: any) {
      showToast(error.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalances({ bnb: '0', usdt: '0', st: '0' });
    showToast('Wallet disconnected');
  };

  const switchNetwork = async () => {
    try {
      await switchToBSCTestnet();
      showToast('Network switched to BSC Testnet');
    } catch (error: any) {
      showToast(error.message || 'Failed to switch network');
    }
  };

  const handleAccountChange = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      showToast('Account changed');
    }
  };

  const handleChainChange = (chainId: string) => {
    const numericChainId = parseInt(chainId, 16);
    setIsCorrectChain(isCorrectNetwork(numericChainId));
    
    if (!isCorrectNetwork(numericChainId)) {
      showToast('Please switch to BSC Testnet');
    }
  };

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const [currentAccount, chainId] = await Promise.all([
          getCurrentAccount(),
          getCurrentChainId()
        ]);

        if (currentAccount) {
          setAccount(currentAccount);
        }

        if (chainId) {
          setIsCorrectChain(isCorrectNetwork(chainId));
        }
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWeb3();

    setupAccountChangeListener(handleAccountChange);
    setupChainChangeListener(handleChainChange);

    return () => {
      removeAccountChangeListener(handleAccountChange);
      removeChainChangeListener(handleChainChange);
    };
  }, []);

  useEffect(() => {
    if (account && isCorrectChain) {
      refreshBalances();
      const interval = setInterval(refreshBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [account, isCorrectChain]);

  const value: Web3ContextType = {
    account,
    isConnected,
    isCorrectChain,
    balances,
    isLoading,
    connect,
    disconnect,
    switchNetwork,
    refreshBalances
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
