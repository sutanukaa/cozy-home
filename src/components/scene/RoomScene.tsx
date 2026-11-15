'use client';

import { useEffect, useState } from 'react';
import { getRoom, type RoomSlug } from '@/data/rooms';
import { roomAsset } from '@/lib/assets';
import AssetImage from '@/components/ui/AssetImage';
import Hotspot, { type HotspotDef } from '@/components/ui/Hotspot';

interface Props {
  room: RoomSlug;
  hotspots?: HotspotDef[];
  children?: React.ReactNode;
  fit?: 'cover' | 'contain';
}

export default function RoomScene({ room, hotspots = [], children, fit = 'cover' }: Props) {
  const meta = getRoom(room);
  const [debug, setDebug] = useState(false);
  const [picked, setPicked] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setDebug(new URLSearchParams(window.location.search).has('debug'));
  }, []);

  const onDebugClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 1000) / 10;
    const y = Math.round(((e.clientY - r.top) / r.height) * 1000) / 10;
    setPicked({ x, y });
    navigator.clipboard?.writeText(`x: ${x}, y: ${y}`).catch(() => {});
  };

  const isCover = fit === 'cover';

  return (
    <figure aria-label={`Illustration of the ${meta.name.toLowerCase()}`} className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full overflow-hidden bg-wall-deep">
        {/* Diorama stage: covers viewport for fullscreen rooms (living-room), or perfectly fits container for framed rooms */}
        <div
          onClick={debug ? onDebugClick : undefined}
          className={`absolute overflow-hidden ${
            isCover
              ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[calc(100vh*16/9)] min-h-[calc(100vw*9/16)] w-full h-full aspect-[16/9]'
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
          <AssetImage src={roomAsset(room, 'day')} className="absolute inset-0 h-full w-full object-cover object-center" />
          <AssetImage src={roomAsset(room, 'night')} className="variant-night absolute inset-0 h-full w-full object-cover object-center" />

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
        </div>
      </div>
    </figure>
  );
}
