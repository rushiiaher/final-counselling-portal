"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { tr } from "@/lib/student-app/data";

/* Screen ids from the design → real URLs in the student portal */
export const SCREEN_PATH: Record<string, (p?: any) => string> = {
  home: () => "/student/dashboard",
  careers: () => "/student/careers",
  careerDetail: (p) => `/student/careers/${p?.id}`,
  roadmap: (p) => `/student/roadmap${p?.preselect ? `?preselect=${p.preselect}` : ""}`,
  exams: () => "/student/exams",
  examDetail: (p) => `/student/exams/${p?.id}`,
  skills: () => "/student/skills",
  schemes: () => "/student/schemes",
  mentors: () => "/student/mentors",
  stories: () => "/student/stories",
  more: () => "/student/more",
  about: () => "/student/about",
  book: (p) => `/student/talk${p?.concern ? `?concern=${p.concern}` : ""}`,
  mySessions: () => "/student/sessions",
  sessionDetail: (p) => `/student/sessions/${p?.id}`,
};

export type SheetState =
  | null
  | { type: "ai" }
  | { type: "scheme"; data: any }
  | { type: "mentor"; data: any }
  | { type: "confirmed"; data: any };

type Ctx = {
  lang: string;
  setLang: (l: string) => void;
  t: (k: string) => string;
  name: (o: any) => string;
  nav: {
    go: (screen: string, params?: any) => void;
    back: () => void;
    openAI: () => void;
    schemeSheet: (d: any) => void;
    mentorSheet: (d: any) => void;
  };
  sheet: SheetState;
  setSheet: (s: SheetState) => void;
};

const StudentAppCtx = createContext<Ctx | null>(null);

export function StudentAppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [lang, setLangState] = useState("en");
  const [sheet, setSheet] = useState<SheetState>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jk_lang");
      if (saved === "ur" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: string) => {
    setLangState(l);
    try { localStorage.setItem("jk_lang", l); } catch {}
  }, []);

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    t: (k) => tr(lang, k),
    name: (o) => (lang === "ur" ? o.ur : o.en),
    nav: {
      go: (screen, params) => router.push((SCREEN_PATH[screen] || SCREEN_PATH.home)(params)),
      back: () => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push("/student/dashboard");
      },
      openAI: () => setSheet({ type: "ai" }),
      schemeSheet: (data) => setSheet({ type: "scheme", data }),
      mentorSheet: (data) => setSheet({ type: "mentor", data }),
    },
    sheet,
    setSheet,
  }), [lang, setLang, router, sheet]);

  return <StudentAppCtx.Provider value={value}>{children}</StudentAppCtx.Provider>;
}

export function useStudentApp() {
  const v = useContext(StudentAppCtx);
  if (!v) throw new Error("useStudentApp must be used inside StudentAppProvider");
  return v;
}
