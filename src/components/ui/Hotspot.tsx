'use client';

import { useState } from 'react';
import CozyBubbleButton from '@/components/ui/CozyBubbleButton';

export interface HotspotDef {
  id: string;
  label: string;
  /** position in % of the scene (0-100) */
  x: number;
  y: number;
  emoji?: string;
  icon?: string;
  /** navigate somewhere... */
  href?: string;
  /** ...or show a little note bubble */
  note?: string;
}

function getHotspotIcon(id?: string) {
  switch (id) {
    case 'bedroom':
      return (
        <svg className="h-4 w-4 drop-shadow-sm text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
        </svg>
      );
    case 'studio':
      return (
        <svg className="h-4 w-4 drop-shadow-sm text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="12" x="3" y="4" rx="2" />
          <line x1="8" x2="16" y1="20" y2="20" />
          <line x1="12" x2="12" y1="16" y2="20" />
        </svg>
      );
    case 'library':
      return (
        <svg className="h-4 w-4 drop-shadow-sm text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'kitchen':
    case 'kettle':
      return (
        <svg className="h-4 w-4 drop-shadow-sm text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      );
    case 'porch':
      return (
        <svg className="h-4 w-4 drop-shadow-sm text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    default:
      return (
        <svg className="h-4 w-4 drop-shadow-sm text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
      );
  }
}

/**
 * A standardized tappable spot on a room illustration:
 * Uses the canonical CozyBubbleButton for 100% visual consistency across all rooms.
 */
export default function Hotspot({ id, label, x, y, href, note }: HotspotDef) {
  const [open, setOpen] = useState(false);

  const pos = { left: `${x}%`, top: `${y}%` };
  const base = 'absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto';

  return (
    <div style={pos} className={base}>
      <CozyBubbleButton
        label={label}
        href={href}
        onClick={href ? undefined : () => setOpen((o) => !o)}
        icon={getHotspotIcon(id)}
      />
      {open && note && (
        <span
          role="status"
          className="absolute bottom-full left-1/2 z-30 mb-2 w-52 -translate-x-1/2 animate-pop-in rounded-2xl bg-paper p-3 text-center font-hand text-lg leading-tight text-ink shadow-xl border border-pink-300/60"
        >
          {note}
        </span>
      )}
    </div>
  );
}
