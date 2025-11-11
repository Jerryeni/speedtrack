import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly } from './contracts';

/**
 * Admin-only functions for contract management
 * These functions can only be called by the contract owner
 */

// ============================================
// WALLET MANAGEMENT
// ============================================

/**
 * Set the reserve wallet address
 * @param newAddress - New reserve wallet address
 */
export async function setReserveWallet(newAddress: string): Promise<ethers.ContractTransactionResponse> {
  if (!ethers.isAddress(newAddress)) {
    throw new Error('Invalid address');
  }
  
  const speedTrack = await getSpeedTrackContract();
  return await speedTrack.setReserveWallet(newAddress);
}

/**
 * Set the reward wallet address
 * @param newAddress - New reward wallet address
 */
export async function setRewardWallet(newAddress: string): Promise<ethers.ContractTransactionResponse> {
  if (!ethers.isAddress(newAddress)) {
    throw new Error('Invalid address');
  }
  
  const speedTrack = await getSpeedTrackContract();
  return await speedTrack.setRewardWallet(newAddress);
}

/**
 * Get current reserve wallet address
 */
export async function getReserveWallet(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    return await speedTrack.reserveWallet();
  } catch (error) {
    return ethers.ZeroAddress;
  }
}

/**
 * Get current reward wallet address
 */
export async function getRewardWallet(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    return await speedTrack.rewardWallet();
  } catch (error) {
    return ethers.ZeroAddress;
  }
}

// ============================================
// ROI DISTRIBUTION
// ============================================

/**
 * Distribute virtual ROI to multiple users
 * @param users - Array of user addresses
 * @param amounts - Array of amounts (in USDT with 6 decimals)
 */
export async function distributeVirtualROI(
  users: string[],
  amounts: string[]
): Promise<ethers.ContractTransactionResponse> {
  if (users.length !== amounts.length) {
    throw new Error('Users and amounts arrays must have the same length');
  }
  
  if (users.length === 0) {
    throw new Error('At least one user is required');
  }
  
  // Validate addresses
  for (const user of users) {
    if (!ethers.isAddress(user)) {
      throw new Error(`Invalid address: ${user}`);
    }
  }
  
  // Convert amounts to wei (6 decimals for USDT)
  const amountsWei = amounts.map(amount => ethers.parseUnits(amount, 6));
  
  const speedTrack = await getSpeedTrackContract();
  return await speedTrack.distributeVirtualROI(users, amountsWei);
}

// ============================================
// EMERGENCY FUNCTIONS
// ============================================

/**
 * Emergency withdraw tokens from contract
 * @param tokenAddress - Token contract address
 * @param toAddress - Destination address
 * @param amount - Amount to withdraw
 */
export async function emergencyWithdraw(
  tokenAddress: string,
  toAddress: string,
  amount: string
): Promise<ethers.ContractTransactionResponse> {
  if (!ethers.isAddress(tokenAddress)) {
    throw new Error('Invalid token address');
  }
  
  if (!ethers.isAddress(toAddress)) {
    throw new Error('Invalid destination address');
  }
  
  const amountWei = ethers.parseUnits(amount, 6); // Assuming 6 decimals
  
  const speedTrack = await getSpeedTrackContract();
  return await speedTrack.emergencyWithdraw(tokenAddress, toAddress, amountWei);
}

// ============================================
// OWNERSHIP MANAGEMENT
// ============================================

/**
 * Transfer contract ownership to a new address
 * @param newOwner - New owner address
 */
export async function transferOwnership(newOwner: string): Promise<ethers.ContractTransactionResponse> {
  if (!ethers.isAddress(newOwner)) {
    throw new Error('Invalid address');
  }
  
  if (newOwner === ethers.ZeroAddress) {
    throw new Error('Cannot transfer to zero address');
  }
  
  const speedTrack = await getSpeedTrackContract();
  return await speedTrack.transferOwnership(newOwner);
}

/**
 * Renounce contract ownership (irreversible!)
 */
export async function renounceOwnership(): Promise<ethers.ContractTransactionResponse> {
  const speedTrack = await getSpeedTrackContract();
  return await speedTrack.renounceOwnership();
}

/**
 * Get current contract owner
 */
export async function getContractOwner(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    return await speedTrack.owner();
  } catch (error) {
    return ethers.ZeroAddress;
  }
}

// ============================================
// CONTRACT INFO
// ============================================

/**
 * Get all contract constants
 */
export async function getContractConstants() {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    const [
      dailyROI,
      levelIncome,
      capitalReturn,
      reserve,
      reward,
      stLiquidity,
      initialPoolSize,
      poolMultiplier,
      personalPoolsLimit,
      minId,
      maxId,
      maxRecent,
      decimals,
      adminReferralCode
    ] = await Promise.all([
      speedTrack.DAILY_ROI_PCT().catch(() => BigInt(50)),
      speedTrack.LEVEL_INCOME_PCT().catch(() => BigInt(30)),
      speedTrack.CAPITAL_RETURN_PCT().catch(() => BigInt(200)),
      speedTrack.RESERVE_PCT().catch(() => BigInt(5)),
      speedTrack.REWARD_PCT().catch(() => BigInt(5)),
      speedTrack.ST_LIQUIDITY_PCT().catch(() => BigInt(10)),
      speedTrack.INITIAL_POOL_SIZE().catch(() => BigInt(0)),
      speedTrack.POOL_MULTIPLIER().catch(() => BigInt(2)),
      speedTrack.PERSONAL_POOLS_LIMIT().catch(() => BigInt(3)),
      speedTrack.MIN_ID().catch(() => BigInt(1)),
      speedTrack.MAX_ID().catch(() => BigInt(999999)),
      speedTrack.MAX_RECENT().catch(() => BigInt(10)),
      speedTrack.DECIMALS().catch(() => BigInt(6)),
      speedTrack.ADMIN_REFERRAL_CODE().catch(() => 'ADMIN')
    ]);
    
    return {
      dailyROIPct: Number(dailyROI),
      levelIncomePct: Number(levelIncome),
      capitalReturnPct: Number(capitalReturn),
      reservePct: Number(reserve),
      rewardPct: Number(reward),
      stLiquidityPct: Number(stLiquidity),
      initialPoolSize: initialPoolSize ? ethers.formatUnits(initialPoolSize, 6) : '0',
      poolMultiplier: Number(poolMultiplier),
      personalPoolsLimit: Number(personalPoolsLimit),
      minId: Number(minId),
      maxId: Number(maxId),
      maxRecent: Number(maxRecent),
      decimals: Number(decimals),
      adminReferralCode: adminReferralCode || 'ADMIN'
    };
  } catch (error) {
    console.error('Error fetching contract constants:', error);
    throw error;
  }
}

/**
 * Get pool constants
 */
export async function getPoolConstants() {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    const [initialPoolSize, poolMultiplier, personalPoolsLimit] = await Promise.all([
      speedTrack.INITIAL_POOL_SIZE().catch(() => BigInt(0)),
      speedTrack.POOL_MULTIPLIER().catch(() => BigInt(2)),
      speedTrack.PERSONAL_POOLS_LIMIT().catch(() => BigInt(3))
    ]);
    
    return {
      initialPoolSize: initialPoolSize ? ethers.formatUnits(initialPoolSize, 6) : '0',
      poolMultiplier: Number(poolMultiplier),
      personalPoolsLimit: Number(personalPoolsLimit)
    };
  } catch (error) {
    console.error('Error fetching pool constants:', error);
    return {
      initialPoolSize: '0',
      poolMultiplier: 0,
      personalPoolsLimit: 0
    };
  }
}

/**
 * Get user ID range
 */
export async function getUserIdRange() {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    const [minId, maxId] = await Promise.all([
      speedTrack.MIN_ID().catch(() => BigInt(1)),
      speedTrack.MAX_ID().catch(() => BigInt(999999))
    ]);
    
    return {
      minId: Number(minId),
      maxId: Number(maxId)
    };
  } catch (error) {
    console.error('Error fetching user ID range:', error);
    return {
      minId: 1,
      maxId: 999999
    };
  }
}

/**
 * Check if address is contract owner
 */
export async function isContractOwner(address: string): Promise<boolean> {
  try {
    const owner = await getContractOwner();
    return owner.toLowerCase() === address.toLowerCase();
  } catch (error) {
    return false;
  }
}

// ============================================
// STATISTICS (for admin dashboard)
// ============================================

/**
 * Get total statistics across all users
 * Note: This requires event tracking or backend aggregation
 * These are placeholder functions that would need proper implementation
 */
export async function getTotalStatistics() {
  // This would require event tracking or backend
  // For now, return placeholder values
  return {
    totalUsers: 0,
    totalInvested: '0',
    totalROIPaid: '0',
    totalLevelIncome: '0',
    totalActivations: 0,
    totalPools: 0
  };
}

/**
 * Get root leader pools for a user
 */
export async function getRootLeaderPools(userAddress: string, poolIndex: number): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const poolId = await speedTrack.rootLeaderPools(userAddress, poolIndex);
    return poolId ? poolId.toString() : '0';
  } catch (error) {
    console.error('Error fetching root leader pools:', error);
    return '0';
  }
}
