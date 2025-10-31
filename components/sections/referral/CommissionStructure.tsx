"use client";

import { useState, useEffect } from "react";
import { getLevelPercentages } from "@/lib/web3/rewards";
import { getNetworkLevels } from "@/lib/web3/referrals";
import { useWeb3 } from "@/lib/web3/Web3Context";

export default function CommissionStructure() {
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
        const [percentages, networkLevels] = await Promise.all([
          getLevelPercentages(),
          getNetworkLevels(account)
        ]);

        const levelData = percentages.slice(0, 3).map((percentage, index) => {
          const networkLevel = networkLevels.find(l => l.level === index + 1);
          const colors = ['neon-blue', 'electric-purple', 'green-400'];
          
          return {
            level: index + 1,
            name: `Level ${index + 1} - ${index === 0 ? 'Direct Referrals' : index === 1 ? 'Second Tier' : 'Third Tier'}`,
            description: index === 0 ? 'Your direct team members' : index === 1 ? 'Referrals of your referrals' : 'Extended network',
            commission: `${percentage}%`,
            activeMembers: networkLevel?.users || 0,
            earned: `$${networkLevel?.earned || '0'}`,
            progress: networkLevel ? Math.min((networkLevel.users / 50) * 100, 100) : 0,
            color: colors[index],
          };
        });

        setLevels(levelData);
      } catch (error) {
        console.error('Error fetching commission structure:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [account]);

  if (isLoading) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-orbitron font-bold mb-4">Commission Structure</h3>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="text-center text-gray-400">
            <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
            <p>Loading commission structure...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Commission Structure</h3>
      <div className="space-y-3">
        {levels.map((level) => (
          <div
            key={level.level}
            className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full bg-${level.color}/20 flex items-center justify-center animate-[levelPulse_2s_ease-in-out_infinite]`}>
                  <span className={`text-xs font-bold text-${level.color}`}>L{level.level}</span>
                </div>
                <div>
                  <p className="font-semibold">{level.name}</p>
                  <p className="text-xs text-gray-400">{level.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold text-${level.color}`}>{level.commission}</p>
                <p className="text-xs text-gray-400">Commission</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Active Members: {level.activeMembers}</span>
                <span className={`text-${level.color} font-semibold`}>{level.earned} Earned</span>
              </div>
              <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${level.color} rounded-full`}
                  style={{ width: `${level.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-3 border border-gray-700/50">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <i className="fas fa-ellipsis-h"></i>
            <span className="text-sm">Levels 4-10 available</span>
            <button className="text-neon-blue text-sm font-medium">View All</button>
          </div>
        </div>
      </div>
    </section>
  );
}
