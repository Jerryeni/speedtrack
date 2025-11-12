"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { activateAccount, checkAccountActivation, getUserId } from "@/lib/web3/activation";
import { showToast } from "@/lib/toast";
import { parseActivationError } from "@/lib/web3/errorParser";
import Button from "@/components/ui/Button";
import Header from "@/components/layout/Header";

export default function ActivatePage() {
  const router = useRouter();
  const { account, isConnected, refreshBalances } = useWeb3();
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [activationFee, setActivationFee] = useState("10");
  const [isActivating, setIsActivating] = useState(false);

  const activationLevels = [
    { level: 0, fee: "10", maxInvestment: "50" },
    { level: 1, fee: "50", maxInvestment: "250" },
    { level: 2, fee: "100", maxInvestment: "500" },
    { level: 3, fee: "250", maxInvestment: "1250" },
    { level: 4, fee: "500", maxInvestment: "2500" },
  ];

  // Check if user is already activated and redirect to dashboard
  useEffect(() => {
    async function checkActivation() {
      if (!account || !isConnected) return;
      
      try {
        const isActivated = await checkAccountActivation(account);
        if (isActivated) {
          showToast("Your account is already activated!", 'info');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking activation:', error);
      }
    }
    
    checkActivation();
  }, [account, isConnected, router]);

  const handleActivate = async () => {
    if (!account) {
      showToast("Please connect your wallet first", 'error');
      return;
    }

    try {
      setIsActivating(true);
      showToast("Processing activation...", 'info');
      
      const tx = await activateAccount(selectedLevel, account);
      showToast("Transaction submitted! Waiting for confirmation...", 'info');
      
      await tx.wait();
      
      showToast("Account activated successfully! 🎉", 'success');
      
      await refreshBalances();
      
      // Wait for blockchain state to update
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Force a full page reload to ensure fresh state
      console.log('→ Redirecting to profile page with fresh state');
      window.location.href = '/profile';
    } catch (error: any) {
      console.error('Activation error:', error);
      const errorMessage = parseActivationError(error);
      showToast(errorMessage, 'error');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center shadow-lg">
              <i className="fas fa-rocket text-4xl text-white"></i>
            </div>
            <h1 className="text-4xl font-orbitron font-bold text-neon-blue mb-4">
              Activate Your Account
            </h1>
            <p className="text-gray-400 text-lg">
              Choose your activation level and start earning
            </p>
          </div>

          {/* Info Banner */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <i className="fas fa-info-circle text-yellow-400 text-2xl mt-1"></i>
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2">Important Information</h3>
                <p className="text-gray-300 text-sm">
                  Choose your activation level based on your investment capacity. 
                  Higher levels allow larger investments and greater earning potential.
                </p>
              </div>
            </div>
          </div>

          {/* Activation Levels */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
              Select Activation Level
            </h2>
            
            <div className="grid gap-4 mb-8">
              {activationLevels.map((level) => (
                <div
                  key={level.level}
                  onClick={() => {
                    setSelectedLevel(level.level);
                    setActivationFee(level.fee);
                  }}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedLevel === level.level
                      ? 'border-neon-blue bg-neon-blue/10 shadow-lg shadow-neon-blue/20'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedLevel === level.level ? 'bg-neon-blue' : 'bg-gray-700'
                      }`}>
                        <span className="text-white font-bold text-lg">{level.level}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">Level {level.level}</p>
                        <p className="text-sm text-gray-400">
                          Max Investment: {level.maxInvestment} USDT
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neon-blue">{level.fee} USDT</p>
                      <p className="text-xs text-gray-400">Activation Fee</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="font-semibold mb-4 text-blue-400 text-lg">
                <i className="fas fa-gift mr-2"></i>
                Activation Benefits
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-400 text-xl"></i>
                  <span className="text-gray-300">Daily ROI: 0.5%</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-400 text-xl"></i>
                  <span className="text-gray-300">10-Level Referral Commissions</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-400 text-xl"></i>
                  <span className="text-gray-300">Capital Return: 200%</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-400 text-xl"></i>
                  <span className="text-gray-300">ST Token Rewards: 10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/')}
              disabled={isActivating}
              className="flex-1 bg-gray-700 hover:bg-gray-600"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Home
            </Button>
            <Button
              onClick={handleActivate}
              disabled={isActivating}
              className="flex-1"
            >
              {isActivating ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Activating...
                </>
              ) : (
                <>
                  <i className="fas fa-rocket mr-2"></i>
                  Activate ({activationFee} USDT)
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
