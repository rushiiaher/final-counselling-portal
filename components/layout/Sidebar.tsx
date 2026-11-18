"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem, PortalRole, ShellUserInfo, portalMeta } from "@/config/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { findActiveNav, initialsOf } from "./nav-utils";
import NavIcon, { MaterialIcon } from "./NavIcon";

/* Dark-navy desk sidebar (design: desk-shell.jsx → DeskShell) */
export default function Sidebar({ navigation, role, userInfo }: { navigation: NavItem[]; role: PortalRole; userInfo?: ShellUserInfo }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const meta = portalMeta[role];
  const active = findActiveNav(navigation, pathname);
  const sub = userInfo?.sub || String((session?.user as any)?.role ?? "").toLowerCase();

  return (
    <aside className="hidden md:flex flex-col w-[248px] shrink-0 bg-navy text-white h-full px-3.5 py-5">
      {/* Portal identity */}
      <Link
        href="/"
        className="flex items-center gap-[11px] px-2 pb-[18px] border-b border-white/12 rounded-[10px]"
        aria-label="Go to website home"
      >
        <span className="w-[38px] h-[38px] rounded-[11px] grid place-items-center shrink-0" style={{ background: meta.accent }}>
          {meta.mi ? (
            <MaterialIcon name={meta.mi} size={21} fill />
          ) : (
            <Image src="/design/ashok_stambh.svg" alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain brightness-0 invert" />
          )}
        </span>
        <span className="leading-tight min-w-0">
          <span className="block font-display font-bold text-[14px] truncate">{meta.label}</span>
          <span className="block text-[11px] text-white/70 truncate">{meta.sub}</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-4 flex flex-col gap-[3px]" aria-label="Main navigation">
        {navigation.map((item) => {
          const on = active?.href === item.href;
          const count = item.badge ? userInfo?.badges?.[item.badge] ?? 0 : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={on ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-[11px] rounded-[11px] text-[13.5px] transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                on ? "bg-white/14 text-white font-semibold" : "text-white/72 font-medium hover:bg-white/8 hover:text-white"
              }`}
            >
              <NavIcon item={item} active={on} />
              <span className="flex-1 truncate">{item.title}</span>
              {count > 0 && (
                <span className="bg-amber text-saffron-ink text-[10px] font-bold rounded-full px-[7px] py-[2px]" aria-label={`${count} pending`}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + switch portal */}
      <div className="border-t border-white/12 pt-3.5 mt-2.5">
        {session?.user && (
          <div className="flex items-center gap-2.5 px-1.5 pb-3">
            <span
              className="w-9 h-9 rounded-full grid place-items-center font-display font-bold text-[13px] shrink-0"
              style={{ background: meta.accent }}
            >
              {initialsOf(session.user.name)}
            </span>
            <span className="leading-tight min-w-0">
              <span className="block text-[12.5px] font-semibold truncate">{session.user.name}</span>
              <span className={`block text-[11px] text-white/65 truncate ${userInfo?.sub ? "" : "capitalize"}`}>{sub}</span>
            </span>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/#portals" })}
          className="flex items-center gap-[9px] w-full px-3 py-[9px] rounded-[10px] border border-white/18 text-white/80 text-[12.5px] font-semibold hover:bg-white/8 hover:text-white transition-colors"
        >
          <LogOut className="w-[17px] h-[17px]" /> Switch portal
        </button>
      </div>
    </aside>
  );
}
