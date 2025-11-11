"use client";

import { useWeb3 } from "@/lib/web3/Web3Context";
import { showToast } from "@/lib/toast";

interface WalletInfoProps {
  onShowQR: () => void;
}

export default function WalletInfo({ onShowQR }: WalletInfoProps) {
  const { account, balances, isConnected } = useWeb3();
  
  const walletAddress = account || "Not Connected";
  const displayAddress = account ? `${account.slice(0, 6)}...${account.slice(-6)}` : "Not Connected";

  const copyAddress = () => {
    if (!account) {
      showToast("Please connect your wallet first");
      return;
    }
    navigator.clipboard.writeText(account).then(() => {
      showToast("Wallet address copied to clipboard!");
    });
  };

  const totalBalance = isConnected 
    ? (parseFloat(balances.usdt || '0') + parseFloat(balances.st || '0')).toFixed(2)
    : "0.00";

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Wallet Information</h3>
            <div className="flex items-center space-x-2">
              <i className="fas fa-lock text-yellow-400"></i>
              <span className="text-xs text-yellow-400">Protected</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <i className="fas fa-wallet text-neon-blue"></i>
              <span>Wallet Address</span>
            </label>
            <div className="relative animate-[walletGlow_5s_ease-in-out_infinite] rounded-xl p-4 border border-neon-blue/30">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-orbitron text-neon-blue font-bold text-lg break-all">
                    {displayAddress}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Non-editable • Blockchain Protected</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={copyAddress}
                    className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center hover:bg-neon-blue/30 transition-colors"
                  >
                    <i className="fas fa-copy text-neon-blue"></i>
                  </button>
                  <button
                    onClick={onShowQR}
                    className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center hover:bg-electric-purple/30 transition-colors"
                  >
                    <i className="fas fa-qrcode text-electric-purple"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">USDT</p>
              <p className="font-bold text-green-400">{parseFloat(balances.usdt || '0').toFixed(2)}</p>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">ST Tokens</p>
              <p className="font-bold text-neon-blue">{parseFloat(balances.st).toFixed(2)}</p>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">BNB</p>
              <p className="font-bold text-yellow-400">{parseFloat(balances.bnb).toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
