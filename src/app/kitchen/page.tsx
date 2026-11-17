import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import RoomNavArrows from '@/components/ui/RoomNavArrows';

export const metadata: Metadata = { title: 'Kitchen' };

export default function KitchenPage() {
  return (
    <div className="fixed inset-0 h-screen h-[100dvh] w-full overflow-hidden select-none">
      <RoomScene room="kitchen" fit="cover">
        {/* Future Fortune Cookie Tray and interactive components will be mounted here */}
      </RoomScene>

      {/* Pink bubble navigation arrows: left to Library, right to Porch */}
      <RoomNavArrows
        prev={{ name: 'Library', href: '/library' }}
        next={{ name: 'Porch', href: '/porch' }}
      />

      {/* Kitchen Room Heading anchored in the bottom right corner */}
      <div className="kitchen-heading pointer-events-none absolute bottom-6 right-4 sm:bottom-8 sm:right-6 md:bottom-12 md:right-10 z-20 max-w-[240px] sm:max-w-sm md:max-w-md text-right select-none">
        <h1
          className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md"
          style={{
            textShadow:
              '0 3px 14px rgba(0, 0, 0, 0.65), 0 0 28px rgba(255, 140, 180, 0.75), 0 2px 4px rgba(0,0,0,0.85)',
          }}
        >
          The Kitchen
        </h1>
        <p
          className="mt-0.5 sm:mt-1 font-hand text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/95"
          style={{
            textShadow:
              '0 2px 8px rgba(0, 0, 0, 0.55), 0 0 16px rgba(255, 200, 220, 0.5), 0 1px 3px rgba(0,0,0,0.75)',
          }}
        >
          Recipes for the things I have cooked up.
        </p>
      </div>
    </div>
  );
}
