'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────── constants ─────────────────────────── */
const CANVAS_W = 600;
const CANVAS_H = 200;
const GROUND_Y = 160; // character stands here (feet)
const GRAVITY = 0.6;
const JUMP_FORCE = -11;
const INITIAL_SPEED = 4;
const MAX_SPEED = 10;
const SPEED_INCREMENT = 0.003; // per frame
const OBSTACLE_MIN_GAP = 90;
const OBSTACLE_MAX_GAP = 160;

const CHAR_W = 48;
const CHAR_H = 56;

/* Obstacle types with their own sizes */
type ObstacleKind = 'cactus' | 'cactus-tall' | 'cactus-double';
interface Obstacle {
  x: number;
  kind: ObstacleKind;
  w: number;
  h: number;
  scored: boolean;
}

const OBSTACLE_DEFS: Record<ObstacleKind, { w: number; h: number }> = {
  cactus:        { w: 20, h: 30 },
  'cactus-tall': { w: 18, h: 44 },
  'cactus-double': { w: 36, h: 30 },
};

/* ─────────────────────── audio helpers (Web Audio) ─────────────── */
function createAudioCtx() {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

function playJumpSfx(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(260, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

function playScoreSfx(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

function playGameOverSfx(ctx: AudioContext) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, t);
  osc.frequency.setValueAtTime(330, t + 0.12);
  osc.frequency.setValueAtTime(220, t + 0.24);
  gain.gain.setValueAtTime(0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  osc.start(t);
  osc.stop(t + 0.4);
}

/* ─────────────────────── draw helpers ──────────────────────────── */
function drawPixelCactus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  kind: ObstacleKind,
) {
  const def = OBSTACLE_DEFS[kind];
  const px = 4; // pixel block size for the retro look

  ctx.fillStyle = '#7CB87C'; // sage green body
  const cols = Math.floor(def.w / px);
  const rows = Math.floor(def.h / px);

  // Draw trunk
  const trunkLeft = Math.floor(cols * 0.3);
  const trunkRight = Math.floor(cols * 0.7);
  for (let r = 0; r < rows; r++) {
    for (let c = trunkLeft; c < trunkRight; c++) {
      ctx.fillRect(x + c * px, y + r * px, px - 1, px - 1);
    }
  }

  if (kind === 'cactus-tall') {
    // Left arm
    const armY = Math.floor(rows * 0.35);
    for (let c = 0; c < trunkLeft; c++) {
      ctx.fillRect(x + c * px, y + armY * px, px - 1, px - 1);
      ctx.fillRect(x + c * px, y + (armY - 1) * px, px - 1, px - 1);
    }
    // Right arm
    const armY2 = Math.floor(rows * 0.55);
    for (let c = trunkRight; c < cols; c++) {
      ctx.fillRect(x + c * px, y + armY2 * px, px - 1, px - 1);
      ctx.fillRect(x + c * px, y + (armY2 - 1) * px, px - 1, px - 1);
    }
  }

  if (kind === 'cactus-double') {
    // Second cactus to the right
    const offset = Math.floor(cols * 0.55);
    for (let r = 0; r < rows; r++) {
      for (let c = offset; c < cols; c++) {
        ctx.fillRect(x + c * px, y + r * px, px - 1, px - 1);
      }
    }
  }

  // Darker outline on bottom
  ctx.fillStyle = '#5A8F5A';
  for (let c = trunkLeft; c < trunkRight; c++) {
    ctx.fillRect(x + c * px, y + (rows - 1) * px, px - 1, px - 1);
  }
}

function drawDustPuff(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  age: number,
) {
  const alpha = Math.max(0, 0.5 - age * 0.05);
  ctx.fillStyle = `rgba(210, 180, 160, ${alpha})`;
  const size = 3 + age * 0.8;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 5, y - 2, size * 0.7, 0, Math.PI * 2);
  ctx.fill();
}

/* ─────────────────────── main component ───────────────────────── */
type GameState = 'idle' | 'running' | 'over';

interface DustParticle {
  x: number;
  y: number;
  age: number;
}

export default function CozyRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Refs for game loop state (no re-renders during play)
  const stateRef = useRef<GameState>('idle');
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const charY = useRef(GROUND_Y - CHAR_H);
  const velY = useRef(0);
  const isGrounded = useRef(true);
  const speed = useRef(INITIAL_SPEED);
  const obstacles = useRef<Obstacle[]>([]);
  const frameTick = useRef(0);
  const dustParticles = useRef<DustParticle[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const groundOffset = useRef(0);

  // Sprite images
  const spriteRun1 = useRef<HTMLImageElement | null>(null);
  const spriteRun2 = useRef<HTMLImageElement | null>(null);
  const spriteJump = useRef<HTMLImageElement | null>(null);
  const spritesLoaded = useRef(0);

  // Preload sprites
  useEffect(() => {
    const loadImg = (src: string) => {
      const img = new Image();
      img.src = src;
      img.onload = () => { spritesLoaded.current += 1; };
      return img;
    };
    spriteRun1.current = loadImg('/assets/objects/sutanuka-run.png');
    spriteRun2.current = loadImg('/assets/objects/sutanuka-run-2.png');
    spriteJump.current = loadImg('/assets/objects/sutanuka-jump.png');
  }, []);

  // Lazy-create audio context
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }, []);

  /* ─── spawn obstacle ──────── */
  const spawnObstacle = useCallback(() => {
    const kinds: ObstacleKind[] = ['cactus', 'cactus-tall', 'cactus-double'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const def = OBSTACLE_DEFS[kind];
    const lastOb = obstacles.current[obstacles.current.length - 1];
    const gap =
      OBSTACLE_MIN_GAP +
      Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP);
    const startX = lastOb
      ? Math.max(CANVAS_W + 20, lastOb.x + lastOb.w + gap)
      : CANVAS_W + 40;

    obstacles.current.push({
      x: startX,
      kind,
      w: def.w,
      h: def.h,
      scored: false,
    });
  }, []);

  /* ─── jump ────────────────── */
  const jump = useCallback(() => {
    if (!isGrounded.current) return;
    velY.current = JUMP_FORCE;
    isGrounded.current = false;
    const ctx = getAudioCtx();
    if (ctx) playJumpSfx(ctx);
  }, [getAudioCtx]);

  /* ─── start / restart ─────── */
  const startGame = useCallback(() => {
    charY.current = GROUND_Y - CHAR_H;
    velY.current = 0;
    isGrounded.current = true;
    speed.current = INITIAL_SPEED;
    obstacles.current = [];
    frameTick.current = 0;
    scoreRef.current = 0;
    dustParticles.current = [];
    groundOffset.current = 0;
    setScore(0);
    stateRef.current = 'running';
    setGameState('running');
    spawnObstacle();
    spawnObstacle();
    // Ensure audio context exists
    getAudioCtx();
  }, [spawnObstacle, getAudioCtx]);

  /* ─── input handling ──────── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.key === 'w' ||
        e.key === 'W'
      ) {
        e.preventDefault();
        if (stateRef.current === 'idle' || stateRef.current === 'over') {
          startGame();
        } else if (stateRef.current === 'running') {
          jump();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [startGame, jump]);

  /* ─── touch handling for mobile ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (stateRef.current === 'idle' || stateRef.current === 'over') {
        startGame();
      } else if (stateRef.current === 'running') {
        jump();
      }
    };
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    return () => canvas.removeEventListener('touchstart', handleTouch);
  }, [startGame, jump]);

  /* ─── game loop ───────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      /* ── sky gradient ── */
      const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      sky.addColorStop(0, '#FFF6EC');
      sky.addColorStop(1, '#FFDFE7');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_W, GROUND_Y);

      /* ── ground ── */
      ctx.fillStyle = '#E8C5CE';
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

      // Ground dashes (scrolling)
      ctx.fillStyle = '#D4A0AD';
      const dashW = 16;
      const dashH = 2;
      const dashGap = 30;
      const offset = groundOffset.current % dashGap;
      for (let x = -offset; x < CANVAS_W + dashGap; x += dashGap) {
        ctx.fillRect(x, GROUND_Y + 6, dashW, dashH);
        ctx.fillRect(x + dashGap * 0.5, GROUND_Y + 14, dashW * 0.6, dashH);
      }

      /* ── decorative background clouds ── */
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      const cloudOff = (groundOffset.current * 0.2) % CANVAS_W;
      ctx.beginPath();
      ctx.arc(120 - cloudOff + CANVAS_W, 40, 18, 0, Math.PI * 2);
      ctx.arc(140 - cloudOff + CANVAS_W, 35, 22, 0, Math.PI * 2);
      ctx.arc(160 - cloudOff + CANVAS_W, 40, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(400 - cloudOff, 55, 14, 0, Math.PI * 2);
      ctx.arc(418 - cloudOff, 50, 18, 0, Math.PI * 2);
      ctx.arc(434 - cloudOff, 55, 12, 0, Math.PI * 2);
      ctx.fill();

      const isRunning = stateRef.current === 'running';

      if (isRunning) {
        frameTick.current += 1;
        speed.current = Math.min(MAX_SPEED, speed.current + SPEED_INCREMENT);
        groundOffset.current += speed.current;

        /* ── physics ── */
        velY.current += GRAVITY;
        charY.current += velY.current;
        if (charY.current >= GROUND_Y - CHAR_H) {
          charY.current = GROUND_Y - CHAR_H;
          velY.current = 0;
          if (!isGrounded.current) {
            // Landing dust
            dustParticles.current.push(
              { x: 60, y: GROUND_Y - 2, age: 0 },
              { x: 54, y: GROUND_Y - 4, age: 0 },
            );
          }
          isGrounded.current = true;
        }

        /* ── running dust puffs ── */
        if (isGrounded.current && frameTick.current % 8 === 0) {
          dustParticles.current.push({
            x: 48 + Math.random() * 4,
            y: GROUND_Y - 1 - Math.random() * 3,
            age: 0,
          });
        }

        /* ── obstacles ── */
        for (const ob of obstacles.current) {
          ob.x -= speed.current;

          // Scoring
          if (!ob.scored && ob.x + ob.w < 50) {
            ob.scored = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            // Every 10 pts play a milestone ding
            if (scoreRef.current % 10 === 0) {
              const actx = getAudioCtx();
              if (actx) playScoreSfx(actx);
            }
          }
        }

        // Remove off-screen
        obstacles.current = obstacles.current.filter((ob) => ob.x + ob.w > -40);

        // Spawn new
        const last = obstacles.current[obstacles.current.length - 1];
        if (!last || last.x < CANVAS_W - 80) {
          spawnObstacle();
        }

        /* ── collision ── */
        const charBox = {
          x: 52,
          y: charY.current + 6,
          w: CHAR_W - 16,
          h: CHAR_H - 8,
        };
        for (const ob of obstacles.current) {
          const obBox = {
            x: ob.x + 4,
            y: GROUND_Y - ob.h + 2,
            w: ob.w - 8,
            h: ob.h - 4,
          };
          if (
            charBox.x < obBox.x + obBox.w &&
            charBox.x + charBox.w > obBox.x &&
            charBox.y < obBox.y + obBox.h &&
            charBox.y + charBox.h > obBox.y
          ) {
            stateRef.current = 'over';
            setGameState('over');
            if (scoreRef.current > highScoreRef.current) {
              highScoreRef.current = scoreRef.current;
              setHighScore(scoreRef.current);
            }
            const actx = getAudioCtx();
            if (actx) playGameOverSfx(actx);
            break;
          }
        }
      }

      /* ── draw obstacles ── */
      for (const ob of obstacles.current) {
        drawPixelCactus(ctx, ob.x, GROUND_Y - ob.h, ob.kind);
      }

      /* ── draw dust ── */
      dustParticles.current = dustParticles.current.filter((d) => d.age < 12);
      for (const d of dustParticles.current) {
        drawDustPuff(ctx, d.x, d.y, d.age);
        if (isRunning) {
          d.age += 1;
          d.x -= speed.current * 0.3;
        }
      }

      /* ── draw character ── */
      const inAir = !isGrounded.current;
      let sprite: HTMLImageElement | null;
      if (inAir) {
        sprite = spriteJump.current;
      } else {
        // Alternate run frames every 6 game ticks
        sprite =
          Math.floor(frameTick.current / 6) % 2 === 0
            ? spriteRun1.current
            : spriteRun2.current;
      }

      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        ctx.drawImage(sprite, 50, charY.current, CHAR_W, CHAR_H);
      } else {
        // Fallback pink rectangle
        ctx.fillStyle = '#E86A92';
        ctx.fillRect(50, charY.current, CHAR_W, CHAR_H);
      }

      /* ── HUD: score ── */
      ctx.fillStyle = '#5C3246';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        `SCORE: ${String(scoreRef.current).padStart(4, '0')}`,
        CANVAS_W - 16,
        22,
      );
      if (highScoreRef.current > 0) {
        ctx.fillStyle = '#B07090';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(
          `HI: ${String(highScoreRef.current).padStart(4, '0')}`,
          CANVAS_W - 16,
          36,
        );
      }

      /* ── overlays ── */
      if (stateRef.current === 'idle') {
        // Dim overlay
        ctx.fillStyle = 'rgba(30, 18, 38, 0.45)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = '#FFF6EC';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('COZY RUNNER', CANVAS_W / 2, 70);
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#FFE29A';
        ctx.fillText('Press SPACE or tap to start', CANVAS_W / 2, 100);
        ctx.font = '10px monospace';
        ctx.fillStyle = '#F9C6D3';
        ctx.fillText('Jump over the cacti!', CANVAS_W / 2, 125);
      }

      if (stateRef.current === 'over') {
        ctx.fillStyle = 'rgba(30, 18, 38, 0.55)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = '#E86A92';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_W / 2, 70);
        ctx.fillStyle = '#FFF6EC';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(
          `Score: ${scoreRef.current}`,
          CANVAS_W / 2,
          100,
        );
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#FFE29A';
        ctx.fillText('Press SPACE or tap to retry', CANVAS_W / 2, 130);
      }
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [getAudioCtx, spawnObstacle]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Score bar */}
      <div className="flex w-full max-w-[600px] items-center justify-between px-1 font-mono text-xs font-bold">
        <span className="text-cocoa dark:text-pink-100">
          SCORE: {String(score).padStart(4, '0')}
        </span>
        {highScore > 0 && (
          <span className="text-cocoa/60 dark:text-pink-200/60">
            HI: {String(highScore).padStart(4, '0')}
          </span>
        )}
        <span className="text-butter dark:text-butter">
          {gameState === 'idle'
            ? 'PRESS SPACE'
            : gameState === 'over'
              ? 'GAME OVER'
              : 'RUNNING'}
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full max-w-[600px] rounded-xl border-2 border-[#3D2947] shadow-inner"
        style={{ imageRendering: 'pixelated' }}
        tabIndex={0}
        aria-label="Cozy Runner game canvas. Press Space or tap to jump."
      />

      {/* Controls hint */}
      <div className="flex items-center gap-3 font-mono text-[10px] text-cocoa/70 dark:text-pink-200/60">
        <span className="rounded border border-cocoa/20 bg-cocoa/5 px-1.5 py-0.5 dark:border-white/10 dark:bg-white/5">
          SPACE
        </span>
        <span>or</span>
        <span className="rounded border border-cocoa/20 bg-cocoa/5 px-1.5 py-0.5 dark:border-white/10 dark:bg-white/5">
          UP
        </span>
        <span>to jump</span>
        <span className="mx-1 text-cocoa/30 dark:text-white/20">|</span>
        <span>Tap on mobile</span>
      </div>
    </div>
  );
}
