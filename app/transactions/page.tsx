"use client";

import { useState } from "react";
import TransactionSummary from "@/components/sections/transactions/TransactionSummary";
import FilterControls from "@/components/sections/transactions/FilterControls";
// import TransactionTable from "@/components/sections/transactions/TransactionTable";
import ExportOptions from "@/components/sections/transactions/ExportOptions";
import TransactionTable from "@/components/sections/transactions/TransactionTable";
import TransactionModal from "@/components/modals/TransactionModal";
// import TransactionModal from "@/components/modals/TransactionModal";

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    startDate: "",
    endDate: "",
    period: "all",
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
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Transactions</h1>
              <p className="text-xs text-gray-400">Complete Transaction History</p>
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

      <TransactionSummary />
      <FilterControls filters={filters} setFilters={setFilters} />
      <TransactionTable onViewTransaction={setSelectedTransaction} />
      <ExportOptions />

      <TransactionModal
        transactionId={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </main>
  );
}
