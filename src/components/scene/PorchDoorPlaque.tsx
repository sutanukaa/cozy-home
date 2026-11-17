'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { soundscape } from '@/lib/soundEngine';

// Coordinates on the front door (X: ~50.5%, Y: ~55%)
const DOOR_POS = { left: '50.5%', top: '55%' };
const BUBBLE_POS = { left: '50.5%', top: '41%' };

/**
 * PorchDoorPlaque
 *
 * Vintage wooden nameplate hanging by a soft pink ribbon in the middle of
 * the cottage front door, welcoming visitors to "Suto's home".
 * A glossy bubble button above it lets visitors knock on the door ("tok-tok")
 * before entering into the Living Room.
 */
export default function PorchDoorPlaque() {
  const router = useRouter();
  const [isKnocking, setIsKnocking] = useState(false);

  const handleKnockAndEnter = async () => {
    if (isKnocking) return;
    setIsKnocking(true);

    // 1. Play tactile procedural double-knock ("tok-tok")
    await soundscape.playKnockSound();

    // 2. Allow the sound to play out and navigate to Living Room
    setTimeout(() => {
      router.push('/');
    }, 420);
  };

  return (
    <>
      {/* ---------------- 1. The Hanging Wooden Door Plaque ---------------- */}
      <div
        onClick={handleKnockAndEnter}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleKnockAndEnter();
          }
        }}
        aria-label="Knock on door and enter Suto's home (Living Room)"
        className="group absolute z-20 cursor-pointer select-none -translate-x-1/2 -translate-y-1/2 focus:outline-none"
        style={{
          ...DOOR_POS,
          width: '8.2%',
        }}
      >
        <motion.div
          animate={
            isKnocking
              ? {
                  rotate: [0, -3, 3, -2, 1, 0],
                  scale: [1, 0.96, 1.02, 0.98, 1],
                  transition: { duration: 0.4 },
                }
              : undefined
          }
          whileHover={{
            rotate: [0, -2, 2, -1, 0],
            transition: { duration: 0.6, ease: 'easeInOut' },
          }}
          className="relative h-full w-full origin-top"
        >
          {/* Soft contact shadow cast by the hanging plaque on the door */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl bg-black/20 blur-[6px] translate-y-1 scale-95 pointer-events-none"
          />

          {/* The Illustrated Plaque Graphic */}
          <img
            src="/assets/objects/porch-plaque.png"
            alt="Suto's home door plaque"
            className="h-full w-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] pointer-events-none"
          />

          {/* Engraved Handwritten Text on the Wooden Board */}
          <div
            className="absolute inset-x-0 flex items-center justify-center text-center pointer-events-none"
            style={{ top: '44%', height: '44%' }}
          >
            <span
              className="font-hand font-extrabold text-[#5B3A47] tracking-wide select-none leading-none drop-shadow-xs"
              style={{
                fontSize: 'clamp(0.6rem, 1.15vw, 1.1rem)',
                textShadow: '0 1px 0 rgba(255, 255, 255, 0.45), 0 -1px 0 rgba(74, 46, 53, 0.25)',
              }}
            >
              Suto&apos;s home
            </span>
          </div>

          {/* Cozy hover tooltip */}
          <span
            role="tooltip"
            className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center whitespace-nowrap rounded-xl border border-pink-200/90 bg-white/95 px-2.5 py-0.5 font-sans text-[11px] font-bold text-[#5B3A47] opacity-0 shadow-md backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:translate-y-0.5 dark:border-white/20 dark:bg-[#25182E]/95 dark:text-pink-100"
          >
            <span className="font-display text-[11px] text-pink-600 dark:text-pink-300 font-extrabold">
              Knock &bull; Enter Living room
            </span>
          </span>
        </motion.div>
      </div>

      {/* ---------------- 2. Glossy Bubble Button Above Door Plaque ---------------- */}
      <div
        className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
        style={BUBBLE_POS}
      >
        <button
          type="button"
          onClick={handleKnockAndEnter}
          disabled={isKnocking}
          aria-label="Knock on door and enter living room"
          className="group relative flex items-center justify-center focus:outline-none"
        >
          {/* Ambient glowing backdrop */}
          <span
            aria-hidden="true"
            className="absolute -inset-1.5 rounded-full bg-pink-400/30 blur-md transition-all duration-300 group-hover:bg-pink-400/50 group-hover:blur-lg dark:bg-pink-500/20"
          />

          {/* Breathing ping ring */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-pink-300/50 opacity-60 transition-opacity duration-300 animate-ping-soft group-hover:opacity-90 dark:bg-pink-400/30"
          />

          {/* Rose-berry glossy bubble button */}
          <motion.span
            animate={
              isKnocking
                ? {
                    scale: [1, 0.88, 1.1, 0.95, 1],
                    rotate: [0, -4, 4, -2, 0],
                    transition: { duration: 0.35 },
                  }
                : undefined
            }
            className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-[0_4px_16px_rgba(214,70,118,0.45)] backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(244,114,182,0.85)] group-active:scale-95"
          >
            {/* Glossy top-left bubble highlight */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1.5 left-2 h-2.5 w-3.5 rounded-full bg-white/45 blur-[0.5px] -rotate-12"
            />

            {/* Custom SVG Cottage Front Door Icon */}
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 21h18M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
              <circle cx="14" cy="12" r="1" fill="currentColor" />
            </svg>
          </motion.span>

          {/* Hover / focus tooltip pill */}
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full mb-2 flex flex-col items-center whitespace-nowrap rounded-xl border border-pink-200/90 bg-paper/95 px-3 py-1 font-sans text-xs font-bold text-ink opacity-0 shadow-lg backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:-translate-y-0.5 dark:border-white/20 dark:bg-[#25182E]/95 dark:text-pink-100"
          >
            <span className="font-display text-xs text-pink-600 dark:text-pink-300 font-extrabold tracking-wide">
              {isKnocking ? 'Knocking... 🚪' : 'Knock on Door'}
            </span>
            <span className="font-hand text-[11px] text-ink-soft">
              {isKnocking ? 'Opening the door!' : 'Click to knock &bull; Enter living room'}
            </span>
          </span>
        </button>
      </div>
    </>
  );
}
