"use server";

import { ServiceCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { submitSupportRequestAction } from "./support-request.actions";
import { CONCERNS, MODES } from "@/lib/student-app/data";
import { formatWhen } from "@/lib/student-app/slots";
import { openSlotsFor, centerSlots } from "@/lib/desk/availability";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";

/* "Talk to a counsellor" (design: student-counselling.jsx → BookCounselling).
   Saved as a real SupportRequest so admins / counsellors see it in their portals.
   Mode, preferred counsellor and time have no dedicated columns, so they are
   written into the request description in a fixed, readable format. */
export async function requestCounsellingAction(input: {
  concern: string;
  mode: string;
  counsellorId?: string | null;
  slotISO: string;
  topic?: string;
}) {
  const concern = CONCERNS.find((c) => c.id === input.concern);
  const mode = MODES.find((m) => m.id === input.mode);
  if (!concern || !mode || !input.slotISO) return { success: false, error: "Please complete every step." };

  // The time must be a real slot: in the future, within the booking window,
  // and — for a chosen counsellor — still free in their availability.
  const at = new Date(input.slotISO);
  const now = Date.now();
  if (Number.isNaN(at.getTime()) || at.getTime() < now || at.getTime() > now + 8 * 86400000) {
    return { success: false, error: "That time is no longer available. Please pick another slot." };
  }
  let counsellor: { id: string; userId: string; name: string } | null = null;
  if (input.counsellorId) {
    const c = await prisma.counsellorProfile.findFirst({
      where: { id: input.counsellorId, acceptingPatients: true, deletedAt: null, user: { isActive: true } },
      select: { id: true, userId: true, user: { select: { name: true } } },
    });
    if (!c) return { success: false, error: "This counsellor isn't taking bookings right now. Please choose another." };
    const free = (await openSlotsFor([c.id])).get(c.id) ?? [];
    if (!free.some((s) => s.iso === at.toISOString())) {
      return { success: false, error: "Sorry — that slot was just taken. Please pick another time." };
    }
    counsellor = { id: c.id, userId: c.userId, name: c.user?.name ?? "Counsellor" };
  } else if (!centerSlots().some((s) => s.iso === at.toISOString())) {
    return { success: false, error: "Please pick one of the listed times." };
  }

  const topic = (input.topic ?? "").trim().slice(0, 2000) || `General ${concern.en.toLowerCase()}`;
  const slotLabel = formatWhen(at);
  const description = [
    topic,
    "",
    `Concern: ${concern.en}`,
    `Preferred mode: ${mode.en}`,
    `Preferred counsellor: ${counsellor?.name ?? "Any available counsellor"}`,
    `Preferred time: ${slotLabel}`,
    `Preferred date: ${at.toISOString()}`,
  ].join("\n");

  const res = await submitSupportRequestAction({
    serviceCategories: [concern.category as ServiceCategory],
    description,
    urgency: input.concern === "wellbeing" ? "HIGH" : "MEDIUM",
    preferredLanguage: "en",
  });
  if (!res.success) return { success: false, error: res.error as string };
  const requestId = (res as any).data.id as string;

  // The student chose a specific counsellor → send it straight to them to accept / decline
  // (design: the request appears in that counsellor's "Requests"). "Any" stays with admin.
  if (counsellor) {
    try {
      const user = await requireAuth();
      await prisma.$transaction([
        prisma.supportRequest.update({ where: { id: requestId }, data: { assignedCounsellorId: counsellor.id } }),
        prisma.requestAssignment.create({
          data: { requestId, counsellorId: counsellor.id, assignedById: user.id, status: "PENDING_ACCEPTANCE" },
        }),
        prisma.notification.create({
          data: {
            userId: counsellor.userId,
            type: "REQUEST_ASSIGNED",
            channel: "IN_APP",
            title: "New counselling request",
            body: `A student requested a ${mode.en.split(" at")[0].toLowerCase()} session (${slotLabel}).`,
            metadata: { requestId },
          },
        }),
      ]);
    } catch (e) {
      console.error("Direct assignment failed — request stays with admin", e);
    }
  }

  revalidatePath("/student/sessions");
  revalidatePath("/staff/requests");
  return { success: true, id: requestId };
}

/* Mentor Connect booking — goes to the chosen counsellor (or admin if no match). */
export async function requestMentorAction(input: { mentorName: string; mentorRole: string; slot: string }) {
  if (!input.mentorName || !input.slot) return { success: false, error: "Pick a slot first." };
  // New students must finish their profile (details + consent) before booking
  const me = await requireAuth();
  const account = await prisma.user.findUnique({
    where: { id: me.id },
    select: { profileCompleted: true, studentProfile: { select: { id: true } } },
  });
  if (!account?.studentProfile || !account.profileCompleted) {
    return { success: false, needsProfile: true, error: "Please complete your profile before booking." };
  }
  const description = [
    `Mentor session request with ${input.mentorName} (${input.mentorRole}).`,
    "",
    "Concern: Mentor Connect",
    "Preferred mode: Video call",
    `Preferred counsellor: ${input.mentorName} (mentor)`,
    `Preferred time: ${input.slot}`,
  ].join("\n");

  const res = await submitSupportRequestAction({
    serviceCategories: ["CAREER_COUNSELLING"],
    description,
    urgency: "LOW",
    preferredLanguage: "en",
  });
  if (!res.success) return { success: false, error: res.error as string };
  const requestId = (res as any).data.id as string;

  // Mentors are the Center's own counsellors → send the request straight to that
  // counsellor's "Requests" to accept / decline. If no account matches, it stays with admin.
  try {
    const c = await prisma.counsellorProfile.findFirst({
      where: { deletedAt: null, user: { name: input.mentorName, isActive: true, role: "COUNSELLOR" } },
      select: { id: true, userId: true },
    });
    if (c) {
      const user = await requireAuth();
      await prisma.$transaction([
        prisma.supportRequest.update({ where: { id: requestId }, data: { assignedCounsellorId: c.id } }),
        prisma.requestAssignment.create({
          data: { requestId, counsellorId: c.id, assignedById: user.id, status: "PENDING_ACCEPTANCE" },
        }),
        prisma.notification.create({
          data: {
            userId: c.userId,
            type: "REQUEST_ASSIGNED",
            channel: "IN_APP",
            title: "New mentor session request",
            body: `A student booked a mentor session with you (${input.slot}).`,
            metadata: { requestId },
          },
        }),
      ]);
    }
  } catch (e) {
    console.error("Mentor direct assignment failed — request stays with admin", e);
  }

  revalidatePath("/student/sessions");
  revalidatePath("/staff/requests");
  return { success: true };
}
