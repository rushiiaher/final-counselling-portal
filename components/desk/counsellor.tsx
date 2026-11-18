"use client";

/* Counsellor dashboard screens — ported from the new design (desk-counsellor.jsx).
   Data comes from real support requests assigned to the signed-in counsellor. */

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StatTile, Panel } from "@/components/dashboard/Desk";
import { DeskTopbar } from "@/components/layout/PageHeader";
import { MaterialIcon } from "@/components/layout/NavIcon";
import {
  CO_ACCENT, DStatusBadge, ModeIcon, modeLabel, ConcernTag, MiniAvatar, Pill, Th, Td, EmptyState, miniBtnClass,
} from "./DeskKit";
import type { DeskAppt } from "@/lib/desk/counsellor";
import { SLOT_TIMES, SLOT_DAYS as DAYS } from "@/lib/desk/slots";
import {
  acceptRequestAction, declineRequestAction, startSessionAction, completeSessionAction,
  setDutyAction, saveWeeklySlotsAction, sendCaseMessageAction,
} from "@/app/actions/counsellor-desk.actions";
import { CalendarDays, Inbox, Users, CircleCheckBig } from "lucide-react";

type Me = { name: string; sub: string | null; onDuty: boolean };

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
function todayLine() {
  return `Anantnag · Today, ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
}

/* Accept / decline with feedback + refresh */
function useRequestActions() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<{ success: boolean; error?: string }>, ok: string) =>
    start(async () => {
      const r = await fn();
      if (r.success) { toast.success(ok); router.refresh(); }
      else toast.error(r.error ?? "Something went wrong");
    });
  return {
    pending,
    accept: (id: string) => run(() => acceptRequestAction(id), "Request accepted — the student has been notified"),
    decline: (id: string) => run(() => declineRequestAction(id), "Request declined — returned to the admin for reassignment"),
  };
}

/* ---------- Overview ---------- */
export function CoOverview({ me, appts }: { me: Me; appts: DeskAppt[] }) {
  const { accept, decline, pending: busy } = useRequestActions();
  const [line, setLine] = useState({ hello: "Welcome", today: "" });
  useEffect(() => setLine({ hello: greeting(), today: todayLine() }), []);

  const today = appts.filter((a) => a.isToday && a.status !== "requested").sort((a, b) => (a.dateISO ?? "").localeCompare(b.dateISO ?? ""));
  const pending = appts.filter((a) => a.status === "requested");
  const completed = appts.filter((a) => a.status === "completed");
  const uniqStudents = new Set(appts.map((a) => a.studentId)).size;
  const right = useMemo(() => (me.sub ? <Pill color={CO_ACCENT}>{me.sub}</Pill> : null), [me.sub]);

  return (
    <>
      <DeskTopbar title={`${line.hello}, ${me.name}`} sub={line.today || undefined} right={right} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-[22px]">
        <StatTile icon={CalendarDays} label="Today's sessions" value={today.length} color={CO_ACCENT} />
        <StatTile icon={Inbox} label="Pending requests" value={pending.length} color="#f59e0b" sub={pending.length ? "▲ action needed" : undefined} href="/staff/requests" />
        <StatTile icon={Users} label="Students guided" value={uniqStudents} color="#0f4c81" href="/staff/cases" />
        <StatTile icon={CircleCheckBig} label="Completed" value={completed.length} color="#067a55" />
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-[18px] items-start">
        <Panel title="Today's schedule" sub={`${today.length} appointment(s)`} flush>
          {today.length === 0 ? (
            <div className="p-5"><EmptyState icon="event_available" text="No sessions today" /></div>
          ) : (
            <div>
              {today.map((a, i) => (
                <Link key={a.id} href={`/staff/cases/${a.id}`} className={`flex items-center gap-3.5 px-5 py-3.5 hover:bg-page transition ${i ? "border-t border-line" : ""}`}>
                  <div className="text-center w-[72px] shrink-0">
                    <div className="font-display text-[14px] font-bold text-ink whitespace-nowrap">{a.when.split("·")[1]?.trim() ?? a.when}</div>
                    <div className="text-[10px] font-medium text-ink-2">{modeLabel(a.mode)}</div>
                  </div>
                  <MiniAvatar init={a.init} />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[14px] font-semibold text-ink">{a.studentName}</div>
                    <div className="text-[12.5px] text-ink-2 truncate">{a.topic}</div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <ModeIcon mode={a.mode} />
                    <DStatusBadge status={a.status} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Needs your action" sub="New requests" right={pending.length ? <Pill color="#f59e0b">{pending.length}</Pill> : null}>
          {pending.length === 0 ? (
            <EmptyState icon="done_all" text="All caught up" />
          ) : (
            <div className="flex flex-col gap-3">
              {pending.slice(0, 4).map((a) => (
                <div key={a.id} className="border border-line rounded-[13px] p-[13px]">
                  <div className="flex items-center gap-[9px] mb-[7px]">
                    <MiniAvatar init={a.init} size={28} />
                    <span className="font-display text-[13px] font-semibold text-ink truncate">{a.studentName}</span>
                    <span className="ml-auto text-[11px] font-medium text-ink-2 whitespace-nowrap">{a.when}</span>
                  </div>
                  <ConcernTag concern={a.concern} />
                  <div className="flex gap-2 mt-[11px]">
                    <button disabled={busy} onClick={() => accept(a.id)} className={miniBtnClass(true)}>Accept</button>
                    <button disabled={busy} onClick={() => decline(a.id)} className={miniBtnClass(false)}>Decline</button>
                  </div>
                </div>
              ))}
              {pending.length > 4 && <Link href="/staff/requests" className="text-[12.5px] font-semibold text-kashmir text-center">View all {pending.length} requests</Link>}
            </div>
          )}
        </Panel>
      </div>

      {/* Tools that aren't in the design's menu, kept reachable */}
      <div className="flex flex-wrap items-center gap-2 mt-6 text-[12.5px]">
        <span className="text-ink-2 font-medium mr-1">More tools:</span>
        {[["Follow-ups", "/staff/follow-ups"], ["Guidance reports", "/staff/reports"], ["Referrals", "/staff/referrals"], ["Anonymous chat", "/staff/inbox"]].map(([l, h]) => (
          <Link key={h} href={h} className="px-3 py-1.5 rounded-full border border-line bg-surface text-ink-2 hover:text-kashmir hover:border-kashmir font-semibold">{l}</Link>
        ))}
      </div>
    </>
  );
}

/* ---------- Requests ---------- */
export function CoRequests({ appts }: { appts: DeskAppt[] }) {
  const { accept, decline, pending: busy } = useRequestActions();
  const reqs = appts.filter((a) => a.status === "requested");
  return (
    <>
      <DeskTopbar title="Counselling requests" sub="Students waiting for you to confirm" />
      <Panel className="overflow-x-auto">
        {reqs.length === 0 ? (
          <EmptyState icon="done_all" text="No pending requests" />
        ) : (
          <table className="w-full border-collapse min-w-[760px]">
            <thead><tr><Th>Student</Th><Th>Concern</Th><Th>Topic</Th><Th>Mode</Th><Th>When</Th><Th right>Action</Th></tr></thead>
            <tbody>
              {reqs.map((a) => (
                <tr key={a.id}>
                  <Td><div className="flex items-center gap-2.5"><MiniAvatar init={a.init} size={32} /><div><div className="font-semibold">{a.studentName}</div><div className="text-[11.5px] text-ink-2">{a.institution}</div></div></div></Td>
                  <Td><ConcernTag concern={a.concern} /></Td>
                  <Td><span className="block max-w-[240px]">{a.topic}</span></Td>
                  <Td><span className="inline-flex items-center gap-1.5"><ModeIcon mode={a.mode} size={16} />{modeLabel(a.mode)}</span></Td>
                  <Td>{a.when}</Td>
                  <Td right>
                    <div className="inline-flex gap-2">
                      <button disabled={busy} onClick={() => accept(a.id)} className={`${miniBtnClass(true)} !flex-none px-4`}>Accept</button>
                      <button disabled={busy} onClick={() => decline(a.id)} className={`${miniBtnClass(false)} !flex-none px-3.5`}>Decline</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </>
  );
}

/* ---------- Caseload ---------- */
export function CoCaseload({ appts }: { appts: DeskAppt[] }) {
  const [f, setF] = useState<"all" | "active" | "completed">("all");
  const order: Record<string, number> = { "in-progress": 0, "checked-in": 1, confirmed: 2, "follow-up": 3, requested: 4, completed: 5, escalated: 6 };
  let mine = appts;
  if (f !== "all") mine = mine.filter((a) => (f === "active" ? ["requested", "confirmed", "checked-in", "in-progress", "follow-up"].includes(a.status) : a.status === "completed"));
  mine = [...mine].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));

  const right = useMemo(
    () => (
      <div className="flex gap-1.5">
        {([["all", "All"], ["active", "Active"], ["completed", "Completed"]] as const).map(([id, l]) => (
          <button key={id} onClick={() => setF(id)} className={`px-3.5 py-[7px] rounded-full text-[12.5px] font-semibold ${f === id ? "text-white" : "bg-white border border-line text-ink-2"}`} style={f === id ? { background: CO_ACCENT } : undefined}>
            {l}
          </button>
        ))}
      </div>
    ),
    [f]
  );

  return (
    <>
      <DeskTopbar title="My caseload" sub={`${mine.length} session(s)`} right={right} />
      {/* filters also shown in-page on small screens */}
      <div className="md:hidden mb-3">{right}</div>
      <Panel className="overflow-x-auto">
        {mine.length === 0 ? (
          <EmptyState icon="groups" text="No sessions here yet" />
        ) : (
          <table className="w-full border-collapse min-w-[680px]">
            <thead><tr><Th>Student</Th><Th>Concern</Th><Th>Mode</Th><Th>When</Th><Th>Status</Th><Th right /></tr></thead>
            <tbody>
              {mine.map((a) => (
                <tr key={a.id}>
                  <Td><div className="flex items-center gap-2.5"><MiniAvatar init={a.init} size={32} /><div><div className="font-semibold">{a.studentName}</div><div className="text-[11.5px] text-ink-2">{a.cls} · {a.block}</div></div></div></Td>
                  <Td><ConcernTag concern={a.concern} /></Td>
                  <Td><ModeIcon mode={a.mode} size={17} /></Td>
                  <Td>{a.when}</Td>
                  <Td><DStatusBadge status={a.status} size="sm" /></Td>
                  <Td right>
                    <Link href={`/staff/cases/${a.id}`} className="inline-block px-4 py-2 rounded-[9px] border text-[12.5px] font-semibold" style={{ borderColor: CO_ACCENT + "40", color: CO_ACCENT }}>
                      Open
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </>
  );
}

/* ---------- Session console ---------- */
export function SessionConsole({ appt, urgency, language }: { appt: DeskAppt; urgency: string; language: string }) {
  const router = useRouter();
  const { accept, decline, pending: reqBusy } = useRequestActions();
  const draftKey = `desk-draft-${appt.id}`;
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<string[]>([""]);
  const [busy, start] = useTransition();

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(draftKey) || "null");
      if (d) { setNotes(d.notes ?? ""); setItems(d.items?.length ? d.items : [""]); }
    } catch {}
  }, [draftKey]);

  const updItem = (i: number, v: string) => setItems((a) => a.map((x, j) => (j === i ? v : x)));
  const addItem = () => setItems((a) => [...a, ""]);
  const rmItem = (i: number) => setItems((a) => a.filter((_, j) => j !== i));

  function saveDraft() {
    try { localStorage.setItem(draftKey, JSON.stringify({ notes, items })); toast.success("Draft saved on this device"); }
    catch { toast.error("Couldn't save the draft in this browser"); }
  }
  function complete() {
    start(async () => {
      const r = await completeSessionAction(appt.id, notes, items);
      if (r.success) {
        try { localStorage.removeItem(draftKey); } catch {}
        toast.success("Session completed — plan sent to the student's app");
        router.refresh();
      } else toast.error(r.error ?? "Could not complete the session");
    });
  }
  function startSession() {
    start(async () => {
      const r = await startSessionAction(appt.id);
      if (r.success) { toast.success("Session started"); router.refresh(); } else toast.error(r.error ?? "Could not start");
    });
  }

  const canStart = appt.status === "confirmed" || appt.status === "follow-up";
  const isDone = appt.status === "completed" || appt.status === "escalated";
  const back = useMemo(
    () => (
      <button onClick={() => router.push("/staff/cases")} className="inline-flex items-center gap-[5px] px-3.5 py-[9px] rounded-[10px] border border-line bg-white text-[12.5px] font-semibold text-ink">
        <MaterialIcon name="arrow_back" size={16} /> Back
      </button>
    ),
    [router]
  );

  const summary = [
    `Concern: ${appt.categories.map((c) => c.replace(/_/g, " ").toLowerCase()).join(", ")}`,
    `Urgency marked by the request: ${urgency.toLowerCase()}`,
    appt.counsellorPref ? `Counsellor preference: ${appt.counsellorPref}` : "No counsellor preference given",
    `Preferred language: ${language === "ur" ? "Urdu" : language === "hi" ? "Hindi" : "English"} · Requested ${appt.createdAt}`,
  ];

  return (
    <>
      <DeskTopbar title="Session console" sub={`${appt.studentName} · ${appt.when}`} right={back} />
      <div className="grid lg:grid-cols-[320px_1fr] gap-[18px] items-start">
        {/* student profile + pre-session summary */}
        <div className="flex flex-col gap-[18px]">
          <Panel>
            <div className="flex items-center gap-[13px] mb-4">
              <MiniAvatar init={appt.init} size={52} />
              <div><div className="font-display text-[17px] font-bold text-ink">{appt.studentName}</div><div className="text-[12.5px] text-ink-2">{appt.cls}</div></div>
            </div>
            {[
              ["Institution", <span key="i" className="text-[12.5px] font-semibold text-ink text-right max-w-[170px]">{appt.institution}</span>],
              ["Block", <span key="b" className="text-[12.5px] font-semibold text-ink text-right">{appt.block}</span>],
              ["Phone", <span key="p" className="text-[12.5px] font-semibold text-ink">{appt.phone}</span>],
              ["Concern", <ConcernTag key="c" concern={appt.concern} />],
              ["Mode", <span key="m" className="inline-flex items-center gap-[5px] text-[12.5px] font-semibold text-ink"><ModeIcon mode={appt.mode} size={16} />{modeLabel(appt.mode, true)}</span>],
              ["Status", <DStatusBadge key="s" status={appt.status} size="sm" />],
            ].map(([k, v]) => (
              <div key={k as string} className="flex justify-between items-center gap-3 py-2 border-t border-line">
                <span className="text-[12.5px] font-medium text-ink-2">{k}</span>
                {v}
              </div>
            ))}
          </Panel>

          <Panel title="Pre-session summary" sub="From the student's request" className="!bg-[linear-gradient(180deg,#fffaf2,#fff)]">
            <div className="flex flex-col gap-2.5">
              {summary.map((p, i) => (
                <div key={i} className="flex gap-[9px] items-start">
                  <span className="mt-0.5" style={{ color: CO_ACCENT }}><MaterialIcon name="auto_awesome" size={15} fill /></span>
                  <span className="text-[13px] text-ink leading-[1.45] first-letter:uppercase">{p}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* topic + notes + action plan */}
        <div className="flex flex-col gap-[18px]">
          <Panel title="Student's question">
            <p className="font-display text-[15px] font-medium text-ink leading-normal">&ldquo;{appt.topic}&rdquo;</p>
            {appt.status === "requested" && (
              <div className="flex gap-2 mt-3.5 max-w-[320px]">
                <button disabled={reqBusy} onClick={() => accept(appt.id)} className={miniBtnClass(true)}>Accept request</button>
                <button disabled={reqBusy} onClick={() => { decline(appt.id); router.push("/staff/requests"); }} className={miniBtnClass(false)}>Decline</button>
              </div>
            )}
            {canStart && (
              <button disabled={busy} onClick={startSession} className="mt-3.5 inline-flex items-center gap-[7px] px-[18px] py-2.5 rounded-[11px] bg-[#10b981] text-white text-[13.5px] font-bold disabled:opacity-60">
                <MaterialIcon name="play_circle" size={18} fill /> Start session
              </button>
            )}
          </Panel>

          {isDone ? (
            <Panel title="Session completed">
              <p className="text-[13.5px] text-ink-2 leading-relaxed">
                This session is closed. The student can see their next steps in the app. Notes are stored as an encrypted guidance report.
              </p>
              <div className="flex flex-wrap gap-2 mt-3.5">
                <Link href={`/staff/reports?caseId=${appt.id}`} className="btn btn-outline btn-sm">View reports</Link>
                <Link href="/staff/follow-ups" className="btn btn-outline btn-sm">Follow-ups</Link>
                <Link href={`/staff/messages?thread=${appt.id}`} className="btn btn-outline btn-sm">Message student</Link>
              </div>
            </Panel>
          ) : (
            <>
              <Panel title="Private case notes" sub="Visible only to counselling staff">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you discuss? Observations, context, next steps…"
                  className="w-full min-h-[130px] rounded-[12px] border border-line p-3.5 text-[14px] text-ink resize-y outline-none focus:border-kashmir leading-normal"
                />
              </Panel>

              <Panel title="Action plan" sub="Shared with the student in their app">
                <div className="flex flex-col gap-2.5">
                  {items.map((it, i) => (
                    <div key={i} className="flex gap-[9px] items-center">
                      <span className="w-6 h-6 rounded-[7px] grid place-items-center text-[11px] font-bold shrink-0" style={{ background: CO_ACCENT + "18", color: CO_ACCENT }}>{i + 1}</span>
                      <input value={it} onChange={(e) => updItem(i, e.target.value)} placeholder="e.g. Register for IBPS alerts" className="field !min-h-[42px] !h-[42px]" />
                      {items.length > 1 && (
                        <button onClick={() => rmItem(i)} aria-label="Remove step" className="text-ink-2 grid place-items-center"><MaterialIcon name="close" size={18} /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={addItem} className="self-start inline-flex items-center gap-1.5 border border-dashed border-line rounded-[10px] px-3.5 py-[9px] text-[12.5px] font-semibold" style={{ color: CO_ACCENT }}>
                    <MaterialIcon name="add" size={17} /> Add step
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5 mt-[18px] pt-4 border-t border-line">
                  <button onClick={saveDraft} className="px-[18px] py-[11px] rounded-[11px] border border-line bg-white text-[13.5px] font-semibold text-ink">Save draft</button>
                  <button
                    disabled={busy || appt.status === "requested"}
                    onClick={complete}
                    title={appt.status === "requested" ? "Accept the request first" : undefined}
                    className="flex-1 min-w-[220px] px-[18px] py-[11px] rounded-[11px] text-white text-[13.5px] font-bold inline-flex items-center justify-center gap-[7px] disabled:opacity-50"
                    style={{ background: CO_ACCENT }}
                  >
                    <MaterialIcon name="check_circle" size={18} fill /> Complete session &amp; send plan
                  </button>
                </div>
              </Panel>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- Messages ---------- */
export type Thread = {
  requestId: string;
  studentName: string;
  init: string;
  messages: { from: "student" | "counsellor"; text: string; ts: string }[];
};

export function CoMessages({ threads, initial }: { threads: Thread[]; initial?: string | null }) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(initial && threads.some((t) => t.requestId === initial) ? initial : threads[0]?.requestId ?? null);
  const [draft, setDraft] = useState("");
  const [busy, start] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const thread = threads.find((t) => t.requestId === active);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [active, thread?.messages.length]);

  // light polling so replies show up without a manual refresh
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 15000);
    return () => clearInterval(id);
  }, [router]);

  function send() {
    const text = draft.trim();
    if (!text || !active) return;
    start(async () => {
      const r = await sendCaseMessageAction(active, text);
      if (r.success) { setDraft(""); router.refresh(); } else toast.error(r.error ?? "Message not sent");
    });
  }

  const right = useMemo(
    () => <Link href="/staff/inbox" className="text-[12.5px] font-semibold text-kashmir hover:underline">Anonymous chat inbox →</Link>,
    []
  );

  return (
    <>
      <DeskTopbar title="Messages" sub="Async chat with your students" right={right} />
      <div className="grid md:grid-cols-[300px_1fr] bg-surface border border-line rounded-[18px] overflow-hidden h-[calc(100vh-190px)] min-h-[420px]">
        <div className="border-b md:border-b-0 md:border-r border-line overflow-y-auto bg-white max-h-[200px] md:max-h-none">
          {threads.length === 0 && <EmptyState icon="forum" text="No conversations yet" />}
          {threads.map((t) => {
            const last = t.messages[t.messages.length - 1];
            const on = active === t.requestId;
            return (
              <button key={t.requestId} onClick={() => setActive(t.requestId)} className={`flex gap-[11px] items-center px-4 py-3.5 w-full text-left border-b border-line ${on ? "bg-surface-alt" : "bg-white hover:bg-page"}`}>
                <MiniAvatar init={t.init} />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[13.5px] font-semibold text-ink">{t.studentName}</div>
                  <div className="text-[12px] text-ink-2 truncate">{last ? last.text : "No messages yet"}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col bg-page min-w-0 min-h-0">
          {thread ? (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
                {thread.messages.length === 0 && <div className="text-center text-ink-2 text-[13px] mt-8">Say hello to {thread.studentName.split(" ")[0]} 👋</div>}
                {thread.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "counsellor" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[62%] px-3.5 py-2.5 text-[13.5px] leading-[1.45] ${m.from === "counsellor" ? "text-white rounded-[14px_14px_4px_14px]" : "bg-white text-ink border border-line rounded-[14px_14px_14px_4px]"}`}
                      style={m.from === "counsellor" ? { background: CO_ACCENT } : undefined}
                    >
                      {m.text}
                      <div className="text-[10px] opacity-60 mt-1">{m.ts}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-line bg-white flex gap-2.5">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" className="field flex-1" />
                <button onClick={send} disabled={busy} aria-label="Send" className="w-12 rounded-[12px] text-white grid place-items-center disabled:opacity-60" style={{ background: CO_ACCENT }}>
                  <MaterialIcon name="send" size={19} fill />
                </button>
              </div>
            </>
          ) : (
            <EmptyState icon="forum" text="No conversations yet" />
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- Availability ---------- */
export function CoAvailability({ onDuty: initialDuty, slots: initialSlots }: { onDuty: boolean; slots: { dayOfWeek: number; time: string }[] }) {
  const router = useRouter();
  const [duty, setDuty] = useState(initialDuty);
  const [slots, setSlots] = useState(() => new Set(initialSlots.map((s) => `${s.dayOfWeek}|${s.time}`)));
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function persist(next: Set<string>) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSaving(true);
      const r = await saveWeeklySlotsAction([...next].map((k) => { const [d, t] = k.split("|"); return { dayOfWeek: Number(d), time: t }; }));
      setSaving(false);
      if (!r.success) toast.error(r.error ?? "Could not save availability");
    }, 600);
  }
  function toggle(dow: number, time: string) {
    setSlots((prev) => {
      const next = new Set(prev);
      const k = `${dow}|${time}`;
      if (next.has(k)) next.delete(k); else next.add(k);
      persist(next);
      return next;
    });
  }
  async function flipDuty() {
    const next = !duty;
    setDuty(next);
    const r = await setDutyAction(next);
    if (!r.success) { setDuty(!next); toast.error(r.error ?? "Could not update"); }
    else { toast.success(next ? "You're on duty — students can book you" : "You're off duty — hidden from new bookings"); router.refresh(); }
  }

  const right = (
    <button onClick={flipDuty} className="inline-flex items-center gap-[7px] px-[15px] py-[9px] rounded-[10px] text-[13px] font-bold" style={{ background: duty ? "#e7f7f0" : "#fee2e2", color: duty ? "#067a55" : "#b91c1c" }}>
      <span className="w-2 h-2 rounded-full" style={{ background: duty ? "#10b981" : "#ef4444" }} />
      {duty ? "On duty" : "Off duty"}
    </button>
  );

  return (
    <>
      <DeskTopbar title="My availability" sub="Slots students can book" right={right} />
      <div className="md:hidden mb-3">{right}</div>
      <Panel title="Weekly slots" sub={saving ? "Saving…" : "Tap to toggle a slot on or off — changes save automatically"} className="overflow-x-auto">
        <div className="grid gap-2 min-w-[640px]" style={{ gridTemplateColumns: `90px repeat(${SLOT_TIMES.length}, 1fr)` }}>
          <div />
          {SLOT_TIMES.map((t) => <div key={t.value} className="text-[11px] font-semibold text-ink-2 text-center">{t.label}</div>)}
          {DAYS.map((d) => (
            <React.Fragment key={d.dow}>
              <div className="font-display text-[13px] font-bold text-ink flex items-center">{d.label}</div>
              {SLOT_TIMES.map((t) => {
                const on = slots.has(`${d.dow}|${t.value}`);
                return (
                  <button
                    key={t.value}
                    onClick={() => toggle(d.dow, t.value)}
                    aria-pressed={on}
                    aria-label={`${d.label} ${t.label}`}
                    className={`h-[38px] rounded-[9px] grid place-items-center ${on ? "text-white" : "bg-white border border-line text-line"}`}
                    style={on ? { background: CO_ACCENT } : undefined}
                  >
                    <MaterialIcon name={on ? "check" : "add"} size={16} />
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </Panel>
    </>
  );
}
