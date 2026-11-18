import type { NavItem } from "@/config/navigation";

/** The nav item whose href is the longest prefix of the current path. */
export function findActiveNav(navigation: NavItem[], pathname: string): NavItem | undefined {
  let best: NavItem | undefined;
  for (const item of navigation) {
    const hit = pathname === item.href || pathname.startsWith(item.href + "/");
    if (hit && (!best || item.href.length > best.href.length)) best = item;
  }
  return best;
}

const HONORIFIC = /^(dr|mr|mrs|ms|miss|prof|er|adv)\.?$/i;

/* "Dr. Ayesha Khan" → "AK" (honorifics are skipped) */
export function initialsOf(name?: string | null) {
  const words = (name ?? "").split(" ").filter(Boolean);
  const core = words.filter((w) => !HONORIFIC.test(w));
  return (
    (core.length ? core : words)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

/* Name to greet with: "Dr. Ayesha Khan" stays whole, "Insha Jan" → "Insha" */
export function greetingName(name?: string | null) {
  const words = (name ?? "").split(" ").filter(Boolean);
  if (!words.length) return null;
  return HONORIFIC.test(words[0]) ? words.join(" ") : words[0];
}
