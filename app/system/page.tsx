"use client";

import { useRouter } from "next/navigation";
import SystemInfo from "@/components/sections/SystemInfo";
import BottomNav from "@/components/layout/BottomNav";

export default function SystemPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="relative z-50 px-4 py-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-white">
                System Configuration
              </h1>
              <p className="text-xs text-gray-400">Platform settings and percentages</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        <SystemInfo />
      </div>

      <BottomNav />
    </main>
  );
}
