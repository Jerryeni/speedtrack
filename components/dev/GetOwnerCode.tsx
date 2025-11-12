"use client";

import { useState } from 'react';
import { getSpeedTrackReadOnly } from '@/lib/web3/contracts';
import { getUserDetails } from '@/lib/web3/activation';
import { useWeb3 } from '@/lib/web3/Web3Context';
import { CONTRACTS } from '@/lib/web3/config';

/**
 * Developer Tool: Get Contract Owner's Referral Code
 * Use this to find the owner's code for testing
 */
export default function GetOwnerCode() {
  const { isConnected, isCorrectChain } = useWeb3();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOwnerInfo = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Get contract instance
      const speedTrack = await getSpeedTrackReadOnly();
      
      if (!speedTrack) {
        throw new Error('Failed to connect to contract. Check your network connection.');
      }

      console.log('Contract address:', await speedTrack.getAddress());
      
      // Get owner address
      let ownerAddress;
      try {
        ownerAddress = await speedTrack.owner();
        console.log('Contract Owner:', ownerAddress);
      } catch (ownerErr: any) {
        throw new Error('Failed to get contract owner. Make sure you are on the correct network (BSC Testnet).');
      }
      
      // Check if owner is registered using the public userId mapping
      let userId;
      try {
        userId = await speedTrack.userId(ownerAddress);
      } catch (userErr: any) {
        throw new Error('Failed to check owner registration. Contract might not be properly deployed.');
      }
      
      if (userId > 0) {
        // Owner is registered - get details
        let details;
        try {
          details = await getUserDetails(ownerAddress);
        } catch (detailsErr: any) {
          // If getUserDetails fails, still show basic info
          details = {
            name: 'Unknown',
            email: 'Unknown',
            activationLevel: 0,
            profileCompleted: false
          };
        }
        
        // Generate referral code from user ID (format: SPEED + padded ID)
        const referralCode = `SPEED${userId.toString().padStart(6, '0')}`;
        
        setResult({
          ownerAddress,
          userId: userId.toString(),
          referralCode: referralCode,
          name: details.name || 'Not set',
          email: details.email || 'Not set',
          activated: details.activationLevel > 0,
          activationLevel: details.activationLevel,
          profileCompleted: details.profileCompleted
        });
      } else {
        setResult({
          ownerAddress,
          userId: '0',
          registered: false,
          message: 'Owner has not registered yet. Contact them to register with ADMIN code first.'
        });
      }
    } catch (err: any) {
      console.error('Error:', err);
      
      // User-friendly error messages
      let errorMessage = 'Failed to fetch owner info. ';
      
      if (err.message?.includes('network')) {
        errorMessage += 'Check your network connection and make sure you are on BSC Testnet.';
      } else if (err.message?.includes('owner')) {
        errorMessage += 'Cannot read contract owner. Verify the contract address is correct.';
      } else if (err.code === 'CALL_EXCEPTION') {
        errorMessage += 'Contract call failed. Make sure you are connected to BSC Testnet (Chain ID: 97).';
      } else {
        errorMessage += err.message || 'Unknown error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border-2 border-neon-blue rounded-xl p-4 shadow-2xl z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-neon-blue">🛠️ Dev Tools</h3>
        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">DEV ONLY</span>
      </div>

      {/* Network Status */}
      <div className="mb-3 p-2 bg-gray-800 rounded text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Wallet:</span>
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? '✓ Connected' : '✗ Not Connected'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Network:</span>
          <span className={isCorrectChain ? 'text-green-400' : 'text-red-400'}>
            {isCorrectChain ? '✓ BSC Testnet' : '✗ Wrong Network'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Contract:</span>
          <span className="text-white font-mono text-[10px]">
            {CONTRACTS.SPEEDTRACK.slice(0, 10)}...
          </span>
        </div>
      </div>

      <button
        onClick={fetchOwnerInfo}
        disabled={loading || !isConnected || !isCorrectChain}
        className="w-full px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed mb-3"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Loading...
          </>
        ) : !isConnected ? (
          <>
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Connect Wallet First
          </>
        ) : !isCorrectChain ? (
          <>
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Switch to BSC Testnet
          </>
        ) : (
          <>
            <i className="fas fa-search mr-2"></i>
            Get Owner's Code
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-800 rounded-lg p-3 space-y-2 text-xs">
          <div>
            <p className="text-gray-400">Owner Address:</p>
            <div className="flex items-center justify-between">
              <p className="text-white font-mono text-[10px]">{result.ownerAddress?.slice(0, 20)}...</p>
              <button
                onClick={() => copyToClipboard(result.ownerAddress)}
                className="text-neon-blue hover:text-electric-purple"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>

          {result.registered === false ? (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded p-2">
              <p className="text-yellow-400 text-xs">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {result.message}
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-gray-400">User ID:</p>
                <p className="text-white">{result.userId}</p>
              </div>

              <div>
                <p className="text-gray-400">Referral Code:</p>
                <div className="flex items-center justify-between bg-green-500/20 border border-green-500 rounded p-2">
                  <p className="text-green-400 font-bold">{result.referralCode}</p>
                  <button
                    onClick={() => copyToClipboard(result.referralCode)}
                    className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-400">Name:</p>
                <p className="text-white">{result.name}</p>
              </div>

              <div>
                <p className="text-gray-400">Status:</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${result.activated ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {result.activated ? '✓ Activated' : '✗ Not Activated'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${result.profileCompleted ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {result.profileCompleted ? '✓ Profile' : '✗ Profile'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-700">
                <p className="text-green-400 font-semibold">
                  <i className="fas fa-check-circle mr-1"></i>
                  Use code "{result.referralCode}" to register!
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          <i className="fas fa-info-circle mr-1"></i>
          This tool helps you find the owner's referral code for testing
        </p>
      </div>
    </div>
  );
}
