"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useSession, signOut } from "next-auth/react";
import { LogOut, ChevronDown, Bell } from "lucide-react";
import { NavItem, PortalRole, portalMeta } from "@/config/navigation";
import { findActiveNav, initialsOf, greetingName } from "./nav-utils";
import { usePageHeader } from "./PageHeader";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* Frosted page header (design: desk-shell.jsx → Topbar) */
export default function TopNavbar({ navigation = [], role = "student" }: { navigation?: NavItem[]; role?: PortalRole }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const meta = portalMeta[role];

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = findActiveNav(navigation, pathname);
  const isDashboard = active?.href.endsWith("/dashboard");
  const firstName = greetingName(session?.user?.name);
  const override = usePageHeader();
  const title = override?.title ?? (isDashboard && firstName ? `${greeting()}, ${firstName}` : active?.title ?? meta.label);
  const subline = override?.sub ?? `${meta.label} · ${today}`;
  const notifItem = navigation.find((n) => n.title === "Notifications");

  return (
    <header className="shrink-0 z-30 bg-white/85 backdrop-blur-md border-b border-line">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <div className="h-[68px] md:h-[76px] flex items-center justify-between gap-4 px-4 md:px-7">
        {/* Mobile brand */}
        <div className="flex items-center gap-2.5 md:hidden min-w-0">
          <span className="w-9 h-9 rounded-[10px] grid place-items-center shrink-0" style={{ background: meta.accent }}>
            <Image src="/design/ashok_stambh.svg" alt="" width={20} height={20} className="w-5 h-5 object-contain brightness-0 invert" />
          </span>
          <span className="leading-tight min-w-0">
            <span className="block font-display font-bold text-[14px] text-ink truncate">{title}</span>
            <span className="block text-[11px] text-ink-2 truncate">{meta.label}</span>
          </span>
        </div>

        {/* Desktop title */}
        <div className="hidden md:block min-w-0">
          <h1 className="font-display text-[21px] font-bold text-ink leading-tight tracking-[-0.01em] truncate">{title}</h1>
          <p className="text-[13px] text-ink-2 mt-0.5 truncate" suppressHydrationWarning>
            {subline}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {override?.right && <div className="hidden md:flex items-center gap-2">{override.right}</div>}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {notifItem && (
            <Link
              href={notifItem.href}
              aria-label="Notifications"
              className="w-10 h-10 rounded-full grid place-items-center text-kashmir bg-surface-alt hover:bg-tint transition-colors"
            >
              <Bell className="w-[19px] h-[19px]" />
            </Link>
          )}

          {/* User menu */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-line bg-surface hover:bg-surface-alt transition"
              aria-label="User menu"
              aria-expanded={open}
            >
              <span
                className="w-8 h-8 rounded-full grid place-items-center text-white font-display font-bold text-xs"
                style={{ background: meta.accent }}
              >
                {initialsOf(session?.user?.name)}
              </span>
              <span className="hidden lg:block text-[13px] font-semibold text-ink max-w-[140px] truncate">
                {session?.user?.name ?? "User"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-2" />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-line rounded-[14px] shadow-lg py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-line">
                  <p className="text-sm font-semibold text-ink truncate">{session?.user?.name}</p>
                  <p className="text-xs text-ink-2 truncate">{session?.user?.email}</p>
                  <span className="tag mt-1.5 capitalize">{String((session?.user as any)?.role ?? "").toLowerCase()}</span>
                </div>
                <Link href="/" className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-ink hover:bg-surface-alt transition">
                  Visit website
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-danger hover:bg-danger-tint transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
