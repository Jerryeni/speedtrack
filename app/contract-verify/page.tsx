'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

export default function ContractVerifyPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function verifyContract() {
    setLoading(true);
    const results: any = {
      contractAddress: process.env.NEXT_PUBLIC_SPEEDTRACK_ADDRESS,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
      checks: {}
    };

    try {
      // Create provider
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      results.checks.providerConnected = '✅ Provider connected';

      // Check if contract exists
      const code = await provider.getCode(process.env.NEXT_PUBLIC_SPEEDTRACK_ADDRESS!);
      results.checks.contractExists = code !== '0x' ? '✅ Contract exists' : '❌ No contract at this address';
      results.contractCode = code.substring(0, 100) + '...';

      if (code === '0x') {
        results.error = 'No contract deployed at this address!';
        setResults(results);
        setLoading(false);
        return;
      }

      // Try to call owner() function
      try {
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_SPEEDTRACK_ADDRESS!,
          ['function owner() view returns (address)'],
          provider
        );
        const owner = await contract.owner();
        results.checks.ownerFunction = `✅ owner() works: ${owner}`;
      } catch (err: any) {
        results.checks.ownerFunction = `❌ owner() failed: ${err.message}`;
      }

      // Try to call userId mapping
      try {
        const testAddress = '0x0000000000000000000000000000000000000000';
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_SPEEDTRACK_ADDRESS!,
          ['function userId(address) view returns (uint256)'],
          provider
        );
        const userId = await contract.userId(testAddress);
        results.checks.userIdMapping = `✅ userId() works: ${userId.toString()}`;
      } catch (err: any) {
        results.checks.userIdMapping = `❌ userId() failed: ${err.message}`;
      }

      // Try to call getUserInfo
      try {
        const testAddress = '0x0000000000000000000000000000000000000000';
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_SPEEDTRACK_ADDRESS!,
          ['function getUserInfo(address) view returns (string,string,string,string,uint256,address,uint8,bool,bool,uint256,uint256,uint256,uint256,uint256)'],
          provider
        );
        const userInfo = await contract.getUserInfo(testAddress);
        results.checks.getUserInfo = `✅ getUserInfo() works`;
      } catch (err: any) {
        results.checks.getUserInfo = `❌ getUserInfo() failed: ${err.message}`;
      }

      // Try to call ADMIN_REFERRAL_CODE
      try {
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_SPEEDTRACK_ADDRESS!,
          ['function ADMIN_REFERRAL_CODE() view returns (string)'],
          provider
        );
        const adminCode = await contract.ADMIN_REFERRAL_CODE();
        results.checks.adminCode = `✅ ADMIN_REFERRAL_CODE: ${adminCode}`;
      } catch (err: any) {
        results.checks.adminCode = `❌ ADMIN_REFERRAL_CODE failed: ${err.message}`;
      }

    } catch (error: any) {
      results.error = error.message;
    }

    setResults(results);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Contract Verification</h1>

        <button
          onClick={verifyContract}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify Contract'}
        </button>

        {results && (
          <div className="mt-8 space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Configuration</h2>
              <div className="space-y-2 font-mono text-sm">
                <p><span className="text-gray-400">Contract:</span> {results.contractAddress}</p>
                <p><span className="text-gray-400">RPC URL:</span> {results.rpcUrl}</p>
              </div>
            </div>

            {results.error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-2">❌ Error</h2>
                <p className="text-red-300">{results.error}</p>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Verification Results</h2>
              <div className="space-y-3">
                {Object.entries(results.checks).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3">
                    <span className="text-gray-400 min-w-[200px]">{key}:</span>
                    <span className={value.toString().startsWith('✅') ? 'text-green-400' : 'text-red-400'}>
                      {value as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {results.contractCode && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Contract Bytecode (first 100 chars)</h2>
                <p className="font-mono text-xs text-gray-400 break-all">{results.contractCode}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
