'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { soundscape } from '@/lib/soundEngine';
import { useTime } from '@/components/providers/TimeProvider';

export default function SoundToggle() {
  const pathname = usePathname();
  const { theme } = useTime();
  const [isPlaying, setIsPlaying] = useState(false);

  // In the studio, the desk headphone plays music instead, so hide the global sound button
  const isStudio = pathname === '/studio' || pathname?.startsWith('/studio');

  // If navigating into the studio while ambient sound is playing, stop ambient sound
  useEffect(() => {
    if (isStudio && isPlaying) {
      soundscape.stop();
      setIsPlaying(false);
    }
  }, [isStudio, isPlaying]);

  // Sync theme changes with soundscape crossfade
  useEffect(() => {
    if (isPlaying) {
      soundscape.updateTheme(theme);
    }
  }, [theme, isPlaying]);

  // Handle click toggle
  const toggleSound = async () => {
    soundscape.playClickSound();

    if (isPlaying) {
      soundscape.stop();
      setIsPlaying(false);
      try {
        localStorage.setItem('cozy_sound_enabled', 'false');
      } catch {
        // storage restricted
      }
    } else {
      await soundscape.start();
      soundscape.updateTheme(theme);
      setIsPlaying(true);
      try {
        localStorage.setItem('cozy_sound_enabled', 'true');
      } catch {
        // storage restricted
      }
    }
  };

  // Do not render in the studio room
  if (isStudio) {
    return null;
  }

  return (
    <button
      id="sound-toggle"
      type="button"
      onClick={toggleSound}
      title={
        isPlaying
          ? `Cozy sound ON (${theme === 'night' ? 'evening crickets & night breeze' : 'morning birds & breeze'}) • Click to mute`
          : 'Cozy sound OFF • Click to play ambient sound'
      }
      aria-label={isPlaying ? 'Mute cozy sound' : 'Play cozy ambient sound'}
      aria-pressed={isPlaying}
      className={clsx(
        'fixed bottom-20 right-4 sm:bottom-20 sm:right-5 md:bottom-5 md:right-5 z-40',
        'group flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full',
        'border-2 shadow-cozy backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95',
        isPlaying
          ? 'border-pink-300/80 bg-paper/95 text-ink shadow-md dark:border-white/25 dark:bg-white/20 dark:text-white'
          : 'border-pink-200/70 bg-paper/85 text-ink/70 hover:text-ink dark:border-white/15 dark:bg-black/35 dark:text-white/65 dark:hover:text-white'
      )}
    >
      {/* Icon display (Clean SVG, zero emojis) */}
      <span
        className={clsx(
          'transition-transform duration-300',
          isPlaying ? 'scale-110 group-hover:rotate-6' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
        )}
      >
        {isPlaying ? (
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-2.5-1.23l-5 5H2v10h4.5l5 5V2zm4.5 10c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        ) : (
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H2v6h4.5l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </span>

      {/* Tiny pulsing green / glowing indicator dot when audio is active */}
      {isPlaying && (
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border border-white bg-emerald-500 shadow-xs" />
        </span>
      )}
    </button>
  );
}
