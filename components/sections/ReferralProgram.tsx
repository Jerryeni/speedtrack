"use client";

import { useState } from "react";

export default function ReferralProgram() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://racepool.io/ref/abc123xyz";

  const copyLink = () => {
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
            <div className="text-2xl font-bold text-purple-400">12</div>
            <div className="text-xs text-gray-400">Total Refs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">0.03 ETH</div>
            <div className="text-xs text-gray-400">Ref Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300">5%</div>
            <div className="text-xs text-gray-400">Commission</div>
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
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl py-3 text-white font-medium text-sm">
            <i className="fas fa-share mr-2"></i>Share Link
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 rounded-xl py-3 text-gray-300 font-medium text-sm transition-colors">
            <i className="fas fa-chart-bar mr-2"></i>View Stats
          </button>
        </div>
      </div>
    </section>
  );
}
