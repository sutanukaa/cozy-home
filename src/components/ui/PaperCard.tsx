import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
  /** slight scrapbook tilt in degrees */
  tilt?: number;
  tape?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
  id?: string;
}

/** A sheet of paper stuck to the wall. The basic container for content. */
export default function PaperCard({ children, className, tilt = 0, tape = false, as: Tag = 'div', id }: Props) {
  return (
    <Tag
      id={id}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
      className={clsx(
        'relative scroll-mt-28 rounded-3xl border-2 border-ink/10 bg-paper p-6 shadow-cozy transition-transform duration-300',
        'hover:z-10 hover:-translate-y-1',
        className,
      )}
    >
      {tape && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-sm bg-butter/80 shadow-sm"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgb(255 255 255 / .35) 0 6px, transparent 6px 12px)' }}
        />
      )}
      {children}
    </Tag>
  );
}
