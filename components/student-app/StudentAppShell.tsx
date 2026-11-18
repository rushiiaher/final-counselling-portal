"use client";

/* Student app shell — ported from the new design (app.jsx + portal.jsx StudentFrame
   + android-frame.jsx). Phones get the app full-screen; larger screens get the
   design's device frame with a Desktop / Mobile view switch. */

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { StudentAppProvider, useStudentApp } from "./AppContext";
import { THEME, Icon, Sheet, Btn, Chip } from "./ui";
import { AICounselor, MentorBooking } from "./features";
import { NSP_URL } from "@/lib/student-app/data";
import { materialSymbols } from "./iconFont";

const T = THEME;

const TABS = [
  { id: "home", icon: "home", href: "/student/dashboard", labelKey: "home" },
  { id: "careers", icon: "explore", href: "/student/careers", labelKey: "careers" },
  { id: "counsel", icon: "diversity_3", href: "/student/sessions", labelKey: "talk" },
  { id: "scholar", icon: "school", href: "/student/scholarships", labelKey: "scholar" },
  { id: "more", icon: "grid_view", href: "/student/more", labelKey: "more" },
];

/* pathname → [owning tab, title key or literal title] */
function routeInfo(pathname: string): { tab: string; titleKey?: string; title?: string; root: boolean } {
  const p = pathname.replace(/\/$/, "");
  const seg = p.split("/").slice(2); // after /student
  const [a, b] = seg;
  switch (a) {
    case "dashboard": return { tab: "home", root: true };
    case "careers": return { tab: "careers", titleKey: "careersTitle", root: !b };
    case "roadmap": return { tab: "careers", titleKey: "roadmapGen", root: false };
    case "scholarships": return { tab: "scholar", titleKey: "scholarTitle", root: true };
    case "eligibility": return { tab: "scholar", titleKey: "eligibilityChecker", root: false };
    case "exams": return { tab: "home", titleKey: "examTitle", root: false };
    case "skills": return { tab: "more", titleKey: "skillsTitle", root: false };
    case "schemes": return { tab: "more", titleKey: "schemesTitle", root: false };
    case "mentors": return { tab: "more", titleKey: "mentorsTitle", root: false };
    case "stories": return { tab: "more", titleKey: "storiesTitle", root: false };
    case "about": return { tab: "more", titleKey: "aboutTitle", root: false };
    case "more": return { tab: "more", titleKey: "more", root: true };
    case "talk": return { tab: "counsel", titleKey: "talkTitle", root: false };
    case "sessions": return { tab: "counsel", titleKey: "mySessionsTitle", root: !b };
    case "requests": return { tab: "more", title: "My Requests", root: false };
    case "programs": return { tab: "more", title: "Programs", root: false };
    case "counsellors": return { tab: "more", title: "Counsellors", root: false };
    case "appointments": return { tab: "more", title: "Appointments", root: false };
    case "notifications": return { tab: "more", title: "Notifications", root: false };
    case "services": return { tab: "counsel", title: "Request Support", root: false };
    case "onboarding": return { tab: "more", title: "Your profile", root: false };
    default: return { tab: "home", root: false };
  }
}

function GovRibbon() {
  const { t } = useStudentApp();
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ display: "flex", height: 4 }}>
        <div style={{ flex: 1, background: T.saffron }} />
        <div style={{ flex: 1, background: "#fff" }} />
        <div style={{ flex: 1, background: T.green }} />
      </div>
      <div style={{ background: T.primary, color: "#fff", padding: "5px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 17, height: 17, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.7)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <span style={{ font: `700 8px ${T.head}` }}>JK</span>
        </div>
        <span style={{ font: `500 10px ${T.body}`, opacity: 0.92, letterSpacing: 0.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t("govLine")}</span>
      </div>
    </div>
  );
}

const iconBtn: React.CSSProperties = { width: 32, height: 32, borderRadius: 10, background: "#fff", border: `1px solid ${T.outline}`, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 };

function AppHeader({ info }: { info: ReturnType<typeof routeInfo> }) {
  const { t, lang, setLang, nav } = useStudentApp();
  const isHome = info.tab === "home" && info.root;
  const title = info.title ?? t(info.titleKey || "appName");
  return (
    <div style={{ flexShrink: 0, background: "rgba(243,246,253,0.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${T.outline}`, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
      {!info.root ? (
        <button onClick={nav.back} style={iconBtn} aria-label={t("back")}>
          <Icon name={lang === "ur" ? "arrow_forward" : "arrow_back"} size={22} color={T.ink} />
        </button>
      ) : (
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${T.kashmirBlue}, ${T.blueTint})`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name="explore" size={19} color="#fff" fill={1} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/design/portal_logo.png" style={{ height: 26, width: 26, objectFit: "contain" }} alt="" />
        {isHome
          ? <div style={{ font: `700 16px ${T.head}`, color: T.kashmirBlue, letterSpacing: "-0.01em" }}>{t("appName")}</div>
          : <div style={{ font: `700 16px ${T.head}`, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>}
      </div>
      <button onClick={() => setLang(lang === "en" ? "ur" : "en")} aria-label="Change language" style={{
        display: "flex", alignItems: "center", gap: 5, background: "#fff", border: `1px solid ${T.outline}`,
        borderRadius: 999, padding: "6px 12px", cursor: "pointer", font: `600 12px ${T.body}`, color: T.kashmirBlue, flexShrink: 0,
      }}>
        <Icon name="language" size={16} />{t("langName")}
      </button>
    </div>
  );
}

function BottomNav({ activeTab }: { activeTab: string }) {
  const { t } = useStudentApp();
  const router = useRouter();
  return (
    <nav aria-label="Student app" style={{ flexShrink: 0, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderTop: `1px solid ${T.outline}`, display: "flex", padding: "6px 4px 4px" }}>
      {TABS.map((tab) => {
        const on = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => router.push(tab.href)} aria-current={on ? "page" : undefined} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3, padding: "5px 0",
          }}>
            <div style={{ padding: "2px 16px", borderRadius: 999, background: on ? T.blueSoft : "transparent", transition: "background .2s" }}>
              <Icon name={tab.icon} size={23} color={on ? T.kashmirBlue : T.inkSoft} fill={on ? 1 : 0} />
            </div>
            <span style={{ font: `${on ? 700 : 500} 10px ${T.body}`, color: on ? T.kashmirBlue : T.inkSoft }}>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}

function ScholarSheet({ s }: { s: any }) {
  const { t } = useStudentApp();
  const row = (label: string, val: string, tone?: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${T.outline}`, gap: 10 }}>
      <span style={{ font: `500 13px ${T.body}`, color: T.inkSoft }}>{label}</span>
      <span style={{ font: `700 13.5px ${T.head}`, color: tone || T.ink, textAlign: "end", maxWidth: "62%" }}>{val}</span>
    </div>
  );
  return (
    <div>
      <Chip tone="green" style={{ marginBottom: 8 }}>{s.amount}</Chip>
      {row(t("amount"), s.amount, "#067a55")}
      {row("Provider", s.provider)}
      {row(t("deadline"), s.deadline, T.saffronDeep)}
      <div style={{ padding: "11px 0" }}>
        <div style={{ font: `500 13px ${T.body}`, color: T.inkSoft, marginBottom: 5 }}>{t("eligibleLabel")}</div>
        <div style={{ font: `400 14px ${T.body}`, color: T.ink, lineHeight: 1.5 }}>{s.elig}</div>
      </div>
      <Btn full variant="saffron" icon="open_in_new" style={{ marginTop: 8 }} onClick={() => window.open(NSP_URL, "_blank", "noopener,noreferrer")}>{t("apply")}</Btn>
    </div>
  );
}

function AppScreen({ children }: { children: React.ReactNode }) {
  const { t, lang, name, nav, sheet, setSheet } = useStudentApp();
  const pathname = usePathname();
  const info = routeInfo(pathname);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setSheet(null);
  }, [pathname, setSheet]);

  return (
    <div dir={lang === "ur" ? "rtl" : "ltr"} lang={lang} className="student-app" style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative", background: T.bg, overflow: "hidden", fontFamily: T.body, color: T.ink }}>
      <GovRibbon />
      <AppHeader info={info} />

      <main id="main-content" ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative" }}>
        {children}
      </main>

      {/* FAB — AI counsellor (hidden when a sheet is open, and on chat screens) */}
      {!sheet && !pathname.endsWith("/chat") && (
        <button onClick={nav.openAI} aria-label={t("aiCounsel")} style={{
          position: "absolute", bottom: 78, [lang === "ur" ? "left" : "right"]: 16, zIndex: 40,
          width: 56, height: 56, borderRadius: 18, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg, ${T.saffron}, #fbbf24)`, boxShadow: "0 8px 22px rgba(245,158,11,0.45)",
          display: "grid", placeItems: "center",
        }}>
          <Icon name="auto_awesome" size={27} color="#3a2400" fill={1} />
        </button>
      )}

      <BottomNav activeTab={info.tab} />

      {/* SHEETS */}
      <Sheet open={sheet?.type === "ai"} onClose={() => setSheet(null)} title={t("aiCounsel")}>
        <div style={{ height: 460 }}><AICounselor /></div>
      </Sheet>

      <Sheet open={sheet?.type === "scholar"} onClose={() => setSheet(null)} title={sheet?.type === "scholar" ? name(sheet.data) : ""}>
        {sheet?.type === "scholar" && <ScholarSheet s={sheet.data} />}
      </Sheet>

      <Sheet open={sheet?.type === "scheme"} onClose={() => setSheet(null)} title={sheet?.type === "scheme" ? name(sheet.data) : ""}>
        {sheet?.type === "scheme" && (
          <div>
            <p style={{ font: `400 14.5px ${T.body}`, color: T.ink, lineHeight: 1.6 }}>{sheet.data.desc}</p>
            <Btn full variant="saffron" icon="support_agent" style={{ marginTop: 8 }} onClick={() => nav.go("book", { concern: "scholarship" })}>
              Get help applying
            </Btn>
          </div>
        )}
      </Sheet>

      <Sheet open={sheet?.type === "mentor"} onClose={() => setSheet(null)} title={t("bookMentor")}>
        {sheet?.type === "mentor" && (
          <MentorBooking lang={lang} mentor={sheet.data} onConfirm={(slot) => setSheet({ type: "confirmed", data: { ...sheet.data, slot } })} />
        )}
      </Sheet>

      <Sheet open={sheet?.type === "confirmed"} onClose={() => setSheet(null)}>
        {sheet?.type === "confirmed" && (
          <div style={{ textAlign: "center", padding: "10px 6px 4px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.greenSoft, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
              <Icon name="check_circle" size={40} color={T.green} fill={1} />
            </div>
            <h3 style={{ font: `700 19px ${T.head}`, color: T.ink, margin: "0 0 6px" }}>{t("confirmed")}</h3>
            <p style={{ font: `400 13.5px ${T.body}`, color: T.inkSoft, margin: "0 0 6px" }}>{name(sheet.data)} · {sheet.data.slot}</p>
            <p style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft, margin: "0 0 18px" }}>{t("confirmedSub")}</p>
            <Btn full variant="primary" onClick={() => setSheet(null)}>{t("done")}</Btn>
          </div>
        )}
      </Sheet>
    </div>
  );
}

/* Android status bar + gesture pill (design: android-frame.jsx) */
function StatusBar() {
  const [time, setTime] = useState("9:30");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: false }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  const c = "#171d1b";
  return (
    <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", position: "relative", fontFamily: "Roboto, system-ui, sans-serif", flexShrink: 0, background: "#f4fbf8" }}>
      <span style={{ fontSize: 14, color: c }}>{time}</span>
      <div style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)", width: 24, height: 24, borderRadius: 100, background: "#2e2e2e" }} />
      <div style={{ display: "flex", alignItems: "center" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginRight: -2 }}><path d="M8 13.3L.67 5.97a10.37 10.37 0 0114.66 0L8 13.3z" fill={c} /></svg>
        <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginRight: -2 }}><path d="M14.67 14.67V1.33L1.33 14.67h13.34z" fill={c} /></svg>
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3.75" y="2" width="8.5" height="13" rx="1.5" fill={c} /><rect x="5.5" y="0.9" width="5" height="2" rx="0.5" fill={c} /></svg>
      </div>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);
  const [view, setView] = useState<"mobile" | "desktop">("mobile");
  const { status } = useSession();
  const isGuest = status !== "authenticated";

  useEffect(() => {
    try { if (localStorage.getItem("jk_student_view") === "desktop") setView("desktop"); } catch {}
    const mq = window.matchMedia("(min-width: 640px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!wide || view !== "mobile") return;
    const fit = () => {
      const el = ref.current; if (!el) return;
      const w = 412 + 16, h = 892 + 16;
      const s = Math.min(1, (window.innerWidth - 32) / w, (window.innerHeight - 90) / h);
      el.style.transform = `scale(${s})`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [wide, view]);

  const toggle = () => {
    const next = view === "mobile" ? "desktop" : "mobile";
    setView(next);
    try { localStorage.setItem("jk_student_view", next); } catch {}
  };

  if (!wide) {
    return <div style={{ height: "100dvh" }}>{children}</div>;
  }

  const btnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "9px 15px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)",
    color: "#fff", cursor: "pointer", font: `600 13px ${T.body}`, backdropFilter: "blur(6px)",
  };

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 30% 20%, #2a3650 0%, #1a2230 60%, #141a26 100%)", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 18, left: 18, zIndex: 50, display: "flex", gap: view === "desktop" ? 8 : 12, flexDirection: view === "desktop" ? "column" : "row", alignItems: "flex-start", flexWrap: "wrap" }}>
        <button onClick={() => router.push("/")} style={btnStyle}>
          <Icon name="public" size={16} /> Website
        </button>
        {isGuest ? (
          <button onClick={() => router.push(`/login?portal=student&next=${encodeURIComponent(window.location.pathname + window.location.search)}`)} style={btnStyle}>
            <Icon name="login" size={16} /> Sign in
          </button>
        ) : (
          <button onClick={() => signOut({ callbackUrl: "/" })} style={btnStyle}>
            <Icon name="logout" size={16} /> Sign out
          </button>
        )}
        <button onClick={toggle} style={btnStyle}>
          <Icon name={view === "mobile" ? "desktop_windows" : "phone_iphone"} size={16} />
          {view === "mobile" ? "Desktop View" : "Mobile View"}
        </button>
      </div>

      {view === "mobile" ? (
        <div ref={ref} style={{ transformOrigin: "center center" }}>
          <div style={{
            width: 412, height: 892, borderRadius: 18, overflow: "hidden", background: "#f4fbf8",
            border: "8px solid rgba(116,119,117,0.5)", boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
            display: "flex", flexDirection: "column", boxSizing: "border-box",
          }}>
            <StatusBar />
            <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
            <div style={{ height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#f4fbf8" }}>
              <div style={{ width: 108, height: 4, borderRadius: 2, background: "#171d1b", opacity: 0.4 }} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 900, height: "100vh", background: "#fff", boxShadow: "0 0 40px rgba(0,0,0,0.5)", position: "relative", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function StudentAppShell({ children }: { children: React.ReactNode }) {
  return (
    <StudentAppProvider>
      <div className={materialSymbols.variable} style={{ display: "contents" }}>
        <Frame>
          <AppScreen>{children}</AppScreen>
        </Frame>
      </div>
    </StudentAppProvider>
  );
}
