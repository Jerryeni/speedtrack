"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { buyST, sellST, calculateSTAmount, calculateSellAmount, getSTPrice } from "@/lib/web3/trading";
import { showToast } from "@/lib/toast";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Button from "@/components/ui/Button";

export default function TradePage() {
  const { account, balances, isConnected, isCorrectChain, refreshBalances } = useWeb3();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [estimatedST, setEstimatedST] = useState("0");
  const [estimatedUSDT, setEstimatedUSDT] = useState("0");
  const [prices, setPrices] = useState({ buyPrice: "1.0", sellPrice: "0.9" });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const priceData = await getSTPrice();
        setPrices(priceData);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function calculateEstimate() {
      if (activeTab === "buy" && buyAmount) {
        try {
          const st = await calculateSTAmount(buyAmount);
          setEstimatedST(st);
        } catch (error) {
          setEstimatedST("0");
        }
      }
    }

    calculateEstimate();
  }, [buyAmount, activeTab]);

  useEffect(() => {
    async function calculateEstimate() {
      if (activeTab === "sell" && sellAmount) {
        try {
          const usdt = await calculateSellAmount(sellAmount);
          setEstimatedUSDT(usdt);
        } catch (error) {
          setEstimatedUSDT("0");
        }
      }
    }

    calculateEstimate();
  }, [sellAmount, activeTab]);

  const handleBuy = async () => {
    if (!account || !isConnected || !isCorrectChain) {
      showToast("Please connect your wallet");
      return;
    }

    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Please enter a valid amount");
      return;
    }

    if (amount > parseFloat(balances.usdt)) {
      showToast("Insufficient USDT balance");
      return;
    }

    try {
      setIsProcessing(true);
      showToast("Processing buy transaction...");
      const tx = await buyST(buyAmount, account);
      await tx.wait();
      showToast("ST tokens purchased successfully!");
      await refreshBalances();
      setBuyAmount("");
      setEstimatedST("0");
    } catch (error: any) {
      showToast(error.message || "Failed to buy ST tokens");
    } finally {
      setIsProcessing(false);
    }
  };

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
            Trade ST Tokens
          </h1>
          <p className="text-gray-400">Buy and sell Speed Track tokens</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Buy Price</p>
              <p className="text-xl font-bold text-green-400">${prices.buyPrice}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Sell Price</p>
              <p className="text-xl font-bold text-red-400">${prices.sellPrice}</p>
            </div>
          </div>

          <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab("buy")}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "buy"
                  ? "bg-gradient-to-r from-neon-blue to-electric-purple text-white"
                  : "text-gray-400"
              }`}
            >
              Buy ST
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "sell"
                  ? "bg-gradient-to-r from-neon-blue to-electric-purple text-white"
                  : "text-gray-400"
              }`}
            >
              Sell ST
            </button>
          </div>

          {activeTab === "buy" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (USDT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-20 text-white focus:outline-none focus:border-neon-blue"
                    placeholder="0.00"
                    disabled={isProcessing}
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={() => setBuyAmount(balances.usdt)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neon-blue text-sm font-bold hover:text-electric-purple"
                    disabled={isProcessing}
                  >
                    MAX
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Balance: {parseFloat(balances.usdt).toFixed(2)} USDT
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">You will receive</span>
                  <span className="text-lg font-bold text-neon-blue">
                    {parseFloat(estimatedST).toFixed(4)} ST
                  </span>
                </div>
              </div>

              <Button
                onClick={handleBuy}
                disabled={isProcessing || !buyAmount}
                className="w-full py-4"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Buy ST Tokens
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (ST)
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
                  Balance: {parseFloat(balances.st).toFixed(2)} ST
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">You will receive</span>
                  <span className="text-lg font-bold text-green-400">
                    {parseFloat(estimatedUSDT).toFixed(4)} USDT
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSell}
                disabled={isProcessing || !sellAmount}
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
          )}
        </div>
      </section>

      <section className="px-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-500/30">
          <h3 className="font-semibold mb-3">Trading Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Trading Fee</span>
              <span className="text-white">0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Slippage</span>
              <span className="text-white">~0.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Min. Trade</span>
              <span className="text-white">1 USDT</span>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
