import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

export interface DirectReferral {
  address: string;
  userId: string;
  name: string;
  email: string;
  activationLevel: string;
  isActivated: boolean;
  investedAmount: string;
  joinedTimestamp?: number;
}

/**
 * Get direct referral address by index
 */
export async function getDirectReferralAddress(
  userAddress: string,
  index: number
): Promise<string> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const referralAddress = await contract.directReferrals(userAddress, index);
    return referralAddress;
  } catch (error) {
    return ethers.ZeroAddress;
  }
}

/**
 * Get all direct referrals with full details
 */
export async function getDirectReferralsDetailed(
  userAddress: string,
  maxReferrals: number = 100
): Promise<DirectReferral[]> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const referrals: DirectReferral[] = [];
    
    // Iterate through direct referrals array
    for (let i = 0; i < maxReferrals; i++) {
      try {
        const referralAddress = await contract.directReferrals(userAddress, i);
        
        // Check if address is valid
        if (referralAddress === ethers.ZeroAddress) {
          break;
        }
        
        // Get full user info for this referral
        const userInfo = await contract.getUserInfo(referralAddress);
        const userId = await contract.getUserId(referralAddress);
        
        referrals.push({
          address: referralAddress,
          userId: userId.toString(),
          name: userInfo.name || 'Anonymous',
          email: userInfo.email || '',
          activationLevel: userInfo.activationLevel.toString(),
          isActivated: Number(userInfo.activationLevel) > 0,
          investedAmount: ethers.formatUnits(userInfo.investedAmount, 6)
        });
      } catch (error) {
        // No more referrals
        break;
      }
    }
    
    return referrals;
  } catch (error) {
    console.error('Error fetching direct referrals:', error);
    return [];
  }
}

/**
 * Get direct referrals count
 */
export async function getDirectReferralsCount(userAddress: string): Promise<number> {
  try {
    const referrals = await getDirectReferralsDetailed(userAddress);
    return referrals.length;
  } catch (error) {
    console.error('Error counting direct referrals:', error);
    return 0;
  }
}

/**
 * Get direct referrals summary stats
 */
export async function getDirectReferralsSummary(userAddress: string) {
  try {
    const referrals = await getDirectReferralsDetailed(userAddress);
    
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(r => r.isActivated).length;
    const totalInvested = referrals.reduce((sum, r) => sum + parseFloat(r.investedAmount), 0);
    
    // Group by activation level
    const byLevel = referrals.reduce((acc, r) => {
      const level = r.activationLevel;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalReferrals,
      activeReferrals,
      inactiveReferrals: totalReferrals - activeReferrals,
      totalInvested: totalInvested.toFixed(6),
      byLevel,
      referrals
    };
  } catch (error) {
    console.error('Error fetching referrals summary:', error);
    return {
      totalReferrals: 0,
      activeReferrals: 0,
      inactiveReferrals: 0,
      totalInvested: '0',
      byLevel: {},
      referrals: []
    };
  }
}
