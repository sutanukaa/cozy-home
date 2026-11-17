'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Mode, Phase, Theme, STORAGE_KEY, resolveTime } from '@/lib/time';

interface TimeCtx {
  mode: Mode;
  setMode: (m: Mode) => void;
  phase: Phase;
  theme: Theme;
}

const TimeContext = createContext<TimeCtx>({ mode: 'auto', setMode: () => {}, phase: 'day', theme: 'day' });
export const useTime = () => useContext(TimeContext);

/**
 * Keeps <html data-theme / data-phase> in sync with the visitor's LOCAL clock.
 * Always strictly automatic in production.
 * The very first paint is handled by the inline script in layout.tsx;
 * this provider takes over after hydration and re-checks every minute.
 */
export default function TimeProvider({ children }: { children: React.ReactNode }) {
  const [resolved, setResolved] = useState<{ phase: Phase; theme: Theme }>({ phase: 'day', theme: 'day' });

  useEffect(() => {
    // Clear any legacy manual override from storage so the site strictly follows visitor's local time
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    const apply = () => {
      const r = resolveTime('auto', new Date());
      setResolved(r);
      const root = document.documentElement;
      root.dataset.theme = r.theme;
      root.dataset.phase = r.phase;
    };

    apply();
    const id = setInterval(apply, 60_000);
    return () => clearInterval(id);
  }, []);

  const setMode = useCallback((_m: Mode) => {
    // No-op: strictly automated by local time of day
  }, []);

  const value = useMemo(() => ({ mode: 'auto' as Mode, setMode, ...resolved }), [setMode, resolved]);
  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
}
