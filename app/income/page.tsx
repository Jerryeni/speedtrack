"use client";

import { useState } from "react";
import IncomeSummary from "@/components/sections/income/IncomeSummary";
import IncomeBreakdown from "@/components/sections/income/IncomeBreakdown";
import RecentTransactions from "@/components/sections/income/RecentTransactions";

export default function IncomePage() {
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

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
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Income Details</h1>
              <p className="text-xs text-gray-400">Comprehensive Earnings Overview</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center">
              <i className="fas fa-download text-electric-purple text-sm"></i>
            </div>
            <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <i className="fas fa-share text-neon-blue text-sm"></i>
            </div>
          </div>
        </div>
      </header>

      <IncomeSummary />
      <IncomeBreakdown filterType={filterType} />
      <RecentTransactions filterDate={filterDate} />
    </main>
  );
}
