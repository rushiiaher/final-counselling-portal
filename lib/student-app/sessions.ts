/* Maps real SupportRequest rows to the design's "session" cards. */

import { MODES, CONCERNS } from "./data";
import { formatWhen } from "./slots";

export type SessionView = {
  id: string;
  status: string;
  topic: string;
  counsellor: string | null;
  mode: string | null;      // design mode id: in-person | video | phone
  modeLabel: string | null;
  time: string | null;
  categories: string[];
  createdAt: string;
  followUps: { purpose: string; date: string; done: boolean }[];
};

/* Requests made from the app store mode/time as "Key: value" lines. */
export function parseDescription(description: string) {
  const lines = description.split("\n");
  const get = (key: string) => lines.find((l) => l.startsWith(key + ": "))?.slice(key.length + 2).trim() ?? null;
  const modeLabel = get("Preferred mode");
  const mode = MODES.find((m) => m.en === modeLabel)?.id ?? null;
  const firstBlank = lines.findIndex((l) => l.trim() === "");
  const topic = (firstBlank > 0 ? lines.slice(0, firstBlank) : lines.filter((l) => !/^[A-Z][\w ]+: /.test(l))).join(" ").trim();
  const concernLabel = get("Concern");
  const concern = CONCERNS.find((c) => c.en === concernLabel)?.id ?? null;
  const iso = get("Preferred date");
  const date = iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso) : null;
  const time = date ? formatWhen(date) : get("Preferred time");
  return { topic: topic || description.slice(0, 140), mode, modeLabel, time, date, concern, counsellorPref: get("Preferred counsellor") };
}

export const SESSION_STATUS: Record<string, { label: string; bg: string; fg: string; dot: string }> = {
  SUBMITTED: { label: "Requested", bg: "#fff4e0", fg: "#b45309", dot: "#f59e0b" },
  UNDER_REVIEW: { label: "Under review", bg: "#fff4e0", fg: "#b45309", dot: "#f59e0b" },
  COUNSELLOR_ASSIGNED: { label: "Confirmed", bg: "#e7eeff", fg: "#0f4c81", dot: "#0f4c81" },
  SESSION_SCHEDULED: { label: "Scheduled", bg: "#e0f2fe", fg: "#0369a1", dot: "#0ea5e9" },
  IN_PROGRESS: { label: "In session", bg: "#e7f7f0", fg: "#067a55", dot: "#10b981" },
  FOLLOW_UP_REQUIRED: { label: "Follow-up", bg: "#e0f2fe", fg: "#0369a1", dot: "#0ea5e9" },
  RESOLVED: { label: "Completed", bg: "#eef2f7", fg: "#475569", dot: "#94a3b8" },
  ESCALATED: { label: "Escalated", bg: "#fee2e2", fg: "#b91c1c", dot: "#ef4444" },
};

/* Timeline shown on the session detail screen */
export const SESSION_STEPS: [string, string][] = [
  ["Requested", "SUBMITTED"],
  ["Under review", "UNDER_REVIEW"],
  ["Counsellor assigned", "COUNSELLOR_ASSIGNED"],
  ["Session scheduled", "SESSION_SCHEDULED"],
  ["In session", "IN_PROGRESS"],
  ["Completed", "RESOLVED"],
];

export function stepIndex(status: string) {
  if (status === "FOLLOW_UP_REQUIRED") return 4; // between in-session and completed
  return SESSION_STEPS.findIndex(([, s]) => s === status);
}
