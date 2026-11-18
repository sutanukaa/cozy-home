'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { soundscape } from '@/lib/soundEngine';

interface Droplet {
  id: number;
  x: number;
  delay: number;
}

const STORAGE_KEY = 'cozy-studio-plant-state';

export default function StudioDeskPlant() {
  const [mounted, setMounted] = useState(false);
  // Stage 0: Tiny sprout, Stage 1: Growing foliage, Stage 2: Fully grown & blooming
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [watersInStage0, setWatersInStage0] = useState<number>(0);
  const [isWatering, setIsWatering] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [showSparkles, setShowSparkles] = useState<boolean>(false);

  // Restore state safely from localStorage on client mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.stage === 'number' && [0, 1, 2].includes(parsed.stage)) {
          setStage(parsed.stage);
        }
        if (typeof parsed.watersInStage0 === 'number') {
          setWatersInStage0(parsed.watersInStage0);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save state on change
  const persistState = useCallback((newStage: 0 | 1 | 2, newWaters: number) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stage: newStage, watersInStage0: newWaters })
      );
    } catch {
      // Ignore localStorage write failures
    }
  }, []);

  const handleWater = useCallback(() => {
    if (isWatering) return;
    setIsWatering(true);
    soundscape.playClickSound();

    // Spawn 5 sequential falling droplets targeted at pot soil
    const newDroplets: Droplet[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: -8 + i * 4, // spread nicely across the pot soil
      delay: i * 0.12,
    }));
    setDroplets(newDroplets);

    // Calculate progression
    setTimeout(() => {
      if (stage === 0) {
        const nextWaters = watersInStage0 + 1;
        if (nextWaters >= 3) {
          // Grow to Stage 1 (Middle state)
          setStage(1);
          setWatersInStage0(0);
          persistState(1, 0);
          setShowSparkles(true);
          setTimeout(() => setShowSparkles(false), 1800);
        } else {
          setWatersInStage0(nextWaters);
          persistState(0, nextWaters);
        }
      } else if (stage === 1) {
        // Grow to Stage 2 (Fully grown & blooming)
        setStage(2);
        persistState(2, 0);
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 2400);
      } else {
        // Stage 2: fully bloomed, refreshing sprinkle with sparkles
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 1600);
      }
    }, 900);

    // Reset pouring animation state after full sequence
    setTimeout(() => {
      setIsWatering(false);
      setDroplets([]);
    }, 1400);
  }, [isWatering, stage, watersInStage0, persistState]);

  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      soundscape.playClickSound();
      setStage(0);
      setWatersInStage0(0);
      persistState(0, 0);
    },
    [persistState]
  );

  // Asset image selector based on stage
  const getPlantAsset = () => {
    switch (stage) {
      case 0:
        return '/assets/objects/studio-plant-tiny.webp';
      case 1:
        return '/assets/objects/studio-plant-growing.webp';
      case 2:
      default:
        return '/assets/objects/studio-plant-full.webp';
    }
  };

  // Tooltip prompt text (Zero Emojis)
  const getBubbleText = () => {
    if (stage === 0) {
      return `Click to water (${watersInStage0}/3)`;
    }
    if (stage === 1) {
      return 'Click to water (water to bloom)';
    }
    return 'Fully bloomed with love';
  };

  return (
    <div
      className="absolute pointer-events-auto select-none"
      style={{
        left: '70.0%',
        top: '53.0%',
        transform: 'translate(-50%, -98.6%)',
        width: '6.5%',
        aspectRatio: '1 / 1',
        zIndex: 15,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleWater}
      role="button"
      tabIndex={0}
      aria-label={`Studio Desk Plant - Stage ${stage + 1}. ${getBubbleText()}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleWater();
        }
      }}
    >
      <div className="relative h-full w-full cursor-pointer flex items-end justify-center">
        {/* --- 0. GLOSSY BUBBLE BUTTON ABOVE PLANT --- */}
        <div
          className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 z-30 select-none cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleWater();
          }}
        >
          <button
            type="button"
            aria-label="Water the studio desk plant"
            className="group relative flex items-center justify-center focus:outline-none"
          >
            {/* Ambient glowing backdrop */}
            <span
              aria-hidden="true"
              className="absolute -inset-1 rounded-full bg-pink-400/30 blur-md transition-all duration-300 group-hover:bg-pink-400/50 group-hover:blur-lg dark:bg-pink-500/20"
            />

            {/* Breathing ping ring */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-pink-300/50 opacity-60 transition-opacity duration-300 animate-ping-soft group-hover:opacity-90 dark:bg-pink-400/30"
            />

            {/* Rose-berry glossy bubble button */}
            <span className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-[0_4px_14px_rgba(214,70,118,0.45)] backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(244,114,182,0.85)] group-active:scale-95">
              {/* Glossy top-left bubble highlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1 left-1.5 h-2 w-2.5 rounded-full bg-white/45 blur-[0.5px] -rotate-12"
              />

              {/* Water Droplet Icon */}
              <svg
                className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white drop-shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </span>

            {/* Tooltip on hover */}
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full mb-1.5 flex flex-col items-center whitespace-nowrap rounded-xl border border-pink-200/90 bg-paper/95 px-2.5 py-0.5 font-sans text-[10px] font-bold text-ink opacity-0 shadow-md backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:-translate-y-0.5 dark:border-white/20 dark:bg-[#25182E]/95 dark:text-pink-100"
            >
              <span className="font-display text-[10px] text-pink-600 dark:text-pink-300 font-extrabold tracking-wide">
                Water Plant 💧
              </span>
              <span className="font-hand text-[9px] text-ink-soft">
                {stage === 2 ? 'Fully bloomed with love' : `Click to water (${watersInStage0}/3)`}
              </span>
            </span>
          </button>
        </div>

        {/* --- Replant seed option when fully bloomed --- */}
        {stage === 2 && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-pink-300/80 bg-white/90 hover:bg-rose px-2 py-0.5 text-[8px] font-mono font-bold text-cocoa hover:text-white shadow-2xs backdrop-blur-xs transition-colors dark:bg-black/60 dark:text-pink-300"
            >
              [ replant seed ]
            </button>
          </div>
        )}

        {/* --- 2. WATERING CAN SPRINKLER ANIMATION --- */}
        <AnimatePresence>
          {isWatering && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20, rotate: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                x: 6,
                y: -12,
                rotate: -24,
                scale: 0.95,
              }}
              exit={{ opacity: 0, x: 18, y: -16, rotate: 0, scale: 0.8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="pointer-events-none absolute -top-4 -right-10 z-30 w-12 sm:w-14"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}
            >
              <Image
                src="/assets/objects/studio-watering-can.webp"
                alt="Pastel watering can"
                width={100}
                height={100}
                className="h-auto w-full object-contain"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 3. ANIMATED WATER DROPLETS --- */}
        <AnimatePresence>
          {isWatering && droplets.length > 0 && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              {droplets.map((drop) => (
                <motion.span
                  key={drop.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                    x: drop.x,
                    scale: 0.6,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [10, 36],
                    scale: [0.6, 1, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.55,
                    delay: drop.delay,
                    ease: 'easeIn',
                  }}
                  className="absolute block h-1.5 w-1 rounded-full bg-sky-400 shadow-xs"
                  style={{
                    boxShadow: '0 0 4px rgba(56, 189, 248, 0.7)',
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* --- 4. SPARKLES / CELEBRATION BURST --- */}
        <AnimatePresence>
          {showSparkles && (
            <div className="pointer-events-none absolute top-[35%] inset-x-0 z-25 flex items-center justify-center">
              {[-16, -6, 8, 18].map((offset, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -18 - (idx % 2) * 8,
                    x: offset,
                    scale: [0, 1.2, 0.5],
                  }}
                  transition={{ duration: 0.8, delay: idx * 0.08 }}
                  className="absolute h-2 w-2 rounded-full bg-butter shadow-xs"
                  style={{
                    boxShadow: '0 0 6px rgba(255, 226, 154, 0.9)',
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* --- 5. PLANT POT & GROWING FOLIAGE CONTAINER --- */}
        <motion.div
          animate={
            isWatering
              ? {
                  scale: [1, 1.06, 0.98, 1],
                  rotate: [0, -1.2, 1.2, 0],
                }
              : {
                  scale: 1,
                  rotate: 0,
                }
          }
          style={{ transformOrigin: 'bottom center' }}
          transition={{ duration: 0.45 }}
          className="relative h-full w-full flex items-end justify-center filter drop-shadow-sm transition-transform duration-200 hover:scale-105"
        >
          {/* Cross-fading Plant Asset Image (1400x1400 unified baseline canvas) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="relative h-full w-full flex items-end justify-center"
            >
              <Image
                src={getPlantAsset()}
                alt={`Studio desk plant at stage ${stage + 1}`}
                width={350}
                height={350}
                className="h-full w-full object-contain object-bottom"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
