"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import {
  setReserveWallet,
  setRewardWallet,
  getReserveWallet,
  getRewardWallet,
  distributeVirtualROI,
  emergencyWithdraw,
  transferOwnership,
  getContractConstants,
  getPoolConstants
} from "@/lib/web3/admin";
import Button from "@/components/ui/Button";
import { showToast, showSuccess, showError } from "@/lib/toast";
import { ethers } from "ethers";

export default function AdminActions() {
  const { account } = useWeb3();
  const [activeSection, setActiveSection] = useState<"wallets" | "roi" | "emergency" | "ownership">("wallets");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Wallet Management
  const [reserveWallet, setReserveWalletState] = useState("");
  const [rewardWallet, setRewardWalletState] = useState("");
  const [newReserveWallet, setNewReserveWallet] = useState("");
  const [newRewardWallet, setNewRewardWallet] = useState("");
  
  // ROI Distribution
  const [roiUsers, setRoiUsers] = useState("");
  const [roiAmounts, setRoiAmounts] = useState("");
  
  // Emergency Withdraw
  const [tokenAddress, setTokenAddress] = useState("");
  const [withdrawTo, setWithdrawTo] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  
  // Ownership
  const [newOwner, setNewOwner] = useState("");
  
  // Constants
  const [constants, setConstants] = useState<any>(null);

  useEffect(() => {
    fetchWallets();
    fetchConstants();
  }, []);

  async function fetchWallets() {
    try {
      const [reserve, reward] = await Promise.all([
        getReserveWallet(),
        getRewardWallet()
      ]);
      setReserveWalletState(reserve);
      setRewardWalletState(reward);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  }

  async function fetchConstants() {
    try {
      const [contractConstants, poolConstants] = await Promise.all([
        getContractConstants(),
        getPoolConstants()
      ]);
      setConstants({ ...contractConstants, ...poolConstants });
    } catch (error) {
      console.error("Error fetching constants:", error);
    }
  }

  async function handleSetReserveWallet() {
    if (!newReserveWallet || !ethers.isAddress(newReserveWallet)) {
      showError("Please enter a valid address");
      return;
    }

    try {
      setIsProcessing(true);
      showToast("Setting reserve wallet...", "info");
      const tx = await setReserveWallet(newReserveWallet);
      await tx.wait();
      showSuccess("Reserve wallet updated successfully!");
      await fetchWallets();
      setNewReserveWallet("");
    } catch (error: any) {
      showError(error.message || "Failed to set reserve wallet");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleSetRewardWallet() {
    if (!newRewardWallet || !ethers.isAddress(newRewardWallet)) {
      showError("Please enter a valid address");
      return;
    }

    try {
      setIsProcessing(true);
      showToast("Setting reward wallet...", "info");
      const tx = await setRewardWallet(newRewardWallet);
      await tx.wait();
      showSuccess("Reward wallet updated successfully!");
      await fetchWallets();
      setNewRewardWallet("");
    } catch (error: any) {
      showError(error.message || "Failed to set reward wallet");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDistributeROI() {
    if (!roiUsers || !roiAmounts) {
      showError("Please enter users and amounts");
      return;
    }

    try {
      const users = roiUsers.split(",").map(u => u.trim());
      const amounts = roiAmounts.split(",").map(a => a.trim());

      if (users.length !== amounts.length) {
        showError("Number of users must match number of amounts");
        return;
      }

      setIsProcessing(true);
      showToast("Distributing virtual ROI...", "info");
      const tx = await distributeVirtualROI(users, amounts);
      await tx.wait();
      showSuccess(`Virtual ROI distributed to ${users.length} users!`);
      setRoiUsers("");
      setRoiAmounts("");
    } catch (error: any) {
      showError(error.message || "Failed to distribute ROI");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleEmergencyWithdraw() {
    if (!tokenAddress || !withdrawTo || !withdrawAmount) {
      showError("Please fill all fields");
      return;
    }

    if (!ethers.isAddress(tokenAddress) || !ethers.isAddress(withdrawTo)) {
      showError("Invalid address");
      return;
    }

    const confirmed = confirm(
      `⚠️ EMERGENCY WITHDRAW\n\nAre you sure you want to withdraw ${withdrawAmount} tokens to ${withdrawTo}?\n\nThis action cannot be undone!`
    );

    if (!confirmed) return;

    try {
      setIsProcessing(true);
      showToast("Processing emergency withdraw...", "warning");
      const tx = await emergencyWithdraw(tokenAddress, withdrawTo, withdrawAmount);
      await tx.wait();
      showSuccess("Emergency withdraw completed!");
      setTokenAddress("");
      setWithdrawTo("");
      setWithdrawAmount("");
    } catch (error: any) {
      showError(error.message || "Failed to withdraw");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleTransferOwnership() {
    if (!newOwner || !ethers.isAddress(newOwner)) {
      showError("Please enter a valid address");
      return;
    }

    const confirmed = confirm(
      `⚠️ TRANSFER OWNERSHIP\n\nAre you ABSOLUTELY SURE you want to transfer ownership to:\n${newOwner}\n\nYou will lose all admin access!\n\nThis action CANNOT be undone!`
    );

    if (!confirmed) return;

    const doubleConfirm = confirm(
      "⚠️ FINAL CONFIRMATION\n\nType YES in the next prompt to confirm ownership transfer."
    );

    if (!doubleConfirm) return;

    try {
      setIsProcessing(true);
      showToast("Transferring ownership...", "warning");
      const tx = await transferOwnership(newOwner);
      await tx.wait();
      showSuccess("Ownership transferred successfully!");
      setNewOwner("");
    } catch (error: any) {
      showError(error.message || "Failed to transfer ownership");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveSection("wallets")}
          className={`py-3 px-4 rounded-xl font-semibold transition-all ${
            activeSection === "wallets"
              ? "bg-gradient-to-r from-neon-blue to-electric-purple text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          <i className="fas fa-wallet mr-2"></i>
          Wallets
        </button>
        <button
          onClick={() => setActiveSection("roi")}
          className={`py-3 px-4 rounded-xl font-semibold transition-all ${
            activeSection === "roi"
              ? "bg-gradient-to-r from-neon-blue to-electric-purple text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          <i className="fas fa-coins mr-2"></i>
          ROI
        </button>
        <button
          onClick={() => setActiveSection("emergency")}
          className={`py-3 px-4 rounded-xl font-semibold transition-all ${
            activeSection === "emergency"
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Emergency
        </button>
        <button
          onClick={() => setActiveSection("ownership")}
          className={`py-3 px-4 rounded-xl font-semibold transition-all ${
            activeSection === "ownership"
              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          <i className="fas fa-crown mr-2"></i>
          Ownership
        </button>
      </div>

      {/* Wallet Management */}
      {activeSection === "wallets" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
            <h3 className="font-semibold mb-4">Current Wallets</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Reserve Wallet</p>
                <p className="text-white font-mono text-xs break-all">{reserveWallet}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Reward Wallet</p>
                <p className="text-white font-mono text-xs break-all">{rewardWallet}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
            <h3 className="font-semibold mb-4">Set Reserve Wallet</h3>
            <input
              type="text"
              value={newReserveWallet}
              onChange={(e) => setNewReserveWallet(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm mb-3"
              placeholder="0x..."
              disabled={isProcessing}
            />
            <Button
              onClick={handleSetReserveWallet}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Update Reserve Wallet"}
            </Button>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
            <h3 className="font-semibold mb-4">Set Reward Wallet</h3>
            <input
              type="text"
              value={newRewardWallet}
              onChange={(e) => setNewRewardWallet(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm mb-3"
              placeholder="0x..."
              disabled={isProcessing}
            />
            <Button
              onClick={handleSetRewardWallet}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Update Reward Wallet"}
            </Button>
          </div>
        </div>
      )}

      {/* ROI Distribution */}
      {activeSection === "roi" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
            <h3 className="font-semibold mb-4">Distribute Virtual ROI</h3>
            <p className="text-sm text-gray-400 mb-4">
              Distribute virtual ROI to multiple users at once
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  User Addresses (comma-separated)
                </label>
                <textarea
                  value={roiUsers}
                  onChange={(e) => setRoiUsers(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm"
                  placeholder="0x123..., 0x456..., 0x789..."
                  rows={3}
                  disabled={isProcessing}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Amounts in USDT (comma-separated)
                </label>
                <textarea
                  value={roiAmounts}
                  onChange={(e) => setRoiAmounts(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="10, 20, 30"
                  rows={3}
                  disabled={isProcessing}
                />
              </div>
              
              <Button
                onClick={handleDistributeROI}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? "Distributing..." : "Distribute ROI"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Functions */}
      {activeSection === "emergency" && (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <h4 className="font-semibold text-red-400 mb-2">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Warning
            </h4>
            <p className="text-sm text-gray-300">
              Emergency functions should only be used in critical situations. These actions cannot be undone!
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-red-500/30">
            <h3 className="font-semibold mb-4 text-red-400">Emergency Withdraw</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Token Address</label>
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm"
                  placeholder="0x..."
                  disabled={isProcessing}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Withdraw To</label>
                <input
                  type="text"
                  value={withdrawTo}
                  onChange={(e) => setWithdrawTo(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm"
                  placeholder="0x..."
                  disabled={isProcessing}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                  placeholder="0.00"
                  disabled={isProcessing}
                />
              </div>
              
              <Button
                onClick={handleEmergencyWithdraw}
                disabled={isProcessing}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                {isProcessing ? "Processing..." : "Emergency Withdraw"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ownership Transfer */}
      {activeSection === "ownership" && (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-400 mb-2">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Critical Warning
            </h4>
            <p className="text-sm text-gray-300">
              Transferring ownership will give complete control to the new owner. You will lose all admin access permanently!
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-yellow-500/30">
            <h3 className="font-semibold mb-4 text-yellow-400">Transfer Ownership</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Owner Address</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm"
                  placeholder="0x..."
                  disabled={isProcessing}
                />
              </div>
              
              <Button
                onClick={handleTransferOwnership}
                disabled={isProcessing}
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                {isProcessing ? "Processing..." : "Transfer Ownership"}
              </Button>
            </div>
          </div>

          {constants && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
              <h3 className="font-semibold mb-4">Contract Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Admin Referral Code</span>
                  <span className="text-white font-semibold">{constants.adminReferralCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User ID Range</span>
                  <span className="text-white font-semibold">{constants.minId} - {constants.maxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Initial Pool Size</span>
                  <span className="text-white font-semibold">{parseFloat(constants.initialPoolSize).toFixed(0)} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pool Multiplier</span>
                  <span className="text-white font-semibold">{constants.poolMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Personal Pools Limit</span>
                  <span className="text-white font-semibold">{constants.personalPoolsLimit}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
