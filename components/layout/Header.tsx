"use client";

import { useState } from "react";
import Link from "next/link";
import WalletButton from "@/components/web3/WalletButton";
import BalanceDisplay from "@/components/web3/BalanceDisplay";
import MobileNav from "@/components/layout/MobileNav";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="relative z-50 px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center animate-rotate-glow">
              <i className="fas fa-rocket text-dark-primary text-base md:text-lg"></i>
            </div>
            <div>
              <h1 className="text-base md:text-xl font-orbitron font-bold text-neon-blue">Speed Track</h1>
              <p className="text-[10px] md:text-xs text-gray-400 hidden sm:block">Web3 Racing Finance</p>
            </div>
          </Link>
          
          {/* Desktop: Show balances and wallet button */}
          <div className="hidden md:flex items-center space-x-3">
            <BalanceDisplay />
            <WalletButton />
          </div>

          {/* Mobile: Show only wallet button and menu */}
          <div className="flex md:hidden items-center space-x-2">
            <WalletButton />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="min-w-[44px] min-h-[44px] rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Open menu"
            >
              <i className="fas fa-bars text-neon-blue text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
