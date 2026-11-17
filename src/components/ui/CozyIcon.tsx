import Image from 'next/image';

const ICONS: Record<string, string> = {
  // Rooms
  'home': '/assets/icons/home.png',
  'living-room': '/assets/icons/home.png',
  'studio': '/assets/icons/studio.png',
  'bedroom': '/assets/icons/bedroom.png',
  'library': '/assets/icons/library.png',
  'kitchen': '/assets/icons/kitchen.png',
  'porch': '/assets/icons/porch.png',

  // Skills
  'skill-frontend': '/assets/icons/skill-frontend.png',
  'skill-backend': '/assets/icons/skill-backend.png',
  'skill-ai': '/assets/icons/skill-ai.png',
  'skill-tools': '/assets/icons/skill-tools.png',
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
