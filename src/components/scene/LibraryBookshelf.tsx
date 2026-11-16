'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import CozyIcon from '@/components/ui/CozyIcon';
import { soundscape } from '@/lib/soundEngine';
import { shelves } from '@/data/skills';

// 7 distinct book spine assets uploaded by user
const BOOK_ASSETS = [
  '/assets/objects/book-pink.png',
  '/assets/objects/book-yellow1.png',
  '/assets/objects/book-green.png',
  '/assets/objects/book-lilac.png',
  '/assets/objects/book-yellow2.png',
  '/assets/objects/book-magenta.png',
  '/assets/objects/book-yellow3.png',
];

interface ShelfRowConfig {
  id: string;
  name: string;
  iconName: string;
  emoji: string;
  plaqueY: number; // percentage top for category plate
  floorY: number;  // percentage top where shelf floor sits (books stand on this)
  startX: number;  // percentage left where books start
  stepX: number;   // horizontal step per book
  bookWidth: number; // width % for each book
  baseHeight: number; // base height % of each book
  heightOffsets: number[]; // organic height variation per book
}

const SHELF_ROWS: ShelfRowConfig[] = [
  {
    id: 'shelf-frontend',
    name: 'Frontend & UI',
    iconName: 'skill-frontend',
    emoji: '🎀',
    plaqueY: 18.0,
    floorY: 31.8,
    startX: 31.8,
    stepX: 3.7,
    bookWidth: 3.0,
    baseHeight: 12.0,
    heightOffsets: [0, 0.8, -0.4, 0.9, -0.3, 0.6, 1.1, 0.2],
  },
  {
    id: 'shelf-backend',
    name: 'Backend & APIs',
    iconName: 'skill-backend',
    emoji: '🧁',
    plaqueY: 34.5,
    floorY: 44.8,
    startX: 30.8,
    stepX: 3.4,
    bookWidth: 2.8,
    baseHeight: 10.4,
    heightOffsets: [-0.3, 0.5, -0.5, 0.8, 0.1, -0.2, 0.6, 0.9, 0.3],
  },
  {
    id: 'shelf-ai',
    name: 'AI & Data',
    iconName: 'skill-ai',
    emoji: '🪄',
    plaqueY: 46.5,
    floorY: 56.2,
    startX: 33.5,
    stepX: 4.1,
    bookWidth: 3.3,
    baseHeight: 10.4,
    heightOffsets: [0.2, 0.8, -0.4, 0.6, -0.2, 0.7],
  },
  {
    id: 'shelf-tools',
    name: 'Tools & DevOps',
    iconName: 'skill-tools',
    emoji: '🧰',
    plaqueY: 58.5,
    floorY: 68.2,
    startX: 33.5,
    stepX: 4.1,
    bookWidth: 3.3,
    baseHeight: 10.4,
    heightOffsets: [0.5, -0.4, 0.8, 0.1, 0.6, -0.3],
  },
];

export default function LibraryBookshelf() {
  const [activeSkill, setActiveSkill] = useState<{
    name: string;
    category: string;
    x: number;
    y: number;
  } | null>(null);

  const [tappedSkill, setTappedSkill] = useState<string | null>(null);

  const handleBookClick = (skillName: string, categoryId: string) => {
    soundscape.playSparkleSound();
    setTappedSkill(skillName);
    setTimeout(() => setTappedSkill(null), 800);

    // Smooth scroll down to that shelf in the skills section
    const target = document.getElementById(categoryId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">
      {SHELF_ROWS.map((rowConfig, rowIndex) => {
        const shelfData = shelves.find((s) => s.name === rowConfig.name);
        const books = shelfData?.books || [];

        return (
          <div key={rowConfig.id}>
            {/* 1. Category Wooden Plaque on the left cubby */}
            <a
              href={`#${rowConfig.id}`}
              title={`Jump to ${rowConfig.name} shelf`}
              className="pointer-events-auto absolute flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-[#55331E]/85 hover:bg-[#683F26] border border-[#7D4F31]/80 shadow-[0_3px_6px_rgba(0,0,0,0.45)] backdrop-blur-[1px] transition-all hover:scale-105 active:scale-95 group"
              style={{
                left: '18.0%',
                top: `${rowConfig.plaqueY}%`,
              }}
            >
              <CozyIcon
                name={rowConfig.iconName}
                fallback={rowConfig.emoji}
                size={18}
                className="shrink-0 drop-shadow-xs group-hover:rotate-6 transition-transform"
              />
              <span
                className="font-hand text-xs sm:text-sm md:text-base font-bold text-[#FFF5E6] whitespace-nowrap tracking-wide"
                style={{
                  textShadow:
                    '0 1px 2px rgba(0, 0, 0, 0.95), 0 0 8px rgba(255, 210, 160, 0.45)',
                }}
              >
                {rowConfig.name}
              </span>
            </a>

            {/* 2. Standalone Books on the shelf row */}
            {books.map((skill, bookIndex) => {
              const assetIndex = (rowIndex * 3 + bookIndex) % BOOK_ASSETS.length;
              const bookAsset = BOOK_ASSETS[assetIndex];
              const leftPercent = rowConfig.startX + bookIndex * rowConfig.stepX;
              const heightOffset = rowConfig.heightOffsets[bookIndex % rowConfig.heightOffsets.length] || 0;
              const heightPercent = rowConfig.baseHeight + heightOffset;
              const bottomPercent = 100 - rowConfig.floorY;
              const isTapped = tappedSkill === skill;

              return (
                <div
                  key={skill}
                  style={{
                    left: `${leftPercent}%`,
                    bottom: `${bottomPercent}%`,
                    width: `${rowConfig.bookWidth}%`,
                    height: `${heightPercent}%`,
                  }}
                  className="pointer-events-auto absolute group cursor-pointer"
                  onMouseEnter={() =>
                    setActiveSkill({
                      name: skill,
                      category: rowConfig.name,
                      x: leftPercent + rowConfig.bookWidth / 2,
                      y: rowConfig.floorY - heightPercent - 1,
                    })
                  }
                  onMouseLeave={() => setActiveSkill(null)}
                  onClick={() => handleBookClick(skill, rowConfig.id)}
                >
                  {/* Book Spine Graphic */}
                  <motion.div
                    animate={
                      isTapped
                        ? { y: [-6, 0, -3, 0], rotate: [-2, 2, -1, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-105 active:scale-95"
                  >
                    <Image
                      src={bookAsset}
                      alt={skill}
                      fill
                      sizes="60px"
                      className="object-contain object-bottom drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                    />

                    {/* Subtle Spine Title indicator */}
                    <div className="absolute inset-y-2 inset-x-0 flex items-center justify-center overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="[writing-mode:vertical-rl] rotate-180 font-mono text-[7.5px] sm:text-[8.5px] font-bold text-[#3B2213] tracking-tight bg-white/75 px-0.5 rounded-xs line-clamp-1 shadow-2xs">
                        {skill}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Floating Tooltip displaying current hovered book */}
      <AnimatePresence>
        {activeSkill && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              left: `${activeSkill.x}%`,
              top: `${activeSkill.y}%`,
            }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full z-40 rounded-full border border-pink-300 bg-[#FFF5F8]/95 px-3 py-1 shadow-[0_4px_12px_rgba(214,70,118,0.25)] backdrop-blur-md flex items-center gap-1.5"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF4D88] animate-pulse" />
            <span className="font-hand text-xs sm:text-sm font-bold text-ink whitespace-nowrap">
              {activeSkill.name}
            </span>
            <span className="font-mono text-[9px] text-[#D81B60] font-medium hidden sm:inline">
              · {activeSkill.category}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
