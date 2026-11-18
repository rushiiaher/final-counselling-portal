/**
 * Formerly counted up from 0 when scrolled into view. It now shows the final
 * value straight away (no flash of "0" on slow connections). Props kept for
 * compatibility.
 */
export default function AnimatedCounter({
  value,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  return <span className={className}>{value}</span>;
}
