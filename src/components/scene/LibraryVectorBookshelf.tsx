'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CozyIcon from '@/components/ui/CozyIcon';
import { soundscape } from '@/lib/soundEngine';

export type BookColor = 'pink' | 'sage' | 'butter' | 'lavender' | 'rose' | 'cream' | 'sky';
export type BookOrnament = 'star' | 'diamond' | 'dots' | 'lines' | 'flower' | 'leaf';

export interface BookDef {
  name: string;
  color: BookColor;
  width: number; // percentage width in 16:9 stage
  height: number; // percentage height in 16:9 stage
  tilt?: number; // degrees of tilt, e.g. -1.0 or 1.2
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
  floorY: number; // % from top where the shelf floor plank sits
  startX: number; // % from left where the first book begins
  books: BookDef[];
}

// Gouache watercolor hardcover color palettes
const PALETTES: Record<
  BookColor,
  {
    coverLight: string;
    coverMid: string;
    coverDark: string;
    textColor: string;
    goldColor: string;
    ribbonColor: string;
    accentColor: string;
  }
> = {
  pink: {
    coverLight: '#FBB6C8',
    coverMid: '#F08DA7',
    coverDark: '#D46985',
    textColor: '#4A1220',
    goldColor: '#FCE588',
    ribbonColor: '#FF6584',
    accentColor: '#F79FB5',
  },
  sage: {
    coverLight: '#BCE0C3',
    coverMid: '#9BCAA3',
    coverDark: '#75A57E',
    textColor: '#17361D',
    goldColor: '#FCE788',
    ribbonColor: '#81C784',
    accentColor: '#A9D4B1',
  },
  butter: {
    coverLight: '#FEEAA2',
    coverMid: '#F9D86F',
    coverDark: '#DFB543',
    textColor: '#422806',
    goldColor: '#E09F25',
    ribbonColor: '#FFCA28',
    accentColor: '#FCE082',
  },
  lavender: {
    coverLight: '#DACDF2',
    coverMid: '#BEADE3',
    coverDark: '#9782C4',
    textColor: '#291745',
    goldColor: '#FDEAA8',
    ribbonColor: '#BA68C8',
    accentColor: '#CBBCE9',
  },
  rose: {
    coverLight: '#F8B5AE',
    coverMid: '#EA9289',
    coverDark: '#CD6A60',
    textColor: '#451612',
    goldColor: '#FDE496',
    ribbonColor: '#E57373',
    accentColor: '#F2A49B',
  },
  cream: {
    coverLight: '#FFFDF9',
    coverMid: '#F5ECDB',
    coverDark: '#DFCEB3',
    textColor: '#3D2A18',
    goldColor: '#D49F30',
    ribbonColor: '#C9B596',
    accentColor: '#FAF3E7',
  },
  sky: {
    coverLight: '#BDE3F8',
    coverMid: '#96CEF0',
    coverDark: '#6AAED6',
    textColor: '#122D42',
    goldColor: '#FDE78A',
    ribbonColor: '#64B5F6',
    accentColor: '#A8D9F4',
  },
};

const SHELF_CATEGORIES: ShelfCategoryDef[] = [
  {
    id: 'shelf-frontend',
    name: 'Frontend & UI',
    iconName: 'skill-frontend',
    emoji: '🎀',
    plaqueX: 18.0,
    plaqueY: 22.5,
    floorY: 32.3,
    startX: 32.2,
    books: [
      { name: 'TypeScript', color: 'butter', width: 3.3, height: 10.6, tilt: -0.8, hasRibbon: true, ornament: 'star' },
      { name: 'JavaScript', color: 'butter', width: 3.0, height: 10.2, ornament: 'lines' },
      { name: 'Next.js', color: 'cream', width: 3.4, height: 11.0, hasRibbon: true, ornament: 'diamond' },
      { name: 'React.js', color: 'sky', width: 3.4, height: 10.5, ornament: 'star' },
      { name: 'React Native', color: 'lavender', width: 3.3, height: 10.3, ornament: 'lines' },
      { name: 'Tailwind CSS', color: 'sky', width: 3.5, height: 10.8, ornament: 'dots' },
      { name: 'Framer Motion', color: 'pink', width: 3.5, height: 10.9, hasRibbon: true, ornament: 'flower' },
      { name: 'Polaris', color: 'sage', width: 3.1, height: 10.0, tilt: 1.2, ornament: 'lines' },
    ],
  },
  {
    id: 'shelf-backend',
    name: 'Backend & APIs',
    iconName: 'skill-backend',
    emoji: '🧁',
    plaqueX: 18.0,
    plaqueY: 37.8,
    floorY: 45.4,
    startX: 32.2,
    books: [
      { name: 'FastAPI', color: 'sage', width: 3.1, height: 10.5, ornament: 'diamond' },
      { name: 'Node.js', color: 'sage', width: 2.9, height: 10.1, ornament: 'lines' },
      { name: 'Express.js', color: 'cream', width: 3.1, height: 10.6, hasRibbon: true, ornament: 'star' },
      { name: 'Celery', color: 'sky', width: 2.8, height: 9.9, ornament: 'lines' },
      { name: 'Redis', color: 'rose', width: 3.1, height: 10.8, ornament: 'dots' },
      { name: 'PostgreSQL', color: 'sky', width: 3.4, height: 11.0, ornament: 'diamond' },
      { name: 'Prisma', color: 'lavender', width: 3.0, height: 10.2, ornament: 'lines' },
      { name: 'MongoDB', color: 'sage', width: 3.2, height: 10.6, hasRibbon: true, ornament: 'leaf' },
      { name: 'Supabase', color: 'sage', width: 3.1, height: 10.7, tilt: 1.2, ornament: 'star' },
    ],
  },
  {
    id: 'shelf-ai',
    name: 'AI & Data',
    iconName: 'skill-ai',
    emoji: '🪄',
    plaqueX: 18.0,
    plaqueY: 50.8,
    floorY: 57.7,
    startX: 32.2,
    books: [
      { name: 'Gemini API', color: 'sky', width: 3.7, height: 10.8, tilt: -0.8, ornament: 'star' },
      { name: 'RAG', color: 'lavender', width: 3.4, height: 10.3, ornament: 'lines' },
      { name: 'Vector Embeddings', color: 'rose', width: 4.1, height: 11.2, hasRibbon: true, ornament: 'diamond' },
      { name: 'ChromaDB', color: 'butter', width: 3.5, height: 10.5, ornament: 'dots' },
      { name: 'Vercel AI SDK', color: 'cream', width: 3.9, height: 11.0, ornament: 'lines' },
      { name: 'ETL Pipelines', color: 'sage', width: 3.6, height: 10.4, tilt: 1.2, ornament: 'leaf' },
    ],
  },
  {
    id: 'shelf-tools',
    name: 'Tools & DevOps',
    iconName: 'skill-tools',
    emoji: '🧰',
    plaqueX: 18.0,
    plaqueY: 63.8,
    floorY: 70.6,
    startX: 32.2,
    books: [
      { name: 'Docker', color: 'sky', width: 3.7, height: 10.7, tilt: -1.0, ornament: 'diamond' },
      { name: 'Git & GitHub', color: 'rose', width: 3.8, height: 11.0, hasRibbon: true, ornament: 'star' },
      { name: 'GitHub Actions', color: 'butter', width: 3.9, height: 10.5, ornament: 'lines' },
      { name: 'Google Cloud Run', color: 'sky', width: 4.1, height: 11.1, ornament: 'dots' },
      { name: 'Vercel', color: 'cream', width: 3.5, height: 10.6, ornament: 'lines' },
      { name: 'Postman', color: 'rose', width: 3.5, height: 10.4, tilt: 1.5, ornament: 'flower' },
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
            {/* 1. Wooden Category Plaque in Left Cubby */}
            <a
              href={`#${cat.id}`}
              title={`Jump to ${cat.name} shelf section below`}
              className="pointer-events-auto absolute flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#5A341B]/95 hover:bg-[#6E3F21] border border-[#8A522C] shadow-[0_2px_6px_rgba(30,12,6,0.45)] backdrop-blur-[1px] transition-all hover:scale-105 active:scale-95 group"
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

            {/* 2. Realistic Handcrafted Vector Books Standing Side-by-Side */}
            {cat.books.map((book, bookIdx) => {
              const bookLeft = currentX;
              currentX += book.width;
              const palette = PALETTES[book.color];
              const bottomPercent = 100 - cat.floorY;
              const isTapped = tappedSkill === book.name;
              const gradId = `spine-grad-${catIdx}-${bookIdx}`;
              const goldId = `gold-grad-${catIdx}-${bookIdx}`;

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
                    {/* SVG 3D Book Spine with Arched Perspective */}
                    <svg
                      viewBox="0 0 100 300"
                      preserveAspectRatio="none"
                      className="w-full h-full drop-shadow-[0_2px_4px_rgba(30,12,6,0.35)]"
                    >
                      <defs>
                        {/* 3D Cylindrical Spine Gradient */}
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={palette.coverDark} />
                          <stop offset="12%" stopColor={palette.coverMid} />
                          <stop offset="32%" stopColor={palette.coverLight} />
                          <stop offset="68%" stopColor={palette.coverMid} />
                          <stop offset="90%" stopColor={palette.coverMid} />
                          <stop offset="100%" stopColor={palette.coverDark} />
                        </linearGradient>

                        {/* Gold Foil Emboss Gradient */}
                        <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#C98B18" />
                          <stop offset="25%" stopColor="#FDE888" />
                          <stop offset="60%" stopColor="#FFF5B8" />
                          <stop offset="85%" stopColor="#E2A62B" />
                          <stop offset="100%" stopColor="#996308" />
                        </linearGradient>
                      </defs>

                      {/* Headband / Exposed Striped Cloth Top */}
                      <path
                        d="M 6,10 Q 50,4 94,10 L 94,18 Q 50,12 6,18 Z"
                        fill="#FBF3E6"
                        stroke="#D1B898"
                        strokeWidth="1.2"
                      />
                      <line x1="30" y1="7" x2="30" y2="15" stroke="#A93B50" strokeWidth="2" />
                      <line x1="50" y1="5.5" x2="50" y2="13.5" stroke="#A93B50" strokeWidth="2" />
                      <line x1="70" y1="7" x2="70" y2="15" stroke="#A93B50" strokeWidth="2" />

                      {/* Main Arched 3D Hardcover Spine */}
                      <path
                        d="M 4,12 Q 50,6 96,12 L 96,290 Q 50,296 4,290 Z"
                        fill={`url(#${gradId})`}
                        stroke={palette.coverDark}
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />

                      {/* Left Hinge Crease Groove (Physical Book Depth) */}
                      <path d="M 10,12 L 10,290" stroke="rgba(0,0,0,0.22)" strokeWidth="2.5" />
                      <path d="M 12.5,12 L 12.5,290" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />

                      {/* Right Edge Highlight */}
                      <path d="M 91,12 L 91,290" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />

                      {/* Top Raised Gold Ribs */}
                      <rect x="6" y="24" width="88" height="3" rx="1" fill={`url(#${goldId})`} />
                      <line x1="6" y1="28" x2="94" y2="28" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                      <rect x="6" y="32" width="88" height="2" rx="0.5" fill={`url(#${goldId})`} />

                      {/* Bottom Raised Gold Ribs */}
                      <rect x="6" y="266" width="88" height="2" rx="0.5" fill={`url(#${goldId})`} />
                      <rect x="6" y="271" width="88" height="3" rx="1" fill={`url(#${goldId})`} />
                      <line x1="6" y1="275" x2="94" y2="275" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

                      {/* Gold Spine Ornaments */}
                      {book.ornament === 'star' ? (
                        <>
                          <polygon points="50,46 54,51 50,56 46,51" fill={`url(#${goldId})`} />
                          <polygon points="50,248 54,253 50,258 46,253" fill={`url(#${goldId})`} />
                        </>
                      ) : book.ornament === 'diamond' ? (
                        <>
                          <rect x="46" y="47" width="8" height="8" transform="rotate(45, 50, 51)" fill={`url(#${goldId})`} />
                          <rect x="46" y="249" width="8" height="8" transform="rotate(45, 50, 253)" fill={`url(#${goldId})`} />
                        </>
                      ) : book.ornament === 'dots' ? (
                        <>
                          <circle cx="50" cy="51" r="3" fill={`url(#${goldId})`} />
                          <circle cx="50" cy="253" r="3" fill={`url(#${goldId})`} />
                        </>
                      ) : (
                        <>
                          <line x1="30" y1="51" x2="70" y2="51" stroke={`url(#${goldId})`} strokeWidth="2" />
                          <line x1="30" y1="253" x2="70" y2="253" stroke={`url(#${goldId})`} strokeWidth="2" />
                        </>
                      )}

                      {/* Hanging Silk Bookmark Ribbon */}
                      {book.hasRibbon && (
                        <path
                          d="M 44,288 L 44,320 L 50,314 L 56,320 L 56,288 Z"
                          fill={palette.ribbonColor}
                          stroke="rgba(0,0,0,0.25)"
                          strokeWidth="1"
                        />
                      )}

                      {/* Debossed Spine Typography (Centered Vertical Text in SVG) */}
                      <g transform="translate(50.5, 150) rotate(-90)">
                        {/* Highlight Layer for Debossed Inset */}
                        <text
                          x="0"
                          y="6"
                          fill="rgba(255,255,255,0.65)"
                          fontFamily="var(--font-hand), 'Patrick Hand', 'Comic Sans MS', cursive, sans-serif"
                          fontWeight="bold"
                          fontSize="19"
                          textAnchor="middle"
                          letterSpacing="0.8"
                        >
                          {book.name}
                        </text>
                        {/* Main Debossed Ink Text */}
                        <text
                          x="0"
                          y="5"
                          fill={palette.textColor}
                          fontFamily="var(--font-hand), 'Patrick Hand', 'Comic Sans MS', cursive, sans-serif"
                          fontWeight="bold"
                          fontSize="19"
                          textAnchor="middle"
                          letterSpacing="0.8"
                        >
                          {book.name}
                        </text>
                      </g>
                    </svg>

                    {/* Shelf Floor Soft Shadow beneath book */}
                    <div className="absolute -bottom-1 inset-x-0 h-1 bg-black/30 blur-[1px] rounded-full pointer-events-none" />
                  </motion.div>
                </div>
              );
            })}

            {/* 3. Cozy Fillers for Rows 3 & 4 */}
            {cat.id === 'shelf-ai' && (
              <div
                style={{
                  left: `${currentX + 0.8}%`,
                  bottom: `${100 - cat.floorY}%`,
                  width: '2.4%',
                  height: '4.2%',
                }}
                title="Potted baby succulent"
                className="pointer-events-auto absolute"
              >
                <svg viewBox="0 0 40 45" className="w-full h-full drop-shadow-xs">
                  <ellipse cx="20" cy="42" rx="16" ry="3" fill="rgba(30,12,6,0.3)" />
                  <path d="M 6,16 L 34,16 L 30,40 L 10,40 Z" fill="#D97A53" stroke="#B35532" strokeWidth="1.5" />
                  <rect x="4" y="12" width="32" height="5" rx="1.5" fill="#E28963" stroke="#B35532" strokeWidth="1.2" />
                  <ellipse cx="20" cy="13" rx="13" ry="2.5" fill="#5A3A28" />
                  <path d="M 20,14 C 13,8 9,1 13,-3 C 17,-5 20,3 20,14 Z" fill="#78B885" stroke="#528F60" strokeWidth="1" />
                  <path d="M 20,14 C 27,8 31,1 27,-3 C 23,-5 20,3 20,14 Z" fill="#88C795" stroke="#528F60" strokeWidth="1" />
                  <path d="M 20,14 C 20,5 20,-6 20,-6 C 22,-6 22,5 20,14 Z" fill="#9CD8A8" stroke="#528F60" strokeWidth="1" />
                  <circle cx="20" cy="4" r="3" fill="#FFB7D5" />
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
                  <ellipse cx="37" cy="24" rx="35" ry="2.5" fill="rgba(30,12,6,0.25)" />
                  <rect x="1" y="13" width="72" height="11" rx="2" fill="#F5ECDB" stroke="#DFCEB3" strokeWidth="1" />
                  <line x1="3" y1="18" x2="70" y2="18" stroke="#C98B18" strokeWidth="1" />
                  <text x="37" y="21" fill="#5A3E26" fontFamily="var(--font-hand), sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle">Cheatsheets</text>
                  <rect x="5" y="3" width="64" height="10" rx="2" fill="#F7B4C4" stroke="#DE7C95" strokeWidth="1" />
                  <line x1="7" y1="8" x2="66" y2="8" stroke="#FCE588" strokeWidth="0.8" />
                  <text x="37" y="10.5" fill="#4A1220" fontFamily="var(--font-hand), sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle">Lab Notes</text>
                  <rect x="22" y="1" width="30" height="2" rx="1" fill="#FFD166" stroke="#D49B28" strokeWidth="0.5" />
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
