'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { soundscape } from '@/lib/soundEngine';
import { useTime } from '@/components/providers/TimeProvider';

export default function SoundToggle() {
  const { theme } = useTime();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Sync theme changes with soundscape crossfade
  useEffect(() => {
    if (isPlaying) {
      soundscape.updateTheme(theme);
    }
  }, [theme, isPlaying]);

  // Handle click toggle
  const toggleSound = async () => {
    soundscape.playClickSound();
    setHasInteracted(true);

    if (isPlaying) {
      soundscape.stop();
      setIsPlaying(false);
      try {
        localStorage.setItem('cozy_sound_enabled', 'false');
      } catch {
        // local storage restricted
      }
    } else {
      await soundscape.start();
      soundscape.updateTheme(theme);
      setIsPlaying(true);
      try {
        localStorage.setItem('cozy_sound_enabled', 'true');
      } catch {
        // local storage restricted
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSound}
      title={
        isPlaying
          ? `Mute cozy sounds (${theme === 'night' ? 'evening crickets & breeze' : 'morning birds & breeze'})`
          : 'Play cozy ambient sound (day birds & breeze, night crickets)'
      }
      aria-label={isPlaying ? 'Mute cozy sounds' : 'Play cozy sounds'}
      aria-pressed={isPlaying}
      className={clsx(
        'group relative flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold shadow-inner backdrop-blur-sm transition-all duration-300',
        isPlaying
          ? 'border-pink-300/80 bg-blush/60 text-ink shadow-xs dark:border-white/20 dark:bg-white/20 dark:text-white'
          : 'border-pink-200/60 bg-paper/60 text-ink/75 hover:bg-paper hover:text-ink dark:border-white/10 dark:bg-black/25 dark:text-white/70 dark:hover:bg-black/40'
      )}
    >
      <span
        className={clsx(
          'text-sm transition-transform duration-300',
          isPlaying ? 'scale-110 rotate-6' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'
        )}
      >
        {isPlaying ? '📻' : '🔇'}
      </span>
      <span className="hidden font-display text-[11px] sm:inline">
        {isPlaying ? (theme === 'night' ? 'Crickets' : 'Birds') : 'Sound'}
      </span>

      {/* Tiny pulsing green/warm active indicator when playing */}
      {isPlaying && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
    </button>
  );
}
