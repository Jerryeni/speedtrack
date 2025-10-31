"use client";

import { useWeb3 } from "@/lib/web3/Web3Context";

interface BalanceDisplayProps {
  showAll?: boolean;
  className?: string;
}

export default function BalanceDisplay({ showAll = false, className = "" }: BalanceDisplayProps) {
  const { balances, isConnected, isCorrectChain } = useWeb3();

  if (!isConnected || !isCorrectChain) {
    return null;
  }

  if (showAll) {
    return (
      <div className={`grid grid-cols-3 gap-4 ${className}`}>
        <div className="text-center p-3 bg-gray-800/50 rounded-xl">
          <p className="text-xs text-gray-400 mb-1">BNB</p>
          <p className="font-bold text-yellow-400">{parseFloat(balances.bnb).toFixed(4)}</p>
        </div>
        <div className="text-center p-3 bg-gray-800/50 rounded-xl">
          <p className="text-xs text-gray-400 mb-1">USDT</p>
          <p className="font-bold text-green-400">{parseFloat(balances.usdt).toFixed(2)}</p>
        </div>
        <div className="text-center p-3 bg-gray-800/50 rounded-xl">
          <p className="text-xs text-gray-400 mb-1">ST</p>
          <p className="font-bold text-neon-blue">{parseFloat(balances.st).toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 text-sm ${className}`}>
      <div className="flex items-center space-x-1">
        <span className="text-gray-400">USDT:</span>
        <span className="text-green-400 font-semibold">{parseFloat(balances.usdt).toFixed(2)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <span className="text-gray-400">ST:</span>
        <span className="text-neon-blue font-semibold">{parseFloat(balances.st).toFixed(2)}</span>
      </div>
    </div>
  );
}
