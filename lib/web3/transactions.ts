import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

export interface RecentAction {
  action: string;
  amount: string;
  poolIndex: number;
  fromUser: string;
  timestamp: number;
}

export async function getRecentActions(userAddress: string): Promise<RecentAction[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const actions = await speedTrack.getRecentActions(userAddress);
    
    return actions.map((action: any) => ({
      action: action.action || '',
      amount: action.amount ? ethers.formatUnits(action.amount, 6) : '0',
      poolIndex: action.poolIndex ? Number(action.poolIndex) : 0,
      fromUser: action.fromUser || ethers.ZeroAddress,
      timestamp: action.timestamp ? Number(action.timestamp) : 0
    }));
  } catch (error) {
    console.error('Error fetching recent actions:', error);
    return [];
  }
}

export function formatActionType(action: string): { icon: string; color: string; title: string } {
  const actionMap: Record<string, { icon: string; color: string; title: string }> = {
    'INVEST': { icon: 'fa-arrow-up', color: 'text-blue-400', title: 'Pool Investment' },
    'ROI_CLAIM': { icon: 'fa-coins', color: 'text-green-400', title: 'ROI Claimed' },
    'CAPITAL_RETURN': { icon: 'fa-undo', color: 'text-yellow-400', title: 'Capital Returned' },
    'LEVEL_INCOME': { icon: 'fa-users', color: 'text-purple-400', title: 'Level Income' },
    'ST_REWARD': { icon: 'fa-gift', color: 'text-pink-400', title: 'ST Token Reward' },
    'ACTIVATION': { icon: 'fa-check-circle', color: 'text-green-400', title: 'Account Activated' },
    'PROFILE_COMPLETE': { icon: 'fa-user-check', color: 'text-blue-400', title: 'Profile Completed' }
  };
  
  return actionMap[action] || { icon: 'fa-circle', color: 'text-gray-400', title: action };
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
