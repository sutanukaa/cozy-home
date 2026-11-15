import Link from 'next/link';
import clsx from 'clsx';

interface Props {
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'soft';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({ href, external, children, variant = 'primary', className, type = 'button', disabled, onClick }: Props) {
  const cls = clsx(
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-medium transition active:translate-y-0.5',
    variant === 'primary' && 'bg-accent text-white shadow-pop hover:brightness-105 dark:text-plum',
    variant === 'soft' && 'border-2 border-ink/15 bg-paper text-ink hover:bg-blush/60',
    disabled && 'pointer-events-none opacity-60',
    className,
  );
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}
