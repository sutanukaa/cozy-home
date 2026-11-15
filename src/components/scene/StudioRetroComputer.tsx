'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, type Project } from '@/data/projects';
import {
  PixelRobot,
  PixelCode,
  PixelScrapbook,
  PixelFlower,
  PixelNotepad,
  PixelTrash,
} from '@/components/ui/PixelIcons';
import { soundscape } from '@/lib/soundEngine';

interface StudioRetroComputerProps {
  className?: string;
}

export default function StudioRetroComputer({ className = '' }: StudioRetroComputerProps) {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showReadme, setShowReadme] = useState(false);
  const [currentTime, setCurrentTime] = useState('12:00 PM');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // Track hydration for createPortal and clean up body class on unmount
  useEffect(() => {
    setMounted(true);
    return () => {
      document.body.classList.remove('retro-modal-open');
    };
  }, []);

  // When retro computer is open, toggle body class to hide navbar & page headings
  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('retro-modal-open');
    } else {
      document.body.classList.remove('retro-modal-open');
    }
  }, [isExpanded]);

  // Update clock in retro topbar
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  // Listen for Escape key to exit fullscreen retro computer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        setActiveProject(null);
        setShowReadme(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  const openComputer = useCallback(() => {
    soundscape.playClickSound();
    setIsExpanded(true);
    // By default, open the first project or readme so the desktop feels lively
    if (!activeProject && !showReadme && projects.length > 0) {
      setActiveProject(projects[0]);
    }
  }, [activeProject, showReadme]);

  const closeComputer = useCallback(() => {
    soundscape.playClickSound();
    setIsExpanded(false);
    setActiveProject(null);
    setShowReadme(false);
  }, []);

  // Map project slug to its custom pixel icon
  const getProjectPixelIcon = (slug: string, size = 44) => {
    switch (slug) {
      case 'rag-document-qa':
        return <PixelRobot size={size} />;
      case 'syntactiq':
        return <PixelCode size={size} />;
      case 'a-little-scrapbook':
        return <PixelScrapbook size={size} />;
      case 'bloom-for-youu':
        return <PixelFlower size={size} />;
      default:
        return <PixelCode size={size} />;
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. RESTING STATE: Computer screen overlay on the Studio Desk       */}
      {/*    Coordinates accurately centered over the monitor display        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={`pointer-events-auto absolute cursor-pointer select-none ${className}`}
        style={{
          left: '50.8%',
          top: '38.0%',
          transform: 'translate(-50%, -50%)',
          width: '18.0%',
          height: '13.0%',
        }}
        onClick={openComputer}
        role="button"
        tabIndex={0}
        aria-label="Open retro computer to explore projects"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openComputer();
          }
        }}
      >
        <div className="group relative h-full w-full overflow-hidden rounded-[6px] sm:rounded-[10px] p-1.5 sm:p-2 transition-all duration-300">
          {/* CRT scanline texture overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
            }}
          />

          {/* Ambient phosphor screen glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2B1B3A]/30 via-[#FFDFE7]/25 to-[#2B1B3A]/40 transition-colors duration-500 group-hover:from-[#E86A92]/30 group-hover:to-[#FFE29A]/30 dark:from-black/40 dark:via-[#4A2E59]/40 dark:to-black/50" />

          {/* Centered blinking prompt on the screen */}
          <div className="relative z-20 flex h-full w-full flex-col items-center justify-center text-center">
            {/* Retro title badge */}
            <span className="font-mono text-[8px] font-bold tracking-wider text-[#5C3246] sm:text-[10px] md:text-xs dark:text-pink-200">
              ✦ SUTANUKA OS ✦
            </span>

            {/* Glowing Call to action */}
            <div className="mt-0.5 sm:mt-1 flex items-center gap-1 rounded-md border border-pink-300/80 bg-white/80 px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-xs backdrop-blur-[2px] transition-transform duration-200 group-hover:scale-105 group-hover:bg-white dark:border-white/20 dark:bg-black/60 dark:group-hover:bg-black/80">
              <span className="text-[10px] sm:text-xs">💻</span>
              <span className="font-mono text-[8px] sm:text-[10px] md:text-xs font-bold tracking-tight text-ink dark:text-white">
                Explore my projects
              </span>
              <span className="inline-block animate-pulse font-mono font-bold text-accent">_</span>
            </div>

            {/* Subtle retro hint */}
            <span className="mt-0.5 hidden font-hand text-[9px] sm:text-[11px] font-bold text-ink-soft/90 md:block dark:text-white/80">
              [tap to expand]
            </span>
          </div>

          {/* Screen border glow on hover */}
          <div className="pointer-events-none absolute inset-0 rounded-[8px] sm:rounded-[12px] ring-2 ring-transparent transition-all duration-300 group-hover:ring-pink-300/80 group-hover:shadow-[0_0_20px_rgba(255,180,200,0.6)]" />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. EXPANDED FULLSCREEN: The Full Retro Computer OS Experience      */}
      {/*    Portaled to document.body with z-[999] so navbar & text never   */}
      {/*    render over the computer screen                                 */}
      {/* ------------------------------------------------------------------ */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-2 sm:p-5 md:p-8 backdrop-blur-md"
              >
            {/* Vintage Monitor Chassis Housing */}
            <motion.div
              initial={{ scale: 0.35, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.35, y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col rounded-[2rem] border-[10px] border-[#FBE8EC] bg-[#FBE8EC] p-3 shadow-2xl sm:rounded-[2.5rem] sm:border-[16px] sm:p-4 md:border-[20px] dark:border-[#33203E] dark:bg-[#33203E]"
            >
              {/* Monitor Top Badge */}
              <div className="mb-2 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#8A566C] dark:text-pink-300">
                  <span>🌸</span>
                  <span className="tracking-widest">SUTANUKA-STATION 2000</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden font-mono text-[11px] text-ink-soft sm:inline dark:text-white/60">
                    Press <kbd className="rounded border bg-white px-1 py-0.5 font-sans shadow-xs dark:bg-black">ESC</kbd> to exit
                  </span>
                  <button
                    type="button"
                    onClick={closeComputer}
                    title="Close and return to the cozy studio room"
                    className="flex items-center gap-1 rounded-full border border-pink-300/80 bg-white/90 px-3 py-1 font-mono text-xs font-bold text-ink shadow-xs transition-all hover:bg-rose hover:text-white active:scale-95 dark:border-white/20 dark:bg-white/20 dark:text-white"
                  >
                    <span>✕</span>
                    <span className="hidden sm:inline">Back to Studio</span>
                  </button>
                </div>
              </div>

              {/* CRT Glass Monitor Screen Frame */}
              <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border-4 border-[#3D2947] bg-[#FFF2F5] shadow-inner dark:bg-[#1E1226]">
                {/* CRT Scanline and Glass Glare Texture */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-40 opacity-20"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-40 shadow-[inset_0_0_80px_rgba(0,0,0,0.15)]"
                />

                {/* --- Retro OS Top Menu Bar --- */}
                <div className="relative z-30 flex h-7 items-center justify-between border-b-2 border-pink-200/80 bg-[#FFF9FA] px-3 font-mono text-xs font-bold text-ink shadow-xs dark:border-white/10 dark:bg-[#281832] dark:text-white">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="flex items-center gap-1 text-accent">
                      <span>🍑</span>
                      <span className="tracking-tight">CozyOS</span>
                    </span>
                    <span className="hidden opacity-60 hover:opacity-100 sm:inline">File</span>
                    <span className="hidden opacity-60 hover:opacity-100 sm:inline">Edit</span>
                    <span className="hidden opacity-60 hover:opacity-100 sm:inline">Projects</span>
                    <span
                      onClick={() => setShowReadme(true)}
                      className="cursor-pointer text-accent underline opacity-80 hover:opacity-100"
                    >
                      About
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden text-[11px] opacity-75 sm:inline">🔋 100%</span>
                    <span className="rounded bg-pink-100/80 px-1.5 py-0.5 text-[11px] font-bold text-accent dark:bg-white/10 dark:text-pink-200">
                      {currentTime}
                    </span>
                  </div>
                </div>

                {/* --- Retro OS Desktop Workspace --- */}
                <div className="relative flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
                  {/* Subtle pixel grid pattern on desktop wallpaper */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, rgba(232, 106, 146, 0.25) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* Desktop Icons Grid */}
                  <div className="relative z-20 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 md:grid-cols-6">
                    {/* Project Icons */}
                    {projects.map((p) => {
                      const isSelected = selectedIcon === p.slug;
                      const isOpen = activeProject?.slug === p.slug;

                      return (
                        <div
                          key={p.slug}
                          onClick={() => {
                            soundscape.playClickSound();
                            setSelectedIcon(p.slug);
                            setActiveProject(p);
                          }}
                          className={`group flex cursor-pointer flex-col items-center rounded-xl p-2.5 text-center transition-all ${
                            isSelected || isOpen
                              ? 'bg-blush/60 ring-2 ring-accent dark:bg-white/15'
                              : 'hover:bg-white/60 dark:hover:bg-white/10'
                          }`}
                        >
                          <div className="transition-transform duration-200 group-hover:scale-110 active:scale-95">
                            {getProjectPixelIcon(p.slug, 48)}
                          </div>
                          <span className="mt-1.5 line-clamp-2 max-w-[100px] font-mono text-xs font-bold leading-tight text-ink dark:text-white">
                            {p.slug}.app
                          </span>
                          <span className="mt-0.5 rounded-full bg-pink-200/70 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-accent dark:bg-pink-900/60 dark:text-pink-200">
                            {p.status}
                          </span>
                        </div>
                      );
                    })}

                    {/* Extra Cute Desktop Icon: Readme.txt */}
                    <div
                      onClick={() => {
                        soundscape.playClickSound();
                        setSelectedIcon('readme');
                        setShowReadme(true);
                      }}
                      className={`group flex cursor-pointer flex-col items-center rounded-xl p-2.5 text-center transition-all ${
                        selectedIcon === 'readme' || showReadme
                          ? 'bg-blush/60 ring-2 ring-accent dark:bg-white/15'
                          : 'hover:bg-white/60 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110 active:scale-95">
                        <PixelNotepad size={48} />
                      </div>
                      <span className="mt-1.5 font-mono text-xs font-bold text-ink dark:text-white">
                        README.txt
                      </span>
                      <span className="mt-0.5 rounded-full bg-butter/80 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-cocoa">
                        note
                      </span>
                    </div>

                    {/* Extra Cute Desktop Icon: Bugs / Recycle Bin */}
                    <div
                      onClick={() => {
                        soundscape.playClickSound();
                        setSelectedIcon('trash');
                        alert('Recycle Bin: 0 bugs found! Everything is cozy and working ✨');
                      }}
                      className="group flex cursor-pointer flex-col items-center rounded-xl p-2.5 text-center transition-all hover:bg-white/60 dark:hover:bg-white/10"
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110 active:scale-95">
                        <PixelTrash size={48} />
                      </div>
                      <span className="mt-1.5 font-mono text-xs font-bold text-ink dark:text-white">
                        Bugs.trash
                      </span>
                      <span className="mt-0.5 rounded-full bg-sage/80 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-cocoa">
                        empty
                      </span>
                    </div>
                  </div>

                  {/* --- Floating Active Project Window --- */}
                  <AnimatePresence>
                    {activeProject && (
                      <motion.div
                        key={activeProject.slug}
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="relative z-30 mx-auto mt-6 w-full max-w-2xl rounded-2xl border-2 border-pink-300/80 bg-paper/95 shadow-xl backdrop-blur-sm dark:border-white/20 dark:bg-[#25182E]/95"
                      >
                        {/* Retro Window Titlebar */}
                        <div className="flex items-center justify-between border-b-2 border-pink-200/80 bg-gradient-to-r from-blush via-paper to-blush px-4 py-2 dark:border-white/10 dark:from-[#3D2947] dark:to-[#2B1B3A]">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full border border-rose/80 bg-rose" />
                            <span className="h-3 w-3 rounded-full border border-butter/80 bg-butter" />
                            <span className="h-3 w-3 rounded-full border border-sage/80 bg-sage" />
                            <span className="ml-2 font-mono text-xs font-bold text-cocoa dark:text-pink-100">
                              {activeProject.slug}.app
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveProject(null)}
                            title="Close Window"
                            className="flex h-5 w-5 items-center justify-center rounded-full border border-pink-300 bg-white font-mono text-xs font-bold text-ink hover:bg-rose hover:text-white dark:border-white/20 dark:bg-black/40 dark:text-white"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Window Content */}
                        <div className="flex flex-col gap-4 p-5 sm:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100/80 p-1 shadow-inner dark:bg-white/10">
                                {getProjectPixelIcon(activeProject.slug, 36)}
                              </span>
                              <div>
                                <h3 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl dark:text-white">
                                  {activeProject.title}
                                </h3>
                                <span className="font-mono text-xs font-semibold text-accent dark:text-pink-300">
                                  {activeProject.status === 'shipped' ? '● Shipped & Live' : '○ Building in progress'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="font-sans text-sm leading-relaxed text-ink/85 sm:text-base dark:text-white/85">
                            {activeProject.blurb}
                          </p>

                          {/* Tech Stack Pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {activeProject.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-pink-200/70 bg-white/80 px-2 py-0.5 font-mono text-xs font-semibold text-cocoa shadow-2xs dark:border-white/15 dark:bg-black/30 dark:text-white/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-2 flex flex-wrap gap-3 pt-2">
                            {activeProject.links.live && (
                              <a
                                href={activeProject.links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-full border border-pink-300 bg-accent px-4 py-2 font-display text-sm font-bold text-white shadow-xs transition-transform hover:scale-105 active:scale-95 dark:border-pink-200/50"
                              >
                                <span>🌐</span>
                                <span>Launch Live Project</span>
                              </a>
                            )}
                            {activeProject.links.code && (
                              <a
                                href={activeProject.links.code}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-full border border-pink-200/80 bg-white px-4 py-2 font-display text-sm font-bold text-ink shadow-xs transition-transform hover:scale-105 active:scale-95 dark:border-white/20 dark:bg-white/15 dark:text-white"
                              >
                                <span>💻</span>
                                <span>View Source Code</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* --- Floating README Note Window --- */}
                  <AnimatePresence>
                    {showReadme && (
                      <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="relative z-30 mx-auto mt-6 w-full max-w-xl rounded-2xl border-2 border-pink-300/80 bg-[#FFFDF8] shadow-xl backdrop-blur-sm dark:border-white/20 dark:bg-[#25182E]"
                      >
                        <div className="flex items-center justify-between border-b-2 border-pink-200/80 bg-butter/60 px-4 py-2 dark:border-white/10 dark:bg-[#3D2947]">
                          <span className="font-mono text-xs font-bold text-cocoa dark:text-pink-100">
                            README.txt - Notepad
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowReadme(false)}
                            className="flex h-5 w-5 items-center justify-center rounded-full border border-pink-300 bg-white font-mono text-xs font-bold text-ink hover:bg-rose hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-2 p-5 font-mono text-xs leading-relaxed text-cocoa sm:text-sm dark:text-pink-100">
                          <p className="font-bold text-accent">Welcome to Sutanuka&apos;s Retro Studio!</p>
                          <p>
                            Here you can explore my favorite engineering projects — from RAG &amp; AI agents to full-stack web platforms and interactive experiments.
                          </p>
                          <p className="pt-2 text-ink-soft dark:text-white/60">
                            💡 Tip: Click any pixel icon on the desktop to preview that project&apos;s architecture and live demo.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* --- Bottom Status Bar --- */}
                <div className="relative z-30 flex h-6 items-center justify-between border-t-2 border-pink-200/80 bg-[#FFF9FA] px-3 font-mono text-[10px] text-ink-soft dark:border-white/10 dark:bg-[#281832] dark:text-white/60">
                  <span>{projects.length} items loaded</span>
                  <span>Sutanuka OS 1.0 (Ready)</span>
                </div>
              </div>

              {/* Bottom Monitor Base Bezel & Power LED */}
              <div className="mt-2 flex items-center justify-between px-3">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full border border-[#DCA2B3] bg-[#E8C5CE] shadow-inner" />
                  <span className="h-2 w-2 rounded-full border border-[#DCA2B3] bg-[#E8C5CE] shadow-inner" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#8A566C] dark:text-pink-300">
                    POWER
                  </span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs" />
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}
