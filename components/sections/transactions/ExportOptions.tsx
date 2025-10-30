"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

export default function ExportOptions() {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportConfig, setExportConfig] = useState({
    includeHeaders: true,
    transactionIds: true,
    timestamps: true,
    blockchainHashes: false,
  });

  const handleExport = (format: string) => {
    setIsExporting(format);
    setTimeout(() => {
      setIsExporting(null);
      showToast(`${format.toUpperCase()} export completed successfully!`);
    }, 3000);
  };

  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <h3 className="font-orbitron font-bold mb-4">Export Transactions</h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleExport("csv")}
            disabled={isExporting === "csv"}
            className="bg-gradient-to-r from-neon-blue/10 to-neon-blue/5 rounded-xl p-4 border border-neon-blue/20 hover:border-neon-blue/40 transition-all animate-[exportGlow_3s_ease-in-out_infinite] disabled:opacity-50"
          >
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
                {isExporting === "csv" ? (
                  <i className="fas fa-spinner fa-spin text-neon-blue text-xl"></i>
                ) : (
                  <i className="fas fa-file-csv text-neon-blue text-xl"></i>
                )}
              </div>
            </div>
            <p className="font-semibold text-neon-blue mb-1">
              {isExporting === "csv" ? "Exporting..." : "Export CSV"}
            </p>
            <p className="text-xs text-gray-400">
              {isExporting === "csv" ? "Please wait" : "Spreadsheet format"}
            </p>
            {!isExporting && (
              <div className="mt-2 text-xs text-neon-blue">
                <i className="fas fa-download mr-1"></i>Download Data
              </div>
            )}
          </button>

          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting === "pdf"}
            className="bg-gradient-to-r from-electric-purple/10 to-electric-purple/5 rounded-xl p-4 border border-electric-purple/20 hover:border-electric-purple/40 transition-all disabled:opacity-50"
          >
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-electric-purple/20 flex items-center justify-center">
                {isExporting === "pdf" ? (
                  <i className="fas fa-spinner fa-spin text-electric-purple text-xl"></i>
                ) : (
                  <i className="fas fa-file-pdf text-electric-purple text-xl"></i>
                )}
              </div>
            </div>
            <p className="font-semibold text-electric-purple mb-1">
              {isExporting === "pdf" ? "Exporting..." : "Export PDF"}
            </p>
            <p className="text-xs text-gray-400">
              {isExporting === "pdf" ? "Please wait" : "Formatted report"}
            </p>
            {!isExporting && (
              <div className="mt-2 text-xs text-electric-purple">
                <i className="fas fa-file-export mr-1"></i>Generate Report
              </div>
            )}
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-800/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Export Options</span>
            <button className="text-xs text-neon-blue">
              <i className="fas fa-cog mr-1"></i>Configure
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={exportConfig.includeHeaders}
                onChange={(e) =>
                  setExportConfig({ ...exportConfig, includeHeaders: e.target.checked })
                }
                className="rounded"
              />
              <span>Include Headers</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={exportConfig.transactionIds}
                onChange={(e) =>
                  setExportConfig({ ...exportConfig, transactionIds: e.target.checked })
                }
                className="rounded"
              />
              <span>Transaction IDs</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={exportConfig.timestamps}
                onChange={(e) =>
                  setExportConfig({ ...exportConfig, timestamps: e.target.checked })
                }
                className="rounded"
              />
              <span>Timestamps</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={exportConfig.blockchainHashes}
                onChange={(e) =>
                  setExportConfig({ ...exportConfig, blockchainHashes: e.target.checked })
                }
                className="rounded"
              />
              <span>Blockchain Hashes</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
