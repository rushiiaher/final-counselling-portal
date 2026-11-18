import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/* Desk primitives from the new design (desk-shell.jsx): StatTile, Panel,
   StatusBadge, EmptyPanel, ActionTile. Server-component safe. */

export function StatTile({
  icon: Icon,
  label,
  value,
  color = "#0F4C81",
  sub,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  color?: string;
  sub?: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="w-[42px] h-[42px] rounded-[12px] grid place-items-center mb-3" style={{ background: color + "16" }}>
        <Icon className="w-[22px] h-[22px]" style={{ color }} strokeWidth={2.2} />
      </div>
      <div className="font-display text-[28px] font-extrabold text-ink leading-none tracking-[-0.01em]">{value}</div>
      <div className="text-[12.5px] font-medium text-ink-2 mt-1.5">{label}</div>
      {sub && <div className="text-[11.5px] text-ink-2/80 mt-1.5">{sub}</div>}
    </>
  );
  const cls = "block bg-surface border border-line rounded-[18px] p-[18px] shadow-sm";
  return href ? (
    <Link href={href} className={`${cls} ui-card-hover`}>{body}</Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function Panel({
  title,
  sub,
  right,
  children,
  flush = false,
  className = "",
}: {
  title?: React.ReactNode;
  sub?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  flush?: boolean;
  className?: string;
}) {
  return (
    <section className={`bg-surface border border-line rounded-[18px] shadow-sm overflow-hidden ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div className="min-w-0">
            {title && <h2 className="font-display text-[16px] font-bold text-ink leading-tight">{title}</h2>}
            {sub && <p className="text-[12.5px] text-ink-2 mt-0.5">{sub}</p>}
          </div>
          {right}
        </div>
      )}
      <div className={flush ? "" : "p-5"}>{children}</div>
    </section>
  );
}

export function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[13px] font-semibold text-kashmir hover:underline underline-offset-4 whitespace-nowrap">
      {children}
    </Link>
  );
}

const STATUS: Record<string, { label?: string; bg: string; fg: string; dot: string }> = {
  SUBMITTED: { bg: "#FFF4E0", fg: "#B45309", dot: "#F59E0B" },
  REQUESTED: { bg: "#FFF4E0", fg: "#B45309", dot: "#F59E0B" },
  PENDING: { bg: "#FFF4E0", fg: "#B45309", dot: "#F59E0B" },
  UNDER_REVIEW: { bg: "#FFF4E0", fg: "#B45309", dot: "#F59E0B" },
  COUNSELLOR_ASSIGNED: { bg: "#E7EEFF", fg: "#0F4C81", dot: "#0F4C81" },
  CONFIRMED: { bg: "#E7EEFF", fg: "#0F4C81", dot: "#0F4C81" },
  SCHEDULED: { bg: "#E7EEFF", fg: "#0F4C81", dot: "#0F4C81" },
  IN_PROGRESS: { bg: "#E7F7F0", fg: "#067A55", dot: "#10B981" },
  ONGOING: { bg: "#E7F7F0", fg: "#067A55", dot: "#10B981" },
  FOLLOW_UP_REQUIRED: { bg: "#E0F2FE", fg: "#0369A1", dot: "#0EA5E9" },
  RESOLVED: { bg: "#EEF2F7", fg: "#475569", dot: "#94A3B8" },
  COMPLETED: { bg: "#EEF2F7", fg: "#475569", dot: "#94A3B8" },
  ESCALATED: { bg: "#FEE2E2", fg: "#B91C1C", dot: "#EF4444" },
  NO_SHOW: { bg: "#FEE2E2", fg: "#B91C1C", dot: "#EF4444" },
  CANCELLED: { bg: "#F1F5F9", fg: "#64748B", dot: "#CBD5E1" },
};

export function StatusBadge({ status, size = "md" }: { status: string; size?: "sm" | "md" }) {
  const m = STATUS[status] ?? { bg: "#EEF2F7", fg: "#475569", dot: "#94A3B8" };
  const label = m.label ?? status.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${
        size === "sm" ? "px-[9px] py-[3px] text-[11px]" : "px-3 py-[5px] text-[12.5px]"
      }`}
      style={{ background: m.bg, color: m.fg }}
    >
      <span className="w-[7px] h-[7px] rounded-full" style={{ background: m.dot }} />
      {label}
    </span>
  );
}

export function EmptyPanel({ icon: Icon, text, action }: { icon: LucideIcon; text: string; action?: React.ReactNode }) {
  return (
    <div className="text-center px-5 py-10 text-ink-2">
      <Icon className="w-10 h-10 mx-auto text-line" strokeWidth={1.6} />
      <div className="text-[14px] font-medium mt-2.5">{text}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ActionTile({
  icon: Icon,
  label,
  sub,
  href,
  color = "#0F4C81",
}: {
  icon: LucideIcon;
  label: string;
  sub?: string;
  href: string;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 bg-surface border border-line rounded-[18px] p-4 shadow-sm ui-card-hover"
    >
      <span className="w-12 h-12 rounded-[14px] grid place-items-center shrink-0" style={{ background: color + "16" }}>
        <Icon className="w-6 h-6" style={{ color }} strokeWidth={2.1} />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[14.5px] font-bold text-navy leading-tight">{label}</span>
        {sub && <span className="block text-[12.5px] text-ink-2 mt-0.5 leading-snug">{sub}</span>}
      </span>
    </Link>
  );
}
