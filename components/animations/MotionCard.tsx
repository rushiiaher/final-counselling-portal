import type { ReactNode } from 'react';

/**
 * Card wrapper. The spring "lift" animation was replaced by a short
 * (150ms) border/shadow transition defined by the card's own classes.
 */
export default function MotionCard({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
}
