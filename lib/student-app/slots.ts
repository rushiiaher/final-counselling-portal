/* Booking-slot helpers shared by the student app and the counsellor desk.
   All wall-clock times are India Standard Time (UTC+5:30), regardless of the
   server's own time zone, so a session booked for "10:30" is 10:30 in Anantnag. */

const IST_OFFSET_MIN = 330;
const TZ = "Asia/Kolkata";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* Center slot times (24h). Same grid as the counsellor's Availability screen. */
export const CENTER_TIMES = ["09:30", "10:30", "11:30", "12:30", "14:00", "15:00", "16:00", "17:00"];
/* When a counsellor hasn't set availability yet: Mon–Sat, all center times */
export const DEFAULT_WEEK = [1, 2, 3, 4, 5, 6].flatMap((dayOfWeek) => CENTER_TIMES.map((time) => ({ dayOfWeek, time })));

/** IST calendar parts of an instant */
function istParts(d: Date) {
  const s = new Date(d.getTime() + IST_OFFSET_MIN * 60000);
  return { y: s.getUTCFullYear(), m: s.getUTCMonth(), d: s.getUTCDate(), dow: s.getUTCDay(), h: s.getUTCHours(), mi: s.getUTCMinutes() };
}
/** Instant for an IST wall-clock time */
function istDate(y: number, m: number, d: number, h: number, mi: number) {
  return new Date(Date.UTC(y, m, d, h, mi) - IST_OFFSET_MIN * 60000);
}
const istDayKey = (d: Date) => { const p = istParts(d); return Date.UTC(p.y, p.m, p.d); };

export function isSameDay(a: Date, b: Date) {
  return istDayKey(a) === istDayKey(b);
}

/** "Today · 3:00 pm" / "Tomorrow · 10:30 am" / "Wed, 19 Nov · 4:00 pm" (IST) */
export function formatWhen(date: Date, now = new Date()): string {
  const diffDays = Math.round((istDayKey(date) - istDayKey(now)) / 86400000);
  const time = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ });
  const dayLabel =
    diffDays === 0 ? "Today" :
    diffDays === 1 ? "Tomorrow" :
    diffDays === -1 ? "Yesterday" :
    date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });
  return `${dayLabel} · ${time}`;
}

export function dayLabel(date: Date, now = new Date()) {
  return formatWhen(date, now).split(" · ")[0];
}

export type Slot = { iso: string; label: string; day: string; time: string };

/**
 * Bookable slots for the next `days` days (IST), from a weekly availability
 * pattern, skipping times already taken and anything less than an hour away.
 */
export function buildSlots(
  weekly: { dayOfWeek: number; time: string }[],
  taken: Set<string> = new Set(),
  now = new Date(),
  days = 7
): Slot[] {
  const byDow = new Map<number, string[]>();
  for (const w of weekly) byDow.set(w.dayOfWeek, [...(byDow.get(w.dayOfWeek) ?? []), w.time]);
  const today = istParts(now);
  const earliest = now.getTime() + 60 * 60000;
  const out: Slot[] = [];
  for (let i = 0; i < days; i++) {
    const base = new Date(Date.UTC(today.y, today.m, today.d + i));
    const dow = base.getUTCDay();
    const times = [...(byDow.get(dow) ?? [])].sort();
    for (const t of times) {
      const [h, mi] = t.split(":").map(Number);
      const at = istDate(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), h, mi);
      if (at.getTime() < earliest || taken.has(at.toISOString())) continue;
      const label = formatWhen(at, now);
      const [day, time] = label.split(" · ");
      out.push({ iso: at.toISOString(), label, day, time });
    }
  }
  return out;
}

/* ---- legacy: relative labels from older bookings ("Today · 03:00") ---- */
function toHours24(time: string) {
  const [h, m] = time.split(":").map(Number);
  return { h: h < 9 ? h + 12 : h, m: m || 0 };
}
export function slotToDate(slot: string, now = new Date()): Date | null {
  const [dayPart, timePart] = slot.split("·").map((x) => x.trim());
  if (!dayPart || !timePart) return null;
  const p = istParts(now);
  let add = 0;
  if (dayPart === "Tomorrow") add = 1;
  else if (dayPart !== "Today") {
    const target = WEEKDAYS.indexOf(dayPart);
    if (target < 0) return null;
    add = (target - p.dow + 7) % 7 || 7;
  }
  const { h, m } = toHours24(timePart);
  return istDate(p.y, p.m, p.d + add, h, m);
}
