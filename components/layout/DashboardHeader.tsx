"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getSpeedTrackReadOnly } from "@/lib/web3/contracts";
import MobileNav from "@/components/layout/MobileNav";

export default function DashboardHeader() {
  const router = useRouter();
  const { account, isConnected } = useWeb3();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (!account || !isConnected) return;
      
      try {
        const speedTrack = await getSpeedTrackReadOnly();
        const owner = await speedTrack.owner();
        setIsAdmin(owner.toLowerCase() === account.toLowerCase());
      } catch (error) {
        setIsAdmin(false);
      }
    }
    
    checkAdmin();
  }, [account, isConnected]);

  return (
    <>
      <header className="relative z-50 px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center">
              <i className="fas fa-rocket text-dark-primary text-base md:text-lg"></i>
            </div>
            <div>
              <h1 className="text-base md:text-xl font-orbitron font-bold text-neon-blue">Speed Track</h1>
              <p className="text-[10px] md:text-xs text-gray-400 hidden sm:block">Web3 Racing Finance</p>
            </div>
          </div>
          
          {/* Desktop: Show all icons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
              <button
                onClick={() => router.push("/admin")}
                className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                title="Admin Panel"
              >
                <i className="fas fa-shield-alt text-green-400 text-sm"></i>
              </button>
            )}
            <div className="relative">
              <button className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center hover:bg-electric-purple/30 transition-colors">
                <i className="fas fa-bell text-electric-purple text-sm"></i>
              </button>
              {/* Notification badge - will be dynamic when notification system is implemented */}
            </div>
            <button 
              onClick={() => window.location.href = '/profile'}
              className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center hover:bg-neon-blue/30 transition-colors"
              title="Profile Settings"
            >
              <i className="fas fa-user text-neon-blue text-sm"></i>
            </button>
          </div>

          {/* Mobile: Show only menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button className="min-w-[44px] min-h-[44px] rounded-lg bg-electric-purple/20 flex items-center justify-center active:scale-95 transition-transform">
              <i className="fas fa-bell text-electric-purple text-sm"></i>
              {/* Notification badge - will be dynamic when notification system is implemented */}
            </button>
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
