"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getUserDetails } from "@/lib/web3/activation";
import { showToast } from "@/lib/toast";

interface PersonalInfoProps {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

export default function PersonalInfo({ isEditMode, setIsEditMode }: PersonalInfoProps) {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!account || !isConnected || !isCorrectChain) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getUserDetails(account);
        setFullName(userData.name || "");
        setPhoneNumber(userData.mobileNumber || "");
        setEmailAddress(userData.email || "");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [account, isConnected, isCorrectChain]);

  const handleSave = async () => {
    if (!account) {
      showToast("Please connect your wallet", 'error');
      return;
    }

    // Validate inputs
    if (!fullName || fullName.trim().length < 2) {
      showToast("Please enter a valid name", 'error');
      return;
    }

    if (!emailAddress || !emailAddress.includes('@')) {
      showToast("Please enter a valid email", 'error');
      return;
    }

    if (!phoneNumber || phoneNumber.trim().length < 10) {
      showToast("Please enter a valid phone number", 'error');
      return;
    }

    try {
      setIsSaving(true);
      showToast("Updating profile...", 'info');

      // Import completeProfile function
      const { completeProfile } = await import('@/lib/web3/activation');
      
      // Extract country code and mobile number
      // Assuming phoneNumber format is like "+1234567890" or "1234567890"
      let countryCode = "+1";
      let mobileNumber = phoneNumber;
      
      if (phoneNumber.startsWith('+')) {
        // Extract country code (first 1-3 digits after +)
        const match = phoneNumber.match(/^\+(\d{1,3})(.+)$/);
        if (match) {
          countryCode = `+${match[1]}`;
          mobileNumber = match[2];
        }
      }

      const tx = await completeProfile({
        name: fullName.trim(),
        email: emailAddress.trim(),
        countryCode: countryCode,
        mobileNumber: mobileNumber.trim()
      });

      showToast("Transaction submitted! Waiting for confirmation...", 'info');
      await tx.wait();
      
      showToast("Profile updated successfully! 🎉", 'success');
      setIsEditMode(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      showToast(error.message || "Failed to update profile", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="px-4 mb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-6">
          <div className="text-center text-gray-400">Loading profile data...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Personal Information</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-custom"></div>
              <span className="text-xs text-green-400">Secure</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <i className="fas fa-user text-neon-blue"></i>
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditMode}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-neon-blue focus:outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <i className="fas fa-phone text-green-400"></i>
              <span>Phone Number</span>
              <div className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full animate-[phoneGlow_4s_ease-in-out_infinite]">
                <i className="fas fa-check mr-1"></i>Verified
              </div>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={!isEditMode}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-green-400 focus:outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <i className="fas fa-envelope text-electric-purple"></i>
              <span>Email Address</span>
              <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              disabled={!isEditMode}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-electric-purple focus:outline-none transition-all disabled:opacity-60"
            />
          </div>

          {isEditMode && (
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
