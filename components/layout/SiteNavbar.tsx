"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, LogIn, CalendarCheck } from "lucide-react";
import { BOOK_SESSION_HREF } from "@/lib/booking";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Find Counsellor", href: "/counselors" },
  { label: "Self Assessment", href: "/assessments" },
  { label: "Wellness Hub", href: "/wellness" },
  { label: "Contact", href: "/contact" },
];

const FONT_STEPS = [
  { label: "A-", size: "93.75%", cls: "text-[9px]" },
  { label: "A", size: "100%", cls: "text-[11px]" },
  { label: "A+", size: "112.5%", cls: "text-[12px]" },
];

/* Ashoka emblem in a ring (design: landing.jsx → Emblem) */
export function Emblem({ size = 46, light = false }: { size?: number; light?: boolean }) {
  return (
    <span
      className={`grid place-items-center rounded-full shrink-0 border-2 ${
        light ? "border-white/75 bg-white/8" : "border-navy-deep bg-white"
      }`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/design/ashok_stambh.svg"
        alt="State Emblem of India"
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        className={`object-contain ${light ? "brightness-0 invert" : ""}`}
        style={{ width: size * 0.6, height: size * 0.6 }}
      />
    </span>
  );
}

/* Tricolour + navy government utility bar (design: landing.jsx → GovUtilityBar) */
export function GovUtilityBar() {
  const [fs, setFs] = useState(1);

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_STEPS[fs].size;
  }, [fs]);

  return (
    <div>
      <div className="h-[5px] bg-[linear-gradient(90deg,#FF9933_0_33.33%,#fff_33.33%_66.66%,#138808_66.66%_100%)]" aria-hidden />
      <div className="bg-navy-deep text-white">
        <div className="page-container flex items-center justify-between gap-3 py-1.5 text-[11px] sm:text-[12px]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold truncate">
              <span lang="hi">भारत सरकार</span> · Government of India
            </span>
            <span className="opacity-40 hidden md:inline">|</span>
            <span className="opacity-85 hidden md:inline truncate">
              <span lang="hi">जम्मू और कश्मीर प्रशासन</span> · J&amp;K Administration
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 font-semibold">
              <Phone className="w-3.5 h-3.5" /> Helpline 1800-XXX-XXXX
            </span>
            <span className="opacity-30 hidden sm:inline">|</span>
            <a href="#main-content" className="hidden lg:inline text-white/85 hover:text-white font-medium">
              Skip to main
            </a>
            <span className="inline-flex items-center gap-1" role="group" aria-label="Text size">
              {FONT_STEPS.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => setFs(i)}
                  aria-pressed={fs === i}
                  aria-label={`Text size ${f.label}`}
                  className={`w-[24px] h-[22px] rounded-[5px] border border-white/30 font-bold leading-none ${f.cls} ${
                    fs === i ? "bg-saffron text-saffron-ink border-saffron" : "text-white hover:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Desktop nav shows from 1100px; below that the compact header + menu panel is used. */
export default function SiteNavbar(_props: { onBookClick?: () => void } = {}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    setPanelTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);


  return (
    <>

      <GovUtilityBar />

      {/* ROW 1 — branding (sticky on small screens, static on desktop) */}
      <div
        ref={headerRef}
        className="bg-surface border-b border-line sticky top-0 z-40 min-[1100px]:static"
      >
        <div className="page-container flex items-center justify-between gap-3 py-2.5 sm:py-3">
          <Link href="/" className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 rounded-[10px]">
            <span className="sm:hidden"><Emblem size={40} /></span>
            <span className="hidden sm:inline-flex"><Emblem size={50} /></span>

            <span className="min-w-0 flex flex-col">
              <h1
                className="sm:hidden font-display font-extrabold text-navy-deep leading-tight line-clamp-2 tracking-[-0.01em]"
                style={{ fontSize: "clamp(12px, 3.6vw, 15px)" }}
              >
                YOUTH DIGITAL COUNSELLING &amp; GUIDANCE PORTAL
              </h1>
              <h1 className="hidden sm:block font-display font-extrabold text-navy-deep leading-tight tracking-[-0.01em] text-[17px] md:text-[19px] lg:text-[21px] truncate">
                YOUTH DIGITAL COUNSELLING &amp; GUIDANCE PORTAL
              </h1>
              <span lang="hi" className="hidden sm:block text-[12.5px] leading-snug text-ink-2 font-medium truncate mt-0.5">
                जिला श्रीनगर–अनंतनाग छात्र एवं युवा डिजिटल परामर्श एवं मार्गदर्शन पोर्टल
              </span>
            </span>
          </Link>

          {/* Partner logos (Digital India + district emblem) */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <span className="relative block w-[88px] h-[45px]">
              <Image src="/digital-india.png" alt="Digital India" fill sizes="88px" className="object-contain" priority />
            </span>
            <span aria-hidden className="w-px h-10 bg-line" />
            <span className="relative block w-[134px] h-[45px] lg:w-[164px] lg:h-[55px]">
              <Image src="/logo.png" alt="Logo" fill sizes="164px" className="object-contain object-right" priority />
            </span>
          </div>

          {/* Menu button (below 1100px) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="min-[1100px]:hidden inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-[12px] border border-line text-navy hover:bg-surface-alt transition-colors duration-150"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ROW 2 — navigation (desktop, sticky) */}
      <nav
        aria-label="Main"
        className="hidden min-[1100px]:block bg-surface border-b border-line sticky top-0 z-40 shadow-[0_2px_10px_rgb(11_47_107/0.05)]"
      >
        <div className="page-container flex items-center gap-1">
          <ul className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex items-center h-[54px] px-2.5 xl:px-3 text-[13.5px] xl:text-[14px] whitespace-nowrap transition-colors duration-150 ${
                      active ? "text-navy-deep font-bold" : "text-ink-2 font-medium hover:text-navy"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={`absolute left-2.5 right-2.5 xl:left-3 xl:right-3 bottom-3 h-[2px] rounded-full bg-saffron transition-opacity ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="ml-auto flex items-center gap-2 pl-2">
            <Link href={BOOK_SESSION_HREF} className="btn btn-saffron !min-h-[40px]">
              <CalendarCheck className="w-4 h-4" /> Book Session
            </Link>
            <Link href="/login" className="btn btn-primary !min-h-[40px]">
              <LogIn className="w-4 h-4" /> Login
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU — full-screen panel under the header */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="min-[1100px]:hidden fixed inset-x-0 bottom-0 z-40 bg-surface flex flex-col"
          style={{ top: panelTop }}
        >
          <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-3">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 h-[50px] px-4 rounded-[12px] text-[15px] transition-colors duration-150 ${
                        active ? "bg-tint text-navy font-bold" : "text-ink font-medium hover:bg-surface-alt"
                      }`}
                    >
                      <span className={`w-1 h-5 rounded-full ${active ? "bg-saffron" : "bg-transparent"}`} aria-hidden />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-line p-4 flex flex-col gap-2 pb-[max(16px,env(safe-area-inset-bottom))]">
            <Link
              href={BOOK_SESSION_HREF}
              onClick={() => setMobileOpen(false)}
              className="btn btn-saffron w-full"
            >
              <CalendarCheck className="w-4 h-4" /> Book Session
            </Link>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full">
              <LogIn className="w-4 h-4" /> Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
