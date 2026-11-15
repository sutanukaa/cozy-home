export type Phase = 'dawn' | 'day' | 'dusk' | 'night';
export type Theme = 'day' | 'night';
export type Mode = 'auto' | 'day' | 'night';

export const STORAGE_KEY = 'cozy-mode';

/**
 * Local-time phases. KEEP IN SYNC with the inline script in src/app/layout.tsx
 * (that script runs before hydration so the page never flashes the wrong theme).
 *   05:00-07:00 dawn  |  07:00-17:00 day  |  17:00-19:00 dusk  |  19:00-05:00 night
 * Only "night" switches the theme; dawn/dusk stay on the day art with a warm tint.
 */
export function phaseFromHour(hour: number): Phase {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19) return 'dusk';
  return 'night';
}

export function resolveTime(mode: Mode, date: Date): { phase: Phase; theme: Theme } {
  if (mode === 'day') return { phase: 'day', theme: 'day' };
  if (mode === 'night') return { phase: 'night', theme: 'night' };
  const phase = phaseFromHour(date.getHours());
  return { phase, theme: phase === 'night' ? 'night' : 'day' };
}
