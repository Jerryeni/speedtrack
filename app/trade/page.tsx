"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { sellST, calculateSellAmount, getSTPrice } from "@/lib/web3/trading";
import { showToast } from "@/lib/toast";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Button from "@/components/ui/Button";
import ProtectedPage from "@/components/guards/ProtectedPage";

export default function TradePage() {
  return (
    <ProtectedPage>
      <TradeContent />
    </ProtectedPage>
  );
}

function TradeContent() {
  const { account, balances, isConnected, isCorrectChain, refreshBalances } = useWeb3();
  const [sellAmount, setSellAmount] = useState("");
  const [estimatedUSDT, setEstimatedUSDT] = useState("0");
  const [sellPrice, setSellPrice] = useState("0.9");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const priceData = await getSTPrice();
        setSellPrice(priceData.sellPrice);
      } catch (error) {
        console.error("Failed to fetch price:", error);
      }
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function calculateEstimate() {
      if (sellAmount) {
        try {
          const usdt = await calculateSellAmount(sellAmount);
          setEstimatedUSDT(usdt);
        } catch (error) {
          setEstimatedUSDT("0");
        }
      }
    }

    calculateEstimate();
  }, [sellAmount]);

  const handleSell = async () => {
    if (!account || !isConnected || !isCorrectChain) {
      showToast("Please connect your wallet");
      return;
    }

    const amount = parseFloat(sellAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Please enter a valid amount");
      return;
    }

    if (amount > parseFloat(balances.st)) {
      showToast("Insufficient ST balance");
      return;
    }

    try {
      setIsProcessing(true);
      showToast("Processing sell transaction...");
      const tx = await sellST(sellAmount);
      await tx.wait();
      showToast("ST tokens sold successfully!");
      await refreshBalances();
      setSellAmount("");
      setEstimatedUSDT("0");
    } catch (error: any) {
      showToast(error.message || "Failed to sell ST tokens");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <Header />

      <section className="px-4 mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-orbitron font-bold text-neon-blue mb-2">
            Sell ST Tokens
          </h1>
          <p className="text-gray-400">Convert your ST tokens to USDT</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700">
          {/* Current Price Display */}
          <div className="bg-gray-800/50 rounded-xl p-4 text-center mb-6">
            <p className="text-xs text-gray-400 mb-1">Current Sell Price</p>
            <p className="text-3xl font-bold text-green-400">${sellPrice}</p>
            <p className="text-xs text-gray-500 mt-1">per ST token</p>
          </div>

          {/* ST Balance Display */}
          <div className="bg-gradient-to-r from-electric-purple/10 to-neon-blue/10 rounded-xl p-4 border border-electric-purple/30 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center">
                  <i className="fas fa-coins text-electric-purple"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Your ST Balance</p>
                  <p className="text-xl font-bold text-white">{parseFloat(balances.st).toFixed(4)} ST</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Worth</p>
                <p className="text-lg font-semibold text-green-400">
                  ${(parseFloat(balances.st) * parseFloat(sellPrice)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Sell Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Sell (ST)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-20 text-white focus:outline-none focus:border-neon-blue"
                  placeholder="0.00"
                  disabled={isProcessing}
                  step="0.01"
                />
                <button
                  type="button"
                  onClick={() => setSellAmount(balances.st)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neon-blue text-sm font-bold hover:text-electric-purple"
                  disabled={isProcessing}
                >
                  MAX
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Available: {parseFloat(balances.st).toFixed(4)} ST
              </p>
            </div>

            {/* Estimated USDT */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">You will receive</span>
                <span className="text-2xl font-bold text-green-400">
                  {parseFloat(estimatedUSDT).toFixed(4)} USDT
                </span>
              </div>
            </div>

            {/* Sell Button */}
            <Button
              onClick={handleSell}
              disabled={isProcessing || !sellAmount || parseFloat(sellAmount) <= 0}
              className="w-full py-4"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-exchange-alt mr-2"></i>
                  Sell ST Tokens
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-500/30">
          <h3 className="font-semibold mb-3">
            <i className="fas fa-info-circle mr-2"></i>
            How to Get ST Tokens
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-neon-blue font-bold text-xs">1</span>
              </div>
              <div>
                <p className="text-white font-medium">Invest in Pools</p>
                <p className="text-gray-400 text-xs">Get 10% of your investment as ST tokens automatically</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-electric-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-electric-purple font-bold text-xs">2</span>
              </div>
              <div>
                <p className="text-white font-medium">Accumulate Rewards</p>
                <p className="text-gray-400 text-xs">ST tokens accumulate with each investment you make</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-400 font-bold text-xs">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Sell Anytime</p>
                <p className="text-gray-400 text-xs">Convert your ST tokens to USDT whenever you want</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-500/30 mt-4">
          <h3 className="font-semibold mb-3 text-yellow-400">
            <i className="fas fa-chart-line mr-2"></i>
            Trading Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Trading Fee</span>
              <span className="text-white">0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Price Spread</span>
              <span className="text-white">10% (built into sell price)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Min. Sell Amount</span>
              <span className="text-white">0.01 ST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Instant Settlement</span>
              <span className="text-green-400">✓ Yes</span>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
