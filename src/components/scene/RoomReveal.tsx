'use client';

import { useState, useEffect } from 'react';
import { useTime } from '@/components/providers/TimeProvider';

/**
 * Opening entrance reveal:
 * - Daytime: A bright, sunlit white screen with dreamy morning fog that slowly
 *   clears and parts outward to reveal the cozy room.
 * - Nighttime: A soft starry indigo twilight veil that lifts as the warm lights awaken.
 *
 * Automatically unmounts after 2.4s so zero overhead remains.
 */
export default function RoomReveal() {
  const { theme } = useTime();
  const [clearing, setClearing] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Hold the bright haze briefly so the visitor feels the morning light & mist
    const clearTimer = setTimeout(() => {
      setClearing(true);
    }, 450);

    // Completely unmount the reveal overlay once the fog has fully dissolved
    const unmountTimer = setTimeout(() => {
      setMounted(false);
    }, 3200);

    return () => {
      clearTimeout(clearTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  const isNight = theme === 'night';

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-[2400ms] ease-out select-none ${
        clearing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 1. Main light wash (bright morning white / twilight veil) */}
      <div
        className={`absolute inset-0 transition-all duration-[2600ms] ease-out ${
          isNight
            ? 'bg-gradient-to-b from-[#2B1B3A] via-[#3E2A50] to-[#251633]'
            : 'bg-white'
        } ${clearing ? 'scale-105' : 'scale-100'}`}
      />

      {/* 2. Window Sunbeam Glow (daytime sunbeam bloom from top-right) */}
      {!isNight && (
        <div
          className={`absolute -right-20 -top-20 h-[120vh] w-[80vw] rounded-full transition-transform duration-[2800ms] ease-out ${
            clearing ? 'scale-150 opacity-0' : 'scale-100 opacity-95'
          }`}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(255, 248, 225, 0.9) 35%, rgba(255, 225, 235, 0.5) 65%, transparent 85%)',
            filter: 'blur(36px)',
          }}
        />
      )}

      {/* 3. Fog Layer 1: Left mist bank (drifts left and fades) */}
      <div
        className={`absolute -left-[25%] top-[5%] h-[100vh] w-[75vw] rounded-full transition-all duration-[2700ms] ease-out ${
          clearing ? '-translate-x-40 scale-125 opacity-0' : 'translate-x-0 scale-100 opacity-95'
        }`}
        style={{
          background: isNight
            ? 'radial-gradient(ellipse at center, rgba(62, 42, 80, 0.92) 0%, rgba(78, 52, 96, 0.55) 50%, transparent 80%)'
            : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.98) 0%, rgba(255, 247, 242, 0.85) 45%, transparent 75%)',
          filter: 'blur(45px)',
        }}
      />

      {/* 4. Fog Layer 2: Right mist bank (drifts right and fades) */}
      <div
        className={`absolute -right-[25%] top-[10%] h-[100vh] w-[75vw] rounded-full transition-all duration-[2800ms] ease-out ${
          clearing ? 'translate-x-40 scale-125 opacity-0' : 'translate-x-0 scale-100 opacity-95'
        }`}
        style={{
          background: isNight
            ? 'radial-gradient(ellipse at center, rgba(78, 52, 96, 0.92) 0%, rgba(62, 42, 80, 0.55) 50%, transparent 80%)'
            : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.98) 0%, rgba(255, 242, 247, 0.85) 45%, transparent 75%)',
          filter: 'blur(48px)',
        }}
      />

      {/* 5. Fog Layer 3: Central rising morning vapor (lifts upward) */}
      <div
        className={`absolute inset-x-0 bottom-0 h-[65vh] transition-all duration-[2600ms] ease-out ${
          clearing ? '-translate-y-32 scale-110 opacity-0' : 'translate-y-0 scale-100 opacity-95'
        }`}
        style={{
          background: isNight
            ? 'linear-gradient(to top, rgba(43, 27, 58, 0.95) 0%, rgba(78, 52, 96, 0.6) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(255, 255, 255, 0.98) 0%, rgba(255, 249, 246, 0.8) 50%, transparent 100%)',
          filter: 'blur(32px)',
        }}
      />
    </div>
  );
}
