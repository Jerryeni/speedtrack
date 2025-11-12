"use client";

import { useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { ethers } from "ethers";

export default function ContractTestPage() {
  const { account, isConnected } = useWeb3();
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testContract = async () => {
    if (!account || !isConnected) {
      setError("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const { getSpeedTrackReadOnly } = await import('@/lib/web3/contracts');
      const { CONTRACTS } = await import('@/lib/web3/config');
      
      console.log("=== CONTRACT TEST ===");
      console.log("Account:", account);
      console.log("Contract Address:", CONTRACTS.SPEEDTRACK);
      
      const contract = await getSpeedTrackReadOnly();
      const contractAddress = await contract.getAddress();
      
      console.log("Contract Instance Address:", contractAddress);
      
      // Test 1: Call userId mapping
      console.log("\n1. Testing userId(address)...");
      let userIdResult = "ERROR";
      try {
        const userId = await contract.userId(account);
        userIdResult = userId.toString();
        console.log("userId result:", userIdResult);
      } catch (err: any) {
        console.error("userId error:", err.message);
        userIdResult = `ERROR: ${err.message}`;
      }
      
      // Test 2: Call getUserInfo
      console.log("\n2. Testing getUserInfo(address)...");
      let getUserInfoResult: any = "ERROR";
      try {
        const userInfo = await contract.getUserInfo(account);
        getUserInfoResult = {
          name: userInfo.name,
          email: userInfo.email,
          activationLevel: userInfo.activationLevel.toString(),
          profileCompleted: userInfo.profileCompleted,
          uid: userInfo.uid.toString()
        };
        console.log("getUserInfo result:", getUserInfoResult);
      } catch (err: any) {
        console.error("getUserInfo error:", err.message);
        getUserInfoResult = `ERROR: ${err.message}`;
      }
      
      // Test 3: Call users mapping
      console.log("\n3. Testing users(address)...");
      let usersResult: any = "ERROR";
      try {
        const user = await contract.users(account);
        usersResult = {
          name: user.name,
          email: user.email,
          activationLevel: user.activationLevel.toString(),
          profileCompleted: user.profileCompleted,
          isActivated: user.isActivated
        };
        console.log("users result:", usersResult);
      } catch (err: any) {
        console.error("users error:", err.message);
        usersResult = `ERROR: ${err.message}`;
      }
      
      setResults({
        contractAddress: contractAddress,
        configAddress: CONTRACTS.SPEEDTRACK,
        addressMatch: contractAddress.toLowerCase() === CONTRACTS.SPEEDTRACK.toLowerCase(),
        userId: userIdResult,
        getUserInfo: getUserInfoResult,
        users: usersResult
      });
      
    } catch (err: any) {
      console.error("Test error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-dark-primary">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-orbitron font-bold text-neon-blue mb-6">
          Contract Function Test
        </h1>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Test Contract Functions</h2>
            <button
              onClick={testContract}
              disabled={isLoading || !account}
              className="px-4 py-2 bg-neon-blue text-white rounded-lg hover:opacity-80 disabled:opacity-50"
            >
              {isLoading ? "Testing..." : "Run Test"}
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Connected:</span>
              <span className={isConnected ? "text-green-400" : "text-red-400"}>
                {isConnected ? "✓ Yes" : "✗ No"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Account:</span>
              <span className="text-white font-mono text-xs">
                {account || "Not connected"}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </p>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Contract Info</h2>
              
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Config Address (.env.local):</p>
                  <p className="text-xs font-mono text-white break-all">{results.configAddress}</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Contract Instance Address:</p>
                  <p className="text-xs font-mono text-white break-all">{results.contractAddress}</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Addresses Match:</span>
                    <span className={`font-bold ${results.addressMatch ? 'text-green-400' : 'text-red-400'}`}>
                      {results.addressMatch ? '✓ YES' : '✗ NO - MISMATCH!'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Function Test Results</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="font-bold text-white mb-2">userId(address):</h3>
                  <pre className="text-xs text-gray-300 overflow-auto">
                    {typeof results.userId === 'string' ? results.userId : JSON.stringify(results.userId, null, 2)}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    {results.userId === '0' ? '❌ User NOT registered (userId = 0)' : 
                     results.userId.includes('ERROR') ? '❌ Function call failed' :
                     '✅ User IS registered'}
                  </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="font-bold text-white mb-2">getUserInfo(address):</h3>
                  <pre className="text-xs text-gray-300 overflow-auto">
                    {typeof results.getUserInfo === 'string' ? results.getUserInfo : JSON.stringify(results.getUserInfo, null, 2)}
                  </pre>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="font-bold text-white mb-2">users(address):</h3>
                  <pre className="text-xs text-gray-300 overflow-auto">
                    {typeof results.users === 'string' ? results.users : JSON.stringify(results.users, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
