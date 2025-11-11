"use client";

import { useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { diagnoseReferrals, getActualReferralCount } from "@/lib/web3/referralDiagnostics";
import { getReferralStats } from "@/lib/web3/referrals";
import Button from "@/components/ui/Button";

export default function ReferralDebugPage() {
  const { account, isConnected } = useWeb3();
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runDiagnostics = async () => {
    if (!account) return;
    
    setIsRunning(true);
    setResult(null);
    
    try {
      console.clear();
      console.log('Starting referral diagnostics...');
      
      // Run diagnostics
      const diagResult = await diagnoseReferrals(account);
      
      // Get actual count
      const actualCount = await getActualReferralCount(account);
      
      // Get stats from normal function
      const stats = await getReferralStats(account);
      
      setResult({
        diagnostics: diagResult,
        actualCount,
        stats
      });
      
    } catch (error: any) {
      console.error('Diagnostics failed:', error);
      setResult({
        error: error.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-orbitron font-bold text-neon-blue mb-6">
          Referral Diagnostics
        </h1>

        {!isConnected ? (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
            <i className="fas fa-wallet text-yellow-400 text-3xl mb-3"></i>
            <p className="text-yellow-400">Please connect your wallet</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
              <h2 className="text-lg font-semibold mb-4">Your Address</h2>
              <p className="text-sm text-gray-400 font-mono break-all">{account}</p>
            </div>

            <Button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="w-full mb-6"
            >
              {isRunning ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <i className="fas fa-search mr-2"></i>
                  Run Referral Diagnostics
                </>
              )}
            </Button>

            {result && (
              <div className="space-y-4">
                {result.error ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <h3 className="text-red-400 font-semibold mb-2">Error</h3>
                    <p className="text-sm text-gray-400">{result.error}</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-6 border border-green-500/30">
                      <h3 className="text-green-400 font-semibold mb-4">
                        <i className="fas fa-check-circle mr-2"></i>
                        Actual Referral Count
                      </h3>
                      <p className="text-4xl font-bold text-green-400">
                        {result.actualCount}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Unique users who registered with your referral
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-neon-blue/20 to-neon-blue/5 rounded-2xl p-6 border border-neon-blue/30">
                      <h3 className="text-neon-blue font-semibold mb-4">
                        <i className="fas fa-chart-line mr-2"></i>
                        Stats from getReferralStats()
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Direct Referrals</p>
                          <p className="text-2xl font-bold text-neon-blue">
                            {result.stats.directReferrals}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Referrals</p>
                          <p className="text-2xl font-bold text-neon-blue">
                            {result.stats.totalReferrals}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Level Income</p>
                          <p className="text-2xl font-bold text-electric-purple">
                            {parseFloat(result.stats.levelIncome).toFixed(4)} USDT
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Earned</p>
                          <p className="text-2xl font-bold text-electric-purple">
                            {parseFloat(result.stats.totalEarned).toFixed(4)} USDT
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
                      <h3 className="text-white font-semibold mb-4">
                        <i className="fas fa-info-circle mr-2"></i>
                        Referral Info
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Referral Code:</span>
                          <span className="text-white font-mono">{result.stats.referralCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Short Link:</span>
                          <span className="text-white font-mono text-xs">{result.stats.shortLink}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <p className="text-sm text-yellow-400">
                        <i className="fas fa-terminal mr-2"></i>
                        Check browser console (F12) for detailed logs
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
