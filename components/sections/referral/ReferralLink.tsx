"use client";

import { showToast } from "@/lib/toast";

export default function ReferralLink() {
  const referralCode = "RACE2024X7K9";
  const referralLink = "https://racepool.io/ref/RACE2024X7K9";

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    showToast("Referral code copied!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    showToast("Referral link copied!");
  };

  const shareToTelegram = () => {
    const text = `🏎️ Join RacePool - The Ultimate Web3 Racing Finance Platform! Use my referral link: ${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`);
  };

  const shareToTwitter = () => {
    const text = `🏎️ Join me on RacePool - Web3 Racing Finance! Start your racing journey: ${referralLink} #RacePool #Web3 #DeFi`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  };

  const shareToWhatsApp = () => {
    const text = `🏎️ Hey! Join RacePool - Web3 Racing Finance Platform. Use my referral link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const shareMore = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join RacePool",
        text: "Join me on RacePool - Web3 Racing Finance Platform!",
        url: referralLink,
      });
    } else {
      showToast("Share feature not available on this device");
    }
  };

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Your Referral Link</h3>
          <div className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">Premium</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-3">
              <p className="text-xs text-gray-400 mb-1">Referral Code</p>
              <p className="font-mono text-sm text-neon-blue">{referralCode}</p>
            </div>
            <button
              onClick={copyCode}
              className="w-10 h-10 bg-neon-blue/20 hover:bg-neon-blue/30 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
            >
              <i className="fas fa-copy text-neon-blue"></i>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-3">
              <p className="text-xs text-gray-400 mb-1">Full Link</p>
              <p className="font-mono text-xs text-white truncate">{referralLink}</p>
            </div>
            <button
              onClick={copyLink}
              className="w-10 h-10 bg-electric-purple/20 hover:bg-electric-purple/30 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
            >
              <i className="fas fa-link text-electric-purple"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={shareToTelegram}
            className="bg-blue-600/20 hover:bg-blue-600/30 rounded-xl p-3 flex flex-col items-center space-y-2 transition-all hover:-translate-y-0.5"
          >
            <i className="fab fa-telegram text-blue-400"></i>
            <span className="text-xs text-blue-400">Telegram</span>
          </button>
          <button
            onClick={shareToTwitter}
            className="bg-sky-600/20 hover:bg-sky-600/30 rounded-xl p-3 flex flex-col items-center space-y-2 transition-all hover:-translate-y-0.5"
          >
            <i className="fab fa-twitter text-sky-400"></i>
            <span className="text-xs text-sky-400">Twitter</span>
          </button>
          <button
            onClick={shareToWhatsApp}
            className="bg-green-600/20 hover:bg-green-600/30 rounded-xl p-3 flex flex-col items-center space-y-2 transition-all hover:-translate-y-0.5"
          >
            <i className="fab fa-whatsapp text-green-400"></i>
            <span className="text-xs text-green-400">WhatsApp</span>
          </button>
          <button
            onClick={shareMore}
            className="bg-gray-700/50 hover:bg-gray-700/70 rounded-xl p-3 flex flex-col items-center space-y-2 transition-all hover:-translate-y-0.5"
          >
            <i className="fas fa-share text-gray-400"></i>
            <span className="text-xs text-gray-400">More</span>
          </button>
        </div>
      </div>
    </section>
  );
}
