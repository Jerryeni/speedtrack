"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WalletOption from "@/components/ui/WalletOption";
import StatCard from "@/components/ui/StatCard";
import NetworkCard from "@/components/ui/NetworkCard";
import HelpCard from "@/components/ui/HelpCard";
import ConnectionModal from "@/components/modals/ConnectionModal";
import WalletConnectSuccessModal from "@/components/modals/WalletConnectSuccessModal";

export default function WalletPage() {
  const router = useRouter();
  const [connectionStep, setConnectionStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const wallets = [
    {
      name: "MetaMask",
      description: "Most popular Web3 wallet",
      icon: "fab fa-ethereum",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-500",
      badges: [
        { text: "Recommended", color: "bg-neon-blue/20 text-neon-blue" },
        { text: "Available", color: "bg-green-500/20 text-green-400" },
      ],
    },
    {
      name: "Trust Wallet",
      description: "Secure mobile wallet",
      icon: "fas fa-shield-alt",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-500",
      badges: [
        { text: "Mobile Optimized", color: "bg-electric-purple/20 text-electric-purple" },
        { text: "Available", color: "bg-green-500/20 text-green-400" },
      ],
    },
    {
      name: "WalletConnect",
      description: "Connect via QR code",
      icon: "fas fa-qrcode",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-500",
      badges: [
        { text: "Universal", color: "bg-purple-500/20 text-purple-400" },
        { text: "Available", color: "bg-green-500/20 text-green-400" },
      ],
    },
    {
      name: "Coinbase Wallet",
      description: "Self-custody wallet",
      icon: "fas fa-coins",
      iconBg: "bg-blue-600/20",
      iconColor: "text-blue-600",
      badges: [
        { text: "Beginner Friendly", color: "bg-blue-600/20 text-blue-400" },
        { text: "Available", color: "bg-green-500/20 text-green-400" },
      ],
    },
  ];

  const networks = [
    {
      name: "Ethereum Mainnet",
      gas: "25 gwei",
      icon: "fab fa-ethereum",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-600/20",
    },
    {
      name: "Polygon",
      gas: "30 gwei",
      icon: "fas fa-layer-group",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-600/20",
    },
    {
      name: "Binance Smart Chain",
      gas: "5 gwei",
      icon: "fas fa-coins",
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-600/20",
    },
  ];

  const helpCards = [
    {
      icon: "fa-question-circle",
      iconColor: "text-neon-blue",
      title: "FAQ",
      description: "Common connection issues",
      gradient: "from-neon-blue/10",
      border: "border-neon-blue/20",
    },
    {
      icon: "fa-headset",
      iconColor: "text-electric-purple",
      title: "Live Support",
      description: "24/7 technical assistance",
      gradient: "from-electric-purple/10",
      border: "border-electric-purple/20",
    },
    {
      icon: "fa-book",
      iconColor: "text-green-400",
      title: "Guides",
      description: "Step-by-step tutorials",
      gradient: "from-green-500/10",
      border: "border-green-500/20",
    },
    {
      icon: "fa-comments",
      iconColor: "text-yellow-400",
      title: "Community",
      description: "Discord & Telegram",
      gradient: "from-yellow-500/10",
      border: "border-yellow-500/20",
    },
  ];

  const handleConnect = (walletName: string) => {
    setSelectedWallet(walletName);
    setIsConnecting(true);
    setConnectionStep(2);

    setTimeout(() => {
      const randomAddress = `0x${Math.random().toString(16).substring(2, 6).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`;
      setWalletAddress(randomAddress);
      setIsConnecting(false);
      setIsConnected(true);
      setConnectionStep(3);
    }, 3000);
  };

  const handleCancel = () => {
    setIsConnecting(false);
    setConnectionStep(1);
  };

  const handleProceed = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen">
      <header className="relative z-50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center">
              <i className="fas fa-rocket text-dark-primary text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Speed Track</h1>
              <p className="text-xs text-gray-400">Web3 Racing Finance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center">
              <i className="fas fa-bell text-electric-purple text-sm"></i>
            </div>
            <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <i className="fas fa-cog text-neon-blue text-sm"></i>
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 mb-6">
        <div className={`bg-gradient-to-r ${isConnected ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' : 'from-electric-purple/10 to-neon-blue/10 border-electric-purple/20'} rounded-2xl p-4 border`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400 animate-pulse-custom'}`}></div>
              <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : ''}`}>
                {isConnected ? 'Wallet Connected Successfully' : 'Initializing Connection'}
              </span>
            </div>
            <div className={`text-xs ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
              {isConnected ? 'Ready to Race' : `Step ${connectionStep} of 3`}
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full ${isConnected ? 'w-full bg-green-400' : 'racing-track'}`}></div>
          </div>
        </div>
      </section>

      <section className="px-4 mb-8">
        <div className="text-center mb-8">
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple p-1">
              <div className="w-full h-full rounded-full bg-dark-primary flex items-center justify-center">
                <i className="fas fa-tachometer-alt text-4xl text-neon-blue animate-[speedometer_3s_ease-in-out_infinite]"></i>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-electric-purple flex items-center justify-center">
              <i className="fas fa-bolt text-white text-sm"></i>
            </div>
          </div>
          <h2 className="text-2xl font-orbitron font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Choose your preferred wallet to start your Web3 racing journey
          </p>
        </div>
      </section>

      <section className="px-4 mb-8">
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <WalletOption
              key={wallet.name}
              {...wallet}
              onClick={() => handleConnect(wallet.name)}
            />
          ))}
        </div>
      </section>

      <section className="px-4 mb-8">
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <i className="fas fa-shield-alt text-green-400"></i>
            </div>
            <h3 className="font-semibold">Security Features</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-3">
              <i className="fas fa-lock text-neon-blue mb-2"></i>
              <p className="text-xs text-gray-300 font-medium">End-to-End Encryption</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3">
              <i className="fas fa-user-shield text-electric-purple mb-2"></i>
              <p className="text-xs text-gray-300 font-medium">Privacy Protection</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3">
              <i className="fas fa-fingerprint text-green-400 mb-2"></i>
              <p className="text-xs text-gray-300 font-medium">Biometric Auth</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3">
              <i className="fas fa-certificate text-yellow-400 mb-2"></i>
              <p className="text-xs text-gray-300 font-medium">Verified Contracts</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 mb-8">
        <h3 className="text-lg font-orbitron font-bold mb-4">Connection Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            layout="box"
            icon="fa-users"
            color="text-neon-blue"
            value="24,891"
            label="Connected Wallets"
            badge="Live"
            badgeColor="bg-neon-blue/20 text-neon-blue"
            gradient="from-neon-blue/10"
            border="border-neon-blue/20"
            progress={75}
          />
          <StatCard
            layout="box"
            icon="fa-bolt"
            color="text-electric-purple"
            value="0.8s"
            label="Avg Connection Time"
            badge="Fast"
            badgeColor="bg-electric-purple/20 text-electric-purple"
            gradient="from-electric-purple/10"
            border="border-electric-purple/20"
            progress={80}
          />
          <StatCard
            layout="box"
            icon="fa-check-circle"
            color="text-green-400"
            value="99.9%"
            label="Success Rate"
            badge="High"
            badgeColor="bg-green-500/20 text-green-400"
            gradient="from-green-500/10"
            border="border-green-500/20"
            progress={100}
          />
          <StatCard
            layout="box"
            icon="fa-network-wired"
            color="text-yellow-400"
            value="15"
            label="Supported Networks"
            badge="Multi"
            badgeColor="bg-yellow-500/20 text-yellow-400"
            gradient="from-yellow-500/10"
            border="border-yellow-500/20"
            progress={60}
          />
        </div>
      </section>

      <section className="px-4 mb-8">
        <h3 className="text-lg font-orbitron font-bold mb-4">Supported Networks</h3>
        <div className="space-y-3">
          {networks.map((network) => (
            <NetworkCard key={network.name} {...network} />
          ))}
        </div>
      </section>

      <section className="px-4 mb-8">
        <h3 className="text-lg font-orbitron font-bold mb-4">Need Help?</h3>
        <div className="grid grid-cols-2 gap-4">
          {helpCards.map((card) => (
            <HelpCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <ConnectionModal
        isOpen={isConnecting}
        walletName={selectedWallet}
        onCancel={handleCancel}
      />

      <WalletConnectSuccessModal
        isOpen={isConnected}
        walletAddress={walletAddress}
        walletName={selectedWallet}
        onProceed={handleProceed}
      />
    </main>
  );
}
