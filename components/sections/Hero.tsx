"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { checkAccountActivation } from "@/lib/web3/activation";
import Button from "@/components/ui/Button";

export default function Hero() {
  const router = useRouter();
  const { account, isConnected, isCorrectChain, connect } = useWeb3();
  const [isActivated, setIsActivated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      if (!account || !isConnected || !isCorrectChain) return;
      
      setIsChecking(true);
      try {
        const activated = await checkAccountActivation(account);
        setIsActivated(activated);
      } catch (error) {
        console.error("Failed to check activation:", error);
      } finally {
        setIsChecking(false);
      }
    }

    checkStatus();
  }, [account, isConnected, isCorrectChain]);

  const handleAction = async () => {
    if (!isConnected) {
      await connect();
    } else if (!isCorrectChain) {
      router.push('/wallet');
    } else {
      router.push('/dashboard');
    }
  };

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet & Start Racing";
    if (!isCorrectChain) return "Switch to BSC Testnet";
    if (isChecking) return "Checking Status...";
    if (isActivated) return "Go to Dashboard";
    return "Activate Account";
  };

  const getStatusText = () => {
    if (!isConnected) return "Connect your wallet to begin";
    if (!isCorrectChain) return "Please switch to BSC Testnet";
    if (isActivated) return `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}`;
    return "Activation required to start racing";
  };
  return (
    <section className="px-4 py-8 h-[600px] flex flex-col justify-center">
      <div className="text-center">
        <div className="relative mx-auto w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple p-1 animate-pulse-custom">
            <div className="w-full h-full rounded-full bg-dark-primary flex items-center justify-center">
              <i className="fas fa-tachometer-alt text-4xl text-neon-blue animate-floating"></i>
            </div>
          </div>
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-electric-purple flex items-center justify-center animate-pulse-custom">
            <span className="text-white text-xs font-bold">2X</span>
          </div>
        </div>

        <h1 className="text-3xl font-orbitron font-bold mb-4 leading-tight">
          <span className="text-neon-blue">Double Your Speed,</span>
          <br />
          <span className="text-electric-purple">Double Your Earnings</span>
        </h1>

        <p className="text-gray-300 text-base mb-8 leading-relaxed px-4">
          Join the revolutionary 2X Pool system where your investments race through automated cycles, 
          multiplying your returns with blockchain transparency and lightning speed.
        </p>

        <div className="w-full max-w-xs mx-auto mb-6">
          <Button 
            onClick={handleAction}
            className="w-full py-4 rounded-2xl text-lg"
          >
            <i className={`fas ${isConnected ? (isActivated ? 'fa-tachometer-alt' : 'fa-user-check') : 'fa-wallet'} mr-2`}></i>
            {getButtonText()}
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse-custom`}></div>
          <span className={isConnected ? 'text-green-400' : 'text-gray-400'}>
            {getStatusText()}
          </span>
        </div>
      </div>
    </section>
  );
}
