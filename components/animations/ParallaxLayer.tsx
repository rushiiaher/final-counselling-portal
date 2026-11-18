import type { ReactNode } from 'react';

/**
 * Formerly a scroll-linked parallax layer. Now a static wrapper (no scroll
 * listeners) so pages stay light on low-end phones. Props kept for
 * compatibility.
 */
export default function ParallaxLayer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  return (
    <div className={className}>
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
