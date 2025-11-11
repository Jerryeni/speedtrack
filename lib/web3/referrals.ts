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

export async function getReferralStats(userAddress: string): Promise<ReferralStats> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Fetch level income from contract state
    let levelIncome = BigInt(0);
    try {
      levelIncome = await speedTrack.getTotalLevelIncome(userAddress);
    } catch (error) {
      console.error('Error fetching level income:', error);
    }

    // Query SponsorRegistered events to count referrals
    let directReferrals = 0;
    let totalReferrals = 0;
    
    try {
      // Get all SponsorRegistered events where this user is the referrer
      // Event signature: SponsorRegistered(address indexed user, address indexed referrer, ReferralType refType, string referralCode)
      const filter = speedTrack.filters.SponsorRegistered(null, userAddress);
      const events = await speedTrack.queryFilter(filter);
      
      // Count unique users who registered under this referrer
      const uniqueReferrals = new Set<string>();
      events.forEach(event => {
        const eventLog = event as ethers.EventLog;
        if (eventLog.args && eventLog.args.user) {
          uniqueReferrals.add(eventLog.args.user.toLowerCase());
        }
      });
      
      directReferrals = uniqueReferrals.size;
      
      // For total referrals, we'd need to recursively count all levels
      // For now, use direct referrals (can be enhanced later)
      totalReferrals = directReferrals;
      
      console.log(`Found ${directReferrals} direct referrals for ${userAddress}`);
    } catch (eventError) {
      console.error('Error querying referral events:', eventError);
    }

    // Generate referral code and link from wallet address
    const { getCodeFromWallet } = await import('./referralCode');
    const referralCode = getCodeFromWallet(userAddress);
    const referralLink = formatReferralLink(userAddress);
    const shortLink = formatShortReferralLink(userAddress);

    // Safe formatting with validation
    const formattedIncome = levelIncome ? ethers.formatUnits(levelIncome, 6) : '0';

    return {
      totalReferrals,
      totalEarned: formattedIncome,
      levelIncome: formattedIncome,
      directReferrals,
      referralLink,
      shortLink,
      referralCode
    };
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    
    // Return safe defaults with referral info
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

export async function getNetworkLevels(userAddress: string): Promise<NetworkLevel[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Fetch total level income
    let levelIncome = BigInt(0);
    try {
      levelIncome = await speedTrack.getTotalLevelIncome(userAddress);
    } catch (error) {
      console.error('Error fetching level income:', error);
    }
    
    // Get level percentages from contract
    const levelPercentages: number[] = [];
    for (let i = 0; i < 10; i++) {
      try {
        const pct = await speedTrack.levelPercents(i);
        levelPercentages.push(Number(pct));
      } catch {
        // Default percentages if contract call fails
        levelPercentages.push([10, 5, 3, 2, 1, 1, 1, 1, 1, 1][i]);
      }
    }
    
    const levels: NetworkLevel[] = [];
    const totalEarned = levelIncome ? parseFloat(ethers.formatUnits(levelIncome, 6)) : 0;
    
    // Get direct referrals (Level 1)
    try {
      const filter = speedTrack.filters.SponsorRegistered(null, userAddress);
      const events = await speedTrack.queryFilter(filter);
      
      // Count unique users
      const uniqueUsers = new Set<string>();
      events.forEach(event => {
        const eventLog = event as ethers.EventLog;
        if (eventLog.args && eventLog.args.user) {
          uniqueUsers.add(eventLog.args.user.toLowerCase());
        }
      });
      
      const userCount = uniqueUsers.size;
      
      if (userCount > 0) {
        // Calculate estimated earnings for level 1
        const level1Percentage = levelPercentages[0] || 10;
        const level1Earned = totalEarned > 0 
          ? ((totalEarned * level1Percentage) / 100).toFixed(2)
          : '0.00';
        
        levels.push({
          level: 1,
          users: userCount,
          earned: level1Earned
        });
        
        console.log(`Level 1: ${userCount} users, $${level1Earned} earned`);
      }
    } catch (eventError) {
      console.error('Error querying network events:', eventError);
    }
    
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
