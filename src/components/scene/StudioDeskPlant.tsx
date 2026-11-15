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
        {/* --- 1. SPEECH / TOOLTIP BUBBLE --- */}
        <AnimatePresence>
          {(isHovered || isWatering) && mounted && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-30 whitespace-nowrap ${
                stage === 0 ? '-top-9 sm:-top-10' : '-top-10 sm:-top-12'
              }`}
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
                src="/assets/objects/studio-watering-can.png"
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
