"use client";

import { useWeb3 } from "@/lib/web3/Web3Context";
import { NETWORK_CONFIG } from "@/lib/web3/config";

interface ConnectionModalProps {
  isOpen: boolean;
  walletName: string;
  onCancel: () => void;
}

export default function ConnectionModal({
  isOpen,
  walletName,
  onCancel,
}: ConnectionModalProps) {
  const { isCorrectChain } = useWeb3();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-6 w-full max-w-sm border border-gray-700">
        <div className="text-center">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple p-1 animate-pulse-custom">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                <i className="fas fa-spinner text-2xl text-neon-blue animate-spin"></i>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-orbitron font-bold mb-2">
            Connecting to {walletName}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Please confirm the connection in your wallet
            <span className="inline-block animate-[dots_1.5s_infinite]"></span>
          </p>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Connection Speed</span>
                <span className="text-xs text-neon-blue font-semibold">Fast</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full racing-track"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-custom"></div>
                <span className="text-gray-400">Network: Ethereum Mainnet</span>
              </div>
              <div className="text-neon-blue">Active</div>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="mt-6 w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-gray-300 font-medium transition-colors"
          >
            Cancel Connection
          </button>
        </div>
      </div>
    </div>
  );
}
