import Link from 'next/link';
import RoomScene from '@/components/scene/RoomScene';
import FairyLightOverlay from '@/components/scene/FairyLightOverlay';
import LivingRoomElements from '@/components/scene/LivingRoomElements';
import WindowCurtains from '@/components/scene/WindowCurtains';
import PaperCard from '@/components/ui/PaperCard';
import CozyIcon from '@/components/ui/CozyIcon';
import { rooms } from '@/data/rooms';
import { site } from '@/data/site';
import type { HotspotDef } from '@/components/ui/Hotspot';

// Living room: the hub. Each door on the illustration leads to a room.
const doors: HotspotDef[] = rooms
  .filter((r) => r.slug !== 'living-room')
  .map((r) => ({ id: r.slug, label: `${r.name}: ${r.purpose}`, x: r.door.x, y: r.door.y, emoji: r.emoji, icon: r.slug, href: r.href }));

export default function HomePage() {
  const others = rooms.filter((r) => r.slug !== 'living-room');
  return (
    <div>
      {/* Fullscreen hero scene */}
      <section className="relative h-screen h-[100dvh] w-full overflow-hidden">
        <RoomScene room="living-room" hotspots={doors}>
          <WindowCurtains />
          <FairyLightOverlay />
          <LivingRoomElements />
          {/* Clean hero text without box */}
          <div className="pointer-events-none absolute inset-x-0 top-24 z-20 mx-auto max-w-xl px-4 text-center">
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
      </section>

      {/* Content below room */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <section aria-labelledby="where-to" className="mx-auto max-w-5xl">
          <h2 id="where-to" className="mb-6 text-center font-hand text-4xl">Where to?</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r, i) => (
              <PaperCard as="li" key={r.slug} tilt={i % 2 ? 1 : -1} tape className="p-0">
                <Link href={r.href} className="block rounded-3xl p-6 transition-transform hover:scale-[1.02]">
                  <CozyIcon name={r.slug} fallback={r.emoji} size={42} className="mb-2" />
                  <h3 className="mt-2 font-display text-xl font-semibold">{r.name}</h3>
                  <p className="text-ink-soft">{r.purpose}</p>
                  <p className="mt-1 font-hand text-xl text-ink-soft">{r.tagline}</p>
                </Link>
              </PaperCard>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
