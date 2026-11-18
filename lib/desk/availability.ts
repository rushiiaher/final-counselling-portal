import prisma from "@/lib/prisma";
import { buildSlots, DEFAULT_WEEK, type Slot } from "@/lib/student-app/slots";

const OPEN_STATUSES = ["SUBMITTED", "UNDER_REVIEW", "COUNSELLOR_ASSIGNED", "SESSION_SCHEDULED", "IN_PROGRESS", "FOLLOW_UP_REQUIRED"] as const;

function preferredDate(description: string): string | null {
  const line = description.split("\n").find((l) => l.startsWith("Preferred date: "));
  const iso = line?.slice("Preferred date: ".length).trim();
  return iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso).toISOString() : null;
}

/**
 * Open booking slots (next 7 days) for each counsellor:
 * their weekly Availability (or the center default if none is set),
 * minus times already held by an open request assigned to them.
 */
export async function openSlotsFor(counsellorIds: string[], now = new Date()): Promise<Map<string, Slot[]>> {
  if (counsellorIds.length === 0) return new Map();
  const [avail, booked] = await Promise.all([
    prisma.counsellorAvailability.findMany({
      where: { counsellorId: { in: counsellorIds }, isActive: true },
      select: { counsellorId: true, dayOfWeek: true, startTime: true },
    }),
    prisma.supportRequest.findMany({
      where: { assignedCounsellorId: { in: counsellorIds }, status: { in: [...OPEN_STATUSES] } },
      select: { assignedCounsellorId: true, description: true },
    }),
  ]);

  const weekly = new Map<string, { dayOfWeek: number; time: string }[]>();
  for (const a of avail) weekly.set(a.counsellorId, [...(weekly.get(a.counsellorId) ?? []), { dayOfWeek: a.dayOfWeek, time: a.startTime }]);

  const taken = new Map<string, Set<string>>();
  for (const r of booked) {
    const iso = preferredDate(r.description);
    if (!iso || !r.assignedCounsellorId) continue;
    if (!taken.has(r.assignedCounsellorId)) taken.set(r.assignedCounsellorId, new Set());
    taken.get(r.assignedCounsellorId)!.add(iso);
  }

  const out = new Map<string, Slot[]>();
  for (const id of counsellorIds) {
    out.set(id, buildSlots(weekly.get(id) ?? DEFAULT_WEEK, taken.get(id) ?? new Set(), now));
  }
  return out;
}

/** Slots for "Any available counsellor" — the center's normal hours */
export function centerSlots(now = new Date()) {
  return buildSlots(DEFAULT_WEEK, new Set(), now);
}
