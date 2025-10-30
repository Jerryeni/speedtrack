"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

export default function AccountPreferences() {
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [language, setLanguage] = useState("English");

  const toggleNotifications = () => {
    setNotifications(!notifications);
    showToast(notifications ? "Notifications disabled" : "Notifications enabled");
  };

  const togglePrivacy = () => {
    setPrivacy(!privacy);
    showToast(privacy ? "Privacy mode disabled" : "Privacy mode enabled");
  };

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-orbitron font-bold text-lg">Account Preferences</h3>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
                <i className="fas fa-bell text-neon-blue"></i>
              </div>
              <div>
                <h4 className="font-semibold text-white">Push Notifications</h4>
                <p className="text-xs text-gray-400">Race updates & rewards</p>
              </div>
            </div>
            <button
              onClick={toggleNotifications}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-neon-blue' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center">
                <i className="fas fa-eye-slash text-electric-purple"></i>
              </div>
              <div>
                <h4 className="font-semibold text-white">Privacy Mode</h4>
                <p className="text-xs text-gray-400">Hide earnings from leaderboard</p>
              </div>
            </div>
            <button
              onClick={togglePrivacy}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                privacy ? 'bg-electric-purple' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  privacy ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <i className="fas fa-globe text-green-400"></i>
              </div>
              <div>
                <h4 className="font-semibold text-white">Language</h4>
                <p className="text-xs text-gray-400">App display language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-green-400 focus:outline-none"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
