"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserFlow } from "@/lib/hooks/useUserFlow";

interface FlowGuardProps {
  children: React.ReactNode;
  requireComplete?: boolean;
}

/**
 * Guard component that enforces user onboarding flow
 * Redirects users to appropriate step if they haven't completed the flow
 */
export default function FlowGuard({ children, requireComplete = true }: FlowGuardProps) {
  const router = useRouter();
  const flowState = useUserFlow();

  useEffect(() => {
    if (flowState.isLoading) return;

    if (!requireComplete) {
      // Allow access regardless of flow completion
      return;
    }

    // Enforce complete flow for dashboard access
    if (!flowState.canAccessDashboard) {
      // Redirect to home with appropriate modal
      if (!flowState.isConnected) {
        router.push('/');
      } else if (!flowState.isRegistered) {
        router.push('/?register=true');
      } else if (!flowState.isActivated) {
        router.push('/?activate=true');
      } else if (!flowState.isProfileComplete) {
        router.push('/?complete-profile=true');
      }
    }
  }, [flowState, requireComplete, router]);

  // Show loading state
  if (flowState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-primary">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-neon-blue mb-4"></i>
          <p className="text-gray-400">Checking account status...</p>
        </div>
      </div>
    );
  }

  // Show blocked state if flow not complete
  if (requireComplete && !flowState.canAccessDashboard) {
    const nextAction = flowState.getNextAction();
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-primary px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center animate-pulse">
            <i className="fas fa-lock text-white text-4xl"></i>
          </div>
          
          <h2 className="text-2xl font-orbitron font-bold text-yellow-400 mb-4">
            Access Restricted
          </h2>
          
          <p className="text-gray-400 mb-6">
            {flowState.getStepMessage()}
          </p>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
            <h3 className="font-semibold mb-4 text-white">Complete These Steps:</h3>
            <div className="space-y-3 text-left">
              <div className={`flex items-center space-x-3 ${flowState.isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                <i className={`fas ${flowState.isConnected ? 'fa-check-circle' : 'fa-circle'}`}></i>
                <span>Connect Wallet</span>
              </div>
              <div className={`flex items-center space-x-3 ${flowState.isRegistered ? 'text-green-400' : 'text-gray-400'}`}>
                <i className={`fas ${flowState.isRegistered ? 'fa-check-circle' : 'fa-circle'}`}></i>
                <span>Register Account</span>
              </div>
              <div className={`flex items-center space-x-3 ${flowState.isActivated ? 'text-green-400' : 'text-gray-400'}`}>
                <i className={`fas ${flowState.isActivated ? 'fa-check-circle' : 'fa-circle'}`}></i>
                <span>Activate Account</span>
              </div>
              <div className={`flex items-center space-x-3 ${flowState.isProfileComplete ? 'text-green-400' : 'text-gray-400'}`}>
                <i className={`fas ${flowState.isProfileComplete ? 'fa-check-circle' : 'fa-circle'}`}></i>
                <span>Complete Profile</span>
              </div>
            </div>
          </div>

          {nextAction && (
            <button
              onClick={nextAction.action}
              className="w-full py-3 bg-gradient-to-r from-neon-blue to-electric-purple text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {nextAction.label}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Allow access
  return <>{children}</>;
}
