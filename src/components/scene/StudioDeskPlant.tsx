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

    // Spawn 5 sequential falling droplets
    const newDroplets: Droplet[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: -10 + i * 5, // spread across pot
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
        // Stage 2: fully bloomed, just a refreshing sprinkle with sparkles
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
        return '/assets/objects/studio-plant-tiny.png';
      case 1:
        return '/assets/objects/studio-plant-growing.png';
      case 2:
      default:
        return '/assets/objects/studio-plant-full.png';
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
        left: '67.2%',
        top: '44.8%',
        width: '6.4%',
        aspectRatio: '1 / 1.3',
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
        {/* --- 1. SPEECH / TOOLTIP BUBBLE --- */}
        <AnimatePresence>
          {(isHovered || isWatering) && mounted && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap"
            >
              <div className="relative rounded-full border border-pink-300 bg-white/95 px-2.5 py-1 text-[10px] sm:text-xs font-mono font-bold text-accent shadow-md backdrop-blur-xs dark:border-pink-500/50 dark:bg-[#2A1828]/95 dark:text-pink-200">
                <span>{getBubbleText()}</span>
                {/* Speech Bubble Downward Triangle Arrow */}
                <span
                  aria-hidden
                  className="absolute left-1/2 -bottom-1 -translate-x-1/2 h-2 w-2 rotate-45 border-r border-b border-pink-300 bg-white dark:border-pink-500/50 dark:bg-[#2A1828]"
                />
              </div>

              {/* Reset option when fully bloomed */}
              {stage === 2 && (
                <div className="pointer-events-auto mt-1 flex justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded bg-pink-100/90 hover:bg-rose px-1.5 py-0.5 text-[8px] font-mono font-bold text-cocoa hover:text-white dark:bg-black/50 dark:text-pink-300"
                  >
                    [ replant seed ]
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 2. WATERING CAN SPRINKLER ANIMATION --- */}
        <AnimatePresence>
          {isWatering && (
            <motion.div
              initial={{ opacity: 0, x: 25, y: -25, rotate: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                x: 8,
                y: -32,
                rotate: -24,
                scale: 1,
              }}
              exit={{ opacity: 0, x: 20, y: -20, rotate: 0, scale: 0.8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="pointer-events-none absolute -top-10 left-3 z-30 w-12 sm:w-16 md:w-20"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}
            >
              <Image
                src="/assets/objects/studio-watering-can.png"
                alt="Pastel watering can"
                width={120}
                height={120}
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
                  initial={{ opacity: 0, y: -28, x: drop.x, scale: 0.6 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [-28, 5],
                    scale: [0.6, 1, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.55,
                    delay: drop.delay,
                    ease: 'easeIn',
                  }}
                  className="absolute block h-2 w-1 rounded-full bg-sky-400 shadow-xs"
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
            <div className="pointer-events-none absolute -top-8 inset-x-0 z-25 flex items-center justify-center">
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
                  scale: [1, 1.08, 0.98, 1],
                  rotate: [0, -1.5, 1.5, 0],
                }
              : {
                  scale: 1,
                  rotate: 0,
                }
          }
          transition={{ duration: 0.45 }}
          className="relative h-full w-full flex items-end justify-center filter drop-shadow-sm transition-transform duration-200 hover:scale-105"
        >
          {/* Cross-fading Plant Asset Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative h-full w-full flex items-end justify-center"
            >
              <Image
                src={getPlantAsset()}
                alt={`Studio desk plant at stage ${stage + 1}`}
                width={200}
                height={260}
                className="h-full w-full object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
