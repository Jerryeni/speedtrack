"use client";

import { useState } from "react";
import MobileNav from "@/components/layout/MobileNav";

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center">
                <i className="fas fa-bell text-electric-purple text-sm"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">3</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <i className="fas fa-cog text-neon-blue text-sm"></i>
            </div>
            <img 
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
              alt="Profile" 
              className="w-8 h-8 rounded-full border-2 border-neon-blue/50"
            />
          </div>

          {/* Mobile: Show only menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <div className="relative">
              <button className="min-w-[44px] min-h-[44px] rounded-lg bg-electric-purple/20 flex items-center justify-center">
                <i className="fas fa-bell text-electric-purple text-sm"></i>
              </button>
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">3</span>
              </div>
            </div>
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
