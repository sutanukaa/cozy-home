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
 * Keeps <html data-theme / data-phase> in sync with the visitor's LOCAL clock
 * (or their manual override). The very first paint is handled by the inline
 * script in layout.tsx; this provider takes over after hydration and re-checks every minute.
 */
export default function TimeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('auto');
  const [ready, setReady] = useState(false);
  const [resolved, setResolved] = useState<{ phase: Phase; theme: Theme }>({ phase: 'day', theme: 'day' });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'auto' || stored === 'day' || stored === 'night') setModeState(stored);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const apply = () => {
      const r = resolveTime(mode, new Date());
      setResolved(r);
      const root = document.documentElement;
      root.dataset.theme = r.theme;
      root.dataset.phase = r.phase;
    };
    apply();
    const id = setInterval(apply, 60_000);
    return () => clearInterval(id);
  }, [mode, ready]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    try { localStorage.setItem(STORAGE_KEY, m); } catch {}
  }, []);

  const value = useMemo(() => ({ mode, setMode, ...resolved }), [mode, setMode, resolved]);
  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
}
