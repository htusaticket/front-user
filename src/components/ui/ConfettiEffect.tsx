"use client";

import confetti from "canvas-confetti";
import { useEffect, useCallback } from "react";

interface ConfettiEffectProps {
  trigger: boolean;
  type?: "celebration" | "success" | "fireworks";
  duration?: number;
}

export function useConfetti() {
  const triggerCelebration = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const triggerSuccess = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#33b8d0", "#4ec8de", "#77e3f7", "#22c55e", "#10b981"],
      zIndex: 9999,
    });
  }, []);

  const triggerFireworks = useCallback(() => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 50, zIndex: 9999 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        ...defaults,
        particleCount: 20,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.3,
        },
        colors: ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#ee82ee"],
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return {
    triggerCelebration,
    triggerSuccess,
    triggerFireworks,
  };
}

export function ConfettiEffect({ trigger, type = "success", duration = 3000 }: ConfettiEffectProps) {
  const { triggerCelebration, triggerSuccess, triggerFireworks } = useConfetti();

  useEffect(() => {
    if (!trigger) return;

    let cleanup: (() => void) | undefined;

    switch (type) {
    case "celebration":
      cleanup = triggerCelebration();
      break;
    case "fireworks":
      cleanup = triggerFireworks();
      break;
    case "success":
    default:
      triggerSuccess();
      break;
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [trigger, type, duration, triggerCelebration, triggerSuccess, triggerFireworks]);

  return null;
}
