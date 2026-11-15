import clsx from 'clsx';

export default function Sticker({ children, className, tilt = -2 }: { children: React.ReactNode; className?: string; tilt?: number }) {
  return (
    <span
      style={{ transform: `rotate(${tilt}deg)` }}
      className={clsx('inline-flex items-center gap-1.5 rounded-full border-2 border-white/70 bg-blush px-3 py-1 text-sm font-medium text-cocoa shadow-sm', className)}
    >
      {children}
    </span>
  );
}
