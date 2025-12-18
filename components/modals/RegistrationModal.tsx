"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { registerUser, isUserRegistered, testContractConnection } from "@/lib/web3/registration";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { showToast } from "@/lib/toast";
import { parseRegistrationError } from "@/lib/web3/errorParser";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegistrationModal({ isOpen, onClose, onSuccess }: RegistrationModalProps) {
  const { account } = useWeb3();
  const [formData, setFormData] = useState({
    referralCode: "",
    leaderAddress: ""
  });
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    async function checkAndSetup() {
      if (!isOpen || typeof window === 'undefined') return;
      
      // CRITICAL: Check if user is already registered before showing modal
      if (account) {
        const alreadyRegistered = await isUserRegistered(account);
        if (alreadyRegistered) {
          console.log('⚠️ User is already registered - closing registration modal');
          showToast('You are already registered!', 'info');
          onClose();
          return;
        }
      }
      
      // Read referral data from localStorage
      const pendingCode = localStorage.getItem('pendingReferralCode');
      const pendingLeader = localStorage.getItem('pendingLeaderAddress');
      
      console.log('📋 Reading from localStorage when modal opens:');
      console.log('  - Referral Code:', pendingCode);
      console.log('  - Leader Address:', pendingLeader);
      
      // Set both values at once to avoid conflicts
      if (pendingCode || pendingLeader) {
        console.log('✅ Auto-filling registration form');
        setFormData({
          referralCode: pendingCode || "",
          leaderAddress: pendingLeader || ""
        });
      }
      
      // Test contract connection when modal opens
      testContractConnection().then(result => {
        if (result.success) {
          console.log('✓ Contract connection verified:', result.details);
        } else {
          console.error('❌ Contract connection failed:', result.details);
          showToast('Warning: Could not verify contract connection. Please check your network.', 'error');
        }
      });
    }
    
    checkAndSetup();
  }, [isOpen, account, onClose]);



  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      showToast("Please connect your wallet first", 'error');
      return;
    }

    if (!formData.referralCode || formData.referralCode.trim().length === 0) {
      showToast("Please enter a referral code", 'error');
      return;
    }

    try {
      setIsRegistering(true);
      
      // Check if already registered
      console.log('Checking if user is already registered...');
      const alreadyRegistered = await isUserRegistered(account);
      if (alreadyRegistered) {
        showToast("✅ You are already registered! Proceeding to activation...", 'success');
        onSuccess();
        onClose();
        return;
      }
      
      console.log('Proceeding with registration...');
      console.log('Referral code:', formData.referralCode);
      console.log('Leader address:', formData.leaderAddress || 'None (will use zero address)');
      
      showToast("Processing registration...", 'info');
      
      const tx = await registerUser(formData);
      console.log('Transaction sent:', tx.hash);
      
      showToast("Transaction submitted! Waiting for confirmation...", 'info');
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      showToast("Registration successful! 🎉", 'success');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingReferralCode');
        localStorage.removeItem('pendingLeaderAddress');
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        code: error.code,
        data: error.data,
        reason: error.reason,
        fullError: error
      });
      
      const errorMessage = parseRegistrationError(error);
      showToast(errorMessage, 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 relative">
        <button
          onClick={onClose}
          disabled={isRegistering}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
        >
          <i className="fas fa-times text-gray-400"></i>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center">
            <i className="fas fa-user-plus text-2xl text-white"></i>
          </div>
          <h2 className="text-2xl font-orbitron font-bold text-neon-blue mb-2">
            Register Account
          </h2>
          <p className="text-sm text-gray-400">
            Join the Speed Track community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Referral Code
            </label>
            <input
              type="text"
              value={formData.referralCode}
              onChange={(e) => {
                const newCode = e.target.value;
                setFormData({ ...formData, referralCode: newCode });
                // Save to localStorage for persistence
                if (typeof window !== 'undefined') {
                  localStorage.setItem('pendingReferralCode', newCode);
                }
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
              placeholder="Enter referral code"
              disabled={isRegistering}
            />
            <div className="mt-2 p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
              <p className="text-xs text-neon-blue">
                <i className="fas fa-info-circle mr-1"></i>
                Enter the referral code you received from your referrer
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Leader Address (Optional)
            </label>
            <input
              type="text"
              value={formData.leaderAddress}
              onChange={(e) => {
                const newAddress = e.target.value;
                setFormData({ ...formData, leaderAddress: newAddress });
                // Save to localStorage for persistence
                if (typeof window !== 'undefined') {
                  localStorage.setItem('pendingLeaderAddress', newAddress);
                }
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-neon-blue"
              placeholder="0x... (optional)"
              disabled={isRegistering}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isRegistering}
              className="flex-1 bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isRegistering}
              className="flex-1"
            >
              {isRegistering ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Registering...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Register
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
