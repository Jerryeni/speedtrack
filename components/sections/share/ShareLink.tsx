"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

export default function ShareLink() {
  const referralLink = "https://racepool.io/ref/RX7K9M2P";
  const shortLink = "racepool.io/RX7K9M2P";
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedFull(true);
    showToast("Referral link copied to clipboard!");
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const copyShortLink = () => {
    navigator.clipboard.writeText(shortLink);
    setCopiedShort(true);
    showToast("Short link copied to clipboard!");
    setTimeout(() => setCopiedShort(false), 2000);
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
                className={`bg-neon-blue/20 text-neon-blue px-4 py-2 rounded-lg font-medium hover:bg-neon-blue/30 transition-all ${
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
                <p className="text-sm font-orbitron text-electric-purple">{shortLink}</p>
              </div>
              <button
                onClick={copyShortLink}
                className={`bg-electric-purple/20 text-electric-purple px-4 py-2 rounded-lg font-medium hover:bg-electric-purple/30 transition-all ${
                  copiedShort ? "animate-[linkCopy_0.5s_ease-out]" : ""
                }`}
              >
                <i className={`fas ${copiedShort ? "fa-check" : "fa-copy"} mr-2`}></i>
                {copiedShort ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="text-center">
            <div
              onClick={copyReferralLink}
              className="inline-block bg-white p-4 rounded-xl animate-[qrGlow_2s_ease-in-out_infinite] cursor-pointer"
            >
              <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center">
                <i className="fas fa-qrcode text-4xl text-neon-blue"></i>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">QR Code for easy sharing</p>
          </div>
        </div>
      </div>
    </section>
  );
}
