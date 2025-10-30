"use client";

import { showToast } from "@/lib/toast";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRModal({ isOpen, onClose }: QRModalProps) {
  if (!isOpen) return null;

  const walletAddress = "0x9012...3456789ABCDEF";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Wallet QR Code",
        text: "Send funds to my RacePool wallet",
        url: window.location.href,
      });
    } else {
      showToast("QR code ready for sharing!");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold">Wallet QR Code</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-times text-gray-300"></i>
            </button>
          </div>
        </div>

        <div className="p-6 text-center">
          <div className="w-48 h-48 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center animate-[qrPulse_2s_ease-in-out_infinite]">
            <div className="w-40 h-40 bg-gray-900 rounded-xl flex items-center justify-center">
              <i className="fas fa-qrcode text-6xl text-neon-blue"></i>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4">Scan to send funds to your wallet</p>

          <div className="bg-gray-800 rounded-xl p-3 mb-4">
            <p className="font-orbitron text-xs text-neon-blue break-all">{walletAddress}</p>
          </div>

          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <i className="fas fa-share mr-2"></i>
            Share QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
