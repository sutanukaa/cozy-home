'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { getRoom, rooms, type RoomSlug } from '@/data/rooms';
import { roomAsset } from '@/lib/assets';
import { useTime } from '@/components/providers/TimeProvider';
import AssetImage from '@/components/ui/AssetImage';
import Hotspot, { type HotspotDef } from '@/components/ui/Hotspot';

interface Props {
  room: RoomSlug;
  hotspots?: HotspotDef[];
  children?: React.ReactNode;
  fit?: 'cover' | 'contain';
  stageAlign?: 'center' | 'top';
  stageOffsetY?: string | number;
  stageScale?: number;
}

const ROOM_INTERACTIVE_OBJECTS: Record<RoomSlug, string[]> = {
  'living-room': [
    '/assets/objects/drawer-open.webp',
    '/assets/objects/lamp-on.webp',
    '/assets/objects/lamp-off.webp',
    '/assets/objects/basket-cat-sleep.webp',
    '/assets/objects/basket-cat-wake.webp',
  ],
  studio: [
    '/assets/objects/studio-plant-growing.webp',
    '/assets/objects/studio-plant-full.webp',
    '/assets/objects/studio-watering-can.webp',
  ],
  bedroom: [
    '/assets/objects/bedroom-diary-open.webp',
    '/assets/objects/bedroom-diary-mobile.webp',
    '/assets/objects/bedroom-tablet.webp',
    '/assets/objects/bedroom-tablet-open.webp',
    '/assets/objects/bedroom-tablet-mobile.webp',
  ],
  library: [
    '/assets/objects/card-catalog.webp',
    '/assets/objects/drawer-open.webp',
    '/assets/objects/clipboard.webp',
    '/assets/objects/library-book-open.webp',
  ],
  kitchen: [
    '/assets/objects/fortune-cookie-whole.webp',
    '/assets/objects/fortune-cookie-cracked.webp',
    '/assets/objects/kitchen-kettle-pour.webp',
    '/assets/objects/kitchen-teacup.webp',
  ],
  porch: [
    '/assets/objects/porch-mailbox.webp',
    '/assets/objects/porch-mailbox-night.webp',
    '/assets/objects/mailbox-open.webp',
    '/assets/objects/porch-postcard.webp',
    '/assets/objects/porch-postcard-mobile.webp',
    '/assets/objects/porch-plaque.webp',
  ],
};

export default function RoomScene({
  room,
  hotspots = [],
  children,
  fit = 'cover',
  stageAlign = 'center',
  stageOffsetY,
  stageScale,
}: Props) {
  const meta = getRoom(room);
  const { theme } = useTime();
  const isNight = theme === 'night';
  const [debug, setDebug] = useState(false);
  const [picked, setPicked] = useState<{ x: number; y: number } | null>(null);
  const [overflowX, setOverflowX] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    setDebug(new URLSearchParams(window.location.search).has('debug'));
  }, []);

  // Preload this room's interactive object images & adjacent rooms during idle browser time
  useEffect(() => {
    const currentIndex = rooms.findIndex((r) => r.slug === room);
    if (currentIndex === -1) return;

    // Identify adjacent rooms (previous and next in room loop)
    const prevSlug = rooms[(currentIndex - 1 + rooms.length) % rooms.length].slug;
    const nextSlug = rooms[(currentIndex + 1) % rooms.length].slug;
    const targetsToPreload: RoomSlug[] = [prevSlug, nextSlug];

    // If on Living Room hub, also preload common destination rooms
    if (room === 'living-room') {
      targetsToPreload.push('studio', 'kitchen', 'porch');
    }

    const timer = setTimeout(() => {
      const preload = () => {
        // 1. Preload this room's interactive objects so click actions feel instantaneous
        const objects = ROOM_INTERACTIVE_OBJECTS[room] || [];
        objects.forEach((src) => {
          const img = new window.Image();
          img.src = src;
        });

        // 2. Preload adjacent room background images
        targetsToPreload.forEach((slug) => {
          const img = new window.Image();
          img.src = roomAsset(slug, theme === 'night' ? 'night' : 'day');
        });
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(preload);
      } else {
        preload();
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [room, theme]);

  // Compute horizontal overflow for responsive panning when aspect ratio is taller than 16:9
  useEffect(() => {
    if (fit !== 'cover') return;

    const updateOverflow = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      if (cw === 0 || ch === 0) return;

      // 16:9 stage width when covering the viewport height
      const stageW = Math.max(cw, ch * (16 / 9));
      const extra = Math.max(0, (stageW - cw) / 2);
      setOverflowX(extra);

      // Clamp motion value within new constraints
      const currentX = x.get();
      if (extra <= 10) {
        x.set(0);
      } else if (Math.abs(currentX) > extra) {
        x.set(Math.sign(currentX) * extra);
      }
    };

    updateOverflow();
    window.addEventListener('resize', updateOverflow);
    return () => window.removeEventListener('resize', updateOverflow);
  }, [fit, x]);

  // Hide the explore hint after 4.5 seconds automatically
  useEffect(() => {
    if (overflowX > 30 && !hasDragged) {
      const timer = setTimeout(() => {
        setHasDragged(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [overflowX, hasDragged]);

  const onDebugClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const xCoord = Math.round(((e.clientX - r.left) / r.width) * 1000) / 10;
    const yCoord = Math.round(((e.clientY - r.top) / r.height) * 1000) / 10;
    setPicked({ x: xCoord, y: yCoord });
    navigator.clipboard?.writeText(`x: ${xCoord}, y: ${yCoord}`).catch(() => {});
  };

  const isCover = fit === 'cover';

  return (
    <figure aria-label={`Illustration of the ${meta.name.toLowerCase()}`} className="relative h-full w-full overflow-hidden select-none">
      <div
        ref={containerRef}
        className={`relative h-full w-full overflow-hidden bg-wall-deep flex ${
          stageAlign === 'top' ? 'items-start pt-14 sm:pt-16' : 'items-center'
        } justify-center touch-pan-y`}
      >
        {/* Diorama stage: smoothly pannable on mobile/portrait devices, centered on desktop */}
        <motion.div
          style={{
            x,
            y: stageOffsetY ?? 0,
            scale: stageScale ?? 1,
          }}
          drag={overflowX > 10 ? 'x' : false}
          dragConstraints={{ left: -overflowX, right: overflowX }}
          dragElastic={0.08}
          dragMomentum={true}
          onDragStart={() => setHasDragged(true)}
          onClick={debug ? onDebugClick : undefined}
          className={`relative shrink-0 overflow-hidden ${
            isCover
              ? 'aspect-[16/9] min-w-[calc(100vh*16/9)] min-h-[calc(100vw*9/16)] w-full h-full'
              : 'inset-0 h-full w-full'
          }`}
        >
          {/* 1. placeholder: visible only until real art is dropped into /public/assets/rooms */}
          <div className="absolute inset-0 bg-gradient-to-b from-wall to-wall-deep">
            <div className="absolute inset-x-0 bottom-0 h-[24%] bg-ink/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <span className="animate-float text-6xl sm:text-7xl">{meta.emoji}</span>
              <span className="font-hand text-xl text-ink sm:text-2xl">{meta.name} art goes here</span>
              <span className="hidden font-mono text-xs text-ink-soft sm:block">
                /public/assets/rooms/{room}-day.png &amp; {room}-night.png
              </span>
            </div>
          </div>

          {/* 2. day art, 3. night art (prioritize active theme, lazy-load opposite theme) */}
          <AssetImage
            src={roomAsset(room, 'day')}
            fetchPriority={isNight ? 'low' : 'high'}
            loading={isNight ? 'lazy' : 'eager'}
            className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          />
          <AssetImage
            src={roomAsset(room, 'night')}
            fetchPriority={isNight ? 'high' : 'low'}
            loading={isNight ? 'eager' : 'lazy'}
            className="variant-night absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          />

          {/* 4. dawn / dusk tint */}
          <div className="phase-tint pointer-events-none absolute inset-0" />

          {children}

          {hotspots.map((h) => (
            <Hotspot key={h.id} {...h} />
          ))}

          {debug && (
            <div className="pointer-events-none absolute inset-0 cursor-crosshair" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255/.35) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255/.35) 1px, transparent 1px)', backgroundSize: '10% 10%' }}>
              <span className="absolute left-2 top-20 rounded bg-black/70 px-2 py-1 font-mono text-xs text-white">
                debug: click to copy coordinates {picked ? `-> x: ${picked.x}, y: ${picked.y}` : ''}
              </span>
            </div>
          )}
        </motion.div>

        {/* Subtle swipe hint pill for mobile visitors when diorama overflows horizontally */}
        {overflowX > 30 && !hasDragged && (
          <div
            className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full border border-pink-300/80 bg-paper/90 px-3 py-1 font-mono text-[10px] sm:text-xs font-bold text-cocoa shadow-cozy backdrop-blur-md animate-pulse dark:border-white/20 dark:bg-black/60 dark:text-pink-200"
          >
            <span className="text-accent dark:text-pink-300 font-bold">‹</span>
            <span>drag to look around room</span>
            <span className="text-accent dark:text-pink-300 font-bold">›</span>
          </div>
        )}
      </div>
    </figure>
  );
}