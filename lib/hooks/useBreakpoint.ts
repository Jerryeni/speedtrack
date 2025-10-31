'use client';

import { useState, useEffect } from 'react';

export interface BreakpointContext {
  isMobile: boolean;      // < 640px
  isTablet: boolean;      // 640px - 1023px
  isDesktop: boolean;     // ≥ 1024px
  width: number;
  height: number;
}

/**
 * Hook to detect current screen size breakpoint
 * Returns breakpoint information based on Tailwind's default breakpoints
 */
export function useBreakpoint(): BreakpointContext {
  const [breakpoint, setBreakpoint] = useState<BreakpointContext>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
    height: 0
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setBreakpoint({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        width,
        height
      });
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}
