import RoomScene from '@/components/scene/RoomScene';
import FairyLightOverlay from '@/components/scene/FairyLightOverlay';
import LivingRoomElements from '@/components/scene/LivingRoomElements';
import WindowCurtains from '@/components/scene/WindowCurtains';
import RoomReveal from '@/components/scene/RoomReveal';
import { rooms } from '@/data/rooms';
import { site } from '@/data/site';
import type { HotspotDef } from '@/components/ui/Hotspot';

// Living room: the hub. Each door on the illustration leads to a room.
const doors: HotspotDef[] = rooms
  .filter((r) => r.slug !== 'living-room')
  .map((r) => ({
    id: r.slug,
    label: `${r.name}: ${r.purpose}`,
    x: r.door.x,
    y: r.door.y,
    emoji: r.emoji,
    icon: r.slug,
    href: r.href,
  }));

export default function HomePage() {
  return (
    <div className="fixed inset-0 h-screen h-[100dvh] w-full overflow-hidden select-none">
      <RoomReveal />
      <RoomScene room="living-room" hotspots={doors}>
        <WindowCurtains />
        <FairyLightOverlay />
        <LivingRoomElements />
        {/* Clean hero text without box */}
        <div className="pointer-events-none absolute inset-x-0 top-20 sm:top-24 z-20 mx-auto max-w-xl px-4 text-center">
          <p
            className="font-hand text-2xl font-bold tracking-wide text-white sm:text-3xl"
            style={{
              textShadow:
                '0 3px 10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 180, 200, 0.75), 0 1px 3px rgba(0, 0, 0, 0.9)',
              WebkitTextStroke: '0.5px rgba(91, 58, 71, 0.6)',
            }}
          >
            hi, I&apos;m {site.shortName} and this is my home
          </p>
          <h1
            className="mt-1 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
            style={{
              textShadow:
                '0 3px 12px rgba(0, 0, 0, 0.6), 0 0 24px rgba(255, 140, 180, 0.7), 0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {site.role}
          </h1>
          <p
            className="mx-auto mt-2 font-hand text-xl font-bold text-white/95 sm:text-2xl"
            style={{
              textShadow:
                '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 14px rgba(255, 200, 220, 0.5), 0 1px 3px rgba(0,0,0,0.7)',
            }}
          >
            {site.tagline}
          </p>
        </div>
      </RoomScene>
    </div>
  );
}
