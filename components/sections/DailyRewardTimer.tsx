"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { calculateReward } from "@/lib/web3/rewards";
import Button from "@/components/ui/Button";
import { claimRewards } from "@/lib/web3/rewards";
import { showToast } from "@/lib/toast";

export default function DailyRewardTimer() {
  const { account, isConnected, isCorrectChain, refreshBalances } = useWeb3();
  const [time, setTime] = useState({ hours: 18, minutes: 42, seconds: 15 });
  const [dailyReward, setDailyReward] = useState("0");
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchReward() {
      if (!account || !isConnected || !isCorrectChain) return;
      
      try {
        const reward = await calculateReward(account);
        setDailyReward(reward);
      } catch (error) {
        console.error("Failed to fetch reward:", error);
      }
    }

    fetchReward();
    const interval = setInterval(fetchReward, 30000);
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  const handleClaimReward = async () => {
    if (!account) return;

    try {
      setIsClaiming(true);
      showToast("Processing claim transaction...");
      const tx = await claimRewards();
      await tx.wait();
      showToast("Rewards claimed successfully!");
      await refreshBalances();
      setDailyReward("0");
    } catch (error: any) {
      showToast(error.message || "Failed to claim rewards");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <section className="px-4 mb-8">
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl p-6 border border-orange-500/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-orbitron font-bold text-orange-400">
              Daily Reward Timer
            </h3>
            <p className="text-sm text-gray-400">Next reward distribution</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center animate-[countdownPulse_1s_ease-in-out_infinite]">
            <i className="fas fa-hourglass-half text-orange-400"></i>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-2xl font-orbitron font-bold text-orange-400">
                {time.hours.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-gray-400">Hours</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-2xl font-orbitron font-bold text-orange-400">
                {time.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-gray-400">Minutes</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-2xl font-orbitron font-bold text-orange-400">
                {time.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-gray-400">Seconds</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-lg font-orbitron font-bold text-orange-400">0.5%</div>
              <div className="text-xs text-gray-400">Rate</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(249, 115, 22, 0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#F97316"
                strokeWidth="8"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset="70"
                className="progress-ring"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-orange-400 font-bold text-sm">75%</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <div>
            <p className="text-sm text-orange-300">
              Available reward: <span className="font-bold">{parseFloat(dailyReward).toFixed(4)} USDT</span>
            </p>
            <p className="text-xs text-gray-400">Daily reward rate: 0.5%</p>
          </div>
          {isConnected && isCorrectChain && parseFloat(dailyReward) > 0 && (
            <Button 
              onClick={handleClaimReward}
              disabled={isClaiming}
              className="w-full"
            >
              {isClaiming ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Claiming...
                </>
              ) : (
                <>
                  <i className="fas fa-gift mr-2"></i>
                  Claim Reward
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
