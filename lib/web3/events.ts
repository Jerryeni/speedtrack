import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

/**
 * Event tracking and aggregation for platform statistics
 * This module listens to contract events and aggregates data
 */

// ============================================
// EVENT TYPES
// ============================================

export interface Transaction {
  hash: string;
  type: 'activation' | 'pool_invest' | 'reward_claim' | 'st_buy' | 'st_sell' | 'registration' | 'profile_complete';
  amount?: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  from?: string;
  to?: string;
  blockNumber?: number;
}

export interface UserRegisteredEvent {
  user: string;
  userId: bigint;
  referrer: string;
  timestamp: number;
  blockNumber: number;
}

export interface AccountActivatedEvent {
  user: string;
  level: bigint;
  timestamp: number;
  blockNumber: number;
}

export interface InvestmentMadeEvent {
  user: string;
  poolIndex: bigint;
  amount: bigint;
  timestamp: number;
  blockNumber: number;
}

export interface ROIClaimedEvent {
  user: string;
  amount: bigint;
  timestamp: number;
  blockNumber: number;
}

export interface LevelIncomeReceivedEvent {
  user: string;
  fromUser: string;
  amount: bigint;
  level: bigint;
  timestamp: number;
  blockNumber: number;
}

export interface CapitalReturnedEvent {
  user: string;
  amount: bigint;
  poolIndex: bigint;
  timestamp: number;
  blockNumber: number;
}

export interface STTokensReceivedEvent {
  user: string;
  usdtAmount: bigint;
  poolIndex: bigint;
  timestamp: number;
  blockNumber: number;
}

// ============================================
// AGGREGATE STATISTICS
// ============================================

export interface PlatformStatistics {
  totalUsers: number;
  totalActivations: number;
  totalInvested: string;
  totalROIPaid: string;
  totalLevelIncome: string;
  totalCapitalReturned: string;
  totalSTDistributed: string;
  activePools: number;
  lastUpdated: number;
}

// ============================================
// EVENT FETCHING
// ============================================

/**
 * Get all user registration events
 */
export async function getUserRegistrationEvents(fromBlock: number = 0): Promise<UserRegisteredEvent[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const filter = speedTrack.filters.SponsorRegistered();
    const events = await speedTrack.queryFilter(filter, fromBlock);
    
    return events.map(event => {
      const eventLog = event as ethers.EventLog;
      return {
        user: eventLog.args?.user || ethers.ZeroAddress,
        userId: eventLog.args?.userId || BigInt(0),
        referrer: eventLog.args?.referrer || ethers.ZeroAddress,
        timestamp: Date.now() / 1000,
        blockNumber: event.blockNumber
      };
    });
  } catch (error) {
    console.error('Error fetching registration events:', error);
    return [];
  }
}

/**
 * Get all activation events
 */
export async function getActivationEvents(fromBlock: number = 0): Promise<AccountActivatedEvent[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const filter = speedTrack.filters.AccountActivated();
    const events = await speedTrack.queryFilter(filter, fromBlock);
    
    return events.map(event => {
      const eventLog = event as ethers.EventLog;
      return {
        user: eventLog.args?.user || ethers.ZeroAddress,
        level: eventLog.args?.level || BigInt(0),
        timestamp: Date.now() / 1000,
        blockNumber: event.blockNumber
      };
    });
  } catch (error) {
    console.error('Error fetching activation events:', error);
    return [];
  }
}

/**
 * Get all investment events
 */
export async function getInvestmentEvents(fromBlock: number = 0): Promise<InvestmentMadeEvent[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const filter = speedTrack.filters.InvestmentMade();
    const events = await speedTrack.queryFilter(filter, fromBlock);
    
    return events.map(event => {
      const eventLog = event as ethers.EventLog;
      return {
        user: eventLog.args?.user || ethers.ZeroAddress,
        poolIndex: eventLog.args?.poolIndex || BigInt(0),
        amount: eventLog.args?.amount || BigInt(0),
        timestamp: Date.now() / 1000,
        blockNumber: event.blockNumber
      };
    });
  } catch (error) {
    console.error('Error fetching investment events:', error);
    return [];
  }
}

/**
 * Get all ROI claimed events
 */
export async function getROIClaimedEvents(fromBlock: number = 0): Promise<ROIClaimedEvent[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const filter = speedTrack.filters.ROIClaimed();
    const events = await speedTrack.queryFilter(filter, fromBlock);
    
    return events.map(event => {
      const eventLog = event as ethers.EventLog;
      return {
        user: eventLog.args?.user || ethers.ZeroAddress,
        amount: eventLog.args?.amount || BigInt(0),
        timestamp: Date.now() / 1000,
        blockNumber: event.blockNumber
      };
    });
  } catch (error) {
    console.error('Error fetching ROI claimed events:', error);
    return [];
  }
}

/**
 * Get all level income events
 */
export async function getLevelIncomeEvents(fromBlock: number = 0): Promise<LevelIncomeReceivedEvent[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const filter = speedTrack.filters.LevelIncomeReceived();
    const events = await speedTrack.queryFilter(filter, fromBlock);
    
    return events.map(event => {
      const eventLog = event as ethers.EventLog;
      return {
        user: eventLog.args?.user || ethers.ZeroAddress,
        fromUser: eventLog.args?.fromUser || ethers.ZeroAddress,
        amount: eventLog.args?.amount || BigInt(0),
        level: eventLog.args?.level || BigInt(0),
        timestamp: Date.now() / 1000,
        blockNumber: event.blockNumber
      };
    });
  } catch (error) {
    console.error('Error fetching level income events:', error);
    return [];
  }
}

/**
 * Get all capital returned events
 */
export async function getCapitalReturnedEvents(fromBlock: number = 0): Promise<CapitalReturnedEvent[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const filter = speedTrack.filters.CapitalReturned();
    const events = await speedTrack.queryFilter(filter, fromBlock);
    
    return events.map(event => {
      const eventLog = event as ethers.EventLog;
      return {
        user: eventLog.args?.user || ethers.ZeroAddress,
        amount: eventLog.args?.amount || BigInt(0),
        poolIndex: eventLog.args?.poolIndex || BigInt(0),
        timestamp: Date.now() / 1000,
        blockNumber: event.blockNumber
      };
    });
  } catch (error) {
    console.error('Error fetching capital returned events:', error);
    return [];
  }
}

/**
 * Get all ST tokens received events
 */
export async function getSTTokensReceivedEvents(fromBlock: number = 0): Promise<STTokensReceivedEvent[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const filter = speedTrack.filters.STTokensReceived();
    const events = await speedTrack.queryFilter(filter, fromBlock);
    
    return events.map(event => {
      const eventLog = event as ethers.EventLog;
      return {
        user: eventLog.args?.user || ethers.ZeroAddress,
        usdtAmount: eventLog.args?.usdtAmount || BigInt(0),
        poolIndex: eventLog.args?.poolIndex || BigInt(0),
        timestamp: Date.now() / 1000,
        blockNumber: event.blockNumber
      };
    });
  } catch (error) {
    console.error('Error fetching ST tokens events:', error);
    return [];
  }
}

// ============================================
// AGGREGATE STATISTICS CALCULATION
// ============================================

/**
 * Calculate platform-wide statistics from events
 * This aggregates all events to provide total statistics
 */
export async function calculatePlatformStatistics(fromBlock: number = 0): Promise<PlatformStatistics> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Fetch all events in parallel for maximum performance
    const [
      registrations,
      activations,
      investments,
      roiClaims,
      levelIncomes,
      capitalReturns,
      stTokens
    ] = await Promise.all([
      speedTrack.queryFilter(speedTrack.filters.SponsorRegistered(), fromBlock).catch(() => []),
      speedTrack.queryFilter(speedTrack.filters.AccountActivated(), fromBlock).catch(() => []),
      speedTrack.queryFilter(speedTrack.filters.InvestmentMade(), fromBlock).catch(() => []),
      speedTrack.queryFilter(speedTrack.filters.ROIClaimed(), fromBlock).catch(() => []),
      speedTrack.queryFilter(speedTrack.filters.LevelIncomeReceived(), fromBlock).catch(() => []),
      speedTrack.queryFilter(speedTrack.filters.CapitalReturned(), fromBlock).catch(() => []),
      speedTrack.queryFilter(speedTrack.filters.STTokensReceived(), fromBlock).catch(() => [])
    ]);

    // Calculate totals with safe BigInt aggregation
    // Cast events to EventLog to access args
    const registrationEvents = registrations.filter((e): e is ethers.EventLog => 'args' in e) as ethers.EventLog[];
    const investmentEvents = investments.filter((e): e is ethers.EventLog => 'args' in e) as ethers.EventLog[];
    const roiClaimEvents = roiClaims.filter((e): e is ethers.EventLog => 'args' in e) as ethers.EventLog[];
    const levelIncomeEvents = levelIncomes.filter((e): e is ethers.EventLog => 'args' in e) as ethers.EventLog[];
    const capitalReturnEvents = capitalReturns.filter((e): e is ethers.EventLog => 'args' in e) as ethers.EventLog[];
    const stTokenEvents = stTokens.filter((e): e is ethers.EventLog => 'args' in e) as ethers.EventLog[];
    
    const totalUsers = new Set(
      registrationEvents.map(e => (e.args[0] as string).toLowerCase())
    ).size;
    const totalActivations = activations.length;
    
    // Safe BigInt aggregation - sum first, then format
    const totalInvested = investmentEvents.reduce((sum, e) => {
      try {
        return sum + (e.args[2] as bigint || BigInt(0));
      } catch {
        return sum;
      }
    }, BigInt(0));
    
    const totalROIPaid = roiClaimEvents.reduce((sum, e) => {
      try {
        return sum + (e.args[1] as bigint || BigInt(0));
      } catch {
        return sum;
      }
    }, BigInt(0));
    
    const totalLevelIncome = levelIncomeEvents.reduce((sum, e) => {
      try {
        return sum + (e.args[2] as bigint || BigInt(0));
      } catch {
        return sum;
      }
    }, BigInt(0));
    
    const totalCapitalReturned = capitalReturnEvents.reduce((sum, e) => {
      try {
        return sum + (e.args[1] as bigint || BigInt(0));
      } catch {
        return sum;
      }
    }, BigInt(0));
    
    const totalSTDistributed = stTokenEvents.reduce((sum, e) => {
      try {
        return sum + (e.args[1] as bigint || BigInt(0));
      } catch {
        return sum;
      }
    }, BigInt(0));
    
    // Get unique pools
    const activePools = new Set(
      investmentEvents.map(e => (e.args[1] as bigint).toString())
    ).size;

    // Format all amounts with proper decimal places (USDT = 6 decimals)
    return {
      totalUsers,
      totalActivations,
      totalInvested: ethers.formatUnits(totalInvested, 6),
      totalROIPaid: ethers.formatUnits(totalROIPaid, 6),
      totalLevelIncome: ethers.formatUnits(totalLevelIncome, 6),
      totalCapitalReturned: ethers.formatUnits(totalCapitalReturned, 6),
      totalSTDistributed: ethers.formatUnits(totalSTDistributed, 6),
      activePools: activePools || 0,
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error('Error calculating platform statistics:', error);
    return {
      totalUsers: 0,
      totalActivations: 0,
      totalInvested: '0',
      totalROIPaid: '0',
      totalLevelIncome: '0',
      totalCapitalReturned: '0',
      totalSTDistributed: '0',
      activePools: 0,
      lastUpdated: Date.now()
    };
  }
}

// ============================================
// CACHED STATISTICS (for performance)
// ============================================

let cachedStats: PlatformStatistics | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get platform statistics with caching
 * This reduces the number of RPC calls
 */
export async function getPlatformStatistics(forceRefresh: boolean = false): Promise<PlatformStatistics> {
  const now = Date.now();
  
  // Return cached data if available and not expired
  if (!forceRefresh && cachedStats && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedStats;
  }
  
  // Fetch fresh data
  cachedStats = await calculatePlatformStatistics();
  lastFetchTime = now;
  
  return cachedStats;
}

/**
 * Clear the statistics cache
 */
export function clearStatisticsCache() {
  cachedStats = null;
  lastFetchTime = 0;
}

// ============================================
// USER-SPECIFIC EVENT QUERIES
// ============================================

/**
 * Get all events for a specific user
 */
export async function getUserEvents(userAddress: string, fromBlock: number = 0) {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Create filters for user-specific events
    const filters = [
      speedTrack.filters.InvestmentMade(userAddress),
      speedTrack.filters.ROIClaimed(userAddress),
      speedTrack.filters.LevelIncomeReceived(userAddress),
      speedTrack.filters.CapitalReturned(userAddress),
      speedTrack.filters.STTokensReceived(userAddress),
      speedTrack.filters.AccountActivated(userAddress)
    ];
    
    // Fetch all events in parallel
    const eventArrays = await Promise.all(
      filters.map(filter => speedTrack.queryFilter(filter, fromBlock))
    );
    
    // Flatten and sort by block number
    const allEvents = eventArrays.flat().sort((a, b) => a.blockNumber - b.blockNumber);
    
    return allEvents;
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
}

/**
 * Get event count for a user
 */
export async function getUserEventCount(userAddress: string): Promise<number> {
  const events = await getUserEvents(userAddress);
  return events.length;
}

// ============================================
// TRANSACTION HELPERS
// ============================================

/**
 * Convert events to Transaction format for UI display
 */
export async function getUserTransactions(userAddress: string, limit: number = 10): Promise<Transaction[]> {
  try {
    const events = await getUserEvents(userAddress);
    
    // Convert events to transactions
    const transactions: Transaction[] = events.map(event => {
      const eventLog = event as ethers.EventLog;
      const eventName = eventLog.eventName || '';
      
      let type: Transaction['type'] = 'registration';
      let amount: string | undefined;
      
      // Determine transaction type and amount
      if (eventName === 'InvestmentMade') {
        type = 'pool_invest';
        amount = ethers.formatUnits(eventLog.args?.amount || 0, 6);
      } else if (eventName === 'ROIClaimed') {
        type = 'reward_claim';
        amount = ethers.formatUnits(eventLog.args?.amount || 0, 6);
      } else if (eventName === 'AccountActivated') {
        type = 'activation';
      } else if (eventName === 'SponsorRegistered') {
        type = 'registration';
      }
      
      return {
        hash: event.transactionHash || '',
        type,
        amount,
        timestamp: Date.now() / 1000, // Would need block timestamp in real implementation
        status: 'completed' as const,
        from: userAddress,
        to: eventLog.address,
        blockNumber: event.blockNumber
      };
    });
    
    // Sort by block number (most recent first) and limit
    return transactions
      .sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting user transactions:', error);
    return [];
  }
}

/**
 * Setup event listeners for real-time updates
 */
export function setupEventListeners(
  userAddress: string,
  onNewTransaction: (transaction: Transaction) => void
): () => void {
  // This would setup WebSocket listeners in a real implementation
  // For now, return a no-op cleanup function
  console.log('Event listeners setup for:', userAddress);
  
  return () => {
    console.log('Event listeners cleaned up for:', userAddress);
  };
}
