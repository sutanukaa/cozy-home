import Image from 'next/image';

const ICONS: Record<string, string> = {
  // Rooms
  'home': '/assets/icons/home.webp',
  'living-room': '/assets/icons/home.webp',
  'studio': '/assets/icons/studio.webp',
  'bedroom': '/assets/icons/bedroom.webp',
  'library': '/assets/icons/library.webp',
  'kitchen': '/assets/icons/kitchen.webp',
  'porch': '/assets/icons/porch.webp',

  // Skills
  'skill-frontend': '/assets/icons/skill-frontend.webp',
  'skill-backend': '/assets/icons/skill-backend.webp',
  'skill-ai': '/assets/icons/skill-ai.webp',
  'skill-tools': '/assets/icons/skill-tools.webp',
};

interface CozyIconProps {
  name: string;
  fallback?: string;
  className?: string;
  size?: number;
  alt?: string;
}

export default function CozyIcon({
  name,
  fallback,
  className = '',
  size = 24,
  alt = '',
}: CozyIconProps) {
  const iconSrc = ICONS[name];

  if (iconSrc) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src={iconSrc}
          alt={alt}
          width={size}
          height={size}
          className="h-full w-full object-contain drop-shadow-sm select-none"
        />
      </span>
    );
  }

  // Fallback to emoji if no image exists yet
  if (fallback) {
    return (
      <span
        aria-hidden
        className={`inline-flex shrink-0 items-center justify-center ${className}`}
        style={{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.85)}px` }}
      >
        {fallback}
      </span>
    );
  }

  return null;
}
