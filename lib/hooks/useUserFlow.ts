import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/lib/web3/Web3Context';
import { getUserDetails, checkAccountActivation, getUserId } from '@/lib/web3/activation';

export interface UserFlowState {
  isConnected: boolean;
  isRegistered: boolean;
  isActivated: boolean;
  isProfileComplete: boolean;
  isLoading: boolean;
  currentStep: 'connect' | 'register' | 'activate' | 'profile' | 'complete';
  canAccessDashboard: boolean;
}

/**
 * Hook to manage and enforce user onboarding flow
 * Flow: Connect Wallet → Register → Activate → Complete Profile → Dashboard
 */
export function useUserFlow() {
  const router = useRouter();
  const { account, isConnected, isCorrectChain } = useWeb3();
  const [flowState, setFlowState] = useState<UserFlowState>({
    isConnected: false,
    isRegistered: false,
    isActivated: false,
    isProfileComplete: false,
    isLoading: true,
    currentStep: 'connect',
    canAccessDashboard: false
  });
  const [retryCount, setRetryCount] = useState(0);
  const [lastSuccessfulCheck, setLastSuccessfulCheck] = useState<string | null>(null);

  useEffect(() => {
    async function checkUserFlow() {
      // Step 1: Check wallet connection
      if (!isConnected || !account || !isCorrectChain) {
        setFlowState({
          isConnected: false,
          isRegistered: false,
          isActivated: false,
          isProfileComplete: false,
          isLoading: false,
          currentStep: 'connect',
          canAccessDashboard: false
        });
        setLastSuccessfulCheck(null);
        return;
      }

      // Use cached result if available and account hasn't changed
      const cacheKey = `flow_${account}`;
      if (lastSuccessfulCheck === cacheKey && retryCount === 0) {
        console.log('✅ Using cached flow state for:', account);
        return;
      }

      try {
        setFlowState(prev => ({ ...prev, isLoading: true }));

        console.log('🔍 Checking user flow for:', account);

        // Step 2: Check registration (using getUserId - most reliable)
        const userId = await getUserId(account);
        const userIdNum = parseInt(userId);
        const isRegistered = userId !== '0' && userIdNum > 0;
        
        console.log('📋 Registration check:', { userId, userIdNum, isRegistered });
        
        if (!isRegistered) {
          console.log('❌ User not registered, stopping flow check');
          setFlowState({
            isConnected: true,
            isRegistered: false,
            isActivated: false,
            isProfileComplete: false,
            isLoading: false,
            currentStep: 'register',
            canAccessDashboard: false
          });
          return;
        }

        // Step 3: Check activation
        const isActivated = await checkAccountActivation(account);
        console.log('🔓 Activation check:', { isActivated });
        
        if (!isActivated) {
          console.log('❌ User not activated, stopping flow check');
          setFlowState({
            isConnected: true,
            isRegistered: true,
            isActivated: false,
            isProfileComplete: false,
            isLoading: false,
            currentStep: 'activate',
            canAccessDashboard: false
          });
          return;
        }

        // Step 4: Check profile completion
        const userDetails = await getUserDetails(account);
        const isProfileComplete = userDetails.profileCompleted === true;
        console.log('👤 Profile check:', { isProfileComplete, name: userDetails.name });
        
        if (!isProfileComplete) {
          console.log('❌ Profile not complete, stopping flow check');
          setFlowState({
            isConnected: true,
            isRegistered: true,
            isActivated: true,
            isProfileComplete: false,
            isLoading: false,
            currentStep: 'profile',
            canAccessDashboard: false
          });
          return;
        }

        // All steps complete - user can access dashboard
        console.log('✅ All flow checks passed! User can access dashboard');
        setFlowState({
          isConnected: true,
          isRegistered: true,
          isActivated: true,
          isProfileComplete: true,
          isLoading: false,
          currentStep: 'complete',
          canAccessDashboard: true
        });
        
        // Cache successful check
        setLastSuccessfulCheck(`flow_${account}`);
        setRetryCount(0);

      } catch (error) {
        console.error('❌ Error checking user flow:', error);
        
        // Implement retry logic with exponential backoff
        if (retryCount < 3) {
          console.log(`⚠️ Retrying flow check (attempt ${retryCount + 1}/3)...`);
          setRetryCount(prev => prev + 1);
          
          // Retry after a delay
          setTimeout(() => {
            checkUserFlow();
          }, 1000 * (retryCount + 1)); // 1s, 2s, 3s delays
          
          return;
        }
        
        // After max retries, keep previous state if available
        console.error('❌ Max retries reached. Preserving previous state.');
        setFlowState(prev => ({
          ...prev,
          isLoading: false,
          // If we had a previous successful state, keep it
          // Otherwise, stay in connect state to avoid false redirects
          currentStep: prev.isRegistered ? prev.currentStep : 'connect'
        }));
        setRetryCount(0);
      }
    }

    checkUserFlow();
  }, [account, isConnected, isCorrectChain, retryCount]);

  /**
   * Redirect to appropriate step if user tries to access dashboard prematurely
   */
  const enforceFlow = (targetPath: string = '/dashboard') => {
    if (flowState.isLoading) return;

    if (!flowState.isConnected) {
      router.push('/');
      return false;
    }

    if (!flowState.isRegistered) {
      router.push('/?register=true');
      return false;
    }

    if (!flowState.isActivated) {
      router.push('/?activate=true');
      return false;
    }

    if (!flowState.isProfileComplete) {
      router.push('/?complete-profile=true');
      return false;
    }

    return true;
  };

  /**
   * Get user-friendly message for current step
   */
  const getStepMessage = (): string => {
    switch (flowState.currentStep) {
      case 'connect':
        return 'Please connect your wallet to continue';
      case 'register':
        return 'Please register your account with a referral code';
      case 'activate':
        return 'Please activate your account to access features';
      case 'profile':
        return 'Please complete your profile to access dashboard';
      case 'complete':
        return 'Welcome! Your account is fully set up';
      default:
        return '';
    }
  };

  /**
   * Get next action for user
   */
  const getNextAction = (): { label: string; action: () => void } | null => {
    switch (flowState.currentStep) {
      case 'connect':
        return {
          label: 'Connect Wallet',
          action: () => router.push('/')
        };
      case 'register':
        return {
          label: 'Register Now',
          action: () => router.push('/?register=true')
        };
      case 'activate':
        return {
          label: 'Activate Account',
          action: () => router.push('/?activate=true')
        };
      case 'profile':
        return {
          label: 'Complete Profile',
          action: () => router.push('/?complete-profile=true')
        };
      default:
        return null;
    }
  };

  /**
   * Manually refresh the flow state (useful after completing a step)
   */
  const refreshFlow = async () => {
    if (!account || !isConnected || !isCorrectChain) return;
    
    // Clear cache to force fresh check
    setLastSuccessfulCheck(null);
    setRetryCount(0);
    setFlowState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('🔄 Manually refreshing user flow...');
      
      const userId = await getUserId(account);
      const userIdNum = parseInt(userId);
      const isRegistered = userId !== '0' && userIdNum > 0;
      
      if (!isRegistered) {
        setFlowState({
          isConnected: true,
          isRegistered: false,
          isActivated: false,
          isProfileComplete: false,
          isLoading: false,
          currentStep: 'register',
          canAccessDashboard: false
        });
        setLastSuccessfulCheck(`flow_${account}`);
        return;
      }

      const isActivated = await checkAccountActivation(account);
      
      if (!isActivated) {
        setFlowState({
          isConnected: true,
          isRegistered: true,
          isActivated: false,
          isProfileComplete: false,
          isLoading: false,
          currentStep: 'activate',
          canAccessDashboard: false
        });
        setLastSuccessfulCheck(`flow_${account}`);
        return;
      }

      const userDetails = await getUserDetails(account);
      const isProfileComplete = userDetails.profileCompleted === true;
      
      if (!isProfileComplete) {
        setFlowState({
          isConnected: true,
          isRegistered: true,
          isActivated: true,
          isProfileComplete: false,
          isLoading: false,
          currentStep: 'profile',
          canAccessDashboard: false
        });
        setLastSuccessfulCheck(`flow_${account}`);
        return;
      }

      setFlowState({
        isConnected: true,
        isRegistered: true,
        isActivated: true,
        isProfileComplete: true,
        isLoading: false,
        currentStep: 'complete',
        canAccessDashboard: true
      });
      
      setLastSuccessfulCheck(`flow_${account}`);
      console.log('✅ Flow refresh complete');
    } catch (error) {
      console.error('❌ Error refreshing flow:', error);
      // On error, preserve existing state instead of resetting
      setFlowState(prev => ({ 
        ...prev, 
        isLoading: false
      }));
    }
  };

  return {
    ...flowState,
    enforceFlow,
    getStepMessage,
    getNextAction,
    refreshFlow
  };
}
