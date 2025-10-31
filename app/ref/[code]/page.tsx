"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getWalletFromCode, isValidReferralCode, storeReferralMapping } from "@/lib/web3/referralCode";
import { showToast } from "@/lib/toast";

export default function ReferralPage() {
  const params = useParams();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string>("");
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const code = params.code as string;
    if (code) {
      setReferralCode(code.toUpperCase());
      
      // Validate code format
      const valid = isValidReferralCode(code);
      setIsValid(valid);
      
      if (valid) {
        // Store referral code in localStorage for later use during activation
        const upperCode = code.toUpperCase();
        localStorage.setItem('pendingReferralCode', upperCode);
        console.log('✅ Stored referral code:', upperCode);
        
        // Try to get wallet address from code and store it too
        const walletAddress = getWalletFromCode(upperCode);
        if (walletAddress) {
          localStorage.setItem('pendingReferrerAddress', walletAddress);
          console.log('✅ Found wallet in mapping:', walletAddress);
          showToast(`Referral code ${upperCode} saved! Referrer will auto-fill.`, 'success');
        } else {
          // If no mapping exists, check if there's a wallet parameter in URL
          const searchParams = new URLSearchParams(window.location.search);
          const walletParam = searchParams.get('wallet');
          
          console.log('🔍 No mapping found for code:', upperCode);
          console.log('🔍 Checking URL parameter...');
          console.log('🔍 Full URL:', window.location.href);
          console.log('🔍 Wallet param:', walletParam);
          
          if (walletParam) {
            // Store the mapping for future use
            storeReferralMapping(upperCode, walletParam);
            localStorage.setItem('pendingReferrerAddress', walletParam);
            console.log('✅ Stored referrer address from URL:', walletParam);
            showToast(`Referral code ${upperCode} saved! Referrer will auto-fill.`, 'success');
          } else {
            console.log('⚠️ No wallet address found for code:', upperCode);
            console.log('⚠️ User will need to enter referrer address manually');
            showToast(`Referral code ${upperCode} saved! You'll need to enter referrer address manually.`, 'info');
          }
        }
      } else {
        showToast('Invalid referral code format', 'error');
      }
      
      setIsChecking(false);
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  }, [params.code, router]);

  if (isChecking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-primary via-gray-900 to-dark-primary">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center animate-pulse">
            <i className="fas fa-spinner fa-spin text-white text-3xl"></i>
          </div>
          <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
            Checking Referral Code...
          </h2>
          <p className="text-gray-400">Please wait</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-primary via-gray-900 to-dark-primary">
      <div className="text-center px-4 max-w-md">
        {isValid ? (
          <>
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center animate-bounce">
              <i className="fas fa-check text-white text-4xl"></i>
            </div>
            <h2 className="text-3xl font-orbitron font-bold text-green-400 mb-4">
              Referral Code Accepted!
            </h2>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-green-500/30 mb-6">
              <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
              <p className="text-3xl font-orbitron font-bold text-neon-blue tracking-wider mb-4">
                {referralCode}
              </p>
              <p className="text-sm text-gray-300 mb-3">
                This code has been saved. Connect your wallet and activate your account to start earning!
              </p>
              {(() => {
                const searchParams = new URLSearchParams(window.location.search);
                const walletParam = searchParams.get('wallet');
                const storedAddress = localStorage.getItem('pendingReferrerAddress');
                
                if (storedAddress) {
                  return (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-3">
                      <p className="text-xs text-green-400">
                        <i className="fas fa-check-circle mr-1"></i>
                        Referrer address saved! It will auto-fill during activation.
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-3">
                      <p className="text-xs text-yellow-400">
                        <i className="fas fa-info-circle mr-1"></i>
                        You'll need to enter the referrer address manually during activation.
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-400">
                <i className="fas fa-info-circle mr-2"></i>
                Redirecting you to the homepage...
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all"
            >
              <i className="fas fa-home mr-2"></i>
              Go to Homepage Now
            </button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
              <i className="fas fa-times text-white text-4xl"></i>
            </div>
            <h2 className="text-3xl font-orbitron font-bold text-red-400 mb-4">
              Invalid Referral Code
            </h2>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-red-500/30 mb-6">
              <p className="text-sm text-gray-400 mb-2">Code Provided</p>
              <p className="text-2xl font-orbitron font-bold text-gray-500 tracking-wider mb-4">
                {referralCode || 'NONE'}
              </p>
              <p className="text-sm text-gray-300">
                The referral code format is invalid. Please check with your referrer for the correct code.
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all"
            >
              <i className="fas fa-home mr-2"></i>
              Go to Homepage
            </button>
          </>
        )}
      </div>
    </main>
  );
}
