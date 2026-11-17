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
  PixelDatabase,
} from '@/components/ui/PixelIcons';
import { soundscape } from '@/lib/soundEngine';
import { ragDiagrams, ragConstants, type ArchitectureDiagram } from '@/data/ragArchitecture';
import {
  syntactiqDiagrams,
  syntactiqStateSchema,
  syntactiqVerificationMatrix,
} from '@/data/syntactiqArchitecture';
import {
  githubEtlDiagrams,
  githubEtlTables,
  githubEtlDerivedFields,
} from '@/data/githubEtlArchitecture';
import {
  tickeaseDiagrams,
  tickeaseInvariants,
  tickeaseTables,
} from '@/data/tickeaseArchitecture';
import {
  bloomDiagrams,
  bloomStages,
  bloomInvariants,
} from '@/data/bloomArchitecture';
import {
  scrapbookDiagrams,
  scrapbookBudgets,
  scrapbookInvariants,
  scrapbookAudioActions,
} from '@/data/scrapbookArchitecture';
import {
  httpServerDiagrams,
  httpServerInvariants,
  httpServerLimits,
  httpStatusMappings,
  httpParserTransitions,
} from '@/data/httpServerArchitecture';
import MermaidRenderer from '@/components/ui/MermaidRenderer';
import CozyRunner from '@/components/game/CozyRunner';

interface StudioRetroComputerProps {
  className?: string;
}

export default function StudioRetroComputer({ className = '' }: StudioRetroComputerProps) {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showBlueprints, setShowBlueprints] = useState(false);
  const [activeBlueprintDiagram, setActiveBlueprintDiagram] = useState<number>(1);
  const [activeExtraTab, setActiveExtraTab] = useState<
    | 'none'
    | 'constants'
    | 'schema'
    | 'verification'
    | 'etl-schema'
    | 'tickease-invariants'
    | 'bloom-invariants'
    | 'scrapbook-invariants'
    | 'scrapbook-audio'
    | 'http-invariants'
    | 'http-transitions'
  >('none');
  const [showReadme, setShowReadme] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [currentTime, setCurrentTime] = useState('12:00 PM');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const isSyntactiq = activeProject?.slug === 'syntactiq';
  const isRag = activeProject?.slug === 'rag-document-qa';
  const isGithubEtl = activeProject?.slug === 'github-etl';
  const isTickease = activeProject?.slug === 'tickease';
  const isBloom = activeProject?.slug === 'bloom-for-youu';
  const isScrapbook = activeProject?.slug === 'a-little-scrapbook';
  const isHttpServer = activeProject?.slug === 'http-server';
  const hasBlueprints = isSyntactiq || isRag || isGithubEtl || isTickease || isBloom || isScrapbook || isHttpServer;

  const currentSyntactiqBlueprint =
    syntactiqDiagrams.find((d) => d.id === activeBlueprintDiagram) || syntactiqDiagrams[0];
  const currentRagBlueprint =
    ragDiagrams.find((d) => d.id === activeBlueprintDiagram) || ragDiagrams[0];
  const currentGithubEtlBlueprint =
    githubEtlDiagrams.find((d) => d.id === activeBlueprintDiagram) || githubEtlDiagrams[0];
  const currentTickeaseBlueprint =
    tickeaseDiagrams.find((d) => d.id === activeBlueprintDiagram) || tickeaseDiagrams[0];
  const currentBloomBlueprint =
    bloomDiagrams.find((d) => d.id === activeBlueprintDiagram) || bloomDiagrams[0];
  const currentScrapbookBlueprint =
    scrapbookDiagrams.find((d) => d.id === activeBlueprintDiagram) || scrapbookDiagrams[0];
  const currentHttpBlueprint =
    httpServerDiagrams.find((d) => d.id === activeBlueprintDiagram) || httpServerDiagrams[0];

  const diagramCount = isSyntactiq
    ? syntactiqDiagrams.length
    : isRag
    ? ragDiagrams.length
    : isGithubEtl
    ? githubEtlDiagrams.length
    : isTickease
    ? tickeaseDiagrams.length
    : isBloom
    ? bloomDiagrams.length
    : isScrapbook
    ? scrapbookDiagrams.length
    : isHttpServer
    ? httpServerDiagrams.length
    : 0;

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
        setShowGame(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  const openComputer = useCallback(() => {
    soundscape.playClickSound();
    setIsExpanded(true);
    // By default, open the first project or readme so the desktop feels lively
    if (!activeProject && !showReadme && !showGame && projects.length > 0) {
      setActiveProject(projects[0]);
    }
  }, [activeProject, showReadme, showGame]);

  const closeComputer = useCallback(() => {
    soundscape.playClickSound();
    setIsExpanded(false);
    setActiveProject(null);
    setShowReadme(false);
    setShowGame(false);
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
      case 'github-etl':
        return <PixelDatabase size={size} />;
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
      {/*    Coordinates accurately centered over the monitor display glass  */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={`pointer-events-auto absolute cursor-pointer select-none ${className}`}
        style={{
          left: '50.5%',
          top: '38.8%',
          transform: 'translate(-50%, -50%)',
          width: '16.8%',
          height: '13.2%',
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
        <div className="group relative h-full w-full overflow-hidden rounded-[6px] sm:rounded-[10px] p-1 sm:p-1.5 transition-all duration-300">
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
          <div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-0.5 sm:gap-1 text-center px-1">
            {/* Retro title badge */}
            <span className="font-mono text-[7px] font-bold tracking-wider text-[#5C3246] sm:text-[9px] md:text-[11px] dark:text-pink-200">
              ✦ SUTANUKA OS ✦
            </span>

            {/* Glowing Call to action */}
            <div className="flex items-center justify-center rounded-md border border-pink-300/80 bg-white/85 px-2 py-0.5 sm:px-2.5 sm:py-1 shadow-xs backdrop-blur-[2px] transition-transform duration-200 group-hover:scale-105 group-hover:bg-white dark:border-white/20 dark:bg-black/60 dark:group-hover:bg-black/80">
              <span className="font-mono text-[8px] sm:text-[10px] md:text-xs font-bold tracking-tight text-ink dark:text-white">
                Explore my projects
              </span>
              <span className="ml-1 inline-block animate-pulse font-mono font-bold text-accent">_</span>
            </div>

            {/* Subtle retro hint */}
            <span className="font-hand text-[8px] sm:text-[10px] font-bold text-ink-soft/90 dark:text-white/80">
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
                className="fixed inset-0 z-[999] flex h-full h-[100dvh] w-full items-center justify-center bg-black/95 p-1 sm:p-2 md:p-2.5 backdrop-blur-md overflow-hidden"
              >
            {/* Vintage Monitor Chassis Housing - Full Screen Edge-to-Edge */}
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative flex h-full w-full flex-col rounded-xl border-2 sm:border-[6px] md:border-[10px] border-[#FBE8EC] bg-[#FBE8EC] p-1.5 sm:p-2.5 md:p-3 shadow-2xl dark:border-[#33203E] dark:bg-[#33203E]"
            >
              {/* Monitor Top Badge */}
              <div className="mb-1.5 sm:mb-2 flex items-center justify-between px-1 sm:px-2">
                <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-xs font-bold text-[#8A566C] dark:text-pink-300">
                  <span className="rounded bg-pink-200/80 px-1 py-0.2 text-[9px] sm:text-[10px] font-bold text-[#5C3246] dark:bg-white/10 dark:text-pink-200">SYS</span>
                  <span className="tracking-normal sm:tracking-widest">SUTANUKA-STATION 2000</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="hidden font-mono text-[11px] text-ink-soft sm:inline dark:text-white/60">
                    Press <kbd className="rounded border bg-white px-1 py-0.5 font-sans shadow-xs dark:bg-black">ESC</kbd> to exit
                  </span>
                  <button
                    type="button"
                    onClick={closeComputer}
                    title="Close and return to the cozy studio room"
                    className="flex items-center gap-1 rounded-full border border-pink-300/80 bg-white/90 px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[11px] sm:text-xs font-bold text-ink shadow-xs transition-all hover:bg-rose hover:text-white active:scale-95 dark:border-white/20 dark:bg-white/20 dark:text-white"
                  >
                    <span>✕</span>
                    <span className="hidden sm:inline">Back to Studio</span>
                    <span className="sm:hidden">Back</span>
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
                <div className="relative z-30 flex h-7 sm:h-8 shrink-0 items-center justify-between border-b-2 border-pink-200/80 bg-[#FFF9FA] px-2 sm:px-3 font-mono text-xs font-bold text-ink shadow-xs dark:border-white/10 dark:bg-[#281832] dark:text-white overflow-x-auto scrollbar-none">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="flex items-center gap-1 text-accent font-bold">
                      <span className="rounded bg-accent/15 px-1 py-0.2 text-[10px]">OS</span>
                      <span className="tracking-tight hidden xs:inline sm:inline">CozyOS</span>
                    </span>
                    {/* Primary Tab 1: Projects */}
                    <button
                      type="button"
                      onClick={() => {
                        soundscape.playClickSound();
                        setShowGame(false);
                        setShowReadme(false);
                        if (!activeProject && projects.length > 0) {
                          setActiveProject(projects[0]);
                          setSelectedIcon(projects[0].slug);
                        }
                      }}
                      className={`cursor-pointer rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-mono font-bold transition-all ${
                        !showGame
                          ? 'border border-pink-400/80 bg-accent text-white shadow-xs'
                          : 'border border-transparent text-ink/80 hover:bg-pink-100/70 hover:text-ink dark:text-pink-200 dark:hover:bg-white/10'
                      }`}
                      title="View Projects"
                    >
                      Projects
                    </button>

                    {/* Primary Tab 2: Scratch this, game time! */}
                    <button
                      type="button"
                      onClick={() => {
                        soundscape.playClickSound();
                        setShowGame(true);
                        setActiveProject(null);
                        setShowReadme(false);
                        setShowBlueprints(false);
                      }}
                      className={`cursor-pointer rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-mono font-bold transition-all whitespace-nowrap ${
                        showGame
                          ? 'border border-butter/90 bg-butter text-cocoa shadow-xs ring-2 ring-butter/50'
                          : 'border border-butter/80 bg-butter/40 text-cocoa hover:bg-butter hover:text-ink dark:border-butter/50 dark:bg-butter/25 dark:text-butter'
                      }`}
                      title="Scratch this, game time! Open the Cozy Arcade mini-game station"
                    >
                      <span className="hidden sm:inline">Scratch this, game time!</span>
                      <span className="sm:hidden">Game Arcade</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="hidden text-[11px] opacity-75 sm:inline">PWR: 100%</span>
                    <span className="rounded bg-pink-100/80 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-accent dark:bg-white/10 dark:text-pink-200 whitespace-nowrap">
                      {currentTime}
                    </span>
                  </div>
                </div>

                {/* --- Retro OS Desktop Workspace --- */}
                <div
                  className={`relative flex flex-1 flex-col ${
                    showGame ? 'overflow-hidden p-0' : 'retro-scroll overflow-y-auto p-2 sm:p-4 md:p-6'
                  }`}
                >
                  {!showGame && (
                    <>
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

                      {/* Desktop Icons Grid - All Projects in a clean retro row */}
                      <div className="relative z-20 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3.5 md:grid-cols-7 md:gap-2.5">
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
                                setShowBlueprints(false);
                                setShowGame(false);
                                setActiveExtraTab('none');
                                setActiveBlueprintDiagram(1);
                              }}
                              className={`group flex cursor-pointer flex-col items-center rounded-xl p-2 sm:p-2.5 text-center transition-all ${
                                isSelected || isOpen
                                  ? 'bg-blush/60 ring-2 ring-accent dark:bg-white/15'
                                  : 'hover:bg-white/60 dark:hover:bg-white/10'
                              }`}
                            >
                              <div className="transition-transform duration-200 group-hover:scale-110 active:scale-95">
                                <div className="hidden sm:block">{getProjectPixelIcon(p.slug, 48)}</div>
                                <div className="sm:hidden">{getProjectPixelIcon(p.slug, 34)}</div>
                              </div>
                              <span className="mt-1 line-clamp-2 max-w-[120px] font-mono text-[11px] sm:text-xs font-bold leading-tight text-ink dark:text-white">
                                {p.slug}.app
                              </span>
                              <span
                                className={`mt-0.5 rounded-full px-1.5 py-0.2 font-mono text-[8px] sm:text-[9px] font-semibold ${
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
                    </>
                  )}

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
                        <div className="flex shrink-0 items-center justify-between border-b-2 border-pink-200/80 bg-gradient-to-r from-blush via-paper to-blush px-3 sm:px-4 py-1.5 sm:py-2 dark:border-white/10 dark:from-[#3D2947] dark:to-[#2B1B3A]">
                          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full border border-rose/80 bg-rose" />
                            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full border border-butter/80 bg-butter" />
                            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full border border-sage/80 bg-sage" />
                            <span className="ml-1 sm:ml-2 truncate font-mono text-[11px] sm:text-xs font-bold text-cocoa dark:text-pink-100">
                              {activeProject.slug}.app - {showBlueprints && hasBlueprints ? 'Architecture Blueprints' : 'Technical Specification'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProject(null);
                              setShowBlueprints(false);
                              setActiveExtraTab('none');
                            }}
                            title="Close Window"
                            className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-pink-300 bg-white font-mono text-xs font-bold text-ink hover:bg-rose hover:text-white dark:border-white/20 dark:bg-black/40 dark:text-white"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Scrollable Window Content Pane */}
                        <div className="retro-scroll flex max-h-[58vh] sm:max-h-[66vh] md:max-h-[72vh] flex-col gap-4 sm:gap-5 overflow-y-auto p-3 sm:p-5 md:p-6 text-ink dark:text-white">
                          {/* Header Block */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-200/60 pb-3 sm:pb-4 dark:border-white/10">
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                              <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100/80 p-1 shadow-inner dark:bg-white/10">
                                {getProjectPixelIcon(activeProject.slug, 32)}
                              </span>
                              <div className="min-w-0">
                                <h3 className="truncate font-display text-lg sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                                  {activeProject.title}
                                </h3>
                                <p className="font-mono text-[11px] sm:text-xs text-ink-soft dark:text-pink-200">
                                  {activeProject.tagline}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`self-start sm:self-center shrink-0 rounded-md border px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[9px] sm:text-[10px] font-bold ${
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
                            {hasBlueprints && (
                              <button
                                type="button"
                                onClick={() => {
                                  soundscape.playClickSound();
                                  setShowBlueprints(!showBlueprints);
                                  setActiveExtraTab('none');
                                  setActiveBlueprintDiagram(1);
                                }}
                                className="flex items-center gap-1.5 rounded-full border border-pink-400 bg-accent px-4 py-2 font-mono text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-rose active:scale-95 dark:border-pink-300/60"
                              >
                                <span>
                                  {showBlueprints
                                    ? '[ Hide Architecture Diagrams ▲ ]'
                                    : `[ View Architecture Diagrams (${diagramCount}) ▼ ]`}
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
                            <button
                              type="button"
                              onClick={() => {
                                soundscape.playClickSound();
                                setShowGame(true);
                                setActiveProject(null);
                              }}
                              className="flex items-center gap-1.5 rounded-full border border-butter/90 bg-butter/40 px-4 py-2 font-mono text-xs sm:text-sm font-bold text-cocoa shadow-xs transition-all hover:bg-butter hover:text-ink active:scale-95 dark:border-butter/50 dark:bg-butter/25 dark:text-butter"
                              title="Scratch this, game time! Take a break and launch the arcade"
                            >
                              <span>[ Scratch this, game time! ]</span>
                            </button>
                          </div>

                          {/* --- Expandable Architecture Blueprint Viewer: Syntactiq --- */}
                          <AnimatePresence>
                            {showBlueprints && isSyntactiq && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 flex flex-col gap-6 border-t-2 border-pink-200/80 pt-6 dark:border-white/10"
                              >
                                {/* In-Progress Workstation Alert Banner */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border-2 border-amber-300/90 bg-amber-50/95 p-4 font-mono text-xs shadow-xs dark:border-amber-600/80 dark:bg-amber-950/50">
                                  <div className="flex items-start sm:items-center gap-3">
                                    <span className="mt-0.5 sm:mt-0 flex h-3 w-3 shrink-0 rounded-full bg-amber-500 animate-pulse" />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-amber-900 dark:text-amber-200">
                                          PROJECT STATUS: IN ACTIVE DEVELOPMENT
                                        </span>
                                        <span className="rounded bg-amber-200/90 px-1.5 py-0.2 text-[9px] font-bold text-amber-900 dark:bg-amber-900/80 dark:text-amber-100">
                                          CURRENTLY BUILDING
                                        </span>
                                      </div>
                                      <p className="mt-1 text-[11px] leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                                        Core multi-agent LangGraph workflow, dual-tier Docker sandboxing, and Coder agent are built and verified (44/45 unit tests passing). Automated GitHub Fork-and-PR egress and distributed Celery cluster deployment are actively being finalized.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="shrink-0 flex items-center self-start sm:self-center">
                                    <span className="rounded-md border border-amber-300 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-amber-900 dark:border-amber-700 dark:bg-black/40 dark:text-amber-200">
                                      45 TESTS VERIFIED
                                    </span>
                                  </div>
                                </div>

                                {/* Section Title & Subheading */}
                                <div className="flex flex-col items-center text-center gap-1.5">
                                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent dark:text-pink-300">
                                    Engineering Blueprints &amp; Multi-Agent Specifications
                                  </span>
                                  <h4 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                                    Syntactiq Architecture &amp; Multi-Agent Pipeline
                                  </h4>
                                  <p className="max-w-2xl font-mono text-xs text-ink-soft dark:text-pink-200">
                                    Six system diagrams detailing distributed infrastructure, compiled StateGraph self-healing, Tree-sitter AST decomposition, Docker sandboxing, GitHub egress, and real-time SSE telemetry.
                                  </p>
                                </div>

                                {/* --- Choice Band in the Middle --- */}
                                <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-pink-200/80 bg-white/90 p-2 shadow-inner dark:border-white/15 dark:bg-black/40">
                                  {syntactiqDiagrams.map((d) => {
                                    const isActive = activeExtraTab === 'none' && activeBlueprintDiagram === d.id;
                                    return (
                                      <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => {
                                          soundscape.playClickSound();
                                          setActiveExtraTab('none');
                                          setActiveBlueprintDiagram(d.id);
                                        }}
                                        className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                          isActive
                                            ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                            : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                        }`}
                                      >
                                        <span>{d.tabLabel}</span>
                                        <span className={`ml-1 text-[9px] ${d.status === 'Built & Verified' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                          {d.status === 'Built & Verified' ? '●' : '○'}
                                        </span>
                                      </button>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      soundscape.playClickSound();
                                      setActiveExtraTab('schema');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'schema'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ State Schema &amp; Invariants ]
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      soundscape.playClickSound();
                                      setActiveExtraTab('verification');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'verification'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ Implementation Status (45 Tests) ]
                                  </button>
                                </div>

                                {/* --- Display Area: Selected Diagram --- */}
                                {activeExtraTab === 'none' && (
                                  <div className="flex flex-col gap-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <div>
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Diagram 0{currentSyntactiqBlueprint.id} of 06
                                        </span>
                                        <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                          {currentSyntactiqBlueprint.title}
                                        </h5>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                                        <span className="rounded-md border border-pink-300/80 bg-pink-100/70 px-2.5 py-1 font-mono text-[11px] font-bold text-accent dark:border-pink-700/80 dark:bg-pink-950/60 dark:text-pink-200">
                                          {currentSyntactiqBlueprint.badge}
                                        </span>
                                        <span
                                          className={`rounded-md border px-2.5 py-1 font-mono text-[10px] font-bold ${
                                            currentSyntactiqBlueprint.status === 'Built & Verified'
                                              ? 'border-emerald-300/80 bg-emerald-100/80 text-emerald-900 dark:border-emerald-700/80 dark:bg-emerald-950/60 dark:text-emerald-200'
                                              : 'border-amber-300/80 bg-amber-100/80 text-amber-900 dark:border-amber-700/80 dark:bg-amber-950/60 dark:text-amber-200'
                                          }`}
                                        >
                                          STATUS: {currentSyntactiqBlueprint.status.toUpperCase()}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Mermaid Vector Diagram */}
                                    <MermaidRenderer
                                      code={currentSyntactiqBlueprint.mermaid}
                                      diagramId={`syntactiq-diagram-${currentSyntactiqBlueprint.id}`}
                                    />

                                    {/* 3 Technical Deep-Dive Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Interactions &amp; Handshakes
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentSyntactiqBlueprint.interactions}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Failure Modes &amp; Invariants
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentSyntactiqBlueprint.failureModes}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Production Trade-Offs
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentSyntactiqBlueprint.tradeOffs}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* --- Display Area: State Schema View --- */}
                                {activeExtraTab === 'schema' && (
                                  <div className="flex flex-col gap-5">
                                    <div className="border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                        LangGraph State Schema
                                      </span>
                                      <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                        MigrationState Channels &amp; Architecture Color Legend
                                      </h5>
                                    </div>

                                    <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                      <table className="w-full text-left font-mono text-xs">
                                        <thead>
                                          <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                            <th className="px-4 py-2.5 font-bold">Field Name</th>
                                            <th className="px-4 py-2.5 font-bold">Python Type</th>
                                            <th className="px-4 py-2.5 font-bold">Role &amp; Invariants</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                          {syntactiqStateSchema.map((item, i) => (
                                            <tr key={i} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                              <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                {item.field}
                                              </td>
                                              <td className="px-4 py-2.5 text-accent dark:text-pink-300 font-semibold">
                                                {item.type}
                                              </td>
                                              <td className="px-4 py-2.5 text-cocoa dark:text-white/85">
                                                {item.role}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Color Legend Card */}
                                    <div className="rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                      <span className="font-bold text-accent dark:text-pink-300">
                                        System Architecture Diagram Color Legend
                                      </span>
                                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                                        <div className="flex items-center gap-2 rounded border border-blue-200 bg-[#DBEAFE]/70 p-2 text-[#1E3A8A]">
                                          <span className="h-3 w-3 rounded-full bg-[#2563EB]" />
                                          <span className="font-semibold">Client (Next.js)</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded border border-emerald-200 bg-[#DCFCE7]/70 p-2 text-[#14532D]">
                                          <span className="h-3 w-3 rounded-full bg-[#16A34A]" />
                                          <span className="font-semibold">API (FastAPI)</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded border border-orange-200 bg-[#FFEDD5]/70 p-2 text-[#7C2D12]">
                                          <span className="h-3 w-3 rounded-full bg-[#EA580C]" />
                                          <span className="font-semibold">Broker (Redis)</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded border border-teal-200 bg-[#CCFBF1]/70 p-2 text-[#134E4A]">
                                          <span className="h-3 w-3 rounded-full bg-[#0D9488]" />
                                          <span className="font-semibold">Workers (Celery)</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded border border-purple-200 bg-[#EDE9FE]/70 p-2 text-[#4C1D95]">
                                          <span className="h-3 w-3 rounded-full bg-[#7C3AED]" />
                                          <span className="font-semibold">Agents (LangGraph)</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded border border-rose-200 bg-[#FFE4E6]/70 p-2 text-[#881337]">
                                          <span className="h-3 w-3 rounded-full bg-[#E11D48]" />
                                          <span className="font-semibold">Sandbox (Docker)</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded border border-amber-200 bg-[#FEF3C7]/70 p-2 text-[#78350F]">
                                          <span className="h-3 w-3 rounded-full bg-[#D97706]" />
                                          <span className="font-semibold">DB (PostgreSQL)</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded border border-slate-200 bg-[#F1F5F9]/70 p-2 text-[#0F172A]">
                                          <span className="h-3 w-3 rounded-full bg-[#475569]" />
                                          <span className="font-semibold">External (Gemini/GH)</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* --- Display Area: Verification Status View --- */}
                                {activeExtraTab === 'verification' && (
                                  <div className="flex flex-col gap-5">
                                    <div className="border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                        Repository Audit &amp; Verification Matrix
                                      </span>
                                      <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                        Subsystem Verification Breakdown (45 Automated Tests)
                                      </h5>
                                    </div>

                                    <div className="rounded-xl border border-pink-200/80 bg-white/80 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/30">
                                      <div className="flex items-center justify-between border-b border-pink-100 pb-2 dark:border-white/10">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Pytest Execution Summary (backend/app/agents/ &amp; backend/app/sandbox/)
                                        </span>
                                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
                                          44 PASSED, 1 SKIPPED (47.01s)
                                        </span>
                                      </div>
                                      <p className="mt-2 text-[11px] leading-relaxed text-ink/80 dark:text-white/80">
                                        Command: <code className="bg-black/5 px-1 py-0.5 rounded dark:bg-white/10">py -3.12 -m pytest backend/app/agents/ backend/app/sandbox/ -v</code>. Verified across commits e87d466 (LangGraph StateGraph), 2dbf144 (Docker sandbox), 3c4676a (pytest runner), 2bfaab8 (self-healing retry loop), and a54b9d1 (Gemini integration).
                                      </p>
                                    </div>

                                    <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                      <table className="w-full text-left font-mono text-xs">
                                        <thead>
                                          <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                            <th className="px-4 py-2.5 font-bold">Subsystem Component</th>
                                            <th className="px-4 py-2.5 font-bold">Status</th>
                                            <th className="px-4 py-2.5 font-bold">Test Coverage</th>
                                            <th className="px-4 py-2.5 font-bold">Implementation Detail &amp; Verification Evidence</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                          {syntactiqVerificationMatrix.map((item, i) => (
                                            <tr key={i} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                              <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                {item.subsystem}
                                              </td>
                                              <td className="px-4 py-2.5">
                                                <span
                                                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                                    item.status === 'Built & Verified'
                                                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                                                      : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                                                  }`}
                                                >
                                                  {item.status}
                                                </span>
                                              </td>
                                              <td className="px-4 py-2.5 font-semibold text-accent dark:text-pink-300">
                                                {item.testCoverage}
                                              </td>
                                              <td className="px-4 py-2.5 text-cocoa dark:text-white/85 text-[11px] leading-relaxed">
                                                <div>{item.implementationDetail}</div>
                                                <div className="mt-1 text-ink-soft dark:text-white/60 italic">{item.verificationEvidence}</div>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* --- Expandable Architecture Blueprint Viewer: RAG Document QA --- */}
                          <AnimatePresence>
                            {showBlueprints && isRag && (
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
                                    const isActive = activeExtraTab === 'none' && activeBlueprintDiagram === d.id;
                                    return (
                                      <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => {
                                          soundscape.playClickSound();
                                          setActiveExtraTab('none');
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
                                      setActiveExtraTab('constants');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'constants'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ Constants &amp; Contracts ]
                                  </button>
                                </div>

                                {/* --- Display Area: Selected Diagram or Constants --- */}
                                {activeExtraTab === 'none' ? (
                                  <div className="flex flex-col gap-5">
                                    {/* Diagram Title and Badge */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <div>
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Diagram 0{currentRagBlueprint.id} of 06
                                        </span>
                                        <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                          {currentRagBlueprint.title}
                                        </h5>
                                      </div>
                                      <span className="self-start sm:self-center rounded-md border border-pink-300/80 bg-pink-100/70 px-2.5 py-1 font-mono text-[11px] font-bold text-accent dark:border-pink-700/80 dark:bg-pink-950/60 dark:text-pink-200">
                                        {currentRagBlueprint.badge}
                                      </span>
                                    </div>

                                    {/* Mermaid Vector Diagram */}
                                    <MermaidRenderer
                                      code={currentRagBlueprint.mermaid}
                                      diagramId={`rag-diagram-${currentRagBlueprint.id}`}
                                    />

                                    {/* 3 Technical Deep-Dive Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Data Flow &amp; Interactions
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentRagBlueprint.interactions}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Failure Modes &amp; Degradation
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentRagBlueprint.failureModes}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Trade-Offs &amp; Scale Limits
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentRagBlueprint.tradeOffs}
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

                          {/* --- Expandable Architecture Blueprint Viewer: GitHub Activity ETL --- */}
                          <AnimatePresence>
                            {showBlueprints && isGithubEtl && (
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
                                    Data Engineering Blueprints &amp; Batch Pipeline Specifications
                                  </span>
                                  <h4 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                                    GitHub Activity ETL Pipeline Architecture
                                  </h4>
                                  <p className="max-w-2xl font-mono text-xs text-ink-soft dark:text-pink-200">
                                    Four system diagrams detailing daily GitHub Actions cron orchestration, idempotent SQLite loads, automated SQL anomaly alerts, and window-function analytical queries.
                                  </p>
                                </div>

                                {/* Choice Band in the Middle */}
                                <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-pink-200/80 bg-white/90 p-2 shadow-inner dark:border-white/15 dark:bg-black/40">
                                  {githubEtlDiagrams.map((d) => {
                                    const isActive = activeExtraTab === 'none' && activeBlueprintDiagram === d.id;
                                    return (
                                      <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => {
                                          soundscape.playClickSound();
                                          setActiveExtraTab('none');
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
                                      setActiveExtraTab('etl-schema');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'etl-schema'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ Schema &amp; Derived Fields ]
                                  </button>
                                </div>

                                {/* Display Area: Selected Diagram or Schema */}
                                {activeExtraTab === 'none' ? (
                                  <div className="flex flex-col gap-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <div>
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Diagram 0{currentGithubEtlBlueprint.id} of 04
                                        </span>
                                        <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                          {currentGithubEtlBlueprint.title}
                                        </h5>
                                      </div>
                                      <span className="self-start sm:self-center rounded-md border border-pink-300/80 bg-pink-100/70 px-2.5 py-1 font-mono text-[11px] font-bold text-accent dark:border-pink-700/80 dark:bg-pink-950/60 dark:text-pink-200">
                                        {currentGithubEtlBlueprint.badge}
                                      </span>
                                    </div>

                                    {/* Mermaid Vector Diagram */}
                                    <MermaidRenderer
                                      code={currentGithubEtlBlueprint.mermaid}
                                      diagramId={`github-etl-diagram-${currentGithubEtlBlueprint.id}`}
                                    />

                                    {/* 3 Technical Deep-Dive Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Interactions &amp; Handshakes
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentGithubEtlBlueprint.interactions}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Failure Modes &amp; Invariants
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentGithubEtlBlueprint.failureModes}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Production Trade-Offs
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentGithubEtlBlueprint.tradeOffs}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Schema & Derived Fields View */
                                  <div className="flex flex-col gap-6">
                                    <div className="border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                        Database Architecture
                                      </span>
                                      <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                        SQLite Tables, Write Strategies &amp; Derived Metrics
                                      </h5>
                                    </div>

                                    {/* Tables Schema Table */}
                                    <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                      <table className="w-full text-left font-mono text-xs">
                                        <thead>
                                          <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                            <th className="px-4 py-2.5 font-bold">Table</th>
                                            <th className="px-4 py-2.5 font-bold">Primary Key</th>
                                            <th className="px-4 py-2.5 font-bold">Write Strategy</th>
                                            <th className="px-4 py-2.5 font-bold">Business Rationale</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                          {githubEtlTables.map((t) => (
                                            <tr key={t.table} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                              <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                <code>{t.table}</code>
                                              </td>
                                              <td className="px-4 py-2.5 font-bold text-accent dark:text-pink-300">
                                                <code>{t.primaryKey}</code>
                                              </td>
                                              <td className="px-4 py-2.5">
                                                <span className="rounded bg-pink-100 px-1.5 py-0.5 text-[10px] font-bold text-accent dark:bg-pink-950 dark:text-pink-300">
                                                  {t.writeStrategy}
                                                </span>
                                              </td>
                                              <td className="px-4 py-2.5 text-cocoa dark:text-white/85 text-[11px] leading-relaxed">
                                                {t.rationale}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Derived Fields Table */}
                                    <div className="flex flex-col gap-2">
                                      <h6 className="font-mono text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                                        Derived &amp; Computed Fields (Feature Engineering)
                                      </h6>
                                      <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead>
                                            <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                              <th className="px-4 py-2.5 font-bold">Field</th>
                                              <th className="px-4 py-2.5 font-bold">Where Computed</th>
                                              <th className="px-4 py-2.5 font-bold">Definition</th>
                                              <th className="px-4 py-2.5 font-bold">Notes</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {githubEtlDerivedFields.map((f) => (
                                              <tr key={f.field} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                  <code>{f.field}</code>
                                                </td>
                                                <td className="px-4 py-2.5 text-[11px] text-accent dark:text-pink-300">
                                                  {f.computedWhere}
                                                </td>
                                                <td className="px-4 py-2.5 text-[11px] text-cocoa dark:text-white/80">
                                                  <code>{f.definition}</code>
                                                </td>
                                                <td className="px-4 py-2.5 text-[11px] leading-relaxed text-ink-soft dark:text-white/70">
                                                  {f.notes}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* SQL Snippets */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Idempotent Upsert Strategy (pipeline.py)
                                        </span>
                                        <pre className="max-h-56 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`-- Immutable facts: known sha is skipped
INSERT OR IGNORE INTO commits (sha, repo, author, message, committed_at)
VALUES (?, ?, ?, ?, ?);

-- State-shifting facts: latest values overwrite mutable fields
INSERT INTO pull_requests
  (id, repo, number, title, author, state, created_at, merged_at, hours_to_merge)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
  title          = excluded.title,
  state          = excluded.state,
  merged_at      = excluded.merged_at,
  hours_to_merge = excluded.hours_to_merge;`}
                                        </pre>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          SQL Heuristic Anomaly Evaluation (alerts.py)
                                        </span>
                                        <pre className="max-h-56 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`-- Rule 1: Inactivity detection (30+ days idle)
SELECT repo,
       julianday('now') - julianday(MAX(committed_at)) AS days_idle
FROM commits
GROUP BY repo
HAVING days_idle > 30;

-- Rule 2: Merge slowdown (recent vs historical mean)
SELECT repo,
       AVG(CASE WHEN merged_at >= datetime('now', '-30 days')
                THEN hours_to_merge END) AS recent_avg,
       AVG(hours_to_merge)               AS overall_avg
FROM pull_requests
WHERE merged_at IS NOT NULL
GROUP BY repo
HAVING recent_avg > 2 * overall_avg;`}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* --- Expandable Architecture Blueprint Viewer: Tickease --- */}
                          <AnimatePresence>
                            {showBlueprints && isTickease && (
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
                                    Full-Stack Architecture &amp; Cryptographic Invariants
                                  </span>
                                  <h4 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                                    Tickease Production Architecture
                                  </h4>
                                  <p className="max-w-2xl font-mono text-xs text-ink-soft dark:text-pink-200">
                                    Three comprehensive diagrams covering full-stack system topology, cryptographic HMAC-SHA256 QR ticket check-ins, and grounded conversational AI assistant pipelines.
                                  </p>
                                </div>

                                {/* Choice Band in the Middle */}
                                <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-pink-200/80 bg-white/90 p-2 shadow-inner dark:border-white/15 dark:bg-black/40">
                                  {tickeaseDiagrams.map((d) => {
                                    const isActive = activeExtraTab === 'none' && activeBlueprintDiagram === d.id;
                                    return (
                                      <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => {
                                          soundscape.playClickSound();
                                          setActiveExtraTab('none');
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
                                      setActiveExtraTab('tickease-invariants');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'tickease-invariants'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ Invariants &amp; Relational Schema ]
                                  </button>
                                </div>

                                {/* Display Area: Selected Diagram or Invariants */}
                                {activeExtraTab === 'none' ? (
                                  <div className="flex flex-col gap-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <div>
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Diagram 0{currentTickeaseBlueprint.id} of 03
                                        </span>
                                        <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                          {currentTickeaseBlueprint.title}
                                        </h5>
                                      </div>
                                      <span className="self-start sm:self-center rounded-md border border-pink-300/80 bg-pink-100/70 px-2.5 py-1 font-mono text-[11px] font-bold text-accent dark:border-pink-700/80 dark:bg-pink-950/60 dark:text-pink-200">
                                        {currentTickeaseBlueprint.badge}
                                      </span>
                                    </div>

                                    {/* Mermaid Vector Diagram */}
                                    <MermaidRenderer
                                      code={currentTickeaseBlueprint.mermaid}
                                      diagramId={`tickease-diagram-${currentTickeaseBlueprint.id}`}
                                    />

                                    {/* 3 Technical Deep-Dive Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Interactions &amp; Handshakes
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentTickeaseBlueprint.interactions}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Failure Modes &amp; Invariants
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentTickeaseBlueprint.failureModes}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Production Trade-Offs
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentTickeaseBlueprint.tradeOffs}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Invariants & Relational Schema View */
                                  <div className="flex flex-col gap-6">
                                    <div className="border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                        Cryptographic &amp; Relational Guarantees
                                      </span>
                                      <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                        System Invariants, PostgreSQL Schema &amp; Security RPCs
                                      </h5>
                                    </div>

                                    {/* Invariants Table */}
                                    <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                      <table className="w-full text-left font-mono text-xs">
                                        <thead>
                                          <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                            <th className="px-4 py-2.5 font-bold">Invariant</th>
                                            <th className="px-4 py-2.5 font-bold">Database &amp; Protocol Enforcement</th>
                                            <th className="px-4 py-2.5 font-bold">Failure Impact Mitigated</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                          {tickeaseInvariants.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                              <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                0{inv.id}. {inv.invariant}
                                              </td>
                                              <td className="px-4 py-2.5 text-accent dark:text-pink-300 text-[11px] leading-relaxed">
                                                {inv.enforcement}
                                              </td>
                                              <td className="px-4 py-2.5 text-cocoa dark:text-white/85 text-[11px] leading-relaxed">
                                                {inv.failureImpact}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Core Relational Schema Table */}
                                    <div className="flex flex-col gap-2">
                                      <h6 className="font-mono text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                                        Supabase PostgreSQL Core Schema &amp; Row-Level Security (RLS)
                                      </h6>
                                      <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead>
                                            <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                              <th className="px-4 py-2.5 font-bold">Table</th>
                                              <th className="px-4 py-2.5 font-bold">Columns &amp; Keys</th>
                                              <th className="px-4 py-2.5 font-bold">Constraints</th>
                                              <th className="px-4 py-2.5 font-bold">RLS Policies</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {tickeaseTables.map((tbl) => (
                                              <tr key={tbl.table} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                  <code>{tbl.table}</code>
                                                </td>
                                                <td className="px-4 py-2.5 text-[11px] text-cocoa dark:text-white/80">
                                                  {tbl.columns}
                                                </td>
                                                <td className="px-4 py-2.5 text-[10px] text-accent dark:text-pink-300">
                                                  <code>{tbl.constraints}</code>
                                                </td>
                                                <td className="px-4 py-2.5 text-[10px] leading-relaxed text-ink-soft dark:text-white/70">
                                                  {tbl.rlsPolicies}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Security Definer RPC Code Snippets */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Atomic Ticket Reservation RPC (reserve_tickets)
                                        </span>
                                        <pre className="max-h-56 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`create function reserve_tickets(p_tier uuid, p_qty int, p_key text, p_email text)
returns uuid language plpgsql security definer set search_path = public as $$
declare t ticket_tiers; o uuid;
begin
  select id into o from orders where idempotency_key = p_key;
  if found then return o; end if;
  select * into t from ticket_tiers where id = p_tier for update;
  if not found or now() not between t.sales_start and t.sales_end then
    raise exception 'tier_closed' using errcode = 'P0002'; end if;
  if t.sold + p_qty > t.capacity then
    raise exception 'sold_out' using errcode = 'P0001'; end if;
  update ticket_tiers set sold = sold + p_qty where id = p_tier;
  insert into orders(event_id, tier_id, quantity, status, idempotency_key, buyer_email,
                     total_minor, expires_at)
  values (t.event_id, p_tier, p_qty, 'pending', p_key, p_email,
          t.price_minor * p_qty, now() + interval '10 minutes')
  returning id into o;
  return o;
end $$;`}
                                        </pre>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Atomic Check-in &amp; Audit Log RPC (check_in_ticket)
                                        </span>
                                        <pre className="max-h-56 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`create function check_in_ticket(p_ticket uuid, p_event uuid, p_version smallint,
                                p_scan uuid, p_seq bigint)
returns table(outcome text, checked_in_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare t tickets; prior check_in_logs;
begin
  if not is_event_staff(p_event) then raise exception 'forbidden' using errcode='42501'; end if;
  select * into prior from check_in_logs where scan_id = p_scan;
  if found then
    return query select prior.outcome, (select tk.checked_in_at from tickets tk where tk.id = p_ticket);
    return;
  end if;
  select * into t from tickets where id = p_ticket for update;
  if not found then outcome := 'unknown_ticket';
  elsif t.event_id <> p_event then outcome := 'wrong_event';
  elsif t.status = 'void' or t.token_version <> p_version then outcome := 'void';
  elsif t.status = 'checked_in' then outcome := 'already_used';
  else
    update tickets set status='checked_in', checked_in_at=now(), checked_in_by=auth.uid() where id=p_ticket;
    outcome := 'accepted';
  end if;
  insert into check_in_logs(scan_id, ticket_id, event_id, scanner_id, outcome, device_seq)
  values (p_scan, case when t.id is null then null else p_ticket end, p_event, auth.uid(), outcome, p_seq);
  return query select outcome, (select tk.checked_in_at from tickets tk where tk.id = p_ticket);
end $$;`}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* --- Expandable Architecture Blueprint Viewer: Bloom For You --- */}
                          <AnimatePresence>
                            {showBlueprints && isBloom && (
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
                                    Temporal State Machine &amp; Cryptographic Sealing
                                  </span>
                                  <h4 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                                    Bloom For You Architectural Specification
                                  </h4>
                                  <p className="max-w-2xl font-mono text-xs text-ink-soft dark:text-pink-200">
                                    Three system diagrams detailing server-side secret sealing via capability URLs, zero-cron deterministic growth state resolution, and transactional watering micro-interactions.
                                  </p>
                                </div>

                                {/* Choice Band in the Middle */}
                                <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-pink-200/80 bg-white/90 p-2 shadow-inner dark:border-white/15 dark:bg-black/40">
                                  {bloomDiagrams.map((d) => {
                                    const isActive = activeExtraTab === 'none' && activeBlueprintDiagram === d.id;
                                    return (
                                      <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => {
                                          soundscape.playClickSound();
                                          setActiveExtraTab('none');
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
                                      setActiveExtraTab('bloom-invariants');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'bloom-invariants'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ Stages &amp; System Invariants ]
                                  </button>
                                </div>

                                {/* Display Area: Selected Diagram or Invariants */}
                                {activeExtraTab === 'none' ? (
                                  <div className="flex flex-col gap-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <div>
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Diagram 0{currentBloomBlueprint.id} of 03
                                        </span>
                                        <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                          {currentBloomBlueprint.title}
                                        </h5>
                                      </div>
                                      <span className="self-start sm:self-center rounded-md border border-pink-300/80 bg-pink-100/70 px-2.5 py-1 font-mono text-[11px] font-bold text-accent dark:border-pink-700/80 dark:bg-pink-950/60 dark:text-pink-200">
                                        {currentBloomBlueprint.badge}
                                      </span>
                                    </div>

                                    {/* Mermaid Vector Diagram */}
                                    <MermaidRenderer
                                      code={currentBloomBlueprint.mermaid}
                                      diagramId={`bloom-diagram-${currentBloomBlueprint.id}`}
                                    />

                                    {/* 3 Technical Deep-Dive Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Interactions &amp; Handshakes
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentBloomBlueprint.interactions}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Failure Modes &amp; Invariants
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentBloomBlueprint.failureModes}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Production Trade-Offs
                                        </span>
                                        <p className="font-sans text-xs leading-relaxed text-ink/90 dark:text-white/85">
                                          {currentBloomBlueprint.tradeOffs}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Stages & System Invariants View */
                                  <div className="flex flex-col gap-6">
                                    <div className="border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                        Temporal Lifecycles &amp; Security Controls
                                      </span>
                                      <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                        Growth Stages, Invariant Guarantees &amp; Database Gates
                                      </h5>
                                    </div>

                                    {/* Stages Table */}
                                    <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                      <table className="w-full text-left font-mono text-xs">
                                        <thead>
                                          <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                            <th className="px-4 py-2.5 font-bold">Stage</th>
                                            <th className="px-4 py-2.5 font-bold">Elapsed Window</th>
                                            <th className="px-4 py-2.5 font-bold">Duration</th>
                                            <th className="px-4 py-2.5 font-bold">SVG Visual State</th>
                                            <th className="px-4 py-2.5 font-bold">Note Sealing Status</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                          {bloomStages.map((stg) => (
                                            <tr key={stg.stage} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                              <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                {stg.stage}
                                              </td>
                                              <td className="px-4 py-2.5 font-bold text-accent dark:text-pink-300">
                                                <code>{stg.window}</code>
                                              </td>
                                              <td className="px-4 py-2.5 text-cocoa dark:text-white/80 text-[11px]">
                                                {stg.duration}
                                              </td>
                                              <td className="px-4 py-2.5 text-[11px] text-ink-soft dark:text-white/70 leading-relaxed">
                                                {stg.visualState}
                                              </td>
                                              <td className="px-4 py-2.5 text-[11px] leading-relaxed">
                                                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                                  stg.stage === 'Bloom'
                                                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                                                    : 'bg-rose/10 text-rose dark:bg-rose/20 dark:text-pink-300'
                                                }`}>
                                                  {stg.noteStatus}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Invariants Table */}
                                    <div className="flex flex-col gap-2">
                                      <h6 className="font-mono text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                                        Core Threat Model &amp; System Invariants
                                      </h6>
                                      <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead>
                                            <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                              <th className="px-4 py-2.5 font-bold">Invariant</th>
                                              <th className="px-4 py-2.5 font-bold">Enforcement Mechanism</th>
                                              <th className="px-4 py-2.5 font-bold">Failure Impact Mitigated</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {bloomInvariants.map((inv) => (
                                              <tr key={inv.id} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                  0{inv.id}. {inv.invariant}
                                                </td>
                                                <td className="px-4 py-2.5 text-accent dark:text-pink-300 text-[11px] leading-relaxed">
                                                  {inv.enforcement}
                                                </td>
                                                <td className="px-4 py-2.5 text-cocoa dark:text-white/85 text-[11px] leading-relaxed">
                                                  {inv.failureImpact}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* SQL Time Gate & Trigger Snippets */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          PostgreSQL Time Gate RPC (get_plant)
                                        </span>
                                        <pre className="max-h-56 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`-- Time gate evaluated strictly in SQL on database clock
create function public.get_plant(p_id uuid)
returns table (
  plant_id uuid, planted_at timestamptz, server_now timestamptz, elapsed_ms bigint,
  variety text, sender_name text, water_count bigint, note text)
language sql stable security definer set search_path = '' as $$
  select p.id,
         p.created_at,
         now(),
         floor(extract(epoch from (now() - p.created_at)) * 1000)::bigint,
         p.variety, p.sender_name, p.water_count,
         case when now() >= p.created_at + interval '72 hours' then s.note end
    from public.plants p
    left join public.plant_secrets s on s.plant_id = p.id
   where p.id = p_id;
$$;`}
                                        </pre>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Immutable Birth &amp; Monotonic Guard (plants_guard)
                                        </span>
                                        <pre className="max-h-56 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`-- Enforces created_at immutability and water_count monotonicity
create function public.plants_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.created_at is distinct from old.created_at then
    raise exception 'created_at is immutable' using errcode = '23514';
  end if;
  if new.water_count < old.water_count then
    raise exception 'water_count is monotonic' using errcode = '23514';
  end if;
  return new;
end $$;

create trigger plants_guard before update on public.plants
  for each row execute function public.plants_guard();`}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* --- Expandable Architecture Blueprint Viewer: A Little Scrapbook --- */}
                          <AnimatePresence>
                            {showBlueprints && isScrapbook && (
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
                                    Spatial Physics Engine &amp; Procedural Web Audio Synthesis
                                  </span>
                                  <h4 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                                    A Little Scrapbook Architectural Specification
                                  </h4>
                                  <p className="max-w-2xl font-mono text-xs text-ink-soft dark:text-pink-200">
                                    Three interactive system diagrams covering Framer Motion spring physics with rotated AABB clamping, real-time procedural Web Audio synthesis graphs, and multi-page IndexedDB draft sync with OffscreenCanvas worker export.
                                  </p>
                                </div>

                                {/* Choice Band in the Middle */}
                                <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-pink-200/80 bg-white/90 p-2 shadow-inner dark:border-white/15 dark:bg-black/40">
                                  {scrapbookDiagrams.map((d) => {
                                    const isActive = activeExtraTab === 'none' && activeBlueprintDiagram === d.id;
                                    return (
                                      <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => {
                                          soundscape.playClickSound();
                                          setActiveExtraTab('none');
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
                                      setActiveExtraTab('scrapbook-invariants');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'scrapbook-invariants'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ Invariants &amp; Budgets ]
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      soundscape.playClickSound();
                                      setActiveExtraTab('scrapbook-audio');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'scrapbook-audio'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ Audio Synthesis &amp; Math ]
                                  </button>
                                </div>

                                {/* Display Area */}
                                {activeExtraTab === 'none' ? (
                                  <div className="flex flex-col gap-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <div>
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Diagram 0{currentScrapbookBlueprint.id} of 03
                                        </span>
                                        <h5 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                                          {currentScrapbookBlueprint.title}
                                        </h5>
                                      </div>
                                      <span className="rounded-full bg-pink-100/80 px-3 py-1 font-mono text-xs font-bold text-accent dark:bg-white/10 dark:text-pink-200">
                                        {currentScrapbookBlueprint.badge}
                                      </span>
                                    </div>

                                    {/* Mermaid Diagram Box */}
                                    <div className="rounded-2xl border-2 border-pink-200/80 bg-white p-4 shadow-sm dark:border-white/15 dark:bg-[#1E1226]">
                                      <MermaidRenderer
                                        code={currentScrapbookBlueprint.mermaid}
                                        diagramId={`scrapbook-diagram-${currentScrapbookBlueprint.id}`}
                                      />
                                    </div>

                                    {/* Deep Dive Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="rounded-xl border border-pink-200/80 bg-paper/60 p-4 font-mono text-xs dark:border-white/10 dark:bg-white/5">
                                        <span className="font-bold text-accent dark:text-pink-300 uppercase tracking-wider block mb-1">
                                          Interactions &amp; Handshakes
                                        </span>
                                        <p className="leading-relaxed text-cocoa dark:text-pink-100 text-[11px]">
                                          {currentScrapbookBlueprint.interactions}
                                        </p>
                                      </div>

                                      <div className="rounded-xl border border-pink-200/80 bg-paper/60 p-4 font-mono text-xs dark:border-white/10 dark:bg-white/5">
                                        <span className="font-bold text-accent dark:text-pink-300 uppercase tracking-wider block mb-1">
                                          Failure Modes &amp; Recovery
                                        </span>
                                        <p className="leading-relaxed text-cocoa dark:text-pink-100 text-[11px]">
                                          {currentScrapbookBlueprint.failureModes}
                                        </p>
                                      </div>

                                      <div className="rounded-xl border border-pink-200/80 bg-paper/60 p-4 font-mono text-xs dark:border-white/10 dark:bg-white/5">
                                        <span className="font-bold text-accent dark:text-pink-300 uppercase tracking-wider block mb-1">
                                          Production Trade-Offs
                                        </span>
                                        <p className="leading-relaxed text-cocoa dark:text-pink-100 text-[11px]">
                                          {currentScrapbookBlueprint.tradeOffs}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : activeExtraTab === 'scrapbook-invariants' ? (
                                  <div className="flex flex-col gap-6">
                                    {/* System Budgets Table */}
                                    <div className="flex flex-col gap-2">
                                      <h6 className="font-mono text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                                        Rigorous Production Budgets (Hard Limits)
                                      </h6>
                                      <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead>
                                            <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                              <th className="px-4 py-2.5 font-bold">Budget Domain</th>
                                              <th className="px-4 py-2.5 font-bold">Hard Limit</th>
                                              <th className="px-4 py-2.5 font-bold">Production Enforcement Policy</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {scrapbookBudgets.map((b) => (
                                              <tr key={b.budget} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                  {b.budget}
                                                </td>
                                                <td className="px-4 py-2.5 text-accent dark:text-pink-300 font-bold">
                                                  {b.limit}
                                                </td>
                                                <td className="px-4 py-2.5 text-cocoa dark:text-white/85 text-[11px] leading-relaxed">
                                                  {b.policy}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* System Invariants Table */}
                                    <div className="flex flex-col gap-2">
                                      <h6 className="font-mono text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                                        Seven Core System Invariants
                                      </h6>
                                      <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead>
                                            <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                              <th className="px-4 py-2.5 font-bold">#</th>
                                              <th className="px-4 py-2.5 font-bold">Invariant Name</th>
                                              <th className="px-4 py-2.5 font-bold">Runtime Enforcement Rule</th>
                                              <th className="px-4 py-2.5 font-bold">Failure Impact Mitigated</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {scrapbookInvariants.map((inv) => (
                                              <tr key={inv.id} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className="px-3 py-2.5 font-bold text-accent dark:text-pink-300">
                                                  0{inv.id}
                                                </td>
                                                <td className="px-4 py-2.5 font-bold text-ink dark:text-white">
                                                  {inv.invariant}
                                                </td>
                                                <td className="px-4 py-2.5 text-accent dark:text-pink-300 text-[11px] leading-relaxed">
                                                  {inv.enforcement}
                                                </td>
                                                <td className="px-4 py-2.5 text-cocoa dark:text-white/85 text-[11px] leading-relaxed">
                                                  {inv.failureImpact}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Serialized Schema & AABB Clamping Code Snippets */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Serialized Schema Definition (Data Model)
                                        </span>
                                        <pre className="max-h-56 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`type Album = {
  schemaVersion: 1;
  id: string; // uuid
  title: string;
  pageSize: { w: number; h: number };
  pageIds: string[]; // page order
  revision: number;  // monotonic, bumped on write
};

type Page = {
  id: string;
  revision: number;  // used for If-Match
  updatedAt: string;
  background: { kind: 'color' | 'texture'; value: string };
  items: Item[];     // bottom to top (array order = z-order)
};

type Base = {
  id: string;
  cx: number; cy: number; // logical units, quantized to 0.1
  w: number; h: number;   // at least 16
  rotation: number;       // degrees in [-180, 180)
  scale: number;          // in [0.25, 4]
  locked?: boolean;
};`}
                                        </pre>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Rotated AABB Boundary Solver (MIN_VISIBLE)
                                        </span>
                                        <pre className="max-h-56 overflow-auto rounded bg-black/5 p-3 text-[11px] leading-snug text-cocoa dark:bg-black/40 dark:text-pink-100">
{`export function aabbHalf(w: number, h: number, s: number, deg: number) {
  const r = (deg * Math.PI) / 180;
  const c = Math.abs(Math.cos(r)), n = Math.abs(Math.sin(r));
  return {
    hx: (s / 2) * (w * c + h * n),
    hy: (s / 2) * (w * n + h * c),
  };
}

// Limits for item CENTER ensuring minVis (32px) remains visible
export function centerLimits(page: { w: number; h: number }, hx: number, hy: number, minVis = 32) {
  const vx = Math.min(minVis, 2 * hx), vy = Math.min(minVis, 2 * hy);
  return {
    minX: vx - hx,
    maxX: page.w - vx + hx,
    minY: vy - hy,
    maxY: page.h - vy + hy,
  };
}`}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* activeExtraTab === 'scrapbook-audio' */
                                  <div className="flex flex-col gap-6">
                                    {/* Audio Synthesizer Voice Table */}
                                    <div className="flex flex-col gap-2">
                                      <h6 className="font-mono text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                                        Web Audio API Procedural Oscillator &amp; Spatial Schema
                                      </h6>
                                      <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/30">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead>
                                            <tr className="border-b border-pink-200/80 bg-paper/90 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                                              <th className="px-3 py-2.5 font-bold">Action</th>
                                              <th className="px-3 py-2.5 font-bold">Interaction Trigger</th>
                                              <th className="px-3 py-2.5 font-bold">Source Nodes</th>
                                              <th className="px-3 py-2.5 font-bold">Filter Specification</th>
                                              <th className="px-3 py-2.5 font-bold">Envelope (t60)</th>
                                              <th className="px-3 py-2.5 font-bold">Spatial Transform</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {scrapbookAudioActions.map((aud) => (
                                              <tr key={aud.action} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className="px-3 py-2.5 font-bold text-accent dark:text-pink-300">
                                                  {aud.action}
                                                </td>
                                                <td className="px-3 py-2.5 font-bold text-ink dark:text-white text-[11px]">
                                                  {aud.trigger}
                                                </td>
                                                <td className="px-3 py-2.5 text-cocoa dark:text-pink-100 text-[10px] leading-snug">
                                                  {aud.sourceNodes}
                                                </td>
                                                <td className="px-3 py-2.5 text-cocoa dark:text-white/85 text-[10px] leading-snug">
                                                  {aud.filter}
                                                </td>
                                                <td className="px-3 py-2.5 text-accent dark:text-pink-300 text-[10px]">
                                                  {aud.envelope}
                                                </td>
                                                <td className="px-3 py-2.5 text-cocoa dark:text-pink-100 text-[10px]">
                                                  {aud.spatialTransform}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Transform Matrix & Spring Physics Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Item Transform Matrix &amp; 3D Page Flip Matrix
                                        </span>
                                        <div className="space-y-2 rounded bg-black/5 p-3 text-[11px] leading-relaxed text-cocoa dark:bg-black/40 dark:text-pink-100">
                                          <p className="font-bold">Item-Local to Page Coordinate Matrix:</p>
                                          <code className="block bg-white/60 p-2 rounded dark:bg-black/30 text-[10px]">
                                            M = T(cx, cy) · R(θ) · S(s) · T(-w/2, -h/2)
                                          </code>
                                          <p className="pt-1 font-bold">3D Perspective Page Flip Matrix:</p>
                                          <code className="block bg-white/60 p-2 rounded dark:bg-black/30 text-[10px]">
                                            M3D = P(d) · Ry(φ)  [d = 1800px, φ: 0° → -180°]
                                          </code>
                                          <p className="text-[10px] text-ink-soft dark:text-white/70 pt-1">
                                            DOM Framer Motion transforms and OffscreenCanvas export worker execute this identical composition, ensuring 100% pixel parity.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Damped Harmonic Oscillator &amp; Velocity Sway
                                        </span>
                                        <div className="space-y-2 rounded bg-black/5 p-3 text-[11px] leading-relaxed text-cocoa dark:bg-black/40 dark:text-pink-100">
                                          <p className="font-bold">Damped Harmonic Oscillator Equation:</p>
                                          <code className="block bg-white/60 p-2 rounded dark:bg-black/30 text-[10px]">
                                            m·x&apos;&apos; + c·x&apos; + k·(x - target) = 0,  ζ = c / (2·√(k·m))
                                          </code>
                                          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                                            <div className="rounded bg-white/60 p-1.5 dark:bg-black/30">
                                              <span className="font-bold text-accent">Position Settle:</span>
                                              <p>k=420, c=32, m=1 (ζ=0.78, tactile paper settle)</p>
                                            </div>
                                            <div className="rounded bg-white/60 p-1.5 dark:bg-black/30">
                                              <span className="font-bold text-accent">Lift / Drop Scale:</span>
                                              <p>k=500, c=30, m=1 (ζ=0.67, quick responsive bounce)</p>
                                            </div>
                                          </div>
                                          <p className="text-[10px] text-ink-soft dark:text-white/70">
                                            Dynamic velocity sway: sway = spring(clamp(vx / 60, -6, 6)) adds organic physical tilt without altering persistent saved coordinates.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* --- Expandable Architecture Blueprint Viewer: Custom HTTP/1.1 Server in C --- */}
                          <AnimatePresence>
                            {showBlueprints && isHttpServer && (
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
                                    POSIX Network Systems &amp; Zero-Copy Streaming Pipeline
                                  </span>
                                  <h4 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                                    Custom HTTP/1.1 Server in C Architectural Specification
                                  </h4>
                                  <p className="max-w-2xl font-mono text-xs text-ink-soft dark:text-pink-200">
                                    Three interactive system diagrams covering POSIX non-blocking listener with pre-threaded worker concurrency, a zero-copy DFA request parser, and kernel-contained static file streaming via openat2() and sendfile().
                                  </p>
                                </div>

                                {/* Choice Band */}
                                <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-pink-200/80 bg-white/90 p-2 shadow-inner dark:border-white/15 dark:bg-black/40">
                                  {httpServerDiagrams.map((d) => {
                                    const isActive = activeExtraTab === 'none' && activeBlueprintDiagram === d.id;
                                    return (
                                      <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => {
                                          soundscape.playClickSound();
                                          setActiveExtraTab('none');
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
                                      setActiveExtraTab('http-invariants');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'http-invariants'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ Invariants &amp; Limits ]
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      soundscape.playClickSound();
                                      setActiveExtraTab('http-transitions');
                                    }}
                                    className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                                      activeExtraTab === 'http-transitions'
                                        ? 'border border-pink-400 bg-accent text-white shadow-sm ring-2 ring-accent/30 dark:border-pink-300'
                                        : 'text-cocoa hover:bg-pink-100/70 dark:text-pink-100 dark:hover:bg-white/10'
                                    }`}
                                  >
                                    [ State Machine &amp; Status Codes ]
                                  </button>
                                </div>

                                {/* Tab Body Content */}
                                {activeExtraTab === 'none' ? (
                                  <div className="flex flex-col gap-6">
                                    {/* Active Diagram Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-200/60 pb-3 dark:border-white/10">
                                      <div>
                                        <span className="font-mono text-[10px] font-bold text-accent dark:text-pink-300">
                                          Diagram 0{currentHttpBlueprint.id} of 03
                                        </span>
                                        <h5 className="font-display text-lg font-bold text-ink dark:text-white">
                                          {currentHttpBlueprint.title}
                                        </h5>
                                      </div>
                                      <span className="self-start sm:self-center rounded-full border border-pink-300/80 bg-pink-100/80 px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent dark:border-pink-800 dark:bg-pink-950/60 dark:text-pink-200">
                                        {currentHttpBlueprint.badge}
                                      </span>
                                    </div>

                                    {/* Mermaid SVG Diagram Container */}
                                    <div className="overflow-x-auto rounded-2xl border-2 border-pink-200/80 bg-white/95 p-4 shadow-sm dark:border-white/15 dark:bg-[#1A1220]/95">
                                      <MermaidRenderer
                                        code={currentHttpBlueprint.mermaid}
                                        diagramId={`http-diagram-${currentHttpBlueprint.id}`}
                                      />
                                    </div>

                                    {/* Tri-Pane Technical Deep Dive Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {/* Card 1: Interactions */}
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Component Interactions &amp; Handshake
                                        </span>
                                        <p className="text-[11px] leading-relaxed text-cocoa dark:text-pink-100">
                                          {currentHttpBlueprint.interactions}
                                        </p>
                                      </div>

                                      {/* Card 2: Failure Modes */}
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Failure Modes &amp; Mitigation Strategies
                                        </span>
                                        <p className="text-[11px] leading-relaxed text-cocoa dark:text-pink-100">
                                          {currentHttpBlueprint.failureModes}
                                        </p>
                                      </div>

                                      {/* Card 3: Trade-Offs */}
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Production Trade-offs &amp; Alternatives
                                        </span>
                                        <p className="text-[11px] leading-relaxed text-cocoa dark:text-pink-100">
                                          {currentHttpBlueprint.tradeOffs}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : activeExtraTab === 'http-invariants' ? (
                                  /* Invariants & Limits Tab */
                                  <div className="flex flex-col gap-6">
                                    {/* Invariants Table */}
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          System Invariants (8 Core System Guarantees)
                                        </h5>
                                        <span className="rounded bg-pink-100 px-2 py-0.5 font-mono text-[10px] font-bold text-accent dark:bg-white/10 dark:text-pink-200">
                                          Production Hard Invariants
                                        </span>
                                      </div>

                                      <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/20">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead className="border-b border-pink-200/80 bg-blush/40 dark:border-white/10 dark:bg-white/5">
                                            <tr>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">ID</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Invariant</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Kernel &amp; App Enforcement</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Failure Impact &amp; Security Guarantee</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {httpServerInvariants.map((inv) => (
                                              <tr key={inv.id} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className="px-3 py-2 font-bold text-accent dark:text-pink-300">0{inv.id}</td>
                                                <td className="px-3 py-2 font-bold text-ink dark:text-white">{inv.invariant}</td>
                                                <td className="px-3 py-2 text-cocoa dark:text-pink-100 text-[11px] leading-relaxed">{inv.enforcement}</td>
                                                <td className="px-3 py-2 text-ink-soft dark:text-white/80 text-[11px] leading-relaxed">{inv.failureImpact}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Limits Table */}
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          Hard Resource Limits &amp; Absolute Timeouts
                                        </h5>
                                        <span className="rounded bg-pink-100 px-2 py-0.5 font-mono text-[10px] font-bold text-accent dark:bg-white/10 dark:text-pink-200">
                                          Zero Indefinite Blocks
                                        </span>
                                      </div>

                                      <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/20">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead className="border-b border-pink-200/80 bg-blush/40 dark:border-white/10 dark:bg-white/5">
                                            <tr>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Constant</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Configured Value</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Over-Limit Behavior &amp; Status Code</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {httpServerLimits.map((l) => (
                                              <tr key={l.limit} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className="px-3 py-2 font-bold text-accent dark:text-pink-300">{l.limit}</td>
                                                <td className="px-3 py-2 font-bold text-ink dark:text-white">{l.value}</td>
                                                <td className="px-3 py-2 text-cocoa dark:text-pink-100 text-[11px]">{l.overLimitBehavior}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Architecture Deep Dive Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Pre-Threaded Concurrency &amp; Memory Bounds
                                        </span>
                                        <div className="space-y-1.5 rounded bg-black/5 p-3 text-[11px] leading-relaxed text-cocoa dark:bg-black/40 dark:text-pink-100">
                                          <p className="font-bold">Total Memory Ceiling:</p>
                                          <code className="block bg-white/60 p-2 rounded dark:bg-black/30 text-[10px]">
                                            Memory = N_workers × (~88 KiB) + QCAP × sizeof(int)
                                          </code>
                                          <p className="text-[10px] text-ink-soft dark:text-white/70 pt-1">
                                            For 64 workers, entire server footprint is ~5.5 MiB; for 256 workers, ~22 MiB. Zero malloc() on the hot request path eliminates lock contention, fragmentation, and heap exhaustion.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Kernel-Level Containment (openat2)
                                        </span>
                                        <div className="space-y-1.5 rounded bg-black/5 p-3 text-[11px] leading-relaxed text-cocoa dark:bg-black/40 dark:text-pink-100">
                                          <p className="font-bold">Linux 5.6+ openat2 Sandbox Flags:</p>
                                          <code className="block bg-white/60 p-2 rounded dark:bg-black/30 text-[10px]">
                                            how.flags = O_RDONLY | O_CLOEXEC | O_NONBLOCK;<br/>
                                            how.resolve = RESOLVE_BENEATH | RESOLVE_NO_SYMLINKS;
                                          </code>
                                          <p className="text-[10px] text-ink-soft dark:text-white/70 pt-1">
                                            Eliminates TOCTOU race conditions with concurrent directory renames. Opening a FIFO with O_NONBLOCK returns immediately instead of blocking worker indefinitely.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* State Machine & Status Codes Tab */
                                  <div className="flex flex-col gap-6">
                                    {/* Transition Table */}
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          DFA Tokenizer State Transitions (15 Core States)
                                        </h5>
                                        <span className="rounded bg-pink-100 px-2 py-0.5 font-mono text-[10px] font-bold text-accent dark:bg-white/10 dark:text-pink-200">
                                          Zero-Copy slice_t Offsets
                                        </span>
                                      </div>

                                      <div className="max-h-96 overflow-y-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/20">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead className="sticky top-0 border-b border-pink-200/80 bg-blush dark:border-white/10 dark:bg-[#25182E]">
                                            <tr>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Current State</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Input Byte</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Next State</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Buffer Slice Action</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Error Condition</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {httpParserTransitions.map((t, idx) => (
                                              <tr key={idx} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className="px-3 py-2 font-bold text-accent dark:text-pink-300 text-[11px]">{t.currentState}</td>
                                                <td className="px-3 py-2 font-bold text-ink dark:text-white text-[11px]">{t.inputByte}</td>
                                                <td className="px-3 py-2 text-cocoa dark:text-pink-200 text-[11px] font-semibold">{t.nextState}</td>
                                                <td className="px-3 py-2 text-ink-soft dark:text-white/80 text-[10px] leading-snug">{t.bufferAction}</td>
                                                <td className={`px-3 py-2 text-[10px] font-medium ${t.errorCondition === 'none' ? 'text-ink-soft dark:text-white/60' : 'text-rose font-bold dark:text-rose'}`}>{t.errorCondition}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Status Codes Table */}
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                                          HTTP Status Code Mapping
                                        </h5>
                                        <span className="rounded bg-pink-100 px-2 py-0.5 font-mono text-[10px] font-bold text-accent dark:bg-white/10 dark:text-pink-200">
                                          RFC 9110 / 9112 Conformance
                                        </span>
                                      </div>

                                      <div className="overflow-x-auto rounded-xl border border-pink-200/80 bg-white/80 dark:border-white/10 dark:bg-black/20">
                                        <table className="w-full text-left font-mono text-xs">
                                          <thead className="border-b border-pink-200/80 bg-blush/40 dark:border-white/10 dark:bg-white/5">
                                            <tr>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Status</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Reason Phrase</th>
                                              <th className="px-3 py-2 font-bold text-ink dark:text-white">Trigger Condition</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-pink-100 dark:divide-white/5">
                                            {httpStatusMappings.map((st) => (
                                              <tr key={st.code} className="hover:bg-pink-50/50 dark:hover:bg-white/5">
                                                <td className={`px-3 py-2 font-bold ${st.code >= 400 ? 'text-rose' : 'text-accent dark:text-pink-300'}`}>
                                                  {st.code}
                                                </td>
                                                <td className="px-3 py-2 font-bold text-ink dark:text-white">{st.phrase}</td>
                                                <td className="px-3 py-2 text-cocoa dark:text-pink-100 text-[11px]">{st.trigger}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* C Structures Card */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Zero-Copy C Slices (slice_t &amp; header_t)
                                        </span>
                                        <div className="space-y-1.5 rounded bg-black/5 p-3 text-[11px] leading-relaxed text-cocoa dark:bg-black/40 dark:text-pink-100">
                                          <code className="block bg-white/60 p-2 rounded dark:bg-black/30 text-[10px]">
                                            typedef struct &#123; uint32_t off, len; &#125; slice_t;<br/>
                                            typedef struct &#123; slice_t name, value; &#125; header_t;<br/>
                                            typedef struct &#123; ... header_t hdr[64]; &#125; http_parser_t;
                                          </code>
                                          <p className="text-[10px] text-ink-soft dark:text-white/70 pt-1">
                                            Slices store {`{off, len}`} offsets instead of pointers, remaining valid even if the receive buffer shifts during pipelined request consumption.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-2 rounded-xl border border-pink-200/70 bg-white/70 p-4 font-mono text-xs dark:border-white/10 dark:bg-black/25">
                                        <span className="font-bold text-accent dark:text-pink-300">
                                          Zero-Copy sendfile() &amp; Lingering Close
                                        </span>
                                        <div className="space-y-1.5 rounded bg-black/5 p-3 text-[11px] leading-relaxed text-cocoa dark:bg-black/40 dark:text-pink-100">
                                          <code className="block bg-white/60 p-2 rounded dark:bg-black/30 text-[10px]">
                                            send(sock, hdr, len, MSG_MORE | MSG_NOSIGNAL);<br/>
                                            sendfile(sock, file_fd, &amp;offset, 1 * 1024 * 1024);<br/>
                                            shutdown(sock, SHUT_WR); // linger_close()
                                          </code>
                                          <p className="text-[10px] text-ink-soft dark:text-white/70 pt-1">
                                            Page cache pages stream directly to socket with NIC checksum offload. Lingering close reads and discards pending client bytes to prevent TCP RST generation.
                                          </p>
                                        </div>
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

                  {/* --- Fullscreen Game (fills entire workspace when active) --- */}
                  {showGame && (
                    <div className="absolute inset-0 z-40 flex flex-col overflow-hidden">
                      <CozyRunner />
                      {/* Floating back button */}
                      <div className="pointer-events-auto absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            soundscape.playClickSound();
                            setShowGame(false);
                            if (projects.length > 0) setActiveProject(projects[0]);
                          }}
                          className="rounded-full border border-pink-300/80 bg-paper/95 px-3 py-1 font-mono text-[10px] font-bold text-ink shadow-xs backdrop-blur-xs hover:bg-rose hover:text-white transition-all active:scale-95 dark:border-white/20 dark:bg-black/70 dark:text-white"
                        >
                          ✕ Back to projects
                        </button>
                      </div>
                    </div>
                  )}
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
