'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { getRoom, type RoomSlug } from '@/data/rooms';
import { roomAsset } from '@/lib/assets';
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
  const [debug, setDebug] = useState(false);
  const [picked, setPicked] = useState<{ x: number; y: number } | null>(null);
  const [overflowX, setOverflowX] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    setDebug(new URLSearchParams(window.location.search).has('debug'));
  }, []);

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

          {/* 2. day art, 3. night art (fades in via CSS when <html data-theme="night">) */}
          <AssetImage src={roomAsset(room, 'day')} className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none" />
          <AssetImage src={roomAsset(room, 'night')} className="variant-night absolute inset-0 h-full w-full object-cover object-center pointer-events-none" />

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