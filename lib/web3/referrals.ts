import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';
import { formatReferralLink, formatShortReferralLink } from './referralCode';

export interface ReferralStats {
  totalReferrals: number;
  totalEarned: string;
  levelIncome: string;
  directReferrals: number;
  referralLink: string;
  shortLink: string;
  referralCode: string;
}

export interface NetworkLevel {
  level: number;
  users: number;
  earned: string;
}

// Cache for referral stats
const referralStatsCache = new Map<string, { data: ReferralStats; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export async function getReferralStats(userAddress: string): Promise<ReferralStats> {
  // Check cache first
  const cached = referralStatsCache.get(userAddress.toLowerCase());
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Parallel fetch for better performance
    const [levelIncome, events] = await Promise.all([
      speedTrack.getTotalLevelIncome(userAddress).catch(() => BigInt(0)),
      speedTrack.queryFilter(speedTrack.filters.SponsorRegistered(null, userAddress)).catch(() => [])
    ]);

    // Count unique referrals
    let directReferrals = 0;
    if (events.length > 0) {
      const uniqueReferrals = new Set<string>();
      events.forEach(event => {
        const eventLog = event as ethers.EventLog;
        if (eventLog.args?.user) {
          uniqueReferrals.add(eventLog.args.user.toLowerCase());
        }
      });
      directReferrals = uniqueReferrals.size;
    } else {
      // Fallback: full scan only if filtered returns 0
      const allEvents = await speedTrack.queryFilter(speedTrack.filters.SponsorRegistered()).catch(() => []);
      const userReferrals = allEvents.filter(event => {
        const eventLog = event as ethers.EventLog;
        return eventLog.args?.referrer?.toLowerCase() === userAddress.toLowerCase();
      });
      
      const uniqueReferrals = new Set<string>();
      userReferrals.forEach(event => {
        const eventLog = event as ethers.EventLog;
        if (eventLog.args?.user) {
          uniqueReferrals.add(eventLog.args.user.toLowerCase());
        }
      });
      directReferrals = uniqueReferrals.size;
    }

    // Generate referral info
    const { getCodeFromWallet } = await import('./referralCode');
    const referralCode = getCodeFromWallet(userAddress);
    const referralLink = formatReferralLink(userAddress);
    const shortLink = formatShortReferralLink(userAddress);
    const formattedIncome = levelIncome ? ethers.formatUnits(levelIncome, 6) : '0';

    const result = {
      totalReferrals: directReferrals,
      totalEarned: formattedIncome,
      levelIncome: formattedIncome,
      directReferrals,
      referralLink,
      shortLink,
      referralCode
    };
    
    // Cache the result
    referralStatsCache.set(userAddress.toLowerCase(), { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    
    const { getCodeFromWallet } = await import('./referralCode');
    const referralCode = getCodeFromWallet(userAddress);
    const referralLink = formatReferralLink(userAddress);
    const shortLink = formatShortReferralLink(userAddress);
    
    return {
      totalReferrals: 0,
      totalEarned: '0',
      levelIncome: '0',
      directReferrals: 0,
      referralLink,
      shortLink,
      referralCode
    };
  }
}

// Cache for network levels
const networkLevelsCache = new Map<string, { data: NetworkLevel[]; timestamp: number }>();

export async function getNetworkLevels(userAddress: string): Promise<NetworkLevel[]> {
  // Check cache
  const cached = networkLevelsCache.get(userAddress.toLowerCase());
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Parallel fetch
    const [levelIncome, events] = await Promise.all([
      speedTrack.getTotalLevelIncome(userAddress).catch(() => BigInt(0)),
      speedTrack.queryFilter(speedTrack.filters.SponsorRegistered(null, userAddress)).catch(() => [])
    ]);
    
    // Get level percentages (use defaults to avoid multiple calls)
    const levelPercentages = [10, 5, 3, 2, 1, 1, 1, 1, 1, 1];
    const levels: NetworkLevel[] = [];
    const totalEarned = levelIncome ? parseFloat(ethers.formatUnits(levelIncome, 6)) : 0;
    
    // Count unique users
    let userCount = 0;
    if (events.length > 0) {
      const uniqueUsers = new Set<string>();
      events.forEach(event => {
        const eventLog = event as ethers.EventLog;
        if (eventLog.args?.user) {
          uniqueUsers.add(eventLog.args.user.toLowerCase());
        }
      });
      userCount = uniqueUsers.size;
    }
    
    if (userCount > 0) {
      const level1Percentage = levelPercentages[0];
      const level1Earned = totalEarned > 0 
        ? ((totalEarned * level1Percentage) / 100).toFixed(2)
        : '0.00';
      
      levels.push({
        level: 1,
        users: userCount,
        earned: level1Earned
      });
    }
    
    // Cache result
    networkLevelsCache.set(userAddress.toLowerCase(), { data: levels, timestamp: Date.now() });
    
    return levels;
  } catch (error) {
    console.error('Error fetching network levels:', error);
    return [];
  }
}

export async function getReferralClicks(_userAddress: string): Promise<number> {
  // This would require backend tracking or events
  return 0;
}

export async function getReferralConversionRate(userAddress: string): Promise<number> {
  try {
    const clicks = await getReferralClicks(userAddress);
    const stats = await getReferralStats(userAddress);
    
    if (clicks === 0) return 0;
    return (stats.totalReferrals / clicks) * 100;
  } catch {
    return 0;
  }
}
