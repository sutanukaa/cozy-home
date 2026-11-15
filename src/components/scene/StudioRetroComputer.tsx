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
  PixelServer,
  PixelTicket,
} from '@/components/ui/PixelIcons';
import { soundscape } from '@/lib/soundEngine';
import { ragDiagrams, ragConstants, type ArchitectureDiagram } from '@/data/ragArchitecture';
import MermaidRenderer from '@/components/ui/MermaidRenderer';

interface StudioRetroComputerProps {
  className?: string;
}

export default function StudioRetroComputer({ className = '' }: StudioRetroComputerProps) {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showBlueprints, setShowBlueprints] = useState(false);
  const [activeBlueprintDiagram, setActiveBlueprintDiagram] = useState<number>(1);
  const [showBlueprintConstants, setShowBlueprintConstants] = useState<boolean>(false);
  const [showReadme, setShowReadme] = useState(false);
  const [currentTime, setCurrentTime] = useState('12:00 PM');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const currentBlueprint: ArchitectureDiagram =
    ragDiagrams.find((d) => d.id === activeBlueprintDiagram) || ragDiagrams[0];

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
      case 'tickease':
        return <PixelTicket size={size} />;
      case 'bloom-for-youu':
        return <PixelFlower size={size} />;
      case 'a-little-scrapbook':
        return <PixelScrapbook size={size} />;
      case 'http-server':
        return <PixelServer size={size} />;
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
          left: '50.9%',
          top: '38.5%',
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
          <div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-1 sm:gap-1.5 text-center">
            {/* Retro title badge */}
            <span className="font-mono text-[8px] font-bold tracking-wider text-[#5C3246] sm:text-[10px] md:text-xs dark:text-pink-200">
              ✦ SUTANUKA OS ✦
            </span>

            {/* Glowing Call to action - laptop emoji removed */}
            <div className="flex items-center justify-center rounded-md border border-pink-300/80 bg-white/85 px-3 py-1 sm:px-3.5 sm:py-1.5 shadow-xs backdrop-blur-[2px] transition-transform duration-200 group-hover:scale-105 group-hover:bg-white dark:border-white/20 dark:bg-black/60 dark:group-hover:bg-black/80">
              <span className="font-mono text-[9px] sm:text-[11px] md:text-xs font-bold tracking-tight text-ink dark:text-white">
                Explore my projects
              </span>
              <span className="ml-1 inline-block animate-pulse font-mono font-bold text-accent">_</span>
            </div>

            {/* Subtle retro hint */}
            <span className="hidden font-hand text-[9px] sm:text-[11px] font-bold text-ink-soft/90 md:block dark:text-white/80">
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
                className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-1 sm:p-2 md:p-2.5 backdrop-blur-md overflow-hidden"
              >
            {/* Vintage Monitor Chassis Housing - Full Screen Edge-to-Edge */}
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative flex h-full w-full flex-col rounded-xl border-4 border-[#FBE8EC] bg-[#FBE8EC] p-2 shadow-2xl sm:rounded-2xl sm:border-[8px] sm:p-2.5 md:border-[10px] dark:border-[#33203E] dark:bg-[#33203E]"
            >
              {/* Monitor Top Badge */}
              <div className="mb-2 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#8A566C] dark:text-pink-300">
                  <span className="rounded bg-pink-200/80 px-1 py-0.2 text-[10px] font-bold text-[#5C3246] dark:bg-white/10 dark:text-pink-200">SYS</span>
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
              <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg sm:rounded-xl border-2 sm:border-4 border-[#3D2947] bg-[#FFF2F5] shadow-inner dark:bg-[#1E1226]">
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
                    <span className="flex items-center gap-1 text-accent font-bold">
                      <span className="rounded bg-accent/15 px-1 py-0.2 text-[10px]">OS</span>
                      <span className="tracking-tight">CozyOS</span>
                    </span>
                    <span className="hidden opacity-60 hover:opacity-100 sm:inline">File</span>
                    <span className="hidden opacity-60 hover:opacity-100 sm:inline">Edit</span>
                    <span
                      onClick={() => {
                        const rag = projects.find((p) => p.slug === 'rag-document-qa');
                        if (rag) {
                          setActiveProject(rag);
                          setSelectedIcon('rag-document-qa');
                          setShowBlueprints(true);
                        }
                      }}
                      className="cursor-pointer text-accent underline opacity-85 hover:opacity-100"
                      title="View RAG Architecture Blueprints & 6 System Diagrams"
                    >
                      Blueprints
                    </span>
                    <span
                      onClick={() => setShowReadme(true)}
                      className="cursor-pointer opacity-70 hover:opacity-100"
                    >
                      About
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden text-[11px] opacity-75 sm:inline">PWR: 100%</span>
                    <span className="rounded bg-pink-100/80 px-1.5 py-0.5 text-[11px] font-bold text-accent dark:bg-white/10 dark:text-pink-200">
                      {currentTime}
                    </span>
                  </div>
                </div>

                {/* --- Retro OS Desktop Workspace --- */}
                <div className="retro-scroll relative flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
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

                  {/* Desktop Icons Grid - All 6 Projects in a clean retro row */}
                  <div className="relative z-20 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-6 md:gap-5">
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
                          <span
                            className={`mt-0.5 rounded-full px-1.5 py-0.2 font-mono text-[9px] font-semibold ${
                              p.status === 'Currently Building'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300/80 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700/60'
                                : 'bg-pink-200/70 text-accent dark:bg-pink-900/60 dark:text-pink-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* --- Floating Active Project Window --- */}
                  <AnimatePresence>
                    {activeProject && (
                      <motion.div
                        key={activeProject.slug}
                        initial={{ scale: 0.95, y: 15, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 15, opacity: 0 }}
                        className="relative z-30 mx-auto mt-2 w-full max-w-6xl flex flex-col rounded-2xl border-2 border-pink-300/80 bg-paper/98 shadow-2xl backdrop-blur-md dark:border-white/20 dark:bg-[#25182E]/98"
                      >
                        {/* Retro Window Titlebar */}
                        <div className="flex shrink-0 items-center justify-between border-b-2 border-pink-200/80 bg-gradient-to-r from-blush via-paper to-blush px-4 py-2 dark:border-white/10 dark:from-[#3D2947] dark:to-[#2B1B3A]">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full border border-rose/80 bg-rose" />
                            <span className="h-3 w-3 rounded-full border border-butter/80 bg-butter" />
                            <span className="h-3 w-3 rounded-full border border-sage/80 bg-sage" />
                            <span className="ml-2 font-mono text-xs font-bold text-cocoa dark:text-pink-100">
                              {activeProject.slug}.app - {showBlueprints && activeProject.slug === 'rag-document-qa' ? 'Architecture Blueprints & Technical Specification' : 'Technical Specification'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProject(null);
                              setShowBlueprints(false);
                            }}
                            title="Close Window"
                            className="flex h-5 w-5 items-center justify-center rounded-full border border-pink-300 bg-white font-mono text-xs font-bold text-ink hover:bg-rose hover:text-white dark:border-white/20 dark:bg-black/40 dark:text-white"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Scrollable Window Content Pane */}
                        <div className="retro-scroll flex max-h-[66vh] sm:max-h-[70vh] md:max-h-[74vh] flex-col gap-5 overflow-y-auto p-5 sm:p-6 text-ink dark:text-white">
                          {/* Header Block */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-200/60 pb-4 dark:border-white/10">
                            <div className="flex items-center gap-3">
                              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100/80 p-1 shadow-inner dark:bg-white/10">
                                {getProjectPixelIcon(activeProject.slug, 38)}
                              </span>
                              <div>
                                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                                  {activeProject.title}
                                </h3>
                                <p className="font-mono text-xs text-ink-soft dark:text-pink-200">
                                  {activeProject.tagline}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`self-start sm:self-center shrink-0 rounded-md border px-2.5 py-1 font-mono text-[10px] font-bold ${
                                activeProject.status === 'Currently Building'
                                  ? 'border-amber-300/80 bg-amber-100/80 text-amber-900 dark:border-amber-700/80 dark:bg-amber-950/60 dark:text-amber-200'
                                  : 'border-pink-300/70 bg-pink-100/70 text-accent dark:border-pink-800/80 dark:bg-pink-950/60 dark:text-pink-300'
                              }`}
                            >
                              STATUS: {activeProject.status.toUpperCase()}
                            </span>
                          </div>

                          {/* Technical Overview Section */}
                          <div className="space-y-1.5">
                            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                              System Overview
                            </h4>
                            <p className="font-sans text-xs sm:text-sm leading-relaxed text-ink/90 dark:text-white/90">
                              {activeProject.overview}
                            </p>
                          </div>

                          {/* Architecture & Pipeline */}
                          {activeProject.architecture && activeProject.architecture.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                System Architecture &amp; Pipeline
                              </h4>
                              <div className="space-y-1.5 rounded-xl border border-pink-200/70 bg-white/60 p-3 sm:p-4 font-mono text-xs text-ink/90 dark:border-white/10 dark:bg-black/25 dark:text-white/85">
                                {activeProject.architecture.map((arch, idx) => (
                                  <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                                    <span className="shrink-0 font-bold text-accent dark:text-pink-300">
                                      0{idx + 1} |
                                    </span>
                                    <span>{arch}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Technical Highlights */}
                          {activeProject.technicalHighlights && activeProject.technicalHighlights.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                Key Engineering Decisions &amp; Highlights
                              </h4>
                              <ul className="space-y-1.5 rounded-xl border border-pink-200/70 bg-white/60 p-3 sm:p-4 font-mono text-xs text-ink/90 dark:border-white/10 dark:bg-black/25 dark:text-white/85">
                                {activeProject.technicalHighlights.map((hl, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                                    <span className="shrink-0 font-bold text-accent">&gt;</span>
                                    <span>{hl}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Key Capabilities */}
                          {activeProject.keyFeatures && activeProject.keyFeatures.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                Core Capabilities
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {activeProject.keyFeatures.map((feat, idx) => (
                                  <div key={idx} className="flex items-center gap-2 rounded-lg border border-pink-200/60 bg-white/50 px-2.5 py-1.5 font-mono text-[11px] text-ink/85 dark:border-white/10 dark:bg-black/20 dark:text-white/85">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                    <span>{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tech Stack Tags */}
                          <div className="space-y-1.5">
                            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                              Technologies
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {activeProject.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md border border-pink-200/70 bg-white/90 px-2.5 py-1 font-mono text-xs font-medium text-cocoa shadow-2xs dark:border-white/15 dark:bg-black/40 dark:text-white/90"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Links (Zero Emojis) */}
                          <div className="flex flex-wrap items-center gap-3 border-t border-pink-200/60 pt-4 dark:border-white/10">
                            {activeProject.slug === 'rag-document-qa' && (
                              <button
                                type="button"
                                onClick={() => {
                                  soundscape.playClickSound();
                                  setShowBlueprints(!showBlueprints);
                                }}
                                className="flex items-center gap-1.5 rounded-full border border-pink-400 bg-accent px-4 py-2 font-mono text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-rose active:scale-95 dark:border-pink-300/60"
                              >
                                <span>
                                  {showBlueprints
                                    ? '[ Hide Architecture Diagrams ▲ ]'
                                    : '[ View Architecture Diagrams (6) ▼ ]'}
                                </span>
                              </button>
                            )}
                            {activeProject.links.code && (
                              <a
                                href={activeProject.links.code}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-full border border-pink-300 bg-white px-4 py-2 font-mono text-xs sm:text-sm font-bold text-ink shadow-xs transition-transform hover:scale-105 active:scale-95 dark:border-white/20 dark:bg-white/15 dark:text-white"
                              >
                                <span>[ View GitHub Repository ]</span>
                              </a>
                            )}
                            {activeProject.links.live && (
                              <a
                                href={activeProject.links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-full border border-pink-200/80 bg-white px-4 py-2 font-mono text-xs sm:text-sm font-bold text-ink shadow-xs transition-transform hover:scale-105 active:scale-95 dark:border-white/20 dark:bg-white/15 dark:text-white"
                              >
                                <span>[ Launch Live Application ]</span>
                              </a>
                            )}
                          </div>

                          {/* --- Expandable Architecture Blueprint Viewer within Same Window --- */}
                          <AnimatePresence>
                            {showBlueprints && activeProject.slug === 'rag-document-qa' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 flex flex-col gap-6 border-t-2 border-pink-200/80 pt-6 dark:border-white/10"
                              >
                                {/* Section Title & Subheading */}
                                <div className="flex flex-col items-center text-center gap-1.5">
                                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent dark:text-pink-300">
                                    Architecture Blueprints &amp; Vector Specifications
                                  </span>
                                  <h4 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                                    RAG Engine Architectural Blueprint
                                  </h4>
                                  <p className="max-w-2xl font-mono text-xs text-ink-soft dark:text-pink-200">
                                    Detailed vector diagrams, data flows, fallback invariants, and production API contracts across all 6 core sub-systems.
                                  </p>
                                </div>

                                {/* --- Choice Band in the Middle --- */}
                                <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-pink-200/80 bg-white/90 p-2 shadow-inner dark:border-white/15 dark:bg-black/40">
                                  {ragDiagrams.map((d) => {
                                    const isActive = !showBlueprintConstants && activeBlueprintDiagram === d.id;
                                    return (
                                      <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => {
                                          soundscape.playClickSound();
                                          setShowBlueprintConstants(false);
                                          setActiveBlueprintDiagram(d.id);
                                        }}
                                        className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                          isActive
                                            ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                            : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                        }`}
                                      >
                                        {d.tabLabel}
                                      </button>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      soundscape.playClickSound();
                                      setShowBlueprintConstants(true);
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      showBlueprintConstants
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ Constants &amp; Contracts ]
                                  </button>
                                </div>

                                {/* --- Display Area: Selected Diagram or Constants --- */}
                                {!showBlueprintConstants ? (
                                  <div className="flex flex-col gap-5">
                                    {/* Diagram Title and Badge */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <div>
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Diagram 0{currentBlueprint.id} of 06
                                        </span>
                                        <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                          {currentBlueprint.title}
                                        </h5>
                                      </div>
                                      <span className="self-start sm:self-center rounded-md border border-pink-300/80 bg-pink-100/70 px-2.5 py-1 font-mono text-[11px] font-bold text-accent dark:border-pink-700/80 dark:bg-pink-950/60 dark:text-pink-200">
                                        {currentBlueprint.badge}
                                      </span>
                                    </div>

                                    {/* Mermaid Vector Diagram */}
                                    <MermaidRenderer
                                      code={currentBlueprint.mermaid}
                                      diagramId={`blueprint-diagram-${currentBlueprint.id}`}
                                    />

                                    {/* 3 Technical Deep-Dive Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Data Flow &amp; Interactions
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentBlueprint.interactions}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Failure Modes &amp; Degradation
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentBlueprint.failureModes}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Trade-Offs &amp; Scale Limits
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentBlueprint.tradeOffs}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Constants & Contracts View */
                                  <div className="flex flex-col gap-5">
                                    <div className="border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                        System Invariants
                                      </span>
                                      <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                        Configuration Parameters &amp; API Schemas
                                      </h5>
                                    </div>

                                    {/* Constants Table */}
                                    <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                      <table className="w-full text-left font-mono text-xs">
                                        <thead>
                                          <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                            <th className="px-4 py-2.5 font-bold">Parameter / Invariant</th>
                                            <th className="px-4 py-2.5 font-bold">Production Configuration</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                          {ragConstants.map((param, i) => (
                                            <tr key={i} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                              <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                {param.name}
                                              </td>
                                              <td className="px-4 py-2.5 text-accent dark:text-pink-300">
                                                {param.value}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* API Contracts */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          POST /ask/stream (SSE Protocol)
                                        </span>
                                        <pre className="max-h-60 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`// Headers:
// x-user: <authenticated-id>
// x-chats-secret: <shared-secret>

// Request Body:
{
  "question": "What is the hybrid retrieval formula?",
  "chat_id": "c-9f8a2b",
  "source_filter": "system-spec.pdf"
}

// SSE Stream Events:
// event: sources
// data: [{"id":"chk-12","score":0.031,"source":"..."}]
//
// event: token
// data: {"text": "Reciprocal"}
//
// event: done
// data: {"status": "complete", "total_tokens": 142}`}
                                        </pre>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          POST /ingest (Multipart Upload)
                                        </span>
                                        <pre className="max-h-60 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`// Multipart Form Data:
// file: <binary PDF payload>

// Response Body (200 OK):
{
  "filename": "quarterly-report.pdf",
  "num_pages": 14,
  "num_chunks": 48,
  "embedding_model": "gemini-embedding-001",
  "dimensions": 768,
  "bm25_rebuilt": true,
  "duration_ms": 1480
}`}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* --- Floating README Note Window (Zero Emojis) --- */}
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
                            README.txt - Technical Portfolio Guide
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowReadme(false)}
                            className="flex h-5 w-5 items-center justify-center rounded-full border border-pink-300 bg-white font-mono text-xs font-bold text-ink hover:bg-rose hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-3 p-5 font-mono text-xs leading-relaxed text-cocoa sm:text-sm dark:text-pink-100">
                          <p className="font-bold text-accent">[ SYSTEM SPECIFICATION &amp; ARCHITECTURE GUIDE ]</p>
                          <p>
                            Welcome to Sutanuka&apos;s Engineering Portfolio. This workstation highlights production systems, autonomous multi-agent pipelines, retrieval-augmented generation architectures, and systems programming.
                          </p>
                          <p className="pt-2 text-ink-soft dark:text-white/70">
                            Select any application icon on the desktop workspace to inspect architectural pipelines, technical decisions, CI verification harnesses, and GitHub source code repositories.
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
