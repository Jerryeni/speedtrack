"use client";

import { useState, useEffect } from "react";
import { getNetworkLevels } from "@/lib/web3/referrals";
import { useWeb3 } from "@/lib/web3/Web3Context";

export default function EarningsChart() {
  const { account } = useWeb3();
  const [levels, setLevels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!account) {
        setIsLoading(false);
        return;
      }

      try {
        const networkLevels = await getNetworkLevels(account);
        
        // Create 10 levels with real or zero data
        const levelData = Array.from({ length: 10 }, (_, i) => {
          const level = networkLevels.find(l => l.level === i + 1);
          const amount = parseFloat(level?.earned || '0');
          const maxAmount = Math.max(...networkLevels.map(l => parseFloat(l.earned)), 100);
          const heightPercent = amount > 0 ? Math.max((amount / maxAmount) * 100, 10) : 5;
          
          return {
            level: `L${i + 1}`,
            amount: amount.toFixed(0),
            heightPercent
          };
        });

        setLevels(levelData);
      } catch (error) {
        console.error('Error fetching earnings chart:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [account]);

  if (isLoading) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-orbitron font-bold mb-4">Earnings by Level</h3>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="text-center text-gray-400">
            <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
            <p>Loading earnings data...</p>
          </div>
        </div>
      </section>
    );
  }

  const level1to3 = levels.slice(0, 3).reduce((sum, l) => sum + parseFloat(l.amount), 0);
  const level4to6 = levels.slice(3, 6).reduce((sum, l) => sum + parseFloat(l.amount), 0);
  const level7to10 = levels.slice(6, 10).reduce((sum, l) => sum + parseFloat(l.amount), 0);

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Earnings by Level</h3>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="h-64 flex items-end justify-around space-x-2">
          {levels.map((level, index) => (
            <div key={level.level} className="flex-1 flex flex-col items-center space-y-2">
              <div className="text-xs text-gray-400">${level.amount}</div>
              <div
                className="w-full bg-gradient-to-t from-neon-blue via-electric-purple to-neon-blue rounded-t-lg transition-all hover:opacity-80"
                style={{ 
                  height: `${level.heightPercent}%`,
                  animationDelay: `${index * 0.1}s` 
                }}
              ></div>
              <div className="text-xs text-gray-400">{level.level}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-neon-blue">${level1to3.toFixed(0)}</p>
            <p className="text-xs text-gray-400">Level 1-3</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-electric-purple">${level4to6.toFixed(0)}</p>
            <p className="text-xs text-gray-400">Level 4-6</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-400">${level7to10.toFixed(0)}</p>
            <p className="text-xs text-gray-400">Level 7-10</p>
          </div>
        </div>
      </div>
    </section>
  );
}
