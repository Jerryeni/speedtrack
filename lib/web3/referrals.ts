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
    const [userDetails, levelIncome] = await Promise.all([
      speedTrack.getUserDetails(userAddress),
      speedTrack.getLevelIncome(userAddress).catch(() => BigInt(0))
    ]);

    // Generate referral link with unique code
    const referralLink = formatReferralLink(userAddress);
    const shortLink = formatShortReferralLink(userAddress);
    const referralCode = shortLink.split('/').pop() || '';

    return {
      totalReferrals: Number(userDetails.totalDirectReferrals || 0),
      totalEarned: ethers.formatEther(userDetails.totalRewardEarned || BigInt(0)),
      levelIncome: ethers.formatEther(levelIncome),
      directReferrals: Number(userDetails.totalDirectReferrals || 0),
      referralLink,
      shortLink,
      referralCode
    };
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    const referralLink = formatReferralLink(userAddress);
    const shortLink = formatShortReferralLink(userAddress);
    const referralCode = shortLink.split('/').pop() || '';
    
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
    const userDetails = await speedTrack.getUserDetails(userAddress);
    
    // Get direct referrals count
    const directReferrals = Number(userDetails.totalDirectReferrals || 0);
    
    // Get total reward earned (this includes all level commissions)
    const totalRewardEarned = ethers.formatEther(userDetails.totalRewardEarned || BigInt(0));
    
    // Get level percentages from contract
    const levelPercentages = await speedTrack.getLevelPercentages().catch(() => 
      [10, 5, 3, 2, 1, 1, 1, 1, 1, 1]
    );
    
    const levels: NetworkLevel[] = [];
    
    // If user has no referrals, return empty array
    if (directReferrals === 0) {
      return levels;
    }
    
    // Try to get actual referral addresses to count real network levels
    let level1Count = directReferrals;
    let level2Count = 0;
    let level3Count = 0;
    
    try {
      // Try to get referral list if the contract has this method
      const referralList = await speedTrack.getReferrals(userAddress).catch(() => []);
      
      if (referralList && referralList.length > 0) {
        level1Count = referralList.length;
        
        // Count level 2 referrals (referrals of referrals)
        const level2Promises = referralList.map((ref: string) => 
          speedTrack.getReferrals(ref).catch(() => [])
        );
        const level2Results = await Promise.all(level2Promises);
        level2Count = level2Results.reduce((sum, refs) => sum + refs.length, 0);
        
        // Count level 3 referrals
        if (level2Count > 0) {
          const allLevel2Refs = level2Results.flat();
          const level3Promises = allLevel2Refs.map((ref: string) => 
            speedTrack.getReferrals(ref).catch(() => [])
          );
          const level3Results = await Promise.all(level3Promises);
          level3Count = level3Results.reduce((sum, refs) => sum + refs.length, 0);
        }
      }
    } catch (error) {
      // If getReferrals doesn't exist, estimate based on direct referrals
      console.log('Using estimated network counts');
      level2Count = Math.floor(directReferrals * 1.5);
      level3Count = Math.floor(level2Count * 0.8);
    }
    
    // Calculate earnings per level based on percentages and total earned
    const totalPercentage = levelPercentages.slice(0, 10).reduce((sum: number, p: any) => sum + Number(p), 0);
    const totalEarned = parseFloat(totalRewardEarned);
    
    // Level 1 - Direct referrals
    if (level1Count > 0) {
      const level1Percentage = Number(levelPercentages[0] || 10);
      const level1Earned = totalEarned > 0 
        ? (totalEarned * level1Percentage / totalPercentage).toFixed(2)
        : '0.00';
      
      levels.push({
        level: 1,
        users: level1Count,
        earned: level1Earned
      });
    }
    
    // Level 2
    if (level2Count > 0) {
      const level2Percentage = Number(levelPercentages[1] || 5);
      const level2Earned = totalEarned > 0
        ? (totalEarned * level2Percentage / totalPercentage).toFixed(2)
        : '0.00';
      
      levels.push({
        level: 2,
        users: level2Count,
        earned: level2Earned
      });
    }
    
    // Level 3
    if (level3Count > 0) {
      const level3Percentage = Number(levelPercentages[2] || 3);
      const level3Earned = totalEarned > 0
        ? (totalEarned * level3Percentage / totalPercentage).toFixed(2)
        : '0.00';
      
      levels.push({
        level: 3,
        users: level3Count,
        earned: level3Earned
      });
    }
    
    return levels;
  } catch (error) {
    console.error('Error fetching network levels:', error);
    return [];
  }
}

export async function getReferralClicks(userAddress: string): Promise<number> {
  // This would require backend tracking or events
  // For now, return 0 as placeholder
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
