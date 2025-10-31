"use client";

import { useWeb3 } from "@/lib/web3/Web3Context";
import Button from "@/components/ui/Button";

export default function WalletButton() {
  const { account, isConnected, isCorrectChain, connect, switchNetwork, isLoading } = useWeb3();

  if (isLoading) {
    return (
      <Button className="px-4 py-2 rounded-xl text-sm" disabled>
        <i className="fas fa-spinner fa-spin mr-2"></i>
        Loading...
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button onClick={connect} className="px-4 py-2 rounded-xl text-sm">
        <i className="fas fa-wallet mr-2"></i>
        Connect Wallet
      </Button>
    );
  }

  if (!isCorrectChain) {
    return (
      <Button onClick={switchNetwork} className="px-4 py-2 rounded-xl text-sm bg-yellow-500 hover:bg-yellow-600">
        <i className="fas fa-exclamation-triangle mr-2"></i>
        Switch Network
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="px-3 py-2 bg-gray-800 rounded-xl text-sm">
        <i className="fas fa-circle text-green-400 mr-2"></i>
        {account?.slice(0, 6)}...{account?.slice(-4)}
      </div>
    </div>
  );
}
