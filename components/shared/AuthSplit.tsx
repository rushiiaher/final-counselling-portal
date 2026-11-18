import React from "react";
import { GraduationCap, Brain, ShieldCheck, Lock } from "lucide-react";
import { Emblem } from "@/components/layout/SiteNavbar";

const PORTALS = [
  { id: "student", icon: GraduationCap, title: "Students", sub: "Request support, book sessions, track progress", color: "#FF9933" },
  { id: "counsellor", icon: Brain, title: "Counsellors", sub: "Caseload, sessions, notes & follow-ups", color: "#FBBF24" },
  { id: "admin", icon: ShieldCheck, title: "District Admin", sub: "Monitoring, programs & institutions", color: "#4ADE80" },
];

/* Split sign-in layout (design: portal-auth.jsx → LoginScreen) */
export default function AuthSplit({
  heading,
  blurb,
  children,
  active,
}: {
  heading: string;
  blurb: string;
  children: React.ReactNode;
  active?: string | null;
}) {
  return (
    <div className="bg-page px-4 py-8 md:py-14">
      <div className="max-w-[1000px] mx-auto grid md:grid-cols-[1.05fr_1fr] rounded-[22px] overflow-hidden border border-line bg-surface shadow-[0_16px_40px_rgb(11_47_107/0.12)]">
        {/* Brand panel */}
        <div className="relative overflow-hidden text-white px-7 py-9 md:px-11 md:py-12 bg-[linear-gradient(150deg,#00355F,#0F4C81)] flex flex-col justify-center">
          <div className="absolute -right-14 -top-14 w-60 h-60 rounded-full bg-white/6" aria-hidden />
          <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5" aria-hidden />
          <div className="relative">
            <Emblem size={58} light />
            <h2 className="font-display text-[26px] md:text-[30px] font-extrabold tracking-[-0.02em] mt-6 mb-3 text-white">{heading}</h2>
            <p className="text-white/88 text-[14.5px] leading-relaxed max-w-[380px]">{blurb}</p>

            <ul className="mt-7 space-y-2.5 hidden sm:block">
              {PORTALS.map(({ id, icon: Icon, title, sub, color }) => (
                <li key={title} className={`flex items-center gap-3 rounded-[14px] px-3.5 py-3 border transition-opacity ${active === id ? "bg-white/16 border-white/40" : "bg-white/8 border-white/14"} ${active && active !== id ? "opacity-55" : ""}`}>
                  <span className="w-10 h-10 rounded-[11px] bg-white/12 grid place-items-center shrink-0">
                    <Icon className="w-5 h-5" style={{ color }} />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-display font-bold text-[14px]">{title}</span>
                    <span className="block text-[12px] text-white/75 mt-0.5">{sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-8 sm:px-10 md:py-12 flex flex-col justify-center">
          <div className="w-full max-w-[380px] mx-auto">
            {children}
            <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-ink-2 text-center">
              <Lock className="w-3.5 h-3.5 shrink-0" /> Secure login · Counselling records are confidential and access-controlled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
