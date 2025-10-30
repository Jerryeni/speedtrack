"use client";

import { showToast } from "@/lib/toast";

interface WithdrawalFormProps {
  withdrawAmount: number;
  setWithdrawAmount: (amount: number) => void;
  totalBalance: number;
  poolBalance: number;
  refBalance: number;
  onWithdraw: () => void;
}

export default function WithdrawalForm({
  withdrawAmount,
  setWithdrawAmount,
  totalBalance,
  poolBalance,
  refBalance,
  onWithdraw,
}: WithdrawalFormProps) {
  const quickAmounts = [100, 500, 1000, 5000];
  const colors = ["neon-blue", "electric-purple", "green-400", "yellow-400"];

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setWithdrawAmount(Math.min(amount, totalBalance));
  };

  const setMaxAmount = () => {
    setWithdrawAmount(totalBalance);
    showToast("Maximum amount set");
  };

  const setQuickAmount = (amount: number) => {
    setWithdrawAmount(amount);
  };

  const fromPool = Math.min(withdrawAmount, poolBalance);
  const fromRef = Math.max(0, withdrawAmount - poolBalance);

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Withdrawal Amount</h3>
            <div className="flex items-center space-x-2">
              <i className="fas fa-rocket text-electric-purple"></i>
              <span className="text-xs text-electric-purple">Fast Transfer</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-300 mb-3 block">
              Enter Amount (USD)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-blue font-orbitron font-bold text-xl">
                $
              </div>
              <input
                type="number"
                value={withdrawAmount || ""}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-600 rounded-xl pl-10 pr-20 py-4 text-2xl font-orbitron font-bold text-white focus:border-neon-blue focus:outline-none focus:shadow-[0_0_25px_rgba(0,255,255,0.4)] focus:scale-[1.02] transition-all"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={setMaxAmount}
                  className="bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-lg text-sm font-medium hover:bg-neon-blue/30 transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-gray-400">Minimum: $10.00</span>
              <span className="text-gray-400">Maximum: ${totalBalance.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {quickAmounts.map((amount, index) => (
              <button
                key={amount}
                onClick={() => setQuickAmount(amount)}
                className="bg-gray-800 border border-gray-600 rounded-xl py-3 text-center hover:border-neon-blue transition-colors animate-[quickAmountGlow_4s_ease-in-out_infinite]"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <div className={`text-lg font-orbitron font-bold text-${colors[index]}`}>
                  ${amount >= 1000 ? `${amount / 1000}K` : amount}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-white mb-3">Withdrawal Breakdown</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">From Pool Balance</span>
                <span className="text-sm font-medium text-neon-blue">${fromPool.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">From Referral Balance</span>
                <span className="text-sm font-medium text-electric-purple">
                  ${fromRef.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Total Withdrawal</span>
                  <span className="text-sm font-bold text-green-400">
                    ${withdrawAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onWithdraw}
            disabled={withdrawAmount < 10}
            className={`w-full bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
              withdrawAmount >= 10 ? "animate-[withdrawReady_2s_ease-in-out_infinite]" : ""
            }`}
          >
            <i className="fas fa-paper-plane mr-2"></i>
            Initiate Withdrawal
          </button>
        </div>
      </div>
    </section>
  );
}
