'use client';

import Link from 'next/link';
import { soundscape } from '@/lib/soundEngine';

interface RoomNavArrowsProps {
  prev?: {
    name: string;
    href: string;
  };
  next?: {
    name: string;
    href: string;
  };
}

export default function RoomNavArrows({ prev, next }: RoomNavArrowsProps) {
  return (
    <>
      {/* Left Arrow: Previous Room */}
      {prev && (
        <div className="fixed left-2.5 sm:left-6 top-1/2 -translate-y-1/2 z-30 select-none">
          <Link
            href={prev.href}
            onClick={() => soundscape.playClickSound()}
            aria-label={`Go to ${prev.name}`}
            className="group relative flex items-center focus:outline-none"
          >
            {/* Pulsing breathing ring */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-pink-300/40 opacity-50 transition-opacity duration-300 animate-ping-soft group-hover:opacity-80 dark:bg-pink-400/25"
            />

            {/* Pink bubble button */}
            <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-cozy backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(244,114,182,0.75)] group-active:scale-95 dark:border-white/30 dark:from-[#D64676] dark:via-[#B52D5E] dark:to-[#7E1B40]">
              {/* Glossy bubble highlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 left-2 h-2.5 w-3.5 rounded-full bg-white/45 blur-[0.5px] -rotate-12"
              />

              {/* Left Arrow Icon */}
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:-translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>

            {/* Tooltip bubble on hover/focus */}
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full ml-2.5 whitespace-nowrap rounded-full border border-pink-200/90 bg-paper/95 px-3 py-1 font-hand text-base font-bold text-ink opacity-0 shadow-md backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:translate-x-1 dark:border-white/20 dark:bg-[#25182E]/95 dark:text-pink-100"
            >
              &larr; {prev.name}
            </span>
          </Link>
        </div>
      )}

      {/* Right Arrow: Next Room */}
      {next && (
        <div className="fixed right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-30 select-none">
          <Link
            href={next.href}
            onClick={() => soundscape.playClickSound()}
            aria-label={`Go to ${next.name}`}
            className="group relative flex items-center justify-end focus:outline-none"
          >
            {/* Tooltip bubble on hover/focus */}
            <span
              role="tooltip"
              className="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-full border border-pink-200/90 bg-paper/95 px-3 py-1 font-hand text-base font-bold text-ink opacity-0 shadow-md backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:-translate-x-1 dark:border-white/20 dark:bg-[#25182E]/95 dark:text-pink-100"
            >
              {next.name} &rarr;
            </span>

            {/* Pulsing breathing ring */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-pink-300/40 opacity-50 transition-opacity duration-300 animate-ping-soft group-hover:opacity-80 dark:bg-pink-400/25"
            />

            {/* Pink bubble button */}
            <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-cozy backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(244,114,182,0.75)] group-active:scale-95 dark:border-white/30 dark:from-[#D64676] dark:via-[#B52D5E] dark:to-[#7E1B40]">
              {/* Glossy bubble highlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 left-2 h-2.5 w-3.5 rounded-full bg-white/45 blur-[0.5px] -rotate-12"
              />

              {/* Right Arrow Icon */}
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </Link>
        </div>
      )}
    </>
  );
}
