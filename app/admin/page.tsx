"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getSpeedTrackReadOnly } from "@/lib/web3/contracts";
import { usePlatformStats } from "@/lib/web3/hooks/usePlatformStats";
import { ethers } from "ethers";
import Button from "@/components/ui/Button";
import { showToast } from "@/lib/toast";
import UserManagement from "@/components/admin/UserManagement";
import PoolManagement from "@/components/admin/PoolManagement";
import AdminActionsComponent from "@/components/admin/AdminActions";

export default function AdminPage() {
  const router = useRouter();
  const { account, isConnected, isCorrectChain } = useWeb3();
  const { stats: platformStats, isLoading: statsLoading, refresh: refreshStats } = usePlatformStats();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [constants, setConstants] = useState({
    dailyROI: 0,
    levelIncome: 0,
    capitalReturn: 0,
    reserve: 0,
    reward: 0,
    stLiquidity: 0,
  });

  useEffect(() => {
    async function checkAdmin() {
      if (!account || !isConnected || !isCorrectChain) {
        setIsLoading(false);
        return;
      }

      try {
        const speedTrack = await getSpeedTrackReadOnly();
        const owner = await speedTrack.owner();
        
        if (owner.toLowerCase() === account.toLowerCase()) {
          setIsAdmin(true);
          await fetchAdminData();
        } else {
          setIsAdmin(false);
          showToast("Access denied: Admin only", "error");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdmin();
  }, [account, isConnected, isCorrectChain, router]);

  async function fetchAdminData() {
    try {
      const speedTrack = await getSpeedTrackReadOnly();
      
      // Get constants
      const [dailyROI, levelIncome, capitalReturn, reserve, reward, stLiquidity] = await Promise.all([
        speedTrack.DAILY_ROI_PCT(),
        speedTrack.LEVEL_INCOME_PCT(),
        speedTrack.CAPITAL_RETURN_PCT(),
        speedTrack.RESERVE_PCT(),
        speedTrack.REWARD_PCT(),
        speedTrack.ST_LIQUIDITY_PCT()
      ]);

      setConstants({
        dailyROI: Number(dailyROI),
        levelIncome: Number(levelIncome),
        capitalReturn: Number(capitalReturn),
        reserve: Number(reserve),
        reward: Number(reward),
        stLiquidity: Number(stLiquidity),
      });

    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-neon-blue mb-4"></i>
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </main>
    );
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-wallet text-4xl text-yellow-400 mb-4"></i>
          <h2 className="text-xl font-bold mb-2">Connect Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to access admin panel</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-lock text-4xl text-red-400 mb-4"></i>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">Admin access required</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="relative z-50 px-4 py-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Admin Panel</h1>
              <p className="text-xs text-gray-400">System Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <i className="fas fa-shield-alt text-green-400 text-sm"></i>
            </div>
          </div>
        </div>
      </header>

      {/* System Overview */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-orbitron font-bold">System Overview</h2>
          <button
            onClick={() => refreshStats()}
            disabled={statsLoading}
            className="text-sm text-neon-blue hover:text-electric-purple transition-colors disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt mr-1 ${statsLoading ? 'fa-spin' : ''}`}></i>
            Refresh
          </button>
        </div>

        {statsLoading && !platformStats ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-3xl text-neon-blue mb-2"></i>
            <p className="text-sm text-gray-400">Loading statistics from blockchain...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-neon-blue/20 to-neon-blue/5 rounded-2xl p-4 border border-neon-blue/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
                    <i className="fas fa-users text-neon-blue"></i>
                  </div>
                  <div className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">
                    Total
                  </div>
                </div>
                <p className="text-2xl font-bold text-neon-blue">{platformStats?.totalUsers || 0}</p>
                <p className="text-xs text-gray-400">Total Users</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-4 border border-green-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <i className="fas fa-coins text-green-400"></i>
                  </div>
                  <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Invested
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {parseFloat(platformStats?.totalInvested || '0').toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">Total Invested (USDT)</p>
              </div>

              <div className="bg-gradient-to-br from-electric-purple/20 to-electric-purple/5 rounded-2xl p-4 border border-electric-purple/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center">
                    <i className="fas fa-chart-line text-electric-purple"></i>
                  </div>
                  <div className="text-xs bg-electric-purple/20 text-electric-purple px-2 py-1 rounded-full">
                    ROI
                  </div>
                </div>
                <p className="text-2xl font-bold text-electric-purple">
                  {parseFloat(platformStats?.totalROIPaid || '0').toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">Total ROI Paid (USDT)</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-2xl p-4 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <i className="fas fa-network-wired text-yellow-400"></i>
                  </div>
                  <div className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    Referral
                  </div>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {parseFloat(platformStats?.totalLevelIncome || '0').toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">Level Income (USDT)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-2xl p-4 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <i className="fas fa-undo text-cyan-400"></i>
                  </div>
                  <div className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
                    Capital
                  </div>
                </div>
                <p className="text-2xl font-bold text-cyan-400">
                  {parseFloat(platformStats?.totalCapitalReturned || '0').toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">Capital Returned (USDT)</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-2xl p-4 border border-pink-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <i className="fas fa-gift text-pink-400"></i>
                  </div>
                  <div className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full">
                    ST Tokens
                  </div>
                </div>
                <p className="text-2xl font-bold text-pink-400">
                  {parseFloat(platformStats?.totalSTDistributed || '0').toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">ST Distributed (USDT)</p>
              </div>
            </div>

            {platformStats && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  <i className="fas fa-clock mr-1"></i>
                  Last updated: {new Date(platformStats.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Contract Constants */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-orbitron font-bold mb-4">Contract Configuration</h2>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-sm text-gray-400">Daily ROI</span>
              <span className="text-white font-semibold">{(constants.dailyROI / 100).toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-sm text-gray-400">Level Income</span>
              <span className="text-white font-semibold">{constants.levelIncome}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-sm text-gray-400">Capital Return</span>
              <span className="text-white font-semibold">{constants.capitalReturn}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-sm text-gray-400">Reserve</span>
              <span className="text-white font-semibold">{constants.reserve}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-sm text-gray-400">Reward</span>
              <span className="text-white font-semibold">{constants.reward}%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-400">ST Liquidity</span>
              <span className="text-white font-semibold">{constants.stLiquidity}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Activation Levels */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-orbitron font-bold mb-4">Activation Levels</h2>
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((level) => (
            <ActivationLevelCard key={level} level={level} />
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 mb-6">
        <AdminTabs />
      </section>

      {/* Contract Info */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-orbitron font-bold mb-4">Contract Information</h2>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Network</p>
              <p className="text-white font-mono">BSC Testnet (Chain ID: 97)</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Admin Address</p>
              <p className="text-white font-mono text-xs break-all">{account}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ActivationLevelCard({ level }: { level: number }) {
  const [fee, setFee] = useState("0");
  const [maxInv, setMaxInv] = useState("0");

  useEffect(() => {
    async function fetchLevelData() {
      try {
        const speedTrack = await getSpeedTrackReadOnly();
        const [feeData, maxInvData] = await Promise.all([
          speedTrack.activationFees(level),
          speedTrack.maxInvestments(level)
        ]);
        setFee(ethers.formatUnits(feeData, 6));
        setMaxInv(ethers.formatUnits(maxInvData, 6));
      } catch (error) {
        console.error(`Error fetching level ${level} data:`, error);
      }
    }
    fetchLevelData();
  }, [level]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">Level {level}</p>
          <p className="text-sm text-gray-400">Max Investment: {parseFloat(maxInv).toFixed(0)} USDT</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-neon-blue">{parseFloat(fee).toFixed(0)} USDT</p>
          <p className="text-xs text-gray-400">Activation Fee</p>
        </div>
      </div>
    </div>
  );
}

function AdminTabs() {
  const [activeTab, setActiveTab] = useState<"users" | "pools" | "actions">("users");

  return (
    <div>
      <div className="flex bg-gray-800 rounded-xl p-1 mb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            activeTab === "users"
              ? "bg-gradient-to-r from-neon-blue to-electric-purple text-white"
              : "text-gray-400"
          }`}
        >
          <i className="fas fa-users mr-2"></i>
          Users
        </button>
        <button
          onClick={() => setActiveTab("pools")}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            activeTab === "pools"
              ? "bg-gradient-to-r from-neon-blue to-electric-purple text-white"
              : "text-gray-400"
          }`}
        >
          <i className="fas fa-swimming-pool mr-2"></i>
          Pools
        </button>
        <button
          onClick={() => setActiveTab("actions")}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            activeTab === "actions"
              ? "bg-gradient-to-r from-neon-blue to-electric-purple text-white"
              : "text-gray-400"
          }`}
        >
          <i className="fas fa-cog mr-2"></i>
          Actions
        </button>
      </div>

      {activeTab === "users" && <UserManagement />}
      {activeTab === "pools" && <PoolManagement />}
      {activeTab === "actions" && <AdminActionsComponent />}
    </div>
  );
}


