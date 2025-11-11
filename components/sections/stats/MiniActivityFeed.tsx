"use client";

import { useRealtimeEvents } from "@/lib/web3/hooks/useRealtimeEvents";
import Link from "next/link";

export default function MiniActivityFeed() {
  const { events, isListening } = useRealtimeEvents(true);
  const recentEvents = events.slice(0, 5);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'UserRegistered':
        return { icon: 'fas fa-user-plus', color: 'text-neon-blue' };
      case 'InvestmentMade':
        return { icon: 'fas fa-coins', color: 'text-yellow-400' };
      case 'ROIClaimed':
        return { icon: 'fas fa-hand-holding-usd', color: 'text-green-400' };
      case 'LevelIncomeReceived':
        return { icon: 'fas fa-network-wired', color: 'text-electric-purple' };
      default:
        return { icon: 'fas fa-circle', color: 'text-gray-400' };
    }
  };

  const getEventText = (event: any) => {
    const addr = event.user ? `${event.user.slice(0, 6)}...${event.user.slice(-4)}` : '';
    switch (event.type) {
      case 'UserRegistered':
        return `New user joined`;
      case 'InvestmentMade':
        return `$${parseFloat(event.amount || '0').toFixed(0)} invested`;
      case 'ROIClaimed':
        return `$${parseFloat(event.amount || '0').toFixed(0)} ROI claimed`;
      case 'LevelIncomeReceived':
        return `$${parseFloat(event.amount || '0').toFixed(0)} referral earned`;
      default:
        return 'Activity';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center">
            <i className="fas fa-broadcast-tower text-electric-purple"></i>
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-white">Live Activity</h3>
            <div className="flex items-center space-x-2">
              {isListening && (
                <>
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Live</span>
                </>
              )}
            </div>
          </div>
        </div>
        <Link
          href="/stats"
          className="text-xs text-neon-blue hover:text-electric-purple transition-colors font-semibold"
        >
          View All <i className="fas fa-arrow-right ml-1"></i>
        </Link>
      </div>

      {recentEvents.length === 0 ? (
        <div className="text-center py-6">
          <i className="fas fa-satellite-dish text-2xl text-gray-600 mb-2"></i>
          <p className="text-xs text-gray-500">Waiting for activity...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentEvents.map((event, index) => {
            const { icon, color } = getEventIcon(event.type);
            const timeAgo = Math.floor((Date.now() - event.timestamp) / 1000);
            const timeString = timeAgo < 60 ? 'Just now' : 
                             timeAgo < 3600 ? `${Math.floor(timeAgo / 60)}m ago` :
                             `${Math.floor(timeAgo / 3600)}h ago`;

            return (
              <div 
                key={`${event.transactionHash}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <i className={`${icon} ${color} text-sm`}></i>
                  <div>
                    <p className="text-sm text-white">{getEventText(event)}</p>
                    <p className="text-xs text-gray-500">{timeString}</p>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-600 text-xs"></i>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <Link
          href="/stats"
          className="block text-center text-sm text-neon-blue hover:text-electric-purple transition-colors font-semibold"
        >
          <i className="fas fa-chart-bar mr-2"></i>
          View Full Statistics Dashboard
        </Link>
      </div>
    </div>
  );
}
