import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from '../contracts';

/**
 * Hook for listening to real-time contract events
 * Provides live updates when events occur on the blockchain
 */

export interface RealtimeEvent {
  type: string;
  user?: string;
  amount?: string;
  poolIndex?: number;
  level?: number;
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
}

export function useRealtimeEvents(enabled: boolean = true) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEvent = useCallback((event: RealtimeEvent) => {
    setEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let speedTrack: any;
    const listeners: Array<{ event: string; listener: (...args: any[]) => void }> = [];

    async function setupListeners() {
      try {
        speedTrack = await getSpeedTrackReadOnly();
        setIsListening(true);
        setError(null);

        // User Registration
        const onRegistration = (user: string, referrer: string, refType: number, referralCode: string, event: any) => {
          addEvent({
            type: 'UserRegistered',
            user,
            timestamp: Date.now(),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash
          });
        };
        speedTrack.on('SponsorRegistered', onRegistration);
        listeners.push({ event: 'SponsorRegistered', listener: onRegistration });

        // Account Activation
        const onActivation = (user: string, level: bigint, event: any) => {
          addEvent({
            type: 'AccountActivated',
            user,
            level: Number(level),
            timestamp: Date.now(),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash
          });
        };
        speedTrack.on('Activated', onActivation);
        listeners.push({ event: 'Activated', listener: onActivation });

        // Investment Made
        const onInvestment = (user: string, poolIndex: bigint, amount: bigint, event: any) => {
          addEvent({
            type: 'InvestmentMade',
            user,
            poolIndex: Number(poolIndex),
            amount: ethers.formatUnits(amount, 6),
            timestamp: Date.now(),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash
          });
        };
        speedTrack.on('InvestmentMade', onInvestment);
        listeners.push({ event: 'InvestmentMade', listener: onInvestment });

        // ROI Claimed
        const onROIClaimed = (user: string, amount: bigint, event: any) => {
          addEvent({
            type: 'ROIClaimed',
            user,
            amount: ethers.formatUnits(amount, 6),
            timestamp: Date.now(),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash
          });
        };
        speedTrack.on('ROIClaimed', onROIClaimed);
        listeners.push({ event: 'ROIClaimed', listener: onROIClaimed });

        // Level Income
        const onLevelIncome = (user: string, fromUser: string, amount: bigint, level: bigint, event: any) => {
          addEvent({
            type: 'LevelIncomeReceived',
            user,
            amount: ethers.formatUnits(amount, 6),
            level: Number(level),
            timestamp: Date.now(),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash
          });
        };
        speedTrack.on('LevelIncomeReceived', onLevelIncome);
        listeners.push({ event: 'LevelIncomeReceived', listener: onLevelIncome });

        // Capital Returned
        const onCapitalReturn = (user: string, amount: bigint, poolIndex: bigint, isFull: boolean, event: any) => {
          addEvent({
            type: 'CapitalReturned',
            user,
            amount: ethers.formatUnits(amount, 6),
            poolIndex: Number(poolIndex),
            timestamp: Date.now(),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash
          });
        };
        speedTrack.on('CapitalReturned', onCapitalReturn);
        listeners.push({ event: 'CapitalReturned', listener: onCapitalReturn });

        // ST Tokens Received
        const onSTTokens = (user: string, usdtAmount: bigint, poolIndex: bigint, event: any) => {
          addEvent({
            type: 'STTokensReceived',
            user,
            amount: ethers.formatUnits(usdtAmount, 6),
            poolIndex: Number(poolIndex),
            timestamp: Date.now(),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash
          });
        };
        speedTrack.on('STTokensReceived', onSTTokens);
        listeners.push({ event: 'STTokensReceived', listener: onSTTokens });

        // Pool Events
        const onPoolOpened = (poolIndex: bigint, size: bigint, isGlobal: boolean, owner: string, event: any) => {
          addEvent({
            type: 'PoolOpened',
            poolIndex: Number(poolIndex),
            amount: ethers.formatUnits(size, 6),
            user: owner,
            timestamp: Date.now(),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash
          });
        };
        speedTrack.on('PoolOpened', onPoolOpened);
        listeners.push({ event: 'PoolOpened', listener: onPoolOpened });

        const onPoolFilled = (poolIndex: bigint, size: bigint, event: any) => {
          addEvent({
            type: 'PoolFilled',
            poolIndex: Number(poolIndex),
            amount: ethers.formatUnits(size, 6),
            timestamp: Date.now(),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash
          });
        };
        speedTrack.on('PoolFilled', onPoolFilled);
        listeners.push({ event: 'PoolFilled', listener: onPoolFilled });

      } catch (err: any) {
        console.error('Error setting up event listeners:', err);
        setError(err.message || 'Failed to setup event listeners');
        setIsListening(false);
      }
    }

    setupListeners();

    // Cleanup
    return () => {
      if (speedTrack) {
        listeners.forEach(({ event, listener }) => {
          speedTrack.off(event, listener);
        });
      }
      setIsListening(false);
    };
  }, [enabled, addEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    isListening,
    error,
    clearEvents
  };
}
