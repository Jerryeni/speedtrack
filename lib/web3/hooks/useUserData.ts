"use client";

import { useState, useEffect } from 'react';
import { useWeb3 } from '../Web3Context';
import { getUserDetails } from '../activation';
import { getRewardSummary } from '../rewards';
import { getCurrentPool, getPoolInfo, getUserPoolInvestments } from '../pools';

export function useUserData() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [userData, setUserData] = useState<any>(null);
  const [rewardData, setRewardData] = useState<any>(null);
  const [poolData, setPoolData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!account || !isConnected || !isCorrectChain) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [user, rewards, currentPoolNum] = await Promise.all([
          getUserDetails(account),
          getRewardSummary(account),
          getCurrentPool()
        ]);

        const [currentPool, userInvestments] = await Promise.all([
          getPoolInfo(currentPoolNum),
          getUserPoolInvestments(account)
        ]);

        setUserData(user);
        setRewardData(rewards);
        setPoolData({ current: currentPool, investments: userInvestments });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  return {
    userData,
    rewardData,
    poolData,
    isLoading,
    error,
    isActivated: userData?.activated || false
  };
}
