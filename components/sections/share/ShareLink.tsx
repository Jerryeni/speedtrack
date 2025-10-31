"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";
import QRCodeGenerator from "@/components/ui/QRCodeGenerator";

interface ShareLinkProps {
  referralLink?: string;
  shortLink?: string;
  referralCode?: string;
  isLoading: boolean;
}

export default function ShareLink({ referralLink, shortLink, referralCode, isLoading }: ShareLinkProps) {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const fullLink = referralLink || "Connect wallet to get your link";
  const displayShortLink = shortLink || "...";

  const copyReferralLink = () => {
    if (!referralLink) {
      showToast("Please connect your wallet first", 'error');
      return;
    }
    navigator.clipboard.writeText(fullLink);
    setCopiedFull(true);
    showToast("Referral link copied to clipboard!", 'success');
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const copyShortLink = () => {
    if (!referralLink) {
      showToast("Please connect your wallet first", 'error');
      return;
    }
    navigator.clipboard.writeText(displayShortLink);
    setCopiedShort(true);
    showToast("Short link copied to clipboard!", 'success');
    setTimeout(() => setCopiedShort(false), 2000);
  };

  const copyReferralCode = () => {
    if (!referralCode) {
      showToast("Please connect your wallet first", 'error');
      return;
    }
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast("Referral code copied to clipboard!", 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Your Referral Link</h3>
            <div className="flex items-center space-x-2">
              <i className="fas fa-link text-neon-blue"></i>
              <span className="text-xs text-neon-blue">Ready to Share</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <p className="text-xs text-gray-400 mb-1">Referral URL</p>
                <p className="text-sm font-orbitron text-neon-blue break-all">{referralLink}</p>
              </div>
              <button
                onClick={copyReferralLink}
                disabled={isLoading || !referralLink}
                className={`bg-neon-blue/20 text-neon-blue px-4 py-2 rounded-lg font-medium hover:bg-neon-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  copiedFull ? "animate-[linkCopy_0.5s_ease-out]" : ""
                }`}
              >
                <i className={`fas ${copiedFull ? "fa-check" : "fa-copy"} mr-2`}></i>
                {copiedFull ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <p className="text-xs text-gray-400 mb-1">Short Link</p>
                <p className="text-sm font-orbitron text-electric-purple">{displayShortLink}</p>
              </div>
              <button
                onClick={copyShortLink}
                disabled={isLoading || !referralLink}
                className={`bg-electric-purple/20 text-electric-purple px-4 py-2 rounded-lg font-medium hover:bg-electric-purple/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  copiedShort ? "animate-[linkCopy_0.5s_ease-out]" : ""
                }`}
              >
                <i className={`fas ${copiedShort ? "fa-check" : "fa-copy"} mr-2`}></i>
                {copiedShort ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-neon-blue/10 to-electric-purple/10 rounded-xl p-4 mb-4 border border-neon-blue/30">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <p className="text-xs text-gray-400 mb-1">Your Referral Code</p>
                <p className="text-2xl font-orbitron font-bold text-neon-blue tracking-wider">
                  {isLoading ? '...' : referralCode || 'XXXXXXXX'}
                </p>
              </div>
              <button
                onClick={copyReferralCode}
                disabled={isLoading || !referralCode}
                className={`bg-neon-blue/20 text-neon-blue px-4 py-2 rounded-lg font-medium hover:bg-neon-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  copiedCode ? "animate-[linkCopy_0.5s_ease-out]" : ""
                }`}
              >
                <i className={`fas ${copiedCode ? "fa-check" : "fa-copy"} mr-2`}></i>
                {copiedCode ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              <i className="fas fa-info-circle mr-1"></i>
              Share this code with friends to earn rewards
            </p>
          </div>

          <div className="text-center">
            <div
              onClick={() => referralLink && setShowQRModal(true)}
              className={`inline-block bg-white p-4 rounded-xl animate-[qrGlow_2s_ease-in-out_infinite] ${
                referralLink ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'
              } transition-transform`}
            >
              {referralLink && !isLoading ? (
                <QRCodeGenerator value={referralLink} size={128} />
              ) : (
                <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-qrcode text-4xl text-neon-blue"></i>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {referralLink ? 'Click to view full QR code' : 'QR Code for easy sharing'}
            </p>
          </div>
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
                Scan to join with code: <span className="text-neon-blue font-bold">{referralCode}</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl mb-6 flex items-center justify-center">
              <QRCodeGenerator value={referralLink} size={280} />
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-400 mb-2">Referral Link</p>
              <p className="text-sm font-orbitron text-neon-blue break-all">{referralLink}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  copyReferralLink();
                  setShowQRModal(false);
                }}
                className="bg-neon-blue/20 text-neon-blue px-4 py-3 rounded-xl font-medium hover:bg-neon-blue/30 transition-all"
              >
                <i className="fas fa-copy mr-2"></i>
                Copy Link
              </button>
              <button
                onClick={() => {
                  // Download QR code
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
