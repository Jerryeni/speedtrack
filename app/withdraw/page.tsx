"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { claimROI, getRewardSummary } from "@/lib/web3/rewards";
import { showToast } from "@/lib/toast";
import BalanceOverview from "@/components/sections/withdraw/BalanceOverview";
import WithdrawalForm from "@/components/sections/withdraw/WithdrawalForm";
import GasFeeInfo from "@/components/sections/withdraw/GasFeeInfo";
import RecentWithdrawals from "@/components/sections/withdraw/RecentWithdrawals";
import WithdrawConfirmModal from "@/components/modals/WithdrawConfirmModal";
import ProcessingModal from "@/components/modals/ProcessingModal";
import SuccessModal from "@/components/modals/SuccessModal";

export default function WithdrawPage() {
  const { account, isConnected, isCorrectChain, refreshBalances } = useWeb3();
  const [poolBalance, setPoolBalance] = useState(0);
  const [refBalance, setRefBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const totalBalance = poolBalance + refBalance;

  useEffect(() => {
    async function fetchBalances() {
      if (!account || !isConnected || !isCorrectChain) return;

      try {
        const rewardData = await getRewardSummary(account);
        // Available to claim includes both ROI and level income
        setRefBalance(parseFloat(rewardData.availableToClaim));
        // Pool balance would come from pool returns
        setPoolBalance(0); // This would be calculated from completed pools
      } catch (error) {
        console.error("Failed to fetch balances:", error);
      }
    }

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  const handleWithdraw = () => {
    if (withdrawAmount < 10) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setShowProcessing(true);

    try {
      showToast("Processing withdrawal...", "info");
      const tx = await claimROI();
      await tx.wait();
      
      setTxHash(tx.hash);
      setShowProcessing(false);
      setShowSuccess(true);
      setWithdrawAmount(0);
      await refreshBalances();
      showToast("Withdrawal successful!");
    } catch (error: any) {
      setShowProcessing(false);
      showToast(error.message || "Failed to withdraw");
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <header className="relative z-50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Withdraw</h1>
              <p className="text-xs text-gray-400">Access Your Earnings</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs text-gray-400">Available</p>
              <p className="text-sm font-bold text-neon-blue">${totalBalance.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <i className="fas fa-wallet text-neon-blue"></i>
            </div>
          </div>
        </div>
      </header>

      <BalanceOverview />
      <WithdrawalForm
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        totalBalance={totalBalance}
        poolBalance={poolBalance}
        refBalance={refBalance}
        onWithdraw={handleWithdraw}
      />
      <GasFeeInfo />
      <RecentWithdrawals />

      <WithdrawConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        amount={withdrawAmount}
      />

      <ProcessingModal isOpen={showProcessing} />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        amount={withdrawAmount}
        txHash={txHash}
      />
    </main>
  );
}
