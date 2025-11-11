"use client";

import { useRouter } from "next/navigation";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { useState, useEffect } from "react";
import IconCircle from "@/components/ui/IconCircle";
import Button from "@/components/ui/Button";

export default function JoinNow() {
  const router = useRouter();
  const { isConnected, connect, account } = useWeb3();
  const [userStatus, setUserStatus] = useState<'unknown' | 'new' | 'registered' | 'activated'>('unknown');

  useEffect(() => {
    async function checkStatus() {
      if (!account || !isConnected) {
        setUserStatus('new');
        return;
      }

      try {
        const { checkAccountActivation, isUserRegistered } = await import('@/lib/web3/activation');
        
        // Check if registered first
        const isRegistered = await isUserRegistered(account);
        if (!isRegistered) {
          setUserStatus('new');
          return;
        }
        
        // Check if activated
        const isActivated = await checkAccountActivation(account);
        if (isActivated) {
          setUserStatus('activated');
          return;
        }

        // Registered but not activated
        setUserStatus('registered');
      } catch (error) {
        console.error('Error checking user status:', error);
        setUserStatus('new');
      }
    }

    checkStatus();
  }, [account, isConnected]);

  const handleJoin = async () => {
    if (!isConnected) {
      await connect();
    } else if (userStatus === 'new') {
      // Not registered - show registration modal
      router.push('/?register=true');
    } else if (userStatus === 'registered') {
      // Registered but not activated - go to activation page
      router.push('/activate');
    } else if (userStatus === 'activated') {
      // Fully activated - go to dashboard
      router.push('/dashboard');
    } else {
      // Unknown status - show registration
      router.push('/?register=true');
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
            {userStatus === 'registered' ? (
              <>
                <i className="fas fa-rocket mr-2"></i>
                Activate Your Account
              </>
            ) : userStatus === 'activated' ? (
              <>
                <i className="fas fa-tachometer-alt mr-2"></i>
                Go to Dashboard
              </>
            ) : (
              <>
                <i className="fas fa-flag-checkered mr-2"></i>
                {isConnected ? 'Register Now' : 'Join the Race Now'}
              </>
            )}
          </Button>

          <p className="text-xs text-gray-400">
            Start with as little as $10 • No hidden fees • Instant wallet connection
          </p>
        </div>
      </div>
    </section>
  );
}
