'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  alt?: string;
  className?: string;
  /** Rendered when the file is missing, so the site works before assets exist. */
  fallback?: React.ReactNode;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'eager' | 'lazy';
}

/** <img> that gracefully disappears (or shows a fallback) if the file 404s. */
export default function AssetImage({
  src,
  alt = '',
  className,
  fallback = null,
  fetchPriority = 'auto',
  loading,
}: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // The error event can fire before hydration; check again once mounted.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <>{fallback}</>;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      draggable={false}
      fetchPriority={fetchPriority}
      loading={loading}
    />
  );
}
