"use client";

import { useEffect, useState } from "react";
import { getLevelBreakdown } from "@/lib/web3/teamStats";

const LEVEL_NAMES = ['Starter', 'Bronze', 'Silver', 'Gold', 'Platinum'];
const LEVEL_COLORS = ['gray', 'orange', 'blue', 'yellow', 'purple'];
const LEVEL_FEES = ['$10', '$50', '$100', '$250', '$500'];

export default function LevelBreakdown() {
  const [levels, setLevels] = useState<{ level: number; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLevels() {
      try {
        const breakdown = await getLevelBreakdown();
        setLevels(breakdown);
      } catch (error) {
        console.error("Error loading level breakdown:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLevels();
    const interval = setInterval(loadLevels, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-orbitron font-bold mb-4">Level Distribution</h3>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const totalUsers = levels.reduce((sum, l) => sum + l.count, 0);

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Level Distribution</h3>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="space-y-3">
          {levels.map((levelData) => {
            const percentage = totalUsers > 0 ? (levelData.count / totalUsers) * 100 : 0;
            const color = LEVEL_COLORS[levelData.level];
            
            return (
              <div key={levelData.level} className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                      <i className={`fas fa-star text-${color}-400`}></i>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{LEVEL_NAMES[levelData.level]}</p>
                      <p className="text-xs text-gray-400">{LEVEL_FEES[levelData.level]} activation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{levelData.count}</p>
                    <p className="text-xs text-gray-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${color}-500 transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Total Platform Users</span>
            <span className="text-lg font-bold text-white">{totalUsers}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
