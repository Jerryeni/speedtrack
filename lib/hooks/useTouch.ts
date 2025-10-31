'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the device supports touch interactions
 * Returns true if the device has touch capabilities
 */
export function useTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check for touch support
    const hasTouchSupport = 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (navigator as any).msMaxTouchPoints > 0;
    
    setIsTouch(hasTouchSupport);
  }, []);

  return isTouch;
}
