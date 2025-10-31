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
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    referrer: ""
  });
  const [isActivating, setIsActivating] = useState(false);

  // Load pending referral code on mount
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      // First try to get the stored referrer address directly
      const pendingReferrerAddress = localStorage.getItem('pendingReferrerAddress');
      const pendingCode = localStorage.getItem('pendingReferralCode');
      
      if (pendingReferrerAddress) {
        console.log('Found pending referrer address:', pendingReferrerAddress);
        setFormData(prev => ({ ...prev, referrer: pendingReferrerAddress }));
        showToast(`Referral code ${pendingCode || 'applied'} - Referrer auto-filled!`, 'success');
      } else if (pendingCode) {
        console.log('Found pending code, trying to get wallet address:', pendingCode);
        // Fallback: Try to get wallet address from code using the mapping
        import('@/lib/web3/referralCode').then(({ getWalletFromCode }) => {
          const walletAddress = getWalletFromCode(pendingCode);
          
          if (walletAddress) {
            console.log('Retrieved wallet address from code:', walletAddress);
            setFormData(prev => ({ ...prev, referrer: walletAddress }));
            showToast(`Referral code ${pendingCode} applied!`, 'success');
          } else {
            console.log('No wallet address found for code:', pendingCode);
            showToast(`Referral code ${pendingCode} found, but please enter referrer address manually`, 'info');
          }
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      showToast("Please connect your wallet first", 'error');
      return;
    }

    // Validate all fields
    if (!formData.name || formData.name.trim().length < 2) {
      showToast("Please enter a valid name (minimum 2 characters)", 'error');
      return;
    }

    if (!formData.mobile || formData.mobile.trim().length < 10) {
      showToast("Please enter a valid mobile number", 'error');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      showToast("Please enter a valid email address", 'error');
      return;
    }

    if (!formData.referrer || formData.referrer.trim().length < 10) {
      showToast("Please enter a valid referrer address", 'error');
      return;
    }

    try {
      setIsActivating(true);
      showToast("Processing activation...", 'info');
      
      const tx = await activateAccount(formData, account);
      showToast("Transaction submitted! Waiting for confirmation...", 'info');
      
      await tx.wait();
      
      showToast("Account activated successfully! 🎉", 'success');
      
      // Clear pending referral code and address after successful activation
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingReferralCode');
        localStorage.removeItem('pendingReferrerAddress');
      }
      
      await refreshBalances();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Activation error:', error);
      const errorMessage = parseActivationError(error);
      showToast(errorMessage, 'error');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto p-0 sm:p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full h-full sm:h-auto sm:rounded-2xl p-4 md:p-6 lg:p-8 sm:max-w-lg border-0 sm:border sm:border-gray-700 relative sm:my-8 max-h-screen sm:max-h-[95vh] overflow-y-auto shadow-2xl safe-area-inset keyboard-aware">
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
              Activation fee: 10 USDT
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full min-h-[48px] bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
              placeholder="Enter your full name"
              disabled={isActivating}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full min-h-[48px] bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
              placeholder="+1 234 567 8900"
              disabled={isActivating}
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              inputMode="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full min-h-[48px] bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
              placeholder="your@email.com"
              disabled={isActivating}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
              <span>Referrer Address</span>
              {formData.referrer && (
                <span className="text-xs text-green-400">
                  <i className="fas fa-check-circle mr-1"></i>
                  Auto-filled
                </span>
              )}
            </label>
            <input
              type="text"
              value={formData.referrer}
              onChange={(e) => setFormData({ ...formData, referrer: e.target.value })}
              className={`w-full min-h-[48px] bg-gray-800 border ${
                formData.referrer ? 'border-green-500/50' : 'border-gray-700'
              } rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all`}
              placeholder="0x... (will be auto-filled if you used a referral link)"
              disabled={isActivating}
            />
            {formData.referrer && (
              <p className="text-xs text-green-400 mt-1">
                <i className="fas fa-info-circle mr-1"></i>
                Referrer address loaded from your referral link
              </p>
            )}
          </div>

          <div className={`flex flex-col sm:flex-row ${!isRequired ? 'gap-3' : ''} pt-4`}>
            {!isRequired && (
              <Button
                type="button"
                onClick={onClose}
                disabled={isActivating}
                className="flex-1 bg-gray-700 hover:bg-gray-600 min-h-[48px]"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isActivating}
              className={`${!isRequired ? 'flex-1' : 'w-full'} min-h-[48px]`}
            >
              {isActivating ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Activating...
                </>
              ) : (
                <>
                  <i className="fas fa-rocket mr-2"></i>
                  Activate Now
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
