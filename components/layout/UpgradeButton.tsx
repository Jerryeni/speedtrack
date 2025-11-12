"use client";

import { useState, useRef, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { activateAccount, getUserDetails } from "@/lib/web3/activation";
import { showToast } from "@/lib/toast";
import { parseActivationError } from "@/lib/web3/errorParser";

export default function UpgradeButton() {
  const { account, isConnected, refreshBalances } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const upgradeLevels = [
    { level: 0, fee: "10", maxInvestment: "50", label: "Starter" },
    { level: 1, fee: "50", maxInvestment: "250", label: "Bronze" },
    { level: 2, fee: "100", maxInvestment: "500", label: "Silver" },
    { level: 3, fee: "250", maxInvestment: "1250", label: "Gold" },
    { level: 4, fee: "500", maxInvestment: "2500", label: "Platinum" },
  ];

  // Fetch current activation level
  useEffect(() => {
    async function fetchCurrentLevel() {
      if (!account || !isConnected) return;
      
      try {
        const userDetails = await getUserDetails(account);
        const level = parseInt(userDetails.activationLevel || '0');
        setCurrentLevel(level);
      } catch (error) {
        console.error('Error fetching user level:', error);
        setCurrentLevel(0);
      }
    }

    fetchCurrentLevel();
  }, [account, isConnected]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleUpgrade = async (levelIndex: number) => {
    if (!account) {
      showToast("Please connect your wallet first", 'error');
      return;
    }

    // Check if trying to upgrade to same or lower level
    if (levelIndex <= currentLevel) {
      showToast("You can only upgrade to a higher level", 'warning');
      return;
    }

    try {
      setIsUpgrading(true);
      setIsOpen(false);
      
      const selectedPackage = upgradeLevels[levelIndex];
      showToast(`Upgrading to ${selectedPackage.label} (${selectedPackage.fee} USDT)...`, 'info');
      
      const tx = await activateAccount(levelIndex, account);
      showToast("Transaction submitted! Waiting for confirmation...", 'info');
      
      await tx.wait();
      
      showToast(`Successfully upgraded to ${selectedPackage.label}! 🎉`, 'success');
      
      // Update current level and refresh balances
      setCurrentLevel(levelIndex);
      await refreshBalances();
      
    } catch (error: any) {
      console.error('Upgrade error:', error);
      const errorMessage = parseActivationError(error);
      showToast(errorMessage, 'error');
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpgrading}
        className={`
          w-full flex items-center justify-between
          min-h-[48px] px-4 py-3 rounded-lg
          bg-gradient-to-r from-electric-purple to-neon-blue
          hover:from-electric-purple/80 hover:to-neon-blue/80
          text-white font-semibold
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95
          shadow-lg hover:shadow-xl
        `}
      >
        <div className="flex items-center space-x-3">
          <i className="fas fa-arrow-up text-lg"></i>
          <span className="text-sm">
            {isUpgrading ? 'Upgrading...' : 'Upgrade Package'}
          </span>
        </div>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-sm transition-transform`}></i>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isUpgrading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50 animate-slideDown">
          <div className="p-2 border-b border-gray-700 bg-gray-900">
            <p className="text-xs text-gray-400 text-center">
              Current: <span className="text-neon-blue font-semibold">
                {upgradeLevels[currentLevel]?.label || 'None'}
              </span>
            </p>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {upgradeLevels.map((pkg) => {
              const isCurrent = pkg.level === currentLevel;
              const isLower = pkg.level < currentLevel;
              const isUpgrade = pkg.level > currentLevel;

              return (
                <button
                  key={pkg.level}
                  onClick={() => handleUpgrade(pkg.level)}
                  disabled={isCurrent || isLower}
                  className={`
                    w-full p-3 text-left
                    transition-all duration-200
                    border-b border-gray-700 last:border-b-0
                    ${isCurrent 
                      ? 'bg-neon-blue/10 cursor-default' 
                      : isLower
                      ? 'bg-gray-900/50 cursor-not-allowed opacity-50'
                      : 'hover:bg-gray-700 active:bg-gray-600'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`
                          text-sm font-semibold
                          ${isCurrent ? 'text-neon-blue' : isUpgrade ? 'text-white' : 'text-gray-500'}
                        `}>
                          {pkg.label}
                        </span>
                        {isCurrent && (
                          <span className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                        {isUpgrade && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                            Upgrade
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Max: {pkg.maxInvestment} USDT
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <p className={`
                        text-base font-bold
                        ${isCurrent ? 'text-neon-blue' : isUpgrade ? 'text-electric-purple' : 'text-gray-500'}
                      `}>
                        {pkg.fee}
                      </p>
                      <p className="text-xs text-gray-400">USDT</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-2 bg-gray-900 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              <i className="fas fa-info-circle mr-1"></i>
              Upgrade to unlock higher investment limits
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
