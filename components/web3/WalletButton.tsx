"use client";

import { useWeb3 } from "@/lib/web3/Web3Context";
import Button from "@/components/ui/Button";

export default function WalletButton() {
  const { account, isConnected, isCorrectChain, connect, switchNetwork, isLoading } = useWeb3();

  if (isLoading) {
    return (
      <Button className="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm" disabled>
        <i className="fas fa-spinner fa-spin md:mr-2"></i>
        <span className="hidden md:inline">Loading...</span>
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button onClick={connect} className="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm">
        <i className="fas fa-wallet md:mr-2"></i>
        <span className="hidden sm:inline">Connect</span>
      </Button>
    );
  }

  if (!isCorrectChain) {
    return (
      <Button onClick={switchNetwork} className="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm bg-yellow-500 hover:bg-yellow-600">
        <i className="fas fa-exclamation-triangle md:mr-2"></i>
        <span className="hidden sm:inline">Switch</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center">
      <div className="px-2 md:px-3 py-2 bg-gray-800 rounded-xl text-xs md:text-sm min-h-[44px] flex items-center">
        <i className="fas fa-circle text-green-400 mr-1 md:mr-2 text-[8px]"></i>
        <span className="hidden sm:inline">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
        <span className="sm:hidden">{account?.slice(0, 4)}...{account?.slice(-2)}</span>
      </div>
    </div>
  );
}
