'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { soundscape } from '@/lib/soundEngine';
import { tabletData, type PlaylistTrack, type BlogPost } from '@/data/tablet';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  rotation: number;
}

export default function BedroomTablet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [mounted, setMounted] = useState(false);

  // Tablet app state
  const { spotifyPlaylist, currentlyReading, blogs } = tabletData;
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string>(blogs[0]?.slug ?? '');
  const [mobileTab, setMobileTab] = useState<'blogs' | 'music' | 'reading'>('blogs');

  // Song of the day rotation (based on calendar day of the year)
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    setCurrentSongIndex(dayOfYear % spotifyPlaylist.tracks.length);
  }, [spotifyPlaylist.tracks.length]);

  // Manage body scroll and hide navbar/headings while open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('tablet-modal-open');
    } else {
      document.body.classList.remove('tablet-modal-open');
    }
    return () => {
      document.body.classList.remove('tablet-modal-open');
    };
  }, [isOpen]);

  // Escape key listener to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    soundscape.playSparkleSound();
    setIsFloating(true);

    // Generate sparkle trail along trajectory from bedside table (x: 71.2%, y: 53%) to center (x: 50%, y: 50%)
    const newSparkles: SparkleParticle[] = Array.from({ length: 18 }).map((_, i) => {
      const progress = i / 17;
      const baseX = 71.2 - progress * 21.2;
      const baseY = 53.0 + Math.sin(progress * Math.PI) * -8 + progress * -3.0;
      const jitterX = (Math.random() - 0.5) * 6;
      const jitterY = (Math.random() - 0.5) * 6;
      const colors = ['#C4B5FD', '#F472B6', '#FFFFFF', '#FBCFE8', '#DDD6FE'];
      return {
        id: i,
        x: baseX + jitterX,
        y: baseY + jitterY,
        size: Math.random() * 9 + 6,
        color: colors[i % colors.length],
        delay: progress * 0.28,
        rotation: Math.random() * 360,
      };
    });
    setSparkles(newSparkles);

    // Smoothly transition from floating to full-screen overlay
    setTimeout(() => {
      setIsFloating(false);
      setIsOpen(true);
    }, 560);
  };

  const handleClose = () => {
    soundscape.playSparkleSound();
    setIsOpen(false);
    setIsPlaying(false);
  };

  const currentSong: PlaylistTrack =
    spotifyPlaylist.tracks[currentSongIndex] ?? spotifyPlaylist.tracks[0];
  const selectedBlog: BlogPost =
    blogs.find((b) => b.slug === selectedBlogSlug) ?? blogs[0];

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % spotifyPlaylist.tracks.length);
  };

  const handlePrevSong = () => {
    setCurrentSongIndex(
      (prev) => (prev - 1 + spotifyPlaylist.tracks.length) % spotifyPlaylist.tracks.length
    );
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    soundscape.playSparkleSound();
  };

  return (
    <>
      {/* 1. RESTING TABLETOP TABLET ON NIGHTSTAND */}
      {!isFloating && !isOpen && (
        <div
          className="group absolute z-20 cursor-pointer select-none"
          style={{
            left: '71.2%',
            top: '53.0%',
            width: '6.2%',
            maxWidth: '78px',
            minWidth: '46px',
            aspectRatio: '1751 / 2046',
            transform: 'translate(-50%, -50%) rotate(1deg)',
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
          aria-label="Open Tablet"
        >
          {/* Subtle soft cast shadow on the nightstand table top */}
          <div className="absolute -bottom-1.5 inset-x-1.5 h-3 rounded-full bg-black/25 blur-[2.5px]" />

          {/* Resting Tablet Art */}
          <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-108 group-hover:-translate-y-1">
            <Image
              src="/assets/objects/bedroom-tablet.png"
              alt="Suto's iPad resting on the nightstand"
              fill
              sizes="(max-width: 768px) 60px, 85px"
              className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
              priority
            />

            {/* Glowing Hotspot Button positioned in lower center of tablet screen */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{ top: '64%', left: '50%' }}
            >
              <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center">
                {/* Outer pulsing radiant halo */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-[#E879F9]/50 animate-ping-soft"
                />

                {/* Secondary breathing ring */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0.5 rounded-full bg-white/70 animate-pulse"
                />

                {/* Main vibrant lavender-rose button */}
                <span className="relative flex h-6.5 w-6.5 sm:h-7.5 sm:w-7.5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#F472B6] via-[#D946EF] to-[#9333EA] text-white shadow-[0_0_12px_rgba(217,70,239,0.7),0_3px_8px_rgba(0,0,0,0.28)] transition-all duration-300 group-hover:scale-115 group-hover:shadow-[0_0_18px_rgba(244,114,182,0.95)]">
                  {/* Glossy top-left bubble highlight */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0.5 left-1 h-1.5 w-2 rounded-full bg-white/60 blur-[0.3px] -rotate-12"
                  />

                  {/* Tablet / Sparkle Icon */}
                  <svg
                    className="h-3 w-3 sm:h-3.5 sm:w-3.5 drop-shadow-sm text-white transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FLOATING ANIMATION & SPARKLE TRAIL */}
      <AnimatePresence>
        {isFloating && (
          <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
            {/* Sparkle particles along the trajectory */}
            {sparkles.map((sp) => (
              <motion.div
                key={sp.id}
                initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.4, 1.1, 0],
                  y: ['-50%', '-20px'],
                  rotate: [sp.rotation, sp.rotation + 90],
                }}
                transition={{
                  duration: 0.65,
                  delay: sp.delay,
                  ease: 'easeOut',
                }}
                className="absolute"
                style={{
                  left: `${sp.x}%`,
                  top: `${sp.y}%`,
                  width: `${sp.size}px`,
                  height: `${sp.size}px`,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={sp.color}
                  className="h-full w-full drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]"
                >
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>
            ))}

            {/* Closed tablet floating from nightstand into screen center */}
            <motion.div
              initial={{
                left: '71.2%',
                top: '53.0%',
                x: '-50%',
                y: '-50%',
                scale: 1,
                rotate: 1,
              }}
              animate={{
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                scale: [1, 1.8, 3.0],
                rotate: [1, -3, 0],
              }}
              transition={{
                duration: 0.58,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute z-50 w-[78px] aspect-[1751/2046]"
            >
              <Image
                src="/assets/objects/bedroom-tablet.png"
                alt="Floating Tablet"
                fill
                className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                priority
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. OPEN TABLET FULL-SCREEN MODAL OVERLAY */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="diary-book-modal fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-8 select-none">
                {/* Dimmed backdrop covering entire screen */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleClose}
                  className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                  aria-hidden="true"
                />

                {/* Tablet Frame Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full max-w-4xl aspect-[1599/1192] max-h-[92vh] flex items-center justify-center"
                >
                  {/* Tablet Frame Image */}
                  <div className="absolute inset-0 pointer-events-none select-none">
                    <Image
                      src="/assets/objects/bedroom-tablet-open.png"
                      alt="Open iPad frame"
                      fill
                      sizes="(max-width: 1024px) 96vw, 1100px"
                      className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
                      priority
                    />
                  </div>

                  {/* Close Button: Glossy Pink Bubble in Top Right Corner */}
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close Tablet"
                    className="group absolute -top-3 right-0 sm:top-1 sm:right-3 md:top-2 md:right-4 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-cozy backdrop-blur-xs transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1 left-1.5 h-2 w-3 rounded-full bg-white/50 blur-[0.3px] -rotate-12"
                    />
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:rotate-90"
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

                  {/* Inside Screen Content: Strictly bounded inside cream screen (left: 7.5%, right: 9.5%, top: 12%, bottom: 12%) */}
                  <div className="absolute left-[7.5%] right-[9.5%] top-[12%] bottom-[12%] z-20 flex flex-col overflow-hidden rounded-md bg-[#FFFDF8] text-ink select-text">
                    {/* Tablet Top App Bar */}
                    <div className="flex items-center justify-between border-b border-pink-200/60 bg-[#FFF5F8] px-3 sm:px-4 py-1.5 sm:py-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF4D88] animate-pulse" />
                        <span className="font-display text-xs sm:text-sm font-bold text-ink">
                          Suto&apos;s iPad · Cozy Corner
                        </span>
                      </div>

                      {/* Mobile View Tab Switcher */}
                      <div className="flex md:hidden items-center gap-1 rounded-full bg-white/90 p-0.5 border border-pink-200/80 text-[11px] font-hand font-bold">
                        <button
                          type="button"
                          onClick={() => setMobileTab('blogs')}
                          className={`rounded-full px-2 py-0.5 transition-colors ${
                            mobileTab === 'blogs'
                              ? 'bg-gradient-to-r from-[#FFB8CE] to-[#F482A5] text-white'
                              : 'text-ink/70'
                          }`}
                        >
                          Blogs
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileTab('music')}
                          className={`rounded-full px-2 py-0.5 transition-colors ${
                            mobileTab === 'music'
                              ? 'bg-gradient-to-r from-[#FFB8CE] to-[#F482A5] text-white'
                              : 'text-ink/70'
                          }`}
                        >
                          Music
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileTab('reading')}
                          className={`rounded-full px-2 py-0.5 transition-colors ${
                            mobileTab === 'reading'
                              ? 'bg-gradient-to-r from-[#FFB8CE] to-[#F482A5] text-white'
                              : 'text-ink/70'
                          }`}
                        >
                          Reading
                        </button>
                      </div>

                      <div className="hidden md:flex items-center gap-1.5 font-mono text-[10px] text-ink-soft">
                        <span>Wi-Fi</span>
                        <span className="text-accent font-bold">●●●●</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-1 overflow-hidden min-h-0">
                      {/* LEFT SIDEBAR: Song of the Day + Currently Reading + Blogs List */}
                      <div
                        className={`w-full md:w-[42%] lg:w-[38%] border-r border-pink-200/60 bg-[#FFFAF9] p-2.5 sm:p-3 overflow-y-auto diary-scroll flex flex-col gap-3 min-h-0 shrink-0 ${
                          mobileTab === 'blogs' ? 'flex' : 'hidden md:flex'
                        }`}
                      >
                        {/* 1. SONG OF THE DAY MINI PLAYER */}
                        <div className="rounded-xl border border-pink-200/80 bg-white/95 p-2.5 shadow-xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="flex items-center gap-1 font-hand text-xs sm:text-sm font-bold text-accent">
                              <svg
                                className="h-3.5 w-3.5 text-accent animate-spin-slow"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                              </svg>
                              Song of the day
                            </span>
                            <span className="rounded-full bg-[#FFF0F5] px-1.5 py-0.2 font-mono text-[9px] font-bold text-accent">
                              Daily rotation
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            {/* Playlist / Album Artwork */}
                            <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden border border-pink-200 shrink-0 shadow-xs">
                              <Image
                                src={spotifyPlaylist.coverImage}
                                alt={spotifyPlaylist.title}
                                fill
                                className="object-cover"
                              />
                              {isPlaying && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="flex items-end gap-0.5 h-3">
                                    <span className="w-1 bg-white animate-pulse h-3 rounded-full" />
                                    <span className="w-1 bg-white animate-pulse h-2 rounded-full delay-75" />
                                    <span className="w-1 bg-white animate-pulse h-3.5 rounded-full delay-150" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Song Meta */}
                            <div className="flex-1 min-w-0">
                              <p className="font-display text-xs sm:text-sm font-bold text-ink truncate leading-tight">
                                {currentSong.title}
                              </p>
                              <p className="font-sans text-[10px] sm:text-[11px] text-ink-soft truncate">
                                {currentSong.artist} · {currentSong.album}
                              </p>

                              {/* Controls Row */}
                              <div className="mt-1.5 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  {/* Prev */}
                                  <button
                                    type="button"
                                    onClick={handlePrevSong}
                                    aria-label="Previous Song"
                                    className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-blush/30 transition-colors"
                                  >
                                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                                    </svg>
                                  </button>

                                  {/* Play / Pause Toggle */}
                                  <button
                                    type="button"
                                    onClick={togglePlay}
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                    className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#FF4D88] to-[#E81E63] text-white shadow-xs hover:scale-105 active:scale-95 transition-transform"
                                  >
                                    {isPlaying ? (
                                      <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                      </svg>
                                    ) : (
                                      <svg className="h-2.5 w-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    )}
                                  </button>

                                  {/* Next */}
                                  <button
                                    type="button"
                                    onClick={handleNextSong}
                                    aria-label="Next Song"
                                    className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-blush/30 transition-colors"
                                  >
                                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                    </svg>
                                  </button>
                                </div>

                                {/* Open in Spotify */}
                                <a
                                  href={currentSong.spotifyUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full border border-green-300/80 bg-[#1DB954]/10 px-2 py-0.5 font-sans text-[9px] font-bold text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors"
                                >
                                  <span>Spotify</span>
                                  <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. CURRENTLY READING */}
                        <div className="rounded-xl border border-pink-200/80 bg-white/95 p-2.5 shadow-xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="flex items-center gap-1 font-hand text-xs sm:text-sm font-bold text-accent">
                              <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                              </svg>
                              Currently Reading
                            </span>
                            <span className="rounded-full bg-[#EBF5FB] px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#2980B9]">
                              {currentlyReading.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            {/* Book Thumbnail */}
                            <div className="relative h-14 w-10 sm:h-16 sm:w-11 rounded-sm overflow-hidden border border-pink-200 shadow-sm shrink-0 bg-[#FFF5F8]">
                              <Image
                                src={currentlyReading.coverImage}
                                alt={currentlyReading.title}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Book Meta */}
                            <div className="flex-1 min-w-0">
                              <p className="font-display text-xs sm:text-sm font-bold text-ink leading-tight truncate">
                                {currentlyReading.title}
                              </p>
                              <p className="font-sans text-[10px] sm:text-[11px] font-semibold text-accent truncate">
                                by {currentlyReading.author}
                              </p>
                              {currentlyReading.note && (
                                <p className="mt-0.5 font-hand text-[11px] text-ink-soft leading-snug line-clamp-2">
                                  &ldquo;{currentlyReading.note}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 3. BLOGS LIST */}
                        <div className="flex-1 flex flex-col min-h-0">
                          <div className="flex items-center justify-between mb-1 pt-1">
                            <h3 className="font-display text-xs sm:text-sm font-extrabold text-ink flex items-center gap-1.5">
                              <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                              Blogs
                            </h3>
                            <span className="font-mono text-[10px] text-ink-soft font-semibold">
                              {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
                            </span>
                          </div>

                          <div className="space-y-1.5 overflow-y-auto diary-scroll pr-1">
                            {blogs.map((b) => {
                              const isSelected = b.slug === selectedBlogSlug;
                              return (
                                <div
                                  key={b.slug}
                                  onClick={() => {
                                    setSelectedBlogSlug(b.slug);
                                    setMobileTab('blogs');
                                  }}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      setSelectedBlogSlug(b.slug);
                                    }
                                  }}
                                  className={`p-2 rounded-lg border transition-all text-left cursor-pointer ${
                                    isSelected
                                      ? 'border-pink-300 bg-[#FFF0F5] shadow-xs'
                                      : 'border-pink-200/60 bg-white hover:bg-[#FFF9FB] hover:border-pink-300/80'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="rounded-full bg-[#FFE29A]/50 px-1.5 py-0.2 font-mono text-[9px] font-bold text-ink">
                                      {b.tag}
                                    </span>
                                    <span className="font-mono text-[9px] text-ink-soft">
                                      {b.readTime}
                                    </span>
                                  </div>
                                  <h4 className="font-display text-xs font-bold text-ink leading-tight truncate">
                                    {b.title}
                                  </h4>
                                  <p className="mt-0.5 font-sans text-[10px] text-ink-soft line-clamp-2 leading-tight">
                                    {b.snippet}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT MAIN PANE: Active Blog Reader Screen */}
                      <div
                        className={`flex-1 p-3.5 sm:p-5 md:p-6 overflow-y-auto diary-scroll bg-[#FFFDF8] flex flex-col min-h-0 ${
                          mobileTab === 'blogs' ? 'flex' : 'hidden md:flex'
                        }`}
                      >
                        {selectedBlog ? (
                          <div className="space-y-3 max-w-xl mx-auto w-full">
                            {/* Meta & Tags */}
                            <div className="flex items-center gap-2">
                              <span className="rounded-full border border-pink-300/80 bg-[#FFF0F5] px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                                {selectedBlog.tag}
                              </span>
                              <span className="font-mono text-[10px] text-ink-soft">
                                {selectedBlog.date} · {selectedBlog.readTime}
                              </span>
                            </div>

                            {/* Title */}
                            <h2 className="font-display text-base sm:text-xl md:text-2xl font-extrabold text-ink leading-snug">
                              {selectedBlog.title}
                            </h2>

                            {/* Divider with cute tea icon */}
                            <div className="flex items-center gap-2 py-1">
                              <div className="h-px bg-pink-200/80 flex-1" />
                              <span className="text-accent text-xs">☕</span>
                              <div className="h-px bg-pink-200/80 flex-1" />
                            </div>

                            {/* Blog Content Paragraphs */}
                            <div className="space-y-2.5 font-sans text-xs sm:text-sm leading-relaxed text-ink/90">
                              {selectedBlog.content.map((p, idx) => (
                                <p key={idx}>{p}</p>
                              ))}
                            </div>

                            {/* Sign-off box */}
                            <div className="mt-4 rounded-xl border border-pink-200/80 bg-[#FFF5F8] p-3 text-center">
                              <p className="font-hand text-sm sm:text-base font-bold text-ink">
                                Thanks for reading! ✨
                              </p>
                              <p className="font-sans text-[11px] text-ink-soft mt-0.5">
                                More blogs &amp; essays will be posted here soon.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center text-ink-soft">
                            <p className="font-hand text-lg font-bold text-ink">
                              Pick a blog from the sidebar to start reading!
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Mobile Dedicated Music Tab */}
                      {mobileTab === 'music' && (
                        <div className="md:hidden flex-1 p-4 overflow-y-auto diary-scroll flex flex-col items-center justify-center text-center">
                          <div className="relative h-28 w-28 rounded-xl overflow-hidden border-2 border-pink-200 shadow-md mb-3">
                            <Image
                              src={spotifyPlaylist.coverImage}
                              alt={spotifyPlaylist.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h3 className="font-display text-base font-bold text-ink leading-tight">
                            {currentSong.title}
                          </h3>
                          <p className="font-sans text-xs text-accent mt-0.5">
                            {currentSong.artist} · {currentSong.album}
                          </p>
                          <div className="flex items-center gap-3 mt-4">
                            <button
                              type="button"
                              onClick={handlePrevSong}
                              className="p-2 rounded-full bg-pink-100 text-ink"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={togglePlay}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FF4D88] to-[#E81E63] text-white shadow-md"
                            >
                              {isPlaying ? (
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 fill-current ml-0.5" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={handleNextSong}
                              className="p-2 rounded-full bg-pink-100 text-ink"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                              </svg>
                            </button>
                          </div>
                          <a
                            href={currentSong.spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-green-300 bg-[#1DB954]/15 px-3.5 py-1.5 font-sans text-xs font-bold text-[#1DB954]"
                          >
                            <span>Open in Spotify</span>
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        </div>
                      )}

                      {/* Mobile Dedicated Reading Tab */}
                      {mobileTab === 'reading' && (
                        <div className="md:hidden flex-1 p-4 overflow-y-auto diary-scroll flex flex-col items-center justify-center text-center">
                          <div className="relative h-36 w-24 rounded-md overflow-hidden border-2 border-pink-200 shadow-md mb-3">
                            <Image
                              src={currentlyReading.coverImage}
                              alt={currentlyReading.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="rounded-full bg-[#EBF5FB] px-2 py-0.5 font-mono text-[10px] font-bold text-[#2980B9] mb-1">
                            {currentlyReading.status}
                          </span>
                          <h3 className="font-display text-base font-bold text-ink">
                            {currentlyReading.title}
                          </h3>
                          <p className="font-sans text-xs font-semibold text-accent">
                            by {currentlyReading.author}
                          </p>
                          {currentlyReading.note && (
                            <p className="mt-2 font-hand text-sm text-ink-soft max-w-xs">
                              &ldquo;{currentlyReading.note}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
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
