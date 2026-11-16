'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { soundscape } from '@/lib/soundEngine';

/**
 * Re-mounts on every room navigation:
 * A swift, charming dollhouse doorway transition where double doors
 * swiftly part open (360ms) to reveal the new room.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [doorOpen, setDoorOpen] = useState(false);
  const [shutterVisible, setShutterVisible] = useState(true);

  useEffect(() => {
    // Trigger swift door parting animation immediately on mount
    setDoorOpen(true);
    soundscape.playDoorSound();

    // After animation completes (400ms), unmount shutter from DOM completely
    const timer = setTimeout(() => {
      setShutterVisible(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (reduce) {
    return <div className="h-full w-full">{children}</div>;
  }

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      {/* 1. Room enters with a swift, satisfying physical push forward */}
      <motion.div
        initial={{ opacity: 0.25, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full"
      >
        {children}
      </motion.div>

      {/* 2. Cozy Dollhouse Doorway Shutter (Double doors swiftly part open) */}
      {shutterVisible && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100] flex overflow-hidden select-none"
        >
          {/* Left Door Panel */}
          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: doorOpen ? '-100%' : '0%' }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-1/2 border-r-2 border-pink-300/80 bg-gradient-to-r from-wall via-wall to-wall-deep shadow-2xl dark:border-white/15 dark:from-[#382046] dark:via-[#331C40] dark:to-[#22102E]"
          >
            {/* Architectural door molding recessed panels */}
            <div className="absolute inset-4 sm:inset-8 rounded-2xl border-2 border-pink-200/60 dark:border-white/10 opacity-70" />
            <div className="absolute inset-8 sm:inset-14 rounded-xl border border-pink-200/40 dark:border-white/5 opacity-50" />

            {/* Golden doorknob */}
            <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-amber-300/90 bg-butter shadow-md dark:border-amber-400 dark:bg-amber-300" />
              <span className="h-6 w-1 rounded-full bg-amber-400/80 shadow-xs" />
            </div>
          </motion.div>

          {/* Right Door Panel */}
          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: doorOpen ? '100%' : '0%' }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-1/2 border-l-2 border-pink-300/80 bg-gradient-to-l from-wall via-wall to-wall-deep shadow-2xl dark:border-white/15 dark:from-[#382046] dark:via-[#331C40] dark:to-[#22102E]"
          >
            {/* Architectural door molding recessed panels */}
            <div className="absolute inset-4 sm:inset-8 rounded-2xl border-2 border-pink-200/60 dark:border-white/10 opacity-70" />
            <div className="absolute inset-8 sm:inset-14 rounded-xl border border-pink-200/40 dark:border-white/5 opacity-50" />

            {/* Golden doorknob */}
            <div className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="h-6 w-1 rounded-full bg-amber-400/80 shadow-xs" />
              <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-amber-300/90 bg-butter shadow-md dark:border-amber-400 dark:bg-amber-300" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
