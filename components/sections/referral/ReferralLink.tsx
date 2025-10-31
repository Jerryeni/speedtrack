"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";
import QRCodeGenerator from "@/components/ui/QRCodeGenerator";

interface ReferralLinkProps {
  referralLink?: string;
  shortLink?: string;
  referralCode?: string;
  isLoading: boolean;
}

export default function ReferralLink({ referralLink, shortLink, referralCode, isLoading }: ReferralLinkProps) {
  const [showQRModal, setShowQRModal] = useState(false);

  const copyCode = () => {
    if (!referralCode) {
      showToast("Please connect your wallet first", 'error');
      return;
    }
    navigator.clipboard.writeText(referralCode);
    showToast("Referral code copied!", 'success');
  };

  const copyLink = () => {
    if (!referralLink) {
      showToast("Please connect your wallet first", 'error');
      return;
    }
    navigator.clipboard.writeText(referralLink);
    showToast("Referral link copied!", 'success');
  };

  const shareToTelegram = () => {
    if (!referralLink) {
      showToast("Please connect your wallet first", 'error');
      return;
    }
    const text = `🏎️ Join RacePool - The Ultimate Web3 Racing Finance Platform! Use my referral code: ${referralCode}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`);
  };

  const shareToTwitter = () => {
    if (!referralLink) {
      showToast("Please connect your wallet first", 'error');
      return;
    }
    const text = `🏎️ Join me on RacePool - Web3 Racing Finance! Use code: ${referralCode}\n${referralLink}\n#RacePool #Web3 #DeFi`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  };

  const shareToWhatsApp = () => {
    if (!referralLink) {
      showToast("Please connect your wallet first", 'error');
      return;
    }
    const text = `🏎️ Hey! Join RacePool - Web3 Racing Finance Platform.\n\nUse my referral code: ${referralCode}\nLink: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const shareMore = () => {
    if (!referralLink) {
      showToast("Please connect your wallet first", 'error');
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: "Join RacePool",
        text: `Join me on RacePool! Use code: ${referralCode}`,
        url: referralLink,
      });
    } else {
      showToast("Share feature not available on this device", 'info');
    }
  };

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Your Referral Link</h3>
          <div className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">Premium</div>
        </div>

        <div className="bg-gradient-to-r from-neon-blue/10 to-electric-purple/10 rounded-xl p-4 mb-4 border border-neon-blue/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Your Referral Code</p>
              <p className="font-mono text-xl sm:text-2xl font-bold text-neon-blue tracking-wider break-all">
                {isLoading ? '...' : referralCode || 'XXXXXXXX'}
              </p>
            </div>
            <button
              onClick={copyCode}
              disabled={isLoading || !referralCode}
              className="min-w-[44px] min-h-[44px] bg-neon-blue/20 hover:bg-neon-blue/30 rounded-lg flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-copy text-neon-blue"></i>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-3 mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Short Link</p>
              <button
                onClick={copyLink}
                disabled={isLoading || !referralLink}
                className="min-w-[44px] min-h-[44px] bg-electric-purple/20 hover:bg-electric-purple/30 rounded-lg flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-link text-electric-purple"></i>
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 overflow-x-auto">
              <p className="font-mono text-xs text-electric-purple whitespace-nowrap">
                {isLoading ? '...' : shortLink || 'Connect wallet'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-3 mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Full Link</p>
              <button
                onClick={() => referralLink && setShowQRModal(true)}
                disabled={isLoading || !referralLink}
                className="min-w-[44px] min-h-[44px] bg-green-500/20 hover:bg-green-500/30 rounded-lg flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-qrcode text-green-400"></i>
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 overflow-x-auto">
              <p className="font-mono text-xs text-white whitespace-nowrap">
                {isLoading ? '...' : referralLink || 'Connect wallet to get your link'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={shareToTelegram}
            className="bg-blue-600/20 hover:bg-blue-600/30 rounded-xl p-3 min-h-[80px] flex flex-col items-center justify-center space-y-2 transition-all active:scale-95"
          >
            <i className="fab fa-telegram text-blue-400 text-xl"></i>
            <span className="text-xs text-blue-400">Telegram</span>
          </button>
          <button
            onClick={shareToTwitter}
            className="bg-sky-600/20 hover:bg-sky-600/30 rounded-xl p-3 min-h-[80px] flex flex-col items-center justify-center space-y-2 transition-all active:scale-95"
          >
            <i className="fab fa-twitter text-sky-400 text-xl"></i>
            <span className="text-xs text-sky-400">Twitter</span>
          </button>
          <button
            onClick={shareToWhatsApp}
            className="bg-green-600/20 hover:bg-green-600/30 rounded-xl p-3 min-h-[80px] flex flex-col items-center justify-center space-y-2 transition-all active:scale-95"
          >
            <i className="fab fa-whatsapp text-green-400 text-xl"></i>
            <span className="text-xs text-green-400">WhatsApp</span>
          </button>
          <button
            onClick={shareMore}
            className="bg-gray-700/50 hover:bg-gray-700/70 rounded-xl p-3 min-h-[80px] flex flex-col items-center justify-center space-y-2 transition-all active:scale-95"
          >
            <i className="fas fa-share text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">More</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && referralLink && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setShowQRModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-700 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <i className="fas fa-times text-gray-400"></i>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center">
                <i className="fas fa-qrcode text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-neon-blue mb-2">
                Your Referral QR Code
              </h3>
              <p className="text-sm text-gray-400">
                Code: <span className="text-neon-blue font-bold">{referralCode}</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl mb-6 flex items-center justify-center">
              <QRCodeGenerator value={referralLink} size={280} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  copyLink();
                  setShowQRModal(false);
                }}
                className="bg-neon-blue/20 text-neon-blue px-4 py-3 rounded-xl font-medium hover:bg-neon-blue/30 transition-all"
              >
                <i className="fas fa-copy mr-2"></i>
                Copy Link
              </button>
              <button
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const url = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `referral-qr-${referralCode}.png`;
                    a.click();
                    showToast('QR code downloaded!', 'success');
                  }
                }}
                className="bg-electric-purple/20 text-electric-purple px-4 py-3 rounded-xl font-medium hover:bg-electric-purple/30 transition-all"
              >
                <i className="fas fa-download mr-2"></i>
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
