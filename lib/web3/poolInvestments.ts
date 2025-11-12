import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

export interface UserPoolInvestment {
  poolIndex: number;
  amount: string;
  poolSize: string;
  poolFilled: string;
  isGlobal: boolean;
  owner: string;
  unpaidCapital: string;
  percentFilled: number;
}

/**
 * Get user's investment in a specific pool
 */
export async function getUserInvestmentInPool(
  userAddress: string,
  poolIndex: number
): Promise<string> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const investment = await contract.userInvestmentInPool(userAddress, poolIndex);
    return ethers.formatUnits(investment, 6);
  } catch (error) {
    console.error(`Error fetching investment for pool ${poolIndex}:`, error);
    return '0';
  }
}

/**
 * Get all user's pool investments (scans active pools)
 */
export async function getAllUserPoolInvestments(
  userAddress: string,
  maxPools: number = 50
): Promise<UserPoolInvestment[]> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const investments: UserPoolInvestment[] = [];
    
    // Scan pools to find user's investments
    for (let i = 0; i < maxPools; i++) {
      try {
        const [investment, poolData] = await Promise.all([
          contract.userInvestmentInPool(userAddress, i),
          contract.pools(i)
        ]);
        
        const investmentAmount = ethers.formatUnits(investment, 6);
        
        // Only include pools where user has invested
        if (parseFloat(investmentAmount) > 0) {
          const poolSize = ethers.formatUnits(poolData.size, 6);
          const poolFilled = ethers.formatUnits(poolData.currentFilled, 6);
          const unpaidCapital = ethers.formatUnits(poolData.unpaidCapital, 6);
          
          const percentFilled = parseFloat(poolSize) > 0 
            ? (parseFloat(poolFilled) / parseFloat(poolSize)) * 100 
            : 0;
          
          investments.push({
            poolIndex: i,
            amount: investmentAmount,
            poolSize,
            poolFilled,
            isGlobal: poolData.isGlobal,
            owner: poolData.owner,
            unpaidCapital,
            percentFilled
          });
        }
      } catch (error) {
        // Pool doesn't exist, stop scanning
        break;
      }
    }
    
    return investments;
  } catch (error) {
    console.error('Error fetching user pool investments:', error);
    return [];
  }
}

/**
 * Get pool details by index
 */
export async function getPoolDetails(poolIndex: number) {
  try {
    const contract = await getSpeedTrackReadOnly();
    const poolData = await contract.pools(poolIndex);
    
    return {
      poolIndex,
      size: ethers.formatUnits(poolData.size, 6),
      currentFilled: ethers.formatUnits(poolData.currentFilled, 6),
      isGlobal: poolData.isGlobal,
      owner: poolData.owner,
      unpaidCapital: ethers.formatUnits(poolData.unpaidCapital, 6),
      percentFilled: parseFloat(ethers.formatUnits(poolData.size, 6)) > 0
        ? (parseFloat(ethers.formatUnits(poolData.currentFilled, 6)) / parseFloat(ethers.formatUnits(poolData.size, 6))) * 100
        : 0
    };
  } catch (error) {
    console.error(`Error fetching pool ${poolIndex} details:`, error);
    return null;
  }
}

/**
 * Get user's total invested across all pools
 */
export async function getUserTotalPoolInvestments(userAddress: string): Promise<string> {
  try {
    const investments = await getAllUserPoolInvestments(userAddress);
    const total = investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    return total.toFixed(6);
  } catch (error) {
    console.error('Error calculating total pool investments:', error);
    return '0';
  }
}
