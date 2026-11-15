'use client';

// Exact coordinates of all 59 painted fairy light garland bulbs across the room artwork
export const FAIRY_LIGHTS: [number, number][] = [
  // Left drape above couch & over studio door
  [1.3, 2.4],
  [3.6, 6.6],
  [5.9, 9.9],
  [8.3, 13.3],
  [10.9, 13.1],
  [12.0, 16.7],
  [13.4, 12.8],
  [15.8, 16.4],
  [18.5, 15.9],

  // Scallop over bedroom door
  [21.1, 19.5],
  [23.8, 20.5],
  [25.3, 17.1],
  [26.8, 21.2],
  [29.0, 16.7],
  [29.5, 21.1],
  [32.4, 20.1],

  // Upper drape above central bookcase
  [34.3, 14.7],
  [37.9, 12.5],
  [40.4, 10.6],
  [43.0, 8.0],
  [45.7, 4.4],
  [53.6, 4.5],
  [55.5, 8.6],
  [57.4, 11.9],
  [60.1, 15.5],

  // Main drape across bookcase & kitchen door
  [34.8, 19.0],
  [37.2, 17.0],
  [39.6, 16.6],
  [41.8, 18.5],
  [44.4, 19.8],
  [47.0, 20.6],
  [50.0, 21.1],
  [52.9, 20.7],
  [55.5, 19.7],
  [58.2, 18.1],
  [61.4, 16.3],

  // Drape leading over the porch front door
  [63.7, 18.4],
  [66.0, 19.8],
  [68.5, 20.9],
  [71.3, 21.2],
  [74.2, 20.9],
  [76.8, 19.7],
  [79.5, 17.7],
  [82.9, 16.3],
  [86.0, 15.3],
  [87.8, 14.2],
  [89.7, 13.0],
  [92.1, 11.2],
  [94.6, 9.0],
  [97.6, 5.0],

  // Ceiling garland swag high above window & monstera
  [71.5, 3.6],
  [74.6, 5.2],
  [78.0, 6.6],
  [81.5, 7.5],
  [84.8, 7.9],
  [88.3, 7.5],
  [91.5, 6.7],
  [94.8, 4.8],
];

// Soft ambient room sparkles & dust motes floating peacefully in the air
export const ROOM_SPECKS: [number, number][] = [
  [8.5, 26.0], [14.0, 28.5], [22.0, 32.0], [38.0, 26.5], [44.0, 24.0],
  [62.0, 28.0], [74.0, 25.5], [82.0, 29.0], [89.0, 24.5],
  [16.5, 52.0], [80.5, 58.0], [86.0, 68.0]
];

export default function FairyLightOverlay() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* 1. DAYTIME: Soft Prismatic Glass Sun-Catchers */}
      <div className="only-day h-full w-full">
        {FAIRY_LIGHTS.map(([x, y], i) => {
          const delay = (i * 0.17) % 3.2;
          const duration = 3.2 + ((i * 7) % 15) * 0.12;
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
              <span className="block h-1.5 w-1.5 rounded-full border border-white/50 bg-white/35 shadow-[0_1px_3px_rgba(255,255,255,0.6)] backdrop-blur-[1px]" />
              <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-pink-300/25 via-amber-200/15 to-sky-300/25 blur-[1.5px]" />
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
              <span className="block h-1 w-1 rounded-full bg-white/60 shadow-[0_0_5px_rgba(255,230,170,0.5)]" />
            </div>
          );
        })}
      </div>

      {/* 2. NIGHTTIME: Warm Amber Glowing Fairy Lights directly on bulbs */}
      <div className="only-night h-full w-full">
        {FAIRY_LIGHTS.map(([x, y], i) => {
          const delay = (i * 0.13) % 2.8;
          const duration = 2.2 + ((i * 9) % 12) * 0.15;
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
              {/* Soft warm glowing bulb center */}
              <span className="block h-2 w-2 rounded-full bg-[#FFFDE8] shadow-[0_0_8px_2px_#FFE28A,0_0_14px_4px_rgba(255,190,80,0.55)]" />
              {/* Soft ambient aura */}
              <span className="absolute -inset-1.5 rounded-full bg-gradient-radial from-amber-200/35 via-amber-300/10 to-transparent blur-[2px]" />
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
              <span className="block h-1 w-1 rounded-full bg-[#FFFFFF] shadow-[0_0_5px_2px_#FFF3B0,0_0_10px_3px_rgba(255,220,120,0.4)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
