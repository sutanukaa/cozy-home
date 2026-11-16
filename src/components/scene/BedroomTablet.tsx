'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Audio playback controller when song index changes
  useEffect(() => {
    if (!audioRef.current) return;
    const currentSong = spotifyPlaylist.tracks[currentSongIndex];
    if (currentSong?.previewUrl) {
      audioRef.current.src = currentSong.previewUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentSongIndex, isPlaying, spotifyPlaylist.tracks]);

  const handleOpen = () => {
    soundscape.playSparkleSound();
    setIsFloating(true);

    // Generate sparkle trail along trajectory from bedside table to center
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
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsOpen(false);
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
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src && currentSong.previewUrl) {
        audioRef.current.src = currentSong.previewUrl;
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
    soundscape.playSparkleSound();
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
              <div className="diary-book-modal fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 select-none">
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

                {/* Hidden Audio element for streaming Spotify audio previews */}
                <audio
                  ref={audioRef}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleNextSong}
                  onError={() => setIsPlaying(false)}
                  preload="auto"
                />

                {/* Tablet Frame Container - Strict 1599:1192 aspect ratio locked */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 flex items-center justify-center select-none"
                  style={{
                    width: 'min(94vw, calc(86vh * 1599 / 1192), 940px)',
                    height: 'calc(min(94vw, calc(86vh * 1599 / 1192), 940px) * 1192 / 1599)',
                    aspectRatio: '1599 / 1192',
                  }}
                >
                  {/* Tablet Frame Art */}
                  <div className="absolute inset-0 pointer-events-none select-none">
                    <Image
                      src="/assets/objects/bedroom-tablet-open.png"
                      alt="Open iPad frame"
                      fill
                      sizes="(max-width: 1024px) 96vw, 940px"
                      className="object-fill drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
                      priority
                    />
                  </div>

                  {/* Close Button: Glossy Pink Bubble floating neatly on top right case */}
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close Tablet"
                    className="group absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-cozy backdrop-blur-xs transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none"
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

                  {/* Inside Screen Content: Strictly bounded inside tablet screen glass */}
                  <div
                    className="absolute z-20 flex flex-col overflow-hidden rounded-xl bg-[#FFFDF8] text-ink select-text shadow-inner"
                    style={{
                      top: '14.2%',
                      bottom: '12.8%',
                      left: '11.0%',
                      right: '11.0%',
                    }}
                  >
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
                        className={`w-full md:w-[44%] lg:w-[42%] max-w-[340px] border-r border-pink-200/60 bg-[#FFFAF9] p-2.5 sm:p-3 overflow-y-auto overflow-x-hidden diary-scroll flex flex-col gap-2.5 min-h-0 shrink-0 ${
                          mobileTab === 'blogs' ? 'flex' : 'hidden md:flex'
                        }`}
                      >
                        {/* 1. SONG OF THE DAY MINI PLAYER */}
                        <div className="rounded-xl border border-pink-200/80 bg-white/95 p-3 shadow-xs transition-shadow hover:shadow-sm flex flex-col items-center text-center">
                          {/* Card Title */}
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <svg
                              className={`h-3.5 w-3.5 text-accent shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                            <span className="font-hand text-xs sm:text-sm font-bold text-accent whitespace-nowrap">
                              Song of the day
                            </span>
                          </div>

                          {/* Song Album Cover Thumbnail at top */}
                          <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden border border-pink-200/90 shadow-sm shrink-0 bg-pink-50 mb-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={currentSong.coverImage || spotifyPlaylist.coverImage}
                              alt={currentSong.title}
                              className="h-full w-full object-cover"
                            />
                            {isPlaying && (
                              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                <div className="flex items-end gap-1 h-5">
                                  <span className="w-1 bg-white animate-pulse h-5 rounded-full" />
                                  <span className="w-1 bg-white animate-pulse h-3 rounded-full delay-75" />
                                  <span className="w-1 bg-white animate-pulse h-6 rounded-full delay-150" />
                                  <span className="w-1 bg-white animate-pulse h-4 rounded-full delay-200" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Song Name & Details below thumbnail - No truncation! */}
                          <div className="w-full px-1">
                            <p className="font-display text-xs sm:text-sm font-bold text-ink leading-snug">
                              {currentSong.title}
                            </p>
                            <p className="font-sans text-[11px] text-ink-soft mt-0.5 leading-tight">
                              {currentSong.artist} · {currentSong.album}
                            </p>
                          </div>

                          {/* Scrubber progress bar */}
                          <div className="w-full mt-2.5 pt-1.5 border-t border-pink-100 flex items-center gap-1.5">
                            <span className="font-mono text-[9px] text-ink-soft shrink-0 w-6 text-right">
                              {formatTime(currentTime)}
                            </span>
                            <div
                              onClick={handleSeek}
                              className="relative flex-1 h-1.5 bg-pink-100 rounded-full cursor-pointer overflow-hidden group"
                            >
                              <div
                                className="h-full bg-gradient-to-r from-[#FFB8CE] to-[#F482A5] rounded-full transition-all duration-100"
                                style={{
                                  width: `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%`,
                                }}
                              />
                            </div>
                            <span className="font-mono text-[9px] text-ink-soft shrink-0 w-6 text-left">
                              {formatTime(duration)}
                            </span>
                          </div>

                          {/* Playback Controls Row centered */}
                          <div className="flex items-center justify-center gap-3 mt-2">
                            {/* Prev */}
                            <button
                              type="button"
                              onClick={handlePrevSong}
                              aria-label="Previous Song"
                              className="p-1.5 rounded-full text-ink-soft hover:text-ink hover:bg-blush/30 transition-colors"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                              </svg>
                            </button>

                            {/* Play / Pause Toggle Button */}
                            <button
                              type="button"
                              onClick={togglePlay}
                              aria-label={isPlaying ? 'Pause' : 'Play'}
                              className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#FF4D88] to-[#E81E63] text-white shadow-sm hover:scale-105 active:scale-95 transition-all ${
                                isPlaying ? 'ring-2 ring-pink-300' : ''
                              }`}
                            >
                              {isPlaying ? (
                                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                              ) : (
                                <svg className="h-3 w-3 fill-current ml-0.5" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              )}
                            </button>

                            {/* Next */}
                            <button
                              type="button"
                              onClick={handleNextSong}
                              aria-label="Next Song"
                              className="p-1.5 rounded-full text-ink-soft hover:text-ink hover:bg-blush/30 transition-colors"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* 2. CURRENTLY READING */}
                        <div className="rounded-xl border border-pink-200/80 bg-white/95 p-3 shadow-xs transition-shadow hover:shadow-sm flex flex-col items-center text-center">
                          {/* Card Title */}
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <svg
                              className="h-3.5 w-3.5 text-accent shrink-0"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            <span className="font-hand text-xs sm:text-sm font-bold text-accent whitespace-nowrap">
                              Currently Reading
                            </span>
                          </div>

                          {/* Book Cover Thumbnail at top */}
                          <div className="relative h-28 w-20 sm:h-32 sm:w-22 rounded-md overflow-hidden border border-pink-200/90 shadow-sm shrink-0 bg-[#FFF5F8] mb-2">
                            <Image
                              src={currentlyReading.coverImage}
                              alt={currentlyReading.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Book Name & Details below thumbnail - No truncation! */}
                          <div className="w-full px-1">
                            <p className="font-display text-xs sm:text-sm font-bold text-ink leading-snug">
                              {currentlyReading.title}
                            </p>
                            <p className="font-sans text-[11px] font-semibold text-accent mt-0.5">
                              by {currentlyReading.author}
                            </p>
                            {currentlyReading.note && (
                              <p className="mt-1 font-hand text-[11px] text-ink-soft leading-snug">
                                &ldquo;{currentlyReading.note}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* 3. BLOGS LIST */}
                        <div className="flex-1 flex flex-col min-h-0">
                          <div className="flex items-center justify-between mb-1 pt-0.5">
                            <h3 className="font-display text-xs sm:text-sm font-extrabold text-ink flex items-center gap-1.5">
                              <svg
                                className="h-3.5 w-3.5 text-accent shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
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
                          <div className="relative h-28 w-28 rounded-xl overflow-hidden border-2 border-pink-200 shadow-md mb-3 bg-pink-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={currentSong.coverImage || spotifyPlaylist.coverImage}
                              alt={currentSong.title}
                              className="h-full w-full object-cover"
                            />
                            {isPlaying && (
                              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                <div className="flex items-end gap-1 h-5">
                                  <span className="w-1.5 bg-white animate-pulse h-5 rounded-full" />
                                  <span className="w-1.5 bg-white animate-pulse h-3 rounded-full delay-75" />
                                  <span className="w-1.5 bg-white animate-pulse h-6 rounded-full delay-150" />
                                  <span className="w-1.5 bg-white animate-pulse h-4 rounded-full delay-200" />
                                </div>
                              </div>
                            )}
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
                              aria-label="Previous Song"
                              className="p-2 rounded-full bg-pink-100 text-ink"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={togglePlay}
                              aria-label={isPlaying ? 'Pause' : 'Play'}
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#FF4D88] to-[#E81E63] text-white shadow-md active:scale-95 transition-transform"
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
                              aria-label="Next Song"
                              className="p-2 rounded-full bg-pink-100 text-ink"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                              </svg>
                            </button>
                          </div>
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
