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
      </RoomScene>

      {/* Clean professional hero text anchored safely below the fixed navbar */}
      <div className="pointer-events-none absolute inset-x-0 top-[88px] sm:top-[98px] md:top-[108px] z-20 mx-auto max-w-2xl px-4 text-center">
        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white"
          style={{
            textShadow:
              '0 3px 14px rgba(0, 0, 0, 0.65), 0 0 28px rgba(255, 140, 180, 0.75), 0 2px 4px rgba(0,0,0,0.85)',
          }}
        >
          {site.name}
        </h1>
        <p
          className="mt-1 font-display text-xl sm:text-3xl font-bold text-white/95"
          style={{
            textShadow:
              '0 2px 10px rgba(0, 0, 0, 0.6), 0 0 18px rgba(255, 180, 210, 0.6), 0 1px 3px rgba(0,0,0,0.8)',
          }}
        >
          {site.role}
        </p>
        <p
          className="mx-auto mt-2 max-w-lg font-hand text-lg sm:text-2xl font-bold text-white/90"
          style={{
            textShadow:
              '0 2px 8px rgba(0, 0, 0, 0.55), 0 0 14px rgba(255, 200, 220, 0.5), 0 1px 3px rgba(0,0,0,0.75)',
          }}
        >
          {site.tagline}
        </p>
      </div>
    </div>
  );
}
