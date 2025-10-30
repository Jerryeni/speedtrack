"use client";

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

      <ReferralOverview />
      <ReferralLink />
      <CommissionStructure />
      <ReferralTree />
      <EarningsChart />
      <RecentActivity />
      <RewardsProgram />
      <TeamStatistics />
      <ReferralTools />
      
      <BottomNav />
    </main>
  );
}
