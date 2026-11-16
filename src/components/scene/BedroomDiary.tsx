'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { site } from '@/data/site';
import { soundscape } from '@/lib/soundEngine';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  rotation: number;
}

export default function BedroomDiary() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      document.body.classList.remove('diary-modal-open');
    };
  }, []);

  // When diary is open, hide navbar, sound toggle & room heading like the retro computer in studio
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('diary-modal-open');
    } else {
      document.body.classList.remove('diary-modal-open');
    }
    return () => {
      document.body.classList.remove('diary-modal-open');
    };
  }, [isOpen]);

  // Keyboard shortcut: close with Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && (isOpen || isFloating)) {
      setIsOpen(false);
      setIsFloating(false);
    }
  }, [isOpen, isFloating]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleOpen = () => {
    if (isOpen || isFloating) return;

    soundscape.playSparkleSound();
    setIsFloating(true);

    // Generate sparkle trail along trajectory from bedside table (x: 67.2%, y: 52.5%) to center (x: 50%, y: 50%)
    const newSparkles: SparkleParticle[] = Array.from({ length: 18 }).map((_, i) => {
      const progress = i / 17;
      // Interpolate with a natural gentle curve
      const baseX = 67.2 - progress * 17.2;
      const baseY = 52.5 + Math.sin(progress * Math.PI) * -8 + progress * -2.5;
      const jitterX = (Math.random() - 0.5) * 6;
      const jitterY = (Math.random() - 0.5) * 6;
      const colors = ['#FFE28A', '#FFB8CE', '#FFFFFF', '#F482A5', '#FFF3B0'];

      return {
        id: Date.now() + i,
        x: baseX + jitterX,
        y: baseY + jitterY,
        size: 8 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: progress * 0.38,
        rotation: Math.random() * 360,
      };
    });

    setSparkles(newSparkles);

    // After floating animation reaches center, open the full-screen diary spread
    setTimeout(() => {
      setIsOpen(true);
      setIsFloating(false);
      setSparkles([]);
    }, 600);
  };

  const handleClose = () => {
    soundscape.playClickSound();
    setIsOpen(false);
    setIsFloating(false);
  };

  const { about } = site;

  return (
    <>
      {/* 1. RESTING CLOSED DIARY ON BEDSIDE TABLE (when not floating or open) */}
      {!isFloating && !isOpen && (
        <div
          className="group absolute z-20 cursor-pointer select-none"
          style={{
            left: '67.2%',
            top: '52.5%',
            width: '6.5%',
            maxWidth: '82px',
            minWidth: '48px',
            aspectRatio: '1140 / 1652',
            transform: 'translate(-50%, -50%) rotate(-1.5deg)',
          }}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpen();
            }
          }}
          aria-label="Open Suto's Diary"
        >
          {/* Subtle soft cast shadow on the nightstand table top */}
          <div className="absolute -bottom-1.5 inset-x-1.5 h-3 rounded-full bg-black/25 blur-[2.5px]" />

          {/* Closed diary book art */}
          <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-108 group-hover:-translate-y-1">
            <Image
              src="/assets/objects/bedroom-diary-closed.png"
              alt="Suto's Diary resting on the nightstand"
              fill
              sizes="(max-width: 768px) 60px, 85px"
              className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.22)]"
              priority
            />

            {/* Prominent Glowing Hotspot Button positioned in lower half of cover so 'Suto's Diary' text is fully visible */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{ top: '68%', left: '49%' }}
            >
              <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center">
                {/* Outer pulsing radiant halo */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-[#FF3377]/55 animate-ping-soft"
                />

                {/* Secondary breathing ring */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0.5 rounded-full bg-white/70 animate-pulse"
                />

                {/* Main vibrant rose-berry button */}
                <span className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#FF4D88] via-[#E81E63] to-[#B7004B] text-white shadow-[0_0_12px_rgba(232,30,99,0.7),0_3px_8px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-115 group-hover:shadow-[0_0_18px_rgba(255,77,136,0.95)]">
                  {/* Glossy top-left bubble highlight */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0.5 left-1 h-1.5 w-2 rounded-full bg-white/60 blur-[0.3px] -rotate-12"
                  />

                  {/* Sparkle Book Icon */}
                  <svg
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <path d="M12 6l1.2 2L15 9.2l-1.8 1.2L12 13l-1.2-2.6L9 9.2l1.8-1.2L12 6z" fill="currentColor" fillOpacity="0.4" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Prominent Callout Pill Badge directly under the diary */}
            <div className="absolute -bottom-8 sm:-bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-pink-300/95 bg-white/95 px-2.5 py-0.5 sm:px-3 sm:py-1 font-hand text-xs sm:text-sm font-bold text-ink shadow-[0_4px_14px_rgba(0,0,0,0.15)] backdrop-blur-xs transition-all duration-300 group-hover:scale-108 group-hover:border-[#E81E63] group-hover:bg-[#FFF0F6] group-hover:text-[#C2185B] dark:border-pink-400/50 dark:bg-[#25182E]/95 dark:text-pink-100">
                <span className="h-2 w-2 rounded-full bg-[#E81E63] animate-pulse" />
                Open Suto&apos;s Diary
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. FLOATING ANIMATION & SPARKLE TRAIL */}
      <AnimatePresence>
        {isFloating && (
          <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
            {/* Sparkle particles along the trajectory */}
            {sparkles.map((sp) => (
              <motion.div
                key={sp.id}
                initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.4, 1.1, 0],
                  y: ['-50%', '-20px'],
                  rotate: [sp.rotation, sp.rotation + 90],
                }}
                transition={{
                  duration: 0.65,
                  delay: sp.delay,
                  ease: 'easeOut',
                }}
                className="absolute"
                style={{
                  left: `${sp.x}%`,
                  top: `${sp.y}%`,
                  width: `${sp.size}px`,
                  height: `${sp.size}px`,
                }}
              >
                {/* 4-point twinkling star particle */}
                <svg
                  viewBox="0 0 24 24"
                  fill={sp.color}
                  className="h-full w-full drop-shadow-[0_0_6px_rgba(255,220,130,0.8)]"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </motion.div>
            ))}

            {/* Closed diary floating from nightstand into screen center */}
            <motion.div
              initial={{
                left: '67.2%',
                top: '52.5%',
                x: '-50%',
                y: '-50%',
                scale: 1,
                rotate: -1.5,
              }}
              animate={{
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                scale: [1, 1.8, 3.2],
                rotate: [-1.5, 4, 0],
              }}
              transition={{
                duration: 0.58,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute z-50 w-[6.5%] max-w-[82px] min-w-[48px] aspect-[1140/1652]"
            >
              <Image
                src="/assets/objects/bedroom-diary-closed.png"
                alt="Suto's Diary floating"
                fill
                sizes="120px"
                className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                priority
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. OPEN DIARY FULL-SCREEN OVERLAY (Portaled to document.body so navbar & headings never overlap) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="diary-book-modal fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-8 select-none">
                {/* Dimmed backdrop covering entire screen including navbar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleClose}
                  className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                  aria-hidden="true"
                />

                {/* DESKTOP / TABLET TWO-PAGE SPREAD VIEW (md and up) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.65, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="diary-book-modal hidden md:flex relative z-10 w-full max-w-4xl aspect-[2222/1248] max-h-[88vh] items-center justify-center"
                >
                  {/* Background Open Diary Image */}
                  <div className="absolute inset-0 pointer-events-none select-none">
                    <Image
                      src="/assets/objects/bedroom-diary-open.png"
                      alt="Open diary spread"
                      fill
                      sizes="(max-width: 1024px) 95vw, 1100px"
                      className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
                      priority
                    />
                  </div>

                  {/* Close Button: Glossy Pink Bubble in Top Right Corner */}
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close Diary"
                    className="group absolute -top-3 right-0 sm:top-1 sm:right-3 md:top-3 md:right-5 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-cozy backdrop-blur-xs transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1 left-1.5 h-2 w-3 rounded-full bg-white/50 blur-[0.3px] -rotate-12"
                    />
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:rotate-90"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Two-page Content Layout Inside Open Book: strictly bounded within the cream parchment safe zone (top: 6%, bottom: 19%) */}
                  <div className="absolute inset-x-0 top-[6%] bottom-[19%] z-20 grid grid-cols-1 md:grid-cols-2 text-ink select-text">
                    {/* LEFT PAGE: Photo Polaroid + Name + Social Links */}
                    <div className="flex h-full flex-col items-center justify-center text-center px-4 sm:px-8 py-2">
                      {/* Polaroid Frame */}
                      <div className="relative w-32 sm:w-40 md:w-46 rotate-[-2deg] rounded-lg bg-white p-2 sm:p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:rotate-0 hover:scale-105">
                        {/* Cute Washi Tape on Top of Polaroid */}
                        <div
                          aria-hidden="true"
                          className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-4.5 w-16 sm:h-5 sm:w-20 rounded-xs bg-[#FFC5D3]/85 shadow-xs -rotate-2"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)',
                          }}
                        />

                        {/* Polaroid Photo Image */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#FFF0F4]">
                          <Image
                            src="/images/me.jpeg"
                            alt={site.name}
                            fill
                            sizes="200px"
                            className="object-cover"
                            priority
                          />
                        </div>

                        {/* Polaroid Caption */}
                        <div className="mt-1 sm:mt-1.5 text-center">
                          <p className="font-hand text-base sm:text-lg font-bold text-ink leading-tight">
                            {site.name}
                          </p>
                          <p className="mt-0.5 font-sans text-[7.5px] sm:text-[8.5px] tracking-wide uppercase text-ink/65 font-semibold leading-tight">
                            <span>Software Development</span>
                            <br />
                            <span>Engineer</span>
                          </p>
                        </div>
                      </div>

                      {/* Social links row: fits comfortably within bottom page cream area */}
                      <div className="mt-2.5 sm:mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                        {site.socials.map((s) => (
                          <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-pink-300/80 bg-white/95 px-3 py-1 font-hand text-xs sm:text-sm font-bold text-ink shadow-xs backdrop-blur-xs transition hover:scale-105 hover:bg-blush/40"
                          >
                            {s.label}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT PAGE: Bio + Loves + Fun Facts + Resume Button (Centered with ribbon & margin clearance, scrollable) */}
                    <div className="flex h-full flex-col justify-center pl-10 sm:pl-14 md:pl-20 pr-8 sm:pr-12 md:pr-16 py-2 text-left min-h-0">
                      <div className="diary-scroll flex flex-col space-y-2.5 h-full overflow-y-auto pr-3 pt-1 pb-6">
                        <div>
                          <h2 className="font-display text-lg sm:text-2xl font-extrabold text-ink leading-tight">
                            Hello, I&apos;m {site.shortName}
                          </h2>
                          <p className="mt-0.5 font-hand text-sm sm:text-base text-accent font-semibold">
                            Welcome to my diary &amp; personal space!
                          </p>
                        </div>

                        {/* Bio Paragraphs */}
                        <div className="space-y-1.5 font-sans text-xs sm:text-[13px] leading-relaxed text-ink/85">
                          {about.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>

                        {/* Things I Love Stickers */}
                        <div>
                          <h3 className="font-hand text-sm sm:text-base font-bold text-ink/90">
                            Things I love:
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {about.loves.map((love) => (
                              <span
                                key={love}
                                className="rounded-full border border-pink-200/90 bg-[#FFF5F8] px-2.5 py-0.5 font-sans text-[11px] sm:text-xs font-medium text-ink shadow-xs"
                              >
                                {love}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Fun Facts */}
                        <div>
                          <h3 className="font-hand text-sm sm:text-base font-bold text-ink/90">
                            Fun facts:
                          </h3>
                          <ul className="mt-1 space-y-1 font-sans text-[11px] sm:text-xs text-ink/80 list-disc list-inside">
                            {about.funFacts.map((fact) => (
                              <li key={fact}>{fact}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Resume Download Button: High-contrast, rich rose-pink pill with generous bottom padding */}
                        <div className="pt-2 pb-2">
                          <a
                            href={site.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group/btn inline-flex items-center gap-2 rounded-full border-2 border-white bg-gradient-to-r from-[#E8507D] via-[#D83A6F] to-[#BF2156] px-5 py-2 font-hand text-base sm:text-lg font-bold text-white shadow-[0_4px_14px_rgba(216,58,111,0.45)] transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_20px_rgba(216,58,111,0.65)] hover:from-[#D83A6F] hover:to-[#A31644] active:scale-95"
                          >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 transition-transform group-hover/btn:-translate-y-0.5">
                              <svg
                                className="h-3.5 w-3.5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </span>
                            <span>Download my resume</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* MOBILE SINGLE-PAGE VIEW (< md screens) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="diary-book-modal flex md:hidden relative z-10 w-full max-w-[390px] xs:max-w-[420px] aspect-[1372/1908] max-h-[92vh] items-center justify-center"
                >
                  {/* Background Single-Page Mobile Diary Image */}
                  <div className="absolute inset-0 pointer-events-none select-none">
                    <Image
                      src="/assets/objects/bedroom-diary-mobile.png"
                      alt="Suto's Diary page"
                      fill
                      sizes="(max-width: 768px) 94vw, 420px"
                      className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
                      priority
                    />
                  </div>

                  {/* Close Button: Glossy Pink Bubble in Top Right */}
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close Diary"
                    className="group absolute -top-2.5 right-0.5 z-40 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-cozy backdrop-blur-xs transition-transform duration-200 active:scale-95 focus:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1 left-1.5 h-2 w-2.5 rounded-full bg-white/50 blur-[0.3px] -rotate-12"
                    />
                    <svg
                      className="h-5 w-5 transition-transform duration-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Single-Page Scrollable Content bounded inside cream parchment (left: 9%, right: 11%, top: 8%, bottom: 12%) */}
                  <div className="absolute left-[9%] right-[11%] top-[8%] bottom-[12%] z-20 text-ink select-text">
                    <div className="diary-scroll flex flex-col space-y-3 h-full overflow-y-auto px-2 py-2 text-center">
                      {/* Polaroid Photo Frame */}
                      <div className="relative w-28 xs:w-32 mx-auto rotate-[-1.5deg] rounded-lg bg-white p-2 shadow-[0_4px_14px_rgba(0,0,0,0.16)] shrink-0">
                        {/* Washi Tape on Top of Polaroid */}
                        <div
                          aria-hidden="true"
                          className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-14 rounded-xs bg-[#FFC5D3]/85 shadow-xs -rotate-2"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)',
                          }}
                        />
                        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#FFF0F4]">
                          <Image
                            src="/images/me.jpeg"
                            alt={site.name}
                            fill
                            sizes="140px"
                            className="object-cover"
                            priority
                          />
                        </div>
                        <div className="mt-1 text-center">
                          <p className="font-hand text-base font-bold text-ink leading-tight">
                            {site.name}
                          </p>
                          <p className="mt-0.5 font-sans text-[7.5px] tracking-wide uppercase text-ink/65 font-semibold leading-tight">
                            <span>Software Development</span>
                            <br />
                            <span>Engineer</span>
                          </p>
                        </div>
                      </div>

                      {/* Social links row */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 shrink-0">
                        {site.socials.map((s) => (
                          <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-pink-300/80 bg-white/95 px-2.5 py-0.5 font-hand text-xs font-bold text-ink shadow-xs backdrop-blur-xs transition hover:scale-105 hover:bg-blush/40"
                          >
                            {s.label}
                          </a>
                        ))}
                      </div>

                      {/* Heading & Subtitle */}
                      <div className="text-left pt-1">
                        <h2 className="font-display text-lg xs:text-xl font-extrabold text-ink leading-tight">
                          Hello, I&apos;m {site.shortName}
                        </h2>
                        <p className="mt-0.5 font-hand text-xs text-accent font-semibold">
                          Welcome to my diary &amp; personal space!
                        </p>
                      </div>

                      {/* Bio Paragraphs */}
                      <div className="space-y-1.5 font-sans text-xs leading-relaxed text-ink/85 text-left">
                        {about.paragraphs.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>

                      {/* Things I Love Stickers */}
                      <div className="text-left">
                        <h3 className="font-hand text-sm font-bold text-ink/90">
                          Things I love:
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {about.loves.map((love) => (
                            <span
                              key={love}
                              className="rounded-full border border-pink-200/90 bg-[#FFF5F8] px-2.5 py-0.5 font-sans text-[11px] font-medium text-ink shadow-xs"
                            >
                              {love}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Fun Facts */}
                      <div className="text-left">
                        <h3 className="font-hand text-sm font-bold text-ink/90">
                          Fun facts:
                        </h3>
                        <ul className="mt-1 space-y-1 font-sans text-[11px] text-ink/80 list-disc list-inside">
                          {about.funFacts.map((fact) => (
                            <li key={fact}>{fact}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Resume Download Button */}
                      <div className="pt-2 pb-5 text-center">
                        <a
                          href={site.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group/btn inline-flex items-center gap-2 rounded-full border-2 border-white bg-gradient-to-r from-[#E8507D] via-[#D83A6F] to-[#BF2156] px-5 py-2 font-hand text-base font-bold text-white shadow-[0_4px_14px_rgba(216,58,111,0.45)] transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_20px_rgba(216,58,111,0.65)] hover:from-[#D83A6F] hover:to-[#A31644] active:scale-95"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
                            <svg
                              className="h-3.5 w-3.5 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </span>
                          <span>Download my resume</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
