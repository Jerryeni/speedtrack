import { getSpeedTrackReadOnly } from './contracts';

// Fetch contract constants
export async function getContractConstants() {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    const [
      activationFee,
      rewardPercent,
      serviceFeePercent,
      nextPoolPercent,
      spinCreditPercent
    ] = await Promise.all([
      speedTrack.ACTIVATION_FEE(),
      speedTrack.REWARD_PERCENT(),
      speedTrack.SERVICE_FEE_PERCENT(),
      speedTrack.NEXT_POOL_PERCENT(),
      speedTrack.SPIN_CREDIT_PERCENT()
    ]);

    return {
      activationFee: activationFee.toString(),
      rewardPercent: Number(rewardPercent),
      serviceFeePercent: Number(serviceFeePercent),
      nextPoolPercent: Number(nextPoolPercent),
      spinCreditPercent: Number(spinCreditPercent)
    };
  } catch (error) {
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
    const startTime = await speedTrack.globalPoolStart();
    return Number(startTime);
  } catch (error) {
    return 0;
  }
}

export async function getSTTokenAddress(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    return await speedTrack.stToken();
  } catch (error) {
    return '';
  }
}

export async function getServiceWallet(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    return await speedTrack.serviceWallet();
  } catch (error) {
    return '';
  }
}

export async function getReserveWallet(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    return await speedTrack.reserveWallet();
  } catch (error) {
    return '';
  }
}
