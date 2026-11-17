'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundscape } from '@/lib/soundEngine';

type BrewState = 'idle' | 'brewing' | 'pouring' | 'served';

/* ------------------------------------------------------------------ *
 *  Stovetop burner positions (% of room-art width/height):
 *
 *  The pink stove's dark cooktop has 2 rows × 2 columns of burner
 *  circles. We place the kettle on the front-left burner and the
 *  teacup on the front-right burner so pouring looks natural.
 *
 *  Front-left burner  ≈ 24.5 %, 48 %
 *  Front-right burner ≈ 32 %,  48 %
 * ------------------------------------------------------------------ */

const KETTLE_REST  = { left: '24.5%', top: '44%' };   // on the dark stovetop burner
const CUP_POS      = { left: '44%',   top: '49%' };   // right wooden countertop
const KETTLE_POUR  = { left: '45%',   top: '40%' };   // to the RIGHT of cup, spout pours left into it
const BUTTON_POS   = { left: '26%',   top: '39%' };   // resting close to the kettle handle/lid

export default function KitchenTeaBrewer() {
  const [brewState, setBrewState] = useState<BrewState>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleStartBrew = () => {
    if (brewState !== 'idle') return;

    // 1. Start brewing & boiling sound
    soundscape.playClickSound();
    soundscape.playTeaBoilSound();
    setBrewState('brewing');

    // 2. Transition to pouring after boiling completes (~2.8s)
    timerRef.current = setTimeout(() => {
      soundscape.playTeaPourSound();
      setBrewState('pouring');

      // 3. Transition to served with cup & speech bubble (~2.3s)
      timerRef.current = setTimeout(() => {
        setBrewState('served');

        // 4. Reset to idle after the visitor has had a moment to enjoy (~6s)
        timerRef.current = setTimeout(() => {
          setBrewState('idle');
        }, 6000);
      }, 2300);
    }, 2800);
  };

  return (
    <>
      {/* ---------------- 1. The Teacup (appears on right front burner) ---------------- */}
      <AnimatePresence>
        {(brewState === 'pouring' || brewState === 'served') && (
          <motion.div
            key="kitchen-teacup"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 6 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="absolute z-20 -translate-x-1/2 -translate-y-[85%] select-none pointer-events-none"
            style={{ ...CUP_POS, width: '4.6%' }}
          >
            {/* Soft ground shadow on burner */}
            <div
              aria-hidden="true"
              className="absolute -bottom-1 left-1/2 h-2 w-4/5 -translate-x-1/2 rounded-full bg-[#5A3825]/35 blur-[2px]"
            />

            {/* Teacup Graphic */}
            <img
              src="/assets/objects/kitchen-teacup.png"
              alt="Handmade Ceramic Ribbon Bow Teacup"
              className="relative h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
            />

            {/* Rising steam from freshly poured tea */}
            {(brewState === 'served' || brewState === 'pouring') && (
              <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 flex justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={`cup-steam-${i}`}
                    initial={{ opacity: 0, y: 0, scale: 0.6, x: 0 }}
                    animate={{
                      opacity: [0, 0.65, 0],
                      y: [-2, -18, -32],
                      x: [0, i % 2 === 0 ? 3 : -3, 0],
                      scale: [0.6, 1.1, 1.4],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      delay: i * 0.7,
                      ease: 'easeInOut',
                    }}
                    className="absolute h-3 w-3 rounded-full bg-white/70 blur-[1.5px]"
                  />
                ))}
              </div>
            )}

            {/* Speech Bubble: "Here's a cup of tea for you !" */}
            <AnimatePresence>
              {brewState === 'served' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 4 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 300, delay: 0.15 }}
                  className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap"
                >
                  <div className="relative rounded-2xl border-2 border-pink-300/90 bg-[#FFFDF8]/95 px-3 py-1.5 sm:px-4 sm:py-2 text-center shadow-[0_8px_24px_rgba(214,70,118,0.28)] backdrop-blur-xs">
                    {/* Tiny speech bubble pointer arrow */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-[#FFFDF8] drop-shadow-xs" />

                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="font-display text-xs sm:text-sm font-extrabold text-[#341F2B] tracking-tight">
                        Here&apos;s a cup of tea for you !
                      </span>
                      {/* Cozy Heart SVG */}
                      <svg className="h-3.5 w-3.5 text-pink-500 fill-current animate-pulse shrink-0" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- 2. The Tea Kettle (rests on left front burner) ---------------- */}
      <motion.div
        key="kitchen-kettle"
        animate={{
          left: brewState === 'pouring' ? KETTLE_POUR.left : KETTLE_REST.left,
          top:  brewState === 'pouring' ? KETTLE_POUR.top  : KETTLE_REST.top,
          y: brewState === 'brewing' ? [-1, 1, -1] : 0,
        }}
        transition={{
          left: { type: 'spring', damping: 24, stiffness: 180 },
          top:  { type: 'spring', damping: 24, stiffness: 180 },
          y: { repeat: brewState === 'brewing' ? Infinity : 0, duration: 0.16 },
        }}
        className="absolute z-20 -translate-x-1/2 -translate-y-[85%] select-none pointer-events-none"
        style={{ width: '7.2%' }}
      >
        {/* Burner contact shadow beneath kettle */}
        {brewState !== 'pouring' && (
          <div
            aria-hidden="true"
            className="absolute -bottom-1 left-1/2 h-2 w-3/4 -translate-x-1/2 rounded-full bg-black/40 blur-[2px]"
          />
        )}

        {/* Kettle Graphic: Switches between resting and pouring */}
        <div className="relative h-full w-full">
          {brewState === 'pouring' ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src="/assets/objects/kitchen-kettle-pour.png"
              alt="Vintage Enamel Tea Kettle Pouring"
              className="h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
            />
          ) : (
            <img
              src="/assets/objects/kitchen-kettle.png"
              alt="Vintage Enamel Tea Kettle on Stove"
              className="h-full w-full object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.2)]"
            />
          )}

          {/* Steam wisps rising from kettle spout while boiling */}
          {brewState === 'brewing' && (
            <div className="absolute top-2 left-1 pointer-events-none">
              {[0, 1, 2, 3].map((w) => (
                <motion.span
                  key={`kettle-steam-${w}`}
                  initial={{ opacity: 0, y: 0, scale: 0.5, x: 0 }}
                  animate={{
                    opacity: [0, 0.75, 0],
                    y: [-4, -28, -50],
                    x: [0, w % 2 === 0 ? -4 : 4, -2],
                    scale: [0.5, 1.2, 1.8],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    delay: w * 0.45,
                    ease: 'easeOut',
                  }}
                  className="absolute h-3.5 w-3.5 rounded-full bg-white/80 blur-[2px]"
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ---------------- 3. Interactive Bubble Button (just above kettle) ---------------- */}
      {brewState === 'idle' && (
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
          style={BUTTON_POS}
        >
          <button
            type="button"
            onClick={handleStartBrew}
            aria-label="Brew a warm pot of tea"
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
            <span className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-[0_4px_16px_rgba(214,70,118,0.45)] backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(244,114,182,0.85)] group-active:scale-95">
              {/* Glossy top-left bubble highlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 left-2 h-2.5 w-3.5 rounded-full bg-white/45 blur-[0.5px] -rotate-12"
              />

              {/* Custom SVG Tea Kettle / Teapot Icon */}
              <svg
                className="h-5 w-5 text-white drop-shadow-xs transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* Teapot Body & Spout */}
                <path d="M19 14a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5z" />
                <path d="M19 10l3-2" />
                <path d="M14 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2" />
                <path d="M3 11a4 4 0 0 0-2 3" />
              </svg>
            </span>

            {/* Hover / focus tooltip pill */}
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full mb-2 flex flex-col items-center whitespace-nowrap rounded-xl border border-pink-200/90 bg-paper/95 px-3 py-1 font-sans text-xs font-bold text-ink opacity-0 shadow-lg backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:-translate-y-0.5 dark:border-white/20 dark:bg-[#25182E]/95 dark:text-pink-100"
            >
              <span className="font-display text-xs text-pink-600 dark:text-pink-300 font-extrabold tracking-wide">
                Brew a Cup of Tea
              </span>
              <span className="font-hand text-[11px] text-ink-soft">
                Freshly boiled on the stove &bull; Click to brew
              </span>
            </span>
          </button>
        </div>
      )}
    </>
  );
}
