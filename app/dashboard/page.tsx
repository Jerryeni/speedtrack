"use client";

import DashboardHeader from "@/components/layout/DashboardHeader";
import BottomNav from "@/components/layout/BottomNav";
import WalletStatus from "@/components/sections/WalletStatus";
import PoolProgress from "@/components/sections/PoolProgress";
import DailyRewardTimer from "@/components/sections/DailyRewardTimer";
import ReferralProgram from "@/components/sections/ReferralProgram";
import StatCard from "@/components/ui/StatCard";
import TransactionCard from "@/components/ui/TransactionCard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen pb-20">
      <DashboardHeader />

      <WalletStatus
        address="0x1234...5678"
        ethBalance="2.45 ETH"
        usdBalance="$4,892.30"
      />

      <PoolProgress
        cycleNumber={247}
        completion={78}
        participants={156}
        totalPool="24.8 ETH"
        timeLeft="2h 34m"
      />

      <section className="px-4 mb-8">
        <h3 className="text-lg font-orbitron font-bold mb-4">Key Statistics</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <StatCard
            layout="box"
            icon="fa-swimming-pool"
            color="text-neon-blue"
            value="Pool #247"
            label="Racing Championship"
            badge="Active"
            badgeColor="bg-green-500/20 text-green-400"
            gradient="from-neon-blue/10"
            border="border-neon-blue/20"
            progress={75}
          />

          <StatCard
            layout="box"
            icon="fa-coins"
            color="text-electric-purple"
            value="0.5 ETH"
            label="$998.50"
            badge="Invested"
            badgeColor="bg-electric-purple/20 text-electric-purple"
            gradient="from-electric-purple/10"
            border="border-electric-purple/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl p-4 border border-green-500/20 animate-[rewardGlow_3s_ease-in-out_infinite_alternate]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <i className="fas fa-trophy text-green-400"></i>
              </div>
              <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Earned
              </div>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">0.0625 ETH</div>
            <div className="text-xs text-gray-400">$124.81</div>
            <div className="mt-3 flex items-center space-x-2">
              <div className="text-xs text-green-400">Today: +0.0025</div>
              <i className="fas fa-chart-line text-green-400 text-xs"></i>
            </div>
          </div>

          <StatCard
            layout="box"
            icon="fa-clock"
            color="text-yellow-400"
            value="0.5%"
            label="Reward Rate"
            badge="Daily"
            badgeColor="bg-yellow-500/20 text-yellow-400"
            gradient="from-yellow-500/10"
            border="border-yellow-500/20"
            progress={50}
          />
        </div>
      </section>

      <DailyRewardTimer />

      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-orbitron font-bold">Recent Transactions</h3>
          <button className="text-electric-purple text-sm font-medium">View All</button>
        </div>

        <div className="space-y-3">
          <TransactionCard
            type="reward"
            title="Daily Reward"
            time="2 hours ago"
            amount="0.0025 ETH"
            usdValue="$4.99"
            txHash="0x1234...5678"
          />
          <TransactionCard
            type="reinvest"
            title="Reinvestment"
            time="1 day ago"
            amount="0.05 ETH"
            usdValue="$99.85"
            txHash="0x9876...4321"
          />
          <TransactionCard
            type="entry"
            title="Pool Entry"
            time="3 days ago"
            amount="0.5 ETH"
            usdValue="$997.00"
            txHash="0x5555...7890"
          />
        </div>
      </section>

      <ReferralProgram />

      <section className="px-4 mb-8">
        <h3 className="text-lg font-orbitron font-bold mb-4">Pool Analytics</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center justify-between mb-3">
              <i className="fas fa-chart-pie text-blue-400"></i>
              <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                24h
              </div>
            </div>
            <div className="text-xl font-bold text-blue-400">+8.2%</div>
            <div className="text-xs text-gray-400">Pool Growth</div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-transparent rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center justify-between mb-3">
              <i className="fas fa-fire text-red-400"></i>
              <div className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                Hot
              </div>
            </div>
            <div className="text-xl font-bold text-red-400">142%</div>
            <div className="text-xs text-gray-400">APY Rate</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Pool Composition</h4>
            <div className="text-xs text-gray-400">Live Data</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-neon-blue"></div>
                <span className="text-sm">Your Investment</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">2.0%</div>
                <div className="text-xs text-gray-400">0.5 ETH</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-electric-purple"></div>
                <span className="text-sm">Other Participants</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">98.0%</div>
                <div className="text-xs text-gray-400">24.3 ETH</div>
              </div>
            </div>
          </div>

          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-blue via-electric-purple to-neon-blue"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
