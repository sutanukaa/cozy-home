'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { rooms } from '@/data/rooms';
import { site } from '@/data/site';
import CozyIcon from '@/components/ui/CozyIcon';
import { soundscape } from '@/lib/soundEngine';

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  // Automatically close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header id="site-header" className="fixed inset-x-0 top-0 z-50 px-2 sm:px-3 pt-2 sm:pt-3 transition-all duration-300">
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
          <div className="relative flex items-center justify-between gap-2 sm:gap-4 rounded-full border-2 border-pink-200/70 bg-paper/90 px-2.5 sm:px-5 py-1.5 sm:py-2 shadow-cozy backdrop-blur-md transition-all duration-300 dark:border-white/15 dark:bg-black/25 dark:shadow-lg">
            {/* Logo: clean large home icon directly beside brand name */}
            <Link
              href="/"
              className="group flex items-center gap-1.5 sm:gap-2 rounded-full py-0.5 pr-2 transition-transform duration-200 hover:scale-[1.02]"
            >
              <span className="shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3">
                <CozyIcon name="home" fallback="🏡" size={28} />
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

            {/* Right Controls: Mobile Hamburger Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Hamburger Button (visible on screens < md) */}
              <button
                type="button"
                onClick={() => {
                  soundscape.playClickSound();
                  setMenuOpen(!menuOpen);
                }}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-200/80 bg-paper/90 text-ink shadow-xs transition-all hover:bg-blush/40 active:scale-95 md:hidden dark:border-white/15 dark:bg-white/10 dark:text-white"
              >
                <div className="relative flex h-3.5 w-4 flex-col justify-between">
                  <span
                    className={clsx(
                      'h-0.5 w-full rounded-full bg-current transition-all duration-300 origin-center',
                      menuOpen && 'translate-y-1.5 rotate-45'
                    )}
                  />
                  <span
                    className={clsx(
                      'h-0.5 w-full rounded-full bg-current transition-all duration-200',
                      menuOpen && 'opacity-0 scale-x-0'
                    )}
                  />
                  <span
                    className={clsx(
                      'h-0.5 w-full rounded-full bg-current transition-all duration-300 origin-center',
                      menuOpen && '-translate-y-1.5 -rotate-45'
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Hamburger Dropdown Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
            />

            {/* Menu Drawer Plaque */}
            <motion.nav
              id="mobile-nav-menu"
              aria-label="Mobile Navigation"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="mobile-nav-drawer fixed inset-x-3 top-16 z-50 mx-auto max-w-sm rounded-3xl border-2 p-4 select-none md:hidden"
            >
              {/* Subtle decorative washi tape */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-1.5 left-8 z-10 h-3 w-10 -rotate-2 rounded-xs bg-butter/85 shadow-xs"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgb(255 255 255 / .4) 0 3px, transparent 3px 6px)' }}
              />

              {/* Menu Header */}
              <div className="flex items-center justify-between border-b border-pink-300/40 pb-2.5 px-1 dark:border-white/15">
                <span className="mobile-nav-header-text font-mono text-xs font-bold tracking-wider">
                  ROOMS &bull; SUTANUKA&apos;S HOME
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundscape.playClickSound();
                    setMenuOpen(false);
                  }}
                  aria-label="Close navigation menu"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-bold bg-pink-100 text-ink hover:bg-rose hover:text-white transition-colors dark:bg-white/15 dark:text-pink-100 dark:hover:bg-rose dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Room Links List */}
              <ul className="mt-2.5 space-y-1.5">
                {rooms.map((r) => {
                  const active = isActive(r.href);
                  return (
                    <li key={r.slug}>
                      <Link
                        href={r.href}
                        onClick={() => {
                          soundscape.playClickSound();
                          setMenuOpen(false);
                        }}
                        aria-current={active ? 'page' : undefined}
                        className={clsx(
                          'flex items-center justify-between rounded-2xl px-3 py-2.5 transition-all active:scale-[0.98]',
                          active ? 'mobile-nav-active' : 'mobile-nav-item'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="mobile-nav-icon-badge flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-xs">
                            <CozyIcon name={r.slug} fallback={r.emoji} size={22} />
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="mobile-nav-title font-display text-sm sm:text-base leading-tight">
                              {r.name === 'Living room' ? 'Living room (Home)' : r.name}
                            </span>
                            <span className="mobile-nav-sub font-sans text-xs mt-0.5 leading-tight">
                              {r.purpose}
                            </span>
                          </div>
                        </div>
                        {active && (
                          <span className="mobile-nav-badge-pill rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider shadow-xs">
                            Current
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
