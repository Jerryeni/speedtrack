"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { checkAccountActivation, getUserDetails } from "@/lib/web3/activation";
import { getRewardSummary } from "@/lib/web3/rewards";
import { getRecentActions, formatActionType, formatTimestamp } from "@/lib/web3/transactions";
import { NETWORK_CONFIG } from "@/lib/web3/config";
import DashboardHeader from "@/components/layout/DashboardHeader";
import BottomNav from "@/components/layout/BottomNav";
import WalletStatus from "@/components/sections/WalletStatus";
import PoolProgress from "@/components/sections/PoolProgress";
import DailyRewardTimer from "@/components/sections/DailyRewardTimer";
import ReferralProgram from "@/components/sections/ReferralProgram";
import StatCard from "@/components/ui/StatCard";
import ActivationModal from "@/components/modals/ActivationModal";
import PoolInvestModal from "@/components/modals/PoolInvestModal";
import Button from "@/components/ui/Button";
import Link from "next/link";
import FlowGuard from "@/components/guards/FlowGuard";

export default function DashboardPage() {
  return (
    <FlowGuard requireComplete={true}>
      <DashboardContent />
    </FlowGuard>
  );
}

function DashboardContent() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [isActivated, setIsActivated] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [currentPool, setCurrentPool] = useState(1);
  const [userData, setUserData] = useState<any>(null);
  const [rewardData, setRewardData] = useState<any>(null);
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!account || !isConnected || !isCorrectChain) return;

      try {
        setTxLoading(true);
        const [activated, userDetails, rewards, actions] = await Promise.all([
          checkAccountActivation(account),
          getUserDetails(account).catch(() => null),
          getRewardSummary(account).catch(() => null),
          getRecentActions(account).catch(() => [])
        ]);

        setIsActivated(activated);
        setUserData(userDetails);
        setRewardData(rewards);
        setRecentActions(actions.slice(0, 5));
        setCurrentPool(1); // Default to pool 1 for now

        // CRITICAL: Force activation modal for non-activated users
        if (!activated) {
          setShowActivationModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setTxLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  const handleActivationSuccess = () => {
    setIsActivated(true);
    setShowActivationModal(false);
  };
  // Block dashboard content for non-activated users
  if (isConnected && isCorrectChain && !isActivated) {
    return (
      <main className="min-h-screen pb-20">
        <DashboardHeader />

        <section className="px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center animate-pulse">
              <i className="fas fa-lock text-white text-4xl"></i>
            </div>
            <h2 className="text-2xl font-orbitron font-bold text-yellow-400 mb-4">
              Account Activation Required
            </h2>
            <p className="text-gray-400 mb-6">
              You need to activate your account before accessing the dashboard and other features.
            </p>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
              <h3 className="font-semibold mb-4">Activation Benefits:</h3>
              <ul className="text-left space-y-2 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-400"></i>
                  <span>Access to pool investments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-400"></i>
                  <span>Trade ST tokens</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-400"></i>
                  <span>Earn daily rewards (0.5%)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-400"></i>
                  <span>Referral commissions (up to 10 levels)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-400"></i>
                  <span>Spin wheel credits</span>
                </li>
              </ul>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-400">
                <i className="fas fa-info-circle mr-2"></i>
                Activation fee: 10 USDT (one-time payment)
              </p>
            </div>
          </div>
        </section>

        <BottomNav />

        <ActivationModal
          isOpen={showActivationModal}
          onClose={() => setShowActivationModal(false)}
          onSuccess={handleActivationSuccess}
          isRequired={true}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <DashboardHeader />

      <WalletStatus />

      <PoolProgress />

      <section className="px-4 mb-8">
        <h3 className="text-lg font-orbitron font-bold mb-4">Key Statistics</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <StatCard
            layout="box"
            icon="fa-swimming-pool"
            color="text-neon-blue"
            value={`Pool #${currentPool}`}
            label="Current Pool"
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
            value={`${parseFloat(userData?.investedAmount || '0').toFixed(2)} USDT`}
            label="Total Investment"
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
            <div className="text-2xl font-bold text-green-400 mb-1">
              {parseFloat(rewardData?.totalEarned || '0').toFixed(4)} USDT
            </div>
            <div className="text-xs text-gray-400">Total Rewards</div>
            <div className="mt-3 flex items-center space-x-2">
              <div className="text-xs text-green-400">
                Today: +{parseFloat(rewardData?.dailyReward || '0').toFixed(4)}
              </div>
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

      {isConnected && isCorrectChain && (
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-orbitron font-bold">Recent Activity</h3>
            <Link href="/transactions">
              <button className="text-electric-purple text-sm font-medium">View All</button>
            </Link>
          </div>

          <div className="space-y-3">
            {txLoading ? (
              <div className="text-center text-gray-400 py-4">Loading activity...</div>
            ) : recentActions.length === 0 ? (
              <div className="text-center text-gray-400 py-4">No activity yet</div>
            ) : (
              recentActions.map((action, index) => {
                const style = formatActionType(action.action);
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center`}>
                          <i className={`fas ${style.icon} ${style.color}`}></i>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{style.title}</p>
                          <p className="text-xs text-gray-400">{formatTimestamp(action.timestamp)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${style.color}`}>
                          {parseFloat(action.amount).toFixed(4)} USDT
                        </p>
                        {action.poolIndex > 0 && (
                          <p className="text-xs text-gray-400">Pool #{action.poolIndex}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      <ReferralProgram />

      {isConnected && isCorrectChain && isActivated && (
        <section className="px-4 mb-8">
          <Button
            onClick={() => setShowInvestModal(true)}
            className="w-full py-4"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Invest in Current Pool
          </Button>
        </section>
      )}

      <BottomNav />

      {/* Only show activation modal if not already shown in blocked state */}
      {isActivated && (
        <ActivationModal
          isOpen={showActivationModal}
          onClose={() => setShowActivationModal(false)}
          onSuccess={handleActivationSuccess}
          isRequired={false}
        />
      )}

      <PoolInvestModal
        isOpen={showInvestModal}
        onClose={() => setShowInvestModal(false)}
        onSuccess={() => {
          setShowInvestModal(false);
        }}
        poolNumber={currentPool}
        minAmount={currentPool === 1 ? 10 : 10}
        maxAmount={currentPool === 1 ? 50 : 500}
      />
    </main>
  );
}
