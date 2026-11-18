import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Formerly a staggered reveal animation. Items now render immediately;
 * props are kept so existing pages keep working unchanged.
 */
export function StaggerContainer({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'section';
  staggerDelay?: number;
  amount?: number;
  once?: boolean;
}) {
  const Component = as;
  return <Component className={className}>{children}</Component>;
}

export function StaggerItem({
  children,
  className,
  as = 'div',
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li';
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  const Component = as;
  return (
    <Component className={className} {...rest}>
      {children}
    </Component>
  );
}
