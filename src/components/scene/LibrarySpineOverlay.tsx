'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CozyIcon from '@/components/ui/CozyIcon';
import { soundscape } from '@/lib/soundEngine';

interface BookSpine {
  name: string;
  x: number; // percentage center X
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
  spineWidth: number; // spine width %
  books: BookSpine[];
}

export const SHELF_CATEGORIES: ShelfCategory[] = [
  {
    id: 'shelf-frontend',
    name: 'Frontend & UI',
    iconName: 'skill-frontend',
    emoji: '🎀',
    x: 14.2,
    y: 20.0,
    topY: 16.5,
    spineHeight: 11.5,
    spineWidth: 3.5,
    books: [
      { name: 'TypeScript', x: 26.56 },
      { name: 'JavaScript', x: 30.09 },
      { name: 'Next.js', x: 33.61 },
      { name: 'React.js', x: 37.14 },
      { name: 'React Native', x: 40.66 },
      { name: 'Tailwind CSS', x: 44.19 },
      { name: 'Framer Motion', x: 47.71 },
      { name: 'Polaris', x: 51.24 },
    ],
  },
  {
    id: 'shelf-backend',
    name: 'Backend & APIs',
    iconName: 'skill-backend',
    emoji: '🧁',
    x: 13.0,
    y: 35.5,
    topY: 32.0,
    spineHeight: 11.5,
    spineWidth: 4.4,
    books: [
      { name: 'FastAPI', x: 22.44 },
      { name: 'Node.js', x: 26.92 },
      { name: 'Express.js', x: 31.39 },
      { name: 'Celery', x: 35.87 },
      { name: 'Redis', x: 40.35 },
      { name: 'PostgreSQL', x: 44.83 },
      { name: 'Prisma', x: 49.31 },
      { name: 'MongoDB', x: 53.78 },
      { name: 'Supabase', x: 58.26 },
    ],
  },
  {
    id: 'shelf-ai',
    name: 'AI & Data',
    iconName: 'skill-ai',
    emoji: '🪄',
    x: 16.0,
    y: 51.5,
    topY: 47.5,
    spineHeight: 11.0,
    spineWidth: 3.8,
    books: [
      { name: 'Gemini API', x: 30.73 },
      { name: 'RAG', x: 34.60 },
      { name: 'Vector Embeddings', x: 38.47 },
      { name: 'ChromaDB', x: 42.33 },
      { name: 'Vercel AI SDK', x: 46.20 },
      { name: 'ETL Pipelines', x: 50.07 },
    ],
  },
  {
    id: 'shelf-tools',
    name: 'Tools & DevOps',
    iconName: 'skill-tools',
    emoji: '🧰',
    x: 16.0,
    y: 66.5,
    topY: 63.0,
    spineHeight: 11.0,
    spineWidth: 4.0,
    books: [
      { name: 'Docker', x: 30.82 },
      { name: 'Git & GitHub', x: 34.85 },
      { name: 'GitHub Actions', x: 38.88 },
      { name: 'Google Cloud Run', x: 42.92 },
      { name: 'Vercel', x: 46.95 },
      { name: 'Postman', x: 50.98 },
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
          {/* Category Wooden Plaque on the left shelf plank */}
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
                width: `${cat.spineWidth}%`,
                height: `${cat.spineHeight}%`,
              }}
              className="pointer-events-auto absolute -translate-x-1/2 flex items-center justify-center cursor-pointer group rounded-xs transition-colors hover:bg-white/15"
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
              {/* Vertical Title printed on the spine */}
              <span
                className="[writing-mode:vertical-rl] rotate-180 font-hand text-[8.5px] sm:text-[9.5px] md:text-[10.5px] lg:text-[11.5px] font-bold tracking-wide leading-none text-[#2D1A10] dark:text-[#FFF5EA] transition-all group-hover:scale-105 group-hover:text-black dark:group-hover:text-white line-clamp-1"
                style={{
                  textShadow:
                    '0 0.5px 1.5px rgba(255, 255, 255, 0.85), 0 1px 2px rgba(0, 0, 0, 0.25)',
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
