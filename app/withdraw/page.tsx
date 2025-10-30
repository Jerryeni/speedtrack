"use client";

import { useState } from "react";
import BalanceOverview from "@/components/sections/withdraw/BalanceOverview";
import WithdrawalForm from "@/components/sections/withdraw/WithdrawalForm";
import GasFeeInfo from "@/components/sections/withdraw/GasFeeInfo";
import RecentWithdrawals from "@/components/sections/withdraw/RecentWithdrawals";
import WithdrawConfirmModal from "@/components/modals/WithdrawConfirmModal";
import ProcessingModal from "@/components/modals/ProcessingModal";
import SuccessModal from "@/components/modals/SuccessModal";

export default function WithdrawPage() {
  const [poolBalance] = useState(8950.30);
  const [refBalance] = useState(3530.20);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const totalBalance = poolBalance + refBalance;

  const handleWithdraw = () => {
    if (withdrawAmount < 10) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowProcessing(true);

    setTimeout(() => {
      setShowProcessing(false);
      setTxHash("0x9a8b7c6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b");
      setShowSuccess(true);
      setWithdrawAmount(0);
    }, 5000);
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

      <BalanceOverview poolBalance={poolBalance} refBalance={refBalance} />
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
