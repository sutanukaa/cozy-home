'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AssetImage from '@/components/ui/AssetImage';
import CozyIcon from '@/components/ui/CozyIcon';
import CozyBubbleButton from '@/components/ui/CozyBubbleButton';
import { soundscape } from '@/lib/soundEngine';
import { shelves, currentlyLearning } from '@/data/skills';
import { SKILL_DEEP_DIVES, SkillDeepDive } from '@/data/skillSummaries';

interface SkillCard {
  title: string;
  category: string;
  catalogCode: string;
  note: string;
  status: 'Daily Driver' | 'Production' | 'Specialty' | 'Active';
}

const SKILL_DETAILS: Record<string, { note: string; status: SkillCard['status'] }> = {
  TypeScript: { note: 'Strict mode advocate. Type-safe architecture across full-stack applications.', status: 'Daily Driver' },
  JavaScript: { note: 'Modern ESNext, closures, asynchronous flows, and event-driven patterns.', status: 'Daily Driver' },
  'Next.js': { note: 'App Router, Server Components, SSR, ISR, and dynamic API endpoints.', status: 'Daily Driver' },
  'React.js': { note: 'Custom hooks, optimized renders, and reusable component architectures.', status: 'Daily Driver' },
  'React Native': { note: 'Cross-platform mobile applications for iOS and Android.', status: 'Production' },
  'Tailwind CSS': { note: 'Design systems, fluid responsive layouts, and dark mode tokens.', status: 'Daily Driver' },
  'Framer Motion': { note: 'Physics-based micro-interactions, layout transitions, and page motion.', status: 'Daily Driver' },
  Polaris: { note: 'Shopify design system components and merchant-first workflows.', status: 'Production' },

  FastAPI: { note: 'Asynchronous Python microservices, Pydantic schemas, and auto-generated docs.', status: 'Daily Driver' },
  'Node.js': { note: 'Event-driven backend services, streaming data, and custom CLI tools.', status: 'Daily Driver' },
  'Express.js': { note: 'Modular middleware architectures and RESTful service design.', status: 'Production' },
  Celery: { note: 'Distributed task queues, background processing, and worker pools.', status: 'Production' },
  Redis: { note: 'In-memory caching, session stores, fast lookups, and rate limiting.', status: 'Production' },
  PostgreSQL: { note: 'Relational data modeling, indexing, foreign keys, and performant queries.', status: 'Daily Driver' },
  Prisma: { note: 'Type-safe schema definitions, declarative migrations, and ORM queries.', status: 'Daily Driver' },
  MongoDB: { note: 'Document-oriented NoSQL persistence for flexible data models.', status: 'Production' },
  Supabase: { note: 'Postgres backend with real-time events, authentication, and storage.', status: 'Production' },

  'Gemini API': { note: 'Multimodal agentic systems, structured JSON schema outputs, and prompt engineering.', status: 'Daily Driver' },
  RAG: { note: 'Retrieval-augmented generation with semantic chunking and context injection.', status: 'Specialty' },
  'Vector Embeddings': { note: 'Semantic vector similarity search and high-dimensional clustering.', status: 'Specialty' },
  ChromaDB: { note: 'Embedded vector database for local and production retrieval stores.', status: 'Specialty' },
  'Vercel AI SDK': { note: 'Streaming completions, unified LLM interfaces, and tool-calling loops.', status: 'Daily Driver' },
  'ETL Pipelines': { note: 'Data ingestion, cleaning, transformation, and automated loading pipelines.', status: 'Production' },

  Docker: { note: 'Containerization, multi-stage builds, and reliable reproducible environments.', status: 'Daily Driver' },
  'Git & GitHub': { note: 'Version control, atomic commits, PR reviews, and branch strategies.', status: 'Daily Driver' },
  'GitHub Actions': { note: 'Automated CI/CD pipelines, typecheck gates, and preview deployments.', status: 'Daily Driver' },
  'Google Cloud Run': { note: 'Serverless container deployments with auto-scaling and HTTPS.', status: 'Production' },
  Vercel: { note: 'Edge network deployment, zero-config staging, and analytics.', status: 'Daily Driver' },
  Postman: { note: 'API contract testing, environment variables, and endpoint collections.', status: 'Daily Driver' },
};

interface DrawerDef {
  id: string;
  name: string;
  shortLabel: string;
  iconName: string;
  col: number; // 0 (left) or 1 (right)
  row: number; // 0 (top) or 1 (bottom)
  cardCount: number;
}

const DRAWERS: DrawerDef[] = [
  { id: 'shelf-frontend', name: 'Frontend & UI', shortLabel: 'Frontend', iconName: 'skill-frontend', col: 0, row: 0, cardCount: 8 },
  { id: 'shelf-backend', name: 'Backend & APIs', shortLabel: 'Backend', iconName: 'skill-backend', col: 1, row: 0, cardCount: 9 },
  { id: 'shelf-ai', name: 'AI & Data', shortLabel: 'AI & Data', iconName: 'skill-ai', col: 0, row: 1, cardCount: 6 },
  { id: 'shelf-tools', name: 'Tools & DevOps', shortLabel: 'Tools', iconName: 'skill-tools', col: 1, row: 1, cardCount: 6 },
];

export default function LibraryCardCatalog() {
  const [mounted, setMounted] = useState(false);
  const [isCabinetZoomed, setIsCabinetZoomed] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClipboardZoomed, setIsClipboardZoomed] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageDirection, setPageDirection] = useState<1 | -1>(1);
  const [hoveredDrawer, setHoveredDrawer] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide site navbar, library heading, and sound toggle when cabinet overlay is open
  useEffect(() => {
    if (isCabinetZoomed) {
      document.body.classList.add('cabinet-modal-open');
      return () => {
        document.body.classList.remove('cabinet-modal-open');
      };
    }
  }, [isCabinetZoomed]);

  const currentDrawerDef = DRAWERS.find((d) => d.id === activeDrawer) ?? DRAWERS[0];

  const getCardsForDrawer = (drawerId: string): SkillCard[] => {
    const shelf = shelves.find((s) => {
      if (drawerId === 'shelf-frontend') return s.name === 'Frontend & UI';
      if (drawerId === 'shelf-backend') return s.name === 'Backend & APIs';
      if (drawerId === 'shelf-ai') return s.name === 'AI & Data';
      return s.name === 'Tools & DevOps';
    });

    if (!shelf) return [];

    const prefix = drawerId === 'shelf-frontend' ? 'FE' : drawerId === 'shelf-backend' ? 'BE' : drawerId === 'shelf-ai' ? 'AI' : 'TL';

    return shelf.books.map((b, idx) => {
      const detail = SKILL_DETAILS[b] ?? { note: 'Production technology in engineering toolbox.', status: 'Production' };
      return {
        title: b,
        category: shelf.name,
        catalogCode: `${prefix}-${(idx + 1).toString().padStart(2, '0')}`,
        note: detail.note,
        status: detail.status,
      };
    });
  };

  const cards = activeDrawer ? getCardsForDrawer(activeDrawer) : [];

  const handleTurnPage = (direction: 1 | -1) => {
    soundscape.playPageTurnSound();
    setPageDirection(direction);
    setPageIndex((prev) => {
      const total = cards.length;
      if (total === 0) return 0;
      const next = prev + direction;
      if (next < 0) return total - 1;
      if (next >= total) return 0;
      return next;
    });
  };

  // Close modals on Escape key & Arrow keys to turn pages on clipboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isClipboardZoomed) {
          setIsClipboardZoomed(false);
        } else if (activeDrawer) {
          setActiveDrawer(null);
        } else if (isCabinetZoomed) {
          setIsCabinetZoomed(false);
        }
      } else if (isClipboardZoomed && cards.length > 0) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          handleTurnPage(1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          handleTurnPage(-1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrawer, isCabinetZoomed, isClipboardZoomed, cards.length]);

  const handleOpenZoom = () => {
    soundscape.playClickSound();
    setIsCabinetZoomed(true);
    setActiveDrawer(null);
    setIsClipboardZoomed(false);
  };

  const handleCloseAll = () => {
    soundscape.playClickSound();
    setIsCabinetZoomed(false);
    setActiveDrawer(null);
    setIsClipboardZoomed(false);
    setSelectedCard(null);
  };

  const handleOpenDrawer = (drawerId: string) => {
    soundscape.playClickSound();
    setActiveDrawer(drawerId);
    setPageIndex(0);
    setPageDirection(1);
    setIsClipboardZoomed(false);
    setSelectedCard(null);
  };

  const handleBackToCabinet = () => {
    soundscape.playClickSound();
    setActiveDrawer(null);
    setIsClipboardZoomed(false);
    setSelectedCard(null);
  };

  const handleBackToDrawer = () => {
    soundscape.playClickSound();
    setIsClipboardZoomed(false);
    setSelectedCard(null);
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. ROOM VIEW: Vintage Cabinet on Left Wall with Hotspot Bubble */}
      {/* ============================================================== */}
      <div
        style={{
          left: '5.2%',
          bottom: '20.0%',
          width: '21.0%',
          aspectRatio: '1199 / 1312',
        }}
        className="pointer-events-auto absolute z-20 select-none group"
      >
        {/* Day Cabinet Illustration */}
        <div className="only-day w-full h-full">
          <AssetImage
            src="/assets/objects/card-catalog.png"
            alt="Vintage wooden library card catalog cabinet"
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_16px_rgba(20,10,15,0.45)] transition-transform duration-300 group-hover:scale-[1.015]"
          />
        </div>

        {/* Night Cabinet Illustration */}
        <div className="only-night w-full h-full">
          <AssetImage
            src="/assets/objects/library-cabinet-night.png"
            alt="Vintage wooden library card catalog cabinet at night"
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_16px_rgba(10,5,15,0.65)] transition-transform duration-300 group-hover:scale-[1.015]"
          />
        </div>

        {/* Hotspot Bubble Button (Canonical CozyBubbleButton matching all rooms) */}
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 z-30">
          <CozyBubbleButton
            label="Open Card Catalog"
            onClick={handleOpenZoom}
            icon={
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M9 10h6" />
                <path d="M9 14h4" />
              </svg>
            }
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. FULLSCREEN ZOOM VIEW: Large Cabinet with Category Headings   */}
      {/* ============================================================== */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isCabinetZoomed && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 xs:p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
            {/* Backdrop click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseAll}
              className="fixed inset-0 cursor-pointer"
            />

            {/* Cabinet Zoom Stage */}
            {!activeDrawer && (
              <motion.div
                key="cabinet-zoomed-view"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="relative z-10 flex flex-col items-center justify-center w-full max-w-[420px] xs:max-w-[480px] sm:max-w-xl md:max-w-2xl py-1 sm:py-2 my-auto"
              >
                {/* Header Prompt Bar */}
                <div className="flex items-center justify-between w-full mb-2 sm:mb-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#4A2A1A]/95 border-2 border-[#8A522C] shadow-lg text-[#FFF5E6]">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <CozyIcon name="library" size={24} className="drop-shadow-xs shrink-0 select-none sm:w-7 sm:h-7" />
                    <div className="min-w-0">
                      <h2 className="font-display text-sm sm:text-lg md:text-xl font-bold text-[#FFE8C2] leading-tight truncate">
                        Library Card Catalog
                      </h2>
                      <p className="font-hand text-[11px] sm:text-xs md:text-sm text-[#E8C2A0] font-bold truncate">
                        <span className="hidden sm:inline">Select any drawer to inspect the engineering index cards</span>
                        <span className="sm:hidden">Tap any drawer to open</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseAll}
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-hand text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <span className="hidden sm:inline">✕ Step back</span>
                    <span className="sm:hidden">✕ Close</span>
                  </button>
                </div>

                {/* The Fullscreen Cabinet with 4 Interactive Drawers */}
                <div className="relative w-full max-w-[540px] aspect-[1199/1312] select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                  {/* High-Res Cabinet Artwork */}
                  <AssetImage
                    src="/assets/objects/card-catalog.png"
                    alt="Card catalog cabinet with 4 drawers"
                    className="w-full h-full object-contain pointer-events-none"
                  />

                  {/* 4 Clickable Drawers with Category Headings at Top */}
                  {DRAWERS.map((drawer) => {
                    // Exact measured bounding box for each drawer face in 1199x1312 image:
                    const leftPct = drawer.col === 0 ? 15.3 : 52.6;
                    const topPct = drawer.row === 0 ? 40.2 : 60.4;
                    const widthPct = 34.2;
                    const heightPct = drawer.row === 0 ? 18.4 : 18.2;
                    const isHovered = hoveredDrawer === drawer.id;

                    return (
                      <button
                        key={drawer.id}
                        type="button"
                        onClick={() => handleOpenDrawer(drawer.id)}
                        onMouseEnter={() => setHoveredDrawer(drawer.id)}
                        onMouseLeave={() => setHoveredDrawer(null)}
                        aria-label={`Open ${drawer.name} drawer (${drawer.cardCount} cards)`}
                        style={{
                          left: `${leftPct}%`,
                          top: `${topPct}%`,
                          width: `${widthPct}%`,
                          height: `${heightPct}%`,
                        }}
                        className="group absolute rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#FFE8B3]/20 active:scale-98 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 p-0.5 sm:p-1 flex flex-col justify-between touch-manipulation"
                      >
                        {/* 1. Category Heading Written at TOP of Each Drawer */}
                        <div className="w-full pt-0.5 sm:pt-1 px-0.5 sm:px-1 text-center pointer-events-none">
                          <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2 py-0.5 rounded-md bg-[#422210]/25 group-hover:bg-[#422210]/40 transition-colors max-w-full">
                            <CozyIcon name={drawer.iconName} size={16} className="drop-shadow-xs shrink-0 select-none sm:w-5 sm:h-5" />
                            <span
                              className="font-hand text-[10px] xs:text-xs sm:text-base md:text-lg font-bold text-[#3B2110] group-hover:text-[#241308] tracking-tight sm:tracking-wide leading-tight truncate"
                              style={{
                                textShadow:
                                  '0 1px 1px rgba(255, 235, 205, 0.8), 0 -0.5px 0.5px rgba(50, 20, 5, 0.4)',
                              }}
                            >
                              {drawer.name}
                            </span>
                          </div>
                        </div>

                        {/* 2. Drawer Pull Glow & Card Count Badge */}
                        <div className="pb-0.5 sm:pb-1 text-center pointer-events-none opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                          <span className="rounded-full bg-[#3D2111]/90 border border-[#8C5232] px-1.5 sm:px-2 py-0.2 sm:py-0.5 font-mono text-[8px] xs:text-[9px] sm:text-[10px] text-[#FFE8C2] font-bold shadow-sm whitespace-nowrap">
                            {drawer.cardCount} cards ➔
                          </span>
                        </div>

                        {/* Golden Pull Gleam Border on Hover */}
                        <div
                          className={`absolute inset-0 rounded-lg sm:rounded-xl pointer-events-none transition-opacity duration-200 border-2 border-amber-400/80 shadow-[inset_0_0_15px_rgba(255,215,100,0.35)] ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* 2. OPEN DRAWER VIEW: Drawer pulled out with Clipboard inside */}
            {/* ============================================================ */}
            {activeDrawer && !isClipboardZoomed && (
              <motion.div
                key="drawer-open-stage"
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="relative z-10 flex flex-col items-center justify-center w-full max-w-[420px] xs:max-w-[480px] sm:max-w-xl md:max-w-2xl py-1 sm:py-2 my-auto"
              >
                {/* Header Prompt Bar */}
                <div className="flex items-center justify-between w-full mb-2 sm:mb-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#4A2A1A]/95 border-2 border-[#8A522C] shadow-lg text-[#FFF5E6]">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <CozyIcon name={currentDrawerDef.iconName} size={24} className="drop-shadow-xs shrink-0 select-none sm:w-7 sm:h-7" />
                    <div className="min-w-0">
                      <h2 id="drawer-title" className="font-display text-sm sm:text-lg md:text-xl font-bold text-[#FFE8C2] leading-tight truncate">
                        {currentDrawerDef.name} Drawer
                      </h2>
                      <p className="font-hand text-[11px] sm:text-xs md:text-sm text-[#E8C2A0] font-bold truncate">
                        <span className="hidden sm:inline">A skills checklist clipboard is resting inside the drawer</span>
                        <span className="sm:hidden">Tap clipboard to inspect skills</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleBackToCabinet}
                      className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-hand text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="hidden sm:inline">← Back to cabinet</span>
                      <span className="sm:hidden">← Cabinet</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCloseAll}
                      className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* The Open Drawer Artwork with Clipboard laying inside */}
                <div className="relative w-full max-w-[560px] aspect-[1725/1296] select-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]">
                  <AssetImage
                    src="/assets/objects/drawer-open.png"
                    alt="Open wooden catalog drawer"
                    className="w-full h-full object-contain pointer-events-none"
                  />

                  {/* The Clipboard laying horizontally inside the drawer cavity */}
                  <div
                    className="group/clip absolute cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] touch-manipulation"
                    style={{
                      left: '50%',
                      top: '42%',
                      width: '31%',
                      aspectRatio: '958/1276',
                      transform: 'translate(-50%, -50%) rotate(-90deg)',
                    }}
                    onClick={() => {
                      soundscape.playSparkleSound();
                      setIsClipboardZoomed(true);
                    }}
                  >
                    <AssetImage
                      src="/assets/objects/clipboard.png"
                      alt="Clipboard resting horizontally in drawer"
                      className="w-full h-full object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.35)] pointer-events-none"
                    />

                    {/* Pink Clickable Bubble Button right on the clipboard (counter-rotated so button & tooltip stay upright) */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
                      style={{
                        transform: 'rotate(90deg)',
                      }}
                    >
                      <CozyBubbleButton
                        label="Inspect Skills Clipboard"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundscape.playSparkleSound();
                          setIsClipboardZoomed(true);
                        }}
                        icon={
                          <svg
                            className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <path d="m9 14 2 2 4-4" />
                          </svg>
                        }
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* 3. ZOOMED CLIPBOARD VIEW: 1 Page per Tech with 3D Page Turn   */}
            {/* ============================================================ */}
            {activeDrawer && isClipboardZoomed && cards.length > 0 && (() => {
              const currentSkill = cards[pageIndex] ?? cards[0];
              const deepDive = currentSkill ? SKILL_DEEP_DIVES[currentSkill.title] : undefined;
              const skillData: SkillDeepDive = deepDive ?? {
                title: currentSkill?.title ?? 'Skill',
                category: (currentDrawerDef?.name as any) ?? 'Frontend & UI',
                catalogCode: currentSkill?.catalogCode ?? 'SK-01',
                status: currentSkill?.status ?? 'Production',
                iconName: currentDrawerDef?.iconName ?? 'skill-frontend',
                masterySummary: currentSkill?.note ?? 'Production skill in engineering stack.',
                whatIBuilt: ['Engineered in production repositories and projects.'],
                keyHighlights: ['Production standard design patterns.'],
              };

              return (
                <motion.div
                  key="clipboard-zoom-stage"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="clipboard-title"
                  initial={{ opacity: 0, scale: 0.88, y: 25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                  className="relative z-10 flex flex-col items-center justify-center w-full max-w-[390px] xs:max-w-[440px] sm:max-w-[520px] md:max-w-[560px] py-1 my-auto"
                >
                  {/* Top Header Navigation Bar */}
                  <div className="flex items-center justify-between w-full mb-1 sm:mb-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-[#4A2A1A]/95 border-2 border-[#8A522C] shadow-lg text-[#FFF5E6]">
                    <button
                      type="button"
                      onClick={handleBackToDrawer}
                      className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-hand text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                    >
                      <span className="hidden sm:inline">← Back to drawer</span>
                      <span className="sm:hidden">← Drawer</span>
                    </button>

                    <div className="flex items-center gap-1.5 font-hand text-xs sm:text-sm text-[#FFE8C2] font-bold min-w-0">
                      <CozyIcon name={currentDrawerDef.iconName} size={16} className="shrink-0 select-none sm:w-[18px] sm:h-[18px]" />
                      <span className="truncate">{currentDrawerDef.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCloseAll}
                      className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-bold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  {/* The Fullscreen Clipboard Artwork with Text Canvas */}
                  <div className="relative w-full aspect-[958/1276] select-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)]">
                    <AssetImage
                      src="/assets/objects/clipboard.png"
                      alt="Clipboard with skills paper sheet"
                      className="w-full h-full object-contain pointer-events-none"
                    />

                    {/* Writing Area on the Blank Paper of the Clipboard - Exactly Cleared of Brass Clip */}
                    <div
                      className="absolute flex flex-col justify-between select-text"
                      style={{
                        left: '9.0%',
                        right: '9.0%',
                        top: '21.5%',
                        bottom: '6.8%',
                      }}
                    >
                      {/* Fixed Top Paper Header (Pinned below clip, above turnable sheets) */}
                      <div className="border-b border-[#DAC8AD]/80 pb-1 mb-1 flex items-start justify-between gap-1 px-0.5 sm:px-1 shrink-0">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <CozyIcon
                              name={skillData.iconName}
                              size={16}
                              className="drop-shadow-xs shrink-0 select-none sm:w-[20px] sm:h-[20px]"
                            />
                            <span className="font-mono text-[8.5px] xs:text-[9px] sm:text-[10px] text-[#8C6B4F] tracking-wider uppercase font-bold truncate">
                              {currentDrawerDef.name}
                            </span>
                            <span className="font-mono text-[8px] xs:text-[8.5px] sm:text-[9.5px] text-[#A07E62] font-semibold shrink-0">
                              • {skillData.catalogCode}
                            </span>
                          </div>
                          <h3
                            id="clipboard-title"
                            className="font-display text-xs xs:text-sm sm:text-lg md:text-xl font-bold text-[#3B2212] leading-tight truncate mt-0.5"
                          >
                            {skillData.title}
                          </h3>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-0.2 sm:px-2.5 sm:py-0.5 font-mono text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider ${
                            skillData.status === 'Daily Driver'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : skillData.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}
                        >
                          {skillData.status}
                        </span>
                      </div>

                      {/* 3D Animated Paper Page Surface (1 Technology per Sheet) */}
                      <div className="relative flex-1 w-full overflow-hidden" style={{ perspective: 1200 }}>
                        <AnimatePresence mode="wait" custom={pageDirection}>
                          <motion.div
                            key={`${activeDrawer}-${pageIndex}`}
                            custom={pageDirection}
                            variants={{
                              enter: (dir: number) => ({
                                opacity: 0,
                                rotateY: dir > 0 ? 28 : -28,
                                x: dir > 0 ? 35 : -35,
                                scale: 0.97,
                              }),
                              center: {
                                opacity: 1,
                                rotateY: 0,
                                x: 0,
                                scale: 1,
                                transition: {
                                  duration: 0.28,
                                  ease: [0.22, 1, 0.36, 1],
                                },
                              },
                              exit: (dir: number) => ({
                                opacity: 0,
                                rotateY: dir > 0 ? -32 : 32,
                                x: dir > 0 ? -45 : 45,
                                scale: 0.95,
                                transition: {
                                  duration: 0.22,
                                  ease: [0.32, 0, 0.67, 0],
                                },
                              }),
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 flex flex-col justify-start overflow-y-auto pr-0.5 sm:pr-1 select-text cozy-scrollbar space-y-1 sm:space-y-1.5 py-0.5"
                            style={{
                              transformOrigin: pageDirection > 0 ? 'left center' : 'right center',
                              transformStyle: 'preserve-3d',
                            }}
                          >
                            {/* Section 1: Proficiency & Mastery Summary */}
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[8px] xs:text-[8.5px] sm:text-[10px] uppercase font-bold text-[#7A583B]">
                                <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                                </svg>
                                <span>Proficiency & Technical Mastery</span>
                              </div>
                              <p className="rounded-md sm:rounded-lg bg-[#FAF5EE]/95 border border-[#E8DAC5] p-1.5 sm:p-2 font-sans text-[9.5px] xs:text-[10.5px] sm:text-[11.5px] leading-snug sm:leading-relaxed text-[#4A3319] shadow-2xs">
                                {skillData.masterySummary}
                              </p>
                            </div>

                            {/* Section 2: What I Built (Grounding from Real Repos) */}
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[8px] xs:text-[8.5px] sm:text-[10px] uppercase font-bold text-[#7A583B]">
                                <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                                </svg>
                                <span>Production Work & Git History</span>
                              </div>
                              <ul className="space-y-0.5 sm:space-y-1">
                                {skillData.whatIBuilt.map((item, bIdx) => (
                                  <li
                                    key={bIdx}
                                    className="flex items-start gap-1 sm:gap-1.5 text-[9px] xs:text-[10px] sm:text-[11px] leading-snug text-[#4A3319] bg-white/75 p-1 sm:p-1.5 rounded-md border border-[#EDE2D3]/90 shadow-2xs"
                                  >
                                    <span className="shrink-0 mt-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-rose-400" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Section 3: Key Architectural Highlights */}
                            <div className="space-y-0.5 pb-0.5">
                              <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[8px] xs:text-[8.5px] sm:text-[10px] uppercase font-bold text-[#7A583B]">
                                <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                                </svg>
                                <span>Architectural Strengths</span>
                              </div>
                              <div className="flex flex-wrap gap-0.5 sm:gap-1">
                                {skillData.keyHighlights.map((hl, hlIdx) => (
                                  <span
                                    key={hlIdx}
                                    className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-[#F2E7D8]/90 border border-[#DECFBA] text-[#5C3D24] text-[8px] xs:text-[9px] sm:text-[10px] font-medium leading-tight"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-amber-600 shrink-0" />
                                    {hl}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Bottom Turn Page Controls Bar */}
                      <div className="pt-1 sm:pt-1.5 border-t border-[#DAC8AD] mt-0.5 shrink-0 select-none">
                        <div className="flex items-center justify-between gap-1 w-full">
                          {/* Previous Sheet Button */}
                          <button
                            type="button"
                            onClick={() => handleTurnPage(-1)}
                            disabled={pageIndex === 0}
                            aria-label="Previous skill sheet"
                            className={`inline-flex items-center gap-0.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-hand text-[10px] xs:text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                              pageIndex === 0
                                ? 'opacity-40 cursor-not-allowed bg-[#ECE3D5] text-[#8C7A68]'
                                : 'bg-[#ECE3D5] hover:bg-[#E2D6C4] active:scale-95 text-[#4A3319] border border-[#D5C6B1] shadow-2xs cursor-pointer touch-manipulation'
                            }`}
                          >
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Prev</span>
                          </button>

                          {/* Sheet Indicator & Clickable Micro Pagination Dots */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className="flex items-center gap-0.5 font-mono text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-[#6D4C33]">
                              <span>Sheet</span>
                              <span className="px-1 py-0.2 rounded-md bg-[#F0E6D8] border border-[#D8C7B0] text-[#3B2212]">
                                {pageIndex + 1}
                              </span>
                              <span>of</span>
                              <span>{cards.length}</span>
                            </div>

                            <div className="hidden xs:flex items-center gap-0.5 mt-0.5">
                              {cards.map((_, dotIdx) => (
                                <button
                                  key={dotIdx}
                                  type="button"
                                  onClick={() => {
                                    if (dotIdx !== pageIndex) {
                                      handleTurnPage(dotIdx > pageIndex ? 1 : -1);
                                      setPageIndex(dotIdx);
                                    }
                                  }}
                                  aria-label={`Jump to sheet ${dotIdx + 1}`}
                                  className={`h-1 sm:h-1.5 rounded-full transition-all cursor-pointer ${
                                    dotIdx === pageIndex ? 'w-2.5 sm:w-3.5 bg-rose' : 'w-1 sm:w-1.5 bg-[#CBB79F] hover:bg-rose-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Turn Page Button */}
                          <button
                            type="button"
                            onClick={() => handleTurnPage(1)}
                            aria-label="Turn page to next skill sheet"
                            className="group/turn inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-rose hover:bg-rose-600 active:scale-95 text-white font-hand text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold shadow-cozy transition-all cursor-pointer shrink-0 touch-manipulation"
                          >
                            <span>{pageIndex === cards.length - 1 ? 'First Sheet' : 'Turn Page'}</span>
                            <svg
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover/turn:translate-x-0.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>


                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
  </>
);
}
