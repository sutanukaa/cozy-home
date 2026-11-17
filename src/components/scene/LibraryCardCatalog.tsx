'use client';

import { useState, useEffect } from 'react';
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
  emoji: string;
  iconName: string;
  col: number; // 0 (left) or 1 (right)
  row: number; // 0 (top) or 1 (bottom)
  cardCount: number;
}

const DRAWERS: DrawerDef[] = [
  { id: 'shelf-frontend', name: 'Frontend & UI', shortLabel: 'Frontend', emoji: '🎀', iconName: 'skill-frontend', col: 0, row: 0, cardCount: 8 },
  { id: 'shelf-backend', name: 'Backend & APIs', shortLabel: 'Backend', emoji: '🧁', iconName: 'skill-backend', col: 1, row: 0, cardCount: 9 },
  { id: 'shelf-ai', name: 'AI & Data', shortLabel: 'AI & Data', emoji: '🪄', iconName: 'skill-ai', col: 0, row: 1, cardCount: 6 },
  { id: 'shelf-tools', name: 'Tools & DevOps', shortLabel: 'Tools', emoji: '🧰', iconName: 'skill-tools', col: 1, row: 1, cardCount: 6 },
];

export default function LibraryCardCatalog() {
  const [isCabinetZoomed, setIsCabinetZoomed] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [hoveredDrawer, setHoveredDrawer] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDrawer) {
          setActiveDrawer(null);
        } else if (isCabinetZoomed) {
          setIsCabinetZoomed(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrawer, isCabinetZoomed]);

  const handleOpenZoom = () => {
    soundscape.playClickSound();
    setIsCabinetZoomed(true);
    setActiveDrawer(null);
  };

  const handleCloseAll = () => {
    soundscape.playClickSound();
    setIsCabinetZoomed(false);
    setActiveDrawer(null);
    setSelectedCard(null);
  };

  const handleOpenDrawer = (drawerId: string) => {
    soundscape.playClickSound();
    setActiveDrawer(drawerId);
    setSelectedCard(null);
  };

  const handleBackToCabinet = () => {
    soundscape.playClickSound();
    setActiveDrawer(null);
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
            <span className="relative text-base sm:text-lg">🗄️</span>

            {/* Tooltip on Hover */}
            <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-pink-300/80 bg-paper/95 px-3 py-1 font-hand text-xs sm:text-sm font-bold text-cocoa opacity-0 shadow-cozy backdrop-blur-md transition-opacity duration-200 group-hover/btn:opacity-100 dark:border-white/20 dark:bg-black/80 dark:text-pink-100">
              Open Card Catalog ✨
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. FULLSCREEN ZOOM VIEW: Large Cabinet with Category Headings   */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isCabinetZoomed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md select-none overflow-y-auto">
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
                    <span className="text-xl sm:text-2xl">🗄️</span>
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
                    // Exact percentage bounding box for 2x2 grid drawers in 1199x1312 image:
                    const leftPct = drawer.col === 0 ? 16.5 : 52.0;
                    const topPct = drawer.row === 0 ? 38.5 : 61.0;
                    const widthPct = 32.5;
                    const heightPct = 20.5;
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
                        className="group absolute rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#FFE8B3]/20 active:scale-98 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 p-1 flex flex-col justify-between"
                      >
                        {/* 1. Category Heading Written at TOP of Each Drawer */}
                        <div className="w-full pt-1.5 sm:pt-2 px-1 text-center pointer-events-none">
                          <div className="inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded-md bg-[#422210]/25 group-hover:bg-[#422210]/40 transition-colors">
                            <span className="text-xs sm:text-sm">{drawer.emoji}</span>
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
                        <div className="pb-1.5 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="rounded-full bg-[#3D2111]/85 border border-[#8C5232] px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-[#FFE8C2] font-bold shadow-sm">
                            {drawer.cardCount} cards ➔
                          </span>
                        </div>

                        {/* Golden Pull Gleam Border on Hover */}
                        <div
                          className={`absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-200 border-2 border-amber-300/60 shadow-[inset_0_0_15px_rgba(255,215,100,0.4)] ${
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
            {/* 3. OPEN DRAWER VIEW: The Vintage Manila Index Cards Tray    */}
            {/* ============================================================ */}
            {activeDrawer && (
              <motion.div
                key="drawer-cards-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative z-20 w-full max-w-2xl rounded-2xl sm:rounded-3xl border-4 border-[#7A4B29] bg-[#EFE3CF] shadow-[0_25px_60px_rgba(10,5,2,0.7)] overflow-hidden flex flex-col max-h-[88vh] my-auto"
              >
                {/* Antique Header with Drawer Title & Back Button */}
                <div className="relative flex items-center justify-between px-4 sm:px-6 py-3 bg-[#4A2A1A] border-b-2 border-[#7A4B29] text-[#FFF5E6]">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleBackToCabinet}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#6B3D23] hover:bg-[#854D2C] px-2.5 py-1 text-xs font-hand font-bold text-[#FFE8C2] border border-[#9E5D36] transition-all active:scale-95 cursor-pointer"
                    >
                      <span>← Cabinet</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{currentDrawerDef.emoji}</span>
                      <h2 id="drawer-title" className="font-display text-lg sm:text-2xl font-bold tracking-tight text-[#FFE8C2]">
                        {currentDrawerDef.name}
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseAll}
                    aria-label="Close card catalog"
                    className="rounded-full p-1.5 text-[#E8C2A0] hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* 4 Category Tabs to Quickly Switch Drawers */}
                <div className="flex items-center gap-1 px-3 sm:px-6 pt-2 bg-[#DFCEB3] border-b border-[#C8B395] overflow-x-auto no-scrollbar">
                  {DRAWERS.map((d) => {
                    const isActive = d.id === activeDrawer;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleOpenDrawer(d.id)}
                        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-hand text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#FFFDF7] text-[#3D2514] shadow-sm -mb-px border-t-2 border-x-2 border-[#C8B395]'
                            : 'bg-[#D4BF9F] text-[#69482F] hover:bg-[#DEC9A9] hover:text-[#3D2514]'
                        }`}
                      >
                        <span>{d.emoji}</span>
                        <span>{d.shortLabel}</span>
                        <span className="ml-0.5 rounded-full bg-black/10 px-1 text-[9px] font-mono">
                          {d.cardCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Cards Tray Grid */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#EFE3CF] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {cards.map((card) => {
                      const isSelected = selectedCard === card.title;
                      return (
                        <motion.div
                          key={card.title}
                          layout
                          whileHover={{ y: -3, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            soundscape.playSparkleSound();
                            setSelectedCard(isSelected ? null : card.title);
                          }}
                          className={`group relative rounded-xl border-2 p-3.5 sm:p-4 bg-[#FFFDF7] transition-all cursor-pointer select-text ${
                            isSelected
                              ? 'border-pink-400 shadow-[0_6px_18px_rgba(214,70,118,0.22)] ring-2 ring-pink-300/60'
                              : 'border-[#DAC8AD] hover:border-[#BF9E77] shadow-[0_2px_6px_rgba(40,20,10,0.08)]'
                          }`}
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(transparent, transparent 23px, rgba(180, 160, 140, 0.15) 24px)',
                          }}
                        >
                          {/* Manila Card Header */}
                          <div className="flex items-center justify-between border-b border-[#DAC8AD]/60 pb-1 mb-2">
                            <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#8C6B4F] tracking-widest">
                              {card.catalogCode}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider ${
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

                          {/* Technology Name */}
                          <h3 className="font-display text-base sm:text-lg font-bold text-[#3B2212] group-hover:text-[#B84D6A] transition-colors">
                            {card.title}
                          </h3>

                          {/* Description Note */}
                          <p className="mt-1 font-hand text-xs sm:text-sm text-[#5C402B] leading-relaxed">
                            {card.note}
                          </p>

                          {/* Vintage Verification Stamp */}
                          <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#A6886D] font-mono">
                            <span>SECTION: {card.category}</span>
                            <span className="text-[#C24B5E] font-bold opacity-80 uppercase tracking-tighter text-[9px]">
                              ✓ CATALOGED
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#DFCEB3] border-t border-[#C8B395]">
                  <button
                    type="button"
                    onClick={handleBackToCabinet}
                    className="inline-flex items-center gap-1 font-hand text-xs sm:text-sm text-[#69482F] hover:text-[#3B2212] font-bold cursor-pointer"
                  >
                    <span>← Back to all 4 drawers</span>
                  </button>

                  <a
                    href={`#${currentDrawerDef.id}`}
                    onClick={handleCloseAll}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#5A341B] hover:bg-[#724223] active:scale-95 px-3.5 py-1.5 font-hand text-xs sm:text-sm font-bold text-[#FFF5E6] shadow-sm transition-all"
                  >
                    <span>View shelf details</span>
                    <span>↓</span>
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
