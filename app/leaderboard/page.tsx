"use client";

import { useState } from "react";
import TopPodium from "@/components/sections/leaderboard/TopPodium";
import FilterControls from "@/components/sections/leaderboard/FilterControls";
import LeaderboardTable from "@/components/sections/leaderboard/LeaderboardTable";
import GlobalStats from "@/components/sections/leaderboard/GlobalStats";
import AchievementBadges from "@/components/sections/leaderboard/AchievementBadges";
import ProfileModal from "@/components/modals/ProfileModal";

export default function LeaderboardPage() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    time: "all-time",
    category: "total-earnings",
    scope: "global",
  });

  return (
    <main className="min-h-screen pb-20">
      <header className="relative z-50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Leaderboard</h1>
              <p className="text-xs text-gray-400">Top Performers & Champions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <i className="fas fa-sync-alt text-neon-blue text-sm"></i>
            </button>
            <button className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center">
              <i className="fas fa-filter text-electric-purple text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      <TopPodium onViewProfile={setSelectedProfile} />
      <FilterControls filters={filters} setFilters={setFilters} />
      <LeaderboardTable onViewProfile={setSelectedProfile} />
      <GlobalStats />
      <AchievementBadges />

      <ProfileModal
        username={selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </main>
  );
}
