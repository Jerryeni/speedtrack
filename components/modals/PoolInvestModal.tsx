"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { investInPool } from "@/lib/web3/pools";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { showToast } from "@/lib/toast";

interface PoolInvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  poolNumber: number;
  minAmount?: number;
  maxAmount?: number;
}

export default function PoolInvestModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  poolNumber,
  minAmount = 10,
  maxAmount = 500
}: PoolInvestModalProps) {
  const { account, balances, refreshBalances } = useWeb3();
  const [amount, setAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      showToast("Please connect your wallet first");
      return;
    }

    const investAmount = parseFloat(amount);
    if (isNaN(investAmount) || investAmount < minAmount || investAmount > maxAmount) {
      showToast(`Please enter an amount between ${minAmount} and ${maxAmount} USDT`);
      return;
    }

    if (investAmount > parseFloat(balances.usdt)) {
      showToast("Insufficient USDT balance");
      return;
    }

    try {
      setIsInvesting(true);
      showToast("Processing investment...");
      
      const tx = await investInPool(amount, account);
      await tx.wait();
      
      showToast("Investment successful!");
      await refreshBalances();
      onSuccess();
      onClose();
      setAmount("");
    } catch (error: any) {
      showToast(error.message || "Failed to invest in pool");
    } finally {
      setIsInvesting(false);
    }
  };

  const handleMaxClick = () => {
    const maxInvestable = Math.min(parseFloat(balances.usdt), maxAmount);
    setAmount(maxInvestable.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center">
            <i className="fas fa-swimming-pool text-2xl text-white"></i>
          </div>
          <h2 className="text-2xl font-orbitron font-bold text-neon-blue mb-2">
            Invest in Pool #{poolNumber}
          </h2>
          <p className="text-sm text-gray-400">
            Join the racing pool and earn rewards
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Your USDT Balance</span>
            <span className="text-sm font-bold text-green-400">
              {parseFloat(balances.usdt).toFixed(2)} USDT
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Investment Range</span>
            <span className="text-sm font-bold text-neon-blue">
              {minAmount} - {maxAmount} USDT
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Investment Amount (USDT)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-20 text-white focus:outline-none focus:border-neon-blue"
                placeholder={`${minAmount} - ${maxAmount}`}
                disabled={isInvesting}
                step="0.01"
                min={minAmount}
                max={maxAmount}
              />
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neon-blue text-sm font-bold hover:text-electric-purple"
                disabled={isInvesting}
              >
                MAX
              </button>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
            <p className="text-xs text-blue-400">
              <i className="fas fa-info-circle mr-2"></i>
              You will receive 2X returns when the pool completes
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isInvesting}
              className="flex-1 bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isInvesting}
              className="flex-1"
            >
              {isInvesting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Investing...
                </>
              ) : (
                <>
                  <i className="fas fa-rocket mr-2"></i>
                  Invest Now
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
