import React from "react";
import { MaterialIcon } from "@/components/layout/NavIcon";
import { CONCERNS, MODES } from "@/lib/student-app/data";

/* Desk primitives ported from the new design (desk-shell.jsx). */

export const CO_ACCENT = "#b45309";

const STATUS: Record<string, { label: string; bg: string; fg: string; dot: string }> = {
  requested: { label: "Requested", bg: "#fff4e0", fg: "#b45309", dot: "#f59e0b" },
  confirmed: { label: "Confirmed", bg: "#e7eeff", fg: "#0f4c81", dot: "#0f4c81" },
  "checked-in": { label: "Checked in", bg: "#e0f2fe", fg: "#0369a1", dot: "#0ea5e9" },
  "in-progress": { label: "In session", bg: "#e7f7f0", fg: "#067a55", dot: "#10b981" },
  "follow-up": { label: "Follow-up", bg: "#e0f2fe", fg: "#0369a1", dot: "#0ea5e9" },
  completed: { label: "Completed", bg: "#eef2f7", fg: "#475569", dot: "#94a3b8" },
  escalated: { label: "Escalated", bg: "#fee2e2", fg: "#b91c1c", dot: "#ef4444" },
  "no-show": { label: "No-show", bg: "#fee2e2", fg: "#b91c1c", dot: "#ef4444" },
  cancelled: { label: "Cancelled", bg: "#f1f5f9", fg: "#64748b", dot: "#cbd5e1" },
};

export function DStatusBadge({ status, size = "md" }: { status: string; size?: "sm" | "md" }) {
  const m = STATUS[status] ?? { label: status, bg: "#eef2f7", fg: "#475569", dot: "#94a3b8" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${size === "sm" ? "px-[9px] py-[3px] text-[11px]" : "px-3 py-[5px] text-[12.5px]"}`}
      style={{ background: m.bg, color: m.fg }}
    >
      <span className="w-[7px] h-[7px] rounded-full" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

export function ModeIcon({ mode, size = 18 }: { mode: string | null; size?: number }) {
  const m = MODES.find((x) => x.id === mode);
  const colors: Record<string, string> = { "in-person": "#0e7490", video: "#0f4c81", phone: "#b45309" };
  return (
    <span title={m?.en ?? "Mode not set"} style={{ color: (mode && colors[mode]) || "#475569", display: "inline-flex" }}>
      <MaterialIcon name={m?.icon ?? "event"} size={size} />
    </span>
  );
}

export function modeLabel(mode: string | null, full = false) {
  const m = MODES.find((x) => x.id === mode);
  if (!m) return "—";
  return full ? m.en.split(" at")[0] : m.en.split(" ")[0];
}

export function ConcernTag({ concern }: { concern: string }) {
  const c = CONCERNS.find((x) => x.id === concern) ?? { en: concern, color: "#475569", icon: "label" };
  return (
    <span
      className="inline-flex items-center gap-[5px] rounded-full px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap"
      style={{ background: c.color + "14", color: c.color }}
    >
      <MaterialIcon name={c.icon} size={13} fill />
      {c.en}
    </span>
  );
}

export function MiniAvatar({ init, color = CO_ACCENT, size = 34 }: { init: string; color?: string; size?: number }) {
  return (
    <span
      className="rounded-full text-white grid place-items-center font-display font-bold shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {init}
    </span>
  );
}

export function Pill({ children, color = "#0f4c81" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="text-[11.5px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap" style={{ color, background: color + "14" }}>
      {children}
    </span>
  );
}

export function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return (
    <th className={`text-[11.5px] font-semibold text-[#6b7280] uppercase tracking-[0.4px] px-3.5 pb-2.5 whitespace-nowrap ${right ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}

export function Td({ children, right, className = "" }: { children?: React.ReactNode; right?: boolean; className?: string }) {
  return (
    <td className={`px-3.5 py-[13px] text-[13.5px] text-ink border-t border-[#eef2f7] align-middle ${right ? "text-right" : "text-left"} ${className}`}>
      {children}
    </td>
  );
}

export function EmptyState({ icon = "inbox", text }: { icon?: string; text: string }) {
  return (
    <div className="text-center px-5 py-10 text-ink-2">
      <span className="text-line inline-flex"><MaterialIcon name={icon} size={40} /></span>
      <div className="text-[14px] font-medium mt-2.5">{text}</div>
    </div>
  );
}

/* Accept (filled) / Decline (outline) mini buttons */
export function miniBtnClass(filled: boolean) {
  return filled
    ? "flex-1 py-2 rounded-[9px] text-[12.5px] font-semibold text-white bg-[#b45309] hover:brightness-95 disabled:opacity-50"
    : "flex-1 py-2 rounded-[9px] text-[12.5px] font-semibold text-ink-2 border border-ink-2/25 hover:bg-surface-alt disabled:opacity-50";
}
