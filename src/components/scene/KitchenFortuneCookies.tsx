'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundscape } from '@/lib/soundEngine';
import { recipes, type Recipe } from '@/data/experience';

export default function KitchenFortuneCookies() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'whole' | 'cracking' | 'reading'>('whole');
  const [crumbSparkles, setCrumbSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const currentRecipe: Recipe = recipes[currentIndex] ?? recipes[0];

  // Lock body scroll and trigger modal-open CSS rule to hide headers and sound toggle
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cookie-modal-open');
    } else {
      document.body.classList.remove('cookie-modal-open');
    }
    return () => {
      document.body.classList.remove('cookie-modal-open');
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Execute the cracking sequence
  const startCrackSequence = useCallback((targetIndex?: number) => {
    if (targetIndex !== undefined) {
      setCurrentIndex(targetIndex);
    }
    setPhase('whole');

    // Generate random crumb sparkles around center
    const crumbs = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 160,
    }));
    setCrumbSparkles(crumbs);

    // After 350ms anticipation, crack the cookie with sound
    const crackTimer = setTimeout(() => {
      setPhase('cracking');
      soundscape.playCookieCrackSound();

      // After crack plays, reveal the paper slip
      const revealTimer = setTimeout(() => {
        setPhase('reading');
        soundscape.playPageTurnSound();
      }, 550);

      return () => clearTimeout(revealTimer);
    }, 400);

    return () => clearTimeout(crackTimer);
  }, []);

  const handleOpenTray = () => {
    soundscape.playClickSound();
    setIsOpen(true);
    startCrackSequence(0);
  };

  const handleClose = () => {
    soundscape.playClickSound();
    setIsOpen(false);
    setPhase('whole');
  };

  const handleNextCookie = () => {
    soundscape.playClickSound();
    const nextIdx = (currentIndex + 1) % recipes.length;
    startCrackSequence(nextIdx);
  };

  const handlePrevCookie = () => {
    soundscape.playClickSound();
    const prevIdx = (currentIndex - 1 + recipes.length) % recipes.length;
    startCrackSequence(prevIdx);
  };

  const handleSelectCookie = (idx: number) => {
    if (idx === currentIndex) return;
    soundscape.playClickSound();
    startCrackSequence(idx);
  };

  return (
    <>
      {/* ---------------- Hotspot on Cookie Tray in RoomScene ---------------- */}
      {/* Situated on the baking tray on the countertop (X: ~62.5%, Y: ~30%) */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
        style={{ left: '62.5%', top: '30.0%' }}
      >
        <button
          type="button"
          onClick={handleOpenTray}
          aria-label="Crack a freshly baked fortune cookie to view work experience"
          className="group relative flex flex-col items-center focus:outline-none"
        >
          {/* Subtle warm halo aura */}
          <span
            aria-hidden="true"
            className="absolute -inset-2.5 rounded-full bg-amber-400/35 blur-md transition-opacity duration-300 animate-pulse group-hover:bg-pink-400/50"
          />

          {/* Pulsing breathing ring */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-pink-300/50 opacity-60 transition-opacity duration-300 animate-ping-soft group-hover:opacity-90 dark:bg-pink-400/30"
          />

          {/* Rose-berry glossy bubble button */}
          <span className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-[0_4px_16px_rgba(214,70,118,0.45)] backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(244,114,182,0.85)] group-active:scale-95">
            {/* Glossy top-left bubble highlight */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1.5 left-2 h-2.5 w-3.5 rounded-full bg-white/45 blur-[0.5px] -rotate-12"
            />

            {/* Custom SVG Fortune Cookie / Fresh Bakery Sparkle Icon (Zero emojis) */}
            <svg
              className="h-6 w-6 text-white drop-shadow-xs transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12c0 2.85 1.19 5.42 3.11 7.24.41.39 1.06.35 1.42-.09.31-.38.28-.94-.09-1.29C4.85 16.32 4 14.26 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.26-.85 4.32-2.44 5.86-.37.35-.4.91-.09 1.29.36.44 1.01.48 1.42.09C20.81 17.42 22 14.85 22 12c0-5.52-4.48-10-10-10zm-1 5a1 1 0 102 0 1 1 0 00-2 0zm-4 4a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0zm-4 3a2.5 2.5 0 00-2.5 2.5c0 .28.22.5.5.5h4c.28 0 .5-.22.5-.5A2.5 2.5 0 0011 14z" />
            </svg>
          </span>

          {/* Hover / focus tooltip pill */}
          <span
            role="tooltip"
            className="pointer-events-none absolute top-full mt-2 flex flex-col items-center whitespace-nowrap rounded-xl border border-pink-200/90 bg-paper/95 px-3 py-1 font-sans text-xs font-bold text-ink opacity-0 shadow-lg backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:translate-y-0.5 dark:border-white/20 dark:bg-[#25182E]/95 dark:text-pink-100"
          >
            <span className="font-display text-xs text-pink-600 dark:text-pink-300 font-extrabold tracking-wide">
              Crack a Fortune Cookie
            </span>
            <span className="font-hand text-[11px] text-ink-soft">
              Freshly baked work experiences &bull; Click to open
            </span>
          </span>
        </button>
      </div>

      {/* ---------------- Fullscreen Fortune Cookie Overlay ---------------- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden select-none">
            {/* Backdrop with dark cozy warmth and heavy blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              className="absolute inset-0 bg-[#1D1119]/80 backdrop-blur-md cursor-pointer"
            />

            {/* Top-right close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={handleClose}
              aria-label="Close fortune cookie experience"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-white/90 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 focus:outline-none"
            >
              <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* ---------------- Phase 1 & 2: Whole & Cracking Cookie Animation ---------------- */}
            {(phase === 'whole' || phase === 'cracking') && (
              <motion.div
                key={`cookie-crack-${currentIndex}-${phase}`}
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{
                  scale: phase === 'cracking' ? [1, 1.08, 0.95, 1.02] : [0.85, 1.02, 1],
                  rotate: phase === 'cracking' ? [-2, 3, -3, 2, 0] : 0,
                  opacity: 1,
                }}
                exit={{ scale: 1.15, opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative z-40 flex flex-col items-center justify-center select-none"
              >
                {/* Whole cookie state */}
                {phase === 'whole' && (
                  <motion.div
                    animate={{
                      y: [-4, 4, -4],
                      rotate: [-1, 1, -1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: 'easeInOut',
                    }}
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => startCrackSequence()}
                  >
                    {/* Golden halo warmth behind cookie */}
                    <div className="absolute inset-0 -m-10 rounded-full bg-amber-400/25 blur-3xl" />

                    <img
                      src="/assets/objects/fortune-cookie-whole.png"
                      alt="Whole Golden Fortune Cookie"
                      className="relative h-48 w-48 sm:h-64 sm:w-64 md:h-72 md:w-72 object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105"
                    />

                    <div className="mt-4 flex flex-col items-center text-center">
                      <span className="font-display text-lg sm:text-xl md:text-2xl font-extrabold text-amber-200 drop-shadow-md">
                        Cracking Fortune #{currentIndex + 1}...
                      </span>
                      <span className="font-hand text-sm sm:text-base text-pink-200/90 font-medium mt-0.5">
                        Fresh out of the oven &bull; Revealing {currentRecipe.org}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Cracked cookie state with crumb burst */}
                {phase === 'cracking' && (
                  <div className="relative flex flex-col items-center">
                    {/* Crumb particle sparkles */}
                    {crumbSparkles.map((crumb) => (
                      <motion.span
                        key={crumb.id}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{
                          opacity: 0,
                          x: crumb.x,
                          y: crumb.y,
                          scale: 0.2,
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute h-2 w-2 rounded-full bg-amber-300 shadow-xs"
                      />
                    ))}

                    <img
                      src="/assets/objects/fortune-cookie-cracked.png"
                      alt="Cracked Fortune Cookie"
                      className="relative h-48 w-56 sm:h-64 sm:w-80 md:h-72 md:w-96 object-contain drop-shadow-[0_20px_32px_rgba(0,0,0,0.6)]"
                    />

                    <div className="mt-4 flex flex-col items-center">
                      <span className="font-display text-lg sm:text-xl font-extrabold text-amber-300 animate-pulse">
                        * Snap! *
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ---------------- Phase 3: Parchment Paper Sheet (Fills Screen) ---------------- */}
            {phase === 'reading' && (
              <motion.div
                key={`fortune-paper-${currentIndex}`}
                initial={{ scale: 0.88, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                className="relative z-40 w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl border-2 sm:border-[3px] border-[#E8D4C8] bg-[#FFFDF8] text-[#3D2633] shadow-[0_24px_60px_rgba(0,0,0,0.55),0_2px_8px_rgba(232,212,200,0.4)] overflow-hidden"
              >
                {/* Vintage Washi Tape Strip at top center */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 z-20 pointer-events-none select-none">
                  <div className="h-4 sm:h-5 w-28 sm:w-36 bg-pink-200/85 border border-pink-300/80 shadow-xs rotate-1 -skew-x-6 backdrop-blur-xs flex items-center justify-center">
                    <span className="text-[9px] sm:text-[10px] font-hand font-bold tracking-wider text-pink-700/80 uppercase">
                      Baked with care
                    </span>
                  </div>
                </div>

                {/* Parchment subtle texture lines overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#3D2633_1px,transparent_1px)] [background-size:16px_16px]"
                />

                {/* ---------------- Card Header: Bakery Tag & Meta ---------------- */}
                <header className="relative shrink-0 px-4 pt-5 pb-3 sm:px-8 sm:pt-6 sm:pb-4 border-b border-[#F0E2D6] bg-gradient-to-b from-[#FFF9F2] to-[#FFFDF8]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Cookie Tracker & Bakery Stamp */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-300 bg-pink-50 px-2.5 py-0.5 sm:px-3 sm:py-1 font-display text-[10px] sm:text-xs font-bold text-pink-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse" />
                        Fortune #{currentIndex + 1} of {recipes.length}
                      </span>
                      <span className="hidden xs:inline-block rounded-full bg-[#FAF0E6] px-2.5 py-0.5 sm:px-3 sm:py-1 font-hand text-[11px] sm:text-xs font-bold text-[#8C6B4F]">
                        {currentRecipe.category}
                      </span>
                    </div>

                    {/* Timeline pill */}
                    <span className="rounded-full border border-[#E8D4C8] bg-white/90 px-2.5 py-0.5 sm:px-3 sm:py-1 font-hand text-xs sm:text-sm font-bold text-[#8C6B4F]">
                      {currentRecipe.period}
                    </span>
                  </div>

                  {/* Main Job Title & Company */}
                  <div className="mt-2.5 sm:mt-3">
                    <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#341F2B]">
                      {currentRecipe.title}
                    </h2>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm md:text-base font-bold text-pink-700">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 fill-current text-pink-600" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {currentRecipe.org}
                      </span>

                      {currentRecipe.location && (
                        <span className="flex items-center gap-1 text-[#8C6B4F] font-medium">
                          <svg className="h-3 w-3 fill-current text-[#8C6B4F]" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {currentRecipe.location}
                        </span>
                      )}
                    </div>

                    {/* Tagline summary */}
                    {currentRecipe.tagline && (
                      <p className="mt-1 font-hand text-sm sm:text-base md:text-lg text-[#6E4F5D] font-bold">
                        &ldquo;{currentRecipe.tagline}&rdquo;
                      </p>
                    )}
                  </div>
                </header>

                {/* ---------------- Scrollable Content Body ---------------- */}
                <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-6 select-text">
                  {/* Summary note box */}
                  {currentRecipe.summary && (
                    <div className="rounded-xl border border-pink-200/80 bg-gradient-to-r from-pink-50/70 to-amber-50/60 p-3 sm:p-4 text-xs sm:text-sm md:text-base leading-relaxed text-[#4A323E]">
                      <span className="font-hand font-extrabold text-pink-700 text-sm sm:text-base mr-1.5">
                        Overview:
                      </span>
                      {currentRecipe.summary}
                    </div>
                  )}

                  {/* Key Featured Projects (if present) */}
                  {currentRecipe.keyProjects && currentRecipe.keyProjects.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-1.5 font-display text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#8C6B4F]">
                        <svg className="h-4 w-4 fill-pink-500" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Key Initiatives & Systems
                      </h3>
                      <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                        {currentRecipe.keyProjects.map((proj, pIdx) => (
                          <div
                            key={pIdx}
                            className="rounded-xl border border-[#EADBCE] bg-white/80 p-3 sm:p-3.5 shadow-xs transition-shadow hover:shadow-md"
                          >
                            <h4 className="font-display text-xs sm:text-sm font-extrabold text-[#3D2633]">
                              {proj.name}
                            </h4>
                            <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-[#6E4F5D]">
                              {proj.description}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {proj.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="rounded-md bg-pink-100/70 px-1.5 py-0.5 font-mono text-[9.5px] sm:text-[10px] font-bold text-pink-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Accomplishment Bullets */}
                  <div>
                    <h3 className="flex items-center gap-1.5 font-display text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#8C6B4F]">
                      <svg className="h-4 w-4 fill-pink-500" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Highlights & Impact
                    </h3>
                    <ul className="mt-2.5 space-y-2.5 sm:space-y-3">
                      {currentRecipe.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm md:text-base text-[#4A323E] leading-relaxed">
                          <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pink-200 text-pink-700 text-[10px] font-bold">
                            &bull;
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recipe Ingredients (Tech Stack) */}
                  <div className="pt-2 border-t border-[#F0E2D6]">
                    <h3 className="flex items-center gap-1.5 font-display text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8C6B4F]">
                      <svg className="h-4 w-4 fill-amber-500" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                      </svg>
                      Recipe Ingredients (Tech Stack)
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                      {currentRecipe.ingredients.map((ingredient, iIdx) => (
                        <span
                          key={iIdx}
                          className="rounded-full border border-pink-200/90 bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[10.5px] sm:text-xs font-bold text-[#5C3D4D] shadow-2xs hover:border-pink-300 hover:text-pink-700 transition-colors"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ---------------- Card Bottom Bar: Controls & Pagination ---------------- */}
                <footer className="relative shrink-0 px-4 py-3 sm:px-8 sm:py-4 border-t border-[#F0E2D6] bg-gradient-to-t from-[#FFF9F2] to-[#FFFDF8] flex items-center justify-between gap-2 select-none">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={handlePrevCookie}
                    aria-label="Crack previous fortune cookie"
                    className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-pink-200/90 bg-white px-2.5 py-1.5 sm:px-4 sm:py-2 font-display text-xs sm:text-sm font-bold text-ink shadow-xs transition-all hover:scale-105 active:scale-95 hover:bg-pink-50"
                  >
                    <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden xs:inline">Prev Cookie</span>
                  </button>

                  {/* 4 Cookie Crumb Dots */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {recipes.map((r, idx) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleSelectCookie(idx)}
                        aria-label={`View fortune ${idx + 1}: ${r.title}`}
                        title={r.title}
                        className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? 'w-6 sm:w-8 bg-gradient-to-r from-pink-500 to-rose-500 shadow-xs'
                            : 'w-2.5 sm:w-3 bg-pink-200 hover:bg-pink-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Next / Crack Another Button */}
                  <button
                    type="button"
                    onClick={handleNextCookie}
                    aria-label="Crack next fortune cookie"
                    className="flex items-center gap-1.5 sm:gap-2 rounded-full border-2 border-white/95 bg-gradient-to-r from-[#FFB8CE] via-[#F482A5] to-[#D64676] px-3 py-1.5 sm:px-5 sm:py-2 font-display text-xs sm:text-sm font-extrabold text-white shadow-cozy transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{currentIndex === recipes.length - 1 ? 'Start Over' : 'Crack Next Fortune'}</span>
                    <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </footer>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}