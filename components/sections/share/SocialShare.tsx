"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { getReferralStats } from "@/lib/web3/referrals";

interface SocialShareProps {
  onShare: (platform: string) => void;
}

export default function SocialShare({ onShare }: SocialShareProps) {
  const { account } = useWeb3();
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    async function fetchReferralLink() {
      if (!account) return;
      
      try {
        const stats = await getReferralStats(account);
        setReferralLink(stats.referralLink || window.location.origin);
      } catch (error) {
        console.error('Error fetching referral link:', error);
        setReferralLink(window.location.origin);
      }
    }

    fetchReferralLink();
  }, [account]);

  const shareOnTelegram = () => {
    const text = encodeURIComponent(
      "🏁 Join me in RacePool - the ultimate Web3 racing platform! Earn up to 3% daily returns and build your racing empire. Start your engines! 🚀"
    );
    const url = encodeURIComponent(referralLink);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
    onShare("Telegram");
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `🏁 Join me in RacePool - the ultimate Web3 racing platform! Earn up to 3% daily returns and build your racing empire. Start your engines! 🚀\n\n${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    onShare("WhatsApp");
  };

  const shareOnX = () => {
    const text = encodeURIComponent(
      "🏁 Just joined RacePool - the hottest Web3 racing platform! Earning passive income while racing. Who wants to join my team? 🚀 #Web3 #Racing #CryptoEarnings"
    );
    const url = encodeURIComponent(referralLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    onShare("X (Twitter)");
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(referralLink);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    onShare("Facebook");
  };

  const platforms = [
    {
      name: "Telegram",
      icon: "fab fa-telegram",
      color: "blue",
      description: "Share with groups",
      onClick: shareOnTelegram,
      delay: "0s",
    },
    {
      name: "WhatsApp",
      icon: "fab fa-whatsapp",
      color: "green",
      description: "Share with contacts",
      onClick: shareOnWhatsApp,
      delay: "0.5s",
    },
    {
      name: "X (Twitter)",
      icon: "fab fa-x-twitter",
      color: "gray",
      description: "Tweet to followers",
      onClick: shareOnX,
      delay: "1s",
    },
    {
      name: "Facebook",
      icon: "fab fa-facebook",
      color: "blue",
      description: "Share with friends",
      onClick: shareOnFacebook,
      delay: "1.5s",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30 bg-blue-500/20 text-blue-400",
      green: "from-green-500/20 to-green-600/20 border-green-500/30 hover:from-green-500/30 hover:to-green-600/30 bg-green-500/20 text-green-400",
      gray: "from-gray-700/20 to-gray-800/20 border-gray-600/30 hover:from-gray-700/30 hover:to-gray-800/30 bg-gray-700/20 text-gray-300",
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="px-4 md:px-6 lg:px-8 mb-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-orbitron font-bold text-base md:text-lg">Share on Social Media</h3>
        </div>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {platforms.map((platform) => {
              const colorClasses = getColorClasses(platform.color);
              const [bgGradient, iconBg, textColor] = colorClasses.split(" bg-");
              
              return (
                <button
                  key={platform.name}
                  onClick={platform.onClick}
                  className={`bg-gradient-to-r ${bgGradient} border rounded-xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg animate-[socialFloat_3s_ease-in-out_infinite] active:scale-95 min-h-[120px]`}
                  style={{ animationDelay: platform.delay }}
                >
                  <div className={`min-w-[48px] min-h-[48px] rounded-full bg-${iconBg} flex items-center justify-center mx-auto mb-3`}>
                    <i className={`${platform.icon} ${textColor} text-xl`}></i>
                  </div>
                  <p className={`font-medium text-sm ${textColor}`}>{platform.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{platform.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
