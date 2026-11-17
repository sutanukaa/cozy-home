'use client';

// Coordinates of the fairy light garland bulbs draped across the Library artwork
export const LIBRARY_FAIRY_LIGHTS: [number, number][] = [
  // Swag 1: Top left wall above card catalog & houseplant
  [2.5, 4.2],
  [5.2, 6.8],
  [8.5, 9.2],
  [12.0, 10.5],
  [15.5, 9.8],
  [18.8, 7.8],
  [22.0, 5.2],
  [24.8, 3.6],

  // Swag 2: Scallop curving gently above creeping ivy vines
  [27.0, 5.8],
  [29.5, 8.8],
  [32.5, 10.2],
  [35.8, 8.5],
  [38.5, 5.5],

  // Swag 3: Upper crown moulding across the great bookcase
  [41.0, 3.8],
  [44.5, 5.2],
  [48.0, 6.5],
  [51.8, 7.0],
  [55.5, 6.5],
  [59.2, 5.0],
  [62.8, 3.6],

  // Swag 4: Secondary gentle swag along the brass rolling ladder rail
  [38.5, 12.0],
  [42.0, 14.2],
  [46.0, 15.5],
  [50.2, 15.8],
  [54.5, 15.2],
  [58.5, 13.8],
  [62.2, 12.0],

  // Swag 5: Upper right canopy & hanging ivy above reading armchair
  [64.8, 4.2],
  [68.2, 6.2],
  [71.8, 8.0],
  [75.5, 9.0],
  [79.2, 8.2],
  [83.0, 6.5],
  [86.5, 4.8],
  [90.0, 3.6],
  [93.5, 4.8],
  [96.8, 6.2],

  // Vertical trailing drops intertwined with cascading ivy vines
  [11.5, 15.5],
  [12.8, 20.2],
  [13.8, 24.8],
  [76.8, 14.2],
  [78.5, 19.0],
  [79.8, 23.5],
];

// Soft ambient magical library dust motes floating peacefully in the air
export const LIBRARY_SPECKS: [number, number][] = [
  [8.0, 28.0],
  [15.0, 38.0],
  [22.0, 48.0],
  [34.0, 28.0],
  [46.0, 36.0],
  [56.0, 26.0],
  [64.0, 40.0],
  [72.0, 30.0],
  [82.0, 42.0],
  [89.0, 32.0],
  [28.0, 62.0],
  [42.0, 68.0],
  [68.0, 62.0],
  [84.0, 68.0],
];

export default function LibraryFairyLights() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
      {/* 1. DAYTIME: Soft Prismatic Glass Sun-Catchers */}
      <div className="only-day h-full w-full">
        {LIBRARY_FAIRY_LIGHTS.map(([x, y], i) => {
          const delay = (i * 0.18) % 3.4;
          const duration = 3.2 + ((i * 7) % 15) * 0.12;
          return (
            <div
              key={`library-prism-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `sun-prism-glint ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <span className="block h-1.5 w-1.5 rounded-full border border-white/60 bg-white/40 shadow-[0_1px_3px_rgba(255,255,255,0.7)] backdrop-blur-[1px]" />
              <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-pink-300/30 via-amber-200/20 to-sky-300/30 blur-[1.5px]" />
            </div>
          );
        })}

        {LIBRARY_SPECKS.map(([x, y], i) => {
          const delay = (i * 0.32) % 4.5;
          const duration = 4.2 + ((i * 11) % 20) * 0.15;
          return (
            <div
              key={`library-sunmote-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `sun-mote-drift ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <span className="block h-1 w-1 rounded-full bg-white/65 shadow-[0_0_5px_rgba(255,230,170,0.55)]" />
            </div>
          );
        })}
      </div>

      {/* 2. NIGHTTIME: Warm Amber Glowing Fairy Lights directly on garland bulbs */}
      <div className="only-night h-full w-full">
        {LIBRARY_FAIRY_LIGHTS.map(([x, y], i) => {
          const delay = (i * 0.13) % 2.9;
          const duration = 2.2 + ((i * 9) % 12) * 0.15;
          return (
            <div
              key={`library-fairy-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `fairy-pulse ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              {/* Soft warm glowing bulb center */}
              <span className="block h-2 w-2 rounded-full bg-[#FFFDE8] shadow-[0_0_8px_2px_#FFE28A,0_0_14px_4px_rgba(255,190,80,0.6)]" />
              {/* Soft ambient aura */}
              <span className="absolute -inset-1.5 rounded-full bg-gradient-radial from-amber-200/40 via-amber-300/15 to-transparent blur-[2px]" />
            </div>
          );
        })}

        {LIBRARY_SPECKS.map(([x, y], i) => {
          const delay = (i * 0.22) % 3.5;
          const duration = 2.8 + ((i * 13) % 20) * 0.1;
          return (
            <div
              key={`library-speck-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `speck-twinkle ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <span className="block h-1 w-1 rounded-full bg-[#FFFFFF] shadow-[0_0_5px_2px_#FFF3B0,0_0_10px_3px_rgba(255,220,120,0.45)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
