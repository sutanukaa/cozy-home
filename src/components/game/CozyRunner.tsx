'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTime } from '@/components/providers/TimeProvider';

/* ─────────────────────────── constants ─────────────────────────── */
const GRAVITY = 0.55;
const JUMP_FORCE = -10.5;
const INITIAL_SPEED = 3.5;
const MAX_SPEED = 8;
const SPEED_INCREMENT = 0.002;

// Character dimensions in world units (natural pixel proportions)
const CHAR_W = 44;
const CHAR_H = 52;

// Obstacles spacing in world units
const OB_MIN_GAP = 220;
const OB_MAX_GAP = 360;

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

/* ──────────────────── cityscape data ───────────────────────────── */
interface Building {
  x: number;
  w: number;
  h: number;
  color: string;
  roofColor: string;
  hasWindows: boolean;
  windowColor: string;
  windowLitColor: string;
  litSeed: number;
}

const PX = 4;
const FAR_TILE_W = 900;
const NEAR_TILE_W = 700;

// DAY Far Buildings (Soft Pastel)
const FAR_BUILDINGS_DAY: Building[] = [
  { x: 0,   w: 50, h: 110, color: '#F0D4DC', roofColor: '#E8B8C8', hasWindows: true, windowColor: '#E8C0CC', windowLitColor: '#FFE29A', litSeed: 3 },
  { x: 60,  w: 38, h: 140, color: '#E8C5CE', roofColor: '#D4A0B0', hasWindows: true, windowColor: '#D9B0BB', windowLitColor: '#FFD88A', litSeed: 7 },
  { x: 108, w: 55, h: 95,  color: '#F5E0E0', roofColor: '#EAC8D0', hasWindows: true, windowColor: '#EACCD5', windowLitColor: '#FFE8A0', litSeed: 11 },
  { x: 172, w: 32, h: 125, color: '#EACCD8', roofColor: '#DDB0C0', hasWindows: true, windowColor: '#E0B8C5', windowLitColor: '#FFE29A', litSeed: 5 },
  { x: 215, w: 60, h: 80,  color: '#F2D8DC', roofColor: '#E5C0CC', hasWindows: true, windowColor: '#E8C8D0', windowLitColor: '#FFDFA0', litSeed: 2 },
  { x: 285, w: 40, h: 150, color: '#E5BCC8', roofColor: '#D8A5B5', hasWindows: true, windowColor: '#DAB0BC', windowLitColor: '#FFE29A', litSeed: 9 },
  { x: 335, w: 48, h: 100, color: '#F0D0D8', roofColor: '#E4B8C5', hasWindows: true, windowColor: '#E6C0CA', windowLitColor: '#FFD898', litSeed: 4 },
  { x: 395, w: 35, h: 130, color: '#E8C0D0', roofColor: '#DDA8B8', hasWindows: true, windowColor: '#DFB5C0', windowLitColor: '#FFE4A5', litSeed: 6 },
  { x: 442, w: 56, h: 88,  color: '#F3DDE0', roofColor: '#E8C5D0', hasWindows: true, windowColor: '#EBD0D5', windowLitColor: '#FFE8B0', litSeed: 8 },
  { x: 510, w: 42, h: 118, color: '#EACAD5', roofColor: '#DDAFBE', hasWindows: true, windowColor: '#E0B8C2', windowLitColor: '#FFE09A', litSeed: 1 },
  { x: 565, w: 50, h: 72,  color: '#F0D5DB', roofColor: '#E5BFC9', hasWindows: true, windowColor: '#E8C5CE', windowLitColor: '#FFDC95', litSeed: 10 },
  { x: 628, w: 38, h: 135, color: '#E6C2CC', roofColor: '#D9A8B8', hasWindows: true, windowColor: '#DCB2BE', windowLitColor: '#FFE29A', litSeed: 13 },
  { x: 678, w: 52, h: 90,  color: '#F2D9DD', roofColor: '#E8C2CC', hasWindows: true, windowColor: '#EACAD2', windowLitColor: '#FFE5A8', litSeed: 12 },
  { x: 742, w: 44, h: 108, color: '#E9C8D2', roofColor: '#DDB0C0', hasWindows: true, windowColor: '#E0BAC4', windowLitColor: '#FFE09A', litSeed: 14 },
  { x: 800, w: 55, h: 78,  color: '#F0D2D8', roofColor: '#E5BBC6', hasWindows: true, windowColor: '#E7C2CB', windowLitColor: '#FFDDA0', litSeed: 15 },
];

// DAY Near Buildings
const NEAR_BUILDINGS_DAY: Building[] = [
  { x: 0,   w: 44, h: 55, color: '#E0B0BE', roofColor: '#D498A8', hasWindows: true, windowColor: '#D4A0AD', windowLitColor: '#FFE8B0', litSeed: 17 },
  { x: 55,  w: 60, h: 40, color: '#D8A5B5', roofColor: '#CC90A2', hasWindows: false, windowColor: '', windowLitColor: '', litSeed: 0 },
  { x: 128, w: 36, h: 65, color: '#E5B8C5', roofColor: '#D8A0B2', hasWindows: true, windowColor: '#DAA8B5', windowLitColor: '#FFE4A8', litSeed: 19 },
  { x: 178, w: 52, h: 38, color: '#DDA8B8', roofColor: '#D095A5', hasWindows: true, windowColor: '#D5A0AD', windowLitColor: '#FFE09A', litSeed: 22 },
  { x: 245, w: 40, h: 58, color: '#E2B2C0', roofColor: '#D69AAC', hasWindows: true, windowColor: '#D8A5B2', windowLitColor: '#FFE5B0', litSeed: 20 },
  { x: 300, w: 55, h: 32, color: '#D5A0B0', roofColor: '#C88E9E', hasWindows: false, windowColor: '', windowLitColor: '', litSeed: 0 },
  { x: 368, w: 42, h: 50, color: '#E0AEC0', roofColor: '#D498AA', hasWindows: true, windowColor: '#D6A2B0', windowLitColor: '#FFE29A', litSeed: 23 },
  { x: 425, w: 58, h: 42, color: '#DBA5B5', roofColor: '#CF92A4', hasWindows: true, windowColor: '#D39AAA', windowLitColor: '#FFDFA0', litSeed: 21 },
  { x: 498, w: 38, h: 60, color: '#E3B5C2', roofColor: '#D69DB0', hasWindows: true, windowColor: '#D8A5B5', windowLitColor: '#FFE4A5', litSeed: 18 },
  { x: 550, w: 50, h: 35, color: '#D8A2B2', roofColor: '#CC8EA0', hasWindows: false, windowColor: '', windowLitColor: '', litSeed: 0 },
  { x: 615, w: 45, h: 48, color: '#E1B0BC', roofColor: '#D598AA', hasWindows: true, windowColor: '#D7A0B0', windowLitColor: '#FFE2A0', litSeed: 24 },
];

// NIGHT Far Buildings (Vibrant Cyber-Synthwave City)
const FAR_BUILDINGS_NIGHT: Building[] = [
  { x: 0,   w: 50, h: 110, color: '#1B0D33', roofColor: '#FF2A85', hasWindows: true, windowColor: '#281448', windowLitColor: '#FFE066', litSeed: 3 },
  { x: 60,  w: 38, h: 140, color: '#140826', roofColor: '#00F5D4', hasWindows: true, windowColor: '#220E3D', windowLitColor: '#00F5D4', litSeed: 7 },
  { x: 108, w: 55, h: 95,  color: '#20103B', roofColor: '#FF70A6', hasWindows: true, windowColor: '#2C164F', windowLitColor: '#FFD166', litSeed: 11 },
  { x: 172, w: 32, h: 125, color: '#180A2E', roofColor: '#B5179E', hasWindows: true, windowColor: '#261245', windowLitColor: '#FF5C8D', litSeed: 5 },
  { x: 215, w: 60, h: 80,  color: '#22113F', roofColor: '#FFBE0B', hasWindows: true, windowColor: '#301856', windowLitColor: '#FFE29A', litSeed: 2 },
  { x: 285, w: 40, h: 150, color: '#140826', roofColor: '#00F5D4', hasWindows: true, windowColor: '#220E3D', windowLitColor: '#4CC9F0', litSeed: 9 },
  { x: 335, w: 48, h: 100, color: '#1D0E38', roofColor: '#FF3377', hasWindows: true, windowColor: '#2B154D', windowLitColor: '#FFD898', litSeed: 4 },
  { x: 395, w: 35, h: 130, color: '#170B30', roofColor: '#7209B7', hasWindows: true, windowColor: '#251244', windowLitColor: '#FF6584', litSeed: 6 },
  { x: 442, w: 56, h: 88,  color: '#21103D', roofColor: '#4CC9F0', hasWindows: true, windowColor: '#2E1753', windowLitColor: '#FFE8B0', litSeed: 8 },
  { x: 510, w: 42, h: 118, color: '#190C32', roofColor: '#FF2A85', hasWindows: true, windowColor: '#281449', windowLitColor: '#FFD166', litSeed: 1 },
  { x: 565, w: 50, h: 72,  color: '#231242', roofColor: '#FFB703', hasWindows: true, windowColor: '#321958', windowLitColor: '#00F5D4', litSeed: 10 },
  { x: 628, w: 38, h: 135, color: '#15092B', roofColor: '#FF70A6', hasWindows: true, windowColor: '#230F40', windowLitColor: '#FFE29A', litSeed: 13 },
  { x: 678, w: 52, h: 90,  color: '#1F0F3A', roofColor: '#00F5D4', hasWindows: true, windowColor: '#2C1650', windowLitColor: '#FF85A1', litSeed: 12 },
  { x: 742, w: 44, h: 108, color: '#180B31', roofColor: '#B5179E', hasWindows: true, windowColor: '#271347', windowLitColor: '#FFE066', litSeed: 14 },
  { x: 800, w: 55, h: 78,  color: '#22113F', roofColor: '#FFBE0B', hasWindows: true, windowColor: '#301855', windowLitColor: '#FF9E79', litSeed: 15 },
];

// NIGHT Near Buildings (Vibrant Neon Glow)
const NEAR_BUILDINGS_NIGHT: Building[] = [
  { x: 0,   w: 44, h: 55, color: '#271344', roofColor: '#FF2A85', hasWindows: true, windowColor: '#361A5C', windowLitColor: '#FFE8B0', litSeed: 17 },
  { x: 55,  w: 60, h: 40, color: '#200F38', roofColor: '#7209B7', hasWindows: false, windowColor: '', windowLitColor: '', litSeed: 0 },
  { x: 128, w: 36, h: 65, color: '#2B164A', roofColor: '#00F5D4', hasWindows: true, windowColor: '#3C1E66', windowLitColor: '#00F5D4', litSeed: 19 },
  { x: 178, w: 52, h: 38, color: '#22113C', roofColor: '#FF70A6', hasWindows: true, windowColor: '#321855', windowLitColor: '#FFE09A', litSeed: 22 },
  { x: 245, w: 40, h: 58, color: '#281446', roofColor: '#FFB703', hasWindows: true, windowColor: '#381C60', windowLitColor: '#FF5C8D', litSeed: 20 },
  { x: 300, w: 55, h: 32, color: '#1E0E35', roofColor: '#B5179E', hasWindows: false, windowColor: '', windowLitColor: '', litSeed: 0 },
  { x: 368, w: 42, h: 50, color: '#261342', roofColor: '#00F5D4', hasWindows: true, windowColor: '#351A5A', windowLitColor: '#FFE29A', litSeed: 23 },
  { x: 425, w: 58, h: 42, color: '#21103B', roofColor: '#FF3377', hasWindows: true, windowColor: '#301753', windowLitColor: '#FFD166', litSeed: 21 },
  { x: 498, w: 38, h: 60, color: '#2A1548', roofColor: '#4CC9F0', hasWindows: true, windowColor: '#3A1D64', windowLitColor: '#FF85A1', litSeed: 18 },
  { x: 550, w: 50, h: 35, color: '#1F0F37', roofColor: '#7209B7', hasWindows: false, windowColor: '', windowLitColor: '', litSeed: 0 },
  { x: 615, w: 45, h: 48, color: '#271444', roofColor: '#FFBE0B', hasWindows: true, windowColor: '#361B5C', windowLitColor: '#FFE2A0', litSeed: 24 },
];

// Proportional Star Field Data for Night Sky
const STAR_SEEDS = [
  { xPct: 0.04, yPct: 0.12, s: 2, c: '#FFE29A', p: 0.2 },
  { xPct: 0.10, yPct: 0.28, s: 1, c: '#FFF6EC', p: 1.1 },
  { xPct: 0.16, yPct: 0.10, s: 2, c: '#A8F0FF', p: 2.3 },
  { xPct: 0.21, yPct: 0.36, s: 1, c: '#FFF6EC', p: 0.7 },
  { xPct: 0.27, yPct: 0.18, s: 3, c: '#FFE29A', p: 1.9 },
  { xPct: 0.34, yPct: 0.42, s: 1, c: '#FFB8D2', p: 3.1 },
  { xPct: 0.40, yPct: 0.11, s: 2, c: '#FFF6EC', p: 2.7 },
  { xPct: 0.46, yPct: 0.32, s: 1, c: '#A8F0FF', p: 0.5 },
  { xPct: 0.53, yPct: 0.16, s: 3, c: '#FFE29A', p: 1.4 },
  { xPct: 0.58, yPct: 0.39, s: 2, c: '#FFF6EC', p: 2.9 },
  { xPct: 0.64, yPct: 0.10, s: 1, c: '#FFB8D2', p: 0.8 },
  { xPct: 0.70, yPct: 0.27, s: 2, c: '#A8F0FF', p: 1.6 },
  { xPct: 0.76, yPct: 0.44, s: 1, c: '#FFF6EC', p: 2.2 },
  { xPct: 0.83, yPct: 0.14, s: 3, c: '#FFE29A', p: 3.4 },
  { xPct: 0.88, yPct: 0.31, s: 1, c: '#FFF6EC', p: 0.9 },
  { xPct: 0.95, yPct: 0.20, s: 2, c: '#A8F0FF', p: 2.1 },
  { xPct: 0.12, yPct: 0.48, s: 1, c: '#FFE29A', p: 1.5 },
  { xPct: 0.23, yPct: 0.47, s: 1, c: '#FFF6EC', p: 2.8 },
  { xPct: 0.30, yPct: 0.08, s: 2, c: '#FFF6EC', p: 0.4 },
  { xPct: 0.44, yPct: 0.23, s: 1, c: '#FFE29A', p: 3.0 },
  { xPct: 0.61, yPct: 0.46, s: 1, c: '#FFF6EC', p: 1.2 },
  { xPct: 0.79, yPct: 0.21, s: 2, c: '#FFF6EC', p: 2.5 },
  { xPct: 0.92, yPct: 0.42, s: 1, c: '#FFB8D2', p: 0.3 },
];

/* ──────────────────── draw helpers ─────────────────────────────── */
function drawMoon(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Soft atmospheric radial aura
  const g = ctx.createRadialGradient(x, y, 6, x, y, 26);
  g.addColorStop(0, 'rgba(255, 235, 170, 0.45)');
  g.addColorStop(0.5, 'rgba(255, 226, 154, 0.15)');
  g.addColorStop(1, 'rgba(255, 226, 154, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.fill();

  // Pixel crescent moon
  const px = 2;
  const moonMap = [
    '    ####',
    '  #######',
    ' ####### ',
    '#####    ',
    '####     ',
    '####     ',
    '####     ',
    '####     ',
    '#####    ',
    ' ####### ',
    '  #######',
    '    ####',
  ];
  ctx.fillStyle = '#FFEAA7';
  for (let r = 0; r < moonMap.length; r++) {
    for (let c = 0; c < moonMap[r].length; c++) {
      if (moonMap[r][c] === '#') {
        ctx.fillRect(x - 12 + c * px, y - 12 + r * px, px, px);
      }
    }
  }
}

function drawCityLayer(
  ctx: CanvasRenderingContext2D,
  buildings: Building[],
  tileW: number,
  offset: number,
  groundY: number,
  alpha: number,
  isNight: boolean,
  tick: number,
  worldW: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const scrollOff = offset % tileW;

  for (let tileX = -scrollOff - tileW; tileX < worldW + tileW; tileX += tileW) {
    for (const b of buildings) {
      const bx = tileX + b.x;
      if (bx + b.w < -20 || bx > worldW + 20) continue;

      const by = groundY - b.h;

      // Building Body
      ctx.fillStyle = b.color;
      for (let r = 0; r < b.h; r += PX) {
        for (let c = 0; c < b.w; c += PX) {
          ctx.fillRect(bx + c, by + r, PX - 1, PX - 1);
        }
      }

      // Roof trim & neon accent
      ctx.fillStyle = b.roofColor;
      for (let c = 0; c < b.w; c += PX) {
        ctx.fillRect(bx + c, by, PX - 1, PX - 1);
      }

      // Neon roof overhang line
      ctx.fillRect(bx - 2, by - 2, b.w + 4, isNight ? 3 : 2);

      // Night aviation antenna on tall buildings
      if (isNight && b.h >= 110) {
        const ax = bx + Math.floor(b.w / 2);
        ctx.fillStyle = '#654477';
        ctx.fillRect(ax, by - 12, 2, 12);
        const beaconOn = (Math.floor(tick / 24) + b.litSeed) % 2 === 0;
        if (beaconOn) {
          ctx.fillStyle = '#FF2E63';
          ctx.fillRect(ax - 1, by - 14, 4, 3);
          ctx.fillStyle = 'rgba(255, 46, 99, 0.45)';
          ctx.fillRect(ax - 3, by - 16, 8, 7);
        }
      }

      // Windows
      if (b.hasWindows && b.h > 30) {
        const winW = 6;
        const winH = 7;
        const gapX = 10;
        const gapY = 12;
        const startX = bx + 5;
        const startY = by + 8;
        const cols = Math.floor((b.w - 10) / gapX);
        const rows = Math.floor((b.h - 16) / gapY);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const wx = startX + c * gapX;
            const wy = startY + r * gapY;
            const hash = (b.litSeed * 17 + r * 7 + c * 13) % 100;
            const isLit = isNight ? hash < 65 : hash < 35;

            if (isLit) {
              const pulse = isNight && (hash % 9 === 0) ? Math.sin(tick * 0.08 + hash) * 0.2 + 0.8 : 1;
              ctx.globalAlpha = alpha * pulse;
              ctx.fillStyle = b.windowLitColor || (isNight ? '#FFE066' : '#FFE29A');
              ctx.fillRect(wx, wy, winW, winH);

              if (isNight) {
                ctx.fillStyle = 'rgba(255, 230, 100, 0.18)';
                ctx.fillRect(wx - 1, wy - 1, winW + 2, winH + 2);
              }
            } else {
              ctx.globalAlpha = alpha * 0.75;
              ctx.fillStyle = b.windowColor || (isNight ? '#1F1038' : '#D0A0B0');
              ctx.fillRect(wx, wy, winW, winH);
            }
          }
        }
      }
    }
  }
  ctx.restore();
}

function drawCactus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  kind: ObstacleKind,
  isNight: boolean,
) {
  const p = 3;
  ctx.fillStyle = isNight ? '#00F5D4' : '#5E8B7E';

  if (kind === 'cactus') {
    ctx.fillRect(x + 2 * p, y, 2 * p, 9 * p);
    ctx.fillRect(x, y + 2 * p, p, 4 * p);
    ctx.fillRect(x + p, y + 5 * p, p, p);
    ctx.fillRect(x + 4 * p, y + 3 * p, p, 3 * p);
    ctx.fillRect(x + 3 * p, y + 5 * p, p, p);
    if (isNight) {
      ctx.fillStyle = 'rgba(0, 245, 212, 0.25)';
      ctx.fillRect(x - 2, y - 2, 6 * p + 4, 9 * p + 4);
    }
  } else if (kind === 'cactus-tall') {
    ctx.fillRect(x + 2 * p, y, 2 * p, 14 * p);
    ctx.fillRect(x, y + 3 * p, p, 5 * p);
    ctx.fillRect(x + p, y + 7 * p, p, p);
    ctx.fillRect(x + 4 * p, y + 5 * p, p, 4 * p);
    ctx.fillRect(x + 3 * p, y + 8 * p, p, p);
    if (isNight) {
      ctx.fillStyle = 'rgba(0, 245, 212, 0.25)';
      ctx.fillRect(x - 2, y - 2, 6 * p + 4, 14 * p + 4);
    }
  } else {
    // cactus-double
    ctx.fillRect(x + 2 * p, y + 2 * p, 2 * p, 7 * p);
    ctx.fillRect(x + 6 * p, y, 2 * p, 9 * p);
    ctx.fillRect(x, y + 4 * p, p, 3 * p);
    ctx.fillRect(x + p, y + 6 * p, p, p);
    ctx.fillRect(x + 8 * p, y + 3 * p, p, 3 * p);
    ctx.fillRect(x + 7 * p, y + 5 * p, p, p);
    if (isNight) {
      ctx.fillStyle = 'rgba(0, 245, 212, 0.25)';
      ctx.fillRect(x - 2, y - 2, 10 * p + 4, 9 * p + 4);
    }
  }
}

/* ──────────────────── audio synth ───────────────────────────────── */
function lazyAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return Ctx ? new Ctx() : null;
}

function sfxJump(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.14);
}

function sfxGameOver(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.exponentialRampToValueAtTime(65, now + 0.35);
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.38);
}

function sfxMilestone(ctx: AudioContext) {
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = now + i * 0.05;
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);
  });
}

/* ──────────────────── component ─────────────────────────────────── */
export default function CozyRunner() {
  const { theme } = useTime();
  const isNightRef = useRef(theme === 'night');
  useEffect(() => {
    isNightRef.current = theme === 'night';
  }, [theme]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [phase, setPhase] = useState<'idle' | 'running' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);
  const [spdVal, setSpdVal] = useState(INITIAL_SPEED);

  const phaseR = useRef<'idle' | 'running' | 'over'>('idle');
  const scoreR = useRef(0);
  const hiR = useRef(0);

  // Dynamic world coordinate tracking for uniform 1:1 scale
  const worldWRef = useRef(800);
  const groundYRef = useRef(250);
  const charXRef = useRef(70);

  const charY = useRef(250 - CHAR_H);
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
    const mk = (src: string) => {
      const i = new Image();
      i.src = src;
      return i;
    };
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

  /* spawn obstacle */
  const spawn = useCallback((currentWorldW: number) => {
    const kinds: ObstacleKind[] = ['cactus', 'cactus-tall', 'cactus-double'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const def = OB_DEFS[kind];
    const last = obs.current[obs.current.length - 1];
    const gap = OB_MIN_GAP + Math.random() * (OB_MAX_GAP - OB_MIN_GAP);
    const sx = last ? Math.max(currentWorldW + 40, last.x + last.w + gap) : currentWorldW + 60;
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
    const groundY = groundYRef.current;
    charY.current = groundY - CHAR_H;
    vy.current = 0;
    grounded.current = true;
    spd.current = INITIAL_SPEED;
    setSpdVal(INITIAL_SPEED);
    obs.current = [];
    tick.current = 0;
    scoreR.current = 0;
    dust.current = [];
    gndOff.current = 0;
    setScore(0);
    phaseR.current = 'running';
    setPhase('running');
    const w = worldWRef.current;
    spawn(w);
    spawn(w);
    audio();
  }, [spawn, audio]);

  /* keyboard controls */
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

  /* touch controls */
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

      // 1. UNIFORM SCALE: 1 unit in X === 1 unit in Y. Absolutely zero distortion or deformation!
      // On narrow screens (cw < 600), choose targetW so distance and jump reaction time are natural.
      // On desktop (cw >= 600), targetW is 800.
      const targetW = cw < 600 ? Math.max(380, cw / 0.85) : 800;
      const scale = cw / targetW;
      const worldW = targetW;
      const worldH = ch / scale;
      const groundY = worldH - 52;
      const charX = Math.min(70, Math.max(40, worldW * 0.12));

      worldWRef.current = worldW;
      groundYRef.current = groundY;
      charXRef.current = charX;

      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.scale(scale, scale);

      // Check current night mode state
      const night = isNightRef.current || (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'night');

      /* ── sky ── */
      if (night) {
        // Vibrant deep indigo / twilight gradient
        const sky = ctx.createLinearGradient(0, 0, 0, groundY);
        sky.addColorStop(0, '#0C061E');
        sky.addColorStop(0.55, '#1B0C33');
        sky.addColorStop(1, '#33134C');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, worldW, groundY);

        // Twinkling Pixel Stars
        for (const star of STAR_SEEDS) {
          const starX = star.xPct * worldW;
          const starY = star.yPct * (groundY * 0.75);
          const tw = Math.sin(tick.current * 0.05 + star.p) * 0.35 + 0.65;
          ctx.fillStyle = star.c;
          ctx.globalAlpha = tw;
          if (star.s === 3) {
            ctx.fillRect(starX, starY - 1, 2, 4);
            ctx.fillRect(starX - 1, starY, 4, 2);
          } else {
            ctx.fillRect(starX, starY, star.s, star.s);
          }
        }
        ctx.globalAlpha = 1;

        // Pixel Crescent Moon
        drawMoon(ctx, worldW - 85, Math.min(48, groundY * 0.18));
      } else {
        // Soft daytime blush pastel
        const sky = ctx.createLinearGradient(0, 0, 0, groundY);
        sky.addColorStop(0, '#FFF6EC');
        sky.addColorStop(1, '#FFDFE7');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, worldW, groundY);
      }

      /* ── parallax cityscape ── */
      if (night) {
        // Vibrant neon city layers
        drawCityLayer(ctx, FAR_BUILDINGS_NIGHT, FAR_TILE_W, gndOff.current * 0.12, groundY, 0.75, true, tick.current, worldW);
        drawCityLayer(ctx, NEAR_BUILDINGS_NIGHT, NEAR_TILE_W, gndOff.current * 0.30, groundY, 0.90, true, tick.current, worldW);
      } else {
        // Daytime pastel city layers
        drawCityLayer(ctx, FAR_BUILDINGS_DAY, FAR_TILE_W, gndOff.current * 0.12, groundY, 0.40, false, tick.current, worldW);
        drawCityLayer(ctx, NEAR_BUILDINGS_DAY, NEAR_TILE_W, gndOff.current * 0.30, groundY, 0.60, false, tick.current, worldW);
      }

      /* ── ground / road ── */
      if (night) {
        // Deep midnight asphalt
        ctx.fillStyle = '#160824';
        ctx.fillRect(0, groundY, worldW, worldH - groundY);

        // Glowing neon pink kerb line
        ctx.fillStyle = '#FF2A85';
        ctx.fillRect(0, groundY, worldW, 2);

        // Fluorescent dashed road dividers
        ctx.fillStyle = '#FFE066';
        const dg = 40;
        const doff = (gndOff.current * 0.5) % dg;
        for (let x = -doff; x < worldW + dg; x += dg) {
          ctx.fillRect(x, groundY + 10, 18, 2);
          ctx.fillRect(x + dg * 0.5, groundY + 22, 10, 2);
        }
      } else {
        // Daytime pastel road
        ctx.fillStyle = '#F2C8D4';
        ctx.fillRect(0, groundY, worldW, worldH - groundY);

        ctx.fillStyle = '#D64676';
        ctx.fillRect(0, groundY, worldW, 2);

        ctx.fillStyle = '#FFF6EC';
        const dg = 40;
        const doff = (gndOff.current * 0.5) % dg;
        for (let x = -doff; x < worldW + dg; x += dg) {
          ctx.fillRect(x, groundY + 10, 18, 2);
          ctx.fillRect(x + dg * 0.5, groundY + 22, 10, 2);
        }
      }

      /* ── daytime drifting clouds ── */
      if (!night) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        const co = (gndOff.current * 0.15) % (worldW + 200);
        ctx.beginPath();
        ctx.arc(200 - co + worldW, 50, 20, 0, Math.PI * 2);
        ctx.arc(224 - co + worldW, 44, 26, 0, Math.PI * 2);
        ctx.arc(250 - co + worldW, 50, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── gameplay logic ── */
      const running = phaseR.current === 'running';

      if (running) {
        tick.current += 1;
        gndOff.current += spd.current;
        if (spd.current < MAX_SPEED) {
          spd.current += SPEED_INCREMENT;
          if (tick.current % 30 === 0) {
            setSpdVal(spd.current);
          }
        }

        /* physics */
        charY.current += vy.current;
        vy.current += GRAVITY;

        // Ground collision
        if (charY.current >= groundY - CHAR_H) {
          charY.current = groundY - CHAR_H;
          if (!grounded.current) {
            dust.current.push(
              { x: charX + CHAR_W * 0.5, y: groundY - 2, age: 0 },
              { x: charX + CHAR_W * 0.3, y: groundY - 4, age: 0 },
            );
          }
          vy.current = 0;
          grounded.current = true;
        }

        /* running dust */
        if (grounded.current && tick.current % 10 === 0) {
          dust.current.push({
            x: charX + CHAR_W * 0.3 + Math.random() * 6,
            y: groundY - 1 - Math.random() * 3,
            age: 0,
          });
        }

        /* obstacles */
        for (const o of obs.current) {
          o.x -= spd.current;
          if (!o.scored && o.x + o.w < charX) {
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
        if (!last || last.x < worldW - 120) spawn(worldW);

        /* collision box */
        const cb = { x: charX + 8, y: charY.current + 6, w: CHAR_W - 16, h: CHAR_H - 8 };
        for (const o of obs.current) {
          const ob = { x: o.x + 4, y: groundY - o.h + 2, w: o.w - 8, h: o.h - 4 };
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
      for (const o of obs.current) {
        drawCactus(ctx, o.x, groundY - o.h, o.kind, night);
      }

      /* draw dust particles */
      dust.current = dust.current.filter((d) => d.age < 14);
      for (const d of dust.current) {
        const alpha = Math.max(0, 0.45 - d.age * 0.04);
        ctx.fillStyle = night ? `rgba(255,180,230,${alpha})` : `rgba(210,180,160,${alpha})`;
        const sz = 3 + d.age * 0.7;
        ctx.beginPath();
        ctx.arc(d.x, d.y, sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x - 4, d.y - 2, sz * 0.6, 0, Math.PI * 2);
        ctx.fill();
        if (running) {
          d.age += 1;
          d.x -= spd.current * 0.25;
        }
      }

      /* draw character with natural aspect ratio */
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const inAir = !grounded.current;
      let spr: HTMLImageElement | null;
      if (inAir) {
        spr = jump.current;
      } else {
        spr = Math.floor(tick.current / 14) % 2 === 0 ? run1.current : run2.current;
      }

      if (spr && spr.complete && spr.naturalWidth > 0) {
        const srcAspect = spr.naturalWidth / spr.naturalHeight;
        let dw = CHAR_W;
        let dh = CHAR_W / srcAspect;
        if (dh > CHAR_H + 8) {
          dh = CHAR_H + 8;
          dw = dh * srcAspect;
        }
        const dx = charX + (CHAR_W - dw) / 2;
        const dy = charY.current + (CHAR_H - dh);
        ctx.drawImage(spr, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = '#E86A92';
        ctx.fillRect(charX, charY.current, CHAR_W, CHAR_H);
      }

      ctx.imageSmoothingEnabled = false;

      /* overlays */
      if (phaseR.current === 'idle') {
        ctx.fillStyle = night ? 'rgba(10, 5, 20, 0.65)' : 'rgba(30,18,38,0.45)';
        ctx.fillRect(0, 0, worldW, worldH);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFF6EC';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('COZY RUNNER', worldW / 2, worldH * 0.38);
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = '#FFE29A';
        ctx.fillText('Press SPACE, click, or tap to start', worldW / 2, worldH * 0.38 + 32);
        ctx.font = '11px monospace';
        ctx.fillStyle = night ? '#FF9EBB' : '#F9C6D3';
        ctx.fillText('Jump over the cacti!', worldW / 2, worldH * 0.38 + 56);
      }

      if (phaseR.current === 'over') {
        ctx.fillStyle = night ? 'rgba(10, 5, 20, 0.70)' : 'rgba(30,18,38,0.55)';
        ctx.fillRect(0, 0, worldW, worldH);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FF5C8D';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('GAME OVER', worldW / 2, worldH * 0.35);
        ctx.fillStyle = '#FFF6EC';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`Score: ${scoreR.current}`, worldW / 2, worldH * 0.35 + 32);
        if (scoreR.current >= hiR.current && hiR.current > 0) {
          ctx.fillStyle = '#FFE29A';
          ctx.font = 'bold 12px monospace';
          ctx.fillText('NEW HIGH SCORE!', worldW / 2, worldH * 0.35 + 56);
        }
        ctx.fillStyle = '#FFE29A';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('Press SPACE, click, or tap to retry', worldW / 2, worldH * 0.35 + 80);
      }

      ctx.restore();
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [audio, spawn]);

  return (
    <div ref={wrapRef} className="relative h-full w-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-pointer"
        tabIndex={0}
        onClick={() => {
          if (phaseR.current === 'idle' || phaseR.current === 'over') start();
          else if (phaseR.current === 'running') doJump();
        }}
        aria-label="Cozy Runner game. Press Space or tap to jump."
      />

      {/* Floating Top HUD Bar (Score & High Score & Speed) */}
      <div className="pointer-events-none absolute top-2 inset-x-3 z-30 flex items-center justify-between font-mono font-bold select-none">
        {/* Score pill */}
        <div className="flex items-center gap-2 rounded-full border border-pink-200/60 bg-paper/95 px-2.5 py-1 text-xs text-ink shadow-xs backdrop-blur-xs dark:border-white/15 dark:bg-black/60 dark:text-pink-100">
          <span className="text-[10px] text-accent dark:text-pink-300">SCORE</span>
          <span>{String(score).padStart(4, '0')}</span>
          {hi > 0 && (
            <span className="text-[10px] text-ink-soft dark:text-butter/80">
              HI {String(hi).padStart(4, '0')}
            </span>
          )}
        </div>

        {/* Speed pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-pink-200/60 bg-paper/95 px-2.5 py-1 text-[10px] text-ink shadow-xs backdrop-blur-xs dark:border-white/15 dark:bg-black/60 dark:text-pink-100">
          <span className="text-accent dark:text-pink-300">SPD</span>
          <span>{spdVal.toFixed(1)}</span>
        </div>
      </div>

      {/* Floating controls hint */}
      <div className="pointer-events-none absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 rounded-full border border-cocoa/10 bg-white/85 px-3 py-1 font-mono text-[9px] sm:text-[10px] text-cocoa/80 shadow-xs backdrop-blur-xs whitespace-nowrap dark:border-white/10 dark:bg-black/70 dark:text-white/80">
        <span className="hidden sm:inline-flex items-center gap-1">
          <span className="rounded border border-cocoa/15 bg-cocoa/5 px-1 py-0.5 dark:border-white/15 dark:bg-white/10">
            SPACE
          </span>
          <span>/</span>
          <span className="rounded border border-cocoa/15 bg-cocoa/5 px-1 py-0.5 dark:border-white/15 dark:bg-white/10">
            UP
          </span>
          <span>to jump</span>
          <span className="text-cocoa/25 dark:text-white/20 mx-1">|</span>
        </span>
        <span>Tap or click to jump</span>
      </div>
    </div>
  );
}
