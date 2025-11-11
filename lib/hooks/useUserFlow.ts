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
        return;
      }

      try {
        setFlowState(prev => ({ ...prev, isLoading: true }));

        // Step 2: Check registration (using getUserId - most reliable)
        const userId = await getUserId(account);
        const isRegistered = userId !== '0' && parseInt(userId) > 0;
        
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
          return;
        }

        // Step 3: Check activation
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
          return;
        }

        // Step 4: Check profile completion
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
          return;
        }

        // All steps complete - user can access dashboard
        setFlowState({
          isConnected: true,
          isRegistered: true,
          isActivated: true,
          isProfileComplete: true,
          isLoading: false,
          currentStep: 'complete',
          canAccessDashboard: true
        });

      } catch (error) {
        console.error('Error checking user flow:', error);
        setFlowState(prev => ({ ...prev, isLoading: false }));
      }
    }

    checkUserFlow();
  }, [account, isConnected, isCorrectChain]);

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

  return {
    ...flowState,
    enforceFlow,
    getStepMessage,
    getNextAction
  };
}
