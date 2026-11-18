import React from "react";
import type { NavItem } from "@/config/navigation";

/* Renders a nav item's icon: Material Symbols (design) when `mi` is set,
   otherwise the lucide icon component. Needs the materialSymbols font
   variable class on an ancestor (added by the shell). */
export function MaterialIcon({ name, size = 20, fill = false, className = "" }: { name: string; size?: number; fill?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined shrink-0 ${className}`}
      style={{ fontSize: size, width: size, height: size, fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
    >
      {name}
    </span>
  );
}

export default function NavIcon({ item, active, size = 20, className = "" }: { item: NavItem; active: boolean; size?: number; className?: string }) {
  if (item.mi) return <MaterialIcon name={item.mi} size={size} fill={active} className={className} />;
  const Icon = item.icon;
  return <Icon className={`shrink-0 ${className}`} style={{ width: size, height: size }} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />;
}
