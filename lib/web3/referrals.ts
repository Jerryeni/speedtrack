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
    
    // Get level income to estimate earnings per level
    const levelIncome = await speedTrack.getLevelIncome(userAddress).catch(() => BigInt(0));
    const totalLevelIncome = ethers.formatEther(levelIncome);
    
    // Get level percentages
    const levelPercentages = await speedTrack.getLevelPercentages().catch(() => 
      [10, 5, 3, 2, 1, 1, 1, 1, 1, 1]
    );
    
    // Calculate estimated earnings per level based on percentages
    const totalPercentage = levelPercentages.reduce((sum: number, p: any) => sum + Number(p), 0);
    
    const levels: NetworkLevel[] = [];
    
    // Level 1 - Direct referrals
    if (directReferrals > 0) {
      const level1Percentage = Number(levelPercentages[0] || 10);
      const level1Earned = (parseFloat(totalLevelIncome) * level1Percentage / totalPercentage).toFixed(2);
      
      levels.push({
        level: 1,
        users: directReferrals,
        earned: level1Earned
      });
    }
    
    // Estimate Level 2 and 3 based on typical network growth
    // Assuming each referral brings 1-2 more people
    if (directReferrals > 0) {
      const level2Users = Math.floor(directReferrals * 1.5);
      const level2Percentage = Number(levelPercentages[1] || 5);
      const level2Earned = (parseFloat(totalLevelIncome) * level2Percentage / totalPercentage).toFixed(2);
      
      levels.push({
        level: 2,
        users: level2Users,
        earned: level2Earned
      });
      
      // Level 3
      if (level2Users > 0) {
        const level3Users = Math.floor(level2Users * 0.5);
        const level3Percentage = Number(levelPercentages[2] || 3);
        const level3Earned = (parseFloat(totalLevelIncome) * level3Percentage / totalPercentage).toFixed(2);
        
        levels.push({
          level: 3,
          users: level3Users,
          earned: level3Earned
        });
      }
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
