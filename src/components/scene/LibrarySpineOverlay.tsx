'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CozyIcon from '@/components/ui/CozyIcon';
import { soundscape } from '@/lib/soundEngine';

interface BookSpine {
  name: string;
  x: number; // percentage center X
  width: number; // percentage width
}

interface ShelfCategory {
  id: string;
  name: string;
  iconName: string;
  emoji: string;
  x: number; // plaque left %
  y: number; // plaque top %
  topY: number; // spine top %
  spineHeight: number; // spine height %
  books: BookSpine[];
}

export const SHELF_CATEGORIES: ShelfCategory[] = [
  {
    id: 'shelf-frontend',
    name: 'Frontend & UI',
    iconName: 'skill-frontend',
    emoji: '🎀',
    x: 8.5,
    y: 19.5,
    topY: 16.5,
    spineHeight: 12.0,
    books: [
      { name: 'TypeScript', x: 27.05, width: 2.2 },
      { name: 'JavaScript', x: 29.04, width: 2.2 },
      { name: 'Next.js', x: 31.12, width: 2.2 },
      { name: 'React.js', x: 33.94, width: 2.8 },
      { name: 'React Native', x: 37.39, width: 3.0 },
      { name: 'Tailwind CSS', x: 40.95, width: 3.2 },
      { name: 'Framer Motion', x: 46.73, width: 3.0 },
      { name: 'Polaris', x: 51.35, width: 2.2 },
    ],
  },
  {
    id: 'shelf-backend',
    name: 'Backend & APIs',
    iconName: 'skill-backend',
    emoji: '🧁',
    x: 6.5,
    y: 35.5,
    topY: 32.0,
    spineHeight: 12.0,
    books: [
      { name: 'FastAPI', x: 21.24, width: 2.2 },
      { name: 'Node.js', x: 25.13, width: 2.6 },
      { name: 'Express.js', x: 29.29, width: 2.2 },
      { name: 'Celery', x: 33.87, width: 2.6 },
      { name: 'Redis', x: 36.65, width: 2.4 },
      { name: 'PostgreSQL', x: 39.55, width: 2.8 },
      { name: 'Prisma', x: 42.86, width: 3.2 },
      { name: 'MongoDB', x: 51.45, width: 2.6 },
      { name: 'Supabase', x: 55.88, width: 2.2 },
    ],
  },
  {
    id: 'shelf-ai',
    name: 'AI & Data',
    iconName: 'skill-ai',
    emoji: '🪄',
    x: 8.5,
    y: 51.5,
    topY: 47.5,
    spineHeight: 12.0,
    books: [
      { name: 'Gemini API', x: 31.18, width: 2.2 },
      { name: 'RAG', x: 34.88, width: 2.2 },
      { name: 'Vector Embeddings', x: 41.93, width: 3.0 },
      { name: 'ChromaDB', x: 43.86, width: 2.2 },
      { name: 'Vercel AI SDK', x: 47.47, width: 2.4 },
      { name: 'ETL Pipelines', x: 49.49, width: 2.2 },
    ],
  },
  {
    id: 'shelf-tools',
    name: 'Tools & DevOps',
    iconName: 'skill-tools',
    emoji: '🧰',
    x: 8.5,
    y: 66.5,
    topY: 63.0,
    spineHeight: 12.0,
    books: [
      { name: 'Docker', x: 30.85, width: 2.2 },
      { name: 'Git & GitHub', x: 34.41, width: 2.2 },
      { name: 'GitHub Actions', x: 39.64, width: 2.6 },
      { name: 'Google Cloud Run', x: 41.88, width: 2.8 },
      { name: 'Vercel', x: 43.99, width: 2.2 },
      { name: 'Postman', x: 49.71, width: 2.2 },
    ],
  },
];

export default function LibrarySpineOverlay() {
  const [hoveredSkill, setHoveredSkill] = useState<{
    name: string;
    category: string;
    x: number;
    y: number;
  } | null>(null);

  const handleBookClick = (categoryId: string) => {
    soundscape.playSparkleSound();
    const target = document.getElementById(categoryId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">
      {SHELF_CATEGORIES.map((cat) => (
        <div key={cat.id}>
          {/* Category Wooden Plaque on the left shelf plank with ample margin */}
          <a
            href={`#${cat.id}`}
            title={`Go to ${cat.name} shelf`}
            className="pointer-events-auto absolute flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-[#5A341B]/85 hover:bg-[#6D4023] border border-[#7E4C29]/75 shadow-[0_2px_5px_rgba(0,0,0,0.35)] backdrop-blur-[1px] transition-all hover:scale-105 active:scale-95 group"
            style={{
              left: `${cat.x}%`,
              top: `${cat.y}%`,
            }}
          >
            <CozyIcon
              name={cat.iconName}
              fallback={cat.emoji}
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
              {cat.name}
            </span>
          </a>

          {/* Technology Titles neatly on each book spine */}
          {cat.books.map((book) => (
            <div
              key={book.name}
              style={{
                left: `${book.x}%`,
                top: `${cat.topY}%`,
                width: `${book.width}%`,
                height: `${cat.spineHeight}%`,
              }}
              className="pointer-events-auto absolute -translate-x-1/2 flex items-center justify-center cursor-pointer group rounded-xs transition-colors hover:bg-white/20 active:scale-95"
              onMouseEnter={() =>
                setHoveredSkill({
                  name: book.name,
                  category: cat.name,
                  x: book.x,
                  y: cat.topY - 1,
                })
              }
              onMouseLeave={() => setHoveredSkill(null)}
              onClick={() => handleBookClick(cat.id)}
            >
              {/* Vertical Title printed neatly on the spine */}
              <span
                className="[writing-mode:vertical-rl] rotate-180 font-hand text-[7.5px] sm:text-[8.5px] md:text-[9.5px] lg:text-[10.5px] font-bold tracking-wide leading-none text-[#2D1A10] dark:text-[#FFF5EA] transition-all group-hover:scale-105 group-hover:text-black dark:group-hover:text-white whitespace-nowrap"
                style={{
                  textShadow:
                    '0 0.5px 1.5px rgba(255, 255, 255, 0.9), 0 1px 2px rgba(0, 0, 0, 0.25)',
                }}
              >
                {book.name}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* Floating Scrapbook Tooltip on hover */}
      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 3, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              left: `${hoveredSkill.x}%`,
              top: `${hoveredSkill.y}%`,
            }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full z-40 rounded-full border border-pink-300 bg-[#FFF5F8]/95 px-3 py-1 shadow-[0_4px_12px_rgba(214,70,118,0.25)] backdrop-blur-md flex items-center gap-1.5"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF4D88] animate-pulse" />
            <span className="font-hand text-xs sm:text-sm font-bold text-ink whitespace-nowrap">
              {hoveredSkill.name}
            </span>
            <span className="font-mono text-[9px] text-[#D81B60] font-medium hidden sm:inline">
              · {hoveredSkill.category}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
