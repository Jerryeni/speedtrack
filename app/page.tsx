"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useWeb3 } from "@/lib/web3/Web3Context";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import PoolFlow from "@/components/sections/PoolFlow";
import About from "@/components/sections/About";
import Blockchain from "@/components/sections/Blockchain";
import HowItWorks from "@/components/sections/HowItWorks";
import JoinNow from "@/components/sections/JoinNow";
import RegistrationModal from "@/components/modals/RegistrationModal";

function HomeContent() {
  const searchParams = useSearchParams();
  const { account, isConnected } = useWeb3();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [userStatus, setUserStatus] = useState<{
    isRegistered: boolean;
    isActivated: boolean;
    isProfileComplete: boolean;
  }>({ isRegistered: false, isActivated: false, isProfileComplete: false });

  // Capture referral parameters from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const refCode = searchParams.get('ref');
    const refAddress = searchParams.get('address');
    
    if (refCode) {
      console.log('📋 Referral code detected in URL:', refCode);
      localStorage.setItem('pendingReferralCode', refCode);
    }
    
    if (refAddress) {
      console.log('📋 Referral address detected in URL:', refAddress);
      localStorage.setItem('pendingLeaderAddress', refAddress);
    }
    
    // If both are present, auto-trigger registration modal
    if (refCode && refAddress && !isCheckingStatus) {
      console.log('🎯 Auto-opening registration modal with referral data');
      setShowRegisterModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    async function checkUserStatus() {
      console.log('🔍 useEffect triggered:', { account, isConnected, isCheckingStatus });
      
      if (!account || !isConnected || isCheckingStatus) {
        console.log('⚠️ Skipping check:', { 
          hasAccount: !!account, 
          isConnected, 
          isCheckingStatus 
        });
        return;
      }
      
      // Check if URL params indicate user wants to register/activate
      const wantsToRegister = searchParams.get('register') === 'true';
      const wantsToActivate = searchParams.get('activate') === 'true';
      const wantsToCompleteProfile = searchParams.get('complete-profile') === 'true';
      
      // ALWAYS check user status when connected (removed the shouldCheck condition)
      // This ensures that after registration, refresh will show activation modal
      
      setIsCheckingStatus(true);
      
      try {
        console.log('=== CHECKING USER STATUS ===');
        console.log('Account:', account);
        
        const { checkAccountActivation, getUserDetails, isUserRegistered } = await import('@/lib/web3/activation');
        
        // Step 1: Check if user is registered
        console.log('Step 1: Checking if user is registered...');
        const isRegistered = await isUserRegistered(account);
        console.log('✓ User registered:', isRegistered);
        
        // Step 2: Check if user is activated
        console.log('Step 2: Checking if user is activated...');
        let isActivated = false;
        try {
          isActivated = await checkAccountActivation(account);
          console.log('✓ User activated:', isActivated);
        } catch (activationError) {
          console.log('Error checking activation:', activationError);
        }
        
        // Step 3: Check profile completion
        let profileCompleted = false;
        if (isActivated) {
          console.log('Step 3: Checking if profile is complete...');
          const userDetails = await getUserDetails(account);
          profileCompleted = userDetails.profileCompleted;
          console.log('✓ Profile completed:', profileCompleted);
        }
        
        // Update user status for floating button
        setUserStatus({
          isRegistered,
          isActivated,
          isProfileComplete: profileCompleted
        });
        
        // Show registration modal if not registered
        if (!isRegistered) {
          console.log('→ Showing Registration Modal');
          setShowRegisterModal(true);
          return;
        }
        
        // IMPORTANT: Hide registration modal if registered
        // This ensures registered users NEVER see the registration modal
        if (showRegisterModal) {
          console.log('🔒 Closing registration modal - user is already registered');
          setShowRegisterModal(false);
        }
        console.log('✓ User is registered - registration modal will NOT show');
        
        // If registered but not activated, and user came here wanting to activate
        if (!isActivated && wantsToActivate) {
          console.log('→ Redirecting to activation page');
          window.location.href = '/activate';
          return;
        }
        
        // If activated but profile not complete, and user came here wanting to complete profile
        if (isActivated && !profileCompleted && wantsToCompleteProfile) {
          console.log('→ Showing profile complete modal');
          // Profile completion happens via modal on dashboard
          window.location.href = '/dashboard';
          return;
        }
        
        // Otherwise, let users browse the landing page freely
        console.log('→ User can browse landing page');
        
      } catch (error) {
        console.error('=== ERROR CHECKING USER STATUS ===');
        console.error('Error:', error);
        // On error, only show registration modal if explicitly requested AND we couldn't verify registration
        // This prevents showing registration to already registered users
        if (wantsToRegister && !userStatus.isRegistered) {
          console.log('Fallback: Showing Registration Modal (user not verified as registered)');
          setShowRegisterModal(true);
        }
      } finally {
        setIsCheckingStatus(false);
      }
    }
    
    checkUserStatus();
  }, [account, isConnected, searchParams]);

  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <PoolFlow />
      <About />
      <Blockchain />
      <HowItWorks />
      <JoinNow />

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={async () => {
          console.log('✓ Registration successful!');
          setShowRegisterModal(false);
          
          // Wait a bit for blockchain state to update
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Force a full page reload to ensure fresh state
          console.log('→ Redirecting to activation page with fresh state');
          window.location.href = '/activate';
        }}
      />

      {/* Floating Banner - Show ONLY when registered but NOT activated */}
      {isConnected && userStatus.isRegistered && !userStatus.isActivated && !isCheckingStatus && (
        <div className="fixed bottom-6 right-6 z-40 animate-slide-in-right">
          <button
            onClick={() => window.location.href = '/activate'}
            className="bg-gradient-to-r from-neon-blue to-electric-purple rounded-2xl shadow-2xl hover:shadow-neon-blue/50 transition-all duration-300 flex items-center gap-3 px-6 py-4 group hover:scale-105"
          >
            <div className="relative">
              <i className="fas fa-rocket text-white text-3xl group-hover:animate-bounce"></i>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                !
              </span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">Registration Complete!</p>
              <p className="text-white/90 text-xs">Activate Now →</p>
            </div>
          </button>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
