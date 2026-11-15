'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * Sheer linen curtains that behave like cloth in the wind.
 *
 *  WIND   Random gusts: smooth swell, flutter while it blows, long soft fade. A faint breeze runs underneath.
 *  CLOTH  Each panel's free edge is a chain of nodes pinned at the rod. Every node is an under-damped spring
 *         pulled toward "wind x how far down the cloth it is", and neighbours are coupled, so a gust travels
 *         down the fabric as a ripple, overshoots, then swings back toward the window and settles.
 *  SHAPE  Billowing sweeps the free edges into the room (across the window), flares the panels outward,
 *         lifts and ripples the hem, deepens the folds and lets sunlight glow through the stretched cloth.
 *         Even at rest the edges are wavy and gathered, never ruler-straight.
 *
 * Paths are rewritten each frame directly on the DOM (no React re-renders). It pauses off-screen / in hidden tabs.
 *
 * Testing: in the browser console run  window.dispatchEvent(new Event('curtain-gust'))  for an instant strong gust.
 * If your OS has "reduce motion" on, the curtains stay still unless you pass  <WindowCurtains forceMotion />.
 */

type Pt = [number, number];

const N = 24; // nodes along the cloth
const TOP = 6; // where the cloth hangs from the rod (hidden under the valance)
const BOTTOM = 440; // hem height at rest
const FOLDS = [0.22, 0.45, 0.68, 0.88]; // fold lines across the panel (0 = window side, 1 = free edge)
const MAX_BILLOW = 80; // svg units the hem is pushed toward the room by a full gust

interface PanelCfg {
  side: 'left' | 'right';
  outerX: number; // fixed edge by the window frame
  sign: 1 | -1; // +1 billows toward +x (left panel), -1 toward -x (right panel)
  delay: number; // seconds the gust reaches this panel later
  ks: number; // spring stiffness
  phase: number;
}

const PANELS: PanelCfg[] = [
  { side: 'left', outerX: 12, sign: 1, delay: 0, ks: 11, phase: 0 },
  { side: 'right', outerX: 288, sign: -1, delay: 0.3, ks: 9.5, phase: 1.9 },
];

interface Sim { u: number[]; v: number[]; w: number[] }

const f1 = (n: number) => n.toFixed(1);
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ------------------------------ path helpers ------------------------------ */

/** Smooth Catmull-Rom curve through pts as cubic segments. Pen must already be at pts[0]. */
function curve(pts: Pt[]): string {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])} `;
  }
  return d;
}
const line = (pts: Pt[]) => `M${f1(pts[0][0])},${f1(pts[0][1])} ${curve(pts)}`;

/* ---------------------------------- wind ---------------------------------- */

interface Gust { start: number; rise: number; hold: number; fall: number; peak: number; ph: number }

function createWind() {
  const gusts: Gust[] = [];
  let cursor = 0.6; // first gust arrives right away so you see the curtains come alive
  let first = true;

  const generate = (until: number) => {
    while (cursor < until) {
      const g: Gust = {
        start: cursor,
        rise: 0.6 + Math.random() * 0.8,
        hold: 0.5 + Math.random() * 1.8,
        fall: 1.4 + Math.random() * 1.8,
        peak: first ? 1 : 0.55 + Math.random() * 0.45,
        ph: Math.random() * 6.28,
      };
      first = false;
      gusts.push(g);
      const dur = g.rise + g.hold + g.fall;
      cursor += dur * 0.55 + (Math.random() < 0.3 ? 0.3 + Math.random() * 0.8 : 2 + Math.random() * 4.5);
    }
  };

  const envelope = (t: number, g: Gust) => {
    const x = t - g.start;
    if (x < 0) return 0;
    let e: number;
    if (x < g.rise) {
      const s = x / g.rise;
      e = s * s * (3 - 2 * s);
    } else if (x < g.rise + g.hold) {
      const s = (x - g.rise) / g.hold;
      e = 1 + 0.1 * Math.sin((x - g.rise) * 9 + g.ph) * Math.sin(Math.PI * s);
    } else if (x < g.rise + g.hold + g.fall) {
      const s = (x - g.rise - g.hold) / g.fall;
      e = (1 - s) * (1 - s);
    } else e = 0;
    return e * g.peak;
  };

  return {
    at(t: number) {
      generate(t + 12);
      while (gusts.length && gusts[0].start + gusts[0].rise + gusts[0].hold + gusts[0].fall < t - 4) gusts.shift();
      let w = 0.04 + 0.035 * Math.sin(t * 0.8) + 0.025 * Math.sin(t * 1.9 + 1.3);
      for (const g of gusts) w = Math.max(w, envelope(t, g));
      return clamp(w, 0, 1.1);
    },
    /** Fire an immediate gust (used by the 'curtain-gust' event). */
    trigger(t: number, strength = 1) {
      gusts.push({ start: t, rise: 0.6, hold: 1.2, fall: 2.2, peak: strength, ph: 0 });
    },
  };
}

/* ------------------------------ cloth physics ------------------------------ */

function stepPanel(cfg: PanelCfg, s: Sim, wind: { at(t: number): number }, t: number, dt: number) {
  const c = 1.6; // damping: low on purpose, so the cloth overshoots and sways before settling
  const kc = 60; // neighbour coupling: carries ripples along the cloth

  for (let i = 0; i < N; i++) {
    const f = i / (N - 1);
    // the gust reaches the hem a beat after the top; per-node turbulence stops it moving as one slab
    const wi = wind.at(t - cfg.delay - f * 0.5) * (1 + 0.22 * Math.sin(t * 3.1 + i * 0.55 + cfg.phase));
    s.w[i] = clamp(wi, 0, 1.15);
  }

  const sub = 4;
  const h = dt / sub;
  for (let k = 0; k < sub; k++) {
    for (let i = 1; i < N; i++) {
      const f = i / (N - 1);
      const target = MAX_BILLOW * Math.pow(f, 1.4) * s.w[i];
      const left = s.u[i - 1];
      const right = i < N - 1 ? s.u[i + 1] : s.u[i];
      const drag = c + 0.015 * Math.abs(s.v[i]); // air resistance grows with speed
      const a = cfg.ks * (target - s.u[i]) - drag * s.v[i] + kc * (left + right - 2 * s.u[i]);
      s.v[i] += a * h;
    }
    for (let i = 1; i < N; i++) {
      s.u[i] += s.v[i] * h;
      if (s.u[i] < -6) {
        // the window is a wall: soft bounce instead of passing through
        s.u[i] = -6;
        s.v[i] = Math.abs(s.v[i]) * 0.25;
      }
    }
    s.u[0] = 0;
    s.v[0] = 0;
  }
}

/* -------------------------------- geometry -------------------------------- */

interface Shape { panel: string; hem: string; folds: string[]; foldsHi: string[]; billow: number }

function buildShape(cfg: PanelCfg, s: Sim, t: number): Shape {
  const outer: Pt[] = [];
  const inner: Pt[] = [];

  for (let i = 0; i < N; i++) {
    const f = i / (N - 1);
    const u = Math.max(s.u[i], -6);
    const y = TOP + f * (BOTTOM - TOP);
    const lift = 0.0058 * u * u * (0.35 + 0.65 * f); // billowing shortens the hang, so the hem rises

    // gathered, wavy resting edges (never straight) ...
    const restInner = 74 + 12 * f + 5 * Math.sin(f * Math.PI * 2.2 + cfg.phase * 0.5);
    const restOuter = 3.5 * Math.sin(f * Math.PI * 1.6 + 0.6 + cfg.phase * 0.3);
    // ... plus a travelling flutter along the free edge that grows with the wind
    const ruffle = (1.2 + 0.1 * Math.abs(u)) * Math.sin(i * 0.75 - t * 5.2 + cfg.phase) * f * Math.min(s.w[i], 1);

    inner.push([cfg.outerX + cfg.sign * (restInner + u * 0.95 + ruffle), y - lift]);
    outer.push([cfg.outerX + cfg.sign * (restOuter - 0.3 * Math.max(u, 0) * f), y - lift * 0.55]); // flares out as it fills
  }

  const billow = clamp(s.u[N - 1] / MAX_BILLOW, 0, 1.2);

  // hem: a soft sag when still, lifts into a rippling arc when full of air
  const ob = outer[N - 1];
  const ib = inner[N - 1];
  const hemPts: Pt[] = [ob];
  const M = 8;
  for (let m = 1; m < M; m++) {
    const q = m / M;
    const arc = Math.sin(Math.PI * q);
    const baseY = lerp(ob[1], ib[1], q);
    const y = baseY + 5 * arc * (1 - billow) - 9 * billow * arc + (2 + 6 * billow) * Math.sin(q * Math.PI * 3.2 + t * 3.2 + cfg.phase) * arc;
    hemPts.push([lerp(ob[0], ib[0], q), y]);
  }
  hemPts.push(ib);

  const innerRev = [...inner].reverse();
  const panel = `M${f1(outer[0][0])},${f1(outer[0][1])} ${curve(outer)}${curve(hemPts)}${curve(innerRev)}Z`;
  const hem = line(hemPts);

  // vertical folds: ripple harder, and travel up the cloth, when there is wind in it
  const folds: string[] = [];
  const foldsHi: string[] = [];
  for (const fr of FOLDS) {
    const base: Pt[] = [];
    const hi: Pt[] = [];
    for (let i = 0; i < N; i++) {
      const f = i / (N - 1);
      const wave = Math.sin(i * 0.8 - t * 4.2 + fr * 6 + cfg.phase) * (1.5 + 7 * billow) * f;
      const pleat = 2 * Math.sin(f * Math.PI * 3 + fr * 8); // resting pleats
      const x = lerp(outer[i][0], inner[i][0], fr) + cfg.sign * (wave + pleat);
      const y = lerp(outer[i][1], inner[i][1], fr);
      base.push([x, y]);
      hi.push([x + cfg.sign * 3.5, y]);
    }
    folds.push(line(base));
    foldsHi.push(line(hi));
  }

  return { panel, hem, folds, foldsHi, billow };
}

const emptySim = (): Sim => ({ u: new Array(N).fill(0), v: new Array(N).fill(0), w: new Array(N).fill(0) });

interface PanelEls {
  panel: SVGPathElement | null;
  glow: SVGPathElement | null;
  hem: SVGPathElement | null;
  folds: SVGGElement | null;
  shadow: (SVGPathElement | null)[];
  hi: (SVGPathElement | null)[];
}

/* -------------------------------- component -------------------------------- */

export default function WindowCurtains({ forceMotion = false }: { forceMotion?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const els = useRef<PanelEls[]>(PANELS.map(() => ({ panel: null, glow: null, hem: null, folds: null, shadow: [], hi: [] })));

  // Resting shapes, so server render and first paint already show real (wavy) curtains.
  const initial = useMemo(() => PANELS.map((cfg) => buildShape(cfg, emptySim(), 0)), []);

  useEffect(() => {
    const sims = PANELS.map(emptySim);
    const wind = createWind();
    let raf = 0;
    let last = 0;
    let t = 0;
    let onScreen = true;

    const paint = () => {
      PANELS.forEach((cfg, k) => {
        const shape = buildShape(cfg, sims[k], t);
        const e = els.current[k];
        e.panel?.setAttribute('d', shape.panel);
        e.glow?.setAttribute('d', shape.panel);
        e.hem?.setAttribute('d', shape.hem);
        if (e.glow) e.glow.style.opacity = String(0.06 + 0.34 * Math.min(shape.billow, 1)); // sunlight through stretched cloth
        if (e.folds) e.folds.style.opacity = String(0.55 + 0.45 * Math.min(shape.billow * 1.6, 1));
        shape.folds.forEach((d, j) => e.shadow[j]?.setAttribute('d', d));
        shape.foldsHi.forEach((d, j) => e.hi[j]?.setAttribute('d', d));
      });
    };

    const reduce = !forceMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[WindowCurtains] Still because your OS has "reduce motion" on. Pass forceMotion to animate anyway.');
      }
      PANELS.forEach((_, k) => {
        for (let i = 0; i < N; i++) sims[k].u[i] = MAX_BILLOW * Math.pow(i / (N - 1), 1.4) * 0.15;
        sims[k].w.fill(0.15);
      });
      paint();
      return;
    }

    const frame = (now: number) => {
      raf = 0;
      if (!onScreen || document.hidden) return;
      const dt = last ? Math.min((now - last) / 1000, 0.033) : 0.016;
      last = now;
      t += dt;
      PANELS.forEach((cfg, k) => stepPanel(cfg, sims[k], wind, t, dt));
      paint();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && onScreen && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
    });
    if (rootRef.current) io.observe(rootRef.current);
    const onVis = () => start();
    const onGust = () => wind.trigger(t, 1);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('curtain-gust', onGust);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('curtain-gust', onGust);
    };
  }, [forceMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[15] select-none overflow-hidden transition-[filter] duration-[1400ms] dark:brightness-[0.72] dark:saturate-75"
    >
      <div className="absolute" style={{ left: '80.2%', top: '12.8%', width: '15.6%', height: '51.5%' }}>
        <svg viewBox="0 0 300 450" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <defs>
            {/* sheer linen: denser at the window side, see-through toward the free edge (follows the moving panel) */}
            <linearGradient id="wc-linen-left" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
              <stop offset="30%" stopColor="#FFF7F8" stopOpacity="0.55" />
              <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FDEEF2" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="wc-linen-right" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
              <stop offset="30%" stopColor="#FFF7F8" stopOpacity="0.55" />
              <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FDEEF2" stopOpacity="0.35" />
            </linearGradient>
            <filter id="wc-soft" x="-40%" y="-10%" width="180%" height="130%">
              <feDropShadow dx="-6" dy="10" stdDeviation="8" floodColor="rgba(80, 45, 60, 0.12)" />
            </filter>
            <filter id="wc-blur" x="-20%" y="-5%" width="140%" height="110%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>

          {PANELS.map((cfg, k) => (
            <g key={cfg.side} filter="url(#wc-soft)">
              <path ref={(el) => { els.current[k].panel = el; }} d={initial[k].panel} fill={`url(#wc-linen-${cfg.side})`} />
              <path ref={(el) => { els.current[k].glow = el; }} d={initial[k].panel} fill="#FFFFFF" style={{ opacity: 0.06 }} />
              <g ref={(el) => { els.current[k].folds = el; }} filter="url(#wc-blur)" style={{ opacity: 0.55 }} fill="none" strokeLinecap="round">
                {FOLDS.map((_, j) => (
                  <path key={`s${j}`} ref={(el) => { els.current[k].shadow[j] = el; }} d={initial[k].folds[j]} stroke="#B98697" strokeOpacity={0.22} strokeWidth={9} />
                ))}
                {FOLDS.map((_, j) => (
                  <path key={`h${j}`} ref={(el) => { els.current[k].hi[j] = el; }} d={initial[k].foldsHi[j]} stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={4} />
                ))}
              </g>
              <path ref={(el) => { els.current[k].hem = el; }} d={initial[k].hem} fill="none" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={3} strokeLinecap="round" />
            </g>
          ))}

          {/* Top ruffled valance (fixed across the window arch) */}
          <path
            d="M 12,0 Q 60,18 110,8 Q 150,18 200,8 Q 245,18 288,0 L 288,6 Q 245,24 200,14 Q 150,24 110,14 Q 60,24 12,6 Z"
            fill="#FFFFFF"
            opacity="0.95"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
          />
        </svg>
      </div>
    </div>
  );
}