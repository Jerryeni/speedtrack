"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { activateAccount } from "@/lib/web3/activation";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { showToast } from "@/lib/toast";
import { parseActivationError } from "@/lib/web3/errorParser";

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isRequired?: boolean; // New prop to indicate if activation is mandatory
}

export default function ActivationModal({ isOpen, onClose, onSuccess, isRequired = false }: ActivationModalProps) {
  const { account, refreshBalances } = useWeb3();
  const [isActivating, setIsActivating] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [activationLevels, setActivationLevels] = useState([
    { level: 0, fee: "10", maxInvestment: "50", name: "Starter" },
    { level: 1, fee: "50", maxInvestment: "250", name: "Bronze" },
    { level: 2, fee: "100", maxInvestment: "500", name: "Silver" },
    { level: 3, fee: "250", maxInvestment: "1250", name: "Gold" },
    { level: 4, fee: "500", maxInvestment: "2500", name: "Platinum" },
  ]);
  const [isLoadingFees, setIsLoadingFees] = useState(true);

  // Load activation fees from contract
  useEffect(() => {
    async function loadFees() {
      try {
        const { getActivationFees, getAllMaxInvestments } = await import('@/lib/web3/systemConfig');
        const [fees, maxInvs] = await Promise.all([
          getActivationFees(),
          getAllMaxInvestments()
        ]);
        
        const levels = fees.map((feeData, index) => ({
          level: feeData.level,
          fee: feeData.fee,
          maxInvestment: maxInvs[index]?.maxInvestment || "0",
          name: feeData.name
        }));
        
        setActivationLevels(levels);
      } catch (error) {
        console.error("Error loading activation fees:", error);
        // Keep default values
      } finally {
        setIsLoadingFees(false);
      }
    }
    
    if (isOpen) {
      loadFees();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('=== ACTIVATION ERROR ===');
      console.error('Full error:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error reason:', error.reason);
      console.error('Error data:', error.data);
      
      const errorMessage = parseActivationError(error);
      showToast(errorMessage, 'error');
      
      // Also show the raw error in console for debugging
      if (error.reason) {
        console.error('Contract revert reason:', error.reason);
      }
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full sm:h-auto rounded-2xl p-6 sm:max-w-lg border border-gray-700 relative my-8 max-h-[95vh] overflow-y-auto shadow-2xl">
        {!isRequired && (
          <button
            onClick={onClose}
            disabled={isActivating}
            className="absolute top-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10 active:scale-95"
          >
            <i className="fas fa-times text-gray-400"></i>
          </button>
        )}
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center shadow-lg">
            <i className="fas fa-user-check text-2xl text-white"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-neon-blue mb-2">
            Activate Your Account
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Complete your profile to start racing
          </p>
          {isRequired && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-3">
              <p className="text-sm text-red-400">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Activation is required to access all features
              </p>
            </div>
          )}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
            <p className="text-sm text-yellow-400">
              <i className="fas fa-info-circle mr-2"></i>
              Choose your activation level based on investment capacity
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Activation Level
            </label>
            <div className="space-y-3">
              {activationLevels.map((level) => (
                <div
                  key={level.level}
                  onClick={() => {
                    setSelectedLevel(level.level);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedLevel === level.level
                      ? 'border-neon-blue bg-neon-blue/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Level {level.level}</p>
                      <p className="text-sm text-gray-400">
                        Max Investment: {level.maxInvestment} USDT
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-neon-blue">{level.fee} USDT</p>
                      <p className="text-xs text-gray-400">Activation Fee</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="font-semibold mb-2 text-blue-400">Activation Benefits:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-400 mr-2"></i>
                Daily ROI: 0.5%
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-400 mr-2"></i>
                10-Level Referral Commissions
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-400 mr-2"></i>
                Capital Return: 200%
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-400 mr-2"></i>
                ST Token Rewards: 10%
              </li>
            </ul>
          </div>

          <div className={`flex flex-col sm:flex-row ${!isRequired ? 'gap-3' : ''} pt-4`}>
            {!isRequired && (
              <Button
                type="button"
                onClick={onClose}
                disabled={isActivating}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 text-sm whitespace-nowrap"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isActivating}
              className={`${!isRequired ? 'flex-1' : 'w-full'} py-2.5 text-sm whitespace-nowrap`}
            >
              {isActivating ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-1.5"></i>
                  <span>Activating...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-rocket mr-1.5"></i>
                  <span>Activate ({activationLevels[selectedLevel]?.fee || '0'} USDT)</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
