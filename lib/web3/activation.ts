import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly, checkUSDTAllowance, approveUSDT } from './contracts';

export interface ActivationData {
  name: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
}

export async function checkAccountActivation(address: string): Promise<boolean> {
  try {
    console.log('📞 Checking activation status for:', address);
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Primary method: Check via getUserInfo activationLevel
    try {
      const userInfo = await speedTrack.getUserInfo(address);
      const activationLevel = Number(userInfo.activationLevel);
      const isActivated = activationLevel > 0;
      console.log('Activation level:', activationLevel);
      console.log(isActivated ? '✅ User IS activated' : '❌ User is NOT activated');
      return isActivated;
    } catch (error: any) {
      console.log('⚠️ getUserInfo failed:', error.message);
      
      // If it's a network error, throw it so caller can retry
      if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT' || error.message?.includes('network')) {
        throw new Error('Network error - please retry');
      }
    }
    
    // Fallback method: Try getActivationStatus if it exists
    try {
      const isActivated = await speedTrack.getActivationStatus(address);
      console.log('getActivationStatus returned:', isActivated);
      return isActivated;
    } catch (error: any) {
      console.log('⚠️ getActivationStatus also failed:', error.message);
    }
    
    console.log('❌ Could not determine activation status, assuming NOT activated');
    return false;
  } catch (error: any) {
    console.error('❌ Error checking activation:', error.message);
    
    // If it's a network error, throw it so caller can retry
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT' || error.message?.includes('network')) {
      throw error;
    }
    
    return false;
  }
}

export async function activateAccount(levelIndex: number, userAddress: string): Promise<ethers.ContractTransactionResponse> {
  console.log('=== ACTIVATION PROCESS START ===');
  console.log('Level Index:', levelIndex);
  console.log('User Address:', userAddress);
  
  const speedTrack = await getSpeedTrackContract();
  const contractAddress = await speedTrack.getAddress();
  console.log('Using SpeedTrack Contract:', contractAddress);
  
  // Check if already activated
  const isActivated = await checkAccountActivation(userAddress);
  if (isActivated) {
    throw new Error('Account is already activated');
  }
  console.log('✓ User is not activated yet');

  // Get activation fee from contract
  const { getActivationFee } = await import('./systemConfig');
  const feeAmount = await getActivationFee(levelIndex);
  console.log('Activation fee for level', levelIndex, ':', feeAmount, 'USDT');
  
  // ALWAYS approve USDT (with max amount) to ensure it works
  console.log('Requesting USDT approval for unlimited amount...');
  try {
    const approveTx = await approveUSDT(feeAmount);
    console.log('Approval transaction sent:', approveTx.hash);
    console.log('Waiting for approval confirmation...');
    const approvalReceipt = await approveTx.wait();
    console.log('✓ USDT approved! Block:', approvalReceipt?.blockNumber);
    
    // Small delay to ensure blockchain state is updated
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify the approval went through
    const newAllowance = await checkUSDTAllowance(userAddress);
    console.log('New allowance after approval:', newAllowance, 'USDT');
    
    if (newAllowance === '0' || parseFloat(newAllowance) < parseFloat(feeAmount)) {
      throw new Error('USDT approval failed. Please try again.');
    }
  } catch (error: any) {
    console.error('Approval error:', error);
    throw new Error(`Failed to approve USDT: ${error.message}`);
  }

  // Call activate function
  console.log('Calling activate function with levelIndex:', levelIndex);
  const tx = await speedTrack.activate(levelIndex);
  console.log('✓ Activation transaction sent:', tx.hash);
  console.log('=== ACTIVATION PROCESS SUCCESS ===');
  
  return tx;
}

export async function completeProfile(data: ActivationData): Promise<ethers.ContractTransactionResponse> {
  const speedTrack = await getSpeedTrackContract();
  return await speedTrack.completeProfile(
    data.name,
    data.email,
    data.countryCode,
    data.mobileNumber
  );
}

export async function getUserDetails(address: string) {
  try {
    console.log('📞 getUserDetails called for:', address);
    const speedTrack = await getSpeedTrackReadOnly();
    
    // First check if user is registered by checking their ID
    const userId = await speedTrack.getUserId(address);
    const userIdNum = Number(userId);
    console.log('getUserId returned:', userIdNum);
    
    if (userIdNum === 0) {
      console.log('❌ User not registered (userId = 0)');
      throw new Error('User not registered');
    }
    
    console.log('✅ User is registered (userId =', userIdNum, ')');
    
    // User is registered, get their info
    // getUserInfo returns: (name, email, countryCode, mobileNumber, activationLevel, referrer, 
    //                       referrerType, isRootLeader, profileCompleted, investedAmount, 
    //                       capitalReturned, virtualROIBalance, rewardPoints, uid)
    const userInfo = await speedTrack.getUserInfo(address);
    console.log('getUserInfo returned:', {
      uid: userInfo.uid.toString(),
      activationLevel: userInfo.activationLevel.toString(),
      profileCompleted: userInfo.profileCompleted,
      name: userInfo.name
    });
    
    // Safe formatting with validation
    const investedAmount = userInfo.investedAmount ? ethers.formatUnits(userInfo.investedAmount, 6) : '0';
    const capitalReturned = userInfo.capitalReturned ? ethers.formatUnits(userInfo.capitalReturned, 6) : '0';
    const virtualROIBalance = userInfo.virtualROIBalance ? ethers.formatUnits(userInfo.virtualROIBalance, 6) : '0';
    
    const result = {
      name: userInfo.name || '',
      email: userInfo.email || '',
      countryCode: userInfo.countryCode || '',
      mobileNumber: userInfo.mobileNumber || '',
      activationLevel: userInfo.activationLevel ? userInfo.activationLevel.toString() : '0',
      referrer: userInfo.referrer || ethers.ZeroAddress,
      referrerType: userInfo.referrerType !== undefined ? Number(userInfo.referrerType) : 0,
      isRootLeader: userInfo.isRootLeader || false,
      profileCompleted: userInfo.profileCompleted || false,
      investedAmount,
      capitalReturned,
      virtualROIBalance,
      rewardPoints: userInfo.rewardPoints ? userInfo.rewardPoints.toString() : '0',
      uid: userInfo.uid ? userInfo.uid.toString() : userId.toString(),
      isRegistered: true
    };
    
    console.log('✅ getUserDetails returning:', result);
    return result;
  } catch (error: any) {
    console.error('❌ Error in getUserDetails:', error);
    
    // If it's a network error, throw it so caller can retry
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT' || error.message?.includes('network')) {
      throw new Error('Network error - please retry');
    }
    
    // Check if it's a "not registered" error
    if (error.message === 'User not registered') {
      throw error;
    }
    
    console.error('Error fetching user details:', error);
    throw new Error('Failed to fetch user details');
  }
}

export async function getUserId(address: string): Promise<string> {
  try {
    console.log('📞 Calling getUserId for address:', address);
    const speedTrack = await getSpeedTrackReadOnly();
    console.log('Contract instance obtained');
    
    const userId = await speedTrack.getUserId(address);
    const userIdString = userId.toString();
    console.log('✅ getUserId returned:', userIdString);
    
    return userIdString;
  } catch (error: any) {
    console.error('❌ Error in getUserId:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // If it's a network error, throw it so caller can retry
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT' || error.message?.includes('network')) {
      throw new Error('Network error - please retry');
    }
    
    // For other errors, return '0' (user not registered)
    return '0';
  }
}

export async function getUserById(userId: number): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const address = await speedTrack.getUserById(userId);
    return address;
  } catch (error) {
    return ethers.ZeroAddress;
  }
}

export async function getActivationFee(levelIndex: number): Promise<string> {
  // Import from systemConfig to get from contract
  const { getActivationFee: getContractFee } = await import('./systemConfig');
  return await getContractFee(levelIndex);
}

export async function isUserRegistered(address: string): Promise<boolean> {
  try {
    console.log('📞 Checking if user is registered:', address);
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Method 1: Check getUserId (most reliable)
    const userId = await speedTrack.getUserId(address);
    const userIdNum = Number(userId);
    console.log('getUserId returned:', userIdNum);
    
    if (userIdNum > 0) {
      console.log('✅ User IS registered (userId > 0)');
      return true;
    }
    
    // Method 2: Double-check with getUserInfo
    try {
      const userInfo = await speedTrack.getUserInfo(address);
      const uid = Number(userInfo.uid);
      console.log('getUserInfo uid:', uid);
      
      if (uid > 0) {
        console.log('✅ User IS registered (uid > 0)');
        return true;
      }
    } catch (infoError) {
      console.log('getUserInfo check failed:', infoError);
    }
    
    console.log('❌ User is NOT registered');
    return false;
  } catch (error: any) {
    console.error('❌ Error checking registration:', error.message);
    return false;
  }
}
