import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly, checkUSDTAllowance, approveUSDT } from './contracts';

export interface ActivationData {
  name: string;
  mobile: string;
  email: string;
  referrer: string;
}

export async function checkAccountActivation(address: string): Promise<boolean> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const userDetails = await speedTrack.getUserDetails(address);
    return userDetails.activated;
  } catch {
    return false;
  }
}

export async function activateAccount(data: ActivationData, userAddress: string): Promise<ethers.ContractTransactionResponse> {
  const speedTrack = await getSpeedTrackContract();
  
  const isActivated = await checkAccountActivation(userAddress);
  if (isActivated) {
    throw new Error('Account is already activated');
  }

  const activationFee = ethers.parseEther('10');
  const allowance = await checkUSDTAllowance(userAddress);
  
  if (ethers.parseEther(allowance) < activationFee) {
    const approveTx = await approveUSDT('10');
    await approveTx.wait();
  }

  if (!ethers.isAddress(data.referrer)) {
    throw new Error('Invalid referrer address');
  }

  return await speedTrack.activateAccount(
    data.name,
    data.mobile,
    data.email,
    data.referrer
  );
}

export async function getUserDetails(address: string) {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const details = await speedTrack.getUserDetails(address);
    
    return {
      activated: details.activated,
      name: details.name,
      mobile: details.mobile,
      email: details.email,
      referrer: details.referrer,
      totalInvestment: ethers.formatEther(details.totalInvestment),
      rewardBalance: ethers.formatEther(details.rewardBalance),
      spinCredits: details.spinCredits.toString(),
      totalDirectReferrals: details.totalDirectReferrals.toString(),
      investedPoolNumber: details.investedPoolNumber.toString()
    };
  } catch (error) {
    throw new Error('Failed to fetch user details');
  }
}

export async function getSTBalance(address: string): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const balance = await speedTrack.getSTBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    return '0';
  }
}

export async function getUserFullDetails(address: string) {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const user = await speedTrack.users(address);
    
    return {
      activated: user.activated,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      referrer: user.referrer,
      rootReferrer: user.rootReferrer,
      totalInvestment: ethers.formatEther(user.totalInvestment),
      rewardBalance: ethers.formatEther(user.rewardBalance),
      spinCredits: user.spinCredits.toString(),
      lastRewardClaim: Number(user.lastRewardClaim),
      totalDirectReferrals: user.totalDirectReferrals.toString(),
      rewardStartTime: Number(user.rewardStartTime),
      totalRewardEarned: ethers.formatEther(user.totalRewardEarned),
      investedPoolNumber: user.investedPoolNumber.toString()
    };
  } catch (error) {
    throw new Error('Failed to fetch full user details');
  }
}
