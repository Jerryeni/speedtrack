"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getReferralStats, getNetworkLevels } from "@/lib/web3/referrals";
import ReferralOverview from "@/components/sections/referral/ReferralOverview";
import ReferralLink from "@/components/sections/referral/ReferralLink";
import CommissionStructure from "@/components/sections/referral/CommissionStructure";
import ReferralTree from "@/components/sections/referral/ReferralTree";
import EarningsChart from "@/components/sections/referral/EarningsChart";
import RecentActivity from "@/components/sections/referral/RecentActivity";
import RewardsProgram from "@/components/sections/referral/RewardsProgram";
import TeamStatistics from "@/components/sections/referral/TeamStatistics";
import ReferralTools from "@/components/sections/referral/ReferralTools";
import BottomNav from "@/components/layout/BottomNav";

export default function ReferralPage() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [referralStats, setReferralStats] = useState<any>(null);
  const [networkLevels, setNetworkLevels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReferralData() {
      if (!account || !isConnected) {
        setIsLoading(false);
        return;
      }

      try {
        const [stats, levels] = await Promise.all([
          getReferralStats(account),
          getNetworkLevels(account)
        ]);

        setReferralStats(stats);
        setNetworkLevels(levels);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReferralData();
    const interval = setInterval(fetchReferralData, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  if (!isConnected) {
    return (
      <main className="min-h-screen pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <i className="fas fa-wallet text-yellow-400 text-3xl"></i>
          </div>
          <h2 className="text-xl font-orbitron font-bold text-yellow-400 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400">
            Please connect your wallet to view your referral center
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="relative z-50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Referral Center</h1>
              <p className="text-xs text-gray-400">Build Your Racing Team</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center">
              <i className="fas fa-bell text-electric-purple text-sm"></i>
            </div>
            <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <i className="fas fa-share-alt text-neon-blue text-sm"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Wrong Network Warning */}
      {!isCorrectChain && (
        <div className="px-4 mb-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-exclamation-triangle text-red-400 text-xl"></i>
              <div>
                <p className="text-sm font-medium text-red-400">Wrong Network</p>
                <p className="text-xs text-gray-400 mt-1">
                  Please switch to the correct network to view your referral data
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ReferralOverview stats={referralStats} isLoading={isLoading} />
      <ReferralLink 
        referralLink={referralStats?.referralLink}
        shortLink={referralStats?.shortLink}
        referralCode={referralStats?.referralCode}
        isLoading={isLoading}
      />
      <CommissionStructure />
      <ReferralTree levels={networkLevels} isLoading={isLoading} />
      <EarningsChart />
      <RecentActivity />
      <RewardsProgram />
      <TeamStatistics stats={referralStats} isLoading={isLoading} />
      <ReferralTools />
      
      <BottomNav />
    </main>
  );
}
