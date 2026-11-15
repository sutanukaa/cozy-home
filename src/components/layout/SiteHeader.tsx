'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { rooms } from '@/data/rooms';
import { site } from '@/data/site';
import TimeToggle from './TimeToggle';
import CozyIcon from '@/components/ui/CozyIcon';

export default function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-all duration-300">
        <div className="relative mx-auto max-w-5xl">
          {/* Whimsical washi tape strips pinned to top corners */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-1.5 left-10 z-20 hidden h-4 w-12 -rotate-3 rounded-xs bg-butter/85 shadow-xs transition-opacity duration-300 sm:block dark:opacity-75"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgb(255 255 255 / .4) 0 4px, transparent 4px 8px)' }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -top-1.5 right-12 z-20 hidden h-4 w-12 rotate-2 rounded-xs bg-sage/80 shadow-xs transition-opacity duration-300 sm:block dark:opacity-75"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgb(255 255 255 / .35) 0 4px, transparent 4px 8px)' }}
          />

          {/* Main header plaque: warm paper by day, transparent frosted glass at night */}
          <div className="relative flex items-center justify-between gap-3 sm:gap-4 rounded-full border-2 border-pink-200/70 bg-paper/90 px-3 sm:px-5 py-2 shadow-cozy backdrop-blur-md transition-all duration-300 dark:border-white/15 dark:bg-black/25 dark:shadow-lg">
            {/* Logo: clean large home icon directly beside brand name */}
            <Link
              href="/"
              className="group flex items-center gap-2 rounded-full py-0.5 pr-2 transition-transform duration-200 hover:scale-[1.02]"
            >
              <span className="shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3">
                <CozyIcon name="home" fallback="🏡" size={32} />
              </span>
              <div className="flex flex-col">
                <span className="font-display text-sm sm:text-base font-bold tracking-tight text-ink transition-colors group-hover:text-accent dark:text-white dark:group-hover:text-pink-200">
                  {site.name}
                </span>
                <span className="hidden font-sans text-xs font-semibold leading-none text-ink-soft/90 md:block dark:text-white/70">
                  {site.role}
                </span>
              </div>
            </Link>

            {/* Desktop Room Navigation: simple, clean, breathable pills */}
            <nav aria-label="Rooms" className="hidden items-center gap-1 md:flex">
              {rooms.map((r) => {
                const active = isActive(r.href);
                return (
                  <Link
                    key={r.slug}
                    href={r.href}
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200',
                      active
                        ? 'bg-blush/60 text-accent dark:bg-white/20 dark:text-white'
                        : 'text-ink/75 hover:bg-blush/25 hover:text-ink dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white'
                    )}
                  >
                    <CozyIcon name={r.slug} fallback={r.emoji} size={18} />
                    <span className="font-display">{r.name === 'Living room' ? 'Home' : r.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Sky/Clock Toggle */}
            <div className="flex items-center">
              <TimeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile: bottom tab bar */}
      <nav aria-label="Rooms" className="fixed inset-x-4 bottom-3 z-50 md:hidden">
        <ul className="flex items-center justify-between rounded-full border-2 border-pink-200/70 bg-paper/95 px-3 py-2 shadow-cozy backdrop-blur-md transition-all duration-300 dark:border-white/15 dark:bg-black/30 dark:shadow-lg">
          {rooms.map((r) => {
            const active = isActive(r.href);
            return (
              <li key={r.slug}>
                <Link
                  href={r.href}
                  aria-label={r.name}
                  aria-current={active ? 'page' : undefined}
                  className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95',
                    active
                      ? 'bg-blush/60 dark:bg-white/25'
                      : 'hover:bg-blush/20 dark:hover:bg-white/10'
                  )}
                >
                  <CozyIcon name={r.slug} fallback={r.emoji} size={22} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
