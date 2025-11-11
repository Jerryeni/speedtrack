"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWeb3 } from "@/lib/web3/Web3Context";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { balances, account } = useWeb3();
  const [isAnimating, setIsAnimating] = useState(false);

  const navItems = [
    { href: "/dashboard", icon: "fa-home", label: "Dashboard" },
    { href: "/trade", icon: "fa-exchange-alt", label: "Trade" },
    { href: "/referral", icon: "fa-users", label: "Referral" },
    { href: "/income", icon: "fa-chart-line", label: "Income" },
    { href: "/profile", icon: "fa-user", label: "Profile" },
    { href: "/share", icon: "fa-share-alt", label: "Share" },
  ];

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    // Close menu on route change
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `.trim().replace(/\s+/g, ' ')}
        onClick={onClose}
      />

      {/* Slide-out drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[280px] max-w-[80vw]
          bg-gradient-to-b from-gray-900 to-gray-800
          border-l border-gray-700
          z-50
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `.trim().replace(/\s+/g, ' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-neon-blue">Menu</h2>
          <button
            onClick={onClose}
            className="
              min-w-[44px] min-h-[44px]
              flex items-center justify-center
              text-gray-400 hover:text-neon-blue
              transition-colors
              rounded-lg
              active:scale-95
            "
            aria-label="Close menu"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Balance Display - ST Token Only */}
        {account && (
          <div className="p-4 border-b border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Your Balance</p>
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center">
                  <i className="fas fa-coins text-neon-blue text-xs"></i>
                </div>
                <span className="text-sm text-gray-300">ST Token</span>
              </div>
              <span className="text-xs font-bold text-neon-blue truncate max-w-[100px]">
                {(() => {
                  const val = parseFloat(balances.st || '0');
                  if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
                  if (val >= 1000) return `${(val / 1000).toFixed(2)}K`;
                  return val.toFixed(2);
                })()}
              </span>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex flex-col p-4 space-y-2 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-4
                  min-h-[48px]
                  px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-neon-blue'
                  }
                  active:scale-95
                `.trim().replace(/\s+/g, ' ')}
              >
                <i className={`fas ${item.icon} text-lg w-5`}></i>
                <span className="text-base font-medium">{item.label}</span>
                {isActive && (
                  <i className="fas fa-chevron-right ml-auto text-sm"></i>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
