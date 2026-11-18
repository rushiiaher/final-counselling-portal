"use client";

/* Student app screens — ported from the new design
   (screens-home.jsx + screens-sections.jsx). */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  THEME, Icon, Card, Chip, Btn, Photo, Avatar, SectionHead, Page, HScroll, SecIntro, FilterRow, blkH, chipBtn,
} from "./ui";
import { useStudentApp } from "./AppContext";
import { DATA, NSP_URL } from "@/lib/student-app/data";
import { EligibilityChecker, RoadmapGenerator } from "./features";

const T = THEME;
const D = DATA;

/* ---------- Home ---------- */
export function HomeScreen() {
  const { t, name, nav, lang } = useStudentApp();
  const [q, setQ] = useState("");

  return (
    <Page>
      {/* HERO */}
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", marginBottom: 22, boxShadow: "0 14px 36px rgba(15,76,129,0.22)" }}>
        <Photo src="/design/kashmir_students.png" label="Kashmiri students, Srinagar library" rounded={0}
          style={{ position: "absolute", inset: 0, height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,53,95,0.45) 0%, rgba(0,53,95,0.82) 78%)` }} />
        <div style={{ position: "relative", padding: "22px 18px 18px", color: "#fff" }}>
          <Chip tone="ghost" style={{ backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <Icon name="verified" size={13} fill={1} color={T.saffron} /> {t("welcome")} · خوش آمدید
          </Chip>
          <h1 style={{ font: `700 30px ${T.head}`, lineHeight: 1.12, letterSpacing: "-0.02em", margin: "12px 0 8px", whiteSpace: "pre-line", color: "#fff" }}>
            {t("heroTitle")}
          </h1>
          <p style={{ font: `400 14px ${T.body}`, opacity: 0.92, margin: 0, maxWidth: 320, lineHeight: 1.5 }}>{t("heroSub")}</p>
          {/* search */}
          <form
            onSubmit={(e) => { e.preventDefault(); nav.go("careers"); }}
            style={{ marginTop: 16, display: "flex", gap: 8, background: "rgba(255,255,255,0.96)", borderRadius: 14, padding: 7, boxShadow: "0 8px 20px rgba(0,0,0,0.18)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, paddingInlineStart: 8, minWidth: 0 }}>
              <Icon name="search" size={20} color={T.inkSoft} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPh")} aria-label={t("searchPh")}
                style={{ border: "none", outline: "none", background: "transparent", font: `400 14px ${T.body}`, color: T.ink, width: "100%", minWidth: 0 }} />
            </div>
            <button type="submit" style={{ background: T.saffron, color: "#3a2400", border: "none", borderRadius: 10, padding: "0 16px", font: `600 14px ${T.body}`, cursor: "pointer" }}>{t("explore")}</button>
          </form>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
        {D.QUICK.map((a: any) => (
          <button key={a.to} onClick={() => nav.go(a.to)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: T.surface, boxShadow: "0 4px 14px rgba(15,76,129,0.1)", display: "grid", placeItems: "center", border: `1px solid ${T.outline}` }}>
              <Icon name={a.mi || a.icon} size={26} color={T.kashmirBlue} />
            </div>
            <span style={{ font: `600 11.5px ${T.body}`, color: T.ink, textAlign: "center" }}>{name(a)}</span>
          </button>
        ))}
      </div>

      {/* TALK TO A COUNSELLOR — headline CTA */}
      <div role="button" tabIndex={0} onClick={() => nav.go("book")} onKeyDown={(e) => e.key === "Enter" && nav.go("book")} style={{
        display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 20, marginBottom: 24, cursor: "pointer",
        background: `linear-gradient(120deg, ${T.kashmirBlue}, ${T.blueTint})`, color: "#fff",
        boxShadow: "0 10px 26px rgba(15,76,129,0.28)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", insetInlineEnd: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ width: 50, height: 50, borderRadius: 15, background: "rgba(245,158,11,0.22)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name="diversity_3" size={28} color={T.saffron} fill={1} />
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ font: `700 17px ${T.head}` }}>{t("counselCta")}</div>
          <div style={{ font: `400 12.5px ${T.body}`, opacity: 0.88, marginTop: 2 }}>{t("counselCtaSub")}</div>
        </div>
        <Icon name={lang === "ur" ? "arrow_back" : "arrow_forward"} size={22} color={T.saffron} />
      </div>

      {/* PATHWAYS */}
      <SectionHead title={t("pathways")} sub={t("pathwaysSub")} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {D.PATHWAYS.map((p: any) => (
          <Card key={p.en} accent={p.accent} onClick={() => nav.go("careers")} pad={15}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 50, height: 50, borderRadius: 15, flexShrink: 0, display: "grid", placeItems: "center", background: p.accent ? T.saffronSoft : T.blueSoft }}>
                <Icon name={p.icon} size={26} color={p.accent ? T.saffronDeep : T.kashmirBlue} fill={1} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <strong style={{ font: `700 16px ${T.head}`, color: T.ink }}>{name(p)}</strong>
                  {p.accent && <Chip tone="saffron">Start here</Chip>}
                </div>
                <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "3px 0 0" }}>{lang === "ur" ? p.descUr : p.descEn}</p>
              </div>
              <Icon name={lang === "ur" ? "chevron_left" : "chevron_right"} size={22} color={T.outline} />
            </div>
          </Card>
        ))}
      </div>

      {/* AI BANNER */}
      <div role="button" tabIndex={0} onClick={nav.openAI} onKeyDown={(e) => e.key === "Enter" && nav.openAI()} style={{
        display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 20, marginBottom: 26, cursor: "pointer",
        background: `linear-gradient(120deg, ${T.primary}, ${T.kashmirBlue})`, color: "#fff",
        boxShadow: "0 10px 26px rgba(15,76,129,0.28)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(245,158,11,0.25)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name="auto_awesome" size={26} color={T.saffron} fill={1} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: `700 16px ${T.head}` }}>{t("aiCounsel")}</div>
          <div style={{ font: `400 12.5px ${T.body}`, opacity: 0.85 }}>{t("askAi")}</div>
        </div>
        <Icon name={lang === "ur" ? "arrow_back" : "arrow_forward"} size={22} color={T.saffron} />
      </div>

      {/* CAREER EXPLORER */}
      <SectionHead title={t("careersTitle")} sub={t("careersSub")} action={t("viewAll")} onAction={() => nav.go("careers")} />
      <HScroll>
        {D.CAREERS.slice(0, 6).map((c: any) => (
          <div key={c.id} style={{ scrollSnapAlign: "start", flexShrink: 0, width: 150 }}>
            <Card pad={14} onClick={() => nav.go("careerDetail", { id: c.id })} style={{ height: 158, display: "flex", flexDirection: "column" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: T.blueSoft, display: "grid", placeItems: "center", marginBottom: 10 }}>
                <Icon name={c.mi || c.icon} size={24} color={T.kashmirBlue} fill={1} />
              </div>
              <strong style={{ font: `700 14.5px ${T.head}`, color: T.ink, lineHeight: 1.2 }}>{name(c)}</strong>
              <div style={{ marginTop: "auto" }}><Chip tone="green">{c.tag}</Chip></div>
            </Card>
          </div>
        ))}
      </HScroll>

      {/* SCHOLARSHIPS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("scholarTitle")} sub={t("scholarSub")} action={t("viewAll")} onAction={() => nav.go("scholar")} />
        {D.SCHOLARSHIPS.slice(0, 2).map((s: any) => (
          <Card key={s.id} pad={14} style={{ marginBottom: 10 }} onClick={() => nav.scholarSheet(s)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
              <strong style={{ font: `700 14.5px ${T.head}`, color: T.ink }}>{name(s)}</strong>
              <Chip tone="green">{s.amount}</Chip>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: `500 12px ${T.body}`, color: T.inkSoft }}>
              <Icon name="schedule" size={15} /> {t("deadline")}: {s.deadline}
            </div>
          </Card>
        ))}
        <Btn full variant="ghost" icon="checklist" onClick={() => nav.go("eligibility")} style={{ marginTop: 4 }}>{t("eligibilityChecker")}</Btn>
      </div>

      {/* EXAMS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("examTitle")} sub={t("examSub")} action={t("viewAll")} onAction={() => nav.go("exams")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {D.EXAMS.slice(0, 6).map((e: any) => (
            <Card key={e.id} pad={12} onClick={() => nav.go("examDetail", { id: e.id })} style={{ textAlign: "center" }}>
              <div style={{ font: `700 16px ${T.head}`, color: T.kashmirBlue }}>{e.code}</div>
              <div style={{ font: `500 10.5px ${T.body}`, color: T.inkSoft, marginTop: 3 }}>{e.level}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* SKILLS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("skillsTitle")} sub={t("skillsSub")} action={t("viewAll")} onAction={() => nav.go("skills")} />
        <HScroll>
          {D.SKILLS.slice(0, 5).map((s: any) => (
            <div key={s.id} style={{ scrollSnapAlign: "start", flexShrink: 0, width: 140 }}>
              <Card pad={13} style={{ height: 130 }}>
                <Icon name={s.icon} size={26} color={T.saffronDeep} fill={1} />
                <strong style={{ font: `700 13.5px ${T.head}`, color: T.ink, display: "block", marginTop: 10, lineHeight: 1.2 }}>{name(s)}</strong>
                <div style={{ font: `500 11px ${T.body}`, color: T.inkSoft, marginTop: 5 }}>{s.dur} · {s.mode}</div>
              </Card>
            </div>
          ))}
        </HScroll>
      </div>

      {/* MENTORS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("mentorsTitle")} sub={t("mentorsSub")} action={t("viewAll")} onAction={() => nav.go("mentors")} />
        <HScroll>
          {D.MENTORS.slice(0, 4).map((m: any) => (
            <div key={m.id} style={{ scrollSnapAlign: "start", flexShrink: 0, width: 168 }}>
              <Card pad={14} onClick={() => nav.mentorSheet(m)} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Avatar init={m.init} size={52} tone="saffron" /></div>
                <strong style={{ font: `700 14px ${T.head}`, color: T.ink, display: "block" }}>{name(m)}</strong>
                <div style={{ font: `400 11.5px ${T.body}`, color: T.inkSoft, margin: "2px 0 8px" }}>{m.role}</div>
                <Chip tone="saffron">★ {m.rating}</Chip>
              </Card>
            </div>
          ))}
        </HScroll>
      </div>

      {/* SUCCESS STORY (featured) */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("storiesTitle")} sub={t("storiesSub")} action={t("viewAll")} onAction={() => nav.go("stories")} />
        <Card pad={0} onClick={() => nav.go("stories")} style={{ overflow: "hidden" }}>
          <Photo src="/design/kashmir_teacher.png" label="Student, Srinagar" rounded={0} style={{ height: 150 }} />
          <div style={{ padding: 16 }}>
            <p style={{ font: `500 15px ${T.head}`, color: T.ink, margin: "0 0 10px", lineHeight: 1.4 }}>&ldquo;{D.STORIES[0].quote}&rdquo;</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar init={D.STORIES[0].init} size={36} />
              <div>
                <div style={{ font: `700 13.5px ${T.head}`, color: T.ink }}>{name(D.STORIES[0])}</div>
                <div style={{ font: `400 12px ${T.body}`, color: T.inkSoft }}>{D.STORIES[0].achievement} · {D.STORIES[0].district}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* NEWS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("newsTitle")} />
        <Card pad={4}>
          {D.NEWS.map((n: any, i: number) => (
            <div key={n.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 12px", borderBottom: i < D.NEWS.length - 1 ? `1px solid ${T.outline}` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: T.saffron, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `600 13.5px ${T.body}`, color: T.ink, lineHeight: 1.3 }}>{name(n)}</div>
                <div style={{ font: `400 11.5px ${T.body}`, color: T.inkSoft, marginTop: 2 }}>{n.tag} · {n.date}</div>
              </div>
              <Icon name={lang === "ur" ? "chevron_left" : "chevron_right"} size={20} color={T.outline} />
            </div>
          ))}
        </Card>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 28, textAlign: "center", padding: "20px 0 4px" }}>
        <div style={{ font: `700 14px ${T.head}`, color: T.kashmirBlue }}>{t("appName")}</div>
        <p style={{ font: `400 11.5px ${T.body}`, color: T.inkSoft, margin: "6px auto 0", maxWidth: 280, lineHeight: 1.5 }}>
          © 2026 J&amp;K Youth Empowerment &amp; Career Guidance Department. {t("govLine")}
        </p>
      </div>
    </Page>
  );
}

/* ---------- Careers ---------- */
export function CareersScreen() {
  const { t, name, nav } = useStudentApp();
  return (
    <Page>
      <SecIntro title={t("careersTitle")} sub={t("careersSub")} />
      <Btn full variant="saffron" icon="route" onClick={() => nav.go("roadmap")} style={{ marginBottom: 16 }}>{t("roadmapGen")}</Btn>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {D.CAREERS.map((c: any) => (
          <Card key={c.id} pad={14} onClick={() => nav.go("careerDetail", { id: c.id })} style={{ display: "flex", flexDirection: "column", minHeight: 150 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: T.blueSoft, display: "grid", placeItems: "center", marginBottom: 10 }}>
              <Icon name={c.mi || c.icon} size={24} color={T.kashmirBlue} fill={1} />
            </div>
            <strong style={{ font: `700 14.5px ${T.head}`, color: T.ink, lineHeight: 1.2 }}>{name(c)}</strong>
            <p style={{ font: `400 11.5px ${T.body}`, color: T.inkSoft, margin: "5px 0 0", lineHeight: 1.35, flex: 1 }}>{c.desc}</p>
            <div style={{ marginTop: 10 }}><Chip tone="green">{c.tag}</Chip></div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

export function CareerDetail({ id }: { id: string }) {
  const { t, name, nav } = useStudentApp();
  const c = D.CAREERS.find((x: any) => x.id === id);
  if (!c) return <NotFound />;
  return (
    <Page>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 8 }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: `linear-gradient(135deg, ${T.kashmirBlue}, ${T.blueTint})`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name={c.mi || c.icon} size={30} color="#fff" fill={1} />
        </div>
        <div>
          <h1 style={{ font: `700 22px ${T.head}`, color: T.ink, margin: 0 }}>{name(c)}</h1>
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}><Chip tone="green">{c.tag}</Chip><Chip tone="saffron">{t("avgPay")}: {c.pay}</Chip></div>
        </div>
      </div>
      <p style={{ font: `400 15px ${T.body}`, color: T.inkSoft, lineHeight: 1.55, margin: "14px 0 20px" }}>{c.desc}</p>

      <h3 style={blkH}>{t("prep")}</h3>
      <Card pad={16} style={{ marginBottom: 20 }}>
        {c.roadmap.map((step: string, i: number) => (
          <div key={i} style={{ display: "flex", gap: 13, position: "relative", paddingBottom: i === c.roadmap.length - 1 ? 0 : 18 }}>
            {i < c.roadmap.length - 1 && <div style={{ position: "absolute", insetInlineStart: 12, top: 26, bottom: 0, width: 2, background: T.outline }} />}
            <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, zIndex: 1, background: T.blueSoft, border: `2px solid ${T.kashmirBlue}`, color: T.kashmirBlue, display: "grid", placeItems: "center", font: `700 12px ${T.head}` }}>{i + 1}</div>
            <div style={{ font: `500 14px ${T.body}`, color: T.ink, paddingTop: 3 }}>{step}</div>
          </div>
        ))}
      </Card>

      {c.exams.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <h3 style={blkH}>{t("relatedExams")}</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {c.exams.map((e: string) => {
              const ex = D.EXAMS.find((x: any) => x.code === e || x.code.startsWith(e));
              return <button key={e} onClick={() => ex && nav.go("examDetail", { id: ex.id })} style={chipBtn()}>{e}</button>;
            })}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 22 }}>
        <h3 style={blkH}>{t("keySkills")}</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {c.skills.map((s: string) => <Chip key={s} tone="blue">{s}</Chip>)}
        </div>
      </div>

      <Btn full variant="saffron" icon="route" onClick={() => nav.go("roadmap", { preselect: c.id })}>{t("roadmapGen")}</Btn>
    </Page>
  );
}

/* ---------- Scholarships ---------- */
export function ScholarScreen() {
  const { t, name, nav, lang } = useStudentApp();
  const [f, setF] = useState("all");
  const list = D.SCHOLARSHIPS.filter((s: any) => f === "all" || s.cat === f);
  return (
    <Page>
      <SecIntro title={t("scholarTitle")} sub={t("scholarSub")} />
      <div role="button" tabIndex={0} onClick={() => nav.go("eligibility")} onKeyDown={(e) => e.key === "Enter" && nav.go("eligibility")} style={{ display: "flex", gap: 12, alignItems: "center", padding: 14, borderRadius: 18, marginBottom: 16, cursor: "pointer", background: `linear-gradient(120deg, ${T.saffron}, #fbbf24)`, color: "#3a2400", boxShadow: "0 8px 22px rgba(245,158,11,0.32)" }}>
        <Icon name="checklist" size={28} fill={1} />
        <div style={{ flex: 1 }}>
          <div style={{ font: `700 15px ${T.head}` }}>{t("eligibilityChecker")}</div>
          <div style={{ font: `400 12px ${T.body}`, opacity: 0.8 }}>Match in 5 questions</div>
        </div>
        <Icon name={lang === "ur" ? "arrow_back" : "arrow_forward"} size={22} />
      </div>
      <FilterRow items={D.SCHOLAR_FILTERS} value={f} onChange={setF} lang={lang} />
      {list.map((s: any) => (
        <Card key={s.id} pad={15} style={{ marginBottom: 12 }} onClick={() => nav.scholarSheet(s)}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
            <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>{name(s)}</strong>
            <Chip tone="green">{s.amount}</Chip>
          </div>
          <div style={{ font: `500 12px ${T.body}`, color: T.inkSoft, marginBottom: 8 }}>{s.provider}</div>
          <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "0 0 10px", lineHeight: 1.45 }}>{s.elig}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, font: `600 12px ${T.body}`, color: T.saffronDeep }}><Icon name="schedule" size={15} />{s.deadline}</span>
            <span onClick={(e) => e.stopPropagation()}>
              <Btn size="sm" variant="light" onClick={() => window.open(NSP_URL, "_blank", "noopener,noreferrer")}>{t("apply")}</Btn>
            </span>
          </div>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Exams ---------- */
export function ExamsScreen() {
  const { t, name, nav } = useStudentApp();
  return (
    <Page>
      <SecIntro title={t("examTitle")} sub={t("examSub")} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {D.EXAMS.map((e: any) => (
          <Card key={e.id} pad={15} onClick={() => nav.go("examDetail", { id: e.id })} style={{ minHeight: 110 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
              <div style={{ font: `700 19px ${T.head}`, color: T.kashmirBlue }}>{e.code}</div>
              <Chip tone="blue">{e.level}</Chip>
            </div>
            <div style={{ font: `600 13px ${T.body}`, color: T.ink, marginTop: 8, lineHeight: 1.3 }}>{name(e)}</div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

export function ExamDetail({ id }: { id: string }) {
  const { t, name } = useStudentApp();
  const e = D.EXAMS.find((x: any) => x.id === id);
  if (!e) return <NotFound />;
  const block = (title: string, items: string[], icon: string, ordered: boolean) => (
    <div style={{ marginBottom: 18 }}>
      <h3 style={blkH}><Icon name={icon} size={18} color={T.kashmirBlue} style={{ verticalAlign: "-3px", marginInlineEnd: 6 }} />{title}</h3>
      <Card pad={14}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 0" }}>
            {ordered
              ? <span style={{ font: `700 12px ${T.head}`, color: "#fff", background: T.saffron, borderRadius: 99, minWidth: 20, height: 20, display: "grid", placeItems: "center", flexShrink: 0 }}>{i + 1}</span>
              : <span style={{ width: 6, height: 6, borderRadius: 99, background: T.kashmirBlue, marginTop: 7, flexShrink: 0 }} />}
            <span style={{ font: `400 13.5px ${T.body}`, color: T.ink, lineHeight: 1.45 }}>{it}</span>
          </div>
        ))}
      </Card>
    </div>
  );
  return (
    <Page>
      <h1 style={{ font: `700 26px ${T.head}`, color: T.kashmirBlue, margin: "0 0 4px" }}>{e.code}</h1>
      <div style={{ font: `600 16px ${T.head}`, color: T.ink }}>{name(e)}</div>
      <div style={{ marginTop: 10, marginBottom: 18 }}>
        <Chip tone="blue">{e.level}</Chip>
      </div>
      <div style={{ marginBottom: 18 }}>
        <h3 style={blkH}>{t("eligibleLabel")}</h3>
        <Card pad={14}><span style={{ font: `400 14px ${T.body}`, color: T.ink, lineHeight: 1.5 }}>{e.elig}</span></Card>
      </div>
      {block(t("syllabus"), e.syllabus, "menu_book", false)}
      {block(t("prep"), e.prep, "flag", true)}
      {block(t("resources"), e.res, "library_books", false)}
    </Page>
  );
}

/* ---------- Skills ---------- */
export function SkillsScreen() {
  const { t, name } = useStudentApp();
  return (
    <Page>
      <SecIntro title={t("skillsTitle")} sub={t("skillsSub")} />
      <Photo src="/design/kashmir_workshop.png" label="Skills workshop, Kashmir" style={{ height: 150, marginBottom: 18 }} />
      {D.SKILLS.map((s: any) => (
        <Card key={s.id} pad={14} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: T.saffronSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name={s.icon} size={26} color={T.saffronDeep} fill={1} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>{name(s)}</strong>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                <Chip tone="blue">{s.dur}</Chip><Chip tone="green">{s.mode}</Chip><Chip tone="saffron">{s.level}</Chip>
              </div>
              <div style={{ font: `400 11.5px ${T.body}`, color: T.inkSoft, marginTop: 6 }}>by {s.provider}</div>
            </div>
          </div>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Government Schemes ---------- */
export function SchemesScreen() {
  const { t, name, nav, lang } = useStudentApp();
  const [f, setF] = useState("all");
  const list = D.SCHEMES.filter((s: any) => f === "all" || s.cat.includes(f));
  return (
    <Page>
      <SecIntro title={t("schemesTitle")} sub={t("schemesSub")} />
      <FilterRow items={D.SCHEME_FILTERS} value={f} onChange={setF} lang={lang} />
      {list.map((s: any) => (
        <Card key={s.id} pad={15} style={{ marginBottom: 12 }} onClick={() => nav.schemeSheet(s)}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: T.greenSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="verified_user" size={22} color="#067a55" fill={1} />
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>{name(s)}</strong>
              <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "4px 0 0", lineHeight: 1.45 }}>{s.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Mentors ---------- */
export function MentorsScreen() {
  const { t, name, nav } = useStudentApp();
  return (
    <Page>
      <SecIntro title={t("mentorsTitle")} sub={t("mentorsSub")} />
      {D.MENTORS.map((m: any) => (
        <Card key={m.id} pad={15} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Avatar init={m.init} size={54} tone="saffron" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>{name(m)}</strong>
              <div style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft }}>{m.role}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                <Chip tone="blue">{m.expertise}</Chip>
                <Chip tone="green"><Icon name="location_on" size={12} fill={1} />{m.district}</Chip>
                <Chip tone="saffron">★ {m.rating}</Chip>
              </div>
            </div>
          </div>
          <Btn full variant="saffron" icon="calendar_month" onClick={() => nav.mentorSheet(m)} style={{ marginTop: 12 }}>{t("bookMentor")}</Btn>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Success Stories ---------- */
export function StoriesScreen() {
  const { t, name } = useStudentApp();
  const photos = ["/design/kashmir_teacher.png", "/design/kashmir_workshop.png", null, "/design/kashmir_students.png", null];
  return (
    <Page>
      <SecIntro title={t("storiesTitle")} sub={t("storiesSub")} />
      {D.STORIES.map((s: any, i: number) => (
        <Card key={s.id} pad={0} style={{ marginBottom: 14, overflow: "hidden" }}>
          {photos[i] && <Photo src={photos[i]} label={`${s.district} student`} rounded={0} style={{ height: 140 }} />}
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
              <Avatar init={s.init} size={42} tone={i % 2 ? "saffron" : "blue"} />
              <div>
                <strong style={{ font: `700 14.5px ${T.head}`, color: T.ink }}>{name(s)}</strong>
                <div style={{ font: `400 12px ${T.body}`, color: T.inkSoft }}>{s.district}</div>
              </div>
            </div>
            <Chip tone="green" style={{ marginBottom: 8 }}>{s.achievement}</Chip>
            <p style={{ font: `500 14.5px ${T.head}`, color: T.ink, margin: "8px 0 0", lineHeight: 1.45 }}>&ldquo;{s.quote}&rdquo;</p>
          </div>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- More ---------- */
export function MoreScreen() {
  const { t, nav } = useStudentApp();
  const router = useRouter();
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const items: { icon: string; label: string; to?: string; href?: string; action?: () => void }[] = [
    { icon: "diversity_3", label: t("talkTitle"), to: "book" },
    { icon: "event_note", label: t("mySessionsTitle"), to: "mySessions" },
    { icon: "rocket_launch", label: t("skillsTitle"), to: "skills" },
    { icon: "verified_user", label: t("schemesTitle"), to: "schemes" },
    { icon: "auto_stories", label: t("storiesTitle"), to: "stories" },
    { icon: "emoji_events", label: t("examTitle"), to: "exams" },
    { icon: "route", label: t("roadmapGen"), to: "roadmap" },
    { icon: "checklist", label: t("eligibilityChecker"), to: "eligibility" },
    { icon: "auto_awesome", label: t("aiCounsel"), action: nav.openAI },
    { icon: "info", label: t("aboutTitle"), to: "about" },
  ];
  /* Pages from the existing student portal, kept reachable */
  const portal: { icon: string; label: string; href: string }[] = [
    { icon: "assignment", label: "My Requests", href: "/student/requests" },
    { icon: "event", label: "Programs & Workshops", href: "/student/programs" },
    { icon: "groups", label: "Counsellors", href: "/student/counsellors" },
    { icon: "calendar_month", label: "Appointments", href: "/student/appointments" },
    { icon: "notifications", label: "Notifications", href: "/student/notifications" },
    { icon: "person", label: "Complete profile", href: "/student/onboarding/step-1" },
  ];
  const tile = (it: { icon: string; label: string }, onClick: () => void) => (
    <Card key={it.label} pad={16} onClick={onClick} style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 96 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: T.blueSoft, display: "grid", placeItems: "center" }}>
        <Icon name={it.icon} size={24} color={T.kashmirBlue} fill={1} />
      </div>
      <span style={{ font: `700 13.5px ${T.head}`, color: T.ink, lineHeight: 1.25 }}>{it.label}</span>
    </Card>
  );
  return (
    <Page>
      <SecIntro title={t("more")} sub={t("appName")} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {items.map((it) => tile(it, it.action || (() => nav.go(it.to!))))}
      </div>
      {signedIn ? (
        <>
          <div style={{ marginTop: 26 }}>
            <SectionHead title="My account" sub="Requests, programs & notifications" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {portal.map((it) => tile(it, () => router.push(it.href)))}
            </div>
          </div>
          <Btn full variant="ghost" icon="logout" onClick={() => signOut({ callbackUrl: "/" })} style={{ marginTop: 22, color: "#b91c1c" }}>
            Sign out
          </Btn>
        </>
      ) : (
        <Card pad={18} style={{ marginTop: 26 }}>
          <div style={{ font: `700 15px ${T.head}`, color: T.ink }}>Have an account?</div>
          <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "4px 0 14px", lineHeight: 1.5 }}>
            Sign in to book counsellors, track your sessions and register for programs. Everything else is free to explore.
          </p>
          <Btn full variant="saffron" icon="login" onClick={() => router.push(`/login?portal=student&next=${encodeURIComponent("/student/dashboard")}`)}>Sign in</Btn>
          <Btn full variant="ghost" icon="person_add" onClick={() => router.push("/signup")} style={{ marginTop: 10 }}>Create a free account</Btn>
        </Card>
      )}
    </Page>
  );
}

export function AboutScreen() {
  const { t } = useStudentApp();
  return (
    <Page>
      <SecIntro title={t("aboutTitle")} sub={t("appName")} />
      <Card pad={18}>
        <p style={{ font: `400 15px ${T.body}`, color: T.ink, lineHeight: 1.6, margin: 0 }}>{t("aboutBody")}</p>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
        {[["11", "Career paths"], ["9", "Exam hubs"], ["6", "Scholarships"]].map(([n, l]) => (
          <Card key={l} pad={14} style={{ textAlign: "center" }}>
            <div style={{ font: `700 26px ${T.head}`, color: T.saffronDeep }}>{n}</div>
            <div style={{ font: `500 11px ${T.body}`, color: T.inkSoft, marginTop: 2 }}>{l}</div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

export function EligibilityScreen() {
  const { t, lang } = useStudentApp();
  return <Page><SecIntro title={t("eligibilityChecker")} sub={t("scholarSub")} /><EligibilityChecker lang={lang} /></Page>;
}

export function RoadmapScreen({ preselect }: { preselect?: string | null }) {
  const { t, lang } = useStudentApp();
  return <Page><SecIntro title={t("roadmapGen")} sub={t("careersSub")} /><RoadmapGenerator lang={lang} preselect={preselect} /></Page>;
}

function NotFound() {
  const { nav } = useStudentApp();
  return (
    <Page>
      <Card pad={28} style={{ textAlign: "center" }}>
        <Icon name="search_off" size={44} color={T.outline} />
        <p style={{ font: `500 15px ${T.head}`, color: T.ink, margin: "12px 0 16px" }}>We couldn&apos;t find that page.</p>
        <Btn variant="primary" onClick={() => nav.go("home")}>Back to home</Btn>
      </Card>
    </Page>
  );
}
