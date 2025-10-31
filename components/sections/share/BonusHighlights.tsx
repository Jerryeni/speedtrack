"use client";

import { useState, useEffect } from "react";
import { getLevelPercentages } from "@/lib/web3/rewards";

export default function BonusHighlights() {
  const [percentages, setPercentages] = useState<number[]>([10, 5, 3]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPercentages() {
      try {
        const levels = await getLevelPercentages();
        setPercentages(levels.slice(0, 3)); // Get first 3 levels
      } catch (error) {
        console.error('Error fetching level percentages:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPercentages();
  }, []);

  const totalPercentage = percentages.reduce((sum, p) => sum + p, 0);

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="bg-gradient-to-r from-neon-blue/10 to-electric-purple/10 rounded-2xl border border-neon-blue/30 p-6 animate-[bonusHighlight_2s_ease-in-out_infinite]">
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-gift text-2xl text-dark-primary"></i>
          </div>
          <h3 className="font-orbitron font-bold text-xl mb-2">Referral Rewards</h3>
          <p className="text-gray-300 text-sm">
            Earn up to {totalPercentage}% from every referral's activity
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-lg font-orbitron font-bold text-neon-blue">
              {isLoading ? '...' : `${percentages[0]}%`}
            </div>
            <p className="text-xs text-gray-400">Level 1</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-lg font-orbitron font-bold text-electric-purple">
              {isLoading ? '...' : `${percentages[1]}%`}
            </div>
            <p className="text-xs text-gray-400">Level 2</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-lg font-orbitron font-bold text-green-400">
              {isLoading ? '...' : `${percentages[2]}%`}
            </div>
            <p className="text-xs text-gray-400">Level 3</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">Lifetime commissions on all referral activities</p>
        </div>
      </div>
    </section>
  );
}
