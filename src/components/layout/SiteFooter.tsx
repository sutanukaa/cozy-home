'use client';

import { usePathname } from 'next/navigation';
import { site } from '@/data/site';

export default function SiteFooter() {
  const pathname = usePathname();

  // The living room is a static full-viewport scene with no scrolling
  if (pathname === '/') return null;

  return (
    <footer className="relative z-10 pb-28 pt-6 text-center font-hand text-xl text-ink-soft md:pb-10">
      made with 🌸 and too much tea by {site.shortName} · {new Date().getFullYear()}
    </footer>
  );
}
