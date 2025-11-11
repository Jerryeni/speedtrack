"use client";

import { useState } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { runFullDiagnostics, verifyTransaction, verifyUserRegistration } from "@/lib/web3/diagnostics";
import { CONTRACTS, NETWORK_CONFIG } from "@/lib/web3/config";
import Button from "@/components/ui/Button";

export default function ContractDiagnostics() {
  const { account, isConnected } = useWeb3();
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [txHash, setTxHash] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRunDiagnostics = async () => {
    setIsRunning(true);
    const results = await runFullDiagnostics();
    setDiagnosticResults(results);
    setIsRunning(false);
  };

  const handleVerifyTx = async () => {
    if (!txHash) return;
    await verifyTransaction(txHash);
  };

  const handleVerifyUser = async () => {
    if (!account) return;
    await verifyUserRegistration(account);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-orbitron font-bold text-neon-blue mb-4">
          Contract Diagnostics
        </h2>
        <p className="text-gray-400 mb-6">
          Use this tool to verify contract connections and debug transaction issues
        </p>

        {/* Contract Addresses */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Contract Addresses</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">SpeedTrack:</span>
              <div className="flex items-center space-x-2">
                <code className="text-neon-blue font-mono">{CONTRACTS.SPEEDTRACK}</code>
                <a
                  href={`${NETWORK_CONFIG.blockExplorer}/address/${CONTRACTS.SPEEDTRACK}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-purple hover:text-electric-purple/80"
                >
                  <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">STToken:</span>
              <div className="flex items-center space-x-2">
                <code className="text-green-400 font-mono">{CONTRACTS.STTOKEN}</code>
                <a
                  href={`${NETWORK_CONFIG.blockExplorer}/address/${CONTRACTS.STTOKEN}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-purple hover:text-electric-purple/80"
                >
                  <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">USDT:</span>
              <div className="flex items-center space-x-2">
                <code className="text-yellow-400 font-mono">{CONTRACTS.USDT}</code>
                <a
                  href={`${NETWORK_CONFIG.blockExplorer}/address/${CONTRACTS.USDT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-purple hover:text-electric-purple/80"
                >
                  <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Network Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Network Configuration</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">Network:</span>
              <span className="text-white">{NETWORK_CONFIG.name}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">Chain ID:</span>
              <span className="text-white">{NETWORK_CONFIG.chainId}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">RPC URL:</span>
              <span className="text-white text-xs">{NETWORK_CONFIG.rpcUrl}</span>
            </div>
          </div>
        </div>

        {/* Run Full Diagnostics */}
        <div className="mb-6">
          <Button
            onClick={handleRunDiagnostics}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Running Diagnostics...
              </>
            ) : (
              <>
                <i className="fas fa-stethoscope mr-2"></i>
                Run Full Diagnostics
              </>
            )}
          </Button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Check browser console for detailed output
          </p>
        </div>

        {/* Verify Transaction */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Verify Transaction</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Enter transaction hash (0x...)"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm"
            />
            <Button onClick={handleVerifyTx} disabled={!txHash}>
              <i className="fas fa-search"></i>
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Paste a transaction hash to verify it on-chain
          </p>
        </div>

        {/* Verify User Registration */}
        {isConnected && account && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Verify Your Registration</h3>
            <Button onClick={handleVerifyUser} className="w-full">
              <i className="fas fa-user-check mr-2"></i>
              Check My Registration Status
            </Button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Verify your account is registered on-chain
            </p>
          </div>
        )}

        {/* Diagnostic Results */}
        {diagnosticResults && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Diagnostic Results</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(diagnosticResults, null, 2)}
              </pre>
            </div>
            {diagnosticResults.errors && diagnosticResults.errors.length > 0 && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-2">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Errors Found:
                </h4>
                <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                  {diagnosticResults.errors.map((error: string, i: number) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`${NETWORK_CONFIG.blockExplorer}/address/${CONTRACTS.SPEEDTRACK}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg hover:bg-neon-blue/20 transition-colors"
            >
              <i className="fas fa-file-contract text-neon-blue"></i>
              <span className="text-sm text-neon-blue">View Contract</span>
            </a>
            {account && (
              <a
                href={`${NETWORK_CONFIG.blockExplorer}/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 p-3 bg-electric-purple/10 border border-electric-purple/30 rounded-lg hover:bg-electric-purple/20 transition-colors"
              >
                <i className="fas fa-wallet text-electric-purple"></i>
                <span className="text-sm text-electric-purple">My Transactions</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-3 text-yellow-400">
          <i className="fas fa-info-circle mr-2"></i>
          How to Use
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
          <li>Click "Run Full Diagnostics" to check all connections</li>
          <li>Open browser console (F12) to see detailed logs</li>
          <li>If you have a transaction hash, paste it to verify</li>
          <li>Check your registration status if connected</li>
          <li>Use the quick links to view contracts on BSCScan</li>
        </ol>
      </div>
    </div>
  );
}
