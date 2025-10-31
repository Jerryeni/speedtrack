"use client";

import { showToast } from "@/lib/toast";

interface ShareBannersProps {
  onShare: (platform: string) => void;
}

export default function ShareBanners({ onShare }: ShareBannersProps) {
  const banners = [
    {
      icon: "fa-rocket",
      title: "Join the Racing Pool!",
      description: "Earn up to 3% daily returns",
      gradient: "from-neon-blue/20 to-electric-purple/20",
      borderColor: "border-neon-blue/30",
      buttonColor: "bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30",
      iconGradient: "from-neon-blue to-electric-purple",
    },
    {
      icon: "fa-trophy",
      title: "Be a Racing Champion!",
      description: "Compete & earn with Web3 racing",
      gradient: "from-electric-purple/20 to-green-400/20",
      borderColor: "border-electric-purple/30",
      buttonColor: "bg-electric-purple/20 text-electric-purple hover:bg-electric-purple/30",
      iconGradient: "from-electric-purple to-green-400",
    },
    {
      icon: "fa-coins",
      title: "Start Earning Today!",
      description: "Join 10,000+ active racers",
      gradient: "from-green-400/20 to-yellow-400/20",
      borderColor: "border-green-400/30",
      buttonColor: "bg-green-400/20 text-green-400 hover:bg-green-400/30",
      iconGradient: "from-green-400 to-yellow-400",
    },
  ];

  const handleShare = (index: number) => {
    showToast("Opening share options...");
  };

  return (
    <section className="px-4 md:px-6 lg:px-8 mb-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-base md:text-lg">Ready-to-Share Banners</h3>
            <button
              onClick={() => showToast("Banner download feature coming soon!")}
              className="text-green-400 hover:text-neon-blue transition-colors"
            >
              <i className="fas fa-download"></i>
            </button>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${banner.gradient} rounded-xl p-4 border ${banner.borderColor} animate-[bannerGlow_4s_ease-in-out_infinite] animate-[bannerSlide_0.6s_ease-out]`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`min-w-[48px] min-h-[48px] rounded-full bg-gradient-to-r ${banner.iconGradient} flex items-center justify-center`}
                    >
                      <i className={`fas ${banner.icon} text-dark-primary text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-orbitron font-bold text-white text-sm md:text-base">{banner.title}</h4>
                      <p className="text-xs text-gray-300">{banner.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleShare(index)}
                    className={`${banner.buttonColor} min-h-[44px] px-3 py-2 rounded-lg text-sm transition-colors active:scale-95 w-full`}
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
