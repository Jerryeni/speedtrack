"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

export default function AccountActions() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast("Account data exported successfully!");
    }, 3000);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      showToast("Account deletion requires email verification");
    }
  };

  return (
    <section className="px-4 mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
      <div className="space-y-4">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-neon-blue/20 to-electric-purple/20 border border-neon-blue/30 rounded-2xl p-4 text-left hover:border-electric-purple/40 transition-all disabled:opacity-60"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
                <i className={`fas ${isExporting ? 'fa-spinner fa-spin' : 'fa-download'} text-neon-blue`}></i>
              </div>
              <div>
                <h4 className="font-semibold text-white">
                  {isExporting ? "Preparing Export..." : "Export Account Data"}
                </h4>
                <p className="text-xs text-gray-400">
                  {isExporting ? "This may take a few moments" : "Download your complete racing history"}
                </p>
              </div>
            </div>
            {!isExporting && <i className="fas fa-chevron-right text-gray-400"></i>}
          </div>
        </button>

        <button
          onClick={handleDelete}
          className="w-full bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-4 text-left hover:border-red-400/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <i className="fas fa-trash-alt text-red-400"></i>
              </div>
              <div>
                <h4 className="font-semibold text-red-400">Delete Account</h4>
                <p className="text-xs text-gray-400">Permanently remove your account</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
        </button>
      </div>
    </section>
  );
}
