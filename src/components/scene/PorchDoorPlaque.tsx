'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { soundscape } from '@/lib/soundEngine';

/**
 * PorchDoorPlaque
 *
 * Vintage wooden nameplate hanging by a soft pink ribbon in the middle of
 * the cottage front door, welcoming visitors to "Suto's home".
 * Clicking it takes the visitor through the front door into the Living Room.
 */
export default function PorchDoorPlaque() {
  return (
    <Link
      href="/"
      onClick={() => soundscape.playClickSound()}
      aria-label="Enter Suto's home (Living Room)"
      className="group absolute z-20 cursor-pointer select-none -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{
        left: '30.5%',
        top: '55%',
        width: '8.2%',
      }}
    >
      <motion.div
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
            Come inside &bull; Living room
          </span>
        </span>
      </motion.div>
    </Link>
  );
}
