"use client";

import { useEffect, useState } from 'react';
import { useWeb3 } from '@/lib/web3/Web3Context';
import { getUserId, getUserDetails, checkAccountActivation } from '@/lib/web3/activation';
import { getSpeedTrackReadOnly } from '@/lib/web3/contracts';

export default function FlowDebugPage() {
  const { account, isConnected } = useWeb3();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    if (!account) return;
    
    setLoading(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      account,
      checks: {}
    };

    try {
      // Check 1: getUserId
      console.log('=== CHECK 1: getUserId ===');
      const userId = await getUserId(account);
      results.checks.getUserId = {
        value: userId,
        parsed: parseInt(userId),
        isRegistered: userId !== '0' && parseInt(userId) > 0
      };
      console.log('getUserId result:', results.checks.getUserId);

      // Check 2: Direct contract call to userId mapping
      console.log('=== CHECK 2: Direct userId mapping ===');
      const speedTrack = await getSpeedTrackReadOnly();
      const directUserId = await speedTrack.userId(account);
      results.checks.directGetUserId = {
        value: directUserId.toString(),
        parsed: Number(directUserId),
        isRegistered: Number(directUserId) > 0
      };
      console.log('Direct userId mapping result:', results.checks.directGetUserId);

      // Check 3: getUserInfo
      console.log('=== CHECK 3: getUserInfo ===');
      try {
        const userInfo = await speedTrack.getUserInfo(account);
        results.checks.getUserInfo = {
          success: true,
          uid: userInfo.uid.toString(),
          activationLevel: userInfo.activationLevel.toString(),
          profileCompleted: userInfo.profileCompleted,
          name: userInfo.name,
          email: userInfo.email
        };
        console.log('getUserInfo result:', results.checks.getUserInfo);
      } catch (error: any) {
        results.checks.getUserInfo = {
          success: false,
          error: error.message
        };
        console.log('getUserInfo error:', error);
      }

      // Check 4: getUserDetails
      console.log('=== CHECK 4: getUserDetails ===');
      try {
        const userDetails = await getUserDetails(account);
        results.checks.getUserDetails = {
          success: true,
          data: userDetails
        };
        console.log('getUserDetails result:', results.checks.getUserDetails);
      } catch (error: any) {
        results.checks.getUserDetails = {
          success: false,
          error: error.message
        };
        console.log('getUserDetails error:', error);
      }

      // Check 5: checkAccountActivation
      console.log('=== CHECK 5: checkAccountActivation ===');
      const isActivated = await checkAccountActivation(account);
      results.checks.checkAccountActivation = {
        value: isActivated
      };
      console.log('checkAccountActivation result:', results.checks.checkAccountActivation);

    } catch (error: any) {
      results.error = error.message;
      console.error('Diagnostic error:', error);
    }

    setDebugInfo(results);
    setLoading(false);
  };

  useEffect(() => {
    if (account && isConnected) {
      runDiagnostics();
    }
  }, [account, isConnected]);

  if (!isConnected || !account) {
    return (
      <div className="min-h-screen bg-dark-primary text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Flow Debug</h1>
        <p>Please connect your wallet</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Flow Debug</h1>
        
        <div className="mb-6">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="px-6 py-3 bg-neon-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Running Diagnostics...' : 'Refresh Diagnostics'}
          </button>
        </div>

        {debugInfo && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Account Info</h2>
              <p className="font-mono text-sm break-all">{debugInfo.account}</p>
              <p className="text-gray-400 text-sm mt-2">{debugInfo.timestamp}</p>
            </div>

            {Object.entries(debugInfo.checks).map(([key, value]: [string, any]) => (
              <div key={key} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-neon-blue">{key}</h3>
                <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}

            {debugInfo.error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-red-400">Error</h3>
                <p className="text-red-300">{debugInfo.error}</p>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Analysis</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Registration Status: </span>
                  <span className={debugInfo.checks.getUserId?.isRegistered ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo.checks.getUserId?.isRegistered ? 'REGISTERED' : 'NOT REGISTERED'}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Activation Status: </span>
                  <span className={debugInfo.checks.checkAccountActivation?.value ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo.checks.checkAccountActivation?.value ? 'ACTIVATED' : 'NOT ACTIVATED'}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Profile Status: </span>
                  <span className={debugInfo.checks.getUserInfo?.profileCompleted ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo.checks.getUserInfo?.profileCompleted ? 'COMPLETED' : 'NOT COMPLETED'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
