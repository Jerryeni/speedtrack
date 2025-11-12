import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

export interface TeamMemberInfo {
  userAddr: string;
  userId: string;
  name: string;
  investedAmount: string;
  activationLevel: string;
  isActivated: boolean;
}

export interface GlobalPoolInfo {
  currentPoolNumber: string;
  poolIndex: string;
  poolCapacity: string;
  totalInvested: string;
  totalParticipants: string;
  percentFilled: string;
  estimatedTimeLeft: string;
  isActive: boolean;
}

/**
 * Get direct team members (referrals)
 */
export async function getDirectMembers(): Promise<TeamMemberInfo[]> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const members = await contract.getDirectMembers();
    
    return members.map((m: any) => ({
      userAddr: m.userAddr,
      userId: m.userId.toString(),
      name: m.name || 'Anonymous',
      investedAmount: ethers.formatUnits(m.investedAmount, 6),
      activationLevel: m.activationLevel.toString(),
      isActivated: m.isActivated
    }));
  } catch (error) {
    console.error('Error fetching direct members:', error);
    return [];
  }
}

/**
 * Get total team count (all levels)
 */
export async function getTotalTeamCount(): Promise<number> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const count = await contract.getTotalTeamCount();
    return Number(count);
  } catch (error) {
    console.error('Error fetching total team count:', error);
    return 0;
  }
}

/**
 * Get count of users at specific activation level
 */
export async function getLevelCount(level: number): Promise<number> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const count = await contract.getLevelCount(level);
    return Number(count);
  } catch (error) {
    console.error(`Error fetching level ${level} count:`, error);
    return 0;
  }
}

/**
 * Get level breakdown (counts for all 5 levels)
 */
export async function getLevelBreakdown(): Promise<{ level: number; count: number }[]> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const levels = [0, 1, 2, 3, 4];
    
    const counts = await Promise.all(
      levels.map(level => contract.getLevelCount(level))
    );
    
    return levels.map((level, index) => ({
      level,
      count: Number(counts[index])
    }));
  } catch (error) {
    console.error('Error fetching level breakdown:', error);
    return [0, 1, 2, 3, 4].map(level => ({ level, count: 0 }));
  }
}

/**
 * Get global pool status
 */
export async function getGlobalPoolStatus(): Promise<GlobalPoolInfo | null> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const poolInfo = await contract.getGlobalPoolStatus();
    
    return {
      currentPoolNumber: poolInfo.currentPoolNumber.toString(),
      poolIndex: poolInfo.poolIndex.toString(),
      poolCapacity: ethers.formatUnits(poolInfo.poolCapacity, 6),
      totalInvested: ethers.formatUnits(poolInfo.totalInvested, 6),
      totalParticipants: poolInfo.totalParticipants.toString(),
      percentFilled: poolInfo.percentFilled.toString(),
      estimatedTimeLeft: poolInfo.estimatedTimeLeft.toString(),
      isActive: poolInfo.isActive
    };
  } catch (error) {
    console.error('Error fetching global pool status:', error);
    return null;
  }
}

/**
 * Check if user is eligible for global pool
 */
export async function isEligibleForGlobal(userAddress: string): Promise<boolean> {
  try {
    const contract = await getSpeedTrackReadOnly();
    return await contract.isEligibleForGlobal(userAddress);
  } catch (error) {
    console.error('Error checking global eligibility:', error);
    return false;
  }
}
