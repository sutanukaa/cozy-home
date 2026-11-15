'use client';

// Precisely mapped to the three draped garland swags in the new background artwork
export const FAIRY_LIGHTS: [number, number][] = [
  // Swag 1: Left drape above the couch (dipping from corner down over the studio door)
  [3.8, 6.5],
  [6.5, 11.6],
  [9.0, 15.4],
  [11.2, 18.1],
  [13.8, 19.5],
  [16.2, 18.5],
  [18.5, 19.2],
  [21.0, 20.2],

  // Swag 2: Center drape curving over the doorways
  [35.3, 19.3],
  [38.3, 18.5],
  [41.0, 16.5],
  [43.4, 13.9],
  [45.8, 10.9],
  [48.1, 7.3],
  [52.0, 8.2],
  [54.8, 14.5],
  [57.0, 18.2],
  [59.6, 20.2],

  // Swag 3: Right drape leading to the arched window & monstera
  [66.8, 8.3],
  [69.8, 10.4],
  [72.5, 11.6],
  [75.8, 14.5],
  [79.0, 16.8],
  [81.8, 17.2],
  [85.2, 16.8],
  [88.4, 15.2],
  [91.3, 12.7],
  [94.3, 9.9],
  [97.0, 7.5],
];

// Soft ambient room sparkles & sun dust motes
export const ROOM_SPECKS: [number, number][] = [
  [8.5, 26.0], [14.0, 28.5], [22.0, 32.0], [38.0, 26.5], [44.0, 24.0],
  [62.0, 28.0], [74.0, 25.5], [82.0, 29.0], [89.0, 24.5], [93.5, 28.0],
  [16.5, 52.0], [18.0, 68.0], [80.5, 58.0], [86.0, 68.0]
];

export default function FairyLightOverlay() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* 1. DAYTIME: Prismatic Glass Sun-Catchers & Sun Motes */}
      <div className="only-day h-full w-full">
        {FAIRY_LIGHTS.map(([x, y], i) => {
          const delay = (i * 0.23) % 3.5;
          const duration = 3.5 + ((i * 7) % 15) * 0.15;
          return (
            <div
              key={`prism-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `sun-prism-glint ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <span className="block h-2 w-2 rounded-full border border-white/60 bg-white/40 shadow-[0_1px_4px_rgba(255,255,255,0.7)] backdrop-blur-[1px]" />
              <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-pink-300/30 via-amber-200/20 to-sky-300/30 blur-[2px]" />
            </div>
          );
        })}

        {ROOM_SPECKS.map(([x, y], i) => {
          const delay = (i * 0.35) % 4.5;
          const duration = 4.2 + ((i * 11) % 20) * 0.15;
          return (
            <div
              key={`sunmote-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `sun-mote-drift ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_6px_rgba(255,230,170,0.6)]" />
            </div>
          );
        })}
      </div>

      {/* 2. NIGHTTIME: Warm Amber Glowing Fairy Lights */}
      <div className="only-night h-full w-full">
        {FAIRY_LIGHTS.map(([x, y], i) => {
          const delay = (i * 0.19) % 2.5;
          const duration = 2.4 + ((i * 11) % 15) * 0.1;
          return (
            <div
              key={`fairy-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `fairy-pulse ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              {/* Hot core center */}
              <span className="block h-2.5 w-2.5 rounded-full bg-[#FFFBEA] shadow-[0_0_10px_3px_#FFE79A,0_0_18px_6px_rgba(255,200,100,0.7)]" />
              {/* Radial warm aura */}
              <span className="absolute -inset-2 rounded-full bg-gradient-radial from-amber-200/40 via-amber-300/15 to-transparent blur-sm" />
            </div>
          );
        })}

        {ROOM_SPECKS.map(([x, y], i) => {
          const delay = (i * 0.25) % 3.5;
          const duration = 2.8 + ((i * 13) % 20) * 0.1;
          return (
            <div
              key={`speck-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `speck-twinkle ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-[#FFFFFF] shadow-[0_0_6px_2px_#FFF3B0,0_0_12px_4px_rgba(255,220,120,0.5)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
