"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/navigation";
import { signOut } from "next-auth/react";
import { LogOut, MoreHorizontal, X } from "lucide-react";
import { findActiveNav } from "./nav-utils";
import NavIcon from "./NavIcon";

/* Bottom tab bar + "More" sheet for phones (design: app.jsx bottom nav + ui.jsx Sheet) */
export default function MobileSidebar({ navigation }: { navigation: NavItem[] }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const active = findActiveNav(navigation, pathname);
  const primary = navigation.slice(0, 4);
  const moreActive = !!active && !primary.some((p) => p.href === active.href);

  useEffect(() => setMoreOpen(false), [pathname]);

  return (
    <div className="md:hidden">
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-ink/45 backdrop-blur-[2px]"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="bg-surface rounded-t-[26px] px-[18px] pt-2.5 pb-[max(22px,env(safe-area-inset-bottom))] max-h-[86%] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="All sections"
          >
            <div className="w-[38px] h-1 rounded-full bg-line mx-auto mt-1 mb-3.5" />
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-[19px] font-bold text-ink">All sections</h3>
              <button
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-alt grid place-items-center text-ink-2"
                aria-label="Close"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {navigation.map((item) => {
                const on = active?.href === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center gap-2 rounded-[16px] px-2 py-3.5 text-center border ${
                      on ? "bg-navy text-white border-navy" : "bg-page text-ink border-line"
                    }`}
                  >
                    <span className={`w-10 h-10 rounded-[12px] grid place-items-center ${on ? "bg-white/15" : "bg-tint text-kashmir"}`}>
                      <NavIcon item={item} active={on} />
                    </span>
                    <span className="text-[12px] font-semibold leading-tight">{item.title}</span>
                  </Link>
                );
              })}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-4 w-full btn btn-outline !text-danger"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      )}

      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line flex justify-around px-1.5 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgb(15_76_129/0.08)]"
        aria-label="Mobile navigation"
      >
        {primary.map((item) => {
          const on = active?.href === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={on ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 rounded-[14px] min-w-[64px] min-h-[52px] px-1 ${
                on ? "text-navy" : "text-ink-2"
              }`}
            >
              <span className={`grid place-items-center w-12 h-7 rounded-full transition-colors ${on ? "bg-tint" : ""}`}>
                <NavIcon item={item} active={on} size={21} />
              </span>
              <span className={`text-[10.5px] truncate max-w-[72px] ${on ? "font-bold" : "font-medium"}`}>{item.title}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 rounded-[14px] min-w-[64px] min-h-[52px] px-1 ${
            moreActive ? "text-navy" : "text-ink-2"
          }`}
          aria-label="More sections"
        >
          <span className={`grid place-items-center w-12 h-7 rounded-full ${moreActive ? "bg-tint" : ""}`}>
            <MoreHorizontal className="w-[21px] h-[21px]" />
          </span>
          <span className={`text-[10.5px] ${moreActive ? "font-bold" : "font-medium"}`}>More</span>
        </button>
      </nav>
    </div>
  );
}
