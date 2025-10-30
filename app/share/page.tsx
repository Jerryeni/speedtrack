"use client";

import { useState } from "react";
import ShareStats from "@/components/sections/share/ShareStats";
import BonusHighlights from "@/components/sections/share/BonusHighlights";
import ShareLink from "@/components/sections/share/ShareLink";
import ShareBanners from "@/components/sections/share/ShareBanners";
import SocialShare from "@/components/sections/share/SocialShare";
import NetworkTree from "@/components/sections/share/NetworkTree";
import ShareSuccessModal from "@/components/modals/ShareSuccessModal";

export default function SharePage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sharedPlatform, setSharedPlatform] = useState("");

  const handleShare = (platform: string) => {
    setSharedPlatform(platform);
    setShowSuccessModal(true);
  };

  return (
    <main className="min-h-screen pb-20">
      <header className="relative z-50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Share & Earn</h1>
              <p className="text-xs text-gray-400">Invite Friends to Race</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs text-gray-400">Total Earned</p>
              <p className="text-sm font-bold text-green-400 animate-[earningsHighlight_3s_ease-in-out_infinite]">
                $3,530.20
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center">
              <i className="fas fa-share-alt text-electric-purple"></i>
            </div>
          </div>
        </div>
      </header>

      <ShareStats />
      <BonusHighlights />
      <ShareLink />
      <ShareBanners onShare={handleShare} />
      <SocialShare onShare={handleShare} />
      <NetworkTree />

      <ShareSuccessModal
        isOpen={showSuccessModal}
        platform={sharedPlatform}
        onClose={() => setShowSuccessModal(false)}
      />
    </main>
  );
}
