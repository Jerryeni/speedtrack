import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly, checkUSDTAllowance, approveUSDT } from './contracts';

export interface PoolInfo {
  poolIndex: number;
  size: string;
  currentFilled: string;
  isGlobal: boolean;
  owner: string;
  unpaidCapital: string;
  queueLength: number;
  progress: number;
}

// Cache for pool info
const poolInfoCache = new Map<number, { data: PoolInfo; timestamp: number }>();
const POOL_CACHE_DURATION = 15000; // 15 seconds

// Helper function to safely format BigInt values
function safeFormatUnits(value: any, decimals: number): string {
  try {
    if (!value || value === null || value === undefined) return '0';
    return ethers.formatUnits(value, decimals);
  } catch (error) {
    console.error('Error formatting units:', error);
    return '0';
  }
}

// Helper function to safely calculate percentage
function safePercentage(numerator: number, denominator: number): number {
  if (!denominator || denominator === 0 || !isFinite(denominator)) return 0;
  if (!numerator || !isFinite(numerator)) return 0;
  
  const result = (numerator / denominator) * 100;
  
  if (!isFinite(result) || isNaN(result)) return 0;
  return Math.min(Math.max(result, 0), 100);
}

export async function getPoolInfo(poolIndex: number): Promise<PoolInfo> {
  // Check cache first
  const cached = poolInfoCache.get(poolIndex);
  if (cached && Date.now() - cached.timestamp < POOL_CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const poolData = await speedTrack.getPoolInfo(poolIndex);
    
    // Safe BigInt to string conversion with validation
    const size = safeFormatUnits(poolData.size, 6);
    const currentFilled = safeFormatUnits(poolData.currentFilled, 6);
    const unpaidCapital = safeFormatUnits(poolData.unpaidCapital, 6);
    
    // Safe division with validation
    const sizeNum = parseFloat(size);
    const filledNum = parseFloat(currentFilled);
    const progress = safePercentage(filledNum, sizeNum);
    
    const result = {
      poolIndex,
      size,
      currentFilled,
      isGlobal: poolData.isGlobal || false,
      owner: poolData.owner || ethers.ZeroAddress,
      unpaidCapital,
      queueLength: Number(poolData.queueLength || 0),
      progress
    };
    
    // Cache the result
    poolInfoCache.set(poolIndex, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error: any) {
    console.error(`Error fetching pool ${poolIndex} info:`, error?.message || error);
    
    // Return safe defaults
    return {
      poolIndex,
      size: '0',
      currentFilled: '0',
      isGlobal: false,
      owner: ethers.ZeroAddress,
      unpaidCapital: '0',
      queueLength: 0,
      progress: 0
    };
  }
}

export async function investInPool(poolIndex: number, amount: string, userAddress: string): Promise<ethers.ContractTransactionResponse> {
  const speedTrack = await getSpeedTrackContract();
  const amountWei = ethers.parseUnits(amount, 6);
  
  // Check allowance
  const allowance = await checkUSDTAllowance(userAddress);
  if (ethers.parseUnits(allowance, 6) < amountWei) {
    const approveTx = await approveUSDT(amount);
    await approveTx.wait();
  }

  return await speedTrack.invest(poolIndex, amountWei);
}

export async function getInvestmentInPool(userAddress: string, poolIndex: number): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const investment = await speedTrack.getInvestmentInPool(userAddress, poolIndex);
    return safeFormatUnits(investment, 6);
  } catch (error) {
    console.error('Error fetching investment in pool:', error);
    return '0';
  }
}

export async function getPendingRefund(userAddress: string, poolIndex: number): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const refund = await speedTrack.getPendingRefund(userAddress, poolIndex);
    return safeFormatUnits(refund, 6);
  } catch (error) {
    console.error('Error fetching pending refund:', error);
    return '0';
  }
}

export async function isEligibleForGlobal(userAddress: string): Promise<boolean> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    return await speedTrack.isEligibleForGlobal(userAddress);
  } catch (error) {
    console.error('Error checking global eligibility:', error);
    return false;
  }
}

export async function getMaxInvestment(levelIndex: number): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const maxInv = await speedTrack.maxInvestments(levelIndex);
    return safeFormatUnits(maxInv, 6);
  } catch (error) {
    console.error('Error fetching max investment:', error);
    return '0';
  }
}

export async function getInitialPoolSize(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const size = await speedTrack.INITIAL_POOL_SIZE();
    return safeFormatUnits(size, 6);
  } catch (error) {
    console.error('Error fetching initial pool size:', error);
    return '0';
  }
}
