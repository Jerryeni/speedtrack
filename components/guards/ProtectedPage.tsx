"use client";

import FlowGuard from "./FlowGuard";

interface ProtectedPageProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for pages that require complete user flow
 * Use this to wrap any page that should only be accessible after:
 * 1. Wallet connected
 * 2. Account registered
 * 3. Account activated
 * 4. Profile completed
 */
export default function ProtectedPage({ children }: ProtectedPageProps) {
  return (
    <FlowGuard requireComplete={true}>
      {children}
    </FlowGuard>
  );
}
