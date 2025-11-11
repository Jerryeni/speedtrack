"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getReferralStats, getNetworkLevels } from "@/lib/web3/referrals";
import ShareStats from "@/components/sections/share/ShareStats";
import BonusHighlights from "@/components/sections/share/BonusHighlights";
import ShareLink from "@/components/sections/share/ShareLink";
import SocialShare from "@/components/sections/share/SocialShare";
import NetworkTree from "@/components/sections/share/NetworkTree";
import ShareSuccessModal from "@/components/modals/ShareSuccessModal";

export default function SharePage() {
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sharedPlatform, setSharedPlatform] = useState("");
  const [referralStats, setReferralStats] = useState<any>(null);
  const [networkLevels, setNetworkLevels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReferralData() {
      if (!account) {
        setIsLoading(false);
        return;
      }

      try {
        const [stats, levels] = await Promise.all([
          getReferralStats(account),
          getNetworkLevels(account)
        ]);

        setReferralStats(stats);
        setNetworkLevels(levels);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReferralData();
    const interval = setInterval(fetchReferralData, 30000);
    return () => clearInterval(interval);
  }, [account]);

  const handleShare = (platform: string) => {
    setSharedPlatform(platform);
    setShowSuccessModal(true);
  };

  // Show wallet connection prompt only if no account
  if (!account) {
    return (
      <main className="min-h-screen pb-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <i className="fas fa-wallet text-yellow-400 text-3xl"></i>
          </div>
          <h2 className="text-xl font-orbitron font-bold text-yellow-400 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400">
            Please connect your wallet to view your referral stats
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="relative z-50 px-4 md:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="min-w-[44px] min-h-[44px] rounded-full bg-gray-800 flex items-center justify-center active:scale-95 transition-transform"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-orbitron font-bold text-neon-blue">Share & Earn</h1>
              <p className="text-xs md:text-sm text-gray-400">Invite Friends to Race</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 ml-auto sm:ml-0">
            <div className="text-right">
              <p className="text-xs text-gray-400">Total Earned</p>
              <p className="text-sm md:text-base font-bold text-green-400 animate-[earningsHighlight_3s_ease-in-out_infinite]">
                {isLoading ? '...' : `${parseFloat(referralStats?.totalEarned || '0').toFixed(2)}`}
              </p>
            </div>
            <div className="min-w-[44px] min-h-[44px] rounded-full bg-electric-purple/20 flex items-center justify-center">
              <i className="fas fa-share-alt text-electric-purple"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Wrong Network Warning */}
      {!isCorrectChain && (
        <div className="px-4 md:px-6 lg:px-8 mb-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-exclamation-triangle text-red-400 text-xl"></i>
              <div>
                <p className="text-sm font-medium text-red-400">Wrong Network</p>
                <p className="text-xs text-gray-400 mt-1">
                  Please switch to the correct network to view your referral data
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ShareStats 
        stats={referralStats} 
        isLoading={isLoading}
      />
      <BonusHighlights />
      <ShareLink 
        referralLink={referralStats?.referralLink}
        shortLink={referralStats?.shortLink}
        referralCode={referralStats?.referralCode}
        isLoading={isLoading}
      />
      <SocialShare onShare={handleShare} />
      <NetworkTree 
        levels={networkLevels}
        isLoading={isLoading}
        userAddress={account || ''}
      />

      <ShareSuccessModal
        isOpen={showSuccessModal}
        platform={sharedPlatform}
        onClose={() => setShowSuccessModal(false)}
      />
    </main>
  );
}
