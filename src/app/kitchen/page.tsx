import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import RoomNavArrows from '@/components/ui/RoomNavArrows';
import KitchenFortuneCookies from '@/components/scene/KitchenFortuneCookies';

export const metadata: Metadata = { title: 'Kitchen' };

export default function KitchenPage() {
  return (
    <div className="fixed inset-0 h-screen h-[100dvh] w-full overflow-hidden select-none">
      <RoomScene room="kitchen" fit="cover" stageOffsetY="-5.5%" stageScale={1.08}>
        {/* Interactive Fortune Cookie Tray on Countertop */}
        <KitchenFortuneCookies />
      </RoomScene>

      {/* Pink bubble navigation arrows: left to Library, right to Porch */}
      <RoomNavArrows
        prev={{ name: 'Library', href: '/library' }}
        next={{ name: 'Porch', href: '/porch' }}
      />

      {/* Kitchen Room Heading */}
      <div className="kitchen-heading pointer-events-none absolute bottom-6 right-4 sm:bottom-7 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 pr-16 sm:pr-0 z-20 max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md text-right select-none">
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md"
          style={{
            textShadow:
              '0 3px 14px rgba(0, 0, 0, 0.65), 0 0 28px rgba(255, 140, 180, 0.75), 0 2px 4px rgba(0,0,0,0.85)',
          }}
        >
          The Kitchen
        </h1>
        <p
          className="mt-1 font-hand text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/95"
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
