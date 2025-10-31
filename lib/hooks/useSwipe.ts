import { useEffect, useRef, useState } from "react";

export type SwipeDirection = "left" | "right" | "up" | "down" | null;

interface SwipeState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  direction: SwipeDirection;
  distance: number;
}

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number;
}

export function useSwipe(options: UseSwipeOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    direction: null,
    distance: 0,
  });

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setSwipeState((prev) => ({
      ...prev,
      startX: touch.clientX,
      startY: touch.clientY,
    }));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    setSwipeState((prev) => ({
      ...prev,
      endX: touch.clientX,
      endY: touch.clientY,
    }));
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;

    const deltaX = swipeState.endX - swipeState.startX;
    const deltaY = swipeState.endY - swipeState.startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    let direction: SwipeDirection = null;
    let distance = 0;

    if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
      direction = deltaX > 0 ? "right" : "left";
      distance = absDeltaX;

      if (direction === "left" && onSwipeLeft) {
        onSwipeLeft();
      } else if (direction === "right" && onSwipeRight) {
        onSwipeRight();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > minSwipeDistance) {
      direction = deltaY > 0 ? "down" : "up";
      distance = absDeltaY;

      if (direction === "up" && onSwipeUp) {
        onSwipeUp();
      } else if (direction === "down" && onSwipeDown) {
        onSwipeDown();
      }
    }

    setSwipeState((prev) => ({
      ...prev,
      direction,
      distance,
    }));

    touchStartRef.current = null;
  };

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    handlers,
    swipeState,
  };
}
