import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type CommonProps = {
  children: ReactNode;
  className?: string;
  lift?: boolean;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps & {
  href: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
};

/**
 * Drop-in <button> / <Link> (pass `href` for a link). The scale/spring
 * animation was removed; hover feedback comes from the 150ms colour
 * transitions in the classes passed via `className`.
 */
export default function MotionButton(props: ButtonProps | LinkProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, className, lift, ...rest } = props;

  if ('href' in props && props.href) {
    const { href, onClick, target, rel } = rest as LinkProps;
    return (
      <Link href={href} onClick={onClick} target={target} rel={rel} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
