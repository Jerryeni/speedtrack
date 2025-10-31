"use client";

import Link from "next/link";
import WalletButton from "@/components/web3/WalletButton";
import BalanceDisplay from "@/components/web3/BalanceDisplay";

export default function Header() {
  return (
    <header className="relative z-50 px-4 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center animate-rotate-glow">
            <i className="fas fa-rocket text-dark-primary text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-orbitron font-bold text-neon-blue">Speed Track</h1>
            <p className="text-xs text-gray-400">Web3 Racing Finance</p>
          </div>
        </Link>
        <div className="flex items-center space-x-3">
          <BalanceDisplay />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
