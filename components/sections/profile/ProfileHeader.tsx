"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getUserDetails } from "@/lib/web3/activation";
import { getRewardSummary } from "@/lib/web3/rewards";

export default function ProfileHeader() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [userData, setUserData] = useState<any>(null);
  const [rewardData, setRewardData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!account || !isConnected || !isCorrectChain) return;

      try {
        const [user, rewards] = await Promise.all([
          getUserDetails(account),
          getRewardSummary(account)
        ]);

        setUserData(user);
        setRewardData(rewards);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);
  return (
    <section className="px-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-neon-blue/50 animate-[avatarGlow_3s_ease-in-out_infinite]">
            <img 
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg" 
              alt="Profile Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-electric-purple flex items-center justify-center border-2 border-dark-primary"
          >
            <i className="fas fa-camera text-white text-sm"></i>
          </button>
        </div>

        <h2 className="font-orbitron font-bold text-2xl text-neon-blue mb-2">
          {userData?.name || "Speed Racer"}
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          {userData?.activated ? "Active Member" : "Pending Activation"}
        </p>

        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-electric-purple animate-[statsCount_2s_ease-out]">
              {userData?.investedPoolNumber || "0"}
            </p>
            <p className="text-xs text-gray-400">Pool Number</p>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-blue animate-[statsCount_2s_ease-out]">
              {parseFloat(rewardData?.totalEarned || '0').toFixed(2)} USDT
            </p>
            <p className="text-xs text-gray-400">Total Earnings</p>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400 animate-[statsCount_2s_ease-out]">
              {userData?.totalDirectReferrals || "0"}
            </p>
            <p className="text-xs text-gray-400">Referrals</p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          {userData?.activated && (
            <div className="flex items-center space-x-1 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full animate-[verificationPulse_3s_ease-in-out_infinite]">
              <i className="fas fa-shield-alt"></i>
              <span>Activated</span>
            </div>
          )}
          {parseFloat(userData?.totalInvestment || '0') > 0 && (
            <div className="flex items-center space-x-1 text-xs bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-full">
              <i className="fas fa-coins"></i>
              <span>Investor</span>
            </div>
          )}
          {parseInt(userData?.totalDirectReferrals || '0') > 0 && (
            <div className="flex items-center space-x-1 text-xs bg-electric-purple/20 text-electric-purple px-3 py-1 rounded-full">
              <i className="fas fa-users"></i>
              <span>Leader</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
