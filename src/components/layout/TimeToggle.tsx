'use client';

import clsx from 'clsx';
import { useTime } from '@/components/providers/TimeProvider';
import type { Mode } from '@/lib/time';

const options: { value: Mode; label: string; icon: string }[] = [
  { value: 'auto', label: 'Match local clock', icon: '🕰️' },
  { value: 'day', label: 'Daytime sunshine', icon: '☀️' },
  { value: 'night', label: 'Cozy night lights', icon: '🌙' },
];

export default function TimeToggle() {
  const { mode, setMode, phase } = useTime();

  return (
    <div
      role="group"
      aria-label="Time of day"
      className="flex items-center gap-1 rounded-full border border-pink-200/60 bg-paper/60 p-0.5 shadow-inner backdrop-blur-sm transition-colors duration-300 dark:border-white/10 dark:bg-black/25"
    >
      {options.map((o) => {
        const active = mode === o.value;
        return (
          <button
            key={o.value}
            type="button"
            title={o.value === 'auto' ? `${o.label} (it is ${phase})` : o.label}
            aria-label={o.label}
            aria-pressed={active}
            onClick={() => setMode(o.value)}
            className={clsx(
              'group relative flex h-7 w-7 items-center justify-center rounded-full text-sm transition-all duration-200',
              active
                ? 'scale-105 border border-pink-300/80 bg-white shadow-xs dark:border-white/20 dark:bg-white/25'
                : 'opacity-70 hover:opacity-100 hover:scale-110 active:scale-95'
            )}
          >
            <span className="transition-transform duration-200 group-hover:rotate-12">
              {o.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
