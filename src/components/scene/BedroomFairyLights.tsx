'use client';

// Exact coordinates of the painted fairy light garland bulbs across the Bedroom artwork
export const BEDROOM_FAIRY_LIGHTS: [number, number][] = [
  // Left swag above bed & framed wall art
  [3.0, 5.5],
  [5.1, 6.6],
  [8.8, 8.0],
  [12.5, 9.0],
  [15.5, 8.2],
  [18.2, 6.9],
  [21.0, 5.2],
  [23.4, 3.5],

  // Middle swag above plushies, headboard & cloud shelf
  [26.5, 6.2],
  [30.5, 8.5],
  [35.0, 9.8],
  [39.5, 8.2],
  [42.8, 6.5],
  [45.6, 4.8],
  [48.2, 5.5],
  [50.8, 5.9],
  [53.0, 4.5],
  [55.3, 2.7],

  // Swag leading over wooden shelves towards the window
  [59.0, 4.8],
  [63.0, 6.2],
  [66.5, 4.8],
  [69.4, 2.5],

  // Main swag draped across the window curtain rod & upper right wall
  [71.8, 3.8],
  [74.4, 5.1],
  [77.2, 5.0],
  [79.9, 4.8],
  [83.5, 4.5],
  [87.5, 4.4],
  [91.2, 4.3],
  [94.5, 4.8],
  [97.8, 5.3],

  // Soft vertical twinkle drop along the window curtain & shelves
  [90.3, 15.0],
  [88.0, 16.8],
  [88.1, 19.4],
  [89.5, 19.9],
  [91.4, 21.0],
];

// Soft ambient bedroom specks & dust motes floating peacefully in the sun or moonlight
export const BEDROOM_SPECKS: [number, number][] = [
  [10.0, 22.0],
  [16.0, 32.0],
  [22.0, 44.0],
  [34.0, 26.0],
  [48.0, 22.0],
  [62.0, 28.0],
  [70.0, 38.0],
  [82.0, 25.0],
  [88.0, 34.0],
  [40.0, 52.0],
  [68.0, 60.0],
  [85.0, 64.0],
];

export default function BedroomFairyLights() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
      {/* 1. DAYTIME: Soft Prismatic Glass Sun-Catchers */}
      <div className="only-day h-full w-full">
        {BEDROOM_FAIRY_LIGHTS.map(([x, y], i) => {
          const delay = (i * 0.19) % 3.4;
          const duration = 3.2 + ((i * 7) % 15) * 0.12;
          return (
            <div
              key={`bedroom-prism-${i}`}
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

        {BEDROOM_SPECKS.map(([x, y], i) => {
          const delay = (i * 0.35) % 4.5;
          const duration = 4.2 + ((i * 11) % 20) * 0.15;
          return (
            <div
              key={`bedroom-sunmote-${i}`}
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

      {/* 2. NIGHTTIME: Warm Amber Glowing Fairy Lights directly on bulbs */}
      <div className="only-night h-full w-full">
        {BEDROOM_FAIRY_LIGHTS.map(([x, y], i) => {
          const delay = (i * 0.14) % 2.9;
          const duration = 2.2 + ((i * 9) % 12) * 0.15;
          return (
            <div
              key={`bedroom-fairy-${i}`}
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

        {BEDROOM_SPECKS.map(([x, y], i) => {
          const delay = (i * 0.25) % 3.5;
          const duration = 2.8 + ((i * 13) % 20) * 0.1;
          return (
            <div
              key={`bedroom-speck-${i}`}
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
