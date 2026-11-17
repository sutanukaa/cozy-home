'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import CozyBubbleButton from '@/components/ui/CozyBubbleButton';
import { technicalBlogs, type TechnicalBlog } from '@/data/technicalBlogs';
import { soundscape } from '@/lib/soundEngine';

export default function LibraryTechnicalBook() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedBlogIndex, setSelectedBlogIndex] = useState(0);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeBlog: TechnicalBlog = technicalBlogs[selectedBlogIndex] ?? technicalBlogs[0];

  useEffect(() => {
    setMounted(true);
    return () => {
      document.body.classList.remove('book-modal-open');
    };
  }, []);

  // When book is open, hide navbar, sound toggle & room heading
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('book-modal-open');
    } else {
      document.body.classList.remove('book-modal-open');
      setIsMenuOpen(false);
    }
    return () => {
      document.body.classList.remove('book-modal-open');
    };
  }, [isOpen]);

  // Keyboard shortcut: close with Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMenuOpen) {
          setIsMenuOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    },
    [isOpen, isMenuOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleOpen = () => {
    if (isOpen) return;
    soundscape.playSparkleSound();
    setIsOpen(true);
  };

  const handleClose = () => {
    soundscape.playClickSound();
    setIsOpen(false);
    setIsMenuOpen(false);
  };

  const handleCopyCode = (code: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setIsCopied(id);
      setTimeout(() => setIsCopied(null), 2000);
    }
  };

  return (
    <>
      {/* 1. CLOSED BOOK RESTING ON THE COUCH CUSHION */}
      {!isOpen && (
        <div
          className="group absolute z-20 cursor-pointer select-none touch-manipulation"
          style={{
            left: '78.5%',
            top: '72.0%',
            width: '9.8%',
            maxWidth: '115px',
            minWidth: '55px',
            aspectRatio: '1535 / 1024',
            transform: 'translate(-50%, -50%) rotate(-4deg)',
          }}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpen();
            }
          }}
          aria-label="Open Technical Field Notes Book on the couch"
        >
          {/* Subtle warm ambient drop shadow on the armchair cushion */}
          <div className="absolute inset-0 translate-y-1.5 rounded-xl bg-purple-950/30 blur-md pointer-events-none transition-all duration-300 group-hover:blur-lg group-hover:translate-y-2.5" />

          {/* Book Image */}
          <div className="relative h-full w-full transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1">
            <Image
              src="/assets/objects/library-book-closed.png"
              alt="Hardcover technical book resting on the couch"
              fill
              sizes="120px"
              className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
              priority
            />
          </div>

          {/* Standardized Pulsing Pink Bubble Button centered on the book */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <CozyBubbleButton
              size="md"
              label="Read Technical Blogs"
              icon={
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <path d="M8 7h8M8 11h6" />
                </svg>
              }
            />
          </div>
        </div>
      )}

      {/* 2. FULLSCREEN OPEN BOOK MODAL (Portaled to document.body, navbar hidden) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 select-none">
                {/* Backdrop covering entire screen */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  onClick={handleClose}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  aria-hidden="true"
                />

                {/* ============================================================ */}
                {/* DESKTOP & TABLET: 16:9 TWO-PAGE SPREAD VIEW (md and up)     */}
                {/* Both pages have FULL-HEIGHT smooth scrollable containers     */}
                {/* ============================================================ */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.82, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.86, y: 12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden md:flex relative z-10 w-full max-w-5xl aspect-[1672/941] max-h-[90vh] items-center justify-center select-none"
                >
                  {/* Background Open Book Image */}
                  <div className="absolute inset-0 pointer-events-none select-none">
                    <Image
                      src="/assets/objects/library-book-open.png"
                      alt="Open technical book spread"
                      fill
                      sizes="(max-width: 1200px) 95vw, 1150px"
                      className="object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
                      priority
                    />
                  </div>

                  {/* Close Button: Glossy Pink Bubble in Top Right Corner */}
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close Technical Book"
                    className="group absolute -top-3.5 right-0 sm:-top-2 sm:right-2 md:top-1 md:right-3 z-40 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-cozy backdrop-blur-xs transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1 left-1.5 h-2 w-3 rounded-full bg-white/50 blur-[0.3px] -rotate-12"
                    />
                    <svg
                      className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>

                  {/* ========================================================== */}
                  {/* LEFT PAGE: STRICT SAFE WRITING ZONE                        */}
                  {/* left: 12.0%, right: 53.5%, top: 15.5%, bottom: 15.5%       */}
                  {/* FULL-HEIGHT SCROLLABLE FROM TITLE TO INVARIANTS            */}
                  {/* ========================================================== */}
                  <div
                    className="absolute z-20 text-[#3D2517] select-text"
                    style={{
                      left: '12.0%',
                      right: '53.5%',
                      top: '15.5%',
                      bottom: '15.5%',
                    }}
                  >
                    {/* Slim Fixed Top Bar: Category Switcher Pills */}
                    <div className="absolute inset-x-0 top-0 h-[28px] flex items-center justify-between border-b border-[#D8C7B0]/80 pb-1 select-none">
                      <div className="flex items-center gap-1">
                        {technicalBlogs.map((b, idx) => (
                          <button
                            key={b.slug}
                            type="button"
                            onClick={() => {
                              soundscape.playClickSound();
                              setSelectedBlogIndex(idx);
                            }}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold transition-all whitespace-nowrap cursor-pointer ${
                              idx === selectedBlogIndex
                                ? 'bg-[#E8507D] text-white shadow-xs'
                                : 'bg-[#EFE5D7] text-[#6E4E36] hover:bg-[#E5D7C5]'
                            }`}
                          >
                            {b.category}
                          </button>
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-[#8C6D54] font-semibold">
                        {activeBlog.date} • {activeBlog.readTime}
                      </span>
                    </div>

                    {/* FULLY SCROLLABLE LEFT PAGE CONTENT (From below the slim top bar down to the bottom) */}
                    <div className="absolute inset-x-0 top-[32px] bottom-0 overflow-y-auto pr-2 space-y-3 cozy-scrollbar">
                      {/* Title, Subtitle & Badge */}
                      <div>
                        <span className="inline-block px-1.5 py-0.2 rounded-md bg-[#F4E8D8] border border-[#DECFBE] text-[8px] font-mono font-bold text-amber-900 uppercase">
                          {activeBlog.badge}
                        </span>
                        <h2 className="mt-1 font-display text-base lg:text-lg font-extrabold text-[#2F1A0F] leading-snug">
                          {activeBlog.title}
                        </h2>
                        <p className="mt-0.5 font-hand text-xs text-[#7D5A42] leading-tight">
                          {activeBlog.subtitle}
                        </p>
                      </div>

                      {/* Thesis Card */}
                      <div className="p-2.5 rounded-lg bg-[#FAF4EB]/95 border border-[#E8DAC9] text-[10.5px] leading-relaxed text-[#4A3223] shadow-2xs">
                        <strong className="block text-[8.5px] uppercase font-mono text-rose-600 font-bold mb-0.5">
                          Architectural Thesis
                        </strong>
                        {activeBlog.summary}
                      </div>

                      {/* Problem Statement */}
                      <div className="space-y-1.5">
                        <h3 className="font-sans font-bold text-xs text-[#2A160C] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>The Engineering Challenge</span>
                        </h3>
                        {activeBlog.leftPage.problemStatement.map((p, idx) => (
                          <p key={idx} className="text-[10.5px] leading-relaxed">{p}</p>
                        ))}
                      </div>

                      {/* Architecture Flow Diagram */}
                      <div className="rounded-lg bg-[#241B15] border border-[#443328] p-2.5 text-[#FFE8B2] shadow-xs">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#3B2C23] text-[8.5px] font-mono text-[#C4AC99]">
                          <span className="font-bold text-amber-300">
                            📊 {activeBlog.leftPage.diagram.title}
                          </span>
                          <span className="text-[7.5px] text-[#A69080]">Architecture Flow</span>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre font-mono text-[8px] leading-tight select-text py-1 scrollbar-none text-[#FDF4DF]">
                          <code>{activeBlog.leftPage.diagram.ascii}</code>
                        </pre>
                        <p className="mt-1 text-[8px] font-sans text-[#B09985] italic">
                          {activeBlog.leftPage.diagram.caption}
                        </p>
                      </div>

                      {/* Core System Invariants */}
                      <div className="space-y-1.5">
                        <h3 className="font-sans font-bold text-xs text-[#2A160C] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          <span>Core Mathematical & System Invariants</span>
                        </h3>
                        <div className="space-y-1.5">
                          {activeBlog.leftPage.coreInvariants.map((inv, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-md bg-[#F5EBE0] border-l-3 border-rose-500 text-[10px]"
                            >
                              <span className="font-bold font-mono text-[#4A2411]">
                                #{idx + 1} {inv.title}:
                              </span>{' '}
                              <span className="text-[#593922]">{inv.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Transition Note */}
                      <div className="pt-2 pb-1 border-t border-[#D8C7B0]/60 flex items-center justify-between text-[9.5px] font-mono text-[#8C6D54]">
                        <span>Deep Dive Part 1 of 2</span>
                        <span>Turn right for implementation & code ➔</span>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================== */}
                  {/* RIGHT PAGE: STRICT SAFE WRITING ZONE                       */}
                  {/* left: 53.5%, right: 12.0%, top: 15.5%, bottom: 15.5%       */}
                  {/* FULL-HEIGHT SCROLLABLE FROM CODE TO BENCHMARKS             */}
                  {/* ========================================================== */}
                  <div
                    className="absolute z-20 text-[#3D2517] select-text"
                    style={{
                      left: '53.5%',
                      right: '12.0%',
                      top: '15.5%',
                      bottom: '15.5%',
                    }}
                  >
                    {/* Slim Fixed Top Bar: Tags & Indicator */}
                    <div className="absolute inset-x-0 top-0 h-[28px] flex items-center justify-between border-b border-[#D8C7B0]/80 pb-1 select-none">
                      <span className="font-hand text-sm font-bold text-[#6D4C35]">
                        Implementation Mechanics & Benchmarks
                      </span>
                      <div className="flex items-center gap-1">
                        {activeBlog.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.2 rounded-md bg-[#EDE2D2] text-[8px] font-mono text-[#5C3E28]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* FULLY SCROLLABLE RIGHT PAGE CONTENT (From below top bar to above bottom controls) */}
                    <div className="absolute inset-x-0 top-[32px] bottom-[38px] overflow-y-auto pr-2 space-y-3 cozy-scrollbar">
                      {/* Implementation Sections */}
                      {activeBlog.rightPage.implementationSections.map((sec, secIdx) => (
                        <div key={secIdx} className="space-y-1.5">
                          <h3 className="font-sans font-bold text-xs text-[#2A160C] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>{sec.heading}</span>
                          </h3>
                          {sec.paragraphs.map((p, pIdx) => (
                            <p key={pIdx} className="text-[10.5px] leading-relaxed">{p}</p>
                          ))}

                          {/* Code Snippet Box */}
                          {sec.codeSnippet && (
                            <div className="my-1.5 rounded-lg bg-[#231A14] text-[#FDF6E2] p-2.5 border border-[#48372B] font-mono text-[9px] relative group/code shadow-xs">
                              <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#3B2C23] text-[8px] text-[#A69080]">
                                <span className="font-bold text-amber-200/90">
                                  {sec.codeSnippet.caption ?? 'Implementation'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyCode(
                                      sec.codeSnippet!.code,
                                      `${activeBlog.slug}-${secIdx}`
                                    )
                                  }
                                  className="px-2 py-0.5 rounded bg-[#3B2C23] hover:bg-[#523E32] text-white transition-colors cursor-pointer text-[7.5px]"
                                >
                                  {isCopied === `${activeBlog.slug}-${secIdx}`
                                    ? '✓ Copied'
                                    : 'Copy code'}
                                </button>
                              </div>
                              <pre className="overflow-x-auto whitespace-pre font-mono leading-relaxed select-text py-0.5 scrollbar-none text-[#FDF6E2]">
                                <code>{sec.codeSnippet.code}</code>
                              </pre>
                            </div>
                          )}

                          {sec.callout && (
                            <div
                              className={`p-2 rounded-md border-l-3 text-[10px] ${
                                sec.callout.type === 'warning'
                                  ? 'bg-rose-50 border-rose-500 text-rose-900'
                                  : 'bg-amber-50 border-amber-500 text-[#553C18]'
                              }`}
                            >
                              <span className="font-bold font-mono">
                                {sec.callout.title}:
                              </span>{' '}
                              {sec.callout.text}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Production Benchmarks & Trade-Offs Matrix */}
                      <div className="space-y-1.5 pt-2 border-t border-[#E0D2C0]">
                        <h3 className="font-sans font-bold text-xs text-[#2A160C] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Production Benchmarks & Verification</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                          {activeBlog.rightPage.benchmarksAndTradeoffs.map((item, bIdx) => (
                            <div
                              key={bIdx}
                              className="p-2 rounded-md bg-[#FDF9F2] border border-[#DECFBE] text-center shadow-2xs"
                            >
                              <span className="block text-[8px] font-mono text-[#8C6D54] uppercase font-bold">
                                {item.metric}
                              </span>
                              <span className="block text-xs font-bold font-mono text-rose-600 mt-0.5">
                                {item.value}
                              </span>
                              <span className="block text-[8px] text-[#5C3E28] leading-tight mt-0.5">
                                {item.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Fixed Bottom Navigation Controls */}
                    <div className="absolute inset-x-0 bottom-0 h-[34px] border-t border-[#D8C7B0]/90 pt-1 flex items-center justify-between text-[10.5px] font-hand font-bold select-none">
                      <button
                        type="button"
                        onClick={() => {
                          soundscape.playClickSound();
                          setSelectedBlogIndex((prev) => (prev === 0 ? 1 : 0));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#EAE0D1] hover:bg-[#E0D2C0] active:scale-95 text-[#4A301D] transition-all cursor-pointer shadow-2xs touch-manipulation"
                      >
                        {selectedBlogIndex === 0 ? '← Next: Socket Server' : '← Prev: Syntactiq'}
                      </button>
                      <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-[#6D4C33]">
                        <span>Deep Dive</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-[#F0E6D8] border border-[#D8C7B0] text-[#3B2212]">
                          {selectedBlogIndex + 1}
                        </span>
                        <span>of 2</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          soundscape.playClickSound();
                          setSelectedBlogIndex((prev) => (prev === 0 ? 1 : 0));
                        }}
                        className="px-3 py-1 rounded-lg bg-rose hover:bg-rose-600 active:scale-95 text-white transition-all cursor-pointer shadow-cozy touch-manipulation"
                      >
                        {selectedBlogIndex === 0 ? 'Read: Socket Server →' : 'Read: Syntactiq →'}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* ============================================================ */}
                {/* MOBILE SCREEN: SINGLE-PAGE VIEW USING bedroom-diary-mobile   */}
                {/* Fixed Header, Full Scroll Area, and Clean Bottom Controls     */}
                {/* ============================================================ */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.82, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.86, y: 12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex md:hidden relative z-10 w-full max-w-[390px] xs:max-w-[420px] aspect-[1372/1908] max-h-[92vh] items-center justify-center select-none"
                >
                  {/* Background Single-Page Mobile Diary Image */}
                  <div className="absolute inset-0 pointer-events-none select-none">
                    <Image
                      src="/assets/objects/bedroom-diary-mobile.png"
                      alt="Technical field notes page"
                      fill
                      sizes="(max-width: 768px) 94vw, 420px"
                      className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
                      priority
                    />
                  </div>

                  {/* Close Button: Glossy Pink Bubble in Top Right */}
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close Technical Book"
                    className="group absolute -top-2.5 right-0.5 z-40 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-cozy backdrop-blur-xs transition-transform duration-200 active:scale-95 focus:outline-none cursor-pointer"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1 left-1.5 h-2 w-2.5 rounded-full bg-white/50 blur-[0.3px] -rotate-12"
                    />
                    <svg
                      className="h-5 w-5 transition-transform duration-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Mobile Reading Surface Bounded inside cream parchment safe zone */}
                  <div className="absolute left-[10%] right-[12%] top-[8.5%] bottom-[12%] z-20 text-[#3D2517] select-text">
                    {/* ---------------- FIXED TOP HEADER ---------------- */}
                    <div className="absolute inset-x-0 top-0 h-[48px] border-b border-[#D8C7B0]/90 pb-1 flex flex-col justify-between">
                      {/* Row 1: Brand + Hamburger Menu Toggle */}
                      <div className="flex items-center justify-between">
                        <span className="font-hand text-sm font-bold text-rose-600">
                          Technical Notes
                        </span>

                        {/* Hamburger Menu Button */}
                        <button
                          type="button"
                          onClick={() => {
                            soundscape.playClickSound();
                            setIsMenuOpen(!isMenuOpen);
                          }}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9.5px] font-sans font-bold shadow-2xs active:scale-95 transition-all cursor-pointer ${
                            isMenuOpen
                              ? 'bg-rose text-white border-rose'
                              : 'bg-[#EFE5D7] hover:bg-[#E5D7C5] border-[#DECFBE] text-[#4A301D]'
                          }`}
                          aria-label="Toggle technical blog articles menu"
                        >
                          <svg
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                          </svg>
                          <span>Articles</span>
                        </button>
                      </div>

                      {/* Row 2: Category Badge & Read Time */}
                      <div className="flex items-center justify-between text-[8.5px] font-mono text-[#8C6D54]">
                        <span className="font-bold text-amber-800 uppercase">
                          {activeBlog.category}
                        </span>
                        <span>{activeBlog.readTime} • Sheet {selectedBlogIndex + 1}/2</span>
                      </div>
                    </div>

                    {/* ---------------- HAMBURGER MENU DROPDOWN OVERLAY ---------------- */}
                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-x-0 top-[52px] z-50 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D4C0] p-2 shadow-[0_12px_28px_rgba(0,0,0,0.4)] space-y-1.5 text-left select-none"
                        >
                          <div className="flex items-center justify-between pb-1 border-b border-[#E8DAC9] text-[9px] font-mono font-bold text-[#8C6D54] uppercase tracking-wider">
                            <span>Select Engineering Deep Dive</span>
                            <button
                              type="button"
                              onClick={() => setIsMenuOpen(false)}
                              className="text-[#8C6D54] hover:text-black font-bold px-1 text-xs cursor-pointer"
                              aria-label="Close menu"
                            >
                              ✕
                            </button>
                          </div>
                          {technicalBlogs.map((b, idx) => (
                            <button
                              key={b.slug}
                              type="button"
                              onClick={() => {
                                soundscape.playClickSound();
                                setSelectedBlogIndex(idx);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2 cursor-pointer ${
                                idx === selectedBlogIndex
                                  ? 'bg-[#FBE8EF] border border-[#F482A5] shadow-xs'
                                  : 'bg-[#F9F4EB] hover:bg-[#F0E6D8] border border-transparent'
                              }`}
                            >
                              <span className="shrink-0 mt-0.5 text-xs">
                                {idx === 0 ? '🤖' : '⚡'}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-sans font-bold text-[9.5px] text-[#2F1A0F] truncate">
                                    {b.category}
                                  </span>
                                  <span className="font-mono text-[8px] text-[#8C6D54] shrink-0">
                                    {b.readTime}
                                  </span>
                                </div>
                                <p className="font-display text-[10px] font-bold text-[#3D2517] leading-tight line-clamp-2 mt-0.5">
                                  {b.title}
                                </p>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ---------------- MIDDLE FULLY SCROLLABLE ARTICLE BODY ---------------- */}
                    {/* Absolutely positioned between top header and bottom controls so it ALWAYS scrolls smoothly */}
                    <div className="absolute inset-x-0 top-[52px] bottom-[38px] overflow-y-auto px-1 py-1 space-y-2.5 cozy-scrollbar">
                      {/* Article Title & Subtitle */}
                      <div>
                        <h2 className="font-display text-sm font-extrabold text-[#2F1A0F] leading-snug">
                          {activeBlog.title}
                        </h2>
                        <p className="mt-0.5 font-hand text-[11px] text-[#7D5A42] leading-tight">
                          {activeBlog.subtitle}
                        </p>
                      </div>

                      {/* Thesis Summary Card */}
                      <div className="p-2 rounded-lg bg-[#FAF4EB] border border-[#E8DAC9] text-[10px] leading-relaxed">
                        <strong className="block font-mono text-rose-600 font-bold mb-0.5 uppercase text-[8.5px]">
                          Architecture Thesis
                        </strong>
                        {activeBlog.summary}
                      </div>

                      {/* 1. Problem Statement */}
                      <div className="space-y-1">
                        <h3 className="font-sans font-bold text-[11px] text-[#2A160C]">
                          The Engineering Challenge
                        </h3>
                        {activeBlog.leftPage.problemStatement.map((p, idx) => (
                          <p key={idx} className="text-[10px] leading-relaxed">{p}</p>
                        ))}
                      </div>

                      {/* 2. System Flowchart Diagram */}
                      <div className="rounded-lg bg-[#241B15] border border-[#443328] p-1.5 text-[#FFE8B2] shadow-xs">
                        <span className="block text-[8px] font-mono font-bold text-amber-300 mb-0.5">
                          📊 {activeBlog.leftPage.diagram.title}
                        </span>
                        <pre className="overflow-x-auto whitespace-pre font-mono text-[7px] leading-tight select-text py-0.5 scrollbar-none text-[#FDF4DF]">
                          <code>{activeBlog.leftPage.diagram.ascii}</code>
                        </pre>
                        <p className="mt-0.5 text-[7px] text-[#A69080] italic">
                          {activeBlog.leftPage.diagram.caption}
                        </p>
                      </div>

                      {/* 3. Core Invariants */}
                      <div className="space-y-1">
                        <h3 className="font-sans font-bold text-[11px] text-[#2A160C]">
                          Core Invariants
                        </h3>
                        <div className="space-y-1">
                          {activeBlog.leftPage.coreInvariants.map((inv, idx) => (
                            <div
                              key={idx}
                              className="p-1.5 rounded-md bg-[#F5EBE0] border-l-2 border-rose-500 text-[9.5px]"
                            >
                              <span className="font-bold font-mono text-[#4A2411]">
                                #{idx + 1} {inv.title}:
                              </span>{' '}
                              <span className="text-[#593922]">{inv.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Implementation Sections & Code */}
                      {activeBlog.rightPage.implementationSections.map((sec, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          <h3 className="font-sans font-bold text-[10.5px] text-[#2A160C]">
                            {sec.heading}
                          </h3>
                          {sec.paragraphs.map((p, pIdx) => (
                            <p key={pIdx} className="text-[10px] leading-relaxed">{p}</p>
                          ))}

                          {sec.codeSnippet && (
                            <div className="my-1 rounded-md bg-[#231A14] text-[#FDF6E2] p-1.5 border border-[#48372B] font-mono text-[8px]">
                              <div className="flex items-center justify-between pb-0.5 mb-1 border-b border-[#3B2C23] text-[7.5px] text-[#A69080]">
                                <span>{sec.codeSnippet.caption ?? 'Code'}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyCode(
                                      sec.codeSnippet!.code,
                                      `mob-${activeBlog.slug}-${sIdx}`
                                    )
                                  }
                                  className="px-1.5 py-0.5 rounded bg-[#3B2C23] text-white cursor-pointer"
                                >
                                  {isCopied === `mob-${activeBlog.slug}-${sIdx}`
                                    ? '✓ Copied'
                                    : 'Copy'}
                                </button>
                              </div>
                              <pre className="overflow-x-auto whitespace-pre font-mono leading-relaxed select-text py-0.5 scrollbar-none text-[#FDF6E2]">
                                <code>{sec.codeSnippet.code}</code>
                              </pre>
                            </div>
                          )}

                          {sec.callout && (
                            <div className="p-1.5 rounded bg-amber-50 border-l-2 border-amber-500 text-[9.5px] text-[#553C18]">
                              <span className="font-bold">{sec.callout.title}:</span>{' '}
                              {sec.callout.text}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* 5. Benchmarks Matrix */}
                      <div className="space-y-1 pt-1 border-t border-[#DECFBE]">
                        <h3 className="font-sans font-bold text-[11px] text-[#2A160C]">
                          Production Benchmarks
                        </h3>
                        <div className="grid grid-cols-1 gap-1">
                          {activeBlog.rightPage.benchmarksAndTradeoffs.map((item, bIdx) => (
                            <div
                              key={bIdx}
                              className="p-1 rounded bg-[#FDF9F2] border border-[#DECFBE] flex items-center justify-between text-[8.5px]"
                            >
                              <span className="font-mono text-[#8C6D54]">{item.metric}:</span>
                              <span className="font-bold font-mono text-rose-600">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ---------------- FIXED BOTTOM CONTROLS ---------------- */}
                    {/* Fixed single clean row that NEVER wraps or covers content */}
                    <div className="absolute inset-x-0 bottom-0 h-[34px] border-t border-[#D8C7B0]/90 pt-1 flex items-center justify-between select-none">
                      <button
                        type="button"
                        onClick={() => {
                          soundscape.playClickSound();
                          setSelectedBlogIndex((prev) => (prev === 0 ? 1 : 0));
                        }}
                        className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-[#EAE0D1] hover:bg-[#E0D2C0] active:scale-95 text-[#4A301D] font-hand text-[11px] font-bold shadow-2xs transition-all touch-manipulation cursor-pointer"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Prev</span>
                      </button>

                      <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-[#6D4C33]">
                        <span>Sheet</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-[#F0E6D8] border border-[#D8C7B0] text-[#3B2212]">
                          {selectedBlogIndex + 1}
                        </span>
                        <span>of 2</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundscape.playClickSound();
                          setSelectedBlogIndex((prev) => (prev === 0 ? 1 : 0));
                        }}
                        className="inline-flex items-center gap-0.5 px-3 py-1 rounded-lg bg-rose hover:bg-rose-600 active:scale-95 text-white font-hand text-[11px] font-bold shadow-cozy transition-all touch-manipulation cursor-pointer"
                      >
                        <span>Next</span>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
