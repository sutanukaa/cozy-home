const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

async function generate() {
  const roomBgPath = path.resolve('public/assets/rooms/living-room-day.webp');
  const roomBgBase64 = fs.readFileSync(roomBgPath).toString('base64');

  const stampPath = path.resolve('public/assets/icons/skill-frontend.webp');
  let stampBase64 = '';
  if (fs.existsSync(stampPath)) {
    stampBase64 = fs.readFileSync(stampPath).toString('base64');
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Gaegu:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      font-family: 'Fredoka', cursive, sans-serif;
      position: relative;
      background: #FCE7EE;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Background scene with soft warm blur & overlay */
    .bg-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 1200px;
      height: 630px;
      object-fit: cover;
      filter: blur(4px) saturate(1.1) brightness(0.96);
      transform: scale(1.04);
    }
    .bg-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(255, 240, 245, 0.45) 0%, rgba(247, 198, 211, 0.75) 100%);
    }

    /* Floating cute sparkles/petals */
    .sparkle {
      position: absolute;
      font-size: 28px;
      opacity: 0.8;
    }

    /* Main Scrapbook Card */
    .card {
      position: relative;
      width: 1040px;
      height: 480px;
      background: #FFFDF9;
      border-radius: 36px;
      border: 4px solid #F3BDCC;
      box-shadow:
        0 24px 50px -12px rgba(184, 58, 98, 0.28),
        0 10px 24px rgba(0, 0, 0, 0.06),
        inset 0 0 0 8px #FFF0F4;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 44px 60px;
      z-index: 10;
    }

    /* Washi tape pieces on corners */
    .washi-tape-tl {
      position: absolute;
      top: -18px;
      left: 40px;
      width: 130px;
      height: 38px;
      background: repeating-linear-gradient(
        45deg,
        rgba(244, 143, 177, 0.75),
        rgba(244, 143, 177, 0.75) 12px,
        rgba(255, 255, 255, 0.8) 12px,
        rgba(255, 255, 255, 0.8) 24px
      );
      transform: rotate(-6deg);
      box-shadow: 0 4px 10px rgba(0,0,0,0.12);
      border-radius: 4px;
      opacity: 0.92;
    }
    .washi-tape-tr {
      position: absolute;
      top: -18px;
      right: 40px;
      width: 130px;
      height: 38px;
      background: repeating-linear-gradient(
        -45deg,
        rgba(244, 143, 177, 0.75),
        rgba(244, 143, 177, 0.75) 12px,
        rgba(255, 255, 255, 0.8) 12px,
        rgba(255, 255, 255, 0.8) 24px
      );
      transform: rotate(5deg);
      box-shadow: 0 4px 10px rgba(0,0,0,0.12);
      border-radius: 4px;
      opacity: 0.92;
    }

    /* Postal Stamp in top-right */
    .post-stamp {
      position: absolute;
      top: 26px;
      right: 36px;
      width: 82px;
      height: 98px;
      background: #FFF;
      border: 3px dashed #E598A9;
      border-radius: 12px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: rotate(4deg);
      box-shadow: 0 4px 12px rgba(184, 58, 98, 0.15);
    }
    .post-stamp img {
      width: 52px;
      height: 52px;
      object-fit: contain;
    }
    .post-stamp-label {
      font-size: 11px;
      font-weight: 700;
      color: #C84B70;
      letter-spacing: 0.5px;
      margin-top: 4px;
      text-transform: uppercase;
    }

    /* Postal cancellation mark */
    .cancellation {
      position: absolute;
      top: 48px;
      right: 124px;
      display: flex;
      align-items: center;
      gap: 4px;
      opacity: 0.45;
      transform: rotate(-10deg);
    }
    .cancellation-circle {
      width: 48px;
      height: 48px;
      border: 2px solid #8A4058;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 700;
      color: #8A4058;
      text-align: center;
      line-height: 1.1;
    }
    .cancellation-waves {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .cancellation-wave {
      width: 45px;
      height: 2px;
      background: #8A4058;
      border-radius: 1px;
    }

    /* Tag / Eyebrow */
    .tagline-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FFE4EC;
      color: #B83A62;
      font-size: 16px;
      font-weight: 600;
      padding: 8px 22px;
      border-radius: 999px;
      border: 2px solid #F9AFC4;
      margin-bottom: 18px;
      letter-spacing: 0.5px;
    }

    /* Main Name */
    .name-title {
      font-size: 68px;
      font-weight: 700;
      color: #B83A62;
      letter-spacing: -0.5px;
      line-height: 1.1;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
    }

    /* Role */
    .role-title {
      font-size: 27px;
      font-weight: 600;
      color: #5D434D;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    /* Gaegu handwritten note */
    .handwritten-note {
      font-family: 'Gaegu', cursive;
      font-size: 38px;
      font-weight: 700;
      color: #C2486E;
      background: #FFF2F6;
      padding: 10px 36px;
      border-radius: 20px;
      border: 2px dashed #F5A9BD;
      transform: rotate(-1deg);
      display: inline-block;
      margin-top: 8px;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <img class="bg-image" src="data:image/webp;base64,${roomBgBase64}" alt="" />
  <div class="bg-overlay"></div>

  <div class="sparkle" style="top: 40px; left: 80px;">🌸</div>
  <div class="sparkle" style="bottom: 50px; left: 100px;">✨</div>
  <div class="sparkle" style="bottom: 45px; right: 90px;">🌷</div>
  <div class="sparkle" style="top: 50px; right: 80px;">💫</div>

  <div class="card">
    <div class="washi-tape-tl"></div>
    <div class="washi-tape-tr"></div>

    <div class="cancellation">
      <div class="cancellation-circle">COZY<br/>HOME</div>
      <div class="cancellation-waves">
        <div class="cancellation-wave"></div>
        <div class="cancellation-wave"></div>
        <div class="cancellation-wave"></div>
      </div>
    </div>

    <div class="post-stamp">
      ${stampBase64 ? `<img src="data:image/webp;base64,${stampBase64}" alt="" />` : '<span style="font-size: 32px;">🏠</span>'}
      <span class="post-stamp-label">PORTFOLIO</span>
    </div>

    <div class="tagline-pill">
      <span>🏡</span>
      <span>A Cozy Animated Portfolio</span>
    </div>

    <h1 class="name-title">Sutanuka Chakraborty</h1>
    <h2 class="role-title">Software Development Engineer</h2>

    <div class="handwritten-note">
      “Step inside my little home and look around !”
    </div>
  </div>
</body>
</html>`;

  const htmlPath = path.resolve('scripts/og-template.html');
  fs.writeFileSync(htmlPath, html, 'utf8');

  const rawScreenshotPath = path.resolve('scripts/og-raw.png');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  // Run headless Chrome to take high-DPI screenshot at 1200x630 after webfonts load
  const cmd = `"${chromePath}" --headless --disable-gpu --window-size=1200,630 --hide-scrollbars --virtual-time-budget=4000 --run-all-compositor-stages-before-draw --screenshot="${rawScreenshotPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;
  execSync(cmd, { stdio: 'inherit' });

  // Now optimize to public/assets/og/og-image.png under 300KB
  const targetOgPath = path.resolve('public/assets/og/og-image.png');
  await sharp(rawScreenshotPath)
    .resize(1200, 630)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(targetOgPath);

  const stats = fs.statSync(targetOgPath);
  console.log(`Generated OG Image at ${targetOgPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB (WhatsApp requirement: <300 KB)`);
}

generate().catch(console.error);
