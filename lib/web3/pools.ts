import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly, checkUSDTAllowance, approveUSDT } from './contracts';

export interface PoolInfo {
  poolNumber: number;
  capacity: string;
  currentAmount: string;
  filled: boolean;
  progress: number;
  investorCount: number;
}

export async function getCurrentPool(): Promise<number> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const currentPool = await speedTrack.getCurrentPool();
    return Number(currentPool);
  } catch (error: any) {
    console.error('Error fetching current pool:', error);
    // Return default pool 1 instead of throwing
    return 1;
  }
}

export async function getPoolInfo(poolNumber: number): Promise<PoolInfo> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const [poolData, investors] = await Promise.all([
      speedTrack.getPoolInfo(poolNumber),
      speedTrack.getPoolInvestors(poolNumber).catch(() => [])
    ]);
    
    const capacity = ethers.formatEther(poolData.capacity);
    const currentAmount = ethers.formatEther(poolData.currentAmount);
    const progress = (parseFloat(currentAmount) / parseFloat(capacity)) * 100;
    
    return {
      poolNumber,
      capacity,
      currentAmount,
      filled: poolData.filled,
      progress: Math.min(progress, 100),
      investorCount: investors.length
    };
  } catch (error: any) {
    console.error(`Error fetching pool ${poolNumber} info:`, error);
    // Return default pool info
    return {
      poolNumber,
      capacity: '0',
      currentAmount: '0',
      filled: false,
      progress: 0,
      investorCount: 0
    };
  }
}

export async function investInPool(amount: string, userAddress: string): Promise<ethers.ContractTransactionResponse> {
  const speedTrack = await getSpeedTrackContract();
  const amountWei = ethers.parseEther(amount);
  const minAmount = ethers.parseEther('10');
  
  if (amountWei < minAmount) {
    throw new Error('Minimum investment is 10 USDT');
  }
  
  const currentPool = await getCurrentPool();
  const maxAmount = currentPool === 1 ? ethers.parseEther('50') : ethers.parseEther('500');
  
  if (amountWei > maxAmount) {
    const maxFormatted = ethers.formatEther(maxAmount);
    throw new Error(`Maximum investment for pool ${currentPool} is ${maxFormatted} USDT`);
  }
  
  const allowance = await checkUSDTAllowance(userAddress);
  if (ethers.parseEther(allowance) < amountWei) {
    const approveTx = await approveUSDT(amount);
    await approveTx.wait();
  }

  return await speedTrack.investInPool(amountWei);
}

export async function getPoolInvestors(poolNumber: number): Promise<string[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    return await speedTrack.getPoolInvestors(poolNumber);
  } catch (error) {
    return [];
  }
}

export async function getUserPoolInvestments(userAddress: string): Promise<{ poolNumber: number; amount: string; canClaim: boolean }[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const userDetails = await speedTrack.getUserDetails(userAddress);
    const investedPool = Number(userDetails.investedPoolNumber);
    
    if (investedPool === 0) {
      return [];
    }
    
    const poolInfo = await getPoolInfo(investedPool);
    const userInvestment = ethers.formatEther(userDetails.totalInvestment);
    
    return [{
      poolNumber: investedPool,
      amount: userInvestment,
      canClaim: poolInfo.filled
    }];
  } catch (error) {
    return [];
  }
}

export async function claimPoolReturn(poolNumber: number): Promise<ethers.ContractTransactionResponse> {
  const speedTrack = await getSpeedTrackContract();
  return await speedTrack.claimPoolReturn(poolNumber);
}
