"use client";

import { useRouter } from "next/navigation";
import { useWeb3 } from "@/lib/web3/Web3Context";
import IconCircle from "@/components/ui/IconCircle";
import Button from "@/components/ui/Button";

export default function JoinNow() {
  const router = useRouter();
  const { isConnected, connect } = useWeb3();

  const handleJoin = async () => {
    if (!isConnected) {
      await connect();
    } else {
      router.push('/dashboard');
    }
  };
  const features = [
    { icon: "fa-check", text: "No Lock-in Period" },
    { icon: "fa-check", text: "Instant Payouts" },
    { icon: "fa-check", text: "100% Transparent" },
    { icon: "fa-check", text: "24/7 Support" },
  ];

  return (
    <section className="px-4 mb-8">
      <div className="bg-gradient-to-br from-neon-blue/20 via-electric-purple/20 to-green-400/20 rounded-3xl p-6 border border-neon-blue/30">
        <div className="text-center">
          <IconCircle size="xl" className="mx-auto mb-6">
            <i className="fas fa-rocket text-3xl text-neon-blue animate-pulse-custom"></i>
          </IconCircle>

          <h2 className="text-2xl font-orbitron font-bold mb-4">Ready to Start Racing?</h2>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Join thousands of racers already earning 2X returns through our transparent blockchain system.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center space-x-4 text-sm">
              {features.slice(0, 2).map((feature) => (
                <div key={feature.text} className="flex items-center space-x-2">
                  <i className={`fas ${feature.icon} text-green-400`}></i>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm">
              {features.slice(2).map((feature) => (
                <div key={feature.text} className="flex items-center space-x-2">
                  <i className={`fas ${feature.icon} text-green-400`}></i>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleJoin}
            className="w-full py-4 rounded-2xl text-lg mb-4"
          >
            <i className="fas fa-flag-checkered mr-2"></i>
            {isConnected ? 'Go to Dashboard' : 'Join the Race Now'}
          </Button>

          <p className="text-xs text-gray-400">
            Start with as little as $10 • No hidden fees • Instant wallet connection
          </p>
        </div>
      </div>
    </section>
  );
}
