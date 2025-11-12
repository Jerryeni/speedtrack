import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly } from './contracts';
import { CONTRACTS, NETWORK_CONFIG } from './config';
import { getSigner, getProvider } from './wallet';

/**
 * Comprehensive diagnostics for contract connection and transactions
 */

export async function runFullDiagnostics() {
  console.log('='.repeat(60));
  console.log('SPEEDTRACK CONTRACT DIAGNOSTICS');
  console.log('='.repeat(60));
  
  const results: any = {
    timestamp: new Date().toISOString(),
    network: {},
    contracts: {},
    wallet: {},
    connection: {},
    errors: []
  };

  try {
    // 1. Network Configuration
    console.log('\n1. NETWORK CONFIGURATION');
    console.log('-'.repeat(60));
    console.log('Chain ID:', NETWORK_CONFIG.chainId);
    console.log('Chain ID Hex:', NETWORK_CONFIG.chainIdHex);
    console.log('Network Name:', NETWORK_CONFIG.name);
    console.log('RPC URL:', NETWORK_CONFIG.rpcUrl);
    console.log('Block Explorer:', NETWORK_CONFIG.blockExplorer);
    
    results.network = {
      chainId: NETWORK_CONFIG.chainId,
      chainIdHex: NETWORK_CONFIG.chainIdHex,
      name: NETWORK_CONFIG.name,
      rpcUrl: NETWORK_CONFIG.rpcUrl,
      blockExplorer: NETWORK_CONFIG.blockExplorer
    };

    // 2. Contract Addresses
    console.log('\n2. CONTRACT ADDRESSES');
    console.log('-'.repeat(60));
    console.log('SpeedTrack:', CONTRACTS.SPEEDTRACK);
    console.log('STToken:', CONTRACTS.STTOKEN);
    console.log('USDT:', CONTRACTS.USDT);
    
    results.contracts = {
      speedtrack: CONTRACTS.SPEEDTRACK,
      sttoken: CONTRACTS.STTOKEN,
      usdt: CONTRACTS.USDT
    };

    // 3. Wallet Connection
    console.log('\n3. WALLET CONNECTION');
    console.log('-'.repeat(60));
    
    const provider = getProvider();
    if (!provider) {
      console.log('❌ No provider available');
      results.wallet.connected = false;
      results.errors.push('No wallet provider available');
    } else {
      console.log('✅ Provider available');
      
      try {
        const signer = await getSigner();
        if (signer) {
          const address = await signer.getAddress();
          console.log('✅ Wallet connected:', address);
          
          const balance = await provider.getBalance(address);
          console.log('BNB Balance:', ethers.formatEther(balance), 'BNB');
          
          const network = await provider.getNetwork();
          console.log('Connected Chain ID:', network.chainId.toString());
          
          results.wallet = {
            connected: true,
            address,
            balance: ethers.formatEther(balance),
            chainId: network.chainId.toString()
          };
        } else {
          console.log('❌ No signer available');
          results.wallet.connected = false;
          results.errors.push('No signer available');
        }
      } catch (error: any) {
        console.log('❌ Error getting wallet info:', error.message);
        results.wallet.connected = false;
        results.errors.push(`Wallet error: ${error.message}`);
      }
    }

    // 4. Contract Connection Test
    console.log('\n4. CONTRACT CONNECTION TEST');
    console.log('-'.repeat(60));
    
    try {
      const speedTrack = await getSpeedTrackReadOnly();
      const contractAddress = await speedTrack.getAddress();
      console.log('✅ Contract instance created');
      console.log('Contract Address:', contractAddress);
      
      // Verify it matches our config
      if (contractAddress.toLowerCase() === CONTRACTS.SPEEDTRACK.toLowerCase()) {
        console.log('✅ Contract address matches configuration');
      } else {
        console.log('❌ WARNING: Contract address mismatch!');
        console.log('  Expected:', CONTRACTS.SPEEDTRACK);
        console.log('  Got:', contractAddress);
        results.errors.push('Contract address mismatch');
      }
      
      results.connection.contractAddress = contractAddress;
      results.connection.addressMatch = contractAddress.toLowerCase() === CONTRACTS.SPEEDTRACK.toLowerCase();
      
    } catch (error: any) {
      console.log('❌ Error creating contract instance:', error.message);
      results.connection.error = error.message;
      results.errors.push(`Contract connection error: ${error.message}`);
    }

    // 5. Contract Function Test
    console.log('\n5. CONTRACT FUNCTION TEST');
    console.log('-'.repeat(60));
    
    try {
      const speedTrack = await getSpeedTrackReadOnly();
      
      // Test reading a constant
      try {
        const adminCode = await speedTrack.ADMIN_REFERRAL_CODE();
        console.log('✅ Can read ADMIN_REFERRAL_CODE:', adminCode);
        results.connection.canReadConstants = true;
        results.connection.adminCode = adminCode;
      } catch (error: any) {
        console.log('⚠️  Cannot read ADMIN_REFERRAL_CODE:', error.message);
        results.connection.canReadConstants = false;
      }
      
      // Test function signatures
      const registerFragment = speedTrack.interface.getFunction('register');
      const activateFragment = speedTrack.interface.getFunction('activate');
      
      console.log('✅ register() signature:', registerFragment?.format());
      console.log('✅ activate() signature:', activateFragment?.format());
      
      results.connection.functions = {
        register: registerFragment?.format(),
        activate: activateFragment?.format()
      };
      
    } catch (error: any) {
      console.log('❌ Error testing contract functions:', error.message);
      results.errors.push(`Function test error: ${error.message}`);
    }

    // 6. RPC Connection Test
    console.log('\n6. RPC CONNECTION TEST');
    console.log('-'.repeat(60));
    
    try {
      const provider = getProvider();
      if (provider) {
        const blockNumber = await provider.getBlockNumber();
        console.log('✅ Current block number:', blockNumber);
        results.connection.blockNumber = blockNumber;
        results.connection.rpcWorking = true;
      }
    } catch (error: any) {
      console.log('❌ RPC connection error:', error.message);
      results.connection.rpcWorking = false;
      results.errors.push(`RPC error: ${error.message}`);
    }

    // 7. Transaction Verification Links
    console.log('\n7. TRANSACTION VERIFICATION');
    console.log('-'.repeat(60));
    console.log('To verify transactions on BSCScan:');
    console.log(`Contract: ${NETWORK_CONFIG.blockExplorer}/address/${CONTRACTS.SPEEDTRACK}`);
    console.log(`Your wallet: ${NETWORK_CONFIG.blockExplorer}/address/[YOUR_ADDRESS]`);
    
  } catch (error: any) {
    console.error('❌ Diagnostic error:', error);
    results.errors.push(`Diagnostic error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('DIAGNOSTICS COMPLETE');
  console.log('='.repeat(60));
  
  if (results.errors.length > 0) {
    console.log('\n⚠️  ERRORS FOUND:');
    results.errors.forEach((error: string, i: number) => {
      console.log(`  ${i + 1}. ${error}`);
    });
  } else {
    console.log('\n✅ No errors found - system appears healthy');
  }
  
  return results;
}

/**
 * Test a specific transaction
 */
export async function verifyTransaction(txHash: string) {
  console.log('\n=== TRANSACTION VERIFICATION ===');
  console.log('Transaction Hash:', txHash);
  
  try {
    const provider = getProvider();
    if (!provider) {
      console.log('❌ No provider available');
      return null;
    }
    
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      console.log('⚠️  Transaction not found or still pending');
      return null;
    }
    
    console.log('✅ Transaction found!');
    console.log('Block Number:', receipt.blockNumber);
    console.log('Status:', receipt.status === 1 ? '✅ Success' : '❌ Failed');
    console.log('Gas Used:', receipt.gasUsed.toString());
    console.log('Contract Address:', receipt.to);
    console.log('From:', receipt.from);
    
    // Check if it's to our contract
    if (receipt.to?.toLowerCase() === CONTRACTS.SPEEDTRACK.toLowerCase()) {
      console.log('✅ Transaction is to SpeedTrack contract');
    } else {
      console.log('⚠️  Transaction is NOT to SpeedTrack contract');
      console.log('  Expected:', CONTRACTS.SPEEDTRACK);
      console.log('  Got:', receipt.to);
    }
    
    // Check logs/events
    console.log('\nEvents emitted:', receipt.logs.length);
    receipt.logs.forEach((log, i) => {
      console.log(`  Event ${i + 1}:`, log.topics[0]);
    });
    
    console.log('\nView on explorer:');
    console.log(`${NETWORK_CONFIG.blockExplorer}/tx/${txHash}`);
    
    return receipt;
    
  } catch (error: any) {
    console.error('❌ Error verifying transaction:', error.message);
    return null;
  }
}

/**
 * Check if user is registered on-chain
 */
export async function verifyUserRegistration(address: string) {
  console.log('\n=== USER REGISTRATION VERIFICATION ===');
  console.log('Address:', address);
  
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Check user ID using the public userId mapping
    const userId = await speedTrack.userId(address);
    console.log('User ID:', userId.toString());
    
    if (userId > BigInt(0)) {
      console.log('✅ User IS registered (ID > 0)');
      
      // Get full user info
      const userInfo = await speedTrack.getUserInfo(address);
      console.log('\nUser Details:');
      console.log('  Name:', userInfo.name || '(not set)');
      console.log('  Email:', userInfo.email || '(not set)');
      console.log('  Activation Level:', userInfo.activationLevel.toString());
      console.log('  Profile Completed:', userInfo.profileCompleted);
      console.log('  Referrer:', userInfo.referrer);
      
      return {
        registered: true,
        userId: userId.toString(),
        userInfo
      };
    } else {
      console.log('❌ User is NOT registered (ID = 0)');
      return {
        registered: false,
        userId: '0'
      };
    }
    
  } catch (error: any) {
    console.error('❌ Error checking registration:', error.message);
    return {
      registered: false,
      error: error.message
    };
  }
}

/**
 * Export diagnostics to console for easy copying
 */
export function exportDiagnostics(results: any) {
  console.log('\n=== DIAGNOSTIC REPORT (Copy this) ===');
  console.log(JSON.stringify(results, null, 2));
  console.log('=== END REPORT ===\n');
}
