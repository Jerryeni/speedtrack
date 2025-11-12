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
import DirectReferralsList from "@/components/sections/DirectReferralsList";
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
        const { getDirectMembers, getTotalTeamCount } = await import('@/lib/web3/teamStats');
        
        const [stats, levels, directMembers, totalTeam] = await Promise.all([
          getReferralStats(account),
          getNetworkLevels(account),
          getDirectMembers(),
          getTotalTeamCount()
        ]);

        // Enhance stats with new data
        const enhancedStats = {
          ...stats,
          directReferrals: directMembers.length,
          totalReferrals: totalTeam,
          activeMembers: directMembers.filter(m => m.isActivated).length,
          teamVolume: directMembers.reduce((sum, m) => sum + parseFloat(m.investedAmount), 0).toFixed(2)
        };

        setReferralStats(enhancedStats);
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
      <header className="relative z-50 px-2 sm:px-4 py-3 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <button 
              onClick={() => window.history.back()}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <i className="fas fa-arrow-left text-neon-blue text-xs sm:text-sm"></i>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-xl font-orbitron font-bold text-neon-blue truncate">Referral Center</h1>
              <p className="text-xs text-gray-400 hidden xs:block">Build Your Racing Team</p>
            </div>
          </div>
          
        </div>
      </header>

      {/* Wrong Network Warning */}
      {!isCorrectChain && (
        <div className="px-2 sm:px-4 mb-3 sm:mb-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <i className="fas fa-exclamation-triangle text-red-400 text-base sm:text-xl flex-shrink-0"></i>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-red-400">Wrong Network</p>
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
      {/* <ReferralTree levels={networkLevels} isLoading={isLoading} /> */}
      <EarningsChart />
      {/* <RecentActivity /> */}
      {/* <RewardsProgram /> */}
      <TeamStatistics stats={referralStats} isLoading={isLoading} />
      <DirectReferralsList />
      {/* <ReferralTools /> */}
      
      <BottomNav />
    </main>
  );
}
