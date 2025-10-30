"use client";

import { showToast } from "@/lib/toast";

export default function ReferralTools() {
  const tools = [
    {
      icon: "fa-images",
      title: "Marketing Materials",
      description: "Banners, videos, and social media content",
      buttonText: "Download Assets",
      color: "neon-blue",
      action: () => showToast("Marketing materials download coming soon"),
    },
    {
      icon: "fa-chart-bar",
      title: "Analytics Dashboard",
      description: "Detailed performance metrics and insights",
      buttonText: "View Analytics",
      color: "electric-purple",
      action: () => showToast("Analytics dashboard coming soon"),
    },
    {
      icon: "fa-bullhorn",
      title: "Social Campaigns",
      description: "Pre-made campaigns for social platforms",
      buttonText: "Launch Campaign",
      color: "green-400",
      action: () => showToast("Social campaigns coming soon"),
    },
    {
      icon: "fa-envelope",
      title: "Email Templates",
      description: "Professional email templates for outreach",
      buttonText: "Get Templates",
      color: "yellow-400",
      action: () => showToast("Email templates coming soon"),
    },
  ];

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Referral Tools</h3>
      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-${tool.color}/10 to-transparent rounded-xl p-4 border border-${tool.color}/20`}
          >
            <i className={`fas ${tool.icon} text-${tool.color} text-2xl mb-3`}></i>
            <h4 className="font-semibold text-sm mb-2">{tool.title}</h4>
            <p className="text-xs text-gray-400 mb-3">{tool.description}</p>
            <button
              onClick={tool.action}
              className={`w-full py-2 bg-${tool.color}/20 hover:bg-${tool.color}/30 rounded-lg text-${tool.color} text-sm font-medium transition-colors`}
            >
              {tool.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
