"use client";

/* The four interactive tools — ported from the new design (features.jsx). */

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { THEME, Field, Btn, Chip, Card, Icon, Avatar, inputStyle, selectStyle } from "./ui";
import { DATA, AI_START, aiAnswer, NSP_URL, tr } from "@/lib/student-app/data";
import { requestMentorAction } from "@/app/actions/student-app.actions";

const T = THEME;

/* ---------- 1. Scholarship Eligibility Checker ---------- */
export function EligibilityChecker({ lang }: { lang: string }) {
  const t = (k: string) => tr(lang, k);
  const [form, setForm] = useState({ level: "11-12", income: "le2", category: "general", gender: "any", domicile: "yes" });
  const [results, setResults] = useState<any[] | null>(null);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function check() {
    const inc = ({ le2: 2, le35: 3.5, le8: 8, gt8: 20 } as Record<string, number>)[form.income];
    const matched = DATA.SCHOLARSHIPS.filter((s: any) => {
      if (form.domicile !== "yes" && (s.cat === "jk" || s.id === "pmss")) return false;
      if (s.id === "nmms" && form.level !== "8") return false;
      if (s.id === "begum" && form.gender !== "female") return false;
      if (s.id === "pmss" && inc > 8) return false;
      if ((s.id === "nmms" || s.id === "begum") && inc > 3.5) return false;
      if (s.id === "min" && inc > 2) return false;
      if (s.cat === "minority" && form.category !== "minority") return false;
      return true;
    });
    setResults(matched);
  }

  const opts = (arr: [string, string][]) => arr.map(([v, l]) => <option key={v} value={v}>{l}</option>);

  return (
    <div>
      <p style={{ font: `400 14px ${T.body}`, color: T.inkSoft, margin: "0 0 16px" }}>
        Answer 5 quick questions to instantly see scholarships you may qualify for.
      </p>
      <Field label="Current level">
        <select style={selectStyle} value={form.level} onChange={(e) => set("level", e.target.value)}>
          {opts([["8", "Class 8"], ["9-10", "Class 9–10"], ["11-12", "Class 11–12"], ["ug", "Undergraduate"]])}
        </select>
      </Field>
      <Field label="Annual family income">
        <select style={selectStyle} value={form.income} onChange={(e) => set("income", e.target.value)}>
          {opts([["le2", "Up to ₹2 lakh"], ["le35", "₹2–3.5 lakh"], ["le8", "₹3.5–8 lakh"], ["gt8", "Above ₹8 lakh"]])}
        </select>
      </Field>
      <Field label="Category">
        <select style={selectStyle} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {opts([["general", "General"], ["obc", "OBC"], ["scst", "SC / ST"], ["minority", "Minority"]])}
        </select>
      </Field>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Gender">
            <select style={selectStyle} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {opts([["any", "Prefer not to say"], ["female", "Female"], ["male", "Male"]])}
            </select>
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="J&K domicile">
            <select style={selectStyle} value={form.domicile} onChange={(e) => set("domicile", e.target.value)}>
              {opts([["yes", "Yes"], ["no", "No"]])}
            </select>
          </Field>
        </div>
      </div>
      <Btn full variant="saffron" icon="search" onClick={check}>{t("eligibility")}</Btn>

      {results && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Icon name={results.length ? "verified" : "info"} size={20} color={results.length ? T.green : T.saffronDeep} fill={1} />
            <span style={{ font: `700 15px ${T.head}`, color: T.ink }}>
              {results.length ? `${results.length} scholarship${results.length > 1 ? "s" : ""} matched` : "No exact match — broaden your answers"}
            </span>
          </div>
          {results.map((s) => (
            <Card key={s.id} pad={14} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>{lang === "ur" ? s.ur : s.en}</strong>
                <Chip tone="green">{s.amount}</Chip>
              </div>
              <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "0 0 8px" }}>{s.elig}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ font: `500 12px ${T.body}`, color: T.inkSoft }}>⏱ {t("deadline")}: {s.deadline}</span>
                <Btn size="sm" variant="light" onClick={() => window.open(NSP_URL, "_blank", "noopener,noreferrer")}>{t("apply")}</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- 2. Career Roadmap Generator ---------- */
export function RoadmapGenerator({ lang, preselect }: { lang: string; preselect?: string | null }) {
  const t = (k: string) => tr(lang, k);
  const careers = DATA.CAREERS;
  const initial = careers.some((c: any) => c.id === preselect) ? (preselect as string) : careers[0].id;
  const [cid, setCid] = useState(initial);
  const [stage, setStage] = useState("0");
  const [show, setShow] = useState(false);
  const career = careers.find((c: any) => c.id === cid);

  return (
    <div>
      <p style={{ font: `400 14px ${T.body}`, color: T.inkSoft, margin: "0 0 16px" }}>
        Pick a goal and where you are now — we&apos;ll map the path step by step.
      </p>
      <Field label="Career goal">
        <select style={selectStyle} value={cid} onChange={(e) => { setCid(e.target.value); setStage("0"); setShow(false); }}>
          {careers.map((c: any) => <option key={c.id} value={c.id}>{lang === "ur" ? c.ur : c.en}</option>)}
        </select>
      </Field>
      <Field label="You are at">
        <select style={selectStyle} value={stage} onChange={(e) => setStage(e.target.value)}>
          {career.roadmap.map((s: string, i: number) => <option key={i} value={String(i)}>{`Step ${i + 1}: ${s}`}</option>)}
        </select>
      </Field>
      <Btn full variant="saffron" icon="route" onClick={() => setShow(true)}>{t("roadmap")}</Btn>

      {show && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <h3 style={{ font: `700 17px ${T.head}`, color: T.ink, margin: 0 }}>{lang === "ur" ? career.ur : career.en}</h3>
            <Chip tone="green">{career.pay}</Chip>
          </div>
          <div style={{ position: "relative", marginTop: 14, paddingInlineStart: 6 }}>
            {career.roadmap.map((step: string, i: number) => {
              const me = i === Number(stage);
              const done = i < Number(stage);
              const col = done ? T.green : me ? T.saffron : T.kashmirBlue;
              return (
                <div key={i} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: i === career.roadmap.length - 1 ? 0 : 22 }}>
                  {i < career.roadmap.length - 1 && (
                    <div style={{ position: "absolute", insetInlineStart: 13, top: 28, bottom: 0, width: 2, background: done ? T.green : T.outline }} />
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0, zIndex: 1,
                    background: done ? T.green : me ? T.saffron : "#fff",
                    border: `2px solid ${col}`, color: done || me ? "#fff" : T.kashmirBlue,
                    display: "grid", placeItems: "center", font: `700 13px ${T.head}`,
                  }}>{done ? "✓" : i + 1}</div>
                  <div style={{ paddingTop: 3 }}>
                    <div style={{ font: `600 14.5px ${T.body}`, color: me ? T.saffronDeep : T.ink }}>{step}</div>
                    {me && <div style={{ font: `600 11px ${T.body}`, color: T.saffronDeep, marginTop: 2 }}>◀ You are here</div>}
                  </div>
                </div>
              );
            })}
          </div>
          {career.exams.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <span style={{ font: `600 12px ${T.body}`, color: T.inkSoft }}>{t("relatedExams")}: </span>
              <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                {career.exams.map((e: string) => <Chip key={e}>{e}</Chip>)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- 3. Mentor Booking (saved as a request to the Center) ---------- */
export function MentorBooking({ lang, mentor, onConfirm }: { lang: string; mentor: any; onConfirm: (slot: string) => void }) {
  const t = (k: string) => tr(lang, k);
  const [slot, setSlot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status } = useSession();
  const isGuest = status === "unauthenticated";

  async function book() {
    if (!slot || busy) return;
    if (isGuest) { window.location.href = `/login?portal=student&next=${encodeURIComponent(window.location.pathname)}`; return; }
    setBusy(true); setError(null);
    const res = await requestMentorAction({ mentorName: mentor.en, mentorRole: mentor.role, slot });
    setBusy(false);
    if (res.success) onConfirm(slot);
    else setError(res.error === "Student profile not found" ? "Please complete your profile first (More → Complete profile)." : res.error || "Could not send request.");
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Avatar init={mentor.init} size={52} tone="saffron" />
        <div>
          <div style={{ font: `700 16px ${T.head}`, color: T.ink }}>{lang === "ur" ? mentor.ur : mentor.en}</div>
          <div style={{ font: `400 13px ${T.body}`, color: T.inkSoft }}>{mentor.role}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
            <Chip tone="blue">{mentor.expertise}</Chip>
            <Chip tone="saffron">★ {mentor.rating}</Chip>
          </div>
        </div>
      </div>
      <div style={{ font: `600 13px ${T.body}`, color: T.ink, marginBottom: 8 }}>Pick a slot</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {mentor.slots.map((s: string) => (
          <button key={s} onClick={() => setSlot(s)} aria-pressed={slot === s} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 15px", borderRadius: 12, cursor: "pointer", textAlign: "start",
            border: `1.5px solid ${slot === s ? T.saffron : T.outline}`,
            background: slot === s ? T.saffronSoft : "#fff",
            font: `600 14px ${T.body}`, color: T.ink,
          }}>
            <span><span style={{ marginInlineEnd: 8 }}>🗓</span>{s}</span>
            {slot === s && <Icon name="check_circle" size={20} color={T.saffronDeep} fill={1} />}
          </button>
        ))}
      </div>
      {error && <p role="alert" style={{ font: `500 13px ${T.body}`, color: "#b91c1c", margin: "0 0 10px" }}>{error}</p>}
      <Btn full variant="saffron" icon="event_available" onClick={book} disabled={!slot || busy}>
        {busy ? "Sending…" : isGuest ? "Sign in to book" : <>{t("book")}{slot ? ` · ${slot}` : ""}</>}
      </Btn>
      {isGuest && <p style={{ font: `400 12px ${T.body}`, color: T.inkSoft, textAlign: "center", margin: "10px 0 0" }}>Free account needed so the Center can confirm with you.</p>}
    </div>
  );
}

/* ---------- 4. AI Career Counselor ---------- */
export function AICounselor() {
  const [msgs, setMsgs] = useState<{ who: "ai" | "me"; text: string }[]>([{ who: "ai", text: AI_START.q }]);
  const [chips, setChips] = useState<string[]>(AI_START.chips);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { who: "me", text }]);
    setInput("");
    setChips([]);
    setTyping(true);
    setTimeout(() => {
      const r = aiAnswer(text);
      setTyping(false);
      setMsgs((m) => [...m, { who: "ai", text: r.a }]);
      setChips(r.chips || []);
    }, 700);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "4px 2px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.who === "me" ? "flex-end" : "flex-start" }}>
            {m.who === "ai" && (
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${T.kashmirBlue}, ${T.blueTint})`, display: "grid", placeItems: "center", marginInlineEnd: 8, flexShrink: 0, alignSelf: "flex-end" }}>
                <Icon name="auto_awesome" size={16} color="#fff" fill={1} />
              </div>
            )}
            <div style={{
              maxWidth: "78%", padding: "11px 14px", borderRadius: m.who === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.who === "me" ? T.kashmirBlue : "#fff",
              color: m.who === "me" ? "#fff" : T.ink,
              border: m.who === "me" ? "none" : `1px solid ${T.outline}`,
              font: `400 14px ${T.body}`, whiteSpace: "pre-line", lineHeight: 1.5,
              boxShadow: "0 2px 8px rgba(15,76,129,0.06)",
            }}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 4, alignItems: "center", paddingInlineStart: 38 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.outline, animation: `sa-blink 1s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
      </div>
      {chips.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "8px 2px" }}>
          {chips.map((c) => (
            <button key={c} onClick={() => send(c)} style={{
              font: `600 12.5px ${T.body}`, color: T.kashmirBlue, background: T.blueSoft,
              border: "none", borderRadius: 999, padding: "8px 13px", cursor: "pointer",
            }}>{c}</button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask anything about your future…"
          aria-label="Ask the AI counsellor"
          style={{ ...inputStyle, height: 46, flex: 1 }}
        />
        <button onClick={() => send(input)} aria-label="Send" style={{
          width: 46, height: 46, borderRadius: 12, border: "none", background: T.saffron,
          cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Icon name="send" size={20} color="#3a2400" fill={1} />
        </button>
      </div>
    </div>
  );
}
