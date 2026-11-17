'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTime } from '@/components/providers/TimeProvider';

type CatState = 'sleep' | 'wake' | 'paw' | 'loaf' | 'play' | 'yawn';

const SPRITES: CatState[] = ['sleep', 'wake', 'paw', 'loaf', 'play', 'yawn'];

export default function LivingRoomElements() {
  const { theme } = useTime();
  const [lampOn, setLampOn] = useState(true);
  const [catState, setCatState] = useState<CatState>('sleep');
  const [catSpeech, setCatSpeech] = useState<string | null>('zzzz');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevThemeRef = useRef<string>(theme);
  const clickIndexRef = useRef<number>(0);

  // Clear any active scheduled timeout safely
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Schedule a step in the animation sequence
  const schedule = useCallback((fn: () => void, delayMs: number) => {
    clearTimer();
    timerRef.current = setTimeout(fn, delayMs);
  }, [clearTimer]);

  // Preload all 6 cat action sprites immediately on mount for zero-flicker transitions
  useEffect(() => {
    SPRITES.forEach((st) => {
      const img = new Image();
      img.src = `/assets/objects/basket-cat-${st}.webp`;
    });
  }, []);

  // Full natural daytime animation cycle:
  // 1. Initial sleep with zzzz (no emojis)
  // 2. Stretches and slowly wakes up and greets
  // 3. Plays, then settles
  // 4. Yawns and falls back asleep
  // 5. Sleeps for a restful period before stirring again
  const runDayCycle = useCallback(() => {
    // 1. Sleeps with zzzz
    setCatState('sleep');
    setCatSpeech('zzzz');

    schedule(() => {
      // 2. Cat stretches and slowly wakes up
      setCatState('wake');
      setCatSpeech('*big stretch*');

      schedule(() => {
        // 3. Greets the visitor warmly (no emojis)
        setCatState('wake');
        setCatSpeech('mrrp! hello');

        schedule(() => {
          // 4. Plays happily in the basket
          setCatState('play');
          setCatSpeech('bat bat bat!');

          schedule(() => {
            // 5. Settles into a cozy loaf
            setCatState('loaf');
            setCatSpeech('cozy loaf mode');

            schedule(() => {
              // 6. Slowly gets sleepy and yawns
              setCatState('yawn');
              setCatSpeech('*big sleepy yawn*');

              schedule(() => {
                // 7. Falls asleep again with zzzz
                setCatState('sleep');
                setCatSpeech('zzzz');

                // 8. Resting period before stirring again during the day
                schedule(() => {
                  if (prevThemeRef.current === 'day') {
                    runDayCycle();
                  }
                }, 16000);
              }, 3500); // yawn duration
            }, 5000); // loaf duration
          }, 4500); // play duration
        }, 3500); // greet duration
      }, 3000); // stretch duration
    }, 5000); // initial sleep duration
  }, [schedule]);

  // Manage day / night transitions and initial start
  useEffect(() => {
    const prevTheme = prevThemeRef.current;
    prevThemeRef.current = theme;

    // When the day turns into night (or user toggles night mode)
    if (theme === 'night') {
      if (catState !== 'sleep') {
        // Yawn and fall asleep!
        clearTimer();
        setCatState('yawn');
        setCatSpeech('*big sleepy yawn*');
        schedule(() => {
          setCatState('sleep');
          setCatSpeech('zzzz');
        }, 3200);
      } else {
        // Already sleeping, maintain zzzz
        setCatSpeech('zzzz');
      }
      return;
    }

    // Daytime: start or resume daytime lifecycle
    if (theme === 'day') {
      if (prevTheme === 'night') {
        // Morning transition: brief sleep then wake up
        schedule(() => {
          runDayCycle();
        }, 1500);
      } else {
        runDayCycle();
      }
    }

    return () => clearTimer();
  }, [theme, runDayCycle, clearTimer, schedule]);

  // Interactive petting / clicking: visitor can interact at any time
  const pokeCat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    clearTimer();

    const CLICK_ACTIONS: { state: CatState; sound: string }[] = [
      { state: 'wake', sound: 'mrrp! hello' },
      { state: 'paw', sound: 'high five!' },
      { state: 'play', sound: 'bat bat bat!' },
      { state: 'loaf', sound: 'maximum cozy loaf mode' },
      { state: 'yawn', sound: '*big sleepy yawn*' },
    ];

    const currentAction = CLICK_ACTIONS[clickIndexRef.current % CLICK_ACTIONS.length];
    clickIndexRef.current += 1;

    setCatState(currentAction.state);
    setCatSpeech(currentAction.sound);

    // After clicking stops, gracefully wind down through a yawn and back to sleep
    schedule(() => {
      setCatState('yawn');
      setCatSpeech('*big sleepy yawn*');

      schedule(() => {
        setCatState('sleep');
        setCatSpeech('zzzz');

        // If daytime, resume natural day cycle after a resting period
        if (theme === 'day') {
          schedule(() => {
            runDayCycle();
          }, 14000);
        }
      }, 3000);
    }, 4000);
  };

  const toggleLamp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLampOn((prev) => !prev);
  };

  const catSrc = `/assets/objects/basket-cat-${catState}.webp`;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Floor Lamp: Placed neatly on the floorboards between Porch door */}
      {/*    and the Monstera plant (grounded at bottom: 18%, left: 78.8%)   */}
      {/* ------------------------------------------------------------------ */}
      <div className="only-night">
        <div
          onClick={toggleLamp}
          title={lampOn ? 'Click to turn lamp OFF' : 'Click to turn lamp ON'}
          className="pointer-events-auto absolute -translate-x-1/2 cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            left: '78.8%',
            bottom: '18.0%',
            width: '5.8%',
            height: '15.5%',
          }}
        >
          {/* Soft radial light bloom when lamp is ON */}
          {lampOn && (
            <div
              className="pointer-events-none absolute -inset-16 rounded-full transition-opacity duration-700"
              style={{
                background:
                  'radial-gradient(circle, rgba(255, 235, 160, 0.5) 0%, rgba(255, 205, 110, 0.25) 40%, rgba(255, 180, 90, 0.08) 65%, transparent 80%)',
                filter: 'blur(16px)',
                animation: 'lamp-warmth 4s ease-in-out infinite',
              }}
            />
          )}

          {/* Illustrated Lamp Sprite */}
          <img
            src={lampOn ? '/assets/objects/lamp-on.webp' : '/assets/objects/lamp-off.webp'}
            alt={lampOn ? 'Lamp on' : 'Lamp off'}
            className="relative h-full w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-opacity duration-300"
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Basket Cat Overlay: Resting firmly on the wooden floorboards    */}
      {/*    in front of the couch base (left: 20.2%, bottom: 10.5%)         */}
      {/* ------------------------------------------------------------------ */}
      <div
        onClick={pokeCat}
        title="Pet the cozy kitten"
        className="pointer-events-auto group absolute -translate-x-1/2 cursor-pointer transition-transform duration-150 active:scale-95"
        style={{
          left: '20.2%',
          bottom: '10.5%',
          width: '12%',
          height: '15.5%',
        }}
      >
        <div className="relative h-full w-full">
          {/* Soft ground contact shadow: anchors the basket firmly to the floor */}
          <div
            className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-[50%]"
            style={{
              width: '82%',
              height: '14px',
              background:
                'radial-gradient(ellipse at center, rgba(20, 10, 25, 0.55) 0%, rgba(20, 10, 25, 0.22) 50%, transparent 75%)',
              filter: 'blur(3px)',
            }}
          />

          {/* Static, grounded kitten sprite (zero breathing jitter) */}
          <img
            key={catSrc}
            src={catSrc}
            alt="Living room kitten"
            className="relative h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.22)]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Speech / thought bubble */}
          {catSpeech && (
            <div className="pointer-events-none absolute -top-9 left-1/2 z-30 -translate-x-1/2">
              <div className="relative">
                <span
                  className={`block whitespace-nowrap rounded-full border border-pink-200/60 bg-paper/95 px-3.5 py-1 font-hand text-base font-bold text-ink shadow-lg backdrop-blur-sm ${
                    catState === 'sleep' ? 'animate-bob tracking-widest' : 'animate-pop-in'
                  }`}
                >
                  {catSpeech}
                </span>

                {/* Comic thought bubbles for sleeping, speech tail for awake */}
                {catState === 'sleep' ? (
                  <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full border border-pink-200/60 bg-paper shadow-sm" />
                    <span className="h-1 w-1 rounded-full border border-pink-200/60 bg-paper shadow-sm" />
                  </div>
                ) : (
                  <div className="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-paper" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
