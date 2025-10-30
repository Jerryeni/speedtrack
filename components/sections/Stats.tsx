"use client";

import { useEffect } from "react";
import StatCard from "@/components/ui/StatCard";

export default function Stats() {
  useEffect(() => {
    const animateCounter = (element: HTMLElement | null, target: number, duration = 2000) => {
      if (!element) return;
      
      let start = 0;
      const increment = target / (duration / 16);
      
      const updateCounter = () => {
        start += increment;
        if (start < target) {
          element.textContent = Math.floor(start).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString();
        }
      };
      updateCounter();
    };

    setTimeout(() => {
      animateCounter(document.getElementById('total-users'), 24891);
      animateCounter(document.getElementById('pools-filled'), 1247);
    }, 500);
  }, []);

  return (
    <section className="px-4 mb-8">
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-3xl p-6 border border-gray-700 backdrop-blur-sm">
        <h3 className="text-center text-lg font-orbitron font-bold mb-6 text-neon-blue">
          Live Racing Stats
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard 
            id="total-users"
            value="24,891" 
            label="Total Racers" 
            color="text-neon-blue"
            progress={80}
          />
          <StatCard 
            value="$2.4M" 
            label="Total Investment" 
            color="text-electric-purple"
            progress={75}
          />
          <StatCard 
            id="pools-filled"
            value="1,247" 
            label="Pools Completed" 
            color="text-green-400"
            progress={100}
          />
          <StatCard 
            value="$156K" 
            label="Active Rewards" 
            color="text-yellow-400"
            progress={66}
          />
        </div>

        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse-custom"></div>
            <span className="text-gray-400">Live Updates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-custom"></div>
            <span className="text-gray-400">Real-time Rewards</span>
          </div>
        </div>
      </div>
    </section>
  );
}
