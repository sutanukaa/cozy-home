import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

/**
 * Pixel-art SVG icons crafted with crispEdges and soft pink pastel palette
 */

// 1. Pixel Robot / AI Brain (for RAG Document Q&A)
export function PixelRobot({ size = 48, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Antenna */}
      <rect x="11" y="1" width="2" height="2" fill="#E86A92" />
      <rect x="11" y="3" width="2" height="2" fill="#F9C6D3" />
      {/* Head Outer */}
      <rect x="5" y="5" width="14" height="12" fill="#FCE7EC" />
      <rect x="4" y="6" width="16" height="10" fill="#FCE7EC" />
      {/* Ears */}
      <rect x="2" y="9" width="2" height="4" fill="#E86A92" />
      <rect x="20" y="9" width="2" height="4" fill="#E86A92" />
      {/* Head Border / Shading */}
      <rect x="6" y="5" width="12" height="1" fill="#E86A92" />
      <rect x="4" y="6" width="1" height="10" fill="#E86A92" />
      <rect x="19" y="6" width="1" height="10" fill="#C95478" />
      <rect x="5" y="16" width="14" height="1" fill="#C95478" />
      {/* Screen / Visor */}
      <rect x="7" y="8" width="10" height="5" fill="#3D2947" />
      {/* Glowing Pixel Eyes */}
      <rect x="9" y="9" width="2" height="2" fill="#FFE29A" />
      <rect x="13" y="9" width="2" height="2" fill="#FFE29A" />
      {/* Blush cheeks */}
      <rect x="6" y="14" width="2" height="1" fill="#FF8BA7" />
      <rect x="16" y="14" width="2" height="1" fill="#FF8BA7" />
      {/* Smile */}
      <rect x="10" y="14" width="4" height="1" fill="#E86A92" />
      {/* Neck & Shoulders */}
      <rect x="10" y="17" width="4" height="2" fill="#A9C7A0" />
      <rect x="7" y="19" width="10" height="4" fill="#E86A92" />
    </svg>
  );
}

// 2. Pixel Code Lightning / Disk (for Syntactiq Code Modernization)
export function PixelCode({ size = 48, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Floppy Disk Body */}
      <rect x="4" y="3" width="16" height="18" fill="#FCE7EC" />
      <rect x="3" y="4" width="18" height="16" fill="#FCE7EC" />
      {/* Border */}
      <rect x="4" y="3" width="14" height="1" fill="#E86A92" />
      <rect x="3" y="4" width="1" height="16" fill="#E86A92" />
      <rect x="20" y="5" width="1" height="15" fill="#C95478" />
      <rect x="4" y="20" width="16" height="1" fill="#C95478" />
      {/* Top Shutter */}
      <rect x="6" y="4" width="11" height="6" fill="#FFFFFF" />
      <rect x="8" y="5" width="3" height="4" fill="#3D2947" />
      {/* Label Area */}
      <rect x="5" y="12" width="14" height="7" fill="#FFF6EC" />
      {/* Golden Lightning Bolt on label */}
      <rect x="12" y="12" width="2" height="2" fill="#FFE29A" />
      <rect x="11" y="14" width="3" height="1" fill="#FFD15C" />
      <rect x="10" y="15" width="4" height="1" fill="#FFB703" />
      <rect x="11" y="16" width="2" height="2" fill="#FB8500" />
    </svg>
  );
}

// 3. Pixel Scrapbook Diary (for A Little Scrapbook)
export function PixelScrapbook({ size = 48, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Book Cover */}
      <rect x="4" y="3" width="15" height="18" fill="#FF8BA7" />
      <rect x="3" y="4" width="17" height="16" fill="#FF8BA7" />
      {/* Spine */}
      <rect x="3" y="4" width="3" height="16" fill="#E86A92" />
      {/* Gold Corner Protectors */}
      <rect x="16" y="3" width="3" height="3" fill="#FFE29A" />
      <rect x="16" y="18" width="3" height="3" fill="#FFE29A" />
      {/* Pages Edge */}
      <rect x="19" y="5" width="2" height="14" fill="#FFF6EC" />
      <rect x="20" y="6" width="1" height="12" fill="#F4DFC8" />
      {/* Heart Emboss on Cover */}
      <rect x="10" y="8" width="2" height="2" fill="#FFFFFF" />
      <rect x="13" y="8" width="2" height="2" fill="#FFFFFF" />
      <rect x="9" y="10" width="7" height="2" fill="#FFFFFF" />
      <rect x="10" y="12" width="5" height="2" fill="#FFFFFF" />
      <rect x="11" y="14" width="3" height="1" fill="#FFFFFF" />
      <rect x="12" y="15" width="1" height="1" fill="#FFFFFF" />
      {/* Ribbon Bookmark */}
      <rect x="11" y="18" width="2" height="4" fill="#A9C7A0" />
      <rect x="11" y="22" width="1" height="1" fill="#A9C7A0" />
    </svg>
  );
}

// 4. Pixel Flower Bouquet (for Bloom for Youu)
export function PixelFlower({ size = 48, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Flower 1 Petals (Pink) */}
      <rect x="6" y="4" width="4" height="2" fill="#FF8BA7" />
      <rect x="4" y="6" width="2" height="4" fill="#FF8BA7" />
      <rect x="10" y="6" width="2" height="4" fill="#FF8BA7" />
      <rect x="6" y="10" width="4" height="2" fill="#FF8BA7" />
      {/* Center 1 (Butter Yellow) */}
      <rect x="6" y="6" width="4" height="4" fill="#FFE29A" />
      <rect x="7" y="7" width="2" height="2" fill="#FFB703" />

      {/* Flower 2 Petals (Rose) */}
      <rect x="14" y="3" width="4" height="2" fill="#E86A92" />
      <rect x="12" y="5" width="2" height="4" fill="#E86A92" />
      <rect x="18" y="5" width="2" height="4" fill="#E86A92" />
      <rect x="14" y="9" width="4" height="2" fill="#E86A92" />
      {/* Center 2 */}
      <rect x="14" y="5" width="4" height="4" fill="#FFFFFF" />

      {/* Stems */}
      <rect x="7" y="12" width="2" height="8" fill="#80B97A" />
      <rect x="14" y="11" width="2" height="9" fill="#80B97A" />

      {/* Leaves */}
      <rect x="4" y="14" width="3" height="2" fill="#A9C7A0" />
      <rect x="16" y="15" width="3" height="2" fill="#A9C7A0" />

      {/* Ribbon Bow */}
      <rect x="8" y="17" width="7" height="3" fill="#FF8BA7" />
      <rect x="10" y="18" width="3" height="2" fill="#E86A92" />
    </svg>
  );
}

// 5. Pixel Folder (for system/files)
export function PixelFolder({ size = 48, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Folder Tab */}
      <rect x="3" y="5" width="8" height="3" fill="#E86A92" />
      {/* Folder Back */}
      <rect x="3" y="7" width="18" height="13" fill="#E86A92" />
      {/* Sheet Inside */}
      <rect x="5" y="6" width="14" height="6" fill="#FFFFFF" />
      {/* Folder Front Flap */}
      <rect x="3" y="9" width="18" height="11" fill="#FCE7EC" />
      <rect x="4" y="10" width="16" height="9" fill="#FFF0F3" />
      {/* Heart detail */}
      <rect x="11" y="13" width="1" height="1" fill="#E86A92" />
      <rect x="13" y="13" width="1" height="1" fill="#E86A92" />
      <rect x="10" y="14" width="5" height="1" fill="#E86A92" />
      <rect x="11" y="15" width="3" height="1" fill="#E86A92" />
      <rect x="12" y="16" width="1" height="1" fill="#E86A92" />
    </svg>
  );
}

// 6. Pixel Notepad (for README / About)
export function PixelNotepad({ size = 48, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Page Body */}
      <rect x="4" y="3" width="16" height="18" fill="#FFFFFF" />
      {/* Border */}
      <rect x="4" y="3" width="16" height="1" fill="#E86A92" />
      <rect x="4" y="3" width="1" height="18" fill="#E86A92" />
      <rect x="19" y="3" width="1" height="18" fill="#E86A92" />
      <rect x="4" y="20" width="16" height="1" fill="#E86A92" />
      {/* Folded Corner */}
      <rect x="16" y="3" width="4" height="4" fill="#FCE7EC" />
      <rect x="15" y="3" width="1" height="4" fill="#E86A92" />
      <rect x="15" y="7" width="5" height="1" fill="#E86A92" />
      {/* Text Lines */}
      <rect x="7" y="8" width="7" height="1" fill="#3D2947" />
      <rect x="7" y="11" width="10" height="1" fill="#997087" />
      <rect x="7" y="14" width="9" height="1" fill="#997087" />
      <rect x="7" y="17" width="6" height="1" fill="#997087" />
    </svg>
  );
}

// 7. Pixel Trashcan / Bugs Bin
export function PixelTrash({ size = 48, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Lid Handle */}
      <rect x="10" y="3" width="4" height="2" fill="#E86A92" />
      {/* Lid */}
      <rect x="4" y="5" width="16" height="2" fill="#E86A92" />
      {/* Can Body */}
      <rect x="5" y="7" width="14" height="14" fill="#FCE7EC" />
      <rect x="5" y="7" width="1" height="14" fill="#E86A92" />
      <rect x="18" y="7" width="1" height="14" fill="#C95478" />
      <rect x="5" y="20" width="14" height="1" fill="#C95478" />
      {/* Vertical Ribs */}
      <rect x="8" y="9" width="1" height="9" fill="#E86A92" />
      <rect x="11" y="9" width="2" height="9" fill="#E86A92" />
      <rect x="15" y="9" width="1" height="9" fill="#E86A92" />
    </svg>
  );
}

// 8. Pixel Server Rack (for C HTTP Server)
export function PixelServer({ size = 48, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Server Rack Body */}
      <rect x="4" y="3" width="16" height="18" fill="#FCE7EC" />
      <rect x="3" y="4" width="18" height="16" fill="#FCE7EC" />
      <rect x="4" y="3" width="16" height="1" fill="#E86A92" />
      <rect x="3" y="4" width="1" height="16" fill="#E86A92" />
      <rect x="20" y="4" width="1" height="16" fill="#C95478" />
      <rect x="4" y="20" width="16" height="1" fill="#C95478" />
      {/* Unit 1 */}
      <rect x="6" y="5" width="12" height="4" fill="#3D2947" />
      <rect x="8" y="7" width="2" height="1" fill="#A9C7A0" />
      <rect x="11" y="7" width="2" height="1" fill="#A9C7A0" />
      {/* Unit 2 */}
      <rect x="6" y="10" width="12" height="4" fill="#3D2947" />
      <rect x="8" y="12" width="2" height="1" fill="#FFE29A" />
      <rect x="11" y="12" width="2" height="1" fill="#FFE29A" />
      {/* Unit 3 */}
      <rect x="6" y="15" width="12" height="4" fill="#3D2947" />
      <rect x="8" y="17" width="2" height="1" fill="#FF8BA7" />
      <rect x="11" y="17" width="2" height="1" fill="#FF8BA7" />
    </svg>
  );
}
