'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AssetImage from '@/components/ui/AssetImage';
import CozyIcon from '@/components/ui/CozyIcon';
import { soundscape } from '@/lib/soundEngine';
import { shelves, currentlyLearning } from '@/data/skills';

interface SkillCard {
  title: string;
  category: string;
  categoryKey: string;
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
  label: string;
  shortLabel: string;
  emoji: string;
  iconName: string;
  col: number; // 0 (left) or 1 (right)
  row: number; // 0 (top), 1 (mid), 2 (bottom)
  cardCount: number;
}

const DRAWERS: DrawerDef[] = [
  { id: 'shelf-frontend', label: 'Frontend & UI', shortLabel: 'Frontend', emoji: '🎀', iconName: 'skill-frontend', col: 0, row: 0, cardCount: 8 },
  { id: 'shelf-backend', label: 'Backend & APIs', shortLabel: 'Backend', emoji: '🧁', iconName: 'skill-backend', col: 1, row: 0, cardCount: 9 },
  { id: 'shelf-ai', label: 'AI & Data', shortLabel: 'AI & Data', emoji: '🪄', iconName: 'skill-ai', col: 0, row: 1, cardCount: 6 },
  { id: 'shelf-tools', label: 'Tools & DevOps', shortLabel: 'Tools', emoji: '🧰', iconName: 'skill-tools', col: 1, row: 1, cardCount: 6 },
  { id: 'currently-learning', label: 'Currently Learning', shortLabel: 'Learning', emoji: '🌱', iconName: 'heart', col: 0, row: 2, cardCount: currentlyLearning.length },
  { id: 'core-stack', label: 'Core Highlights', shortLabel: 'Highlights', emoji: '⭐', iconName: 'sparkle', col: 1, row: 2, cardCount: 7 },
];

export default function LibraryCardCatalog() {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [hoveredDrawer, setHoveredDrawer] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const openDrawer = (drawerId: string) => {
    soundscape.playClickSound();
    setActiveDrawer(drawerId);
    setSelectedCard(null);
  };

  const closeDrawer = () => {
    soundscape.playClickSound();
    setActiveDrawer(null);
    setSelectedCard(null);
  };

  const currentDrawerDef = DRAWERS.find((d) => d.id === activeDrawer) ?? DRAWERS[0];

  // Build cards for current active drawer
  const getCardsForDrawer = (drawerId: string): SkillCard[] => {
    if (drawerId === 'currently-learning') {
      return currentlyLearning.map((item, idx) => ({
        title: item,
        category: 'In Progress',
        categoryKey: 'learning',
        catalogCode: `LRN-0${idx + 1}`,
        note: 'Active research exploration and experimental implementations in personal lab.',
        status: 'Active',
      }));
    }

    if (drawerId === 'core-stack') {
      const coreTitles = ['TypeScript', 'Next.js', 'React.js', 'FastAPI', 'PostgreSQL', 'Gemini API', 'Docker'];
      return coreTitles.map((title, idx) => {
        const detail = SKILL_DETAILS[title] ?? { note: 'Core stack technology.', status: 'Daily Driver' };
        return {
          title,
          category: 'Core Stack',
          categoryKey: 'core',
          catalogCode: `STAR-0${idx + 1}`,
          note: detail.note,
          status: detail.status,
        };
      });
    }

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
        categoryKey: shelf.name,
        catalogCode: `${prefix}-${(idx + 1).toString().padStart(2, '0')}`,
        note: detail.note,
        status: detail.status,
      };
    });
  };

  const cards = activeDrawer ? getCardsForDrawer(activeDrawer) : [];

  return (
    <>
      {/* 1. Freestanding Card Catalog Cabinet on Left Wall */}
      <div
        style={{
          left: '5.2%',
          bottom: '20.0%',
          width: '21.0%',
          aspectRatio: '1199 / 1312',
        }}
        className="pointer-events-auto absolute z-20 select-none group"
      >
        {/* The Illustrated Cabinet Art */}
        <AssetImage
          src="/assets/objects/card-catalog.png"
          alt="Vintage wooden library card catalog cabinet"
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_16px_rgba(20,10,15,0.45)]"
        />

        {/* 6 Clickable Hotspot Zones for Each Drawer */}
        {DRAWERS.map((drawer) => {
          // Bounding box percentages inside the card-catalog.png image
          const leftPct = drawer.col === 0 ? 17 : 51;
          const topPct = 27 + drawer.row * 19;
          const widthPct = 32;
          const heightPct = 17.5;
          const isHovered = hoveredDrawer === drawer.id;

          return (
            <button
              key={drawer.id}
              type="button"
              onClick={() => openDrawer(drawer.id)}
              onMouseEnter={() => setHoveredDrawer(drawer.id)}
              onMouseLeave={() => setHoveredDrawer(null)}
              aria-label={`Open ${drawer.label} drawer`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                height: `${heightPct}%`,
              }}
              className="absolute rounded cursor-pointer transition-all duration-200 hover:bg-[#FFE8B3]/25 active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 group/drawer"
            >
              {/* Subtle Warm Brass Glow on Hover */}
              <div
                className={`absolute inset-0 rounded transition-opacity duration-200 pointer-events-none ${
                  isHovered ? 'opacity-100 shadow-[inset_0_0_12px_rgba(255,215,100,0.45)]' : 'opacity-0'
                }`}
              />
            </button>
          );
        })}

        {/* Cozy Floating Callout Pill */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap rounded-full border border-pink-300/80 bg-[#FFF5F8]/95 px-2.5 py-0.5 shadow-[0_3px_10px_rgba(214,70,118,0.25)] backdrop-blur-md flex items-center gap-1.5"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF4D88] animate-pulse" />
          <span className="font-hand text-[10px] sm:text-xs font-bold text-ink">
            {hoveredDrawer
              ? DRAWERS.find((d) => d.id === hoveredDrawer)?.label
              : 'Pull a drawer to view skills 🗄️'}
          </span>
        </motion.div>
      </div>

      {/* 2. Interactive Card Catalog Drawer Modal */}
      <AnimatePresence>
        {activeDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs select-none">
            {/* Backdrop click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="absolute inset-0 cursor-pointer"
            />

            {/* Wooden Drawer Cabinet Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-2xl rounded-2xl sm:rounded-3xl border-4 border-[#7A4B29] bg-[#EFE3CF] shadow-[0_20px_50px_rgba(20,10,5,0.6)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Antique Brass Header Bar */}
              <div className="relative flex items-center justify-between px-4 sm:px-6 py-3 bg-[#4A2A1A] border-b-2 border-[#7A4B29] text-[#FFF5E6]">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B3D23] border border-[#8C5232] shadow-inner">
                    <CozyIcon name={currentDrawerDef.iconName} fallback={currentDrawerDef.emoji} size={20} />
                  </div>
                  <div>
                    <h2 id="drawer-title" className="font-display text-lg sm:text-2xl font-bold tracking-tight text-[#FFE8C2]">
                      {currentDrawerDef.label}
                    </h2>
                    <p className="font-mono text-[10px] sm:text-xs text-[#E8C2A0]">
                      CARD CATALOGUE · {cards.length} INDEX CARDS
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close drawer"
                  className="rounded-full p-1.5 text-[#E8C2A0] hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Quick-Switch Tabs (Top Manila Tabs) */}
              <div className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-6 pt-2.5 bg-[#DFCEB3] border-b border-[#C8B395] overflow-x-auto no-scrollbar">
                {DRAWERS.map((d) => {
                  const isActive = d.id === activeDrawer;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => openDrawer(d.id)}
                      className={`relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-t-lg font-hand text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
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

              {/* Cards Tray Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#EFE3CF] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {cards.map((card, idx) => {
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
                        {/* Vintage Manila Card Header */}
                        <div className="flex items-center justify-between border-b border-[#DAC8AD]/60 pb-1.5 mb-2">
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

                        {/* Technology Title */}
                        <h3 className="font-display text-base sm:text-lg font-bold text-[#3B2212] group-hover:text-[#B84D6A] transition-colors flex items-center gap-1.5">
                          <span>{card.title}</span>
                        </h3>

                        {/* Cozy Note */}
                        <p className="mt-1 font-hand text-xs sm:text-sm text-[#5C402B] leading-relaxed">
                          {card.note}
                        </p>

                        {/* Red Vintage Stamp in corner */}
                        <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#A6886D] font-mono">
                          <span>SECTION: {card.category}</span>
                          <span className="text-[#C24B5E] font-bold opacity-80 uppercase tracking-tighter text-[9px]">
                            ✓ VERIFIED
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Bar with Scroll Link */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#DFCEB3] border-t border-[#C8B395]">
                <span className="font-hand text-xs sm:text-sm text-[#69482F] font-bold">
                  Tip: Click cards to focus or check details below!
                </span>

                <a
                  href={`#${currentDrawerDef.id}`}
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#5A341B] hover:bg-[#724223] active:scale-95 px-3.5 py-1.5 font-hand text-xs sm:text-sm font-bold text-[#FFF5E6] shadow-sm transition-all"
                >
                  <span>View shelf details</span>
                  <span>↓</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
