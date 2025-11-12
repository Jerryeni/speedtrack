import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

export interface SystemConfig {
  // Percentages (in basis points, divide by 100 for actual %)
  dailyROI: string;           // e.g., "50" = 0.5%
  capitalReturn: string;      // e.g., "200" = 200%
  levelIncome: string;        // e.g., "30" = 30%
  reserve: string;            // e.g., "5" = 5%
  reward: string;             // e.g., "5" = 5%
  stLiquidity: string;        // e.g., "10" = 10%
  
  // Pool configuration
  initialPoolSize: string;    // USDT
  poolMultiplier: string;     // e.g., "2" = 2x
  personalPoolsLimit: string; // e.g., "3"
  
  // System limits
  minId: string;
  maxId: string;
  maxRecent: string;
  decimals: string;
  
  // Other
  adminReferralCode: string;
}

export interface ActivationFee {
  level: number;
  fee: string;
  name: string;
}

export interface LevelPercent {
  level: number;
  percent: string;
  formattedPercent: string;
}

/**
 * Get all system configuration from contract
 */
export async function getSystemConfig(): Promise<SystemConfig> {
  try {
    const contract = await getSpeedTrackReadOnly();
    
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
      adminCode
    ] = await Promise.all([
      contract.DAILY_ROI_PCT(),
      contract.LEVEL_INCOME_PCT(),
      contract.CAPITAL_RETURN_PCT(),
      contract.RESERVE_PCT(),
      contract.REWARD_PCT(),
      contract.ST_LIQUIDITY_PCT(),
      contract.INITIAL_POOL_SIZE(),
      contract.POOL_MULTIPLIER(),
      contract.PERSONAL_POOLS_LIMIT(),
      contract.MIN_ID(),
      contract.MAX_ID(),
      contract.MAX_RECENT(),
      contract.DECIMALS(),
      contract.ADMIN_REFERRAL_CODE()
    ]);
    
    return {
      dailyROI: dailyROI.toString(),
      capitalReturn: capitalReturn.toString(),
      levelIncome: levelIncome.toString(),
      reserve: reserve.toString(),
      reward: reward.toString(),
      stLiquidity: stLiquidity.toString(),
      initialPoolSize: ethers.formatUnits(initialPoolSize, 6),
      poolMultiplier: poolMultiplier.toString(),
      personalPoolsLimit: personalPoolsLimit.toString(),
      minId: minId.toString(),
      maxId: maxId.toString(),
      maxRecent: maxRecent.toString(),
      decimals: decimals.toString(),
      adminReferralCode: adminCode
    };
  } catch (error) {
    console.error('Error fetching system config:', error);
    throw error;
  }
}

/**
 * Get activation fees from contract (not hardcoded)
 */
export async function getActivationFees(): Promise<ActivationFee[]> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const levelNames = ['Starter', 'Bronze', 'Silver', 'Gold', 'Platinum'];
    
    const fees = await Promise.all([
      contract.activationFees(0),
      contract.activationFees(1),
      contract.activationFees(2),
      contract.activationFees(3),
      contract.activationFees(4)
    ]);
    
    return fees.map((fee, index) => ({
      level: index,
      fee: ethers.formatUnits(fee, 6),
      name: levelNames[index]
    }));
  } catch (error) {
    console.error('Error fetching activation fees:', error);
    // Fallback to hardcoded values
    return [
      { level: 0, fee: '10', name: 'Starter' },
      { level: 1, fee: '50', name: 'Bronze' },
      { level: 2, fee: '100', name: 'Silver' },
      { level: 3, fee: '250', name: 'Gold' },
      { level: 4, fee: '500', name: 'Platinum' }
    ];
  }
}

/**
 * Get single activation fee for a level
 */
export async function getActivationFee(levelIndex: number): Promise<string> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const fee = await contract.activationFees(levelIndex);
    return ethers.formatUnits(fee, 6);
  } catch (error) {
    console.error(`Error fetching activation fee for level ${levelIndex}:`, error);
    const fallback = ['10', '50', '100', '250', '500'];
    return fallback[levelIndex] || '10';
  }
}

/**
 * Get level income percentages (10 levels)
 */
export async function getLevelPercents(): Promise<LevelPercent[]> {
  try {
    const contract = await getSpeedTrackReadOnly();
    
    const percents = await Promise.all(
      Array.from({ length: 10 }, (_, i) => contract.levelPercents(i))
    );
    
    return percents.map((pct, index) => ({
      level: index + 1,
      percent: pct.toString(),
      formattedPercent: `${(Number(pct) / 100).toFixed(1)}%`
    }));
  } catch (error) {
    console.error('Error fetching level percents:', error);
    return [];
  }
}

/**
 * Get max investment for a level
 */
export async function getMaxInvestment(levelIndex: number): Promise<string> {
  try {
    const contract = await getSpeedTrackReadOnly();
    const maxInv = await contract.maxInvestments(levelIndex);
    return ethers.formatUnits(maxInv, 6);
  } catch (error) {
    console.error(`Error fetching max investment for level ${levelIndex}:`, error);
    return '0';
  }
}

/**
 * Get all max investments
 */
export async function getAllMaxInvestments(): Promise<{ level: number; maxInvestment: string }[]> {
  try {
    const contract = await getSpeedTrackReadOnly();
    
    const maxInvestments = await Promise.all(
      Array.from({ length: 5 }, (_, i) => contract.maxInvestments(i))
    );
    
    return maxInvestments.map((max, index) => ({
      level: index,
      maxInvestment: ethers.formatUnits(max, 6)
    }));
  } catch (error) {
    console.error('Error fetching max investments:', error);
    return [];
  }
}
