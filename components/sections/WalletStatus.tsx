"use client";

import { useWeb3 } from "@/lib/web3/Web3Context";

export default function WalletStatus() {
  const { account, balances, isConnected, isCorrectChain } = useWeb3();

  if (!isConnected || !isCorrectChain) {
    return (
      <section className="px-4 mb-6">
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-yellow-400"></i>
              </div>
              <div>
                <p className="font-semibold text-yellow-400">Wallet Not Connected</p>
                <p className="text-xs text-gray-400">Please connect your wallet to continue</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <i className="fas fa-wallet text-green-400"></i>
            </div>
            <div>
              <p className="font-semibold text-green-400">Wallet Connected</p>
              <p className="text-xs text-gray-400 font-mono">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-white">{parseFloat(balances.bnb || '0').toFixed(4)} BNB</p>
            <p className="text-xs text-gray-400">
              {(() => {
                const val = parseFloat(balances.usdt || '0');
                if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
                if (val >= 1000) return `${(val / 1000).toFixed(2)}K`;
                return val.toFixed(2);
              })()} USDT
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
