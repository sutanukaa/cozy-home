'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CozyIcon from '@/components/ui/CozyIcon';
import { soundscape } from '@/lib/soundEngine';

export type BookColor = 'rose' | 'sage' | 'ochre' | 'plum' | 'slate' | 'parchment' | 'terracotta';
export type BookOrnament = 'star' | 'diamond' | 'dots' | 'lines';

export interface BookDef {
  name: string;
  color: BookColor;
  width: number; // percentage width in 16:9 stage
  height: number; // percentage height in 16:9 stage
  tilt?: number; // degrees of tilt, e.g. -0.8 or 1.2
  hasRibbon?: boolean;
  ornament?: BookOrnament;
}

interface ShelfCategoryDef {
  id: string;
  name: string;
  iconName: string;
  emoji: string;
  plaqueX: number; // % from left of stage
  plaqueY: number; // % from top of stage
  floorY: number; // % from top where shelf floor plank sits
  startX: number; // % from left where first book begins
  books: BookDef[];
}

// Muted, dusty gouache watercolor palettes matching the cozy room background
const PALETTES: Record<
  BookColor,
  {
    coverLight: string;
    coverMid: string;
    coverDark: string;
    textColor: string;
    goldColor: string;
    ribbonColor: string;
  }
> = {
  rose: {
    coverLight: '#B8727D',
    coverMid: '#9B5863',
    coverDark: '#7A3D47',
    textColor: '#FFF0F2',
    goldColor: '#E5C170',
    ribbonColor: '#C97A86',
  },
  sage: {
    coverLight: '#7C9882',
    coverMid: '#627E68',
    coverDark: '#49624E',
    textColor: '#F2F8F3',
    goldColor: '#E5C170',
    ribbonColor: '#82A388',
  },
  ochre: {
    coverLight: '#D1A95E',
    coverMid: '#B88F44',
    coverDark: '#936E2A',
    textColor: '#FFFDF5',
    goldColor: '#F5DC94',
    ribbonColor: '#C99E4A',
  },
  plum: {
    coverLight: '#8A677B',
    coverMid: '#704E61',
    coverDark: '#563647',
    textColor: '#FAF2F7',
    goldColor: '#E5C170',
    ribbonColor: '#9A748A',
  },
  slate: {
    coverLight: '#6A879E',
    coverMid: '#526E84',
    coverDark: '#3A5266',
    textColor: '#F0F6FA',
    goldColor: '#E5C170',
    ribbonColor: '#7594AB',
  },
  parchment: {
    coverLight: '#DFD4C2',
    coverMid: '#C8BAA3',
    coverDark: '#A89981',
    textColor: '#382A1B',
    goldColor: '#B88E36',
    ribbonColor: '#B0A087',
  },
  terracotta: {
    coverLight: '#BD7660',
    coverMid: '#A25C47',
    coverDark: '#81412E',
    textColor: '#FFF5F2',
    goldColor: '#E5C170',
    ribbonColor: '#CB826B',
  },
};

const SHELF_CATEGORIES: ShelfCategoryDef[] = [
  {
    id: 'shelf-frontend',
    name: 'Frontend & UI',
    iconName: 'skill-frontend',
    emoji: '🎀',
    plaqueX: 18.0,
    plaqueY: 29.5,
    floorY: 40.0,
    startX: 32.2,
    books: [
      { name: 'TypeScript', color: 'ochre', width: 3.3, height: 11.8, tilt: -0.8, hasRibbon: true, ornament: 'star' },
      { name: 'JavaScript', color: 'ochre', width: 3.0, height: 11.2, ornament: 'lines' },
      { name: 'Next.js', color: 'parchment', width: 3.4, height: 12.2, hasRibbon: true, ornament: 'diamond' },
      { name: 'React.js', color: 'slate', width: 3.4, height: 11.6, ornament: 'star' },
      { name: 'React Native', color: 'plum', width: 3.3, height: 11.4, ornament: 'lines' },
      { name: 'Tailwind CSS', color: 'slate', width: 3.5, height: 12.0, ornament: 'dots' },
      { name: 'Framer Motion', color: 'rose', width: 3.5, height: 12.1, hasRibbon: true, ornament: 'star' },
      { name: 'Polaris', color: 'sage', width: 3.1, height: 11.0, tilt: 1.2, ornament: 'lines' },
    ],
  },
  {
    id: 'shelf-backend',
    name: 'Backend & APIs',
    iconName: 'skill-backend',
    emoji: '🧁',
    plaqueX: 18.0,
    plaqueY: 46.0,
    floorY: 53.0,
    startX: 32.2,
    books: [
      { name: 'FastAPI', color: 'sage', width: 3.1, height: 9.8, ornament: 'diamond' },
      { name: 'Node.js', color: 'sage', width: 2.9, height: 9.4, ornament: 'lines' },
      { name: 'Express.js', color: 'parchment', width: 3.1, height: 9.9, hasRibbon: true, ornament: 'star' },
      { name: 'Celery', color: 'slate', width: 2.8, height: 9.2, ornament: 'lines' },
      { name: 'Redis', color: 'rose', width: 3.1, height: 10.0, ornament: 'dots' },
      { name: 'PostgreSQL', color: 'slate', width: 3.4, height: 10.2, ornament: 'diamond' },
      { name: 'Prisma', color: 'plum', width: 3.0, height: 9.5, ornament: 'lines' },
      { name: 'MongoDB', color: 'sage', width: 3.2, height: 9.9, hasRibbon: true, ornament: 'star' },
      { name: 'Supabase', color: 'sage', width: 3.1, height: 10.0, tilt: 1.2, ornament: 'star' },
    ],
  },
  {
    id: 'shelf-ai',
    name: 'AI & Data',
    iconName: 'skill-ai',
    emoji: '🪄',
    plaqueX: 18.0,
    plaqueY: 59.0,
    floorY: 65.5,
    startX: 32.2,
    books: [
      { name: 'Gemini API', color: 'slate', width: 3.7, height: 9.4, tilt: -0.8, ornament: 'star' },
      { name: 'RAG', color: 'plum', width: 3.4, height: 9.0, ornament: 'lines' },
      { name: 'Vector Embeddings', color: 'rose', width: 4.1, height: 9.6, hasRibbon: true, ornament: 'diamond' },
      { name: 'ChromaDB', color: 'ochre', width: 3.5, height: 9.2, ornament: 'dots' },
      { name: 'Vercel AI SDK', color: 'parchment', width: 3.9, height: 9.5, ornament: 'lines' },
      { name: 'ETL Pipelines', color: 'sage', width: 3.6, height: 9.1, tilt: 1.2, ornament: 'star' },
    ],
  },
  {
    id: 'shelf-tools',
    name: 'Tools & DevOps',
    iconName: 'skill-tools',
    emoji: '🧰',
    plaqueX: 18.0,
    plaqueY: 72.0,
    floorY: 78.5,
    startX: 32.2,
    books: [
      { name: 'Docker', color: 'slate', width: 3.7, height: 10.0, tilt: -1.0, ornament: 'diamond' },
      { name: 'Git & GitHub', color: 'terracotta', width: 3.8, height: 10.2, hasRibbon: true, ornament: 'star' },
      { name: 'GitHub Actions', color: 'ochre', width: 3.9, height: 9.7, ornament: 'lines' },
      { name: 'Google Cloud Run', color: 'slate', width: 4.1, height: 10.3, ornament: 'dots' },
      { name: 'Vercel', color: 'parchment', width: 3.5, height: 9.8, ornament: 'lines' },
      { name: 'Postman', color: 'rose', width: 3.5, height: 9.6, tilt: 1.5, ornament: 'star' },
    ],
  },
];

export default function LibraryVectorBookshelf() {
  const [hoveredSkill, setHoveredSkill] = useState<{
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

    const target = document.getElementById(categoryId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">
      {SHELF_CATEGORIES.map((cat, catIdx) => {
        let currentX = cat.startX;

        return (
          <div key={cat.id}>
            {/* 1. Wooden Category Plaque in Left Shelf Cubby */}
            <a
              href={`#${cat.id}`}
              title={`Jump to ${cat.name} shelf section`}
              className="pointer-events-auto absolute flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#4A2A1A]/95 hover:bg-[#5C3420] border border-[#754329] shadow-[0_2px_6px_rgba(20,10,15,0.5)] backdrop-blur-[1px] transition-all hover:scale-105 active:scale-95 group"
              style={{
                left: `${cat.plaqueX}%`,
                top: `${cat.plaqueY}%`,
              }}
            >
              <CozyIcon
                name={cat.iconName}
                fallback={cat.emoji}
                size={16}
                className="shrink-0 drop-shadow-xs group-hover:rotate-6 transition-transform"
              />
              <span
                className="font-hand text-xs sm:text-sm font-bold text-[#FFF5E6] whitespace-nowrap tracking-wide"
                style={{
                  textShadow:
                    '0 1px 2px rgba(0, 0, 0, 0.95), 0 0 6px rgba(255, 215, 170, 0.4)',
                }}
              >
                {cat.name}
              </span>
            </a>

            {/* 2. Realistic Handcrafted Vector Books Sitting Flush on Shelf Plank */}
            {cat.books.map((book, bookIdx) => {
              const bookLeft = currentX;
              currentX += book.width;
              const palette = PALETTES[book.color];
              const bottomPercent = 100 - cat.floorY;
              const isTapped = tappedSkill === book.name;
              const gradId = `spine-grad-${catIdx}-${bookIdx}`;
              const goldId = `gold-grad-${catIdx}-${bookIdx}`;

              const isLightText =
                palette.textColor.startsWith('#F') || palette.textColor.startsWith('#f');

              return (
                <div
                  key={book.name}
                  style={{
                    left: `${bookLeft}%`,
                    bottom: `${bottomPercent}%`,
                    width: `${book.width}%`,
                    height: `${book.height}%`,
                    transformOrigin: 'bottom center',
                  }}
                  className="pointer-events-auto absolute group cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredSkill({
                      name: book.name,
                      category: cat.name,
                      x: bookLeft + book.width / 2,
                      y: cat.floorY - book.height - 0.5,
                    })
                  }
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => handleBookClick(book.name, cat.id)}
                >
                  <motion.div
                    animate={
                      isTapped
                        ? { y: [-6, 0, -3, 0] }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                    style={{
                      transform: book.tilt ? `rotate(${book.tilt}deg)` : undefined,
                    }}
                    className="relative w-full h-full transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-[1.04]"
                  >
                    {/* SVG 3D Book Spine Background */}
                    <svg
                      viewBox="0 0 100 300"
                      preserveAspectRatio="none"
                      className="w-full h-full drop-shadow-[0_2px_4px_rgba(20,10,15,0.4)]"
                    >
                      <defs>
                        {/* 3D Cylindrical Spine Gradient */}
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={palette.coverDark} />
                          <stop offset="14%" stopColor={palette.coverMid} />
                          <stop offset="34%" stopColor={palette.coverLight} />
                          <stop offset="68%" stopColor={palette.coverMid} />
                          <stop offset="90%" stopColor={palette.coverMid} />
                          <stop offset="100%" stopColor={palette.coverDark} />
                        </linearGradient>

                        {/* Antique Gold Foil Gradient */}
                        <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#A67B24" />
                          <stop offset="35%" stopColor={palette.goldColor} />
                          <stop offset="70%" stopColor="#FFF3B0" />
                          <stop offset="100%" stopColor="#8A6315" />
                        </linearGradient>
                      </defs>

                      {/* Headband Cloth Top */}
                      <path
                        d="M 6,10 Q 50,4 94,10 L 94,18 Q 50,12 6,18 Z"
                        fill="#E8DEC9"
                        stroke="#B8A88E"
                        strokeWidth="1.2"
                      />

                      {/* Main Arched 3D Hardcover Spine */}
                      <path
                        d="M 4,12 Q 50,6 96,12 L 96,294 Q 50,299 4,294 Z"
                        fill={`url(#${gradId})`}
                        stroke={palette.coverDark}
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />

                      {/* Left Hinge Crease Groove (Physical Book Depth) */}
                      <line x1="10" y1="12" x2="10" y2="294" stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" />
                      <line x1="12.5" y1="12" x2="12.5" y2="294" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />

                      {/* Top Raised Gold Ribs */}
                      <rect x="6" y="24" width="88" height="3" rx="1" fill={`url(#${goldId})`} />
                      <rect x="6" y="32" width="88" height="2" rx="0.5" fill={`url(#${goldId})`} />

                      {/* Bottom Raised Gold Ribs */}
                      <rect x="6" y="268" width="88" height="2" rx="0.5" fill={`url(#${goldId})`} />
                      <rect x="6" y="273" width="88" height="3" rx="1" fill={`url(#${goldId})`} />

                      {/* Gold Spine Ornaments */}
                      {book.ornament === 'star' ? (
                        <>
                          <polygon points="50,46 54,51 50,56 46,51" fill={`url(#${goldId})`} />
                          <polygon points="50,250 54,255 50,260 46,255" fill={`url(#${goldId})`} />
                        </>
                      ) : book.ornament === 'diamond' ? (
                        <>
                          <rect x="46" y="47" width="8" height="8" transform="rotate(45, 50, 51)" fill={`url(#${goldId})`} />
                          <rect x="46" y="251" width="8" height="8" transform="rotate(45, 50, 255)" fill={`url(#${goldId})`} />
                        </>
                      ) : book.ornament === 'dots' ? (
                        <>
                          <circle cx="50" cy="51" r="3" fill={`url(#${goldId})`} />
                          <circle cx="50" cy="255" r="3" fill={`url(#${goldId})`} />
                        </>
                      ) : (
                        <>
                          <line x1="30" y1="51" x2="70" y2="51" stroke={`url(#${goldId})`} strokeWidth="2" />
                          <line x1="30" y1="255" x2="70" y2="255" stroke={`url(#${goldId})`} strokeWidth="2" />
                        </>
                      )}

                      {/* Hanging Silk Bookmark Ribbon */}
                      {book.hasRibbon && (
                        <path
                          d="M 44,292 L 44,324 L 50,318 L 56,324 L 56,292 Z"
                          fill={palette.ribbonColor}
                          stroke="rgba(0,0,0,0.25)"
                          strokeWidth="1"
                        />
                      )}
                    </svg>

                    {/* Debossed Spine Typography: Native HTML Flexbox with writing-mode */}
                    <div className="absolute inset-x-0.5 inset-y-1 flex items-center justify-center pointer-events-none select-none">
                      <span
                        className="font-hand text-[8px] sm:text-[9.5px] md:text-[10.5px] lg:text-[11.5px] font-bold tracking-wide leading-none text-center select-none"
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                          whiteSpace: 'nowrap',
                          color: palette.textColor,
                          textShadow: isLightText
                            ? '0 0.5px 1px rgba(0,0,0,0.8), 0 0.5px 2px rgba(0,0,0,0.6)'
                            : '0 0.5px 1px rgba(255,255,255,0.7), 0 0.5px 2px rgba(0,0,0,0.3)',
                        }}
                      >
                        {book.name}
                      </span>
                    </div>

                    {/* Shelf Floor Soft Shadow directly underneath book */}
                    <div className="absolute -bottom-1 inset-x-0 h-1 bg-black/40 blur-[1px] rounded-full pointer-events-none" />
                  </motion.div>
                </div>
              );
            })}

            {/* 3. Cozy Accents for Rows 3 & 4 */}
            {cat.id === 'shelf-ai' && (
              <div
                style={{
                  left: `${currentX + 0.8}%`,
                  bottom: `${100 - cat.floorY}%`,
                  width: '2.4%',
                  height: '4.0%',
                }}
                title="Potted baby succulent"
                className="pointer-events-auto absolute"
              >
                <svg viewBox="0 0 40 45" className="w-full h-full drop-shadow-xs">
                  <ellipse cx="20" cy="42" rx="16" ry="3" fill="rgba(15,8,12,0.4)" />
                  <path d="M 6,16 L 34,16 L 30,40 L 10,40 Z" fill="#9C523A" stroke="#7A3925" strokeWidth="1.5" />
                  <rect x="4" y="12" width="32" height="5" rx="1.5" fill="#B06248" stroke="#7A3925" strokeWidth="1.2" />
                  <ellipse cx="20" cy="13" rx="13" ry="2.5" fill="#422718" />
                  <path d="M 20,14 C 13,8 9,1 13,-3 C 17,-5 20,3 20,14 Z" fill="#588562" stroke="#3D6144" strokeWidth="1" />
                  <path d="M 20,14 C 27,8 31,1 27,-3 C 23,-5 20,3 20,14 Z" fill="#6B9675" stroke="#3D6144" strokeWidth="1" />
                  <path d="M 20,14 C 20,5 20,-6 20,-6 C 22,-6 22,5 20,14 Z" fill="#7FA989" stroke="#3D6144" strokeWidth="1" />
                  <circle cx="20" cy="3" r="2.5" fill="#E59BB2" />
                </svg>
              </div>
            )}

            {cat.id === 'shelf-tools' && (
              <div
                style={{
                  left: `${currentX + 0.6}%`,
                  bottom: `${100 - cat.floorY}%`,
                  width: '4.0%',
                  height: '2.5%',
                }}
                title="Stacked reference notebooks"
                className="pointer-events-auto absolute"
              >
                <svg viewBox="0 0 74 26" className="w-full h-full drop-shadow-xs">
                  <ellipse cx="37" cy="24" rx="35" ry="2.5" fill="rgba(15,8,12,0.35)" />
                  <rect x="1" y="13" width="72" height="11" rx="2" fill="#C8BAA3" stroke="#A89981" strokeWidth="1" />
                  <text x="37" y="21" fill="#382A1B" fontFamily="var(--font-hand), sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle">Cheatsheets</text>
                  <rect x="5" y="3" width="64" height="10" rx="2" fill="#9B5863" stroke="#7A3D47" strokeWidth="1" />
                  <text x="37" y="10.5" fill="#FFF0F2" fontFamily="var(--font-hand), sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle">Lab Notes</text>
                </svg>
              </div>
            )}
          </div>
        );
      })}

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
