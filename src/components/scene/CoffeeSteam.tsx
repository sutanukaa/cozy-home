'use client';

/**
 * Gentle curling coffee/tea steam wisps floating above the mug
 */
export default function CoffeeSteam() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute select-none"
      style={{
        left: '61.2%',
        top: '43.2%',
        width: '3.5%',
        height: '7.5%',
      }}
    >
      <div className="relative h-full w-full">
        {/* Steam Wisp 1 */}
        <span
          className="absolute bottom-0 left-1/3 block h-5 w-1.5 rounded-full bg-white/45 blur-[1.5px]"
          style={{
            animation: 'wisp-rise 2.8s ease-in-out infinite',
          }}
        />
        {/* Steam Wisp 2 */}
        <span
          className="absolute bottom-1 left-1/2 block h-6 w-1.5 rounded-full bg-white/40 blur-[1.5px]"
          style={{
            animation: 'wisp-rise 3.2s ease-in-out infinite 0.9s',
          }}
        />
        {/* Steam Wisp 3 */}
        <span
          className="absolute bottom-0 left-2/3 block h-5 w-1.5 rounded-full bg-white/35 blur-[1.5px]"
          style={{
            animation: 'wisp-rise 3.0s ease-in-out infinite 1.7s',
          }}
        />
      </div>
    </div>
  );
}
