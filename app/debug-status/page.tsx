"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getUserId, isUserRegistered, checkAccountActivation, getUserDetails } from "@/lib/web3/activation";

export default function DebugStatusPage() {
  const { account, isConnected } = useWeb3();
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    if (!account || !isConnected) {
      setError("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("=== DEBUG STATUS CHECK ===");
      console.log("Account:", account);

      // Method 1: getUserId
      console.log("\n1. Checking getUserId...");
      const userId = await getUserId(account);
      console.log("getUserId result:", userId);

      // Method 2: isUserRegistered
      console.log("\n2. Checking isUserRegistered...");
      const isRegistered = await isUserRegistered(account);
      console.log("isUserRegistered result:", isRegistered);

      // Method 3: checkAccountActivation
      console.log("\n3. Checking activation...");
      let isActivated = false;
      try {
        isActivated = await checkAccountActivation(account);
        console.log("checkAccountActivation result:", isActivated);
      } catch (err: any) {
        console.log("Activation check error:", err.message);
      }

      // Method 4: getUserDetails
      console.log("\n4. Getting user details...");
      let userDetails: any = null;
      try {
        userDetails = await getUserDetails(account);
        console.log("getUserDetails result:", userDetails);
      } catch (err: any) {
        console.log("getUserDetails error:", err.message);
      }

      setStatus({
        account,
        userId,
        isRegistered,
        isActivated,
        userDetails,
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account && isConnected) {
      checkStatus();
    }
  }, [account, isConnected]);

  return (
    <main className="min-h-screen p-8 bg-dark-primary">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-orbitron font-bold text-neon-blue mb-6">
          Registration Status Debug
        </h1>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Connection Status</h2>
            <button
              onClick={checkStatus}
              disabled={isLoading || !account}
              className="px-4 py-2 bg-neon-blue text-white rounded-lg hover:opacity-80 disabled:opacity-50"
            >
              {isLoading ? "Checking..." : "Refresh Status"}
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

        {status && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Registration Check Results</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">User ID (getUserId):</span>
                    <span className={`font-bold ${status.userId !== '0' ? 'text-green-400' : 'text-red-400'}`}>
                      {status.userId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {status.userId !== '0' ? '✓ User is registered (ID > 0)' : '✗ User not registered (ID = 0)'}
                  </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Is Registered (isUserRegistered):</span>
                    <span className={`font-bold ${status.isRegistered ? 'text-green-400' : 'text-red-400'}`}>
                      {status.isRegistered ? '✓ TRUE' : '✗ FALSE'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Is Activated:</span>
                    <span className={`font-bold ${status.isActivated ? 'text-green-400' : 'text-yellow-400'}`}>
                      {status.isActivated ? '✓ TRUE' : '⚠ FALSE'}
                    </span>
                  </div>
                </div>

                {status.userDetails && (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">User Details:</h3>
                    <pre className="text-xs text-gray-300 overflow-auto">
                      {JSON.stringify(status.userDetails, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-sm text-blue-400">
                  <i className="fas fa-info-circle mr-2"></i>
                  Last checked: {new Date(status.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">What Should Happen</h2>
              <div className="space-y-2 text-sm">
                {status.userId === '0' || !status.isRegistered ? (
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                    <p className="text-red-400 font-semibold">
                      ✗ You should see the REGISTRATION modal
                    </p>
                    <p className="text-gray-400 mt-1">
                      User ID is 0 or isRegistered is false - registration required
                    </p>
                  </div>
                ) : !status.isActivated ? (
                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <p className="text-yellow-400 font-semibold">
                      ⚠ You should be redirected to ACTIVATION page
                    </p>
                    <p className="text-gray-400 mt-1">
                      User is registered but not activated
                    </p>
                  </div>
                ) : !status.userDetails?.profileCompleted ? (
                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <p className="text-yellow-400 font-semibold">
                      ⚠ You should see PROFILE COMPLETION modal
                    </p>
                    <p className="text-gray-400 mt-1">
                      User is activated but profile not complete
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-green-400 font-semibold">
                      ✓ You should have FULL ACCESS to dashboard
                    </p>
                    <p className="text-gray-400 mt-1">
                      All steps completed successfully
                    </p>
                  </div>
                )}
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
