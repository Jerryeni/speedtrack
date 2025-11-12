import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly } from './contracts';

export interface RegistrationData {
  referralCode: string;
  leaderAddress: string;
}

export async function registerUser(data: RegistrationData): Promise<ethers.ContractTransactionResponse> {
  console.log('=== REGISTRATION PROCESS START ===');
  
  // Step 1: Get contract instance
  console.log('Step 1: Getting SpeedTrack contract...');
  const speedTrack = await getSpeedTrackContract();
  const contractAddress = await speedTrack.getAddress();
  console.log('✓ Contract address:', contractAddress);
  
  // Step 2: Get signer and user address
  console.log('Step 2: Getting signer...');
  const signer = speedTrack.runner as ethers.Signer;
  const userAddress = await signer.getAddress();
  console.log('✓ User address:', userAddress);
  
  // Step 3: Prepare parameters
  console.log('Step 3: Preparing parameters...');
  console.log('  - Referral Code:', data.referralCode);
  console.log('  - Leader Address:', data.leaderAddress || 'Will use zero address');
  
  // Validate leader address if provided
  let leaderAddress = ethers.ZeroAddress;
  if (data.leaderAddress && data.leaderAddress.trim() !== '') {
    if (!ethers.isAddress(data.leaderAddress)) {
      throw new Error('Invalid leader address format');
    }
    leaderAddress = data.leaderAddress;
  }
  
  console.log('✓ Final parameters:');
  console.log('    - _referralCode:', data.referralCode);
  console.log('    - _leader:', leaderAddress);

  // Log contract address for debugging
  console.log('Using SpeedTrack Contract:', contractAddress);

  try {
    // Step 4: Call register function
    console.log('Step 4: Calling register function...');
    console.log('  Function: register(string _referralCode, address _leader)');
    
    const tx = await speedTrack.register(
      data.referralCode,
      leaderAddress
    );
    
    console.log('✓ Transaction sent!');
    console.log('  Transaction hash:', tx.hash);
    console.log('  From:', tx.from);
    console.log('  To:', tx.to);
    console.log('  View on BSCScan:', `https://testnet.bscscan.com/tx/${tx.hash}`);
    console.log('=== REGISTRATION PROCESS SUCCESS ===');
    console.log('⚠️  IMPORTANT: Wait for transaction confirmation before proceeding');
    console.log('⚠️  Check transaction status on BSCScan using the link above');
    
    return tx;
  } catch (error: any) {
    console.error('=== REGISTRATION PROCESS FAILED ===');
    console.error('Error:', error);
    
    // Extract error details
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
    if (error.data) {
      console.error('Data:', error.data);
    }
    
    throw error;
  }
}

export async function isUserRegistered(address: string): Promise<boolean> {
  try {
    console.log('Checking registration for address:', address);
    const speedTrack = await getSpeedTrackReadOnly();
    // Use the public userId mapping
    const userId = await speedTrack.userId(address);
    console.log('User ID from contract:', userId.toString());
    const isRegistered = Number(userId) > 0;
    console.log('Is registered:', isRegistered);
    return isRegistered;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
}

export async function getAdminReferralCode(): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    return await speedTrack.ADMIN_REFERRAL_CODE();
  } catch {
    return 'ADMIN';
  }
}

export async function testContractConnection(): Promise<{ success: boolean; details: any }> {
  try {
    console.log('=== TESTING CONTRACT CONNECTION ===');
    
    const speedTrack = await getSpeedTrackReadOnly();
    const contractAddress = await speedTrack.getAddress();
    
    console.log('✓ Contract address:', contractAddress);
    
    // Test if register function exists
    const hasRegisterFunction = typeof speedTrack.register === 'function';
    console.log('✓ register() function exists:', hasRegisterFunction);
    
    // Test reading a simple value
    try {
      const adminCode = await speedTrack.ADMIN_REFERRAL_CODE();
      console.log('✓ Can read ADMIN_REFERRAL_CODE:', adminCode);
    } catch (e) {
      console.log('⚠ Could not read ADMIN_REFERRAL_CODE (might not exist in contract)');
    }
    
    // Get contract interface info
    const fragment = speedTrack.interface.getFunction('register');
    console.log('✓ Register function signature:', fragment?.format());
    
    console.log('=== CONTRACT CONNECTION TEST PASSED ===');
    
    return {
      success: true,
      details: {
        contractAddress,
        hasRegisterFunction,
        registerSignature: fragment?.format()
      }
    };
  } catch (error: any) {
    console.error('=== CONTRACT CONNECTION TEST FAILED ===');
    console.error('Error:', error.message);
    return {
      success: false,
      details: { error: error.message }
    };
  }
}

export async function validateReferralCode(referralCode: string): Promise<{ valid: boolean; message: string; referrerAddress?: string }> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Check if it's the admin code
    const adminCode = await getAdminReferralCode();
    if (referralCode.toUpperCase() === adminCode.toUpperCase()) {
      return { 
        valid: true, 
        message: 'Admin referral code detected',
        referrerAddress: ethers.ZeroAddress
      };
    }
    
    // Try to get user by ID (if referral code is a number)
    if (/^\d+$/.test(referralCode)) {
      try {
        const userId = parseInt(referralCode);
        // Use the public idToUser mapping instead of getUserById function
        const referrerAddress = await speedTrack.idToUser(userId);
        
        if (referrerAddress && referrerAddress !== ethers.ZeroAddress) {
          // Verify the user is actually registered using the public userId mapping
          const referrerId = await speedTrack.userId(referrerAddress);
          if (Number(referrerId) > 0) {
            return {
              valid: true,
              message: 'Valid referral code',
              referrerAddress
            };
          }
        }
      } catch (error) {
        console.error('Error checking user by ID:', error);
      }
    }
    
    return {
      valid: false,
      message: 'Referral code not found. Please verify the code with your referrer.'
    };
  } catch (error) {
    console.error('Error validating referral code:', error);
    return {
      valid: false,
      message: 'Unable to validate referral code. Please try again.'
    };
  }
}
