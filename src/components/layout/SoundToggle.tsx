'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { soundscape } from '@/lib/soundEngine';
import { useTime } from '@/components/providers/TimeProvider';

export default function SoundToggle() {
  const { theme } = useTime();
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <button
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
        'fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40',
        'group flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full',
        'border-2 shadow-cozy backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95',
        isPlaying
          ? 'border-pink-300/80 bg-paper/95 text-ink shadow-md dark:border-white/25 dark:bg-white/20 dark:text-white'
          : 'border-pink-200/70 bg-paper/85 text-ink/70 hover:text-ink dark:border-white/15 dark:bg-black/35 dark:text-white/65 dark:hover:text-white'
      )}
    >
      {/* Icon display */}
      <span
        className={clsx(
          'text-base sm:text-lg transition-transform duration-300',
          isPlaying ? 'scale-110 group-hover:rotate-6' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
        )}
      >
        {isPlaying ? '📻' : '🔇'}
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
