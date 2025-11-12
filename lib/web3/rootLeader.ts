import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';
import { getPoolDetails } from './poolInvestments';

export interface RootLeaderPool {
  poolIndex: number;
  poolId: string;
  size: string;
  currentFilled: string;
  unpaidCapital: string;
  percentFilled: number;
  isActive: boolean;
}

/**
 * Get root leader pool ID by index
 */
export async function getRootLeaderPool(
  userAddress: string,
  index: number
): Promise<string> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const poolId = await contract.rootLeaderPools(userAddress, index);
    return poolId.toString();
  } catch (error) {
    console.error(`Error fetching root leader pool ${index}:`, error);
    return '0';
  }
}

/**
 * Get all root leader pools for a user
 */
export async function getAllRootLeaderPools(
  userAddress: string,
  maxPools: number = 10
): Promise<RootLeaderPool[]> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const pools: RootLeaderPool[] = [];
    
    for (let i = 0; i < maxPools; i++) {
      try {
        const poolId = await contract.rootLeaderPools(userAddress, i);
        const poolIdNum = Number(poolId);
        
        if (poolIdNum === 0) {
          break;
        }
        
        // Get pool details
        const poolDetails = await getPoolDetails(poolIdNum);
        
        if (poolDetails) {
          pools.push({
            poolIndex: i,
            poolId: poolId.toString(),
            size: poolDetails.size,
            currentFilled: poolDetails.currentFilled,
            unpaidCapital: poolDetails.unpaidCapital,
            percentFilled: poolDetails.percentFilled,
            isActive: poolDetails.percentFilled < 100
          });
        }
      } catch (error) {
        break;
      }
    }
    
    return pools;
  } catch (error) {
    console.error('Error fetching root leader pools:', error);
    return [];
  }
}

/**
 * Check if user is a root leader
 */
export async function isRootLeader(userAddress: string): Promise<boolean> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const userInfo = await contract.getUserInfo(userAddress);
    return userInfo.isRootLeader;
  } catch (error) {
    console.error('Error checking root leader status:', error);
    return false;
  }
}

/**
 * Get root leader dashboard data
 */
export async function getRootLeaderDashboard(userAddress: string) {
  try {
    const [isLeader, pools] = await Promise.all([
      isRootLeader(userAddress),
      getAllRootLeaderPools(userAddress)
    ]);
    
    if (!isLeader) {
      return {
        isRootLeader: false,
        totalPools: 0,
        activePools: 0,
        completedPools: 0,
        totalSize: '0',
        totalFilled: '0',
        totalUnpaid: '0',
        pools: []
      };
    }
    
    const activePools = pools.filter(p => p.isActive).length;
    const completedPools = pools.filter(p => !p.isActive).length;
    
    const totalSize = pools.reduce((sum, p) => sum + parseFloat(p.size), 0);
    const totalFilled = pools.reduce((sum, p) => sum + parseFloat(p.currentFilled), 0);
    const totalUnpaid = pools.reduce((sum, p) => sum + parseFloat(p.unpaidCapital), 0);
    
    return {
      isRootLeader: true,
      totalPools: pools.length,
      activePools,
      completedPools,
      totalSize: totalSize.toFixed(6),
      totalFilled: totalFilled.toFixed(6),
      totalUnpaid: totalUnpaid.toFixed(6),
      pools
    };
  } catch (error) {
    console.error('Error fetching root leader dashboard:', error);
    return {
      isRootLeader: false,
      totalPools: 0,
      activePools: 0,
      completedPools: 0,
      totalSize: '0',
      totalFilled: '0',
      totalUnpaid: '0',
      pools: []
    };
  }
}
