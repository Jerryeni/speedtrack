"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

export default function ExportOptions() {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setIsExporting(format);
    setTimeout(() => {
      setIsExporting(null);
      showToast(`${format.toUpperCase()} report generated successfully!`);
    }, 2000);
  };

  const handleShare = () => {
    const shareData = {
      title: "My RacePool Income Report",
      text: "Check out my amazing income results on RacePool!",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      showToast("Link copied to clipboard!");
    }
  };

  const options = [
    {
      title: "PDF Report",
      description: "Detailed income report",
      icon: "fa-file-pdf",
      color: "neon-blue",
      action: () => handleExport("pdf"),
      format: "pdf",
    },
    {
      title: "CSV Export",
      description: "Raw transaction data",
      icon: "fa-file-csv",
      color: "electric-purple",
      action: () => handleExport("csv"),
      format: "csv",
    },
    {
      title: "Share Results",
      description: "Social media sharing",
      icon: "fa-share-alt",
      color: "green-400",
      action: handleShare,
      format: null,
    },
    {
      title: "Schedule Reports",
      description: "Automated delivery",
      icon: "fa-calendar-check",
      color: "yellow-400",
      action: () => showToast("Report scheduling coming soon!"),
      format: null,
    },
  ];

  return (
    <section className="px-4 mb-8">
      <h3 className="text-lg font-orbitron font-bold mb-4">Export & Share</h3>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={option.action}
            disabled={isExporting === option.format}
            className={`bg-gradient-to-r from-${option.color}/10 to-${option.color}/5 rounded-2xl p-4 border border-${option.color}/20 hover:border-${option.color}/40 transition-all disabled:opacity-60`}
          >
            <div className="flex items-center justify-center mb-3">
              <div className={`w-12 h-12 rounded-full bg-${option.color}/20 flex items-center justify-center`}>
                <i
                  className={`fas ${
                    isExporting === option.format ? "fa-spinner fa-spin" : option.icon
                  } text-${option.color} text-xl`}
                ></i>
              </div>
            </div>
            <p className={`font-semibold text-${option.color} mb-1`}>
              {isExporting === option.format ? "Generating..." : option.title}
            </p>
            <p className="text-xs text-gray-400">
              {isExporting === option.format ? "Please wait" : option.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
