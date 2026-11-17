'use client';

import Link from 'next/link';
import { useState } from 'react';
import CozyIcon from '@/components/ui/CozyIcon';

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

/**
 * Living room & room door hotspots:
 * Kept separate to showcase the custom generated sticker asset icons (studio.png, bedroom.png, etc.).
 */
export default function Hotspot({ id, label, x, y, emoji = '✨', icon, href, note }: HotspotDef) {
  const [open, setOpen] = useState(false);

  const dot = (
    <span className="relative flex h-12 w-12 items-center justify-center">
      <span className="absolute inset-0 animate-ping-soft rounded-full bg-white/70" />
      <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blush/90 shadow-lg transition-transform group-hover:scale-110 group-focus-visible:scale-110">
        <CozyIcon name={icon ?? id} fallback={emoji} size={30} />
      </span>
    </span>
  );

  const tooltip = (
    <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-3 py-1 font-hand text-lg text-ink opacity-0 shadow-md transition group-hover:opacity-100 group-focus-visible:opacity-100">
      {label}
    </span>
  );

  const pos = { left: `${x}%`, top: `${y}%` };
  const base = 'group absolute -translate-x-1/2 -translate-y-1/2';

  if (href) {
    return (
      <Link href={href} aria-label={label} style={pos} className={base}>
        {dot}
        {tooltip}
      </Link>
    );
  }

  return (
    <div style={pos} className={base}>
      <button type="button" aria-label={label} aria-expanded={open} onClick={() => setOpen((o) => !o)} className="block">
        {dot}
      </button>
      {tooltip}
      {open && note && (
        <span
          role="status"
          className="absolute bottom-full left-1/2 z-30 mb-2 w-52 -translate-x-1/2 animate-pop-in rounded-2xl bg-paper p-3 text-center font-hand text-lg leading-tight text-ink shadow-xl"
        >
          {note}
        </span>
      )}
    </div>
  );
}
