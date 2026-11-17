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
    }
    return () => {
      document.body.classList.remove('book-modal-open');
    };
  }, [isOpen]);

  // Keyboard shortcut: close with Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen]
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
                  {/* left: 12.0% (clears pink ribbon at 4-8%)                   */}
                  {/* right: 53.5% (stops cleanly before center spine at 50%)    */}
                  {/* top: 16.0% (clears washi tape & golden corner)             */}
                  {/* bottom: 16.0% (clears bottom curve & corner)               */}
                  {/* ========================================================== */}
                  <div
                    className="absolute z-20 flex flex-col justify-between text-[#3D2517] select-text"
                    style={{
                      left: '12.0%',
                      right: '53.5%',
                      top: '16.0%',
                      bottom: '16.0%',
                    }}
                  >
                    {/* Top Bar: Switcher Pills between the 2 Deep Dives */}
                    <div className="shrink-0">
                      <div className="flex items-center justify-between gap-1 pb-1 border-b border-[#D8C7B0]/80">
                        <div className="flex items-center gap-1">
                          {technicalBlogs.map((b, idx) => (
                            <button
                              key={b.slug}
                              type="button"
                              onClick={() => {
                                soundscape.playClickSound();
                                setSelectedBlogIndex(idx);
                              }}
                              className={`px-2 py-0.5 rounded-full text-[9px] lg:text-[10px] font-sans font-bold transition-all whitespace-nowrap cursor-pointer ${
                                idx === selectedBlogIndex
                                  ? 'bg-[#E8507D] text-white shadow-xs'
                                  : 'bg-[#EFE5D7] text-[#6E4E36] hover:bg-[#E5D7C5]'
                              }`}
                            >
                              {b.category}
                            </button>
                          ))}
                        </div>
                        <span className="text-[9px] font-mono text-[#8C6D54] font-semibold shrink-0">
                          {activeBlog.date} • {activeBlog.readTime}
                        </span>
                      </div>

                      {/* Article Title & Subtitle */}
                      <div className="mt-1.5">
                        <span className="inline-block px-1.5 py-0.2 rounded-md bg-[#F4E8D8] border border-[#DECFBE] text-[8px] font-mono font-bold text-amber-900 uppercase">
                          {activeBlog.badge}
                        </span>
                        <h2 className="mt-0.5 font-display text-sm lg:text-base font-extrabold text-[#2F1A0F] leading-snug">
                          {activeBlog.title}
                        </h2>
                        <p className="mt-0.5 font-hand text-[11px] text-[#7D5A42] leading-tight">
                          {activeBlog.subtitle}
                        </p>
                      </div>

                      {/* Summary Callout Box */}
                      <div className="mt-1.5 p-2 rounded-lg bg-[#FAF4EB]/90 border border-[#E8DAC9] text-[10px] leading-relaxed text-[#4A3223]">
                        <strong className="block text-[8.5px] uppercase font-mono text-rose-600 font-bold mb-0.5">
                          Architectural Thesis
                        </strong>
                        {activeBlog.summary}
                      </div>
                    </div>

                    {/* Left Page Scrollable Content: Problem Breakdown + Architecture Diagram + Invariants */}
                    <div className="my-1 overflow-y-auto pr-1 text-[10.5px] leading-relaxed text-[#4A3223] space-y-2 cozy-scrollbar flex-1">
                      {/* 1. Problem Statement */}
                      <div className="space-y-1">
                        <h3 className="font-sans font-bold text-[11px] text-[#2A160C]">
                          The Engineering Challenge
                        </h3>
                        {activeBlog.leftPage.problemStatement.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>

                      {/* 2. System Architecture Flow Diagram */}
                      <div className="rounded-lg bg-[#241B15] border border-[#443328] p-2 text-[#FFE8B2] shadow-xs">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#3B2C23] text-[8px] font-mono text-[#C4AC99]">
                          <span className="font-bold text-amber-300">
                            📊 {activeBlog.leftPage.diagram.title}
                          </span>
                          <span className="text-[7.5px] text-[#A69080]">Architecture Map</span>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre font-mono text-[7.5px] lg:text-[8px] leading-tight select-text py-0.5 scrollbar-none text-[#FDF4DF]">
                          <code>{activeBlog.leftPage.diagram.ascii}</code>
                        </pre>
                        <p className="mt-1 text-[7.5px] font-sans text-[#B09985] italic">
                          {activeBlog.leftPage.diagram.caption}
                        </p>
                      </div>

                      {/* 3. Core System Invariants */}
                      <div className="space-y-1">
                        <h3 className="font-sans font-bold text-[11px] text-[#2A160C]">
                          Core Mathematical & System Invariants
                        </h3>
                        <div className="space-y-1">
                          {activeBlog.leftPage.coreInvariants.map((inv, idx) => (
                            <div
                              key={idx}
                              className="p-1.5 rounded-md bg-[#F5EBE0] border-l-2 border-rose-500 text-[10px]"
                            >
                              <span className="font-bold font-mono text-[#4A2411]">
                                #{idx + 1} {inv.title}:
                              </span>{' '}
                              <span className="text-[#593922]">{inv.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Left Page Footer Indicator */}
                    <div className="pt-1 border-t border-[#D8C7B0]/80 flex items-center justify-between text-[9px] font-mono text-[#8C6D54] shrink-0">
                      <span>Deep Dive 1 of 2</span>
                      <span>Turn right for implementation & code ➔</span>
                    </div>
                  </div>

                  {/* ========================================================== */}
                  {/* RIGHT PAGE: STRICT SAFE WRITING ZONE                       */}
                  {/* left: 53.5% (starts cleanly after center spine at 50%)     */}
                  {/* right: 12.0% (clears right golden corner at 88-100%)       */}
                  {/* top: 16.0% (clears floral branch sticker & golden corner)  */}
                  {/* bottom: 16.0% (clears bottom curve & corner)               */}
                  {/* ========================================================== */}
                  <div
                    className="absolute z-20 flex flex-col justify-between text-[#3D2517] select-text"
                    style={{
                      left: '53.5%',
                      right: '12.0%',
                      top: '16.0%',
                      bottom: '16.0%',
                    }}
                  >
                    {/* Top Header of Right Page */}
                    <div className="flex items-center justify-between pb-1 border-b border-[#D8C7B0]/80 shrink-0">
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

                    {/* Right Page Scrollable Content: Deep Dives + Code Snippets + Benchmarks */}
                    <div className="my-1 overflow-y-auto pr-1 text-[10.5px] leading-relaxed text-[#4A3223] space-y-2 cozy-scrollbar flex-1">
                      {/* Implementation Sections */}
                      {activeBlog.rightPage.implementationSections.map((sec, secIdx) => (
                        <div key={secIdx} className="space-y-1">
                          <h3 className="font-sans font-bold text-[11px] text-[#2A160C]">
                            {sec.heading}
                          </h3>
                          {sec.paragraphs.map((p, pIdx) => (
                            <p key={pIdx}>{p}</p>
                          ))}

                          {/* Code Snippet Box */}
                          {sec.codeSnippet && (
                            <div className="my-1 rounded-md bg-[#231A14] text-[#FDF6E2] p-2 border border-[#48372B] font-mono text-[9px] relative group/code shadow-xs">
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
                                  className="px-1.5 py-0.5 rounded bg-[#3B2C23] hover:bg-[#523E32] text-white transition-colors cursor-pointer text-[7.5px]"
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
                              className={`p-1.5 rounded-md border-l-2 text-[10px] ${
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
                      <div className="space-y-1 pt-1 border-t border-[#E0D2C0]">
                        <h3 className="font-sans font-bold text-[11px] text-[#2A160C]">
                          Production Benchmarks & Verification
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                          {activeBlog.rightPage.benchmarksAndTradeoffs.map((item, bIdx) => (
                            <div
                              key={bIdx}
                              className="p-1.5 rounded-md bg-[#FDF9F2] border border-[#DECFBE] text-center"
                            >
                              <span className="block text-[8px] font-mono text-[#8C6D54] uppercase">
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

                    {/* Bottom Controls: Previous / Next Article */}
                    <div className="pt-1 border-t border-[#D8C7B0]/80 flex items-center justify-between text-[10.5px] font-hand font-bold shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          soundscape.playClickSound();
                          setSelectedBlogIndex((prev) => (prev === 0 ? 1 : 0));
                        }}
                        className="px-2.5 py-0.5 rounded-lg bg-[#EAE0D1] hover:bg-[#E0D2C0] text-[#4A301D] transition-colors cursor-pointer"
                      >
                        {selectedBlogIndex === 0 ? '← Next: Socket Server' : '← Prev: Syntactiq'}
                      </button>
                      <span className="font-mono text-[8.5px] text-[#8C6D54]">
                        Deep Dive {selectedBlogIndex + 1} of 2
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          soundscape.playClickSound();
                          setSelectedBlogIndex((prev) => (prev === 0 ? 1 : 0));
                        }}
                        className="px-3 py-0.5 rounded-lg bg-[#E8507D] hover:bg-[#D43D69] text-white transition-colors cursor-pointer shadow-2xs"
                      >
                        {selectedBlogIndex === 0 ? 'Read: Socket Server →' : 'Read: Syntactiq →'}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* ============================================================ */}
                {/* MOBILE SCREEN: SINGLE-PAGE VIEW USING bedroom-diary-mobile   */}
                {/* ============================================================ */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 12 }}
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

                  {/* Mobile Reading Surface: Bounds inside cream parchment safe-zone */}
                  <div className="absolute inset-x-[11%] top-[9%] bottom-[12%] z-20 flex flex-col justify-between text-[#3D2517] select-text">
                    {/* Top Bar with Category Selector */}
                    <div>
                      <div className="flex items-center justify-between pb-1 border-b border-[#D8C7B0]/80">
                        <span className="font-hand text-sm font-bold text-rose-600">
                          Engineering Deep Dive
                        </span>
                        <span className="font-mono text-[9px] text-[#8C6D54]">
                          {selectedBlogIndex + 1} of 2
                        </span>
                      </div>

                      {/* 2 Category Switcher Pills */}
                      <div className="mt-1 flex gap-1">
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
                                : 'bg-[#EFE5D7] text-[#6E4E36]'
                            }`}
                          >
                            {b.category}
                          </button>
                        ))}
                      </div>

                      {/* Header Title */}
                      <div className="mt-1.5">
                        <h2 className="font-display text-xs xs:text-sm font-extrabold text-[#2F1A0F] leading-tight">
                          {activeBlog.title}
                        </h2>
                        <div className="mt-0.5 flex items-center gap-2 text-[8.5px] font-mono text-[#8C6B52]">
                          <span>📅 {activeBlog.date}</span>
                          <span>⏱️ {activeBlog.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Mobile Article Body */}
                    <div className="my-1.5 overflow-y-auto pr-1 text-[10px] xs:text-[10.5px] leading-relaxed text-[#4A3223] space-y-2 cozy-scrollbar flex-1">
                      {/* Overview */}
                      <div className="p-1.5 rounded-md bg-[#FAF4EB] border border-[#E8DAC9] text-[9.5px]">
                        <strong className="block font-mono text-rose-600 font-bold mb-0.5 uppercase">
                          Thesis
                        </strong>
                        {activeBlog.summary}
                      </div>

                      {/* Problem Statement */}
                      <div className="space-y-1">
                        <h3 className="font-sans font-bold text-[10.5px] text-[#2A160C]">
                          The Engineering Challenge
                        </h3>
                        {activeBlog.leftPage.problemStatement.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>

                      {/* Architecture Diagram */}
                      <div className="rounded-lg bg-[#241B15] border border-[#443328] p-1.5 text-[#FFE8B2] shadow-xs">
                        <span className="block text-[7.5px] font-mono font-bold text-amber-300 mb-1">
                          📊 {activeBlog.leftPage.diagram.title}
                        </span>
                        <pre className="overflow-x-auto whitespace-pre font-mono text-[7px] leading-tight select-text py-0.5 scrollbar-none text-[#FDF4DF]">
                          <code>{activeBlog.leftPage.diagram.ascii}</code>
                        </pre>
                      </div>

                      {/* Invariants */}
                      <div className="space-y-1">
                        <h3 className="font-sans font-bold text-[10.5px] text-[#2A160C]">
                          Core Invariants
                        </h3>
                        {activeBlog.leftPage.coreInvariants.map((inv, idx) => (
                          <div
                            key={idx}
                            className="p-1 rounded bg-[#F5EBE0] border-l-2 border-rose-500 text-[9px]"
                          >
                            <span className="font-bold">{inv.title}:</span> {inv.description}
                          </div>
                        ))}
                      </div>

                      {/* Implementation & Code */}
                      {activeBlog.rightPage.implementationSections.map((sec, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          <h3 className="font-sans font-bold text-[10.5px] text-[#2A160C]">
                            {sec.heading}
                          </h3>
                          {sec.paragraphs.map((p, pIdx) => (
                            <p key={pIdx}>{p}</p>
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
                                  className="px-1 py-0.2 rounded bg-[#3B2C23] text-white"
                                >
                                  {isCopied === `mob-${activeBlog.slug}-${sIdx}`
                                    ? '✓ Copied'
                                    : 'Copy'}
                                </button>
                              </div>
                              <pre className="overflow-x-auto whitespace-pre font-mono leading-relaxed select-text py-0.5 scrollbar-none">
                                <code>{sec.codeSnippet.code}</code>
                              </pre>
                            </div>
                          )}

                          {sec.callout && (
                            <div className="p-1 rounded bg-amber-50 border-l-2 border-amber-500 text-[9px] text-[#553C18]">
                              <span className="font-bold">{sec.callout.title}:</span>{' '}
                              {sec.callout.text}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Benchmarks */}
                      <div className="space-y-1 pt-1 border-t border-[#DECFBE]">
                        <h3 className="font-sans font-bold text-[10.5px] text-[#2A160C]">
                          Benchmarks
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

                    {/* Bottom Navigation */}
                    <div className="pt-1 border-t border-[#D8C7B0]/80 flex items-center justify-between text-[10px] font-hand font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          soundscape.playClickSound();
                          setSelectedBlogIndex((prev) => (prev === 0 ? 1 : 0));
                        }}
                        className="px-2 py-0.5 rounded bg-[#EAE0D1] text-[#4A301D]"
                      >
                        {selectedBlogIndex === 0 ? '← Next Deep Dive' : '← Prev Deep Dive'}
                      </button>
                      <span className="font-mono text-[8.5px] text-[#8C6D54]">
                        Sheet {selectedBlogIndex + 1} of 2
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          soundscape.playClickSound();
                          setSelectedBlogIndex((prev) => (prev === 0 ? 1 : 0));
                        }}
                        className="px-2.5 py-0.5 rounded bg-[#E8507D] text-white"
                      >
                        {selectedBlogIndex === 0 ? 'Next Deep Dive →' : 'First Deep Dive →'}
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
