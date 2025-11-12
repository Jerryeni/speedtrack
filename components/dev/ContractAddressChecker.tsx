'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACTS, BSC_TESTNET } from '@/lib/web3/config';

export default function ContractAddressChecker() {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<any>(null);

  async function checkContracts() {
    setChecking(true);
    setResults(null);

    try {
      const provider = new ethers.JsonRpcProvider(BSC_TESTNET.rpcUrl);
      
      const checks = {
        speedTrack: {
          address: CONTRACTS.SPEEDTRACK,
          exists: false,
          codeLength: 0,
          error: null as string | null
        },
        stToken: {
          address: CONTRACTS.STTOKEN,
          exists: false,
          codeLength: 0,
          error: null as string | null
        },
        usdt: {
          address: CONTRACTS.USDT,
          exists: false,
          codeLength: 0,
          error: null as string | null
        }
      };

      // Check SpeedTrack
      try {
        const code = await provider.getCode(CONTRACTS.SPEEDTRACK);
        checks.speedTrack.exists = code !== '0x';
        checks.speedTrack.codeLength = code.length;
      } catch (error: any) {
        checks.speedTrack.error = error.message;
      }

      // Check STToken
      try {
        const code = await provider.getCode(CONTRACTS.STTOKEN);
        checks.stToken.exists = code !== '0x';
        checks.stToken.codeLength = code.length;
      } catch (error: any) {
        checks.stToken.error = error.message;
      }

      // Check USDT
      try {
        const code = await provider.getCode(CONTRACTS.USDT);
        checks.usdt.exists = code !== '0x';
        checks.usdt.codeLength = code.length;
      } catch (error: any) {
        checks.usdt.error = error.message;
      }

      setResults(checks);
    } catch (error: any) {
      console.error('Error checking contracts:', error);
      setResults({ error: error.message });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Contract Address Checker</h2>
      
      <div className="mb-6">
        <p className="text-gray-400 mb-2">Network: {BSC_TESTNET.name}</p>
        <p className="text-gray-400 mb-2">Chain ID: {BSC_TESTNET.chainId}</p>
        <p className="text-gray-400 mb-4">RPC: {BSC_TESTNET.rpcUrl}</p>
      </div>

      <button
        onClick={checkContracts}
        disabled={checking}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg mb-6"
      >
        {checking ? 'Checking...' : 'Check Contract Addresses'}
      </button>

      {results && (
        <div className="space-y-4">
          {results.error ? (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400">Error: {results.error}</p>
            </div>
          ) : (
            <>
              {/* SpeedTrack */}
              <div className={`border rounded-lg p-4 ${
                results.speedTrack.exists 
                  ? 'bg-green-900/20 border-green-500' 
                  : 'bg-red-900/20 border-red-500'
              }`}>
                <h3 className="text-lg font-semibold text-white mb-2">
                  SpeedTrack Contract {results.speedTrack.exists ? '✅' : '❌'}
                </h3>
                <p className="text-gray-300 font-mono text-sm mb-2">
                  {results.speedTrack.address}
                </p>
                {results.speedTrack.exists ? (
                  <>
                    <p className="text-green-400">Contract deployed and verified</p>
                    <p className="text-gray-400 text-sm">Code length: {results.speedTrack.codeLength} bytes</p>
                    <a
                      href={`${BSC_TESTNET.blockExplorer}/address/${results.speedTrack.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View on BSCScan →
                    </a>
                  </>
                ) : (
                  <div>
                    <p className="text-red-400 font-semibold">No contract found at this address!</p>
                    <p className="text-gray-400 text-sm mt-2">
                      This address does not have a deployed contract on {BSC_TESTNET.name}.
                    </p>
                    {results.speedTrack.error && (
                      <p className="text-red-300 text-sm mt-2">Error: {results.speedTrack.error}</p>
                    )}
                    <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500 rounded">
                      <p className="text-yellow-400 font-semibold mb-2">Action Required:</p>
                      <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                        <li>Deploy SpeedTrack contract to BSC Testnet</li>
                        <li>Update NEXT_PUBLIC_SPEEDTRACK_ADDRESS in .env.local</li>
                        <li>Restart your dev server</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>

              {/* STToken */}
              <div className={`border rounded-lg p-4 ${
                results.stToken.exists 
                  ? 'bg-green-900/20 border-green-500' 
                  : 'bg-red-900/20 border-red-500'
              }`}>
                <h3 className="text-lg font-semibold text-white mb-2">
                  ST Token Contract {results.stToken.exists ? '✅' : '❌'}
                </h3>
                <p className="text-gray-300 font-mono text-sm mb-2">
                  {results.stToken.address}
                </p>
                {results.stToken.exists ? (
                  <>
                    <p className="text-green-400">Contract deployed and verified</p>
                    <p className="text-gray-400 text-sm">Code length: {results.stToken.codeLength} bytes</p>
                    <a
                      href={`${BSC_TESTNET.blockExplorer}/address/${results.stToken.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View on BSCScan →
                    </a>
                  </>
                ) : (
                  <p className="text-red-400">No contract found at this address</p>
                )}
              </div>

              {/* USDT */}
              <div className={`border rounded-lg p-4 ${
                results.usdt.exists 
                  ? 'bg-green-900/20 border-green-500' 
                  : 'bg-red-900/20 border-red-500'
              }`}>
                <h3 className="text-lg font-semibold text-white mb-2">
                  USDT Contract {results.usdt.exists ? '✅' : '❌'}
                </h3>
                <p className="text-gray-300 font-mono text-sm mb-2">
                  {results.usdt.address}
                </p>
                {results.usdt.exists ? (
                  <>
                    <p className="text-green-400">Contract deployed and verified</p>
                    <p className="text-gray-400 text-sm">Code length: {results.usdt.codeLength} bytes</p>
                    <a
                      href={`${BSC_TESTNET.blockExplorer}/address/${results.usdt.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View on BSCScan →
                    </a>
                  </>
                ) : (
                  <p className="text-red-400">No contract found at this address</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
        <h4 className="text-blue-400 font-semibold mb-2">💡 Tip</h4>
        <p className="text-gray-300 text-sm">
          If any contract shows as not found, check your .env.local file and ensure you're using 
          the correct deployed contract addresses for {BSC_TESTNET.name}.
        </p>
      </div>
    </div>
  );
}
