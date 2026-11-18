"use client";

/* Student-side counselling — ported from the new design (student-counselling.jsx).
   Booking creates a real support request; sessions are the student's real requests. */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { THEME, Icon, Card, Btn, Page, SecIntro, Avatar, Chip, BackLink, inputStyle } from "./ui";
import { useStudentApp } from "./AppContext";
import { CONCERNS, MODES } from "@/lib/student-app/data";
import { SESSION_STATUS, SESSION_STEPS, stepIndex, type SessionView } from "@/lib/student-app/sessions";
import { requestCounsellingAction } from "@/app/actions/student-app.actions";
import { sendCaseMessageAction } from "@/app/actions/counsellor-desk.actions";

const T = THEME;

export type BookSlot = { iso: string; label: string; day: string; time: string };
export type BookableCounsellor = {
  id: string; name: string; init: string; expertise: string; tags: string[];
  years: number | null; languages: string[]; slots: BookSlot[];
};


function StepHead({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ width: 26, height: 26, borderRadius: 99, background: T.kashmirBlue, color: "#fff", display: "grid", placeItems: "center", font: `700 12px ${T.head}`, flexShrink: 0 }}>{n}</span>
      <h2 style={{ font: `700 18px ${T.head}`, color: T.ink, margin: 0 }}>{title}</h2>
    </div>
  );
}

/* ---------- Talk to a counsellor: booking flow ---------- */
/* Shown to visitors who aren't signed in — bookings must belong to an account */
export function GuestSignIn({ title, text }: { title: string; text: string }) {
  const router = useRouter();
  const here = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/student/talk";
  const next = encodeURIComponent(here);
  return (
    <Card pad={28} style={{ textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.blueSoft, display: "grid", placeItems: "center", margin: "0 auto 4px" }}>
        <Icon name="lock_person" size={34} color={T.kashmirBlue} fill={1} />
      </div>
      <p style={{ font: `700 16px ${T.head}`, color: T.ink, margin: "12px 0 4px" }}>{title}</p>
      <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "0 0 18px", lineHeight: 1.5 }}>{text}</p>
      <Btn full variant="saffron" icon="login" onClick={() => router.push(`/login?portal=student&next=${next}`)}>Sign in</Btn>
      <Btn full variant="ghost" icon="person_add" onClick={() => router.push(`/signup?next=${next}`)} style={{ marginTop: 10 }}>Create a free account</Btn>
    </Card>
  );
}

export function BookCounselling({
  counsellors, anySlots = [], hasProfile, initialConcern, initialCounsellorId = null, isGuest = false, staffRole = null,
}: {
  counsellors: BookableCounsellor[]; anySlots?: BookSlot[]; hasProfile: boolean; initialConcern?: string | null;
  initialCounsellorId?: string | null; isGuest?: boolean; staffRole?: string | null;
}) {
  const { nav } = useStudentApp();
  const router = useRouter();
  const validInitial = CONCERNS.some((c) => c.id === initialConcern) ? (initialConcern as string) : null;
  const [step, setStep] = useState(validInitial ? 2 : 1);
  const [concern, setConcern] = useState<string | null>(validInitial);
  const [mode, setMode] = useState<string | null>(null);
  const [co, setCo] = useState<BookableCounsellor | "any" | null>(null);
  const [slot, setSlot] = useState<BookSlot | null>(null);
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (staffRole) {
    return (
      <Page>
        <SecIntro title="Talk to a counsellor" sub="Free & confidential · Anantnag center" />
        <GuestSignIn title="Sign in with a student account" text={`You're signed in as ${staffRole}. Sessions are booked from a student account — sign in as a student or create one.`} />
      </Page>
    );
  }

  if (isGuest) {
    return (
      <Page>
        <SecIntro title="Talk to a counsellor" sub="Free & confidential · Anantnag center" />
        <GuestSignIn title="Sign in to book a session" text="Booking is free. Sign in or create an account so your counsellor can confirm the session and follow up with you." />
      </Page>
    );
  }

  if (!hasProfile) {
    return (
      <Page>
        <SecIntro title="Talk to a counsellor" sub="Free & confidential · Anantnag center" />
        <Card pad={28} style={{ textAlign: "center" }}>
          <Icon name="person" size={44} color={T.outline} />
          <p style={{ font: `500 15px ${T.head}`, color: T.ink, margin: "12px 0 4px" }}>Complete your profile first</p>
          <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "0 0 18px" }}>We need a few details before a counsellor can help you.</p>
          <Btn variant="saffron" icon="arrow_forward" onClick={() => router.push(`/student/onboarding/step-1?next=${encodeURIComponent(window.location.pathname + window.location.search)}`)}>Set up profile</Btn>
        </Card>
      </Page>
    );
  }

  // The counsellor picked on the website (if any) is listed first, even outside the concern filter
  const picked = counsellors.find((c) => c.id === initialCounsellorId) ?? null;
  // Every counsellor is listed: best matches for the concern first, then everyone else
  const matches = [
    ...(picked ? [picked] : []),
    ...counsellors.filter((c) => c.id !== picked?.id && (!concern || c.tags.includes(concern))),
  ];
  const others = counsellors.filter((c) => !matches.some((m) => m.id === c.id));
  const concernLabel = CONCERNS.find((c) => c.id === concern)?.en.toLowerCase() ?? "your concern";
  const slotsForChoice: BookSlot[] = co === "any" ? anySlots : co ? co.slots : [];
  const slotDays = Array.from(new Set(slotsForChoice.map((s) => s.day)));
  const coName = co === "any" ? null : co?.name ?? null;

  async function confirm() {
    if (!slot || !concern || !mode || busy) return;
    setBusy(true); setError(null);
    const res = await requestCounsellingAction({ concern, mode, counsellorId: co && co !== "any" ? co.id : null, slotISO: slot.iso, topic });
    setBusy(false);
    if (res.success) setStep(5);
    else {
      setError(res.error || "Could not send your request. Please try again.");
      if (/slot|time/i.test(res.error || "")) { setSlot(null); router.refresh(); }
    }
  }

  if (step === 5) {
    const m = MODES.find((x) => x.id === mode)!;
    return (
      <Page>
        <div style={{ textAlign: "center", padding: "30px 10px" }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: T.greenSoft, display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
            <Icon name="check_circle" size={52} color={T.green} fill={1} />
          </div>
          <h1 style={{ font: `700 24px ${T.head}`, color: T.ink, margin: "0 0 8px" }}>Request sent!</h1>
          <p style={{ font: `400 14px ${T.body}`, color: T.inkSoft, margin: "0 0 4px", lineHeight: 1.5 }}>
            {coName ?? "A counsellor"} will confirm your {m.en.split(" at")[0].toLowerCase()} session.
          </p>
          <p style={{ font: `600 14px ${T.head}`, color: T.kashmirBlue, margin: "0 0 26px" }}>{slot?.label}</p>
          <Card pad={16} style={{ textAlign: "start", marginBottom: 18 }}>
            <div style={{ font: `600 13px ${T.body}`, color: T.inkSoft, marginBottom: 8 }}>What happens next</div>
            {["The counsellor reviews and confirms your slot", mode === "in-person" ? "Visit the Anantnag center — desk checks you in" : "You'll get a secure link / call at the time", "After the session, your next steps appear here"].map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 0" }}>
                <Icon name="check" size={16} color={T.green} style={{ marginTop: 2 }} /><span style={{ font: `400 13px ${T.body}`, color: T.ink, lineHeight: 1.4 }}>{x}</span>
              </div>
            ))}
          </Card>
          <Btn full variant="primary" onClick={() => { router.refresh(); nav.go("mySessions"); }}>View my sessions</Btn>
          <button onClick={() => nav.go("home")} style={{ marginTop: 12, background: "none", border: "none", color: T.inkSoft, font: `600 13px ${T.body}`, cursor: "pointer" }}>Back to home</button>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <SecIntro title="Talk to a counsellor" sub="Free & confidential · Anantnag center" />
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[1, 2, 3, 4].map((n) => <div key={n} style={{ flex: 1, height: 5, borderRadius: 99, background: n <= step ? T.kashmirBlue : T.outline }} />)}
      </div>

      {step === 1 && (
        <div>
          <StepHead n={1} title="What do you need help with?" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {CONCERNS.map((c) => (
              <Card key={c.id} pad={15} accent={concern === c.id} onClick={() => { setConcern(c.id); setCo(null); setStep(2); }} style={concern === c.id ? { borderColor: c.color } : undefined}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: c.color + "16", display: "grid", placeItems: "center", marginBottom: 10 }}>
                  <Icon name={c.icon} size={24} color={c.color} fill={1} />
                </div>
                <strong style={{ font: `700 14px ${T.head}`, color: T.ink }}>{c.en}</strong>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <StepHead n={2} title="How would you like to meet?" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MODES.map((m) => (
              <Card key={m.id} pad={15} accent={mode === m.id} onClick={() => { setMode(m.id); setStep(3); }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: T.blueSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon name={m.icon} size={24} color={T.kashmirBlue} fill={1} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>{m.en}</strong>
                    <div style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft, marginTop: 2 }}>{m.sub}</div>
                  </div>
                  <Icon name="chevron_right" size={22} color={T.outline} />
                </div>
              </Card>
            ))}
          </div>
          <BackLink onClick={() => setStep(1)} />
        </div>
      )}

      {step === 3 && (
        <div>
          <StepHead n={3} title="Choose a counsellor" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card pad={15} accent={co === "any"} onClick={() => { setCo("any"); setStep(4); }}>
              <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.saffronSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon name="groups" size={24} color={T.saffronDeep} fill={1} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>Any available counsellor</strong>
                  <div style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft }}>The Center assigns the best match</div>
                  <div style={{ marginTop: 5, font: `600 11px ${T.body}`, color: T.green }}>● Fastest response</div>
                </div>
              </div>
            </Card>
            {[
              { key: "best", heading: matches.length ? `Best match for ${concernLabel}` : null, list: matches },
              { key: "others", heading: others.length ? "Other counsellors" : null, list: others },
            ].flatMap((group) => [
              group.heading ? (
                <div key={`h-${group.key}`} style={{ font: `700 13px ${T.head}`, color: T.inkSoft, textTransform: "uppercase", letterSpacing: 0.6, margin: "8px 2px 0" }}>
                  {group.heading} <span style={{ fontWeight: 600 }}>· {group.list.length}</span>
                </div>
              ) : null,
              ...group.list.map((c) => {
              const next = c.slots[0];
              const full = !next;
              return (
                <Card key={c.id} pad={15} accent={co !== "any" && co?.id === c.id}
                  onClick={full ? undefined : () => { setCo(c); setSlot(null); setStep(4); }}
                  style={full ? { opacity: 0.55 } : undefined}>
                  <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
                    <Avatar init={c.init} size={48} tone="blue" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>{c.name}</strong>
                        {c.id === initialCounsellorId && <Chip tone="saffron">Your choice</Chip>}
                      </div>
                      <div style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft }}>{c.expertise}</div>
                      <div style={{ font: `400 11.5px ${T.body}`, color: T.inkSoft, marginTop: 2 }}>
                        {[c.years ? `${c.years} yrs experience` : null, c.languages.slice(0, 3).join(", ")].filter(Boolean).join(" · ")}
                      </div>
                      <div style={{ marginTop: 5, font: `600 11px ${T.body}`, color: full ? T.saffronDeep : T.green }}>
                        {full ? "○ Fully booked this week" : `● Next free: ${next.label}`}
                      </div>
                    </div>
                  </div>
                </Card>
              );
              }),
            ])}
          </div>
          <BackLink onClick={() => setStep(2)} />
        </div>
      )}

      {step === 4 && (
        <div>
          <StepHead n={4} title="Pick a time & add details" />
          <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "-6px 0 14px" }}>
            {co === "any" ? "Center hours · the Center assigns a counsellor" : `Free times for ${co?.name ?? "this counsellor"}`} · Indian Standard Time
          </p>
          {slotsForChoice.length === 0 ? (
            <Card pad={18} style={{ marginBottom: 16, textAlign: "center" }}>
              <span style={{ font: `500 13.5px ${T.body}`, color: T.inkSoft }}>No free times in the next 7 days. Please choose another counsellor.</span>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
              {slotDays.map((day) => (
                <div key={day}>
                  <div style={{ font: `700 13px ${T.head}`, color: T.ink, marginBottom: 8 }}>{day}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {slotsForChoice.filter((s) => s.day === day).map((sl) => {
                      const on = slot?.iso === sl.iso;
                      return (
                        <button key={sl.iso} onClick={() => setSlot(sl)} aria-pressed={on} aria-label={sl.label} style={{
                          padding: "10px 6px", borderRadius: 12, cursor: "pointer",
                          border: `1.5px solid ${on ? T.kashmirBlue : T.outline}`, background: on ? T.blueSoft : "#fff",
                          font: `600 13px ${T.body}`, color: on ? T.kashmirBlue : T.ink,
                        }}>{sl.time}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <label style={{ display: "block", marginBottom: 16 }}>
            <span style={{ font: `600 13px ${T.body}`, color: T.ink, display: "block", marginBottom: 6 }}>Tell your counsellor briefly (optional)</span>
            <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. I'm confused between Engineering and Medical…" style={{ width: "100%", minHeight: 80, borderRadius: 12, border: `1px solid ${T.outline}`, padding: 12, font: `400 14px ${T.body}`, color: T.ink, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          </label>
          {error && <p role="alert" style={{ font: `500 13px ${T.body}`, color: "#b91c1c", margin: "0 0 10px" }}>{error}</p>}
          <Btn full variant="saffron" icon="send" onClick={confirm} disabled={!slot || busy}>{busy ? "Sending…" : "Request session"}</Btn>
          <BackLink onClick={() => setStep(3)} />
        </div>
      )}
    </Page>
  );
}

function StatusPill({ status }: { status: string }) {
  const sm = SESSION_STATUS[status] ?? { label: status, bg: "#eef2f7", fg: "#475569", dot: "#94a3b8" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sm.bg, color: sm.fg, font: `600 11px ${T.body}`, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: sm.dot }} />{sm.label}
    </span>
  );
}

const initials = (n: string) => {
  const words = n.split(" ").filter(Boolean);
  const core = words.filter((w) => !/^(dr|mr|mrs|ms|prof)\.?$/i.test(w));
  return (core.length ? core : words).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
};

/* ---------- My Sessions ---------- */
export function MySessions({ sessions, hasProfile, isGuest = false }: { sessions: SessionView[]; hasProfile: boolean; isGuest?: boolean }) {
  const { nav } = useStudentApp();
  if (isGuest) {
    return (
      <Page>
        <SecIntro title="My sessions" />
        <GuestSignIn title="Sign in to see your sessions" text="Your counselling requests, their status and your next steps appear here once you sign in." />
      </Page>
    );
  }
  const order: Record<string, number> = { IN_PROGRESS: 0, SESSION_SCHEDULED: 1, COUNSELLOR_ASSIGNED: 2, FOLLOW_UP_REQUIRED: 3, UNDER_REVIEW: 4, SUBMITTED: 5, ESCALATED: 6, RESOLVED: 7 };
  const sorted = [...sessions].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));

  if (sessions.length === 0) {
    return (
      <Page>
        <SecIntro title="My sessions" />
        <Card pad={28} style={{ textAlign: "center" }}>
          <Icon name="event_available" size={44} color={T.outline} />
          <p style={{ font: `500 15px ${T.head}`, color: T.ink, margin: "12px 0 4px" }}>No sessions yet</p>
          <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "0 0 18px" }}>
            {hasProfile ? "Book a free session with a counsellor." : "Complete your profile, then book a free session."}
          </p>
          <Btn variant="saffron" icon="add" onClick={() => nav.go("book")}>Talk to a counsellor</Btn>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <SecIntro title="My sessions" sub={`${sessions.length} session(s)`} />
      <Btn full variant="saffron" icon="add" onClick={() => nav.go("book")} style={{ marginBottom: 16 }}>Book a new session</Btn>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((a) => {
          const m = MODES.find((x) => x.id === a.mode);
          return (
            <Card key={a.id} pad={15} onClick={() => nav.go("sessionDetail", { id: a.id })}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                {a.counsellor
                  ? <Avatar init={initials(a.counsellor)} size={42} tone="blue" />
                  : <div style={{ width: 42, height: 42, borderRadius: "50%", background: T.saffronSoft, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="hourglass_top" size={20} color={T.saffronDeep} /></div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ font: `700 14.5px ${T.head}`, color: T.ink }}>{a.counsellor ?? "Awaiting counsellor"}</strong>
                  <div style={{ font: `400 12px ${T.body}`, color: T.inkSoft, textTransform: "capitalize" }}>{a.categories.map((c) => c.replace(/_/g, " ").toLowerCase()).join(" · ")}</div>
                </div>
                <StatusPill status={a.status} />
              </div>
              <p style={{ font: `400 13px ${T.body}`, color: T.ink, margin: "0 0 10px", lineHeight: 1.4 }}>&ldquo;{a.topic}&rdquo;</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {m && <Chip tone="blue"><Icon name={m.icon} size={12} fill={1} /> {m.en.split(" at")[0]}</Chip>}
                {a.time && <Chip tone="saffron"><Icon name="event" size={12} /> {a.time}</Chip>}
                {!a.time && <Chip tone="saffron"><Icon name="event" size={12} /> {a.createdAt}</Chip>}
                {a.followUps.length > 0 && <Chip tone="green">✓ Next steps ready</Chip>}
              </div>
            </Card>
          );
        })}
      </div>
    </Page>
  );
}

/* ---------- Session detail (status timeline + next steps) ---------- */
export function SessionDetail({ session: a }: { session: SessionView }) {
  const { nav } = useStudentApp();
  const router = useRouter();
  const m = MODES.find((x) => x.id === a.mode);
  const curIdx = a.status === "ESCALATED" ? -1 : stepIndex(a.status);

  return (
    <Page>
      <Card pad={18} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 13, alignItems: "center", marginBottom: 14 }}>
          {a.counsellor
            ? <Avatar init={initials(a.counsellor)} size={50} tone="blue" />
            : <div style={{ width: 50, height: 50, borderRadius: "50%", background: T.saffronSoft, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="hourglass_top" size={24} color={T.saffronDeep} /></div>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ font: `700 17px ${T.head}`, color: T.ink }}>{a.counsellor ?? "Awaiting counsellor"}</strong>
            <div style={{ font: `400 13px ${T.body}`, color: T.inkSoft, textTransform: "capitalize" }}>{a.categories.map((c) => c.replace(/_/g, " ").toLowerCase()).join(" · ")}</div>
          </div>
          <StatusPill status={a.status} />
        </div>
        <p style={{ font: `400 13.5px ${T.body}`, color: T.ink, margin: "0 0 12px", lineHeight: 1.45 }}>&ldquo;{a.topic}&rdquo;</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {m && <Chip tone="blue"><Icon name={m.icon} size={12} fill={1} /> {m.en.split(" at")[0]}</Chip>}
          <Chip tone="saffron"><Icon name="event" size={12} /> {a.time ?? a.createdAt}</Chip>
        </div>
      </Card>

      {a.status === "ESCALATED" ? (
        <Card pad={16} style={{ marginBottom: 16, background: "#fef2f2", borderColor: "#fecaca" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="info" size={20} color="#b91c1c" fill={1} />
            <span style={{ font: `500 13.5px ${T.body}`, color: "#b91c1c" }}>This request has been escalated to a senior counsellor, who will contact you directly.</span>
          </div>
        </Card>
      ) : (
        <Card pad={18} style={{ marginBottom: 16 }}>
          <div style={{ font: `700 14px ${T.head}`, color: T.ink, marginBottom: 14 }}>Status</div>
          {SESSION_STEPS.map(([label, st], i) => {
            const done = i < curIdx; const now = i === curIdx;
            return (
              <div key={st} style={{ display: "flex", gap: 13, position: "relative", paddingBottom: i === SESSION_STEPS.length - 1 ? 0 : 16 }}>
                {i < SESSION_STEPS.length - 1 && <div style={{ position: "absolute", insetInlineStart: 12, top: 26, bottom: 0, width: 2, background: done ? T.green : T.outline }} />}
                <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, zIndex: 1, background: done ? T.green : now ? T.kashmirBlue : "#fff", border: `2px solid ${done ? T.green : now ? T.kashmirBlue : T.outline}`, color: done || now ? "#fff" : T.outline, display: "grid", placeItems: "center" }}>
                  <Icon name={done ? "check" : now ? "schedule" : "circle"} size={done || now ? 15 : 8} fill={1} />
                </div>
                <div style={{ font: `${now ? 700 : 500} 14px ${T.body}`, color: now ? T.kashmirBlue : done ? T.ink : T.inkSoft, paddingTop: 3 }}>
                  {label}{now && (a.status === "FOLLOW_UP_REQUIRED" ? " — follow-up planned" : " — now")}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {a.followUps.length > 0 && (
        <Card pad={18} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Icon name="checklist" size={20} color={T.saffronDeep} fill={1} />
            <div style={{ font: `700 15px ${T.head}`, color: T.ink }}>Your next steps</div>
          </div>
          <p style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft, margin: "0 0 14px" }}>Follow-ups planned by {a.counsellor ?? "your counsellor"}.</p>
          {a.followUps.map((it, i) => (
            <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "8px 0", borderTop: i ? `1px solid ${T.outline}` : "none" }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, marginTop: 1, background: it.done ? T.green : "#fff", border: `2px solid ${it.done ? T.green : T.outline}`, display: "grid", placeItems: "center" }}>
                {it.done && <Icon name="check" size={15} color="#fff" />}
              </div>
              <div>
                <span style={{ font: `500 14px ${T.body}`, color: it.done ? T.inkSoft : T.ink, textDecoration: it.done ? "line-through" : "none", lineHeight: 1.4 }}>{it.purpose}</span>
                <div style={{ font: `400 12px ${T.body}`, color: T.inkSoft, marginTop: 2 }}>{it.date}</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {a.counsellor ? (
        <Btn full variant="primary" icon="forum" onClick={() => router.push(`/student/sessions/${a.id}/chat`)}>Message {a.counsellor.split(" ").filter((w) => !/^(dr|mr|mrs|ms|prof)\.?$/i.test(w))[0] ?? "counsellor"}</Btn>
      ) : null}
      <Btn full variant={a.counsellor ? "ghost" : "primary"} icon="add" onClick={() => nav.go("book")} style={{ marginTop: a.counsellor ? 10 : 0 }}>Book another session</Btn>
    </Page>
  );
}

/* ---------- Student ↔ counsellor chat (design: student-counselling.jsx → StudentChat) ---------- */
export function StudentChat({
  requestId, counsellor, messages,
}: { requestId: string; counsellor: string | null; messages: { from: "student" | "counsellor"; text: string; ts: string }[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const name = counsellor ?? "Your counsellor";

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);
  React.useEffect(() => {
    const id = setInterval(() => router.refresh(), 15000);
    return () => clearInterval(id);
  }, [router]);

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    const r = await sendCaseMessageAction(requestId, text);
    setBusy(false);
    if (r.success) { setDraft(""); router.refresh(); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 16px", borderBottom: `1px solid ${T.outline}`, background: "#fff" }}>
        <Avatar init={initials(name)} size={40} tone="blue" />
        <div>
          <div style={{ font: `700 14px ${T.head}`, color: T.ink }}>{name}</div>
          <div style={{ font: `400 11.5px ${T.body}`, color: T.green }}>● Usually replies within a day</div>
        </div>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 11, background: T.bg }}>
        {messages.length === 0 && <div style={{ textAlign: "center", color: T.inkSoft, font: `400 13px ${T.body}`, marginTop: 30 }}>Say hello to your counsellor 👋</div>}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "student" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "78%", padding: "10px 13px", borderRadius: m.from === "student" ? "15px 15px 4px 15px" : "15px 15px 15px 4px", background: m.from === "student" ? T.kashmirBlue : "#fff", color: m.from === "student" ? "#fff" : T.ink, border: m.from === "student" ? "none" : `1px solid ${T.outline}`, font: `400 14px ${T.body}`, lineHeight: 1.45 }}>
              {m.text}<div style={{ font: `400 10px ${T.body}`, opacity: 0.6, marginTop: 4 }}>{m.ts}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${T.outline}`, background: "#fff" }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" aria-label="Message" style={{ ...inputStyle, flex: 1 }} />
        <button onClick={send} disabled={busy} aria-label="Send" style={{ width: 46, borderRadius: 12, border: "none", background: T.kashmirBlue, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0, opacity: busy ? 0.6 : 1 }}>
          <Icon name="send" size={19} fill={1} />
        </button>
      </div>
    </div>
  );
}
