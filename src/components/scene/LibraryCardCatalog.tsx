'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AssetImage from '@/components/ui/AssetImage';
import CozyIcon from '@/components/ui/CozyIcon';
import { soundscape } from '@/lib/soundEngine';
import { shelves, currentlyLearning } from '@/data/skills';

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

  // Close modals on Escape key
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrawer, isCabinetZoomed, isClipboardZoomed]);

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
        {/* Cabinet Illustration */}
        <AssetImage
          src="/assets/objects/card-catalog.png"
          alt="Vintage wooden library card catalog cabinet"
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_16px_rgba(20,10,15,0.45)] transition-transform duration-300 group-hover:scale-[1.015]"
        />

        {/* Hotspot Bubble Button (Matches other rooms' pink pulsing bubble buttons) */}
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 z-30">
          <button
            type="button"
            onClick={handleOpenZoom}
            aria-label="Inspect Card Catalog Cabinet"
            className="group/btn relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-rose text-white shadow-cozy ring-4 ring-rose/30 transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
          >
            {/* Animated Pulsing Ring */}
            <span className="absolute -inset-1 rounded-full bg-rose/40 animate-ping pointer-events-none" />

            {/* Bubble Icon */}
            <CozyIcon name="library" size={22} className="relative drop-shadow-xs select-none" />

            {/* Tooltip on Hover */}
            <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-pink-300/80 bg-paper/95 px-3 py-1 font-hand text-xs sm:text-sm font-bold text-cocoa opacity-0 shadow-cozy backdrop-blur-md transition-opacity duration-200 group-hover/btn:opacity-100 dark:border-white/20 dark:bg-black/80 dark:text-pink-100">
              Open Card Catalog
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. FULLSCREEN ZOOM VIEW: Large Cabinet with Category Headings   */}
      {/* ============================================================== */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isCabinetZoomed && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none overflow-y-auto">
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
                className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl py-2 my-auto"
              >
                {/* Header Prompt Bar */}
                <div className="flex items-center justify-between w-full mb-3 px-4 py-2.5 rounded-2xl bg-[#4A2A1A]/95 border-2 border-[#8A522C] shadow-lg text-[#FFF5E6]">
                  <div className="flex items-center gap-2">
                    <CozyIcon name="library" size={28} className="drop-shadow-xs select-none" />
                    <div>
                      <h2 className="font-display text-base sm:text-xl font-bold text-[#FFE8C2] leading-tight">
                        Library Card Catalog
                      </h2>
                      <p className="font-hand text-xs sm:text-sm text-[#E8C2A0] font-bold">
                        Select any drawer to inspect the engineering index cards
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseAll}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-hand text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <span>✕ Step back</span>
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
                        className="group absolute rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#FFE8B3]/20 active:scale-98 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 p-1 flex flex-col justify-between"
                      >
                        {/* 1. Category Heading Written at TOP of Each Drawer */}
                        <div className="w-full pt-0.5 sm:pt-1 px-1 text-center pointer-events-none">
                          <div className="inline-flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-md bg-[#422210]/25 group-hover:bg-[#422210]/40 transition-colors">
                            <CozyIcon name={drawer.iconName} size={22} className="drop-shadow-xs shrink-0 select-none" />
                            <span
                              className="font-hand text-xs sm:text-base md:text-lg font-bold text-[#3B2110] group-hover:text-[#241308] tracking-wide leading-tight whitespace-nowrap"
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
                        <div className="pb-1 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="rounded-full bg-[#3D2111]/90 border border-[#8C5232] px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-[#FFE8C2] font-bold shadow-sm">
                            {drawer.cardCount} cards ➔
                          </span>
                        </div>

                        {/* Golden Pull Gleam Border on Hover */}
                        <div
                          className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200 border-2 border-amber-400/80 shadow-[inset_0_0_15px_rgba(255,215,100,0.35)] ${
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
                className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl py-2 my-auto"
              >
                {/* Header Prompt Bar */}
                <div className="flex items-center justify-between w-full mb-3 px-4 py-2.5 rounded-2xl bg-[#4A2A1A]/95 border-2 border-[#8A522C] shadow-lg text-[#FFF5E6]">
                  <div className="flex items-center gap-2">
                    <CozyIcon name={currentDrawerDef.iconName} size={28} className="drop-shadow-xs shrink-0 select-none" />
                    <div>
                      <h2 id="drawer-title" className="font-display text-base sm:text-xl font-bold text-[#FFE8C2] leading-tight">
                        {currentDrawerDef.name} Drawer
                      </h2>
                      <p className="font-hand text-xs sm:text-sm text-[#E8C2A0] font-bold">
                        A skills checklist clipboard is resting inside the drawer
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBackToCabinet}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-hand text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <span>← Back to cabinet</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCloseAll}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
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
                    className="group/clip absolute cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
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
                      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
                      style={{
                        transform: 'rotate(90deg)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundscape.playSparkleSound();
                          setIsClipboardZoomed(true);
                        }}
                        aria-label={`Open ${currentDrawerDef.name} skills clipboard`}
                        className="group/btn relative flex items-center justify-center cursor-pointer"
                      >
                        {/* Outer Pulsing Glow Ring */}
                        <span
                          aria-hidden
                          className="absolute -inset-2.5 rounded-full bg-pink-400/40 animate-ping opacity-75"
                        />
                        {/* Soft Ambient Halo */}
                        <span
                          aria-hidden
                          className="absolute -inset-1.5 rounded-full bg-pink-300/60 blur-xs"
                        />
                        {/* Solid Center Hotspot Disc with SVG Sparkle */}
                        <span className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition-transform duration-200 group-hover/btn:scale-110 active:scale-95 border-2 border-white">
                          <svg className="w-4 h-4 text-white drop-shadow-xs" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                          </svg>
                        </span>

                        {/* Tooltip on Hover */}
                        <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-pink-300/80 bg-paper/95 px-3 py-1 font-hand text-xs sm:text-sm font-bold text-cocoa opacity-0 shadow-cozy backdrop-blur-md transition-opacity duration-200 group-hover/clip:opacity-100 group-hover/btn:opacity-100 dark:border-white/20 dark:bg-black/80 dark:text-pink-100">
                          Inspect Clipboard
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* 3. ZOOMED CLIPBOARD VIEW: Skills rendered on paper canvas    */}
            {/* ============================================================ */}
            {activeDrawer && isClipboardZoomed && (
              <motion.div
                key="clipboard-zoom-stage"
                role="dialog"
                aria-modal="true"
                aria-labelledby="clipboard-title"
                initial={{ opacity: 0, scale: 0.88, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="relative z-10 flex flex-col items-center justify-center w-full max-w-[460px] sm:max-w-[500px] py-1 my-auto"
              >
                {/* Header Navigation Bar */}
                <div className="flex items-center justify-between w-full mb-2 px-3 py-2 rounded-2xl bg-[#4A2A1A]/95 border-2 border-[#8A522C] shadow-lg text-[#FFF5E6]">
                  <button
                    type="button"
                    onClick={handleBackToDrawer}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-hand text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <span>← Back to drawer</span>
                  </button>

                  <div className="flex items-center gap-1.5 font-hand text-xs sm:text-sm text-[#FFE8C2] font-bold">
                    <CozyIcon name={currentDrawerDef.iconName} size={18} className="shrink-0 select-none" />
                    <span>{currentDrawerDef.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseAll}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#6B3D23] hover:bg-[#854D2C] border border-[#9E5D36] text-[#FFE8C2] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* The Fullscreen Clipboard Artwork with Text Canvas */}
                <div className="relative w-full aspect-[958/1276] select-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)]">
                  <AssetImage
                    src="/assets/objects/clipboard.png"
                    alt="Clipboard with skills paper"
                    className="w-full h-full object-contain pointer-events-none"
                  />

                  {/* Writing Area on the Blank Paper of the Clipboard */}
                  <div
                    className="absolute flex flex-col select-text"
                    style={{
                      left: '11%',
                      right: '11%',
                      top: '16.5%',
                      bottom: '9%',
                    }}
                  >
                    {/* Paper Title Header */}
                    <div className="border-b-2 border-[#DAC8AD] pb-2 mb-2 flex items-center justify-between px-1">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CozyIcon name={currentDrawerDef.iconName} size={24} className="drop-shadow-xs shrink-0 select-none" />
                          <h3
                            id="clipboard-title"
                            className="font-display text-sm sm:text-base md:text-lg font-bold text-[#3B2212] leading-tight"
                          >
                            {currentDrawerDef.name}
                          </h3>
                        </div>
                        <p className="font-mono text-[9px] sm:text-[10px] text-[#8C6B4F] tracking-wider uppercase font-bold">
                          Engineering Skill Index • {cards.length} Recorded
                        </p>
                      </div>
                      <span className="rounded-md bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider">
                        VERIFIED
                      </span>
                    </div>

                    {/* Scrollable list of Skill cards on the paper */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-2 select-text custom-scrollbar">
                      {cards.map((card) => {
                        const isSelected = selectedCard === card.title;
                        return (
                          <div
                            key={card.title}
                            onClick={() => {
                              soundscape.playSparkleSound();
                              setSelectedCard(isSelected ? null : card.title);
                            }}
                            className={`rounded-xl border p-2 sm:p-2.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-pink-400 bg-pink-50/85 shadow-xs ring-1 ring-pink-300'
                                : 'border-[#DAC8AD]/70 hover:border-[#BF9E77] bg-white/70 hover:bg-white/95 shadow-2xs'
                            }`}
                            style={{
                              backgroundImage:
                                'repeating-linear-gradient(transparent, transparent 21px, rgba(180, 160, 140, 0.12) 22px)',
                            }}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#8C6B4F]">
                                {card.catalogCode}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.2 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider ${
                                  card.status === 'Daily Driver'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : card.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {card.status}
                              </span>
                            </div>

                            <h4 className="font-display text-xs sm:text-sm font-bold text-[#3B2212]">
                              {card.title}
                            </h4>
                            <p className="mt-0.5 font-hand text-xs sm:text-sm text-[#5C402B] leading-snug">
                              {card.note}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Paper Footer with Back & Jump to shelf link */}
                    <div className="pt-2 mt-1 border-t border-[#DAC8AD] flex items-center justify-between text-[11px] text-[#8C6B4F] font-hand font-bold px-1">
                      <button
                        type="button"
                        onClick={handleBackToDrawer}
                        className="hover:text-[#3B2212] cursor-pointer"
                      >
                        ← Back to drawer
                      </button>
                      <a
                        href={`#${currentDrawerDef.id}`}
                        onClick={handleCloseAll}
                        className="text-pink-600 hover:text-pink-700 underline font-bold"
                      >
                        Jump to shelf ↓
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
  </>
);
}
