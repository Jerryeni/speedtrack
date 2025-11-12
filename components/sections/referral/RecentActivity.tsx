"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { ethers } from "ethers";
import { getSpeedTrackReadOnly } from "@/lib/web3/contracts";

interface ReferralActivity {
  referredUser: string;
  action: string;
  amount: string;
  time: string;
  level: string;
  status: string;
  levelColor: string;
  statusColor: string;
  blockNumber: number;
  timestamp: number;
}

export default function RecentActivity() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [activities, setActivities] = useState<ReferralActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReferralActivity() {
      if (!account || !isConnected || !isCorrectChain) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const speedTrack = await getSpeedTrackReadOnly();

        // Parallel fetch for better performance
        const [sponsorEvents, levelIncomeEvents] = await Promise.all([
          speedTrack.queryFilter(speedTrack.filters.SponsorRegistered(null, account)).catch(() => []),
          speedTrack.queryFilter(speedTrack.filters.LevelIncomeReceived(account)).catch(() => [])
        ]);

        // Filter for this user as referrer (if filtered query didn't work)
        let userReferralEvents = sponsorEvents;
        if (sponsorEvents.length === 0) {
          const allEvents = await speedTrack.queryFilter(speedTrack.filters.SponsorRegistered()).catch(() => []);
          userReferralEvents = allEvents.filter(event => {
            const eventLog = event as ethers.EventLog;
            return eventLog.args?.referrer?.toLowerCase() === account.toLowerCase();
          });
        }

        // Process events into activities (last 10 only)
        const processedActivities: ReferralActivity[] = [];
        const recentEvents = userReferralEvents.slice(-10).reverse();
        const now = Date.now();

        recentEvents.forEach((event, index) => {
          const eventLog = event as ethers.EventLog;
          const referredUser = eventLog.args?.user || ethers.ZeroAddress;
          const refType = eventLog.args?.refType;

          // Find corresponding level income event
          const incomeEvent = levelIncomeEvents.find(ie => {
            const ieLog = ie as ethers.EventLog;
            return ieLog.args?.fromUser?.toLowerCase() === referredUser.toLowerCase();
          });

          const amount = incomeEvent 
            ? ethers.formatUnits((incomeEvent as ethers.EventLog).args?.amount || 0, 6)
            : '0';

          // Estimate timestamp based on position
          const timestamp = now - (index * 3600000);

          processedActivities.push({
            referredUser,
            action: refType === 0 ? "Joined via your link" : "Joined as team member",
            amount: amount !== '0' ? `+$${parseFloat(amount).toFixed(2)}` : 'Pending',
            time: getTimeAgo(timestamp),
            level: "Level 1",
            status: parseFloat(amount) > 0 ? "Active" : "Registered",
            levelColor: "neon-blue",
            statusColor: parseFloat(amount) > 0 ? "green-400" : "yellow-400",
            blockNumber: event.blockNumber,
            timestamp
          });
        });

        setActivities(processedActivities);
      } catch (error) {
        console.error('Error fetching referral activity:', error);
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReferralActivity();
    const interval = setInterval(fetchReferralActivity, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [account, isConnected, isCorrectChain]);

  function getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  if (!isConnected) {
    return null;
  }

  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron font-bold">Recent Activity</h3>
        {activities.length > 0 && (
          <button className="text-neon-blue text-sm font-medium">
            {activities.length} Total
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center">
          <i className="fas fa-spinner fa-spin text-neon-blue text-2xl mb-2"></i>
          <p className="text-sm text-gray-400">Loading referral activity...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center">
          <i className="fas fa-users text-gray-600 text-3xl mb-3"></i>
          <p className="text-sm text-gray-400 mb-2">No referral activity yet</p>
          <p className="text-xs text-gray-500">
            Share your referral link to start building your team
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={`${activity.blockNumber}-${index}`}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-3 border border-gray-700/50 hover:border-neon-blue/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-electric-purple flex items-center justify-center">
                    <i className="fas fa-user text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-sm font-mono">
                      {formatAddress(activity.referredUser)}
                    </p>
                    <p className="text-xs text-gray-400">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${activity.amount === 'Pending' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {activity.amount}
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <div className={`text-xs bg-${activity.levelColor}/20 text-${activity.levelColor} px-2 py-1 rounded-full`}>
                  {activity.level}
                </div>
                <div className={`text-xs bg-${activity.statusColor}/20 text-${activity.statusColor} px-2 py-1 rounded-full`}>
                  {activity.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
