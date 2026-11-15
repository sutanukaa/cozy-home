import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import RoomReveal from '@/components/scene/RoomReveal';
import StudioRetroComputer from '@/components/scene/StudioRetroComputer';
import CoffeeSteam from '@/components/scene/CoffeeSteam';
import type { HotspotDef } from '@/components/ui/Hotspot';

export const metadata: Metadata = { title: 'Studio' };

// Hotspots placed accurately on the studio room illustration
const hotspots: HotspotDef[] = [
  {
    id: 'plant',
    label: 'Desk succulent',
    x: 84.0,
    y: 46.5,
    emoji: '🪴',
    note: 'Gets watered more often than my git branches get cleaned.',
  },
];

export default function StudioPage() {
  return (
    <div className="fixed inset-0 h-screen h-[100dvh] w-full overflow-hidden select-none">
      <RoomReveal />
      <RoomScene room="studio" hotspots={hotspots} fit="cover">
        <CoffeeSteam />
        <StudioRetroComputer />
      </RoomScene>

      {/* Studio Room Heading anchored safely below the fixed navbar */}
      <div className="pointer-events-none absolute inset-x-0 top-[88px] sm:top-[98px] md:top-[108px] z-20 mx-auto max-w-xl px-4 text-center">
        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white"
          style={{
            textShadow:
              '0 3px 14px rgba(0, 0, 0, 0.65), 0 0 28px rgba(255, 140, 180, 0.75), 0 2px 4px rgba(0,0,0,0.85)',
          }}
        >
          The Studio
        </h1>
        <p
          className="mx-auto mt-1 sm:mt-2 font-hand text-xl sm:text-2xl md:text-3xl font-bold text-white/95"
          style={{
            textShadow:
              '0 2px 8px rgba(0, 0, 0, 0.55), 0 0 16px rgba(255, 200, 220, 0.5), 0 1px 3px rgba(0,0,0,0.75)',
          }}
        >
          Where the pixels get pushed.
        </p>
      </div>
    </div>
  );
}
