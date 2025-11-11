"use client";

import { useRealtimeEvents, RealtimeEvent } from "@/lib/web3/hooks/useRealtimeEvents";
import { useState } from "react";

interface ActivityItemProps {
  event: RealtimeEvent;
}

function ActivityItem({ event }: ActivityItemProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case 'UserRegistered':
        return { icon: 'fas fa-user-plus', color: 'text-neon-blue', bg: 'bg-neon-blue/20' };
      case 'AccountActivated':
        return { icon: 'fas fa-check-circle', color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'InvestmentMade':
        return { icon: 'fas fa-coins', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      case 'ROIClaimed':
        return { icon: 'fas fa-hand-holding-usd', color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'LevelIncomeReceived':
        return { icon: 'fas fa-network-wired', color: 'text-electric-purple', bg: 'bg-electric-purple/20' };
      case 'CapitalReturned':
        return { icon: 'fas fa-undo', color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
      case 'STTokensReceived':
        return { icon: 'fas fa-gift', color: 'text-pink-400', bg: 'bg-pink-500/20' };
      case 'PoolOpened':
        return { icon: 'fas fa-swimming-pool', color: 'text-blue-400', bg: 'bg-blue-500/20' };
      case 'PoolFilled':
        return { icon: 'fas fa-check-double', color: 'text-green-400', bg: 'bg-green-500/20' };
      default:
        return { icon: 'fas fa-circle', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  const getEventDescription = () => {
    const shortAddress = event.user ? `${event.user.slice(0, 6)}...${event.user.slice(-4)}` : '';
    
    switch (event.type) {
      case 'UserRegistered':
        return `New user registered: ${shortAddress}`;
      case 'AccountActivated':
        return `${shortAddress} activated Level ${event.level}`;
      case 'InvestmentMade':
        return `${shortAddress} invested $${parseFloat(event.amount || '0').toFixed(2)} in Pool #${event.poolIndex}`;
      case 'ROIClaimed':
        return `${shortAddress} claimed $${parseFloat(event.amount || '0').toFixed(2)} ROI`;
      case 'LevelIncomeReceived':
        return `${shortAddress} received $${parseFloat(event.amount || '0').toFixed(2)} Level ${event.level} income`;
      case 'CapitalReturned':
        return `${shortAddress} received $${parseFloat(event.amount || '0').toFixed(2)} capital return`;
      case 'STTokensReceived':
        return `${shortAddress} received $${parseFloat(event.amount || '0').toFixed(2)} in ST tokens`;
      case 'PoolOpened':
        return `New pool #${event.poolIndex} opened with size $${parseFloat(event.amount || '0').toFixed(2)}`;
      case 'PoolFilled':
        return `Pool #${event.poolIndex} filled completely`;
      default:
        return 'Unknown event';
    }
  };

  const { icon, color, bg } = getEventIcon();
  const timeAgo = Math.floor((Date.now() - event.timestamp) / 1000);
  const timeString = timeAgo < 60 ? 'Just now' : 
                     timeAgo < 3600 ? `${Math.floor(timeAgo / 60)}m ago` :
                     `${Math.floor(timeAgo / 3600)}h ago`;

  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors animate-fadeIn">
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
        <i className={`${icon} ${color} text-sm`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white break-words">{getEventDescription()}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-gray-500">{timeString}</span>
          <span className="text-xs text-gray-600">•</span>
          <a
            href={`https://testnet.bscscan.com/tx/${event.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neon-blue hover:text-electric-purple transition-colors"
          >
            View TX <i className="fas fa-external-link-alt ml-1"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

interface LiveActivityFeedProps {
  maxItems?: number;
  showHeader?: boolean;
  compact?: boolean;
}

export default function LiveActivityFeed({ maxItems = 20, showHeader = true, compact = false }: LiveActivityFeedProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const { events, isListening, error, clearEvents } = useRealtimeEvents(isEnabled);

  const displayEvents = events.slice(0, maxItems);

  return (
    <div>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-orbitron font-bold text-white`}>
              <i className="fas fa-broadcast-tower text-neon-blue mr-2"></i>
              Live Activity
            </h2>
            {isListening && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Live</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                isEnabled 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <i className={`fas ${isEnabled ? 'fa-pause' : 'fa-play'} mr-1`}></i>
              {isEnabled ? 'Pause' : 'Resume'}
            </button>
            {events.length > 0 && (
              <button
                onClick={clearEvents}
                className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors"
              >
                <i className="fas fa-trash mr-1"></i>
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-2">
            <i className="fas fa-exclamation-triangle text-red-400"></i>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}

      {!isListening && !error && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-2">
            <i className="fas fa-info-circle text-yellow-400"></i>
            <p className="text-sm text-yellow-400">Event monitoring is paused</p>
          </div>
        </div>
      )}

      <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 ${compact ? 'p-3' : 'p-4'}`}>
        {displayEvents.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-satellite-dish text-4xl text-gray-600 mb-3"></i>
            <p className="text-gray-400 mb-1">Waiting for activity...</p>
            <p className="text-xs text-gray-500">
              {isListening ? 'Listening for blockchain events' : 'Event monitoring is paused'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {displayEvents.map((event, index) => (
              <ActivityItem key={`${event.transactionHash}-${index}`} event={event} />
            ))}
          </div>
        )}

        {events.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">
              Showing {maxItems} of {events.length} recent events
            </p>
          </div>
        )}
      </div>

      {!compact && (
        <div className="mt-4 bg-neon-blue/10 border border-neon-blue/30 rounded-xl p-3">
          <div className="flex items-start space-x-2">
            <i className="fas fa-info-circle text-neon-blue mt-0.5"></i>
            <p className="text-xs text-gray-400">
              This feed shows real-time blockchain events as they happen. Events are automatically updated when new transactions are confirmed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
