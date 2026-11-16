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
      <div className="pointer-events-none absolute inset-x-0 top-18 sm:top-22 md:top-26 z-20 mx-auto max-w-5xl px-4 text-center">
        <h1
          className="font-display text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white whitespace-nowrap leading-tight"
          style={{
            textShadow:
              '0 3px 14px rgba(0, 0, 0, 0.65), 0 0 28px rgba(255, 140, 180, 0.75), 0 2px 4px rgba(0,0,0,0.85)',
          }}
        >
          {site.role}
        </h1>
        <p
          className="mx-auto mt-1 sm:mt-1.5 max-w-2xl font-hand text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white/95"
          style={{
            textShadow:
              '0 2px 8px rgba(0, 0, 0, 0.55), 0 0 16px rgba(255, 200, 220, 0.5), 0 1px 3px rgba(0,0,0,0.75)',
          }}
        >
          {site.tagline}
        </p>
      </div>
    </div>
  );
}
