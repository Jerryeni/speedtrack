"use client";

import ContractDiagnostics from "@/components/dev/ContractDiagnostics";
import Link from "next/link";

export default function DiagnosticsPage() {
  return (
    <main className="min-h-screen pb-20 bg-dark-primary">
      <header className="relative z-50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <i className="fas fa-arrow-left text-neon-blue"></i>
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">
                Contract Diagnostics
              </h1>
              <p className="text-xs text-gray-400">Debug & Verify Connections</p>
            </div>
          </div>
        </div>
      </header>

      <ContractDiagnostics />
    </main>
  );
}
