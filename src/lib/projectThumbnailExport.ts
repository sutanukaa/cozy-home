import type { Project } from '@/data/projects';
import { site } from '@/data/site';
import { downloadBlob } from '@/lib/projectExport';

const CANVAS_W = 1600;
const CANVAS_H = 900;

const PALETTE = {
  bgStart: '#FCE7EC',
  bgMid: '#FFF6EC',
  bgEnd: '#F8D7E1',
  cardBg: '#FFFDF9',
  cardBorder: '#F3BDCC',
  cardInnerBorder: '#FFF0F4',
  divider: '#F3D5DF',
  ink: '#5B3A47',
  inkSoft: '#805867',
  accent: '#D64676',
  berry: '#B83A62',
  rose: '#E86A92',
  butter: '#FFE29A',
  butterBorder: '#E5BE66',
  sage: '#A9C7A0',
  pillBg: '#FFF2F6',
  pillBorder: '#F3BDCC',
  amberBg: '#FEF3C7',
  amberBorder: '#F59E0B',
  amberText: '#92400E',
  browserChrome: '#FFF4F7',
  browserBorder: '#EFD0DC',
  blankFrameBg: '#FFFFFF',
  blankFrameBorder: '#F0D8E1',
} as const;

const DISPLAY_FONT = "'Fredoka', 'ui-rounded', 'system-ui', sans-serif";
const MONO_FONT = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawRoundedBox(
  ctx: CanvasRenderingContext2D,
  opts: {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
    fill?: string;
    stroke?: string;
    lineWidth?: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetY?: number;
  }
) {
  ctx.save();
  if (opts.shadowColor) {
    ctx.shadowColor = opts.shadowColor;
    ctx.shadowBlur = opts.shadowBlur ?? 20;
    ctx.shadowOffsetY = opts.shadowOffsetY ?? 8;
  }
  roundedRectPath(ctx, opts.x, opts.y, opts.w, opts.h, opts.r);
  if (opts.fill) {
    ctx.fillStyle = opts.fill;
    ctx.fill();
  }
  ctx.restore();

  if (opts.stroke) {
    ctx.save();
    roundedRectPath(ctx, opts.x, opts.y, opts.w, opts.h, opts.r);
    ctx.strokeStyle = opts.stroke;
    ctx.lineWidth = opts.lineWidth ?? 2;
    ctx.stroke();
    ctx.restore();
  }
}

async function ensureFontsLoaded() {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.allSettled([
      document.fonts.load(`400 20px ${DISPLAY_FONT}`),
      document.fonts.load(`500 22px ${DISPLAY_FONT}`),
      document.fonts.load(`600 26px ${DISPLAY_FONT}`),
      document.fonts.load(`700 42px ${DISPLAY_FONT}`),
    ]);
    await document.fonts.ready;
  } catch {
    // Fallback cleanly to system rounded fonts
  }
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) {
        current = words.slice(i).join(' ');
        break;
      }
    }
  }
  if (current) lines.push(current);

  if (lines.length > maxLines) lines.length = maxLines;
  const lastIdx = lines.length - 1;
  if (lastIdx >= 0 && ctx.measureText(lines[lastIdx]).width > maxWidth) {
    let trimmed = lines[lastIdx];
    while (trimmed.includes(' ') && ctx.measureText(`${trimmed}...`).width > maxWidth) {
      trimmed = trimmed.slice(0, trimmed.lastIndexOf(' ')).trimEnd();
    }
    while (trimmed.length > 3 && ctx.measureText(`${trimmed}...`).width > maxWidth) {
      trimmed = trimmed.slice(0, -1).trimEnd();
    }
    lines[lastIdx] = `${trimmed}...`;
  }
  return lines;
}

function drawPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  opts: {
    font: string;
    height: number;
    padX: number;
    fill: string;
    stroke: string;
    textColor: string;
  }
): number {
  ctx.save();
  ctx.font = opts.font;
  const textW = ctx.measureText(label).width;
  const pillW = Math.ceil(textW + opts.padX * 2);
  drawRoundedBox(ctx, {
    x,
    y,
    w: pillW,
    h: opts.height,
    r: opts.height / 2,
    fill: opts.fill,
    stroke: opts.stroke,
    lineWidth: 1.5,
  });
  ctx.fillStyle = opts.textColor;
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + opts.padX, y + opts.height / 2 + 1);
  ctx.restore();
  return pillW;
}

function drawCircularAvatar(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.save();
  ctx.shadowColor = 'rgba(184, 58, 98, 0.22)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    const size = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - size) / 2;
    const sy = (img.naturalHeight - size) * 0.28;
    ctx.drawImage(
      img,
      sx,
      sy,
      size,
      size,
      cx - radius,
      cy - radius,
      radius * 2,
      radius * 2
    );
  } else {
    ctx.fillStyle = PALETTE.pillBg;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.fillStyle = PALETTE.berry;
    ctx.font = `700 ${Math.round(radius * 0.72)}px ${DISPLAY_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SC', cx, cy + 2);
  }
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 1.5, 0, Math.PI * 2);
  ctx.strokeStyle = PALETTE.rose;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function drawOneLinerHeading(
  ctx: CanvasRenderingContext2D,
  heading: string,
  x: number,
  y: number,
  maxWidth: number
): number {
  let fontSize = 40;
  while (fontSize > 24) {
    ctx.font = `700 ${fontSize}px ${DISPLAY_FONT}`;
    if (ctx.measureText(heading).width <= maxWidth) break;
    fontSize -= 1;
  }

  ctx.save();
  ctx.font = `700 ${fontSize}px ${DISPLAY_FONT}`;
  ctx.textBaseline = 'top';
  const sepIndex = heading.indexOf(' — ');
  if (sepIndex !== -1) {
    const titlePart = heading.slice(0, sepIndex);
    const restPart = heading.slice(sepIndex);
    ctx.fillStyle = PALETTE.berry;
    ctx.fillText(titlePart, x, y);
    const titleW = ctx.measureText(titlePart).width;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText(restPart, x + titleW, y);
  } else {
    ctx.fillStyle = PALETTE.berry;
    ctx.fillText(heading, x, y);
  }
  ctx.restore();

  return fontSize + 10;
}

function drawWebsitePreviewFrame(
  ctx: CanvasRenderingContext2D,
  project: Project,
  previewImg: HTMLImageElement | null,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const hasLiveSite = Boolean(project.links.live && previewImg);

  if (!hasLiveSite) {
    // Projects without a live deployment intentionally keep this area blank
    drawRoundedBox(ctx, {
      x,
      y,
      w,
      h,
      r: 22,
      fill: PALETTE.blankFrameBg,
      stroke: PALETTE.blankFrameBorder,
      lineWidth: 2,
    });
    return;
  }

  drawRoundedBox(ctx, {
    x,
    y,
    w,
    h,
    r: 22,
    fill: '#FFFFFF',
    stroke: PALETTE.browserBorder,
    lineWidth: 2,
    shadowColor: 'rgba(184, 58, 98, 0.14)',
    shadowBlur: 24,
    shadowOffsetY: 10,
  });

  const barH = 38;
  ctx.save();
  roundedRectPath(ctx, x, y, w, h, 22);
  ctx.clip();

  // Minimal browser header strip
  ctx.fillStyle = PALETTE.browserChrome;
  ctx.fillRect(x, y, w, barH);
  ctx.fillStyle = PALETTE.browserBorder;
  ctx.fillRect(x, y + barH - 1, w, 1);

  const dotColors = [PALETTE.rose, PALETTE.butter, PALETTE.sage];
  dotColors.forEach((color, idx) => {
    ctx.beginPath();
    ctx.arc(x + 22 + idx * 18, y + barH / 2, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  if (project.links.live) {
    let displayHost = project.links.live.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    if (displayHost.length > 42) displayHost = `${displayHost.slice(0, 39)}...`;
    ctx.font = `500 12px ${MONO_FONT}`;
    const urlW = Math.min(w - 180, Math.max(200, ctx.measureText(displayHost).width + 28));
    const urlX = x + (w - urlW) / 2;
    drawRoundedBox(ctx, {
      x: urlX,
      y: y + 7,
      w: urlW,
      h: barH - 14,
      r: 12,
      fill: '#FFFFFF',
      stroke: PALETTE.browserBorder,
      lineWidth: 1,
    });
    ctx.fillStyle = PALETTE.inkSoft;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayHost, x + w / 2, y + barH / 2 + 0.5);
  }

  // Live screenshot viewport
  if (previewImg && previewImg.naturalWidth > 0 && previewImg.naturalHeight > 0) {
    const viewX = x;
    const viewY = y + barH;
    const viewW = w;
    const viewH = h - barH;
    const imgRatio = previewImg.naturalWidth / previewImg.naturalHeight;
    const boxRatio = viewW / viewH;

    let sx = 0;
    let sy = 0;
    let sw = previewImg.naturalWidth;
    let sh = previewImg.naturalHeight;

    if (imgRatio > boxRatio) {
      sw = previewImg.naturalHeight * boxRatio;
      sx = (previewImg.naturalWidth - sw) / 2;
    } else if (imgRatio < boxRatio) {
      sh = previewImg.naturalWidth / boxRatio;
      sy = 0; // Keep top hero aligned cleanly
    }

    ctx.drawImage(previewImg, sx, sy, sw, sh, viewX, viewY, viewW, viewH);
  }
  ctx.restore();
}

/**
 * Renders a 1600x900 presentation PNG thumbnail card for the given project.
 */
export async function renderProjectThumbnailCanvas(
  project: Project
): Promise<HTMLCanvasElement> {
  await ensureFontsLoaded();

  const shouldLoadPreview = Boolean(project.links.live && project.previewImage);
  const [avatarImg, previewImg] = await Promise.all([
    loadImage('/images/me.jpeg'),
    shouldLoadPreview && project.previewImage
      ? loadImage(project.previewImage)
      : Promise.resolve(null),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize 2D canvas context');
  }

  // Soft pastel backdrop gradient matching the portfolio palette
  const bgGrad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
  bgGrad.addColorStop(0, PALETTE.bgStart);
  bgGrad.addColorStop(0.55, PALETTE.bgMid);
  bgGrad.addColorStop(1, PALETTE.bgEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Subtle ambient glow circles in background corners
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.arc(140, 120, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(232, 106, 146, 0.12)';
  ctx.beginPath();
  ctx.arc(CANVAS_W - 100, CANVAS_H - 90, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Outer card frame
  const cardX = 40;
  const cardY = 36;
  const cardW = CANVAS_W - 80;
  const cardH = CANVAS_H - 72;
  drawRoundedBox(ctx, {
    x: cardX,
    y: cardY,
    w: cardW,
    h: cardH,
    r: 34,
    fill: PALETTE.cardBg,
    stroke: PALETTE.cardBorder,
    lineWidth: 3,
    shadowColor: 'rgba(184, 58, 98, 0.18)',
    shadowBlur: 36,
    shadowOffsetY: 14,
  });

  drawRoundedBox(ctx, {
    x: cardX + 10,
    y: cardY + 10,
    w: cardW - 20,
    h: cardH - 20,
    r: 26,
    stroke: PALETTE.cardInnerBorder,
    lineWidth: 2,
  });

  const innerX = 88;
  const innerRight = CANVAS_W - 88;
  const innerW = innerRight - innerX;

  // Top metadata row: Year + Status (left) and Live/Repo host badge (right)
  let topPillX = innerX;
  const topPillY = 72;
  const yearW = drawPill(ctx, topPillX, topPillY, `YEAR  ${project.year}`, {
    font: `700 15px ${DISPLAY_FONT}`,
    height: 34,
    padX: 16,
    fill: PALETTE.butter,
    stroke: PALETTE.butterBorder,
    textColor: PALETTE.ink,
  });
  topPillX += yearW + 12;

  const isBuilding = project.status === 'Currently Building';
  drawPill(ctx, topPillX, topPillY, project.status.toUpperCase(), {
    font: `700 13px ${MONO_FONT}`,
    height: 34,
    padX: 15,
    fill: isBuilding ? PALETTE.amberBg : PALETTE.pillBg,
    stroke: isBuilding ? PALETTE.amberBorder : PALETTE.pillBorder,
    textColor: isBuilding ? PALETTE.amberText : PALETTE.accent,
  });

  if (project.links.live) {
    const liveLabel = `LIVE · ${project.links.live.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`;
    ctx.save();
    ctx.font = `600 13px ${MONO_FONT}`;
    const measuredW = Math.ceil(ctx.measureText(liveLabel).width + 32);
    ctx.restore();
    drawPill(ctx, innerRight - measuredW, topPillY, liveLabel, {
      font: `600 13px ${MONO_FONT}`,
      height: 34,
      padX: 16,
      fill: '#ECFDF5',
      stroke: '#6EE7B7',
      textColor: '#065F46',
    });
  }

  // Full-width one-liner heading
  const headingY = 124;
  const headingAdvance = drawOneLinerHeading(
    ctx,
    project.oneLiner,
    innerX,
    headingY,
    innerW
  );

  // Full-width subtitle
  const subtitleY = headingY + headingAdvance + 4;
  ctx.save();
  ctx.font = `500 20px ${DISPLAY_FONT}`;
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.textBaseline = 'top';
  const subtitleLines = wrapLines(ctx, project.tagline, innerW, 2);
  const subtitleLineH = 28;
  subtitleLines.forEach((line, idx) => {
    ctx.fillText(line, innerX, subtitleY + idx * subtitleLineH);
  });
  ctx.restore();

  const subtitleBottom = subtitleY + subtitleLines.length * subtitleLineH;
  const footerDividerY = 738;
  const middleTop = Math.max(subtitleBottom + 20, 252);
  const middleH = footerDividerY - 22 - middleTop;

  // Right column: actual live website image OR blank container when no live website
  const frameW = Math.min(700, Math.round((middleH - 38) * 1.6));
  const frameH = Math.round(frameW / 1.6) + 38;
  const frameX = innerRight - frameW;
  const frameY = middleTop + Math.max(0, Math.floor((middleH - frameH) / 2));

  drawWebsitePreviewFrame(ctx, project, previewImg, frameX, frameY, frameW, frameH);

  // Left column: Tech stack + key highlights / repository reference
  const leftW = frameX - innerX - 42;
  let curY = middleTop + 4;

  ctx.save();
  ctx.font = `700 13px ${MONO_FONT}`;
  ctx.fillStyle = PALETTE.accent;
  ctx.textBaseline = 'top';
  ctx.fillText('TECH STACK', innerX, curY);
  ctx.restore();
  curY += 26;

  // Tech Stack Pills
  let tagX = innerX;
  const tagH = 36;
  const tagGapX = 10;
  const tagGapY = 10;
  for (const tag of project.tags) {
    ctx.save();
    ctx.font = `600 15px ${DISPLAY_FONT}`;
    const candidateW = Math.ceil(ctx.measureText(tag).width + 32);
    ctx.restore();
    if (tagX !== innerX && tagX + candidateW > innerX + leftW) {
      tagX = innerX;
      curY += tagH + tagGapY;
    }
    const w = drawPill(ctx, tagX, curY, tag, {
      font: `600 15px ${DISPLAY_FONT}`,
      height: tagH,
      padX: 16,
      fill: PALETTE.pillBg,
      stroke: PALETTE.pillBorder,
      textColor: PALETTE.ink,
    });
    tagX += w + tagGapX;
  }
  curY += tagH + 28;

  // Concise Highlights (fit within remaining left column space above footer divider)
  if (curY + 95 < footerDividerY - 18 && project.technicalHighlights.length > 0) {
    ctx.save();
    ctx.font = `700 13px ${MONO_FONT}`;
    ctx.fillStyle = PALETTE.accent;
    ctx.textBaseline = 'top';
    ctx.fillText('KEY ENGINEERING HIGHLIGHTS', innerX, curY);
    ctx.restore();
    curY += 26;

    for (const highlight of project.technicalHighlights.slice(0, 2)) {
      ctx.save();
      ctx.font = `400 16px ${DISPLAY_FONT}`;
      const hlLines = wrapLines(ctx, highlight, leftW - 22, 3);
      const neededH = hlLines.length * 23 + 12;
      if (curY + neededH > footerDividerY - 20) {
        ctx.restore();
        break;
      }

      // Bullet dot
      ctx.fillStyle = PALETTE.rose;
      ctx.beginPath();
      ctx.arc(innerX + 6, curY + 10, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = PALETTE.inkSoft;
      ctx.textBaseline = 'top';
      hlLines.forEach((line, idx) => {
        ctx.fillText(line, innerX + 20, curY + idx * 23);
      });
      ctx.restore();
      curY += neededH;
    }
  }

  // Footer divider
  ctx.save();
  ctx.fillStyle = PALETTE.divider;
  ctx.fillRect(innerX, footerDividerY, innerW, 2);
  ctx.restore();

  // Footer Bar: User Photo + "Developed by : Sutanuka Chakraborty" + Year/Site
  const avatarR = 44;
  const avatarCx = innerX + avatarR + 2;
  const avatarCy = footerDividerY + (cardY + cardH - footerDividerY) / 2 - 2;
  drawCircularAvatar(ctx, avatarImg, avatarCx, avatarCy, avatarR);

  const authorTextX = avatarCx + avatarR + 24;
  ctx.save();
  ctx.textBaseline = 'middle';
  const labelPrefix = 'Developed by : ';
  ctx.font = `500 24px ${DISPLAY_FONT}`;
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.fillText(labelPrefix, authorTextX, avatarCy - 14);
  const prefixW = ctx.measureText(labelPrefix).width;

  ctx.font = `700 26px ${DISPLAY_FONT}`;
  ctx.fillStyle = PALETTE.berry;
  ctx.fillText(site.name, authorTextX + prefixW, avatarCy - 14);

  const metaParts = [site.role];
  if (project.links.code) {
    metaParts.push(project.links.code.replace(/^https?:\/\//, ''));
  } else {
    metaParts.push(site.url.replace(/^https?:\/\//, ''));
  }
  ctx.font = `500 15px ${MONO_FONT}`;
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.fillText(metaParts.join('  ·  '), authorTextX, avatarCy + 18);
  ctx.restore();

  // Right-aligned Year stamp in footer for unmistakable clarity
  const footerYearLabel = `${project.year}`;
  ctx.save();
  ctx.font = `700 22px ${DISPLAY_FONT}`;
  const footerYearW = Math.ceil(ctx.measureText(footerYearLabel).width + 44);
  ctx.restore();
  drawPill(ctx, innerRight - footerYearW, avatarCy - 21, footerYearLabel, {
    font: `700 22px ${DISPLAY_FONT}`,
    height: 42,
    padX: 22,
    fill: PALETTE.pillBg,
    stroke: PALETTE.cardBorder,
    textColor: PALETTE.berry,
  });

  return canvas;
}

/**
 * Exports a PNG thumbnail card for the given project and downloads it as `<slug>-thumbnail.png`.
 */
export async function exportProjectThumbnailPng(project: Project): Promise<void> {
  if (typeof window === 'undefined') return;
  const canvas = await renderProjectThumbnailCanvas(project);
  const dataUrlFallback = canvas.toDataURL('image/png');
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((result) => resolve(result), 'image/png')
  );

  const filename = `${project.slug}-thumbnail.png`;
  if (blob) {
    downloadBlob(blob, filename, dataUrlFallback);
  } else {
    const res = await fetch(dataUrlFallback);
    const fetchedBlob = await res.blob();
    downloadBlob(fetchedBlob, filename, dataUrlFallback);
  }
}
