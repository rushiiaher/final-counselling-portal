import type { CSSProperties, ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';
type Tag = 'div' | 'section' | 'li' | 'footer' | 'header' | 'span';

/**
 * Formerly a scroll-reveal animation. Content now renders immediately
 * (lighter pages, no layout shift on slow phones). The props are kept so
 * existing pages keep working unchanged.
 */
export default function FadeIn({
  children,
  className,
  style,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: Tag;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
}) {
  const Component = as;
  return (
    <Component className={className} style={style}>
      {children}
    </Component>
  );
}
