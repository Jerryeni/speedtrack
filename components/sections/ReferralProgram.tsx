"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getUserDetails } from "@/lib/web3/activation";
import { getLevelIncome } from "@/lib/web3/rewards";
import Link from "next/link";

export default function ReferralProgram() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [copied, setCopied] = useState(false);
  const [referralData, setReferralData] = useState({
    totalReferrals: 0,
    levelIncome: "0"
  });

  const referralLink = account 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/ref/${account}`
    : "Connect wallet to get your link";

  useEffect(() => {
    async function fetchData() {
      if (!account || !isConnected || !isCorrectChain) return;

      try {
        const [userData, income] = await Promise.all([
          getUserDetails(account),
          getLevelIncome(account)
        ]);

        setReferralData({
          totalReferrals: parseInt(userData.totalDirectReferrals),
          levelIncome: income
        });
      } catch (error) {
        console.error("Failed to fetch referral data:", error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  const copyLink = () => {
    if (!account) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="px-4 mb-8">
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-orbitron font-bold text-purple-400">
              Referral Program
            </h3>
            <p className="text-sm text-gray-400">Earn 5% from referrals</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <i className="fas fa-users text-purple-400"></i>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{referralData.totalReferrals}</div>
            <div className="text-xs text-gray-400">Total Refs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">
              {parseFloat(referralData.levelIncome).toFixed(4)} USDT
            </div>
            <div className="text-xs text-gray-400">Ref Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300">10%</div>
            <div className="text-xs text-gray-400">Level 1</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-3">
              <p className="text-xs text-gray-400 mb-1">Your referral link</p>
              <p className="font-mono text-sm text-gray-300 truncate">{referralLink}</p>
            </div>
            <button
              onClick={copyLink}
              className="bg-purple-500 hover:bg-purple-600 rounded-xl px-4 py-2 text-white text-sm font-medium transition-colors"
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
        </div>

        {copied && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium z-50">
            Referral link copied!
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Link href="/share">
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl py-3 text-white font-medium text-sm">
              <i className="fas fa-share mr-2"></i>Share Link
            </button>
          </Link>
          <Link href="/referral">
            <button className="w-full bg-gray-700 hover:bg-gray-600 rounded-xl py-3 text-gray-300 font-medium text-sm transition-colors">
              <i className="fas fa-chart-bar mr-2"></i>View Stats
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
