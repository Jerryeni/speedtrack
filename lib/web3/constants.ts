import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

// Fetch contract constants
export async function getContractConstants() {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Note: These constants may not exist in the current contract
    // Using fallback values if they don't exist
    const constants = await Promise.allSettled([
      speedTrack.ACTIVATION_FEE?.().catch(() => null),
      speedTrack.REWARD_PERCENT?.().catch(() => null),
      speedTrack.SERVICE_FEE_PERCENT?.().catch(() => null),
      speedTrack.NEXT_POOL_PERCENT?.().catch(() => null),
      speedTrack.SPIN_CREDIT_PERCENT?.().catch(() => null)
    ]);

    return {
      activationFee: constants[0].status === 'fulfilled' && constants[0].value 
        ? constants[0].value.toString() 
        : '10000000000000000000', // 10 USDT default
      rewardPercent: constants[1].status === 'fulfilled' && constants[1].value 
        ? Number(constants[1].value) 
        : 50, // 0.5%
      serviceFeePercent: constants[2].status === 'fulfilled' && constants[2].value 
        ? Number(constants[2].value) 
        : 10, // 10%
      nextPoolPercent: constants[3].status === 'fulfilled' && constants[3].value 
        ? Number(constants[3].value) 
        : 10, // 10%
      spinCreditPercent: constants[4].status === 'fulfilled' && constants[4].value 
        ? Number(constants[4].value) 
        : 5 // 5%
    };
  } catch (error) {
    console.error('Error fetching contract constants:', error);
    return {
      activationFee: '10000000000000000000', // 10 USDT default
      rewardPercent: 50, // 0.5%
      serviceFeePercent: 10, // 10%
      nextPoolPercent: 10, // 10%
      spinCreditPercent: 5 // 5%
    };
  }
}

export async function getGlobalPoolStart(): Promise<number> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const startTime = await speedTrack.globalPoolStart?.();
    return startTime ? Number(startTime) : 0;
  } catch (error) {
    console.error('Error fetching global pool start:', error);
    return 0;
  }
}

export async function getSTTokenAddress(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const address = await speedTrack.stToken();
    return address || ethers.ZeroAddress;
  } catch (error) {
    console.error('Error fetching ST token address:', error);
    return ethers.ZeroAddress;
  }
}

export async function getServiceWallet(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const wallet = await speedTrack.serviceWallet?.();
    return wallet || ethers.ZeroAddress;
  } catch (error) {
    console.error('Error fetching service wallet:', error);
    return ethers.ZeroAddress;
  }
}

export async function getReserveWallet(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const wallet = await speedTrack.reserveWallet();
    return wallet || ethers.ZeroAddress;
  } catch (error) {
    console.error('Error fetching reserve wallet:', error);
    return ethers.ZeroAddress;
  }
}
