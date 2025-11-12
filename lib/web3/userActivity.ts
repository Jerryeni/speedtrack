import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

export interface RecentAction {
  action: string;
  amount: string;
  poolIndex: string;
  fromUser: string;
  timestamp: number;
}

/**
 * Get user's recent actions/transactions
 */
export async function getRecentActions(userAddress: string): Promise<RecentAction[]> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const actions = await contract.getRecentActions(userAddress);
    
    return actions.map((action: any) => ({
      action: action.action,
      amount: ethers.formatUnits(action.amount, 6),
      poolIndex: action.poolIndex.toString(),
      fromUser: action.fromUser,
      timestamp: Number(action.timestamp)
    }));
  } catch (error) {
    console.error('Error fetching recent actions:', error);
    return [];
  }
}

/**
 * Get formatted recent actions with readable timestamps
 */
export async function getFormattedRecentActions(userAddress: string): Promise<Array<RecentAction & { timeAgo: string }>> {
  const actions = await getRecentActions(userAddress);
  
  return actions.map(action => ({
    ...action,
    timeAgo: getTimeAgo(action.timestamp)
  }));
}

/**
 * Helper to convert timestamp to "time ago" format
 */
function getTimeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}
