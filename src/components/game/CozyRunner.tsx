'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────── constants ─────────────────────────── */
// All positions are in "game world" units; the canvas scales to fill its container.
const WORLD_W = 800;
const WORLD_H = 300;
const GROUND_Y = 250;
const GRAVITY = 0.55;
const JUMP_FORCE = -10.5;
const INITIAL_SPEED = 3.5;
const MAX_SPEED = 8;
const SPEED_INCREMENT = 0.002;

// Character
const CHAR_W = 44;
const CHAR_H = 52;
const CHAR_X = 70; // fixed horizontal position

// Obstacles – much wider spacing
const OB_MIN_GAP = 260;
const OB_MAX_GAP = 420;

type ObstacleKind = 'cactus' | 'cactus-tall' | 'cactus-double';
interface Obstacle {
  x: number;
  kind: ObstacleKind;
  w: number;
  h: number;
  scored: boolean;
}

const OB_DEFS: Record<ObstacleKind, { w: number; h: number }> = {
  cactus:          { w: 20, h: 28 },
  'cactus-tall':   { w: 18, h: 42 },
  'cactus-double': { w: 34, h: 28 },
};

interface DustParticle {
  x: number;
  y: number;
  age: number;
}

/* ─────────────────── audio helpers (Web Audio API) ─────────────── */
function lazyAudioCtx() {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

function sfxJump(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g).connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(260, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.08);
  g.gain.setValueAtTime(0.10, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
  osc.start(); osc.stop(ctx.currentTime + 0.14);
}

function sfxMilestone(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g).connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
  g.gain.setValueAtTime(0.07, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.10);
  osc.start(); osc.stop(ctx.currentTime + 0.10);
}

function sfxGameOver(ctx: AudioContext) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g).connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, t);
  osc.frequency.setValueAtTime(330, t + 0.12);
  osc.frequency.setValueAtTime(220, t + 0.24);
  g.gain.setValueAtTime(0.10, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  osc.start(t); osc.stop(t + 0.4);
}

/* ──────────────────── draw helpers ─────────────────────────────── */
function drawCactus(ctx: CanvasRenderingContext2D, x: number, y: number, kind: ObstacleKind) {
  const def = OB_DEFS[kind];
  const px = 4;
  const cols = Math.floor(def.w / px);
  const rows = Math.floor(def.h / px);
  const tL = Math.floor(cols * 0.3);
  const tR = Math.floor(cols * 0.7);

  ctx.fillStyle = '#7CB87C';
  for (let r = 0; r < rows; r++)
    for (let c = tL; c < tR; c++)
      ctx.fillRect(x + c * px, y + r * px, px - 1, px - 1);

  if (kind === 'cactus-tall') {
    const aY = Math.floor(rows * 0.35);
    for (let c = 0; c < tL; c++) {
      ctx.fillRect(x + c * px, y + aY * px, px - 1, px - 1);
      ctx.fillRect(x + c * px, y + (aY - 1) * px, px - 1, px - 1);
    }
    const aY2 = Math.floor(rows * 0.55);
    for (let c = tR; c < cols; c++) {
      ctx.fillRect(x + c * px, y + aY2 * px, px - 1, px - 1);
      ctx.fillRect(x + c * px, y + (aY2 - 1) * px, px - 1, px - 1);
    }
  }
  if (kind === 'cactus-double') {
    const off = Math.floor(cols * 0.55);
    for (let r = 0; r < rows; r++)
      for (let c = off; c < cols; c++)
        ctx.fillRect(x + c * px, y + r * px, px - 1, px - 1);
  }
  ctx.fillStyle = '#5A8F5A';
  for (let c = tL; c < tR; c++)
    ctx.fillRect(x + c * px, y + (rows - 1) * px, px - 1, px - 1);
}

/* ──────────────────── main component ──────────────────────────── */
type GamePhase = 'idle' | 'running' | 'over';

export default function CozyRunner() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);

  /* mutable refs for the hot loop */
  const phaseR = useRef<GamePhase>('idle');
  const scoreR = useRef(0);
  const hiR = useRef(0);
  const charY = useRef(GROUND_Y - CHAR_H);
  const vy = useRef(0);
  const grounded = useRef(true);
  const spd = useRef(INITIAL_SPEED);
  const obs = useRef<Obstacle[]>([]);
  const tick = useRef(0);
  const dust = useRef<DustParticle[]>([]);
  const gndOff = useRef(0);
  const actx = useRef<AudioContext | null>(null);

  /* sprites */
  const run1 = useRef<HTMLImageElement | null>(null);
  const run2 = useRef<HTMLImageElement | null>(null);
  const jump = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const mk = (src: string) => { const i = new Image(); i.src = src; return i; };
    run1.current = mk('/assets/objects/sutanuka-run.png');
    run2.current = mk('/assets/objects/sutanuka-run-2.png');
    jump.current = mk('/assets/objects/sutanuka-jump.png');
  }, []);

  const audio = useCallback(() => {
    if (!actx.current) actx.current = lazyAudioCtx();
    const c = actx.current;
    if (c && c.state === 'suspended') c.resume();
    return c;
  }, []);

  /* spawn */
  const spawn = useCallback(() => {
    const kinds: ObstacleKind[] = ['cactus', 'cactus-tall', 'cactus-double'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const def = OB_DEFS[kind];
    const last = obs.current[obs.current.length - 1];
    const gap = OB_MIN_GAP + Math.random() * (OB_MAX_GAP - OB_MIN_GAP);
    const sx = last ? Math.max(WORLD_W + 40, last.x + last.w + gap) : WORLD_W + 60;
    obs.current.push({ x: sx, kind, w: def.w, h: def.h, scored: false });
  }, []);

  /* jump action */
  const doJump = useCallback(() => {
    if (!grounded.current) return;
    vy.current = JUMP_FORCE;
    grounded.current = false;
    const c = audio();
    if (c) sfxJump(c);
  }, [audio]);

  /* start / restart */
  const start = useCallback(() => {
    charY.current = GROUND_Y - CHAR_H;
    vy.current = 0;
    grounded.current = true;
    spd.current = INITIAL_SPEED;
    obs.current = [];
    tick.current = 0;
    scoreR.current = 0;
    dust.current = [];
    gndOff.current = 0;
    setScore(0);
    phaseR.current = 'running';
    setPhase('running');
    spawn();
    spawn();
    audio();
  }, [spawn, audio]);

  /* keyboard */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (phaseR.current === 'idle' || phaseR.current === 'over') start();
        else if (phaseR.current === 'running') doJump();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [start, doJump]);

  /* touch */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const h = (e: TouchEvent) => {
      e.preventDefault();
      if (phaseR.current === 'idle' || phaseR.current === 'over') start();
      else if (phaseR.current === 'running') doJump();
    };
    el.addEventListener('touchstart', h, { passive: false });
    return () => el.removeEventListener('touchstart', h);
  }, [start, doJump]);

  /* resize canvas to fill wrapper */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect();
      canvas.width = Math.floor(r.width);
      canvas.height = Math.floor(r.height);
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  /* ─── game loop ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;

    const loop = () => {
      raf = requestAnimationFrame(loop);

      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      // Scale factor: map WORLD coords → canvas pixels
      const sx = cw / WORLD_W;
      const sy = ch / WORLD_H;

      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.scale(sx, sy);

      /* sky */
      const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      sky.addColorStop(0, '#FFF6EC');
      sky.addColorStop(1, '#FFDFE7');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, WORLD_W, GROUND_Y);

      /* ground */
      ctx.fillStyle = '#E8C5CE';
      ctx.fillRect(0, GROUND_Y, WORLD_W, WORLD_H - GROUND_Y);

      /* ground dashes */
      ctx.fillStyle = '#D4A0AD';
      const dg = 40;
      const doff = gndOff.current % dg;
      for (let x = -doff; x < WORLD_W + dg; x += dg) {
        ctx.fillRect(x, GROUND_Y + 8, 18, 2);
        ctx.fillRect(x + dg * 0.5, GROUND_Y + 18, 10, 2);
      }

      /* clouds */
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      const co = (gndOff.current * 0.15) % (WORLD_W + 200);
      ctx.beginPath();
      ctx.arc(200 - co + WORLD_W, 50, 20, 0, Math.PI * 2);
      ctx.arc(224 - co + WORLD_W, 44, 26, 0, Math.PI * 2);
      ctx.arc(250 - co + WORLD_W, 50, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(550 - co, 65, 16, 0, Math.PI * 2);
      ctx.arc(570 - co, 58, 20, 0, Math.PI * 2);
      ctx.arc(588 - co, 65, 14, 0, Math.PI * 2);
      ctx.fill();

      const running = phaseR.current === 'running';

      if (running) {
        tick.current += 1;
        spd.current = Math.min(MAX_SPEED, spd.current + SPEED_INCREMENT);
        gndOff.current += spd.current;

        /* physics */
        vy.current += GRAVITY;
        charY.current += vy.current;
        if (charY.current >= GROUND_Y - CHAR_H) {
          charY.current = GROUND_Y - CHAR_H;
          if (!grounded.current) {
            dust.current.push(
              { x: CHAR_X + CHAR_W * 0.5, y: GROUND_Y - 2, age: 0 },
              { x: CHAR_X + CHAR_W * 0.3, y: GROUND_Y - 4, age: 0 },
            );
          }
          vy.current = 0;
          grounded.current = true;
        }

        /* running dust */
        if (grounded.current && tick.current % 10 === 0) {
          dust.current.push({
            x: CHAR_X + CHAR_W * 0.3 + Math.random() * 6,
            y: GROUND_Y - 1 - Math.random() * 3,
            age: 0,
          });
        }

        /* obstacles */
        for (const o of obs.current) {
          o.x -= spd.current;
          if (!o.scored && o.x + o.w < CHAR_X) {
            o.scored = true;
            scoreR.current += 1;
            setScore(scoreR.current);
            if (scoreR.current % 10 === 0) {
              const c = audio();
              if (c) sfxMilestone(c);
            }
          }
        }
        obs.current = obs.current.filter((o) => o.x + o.w > -60);

        const last = obs.current[obs.current.length - 1];
        if (!last || last.x < WORLD_W - 120) spawn();

        /* collision */
        const cb = { x: CHAR_X + 8, y: charY.current + 6, w: CHAR_W - 16, h: CHAR_H - 8 };
        for (const o of obs.current) {
          const ob = { x: o.x + 4, y: GROUND_Y - o.h + 2, w: o.w - 8, h: o.h - 4 };
          if (cb.x < ob.x + ob.w && cb.x + cb.w > ob.x && cb.y < ob.y + ob.h && cb.y + cb.h > ob.y) {
            phaseR.current = 'over';
            setPhase('over');
            if (scoreR.current > hiR.current) {
              hiR.current = scoreR.current;
              setHi(scoreR.current);
            }
            const c = audio();
            if (c) sfxGameOver(c);
            break;
          }
        }
      }

      /* draw obstacles */
      for (const o of obs.current) drawCactus(ctx, o.x, GROUND_Y - o.h, o.kind);

      /* draw dust */
      dust.current = dust.current.filter((d) => d.age < 14);
      for (const d of dust.current) {
        const alpha = Math.max(0, 0.45 - d.age * 0.04);
        ctx.fillStyle = `rgba(210,180,160,${alpha})`;
        const sz = 3 + d.age * 0.7;
        ctx.beginPath(); ctx.arc(d.x, d.y, sz, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(d.x - 4, d.y - 2, sz * 0.6, 0, Math.PI * 2); ctx.fill();
        if (running) { d.age += 1; d.x -= spd.current * 0.25; }
      }

      /* draw character — smooth, not pixelated */
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const inAir = !grounded.current;
      let spr: HTMLImageElement | null;
      if (inAir) {
        spr = jump.current;
      } else {
        // Alternate run frames every 14 ticks for a smooth stride
        spr = Math.floor(tick.current / 14) % 2 === 0 ? run1.current : run2.current;
      }

      if (spr && spr.complete && spr.naturalWidth > 0) {
        // Preserve aspect ratio of the source sprite
        const srcAspect = spr.naturalWidth / spr.naturalHeight;
        let dw = CHAR_W;
        let dh = CHAR_W / srcAspect;
        // If too tall, constrain by height
        if (dh > CHAR_H + 8) {
          dh = CHAR_H + 8;
          dw = dh * srcAspect;
        }
        const dx = CHAR_X + (CHAR_W - dw) / 2;
        const dy = charY.current + (CHAR_H - dh);
        ctx.drawImage(spr, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = '#E86A92';
        ctx.fillRect(CHAR_X, charY.current, CHAR_W, CHAR_H);
      }

      ctx.imageSmoothingEnabled = false;

      /* HUD score */
      ctx.fillStyle = '#5C3246';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`SCORE: ${String(scoreR.current).padStart(4, '0')}`, WORLD_W - 20, 28);
      if (hiR.current > 0) {
        ctx.fillStyle = '#B07090';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`HI: ${String(hiR.current).padStart(4, '0')}`, WORLD_W - 20, 44);
      }

      /* speed indicator */
      ctx.fillStyle = '#D4A0AD';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      if (running) {
        ctx.fillText(`SPD: ${spd.current.toFixed(1)}`, 16, 28);
      }

      /* overlays */
      if (phaseR.current === 'idle') {
        ctx.fillStyle = 'rgba(30,18,38,0.40)';
        ctx.fillRect(0, 0, WORLD_W, WORLD_H);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFF6EC';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('COZY RUNNER', WORLD_W / 2, WORLD_H * 0.35);
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = '#FFE29A';
        ctx.fillText('Press SPACE or tap to start', WORLD_W / 2, WORLD_H * 0.35 + 30);
        ctx.font = '11px monospace';
        ctx.fillStyle = '#F9C6D3';
        ctx.fillText('Jump over the cacti!', WORLD_W / 2, WORLD_H * 0.35 + 54);
      }

      if (phaseR.current === 'over') {
        ctx.fillStyle = 'rgba(30,18,38,0.50)';
        ctx.fillRect(0, 0, WORLD_W, WORLD_H);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#E86A92';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('GAME OVER', WORLD_W / 2, WORLD_H * 0.32);
        ctx.fillStyle = '#FFF6EC';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`Score: ${scoreR.current}`, WORLD_W / 2, WORLD_H * 0.32 + 32);
        if (scoreR.current >= hiR.current && hiR.current > 0) {
          ctx.fillStyle = '#FFE29A';
          ctx.font = 'bold 12px monospace';
          ctx.fillText('NEW HIGH SCORE!', WORLD_W / 2, WORLD_H * 0.32 + 54);
        }
        ctx.fillStyle = '#FFE29A';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('Press SPACE or tap to retry', WORLD_W / 2, WORLD_H * 0.32 + 76);
      }

      ctx.restore();
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [audio, spawn]);

  return (
    <div ref={wrapRef} className="relative h-full w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        tabIndex={0}
        aria-label="Cozy Runner game. Press Space or tap to jump."
      />
      {/* Floating controls hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-cocoa/10 bg-white/70 px-3 py-1 font-mono text-[10px] text-cocoa/60 backdrop-blur-sm dark:border-white/10 dark:bg-black/40 dark:text-white/50">
        <span className="rounded border border-cocoa/15 bg-cocoa/5 px-1 py-0.5 dark:border-white/10 dark:bg-white/5">
          SPACE
        </span>
        <span>/</span>
        <span className="rounded border border-cocoa/15 bg-cocoa/5 px-1 py-0.5 dark:border-white/10 dark:bg-white/5">
          UP
        </span>
        <span>to jump</span>
        <span className="text-cocoa/25 dark:text-white/20">|</span>
        <span>Tap on mobile</span>
      </div>
      {/* Score display in React layer */}
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-xs font-bold text-cocoa/80 dark:text-pink-100/80">
        {phase === 'running' && `SCORE: ${String(score).padStart(4, '0')}`}
      </div>
      {hi > 0 && (
        <div className="pointer-events-none absolute top-2 right-3 font-mono text-[10px] font-bold text-cocoa/50 dark:text-pink-200/50">
          HI: {String(hi).padStart(4, '0')}
        </div>
      )}
    </div>
  );
}
