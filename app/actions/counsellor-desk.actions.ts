"use server";

/* Counsellor desk actions (design: desk-counsellor.jsx) backed by the real database. */

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { encrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

async function myCounsellor() {
  const user = await requireAuth();
  if (user.role !== "COUNSELLOR") throw new Error("Counsellors only");
  const profile = await prisma.counsellorProfile.findUnique({ where: { userId: user.id } });
  if (!profile) throw new Error("Counsellor profile not found");
  return { user, profile };
}

/* The request must be assigned to me */
async function myRequest(requestId: string) {
  const me = await myCounsellor();
  const request = await prisma.supportRequest.findFirst({
    where: { id: requestId, assignedCounsellorId: me.profile.id },
    include: { student: { select: { userId: true, firstName: true } } },
  });
  if (!request) throw new Error("This request isn't assigned to you");
  return { ...me, request };
}

function refresh(requestId?: string) {
  for (const p of ["/staff/dashboard", "/staff/requests", "/staff/cases", "/staff/messages", "/student/sessions"]) revalidatePath(p);
  if (requestId) {
    revalidatePath(`/staff/cases/${requestId}`);
    revalidatePath(`/student/sessions/${requestId}`);
  }
}

async function notifyStudent(userId: string, type: "ASSIGNMENT_ACCEPTED" | "CASE_RESOLVED", title: string, body: string, requestId: string) {
  await prisma.notification.create({
    data: { userId, type, channel: "IN_APP", title, body, metadata: { requestId } },
  });
}

type Result = { success: true } | { success: false; error: string };
const fail = (e: unknown): Result => ({ success: false, error: e instanceof Error ? e.message : "Something went wrong" });

export async function acceptRequestAction(requestId: string): Promise<Result> {
  try {
    const { profile, request } = await myRequest(requestId);
    const pending = await prisma.requestAssignment.findFirst({
      where: { requestId, counsellorId: profile.id, status: "PENDING_ACCEPTANCE" },
    });
    await prisma.$transaction([
      ...(pending ? [prisma.requestAssignment.update({ where: { id: pending.id }, data: { status: "ACCEPTED", respondedAt: new Date() } })] : []),
      prisma.supportRequest.update({ where: { id: requestId }, data: { status: "COUNSELLOR_ASSIGNED" } }),
    ]);
    await notifyStudent(request.student.userId, "ASSIGNMENT_ACCEPTED", "Session confirmed", "Your counsellor has confirmed your session.", requestId);
    refresh(requestId);
    return { success: true };
  } catch (e) { return fail(e); }
}

export async function declineRequestAction(requestId: string, reason?: string): Promise<Result> {
  try {
    const { profile, request } = await myRequest(requestId);
    const pending = await prisma.requestAssignment.findFirst({
      where: { requestId, counsellorId: profile.id, status: "PENDING_ACCEPTANCE" },
    });
    await prisma.$transaction([
      ...(pending ? [prisma.requestAssignment.update({ where: { id: pending.id }, data: { status: "REJECTED", rejectionReason: reason, respondedAt: new Date() } })] : []),
      // back to the admin pool for re-assignment (same as the existing flow)
      prisma.supportRequest.update({ where: { id: requestId }, data: { status: "UNDER_REVIEW", assignedCounsellorId: null } }),
    ]);
    // Tell the student — the Center will assign someone else
    await prisma.notification.create({
      data: {
        userId: request.student.userId, type: "SYSTEM", channel: "IN_APP",
        title: "Your counsellor is unavailable",
        body: "The counsellor you chose can't take this session. The Center will assign another counsellor shortly.",
        metadata: { requestId },
      },
    });
    const admins = await prisma.user.findMany({ where: { role: "ADMIN", isActive: true }, select: { id: true } });
    if (admins.length) {
      await prisma.notification.createMany({
        data: admins.map((a) => ({
          userId: a.id, type: "ASSIGNMENT_REJECTED" as const, channel: "IN_APP" as const,
          title: "Counsellor declined a request",
          body: `Reassignment needed for ${request.student.firstName}'s request.`,
          metadata: { requestId },
        })),
      });
    }
    refresh(requestId);
    return { success: true };
  } catch (e) { return fail(e); }
}

export async function startSessionAction(requestId: string): Promise<Result> {
  try {
    await myRequest(requestId);
    await prisma.supportRequest.update({ where: { id: requestId }, data: { status: "IN_PROGRESS" } });
    refresh(requestId);
    return { success: true };
  } catch (e) { return fail(e); }
}

/* "Complete session & send plan": encrypted notes → guidance report,
   each action-plan step → a follow-up the student sees in their app. */
export async function completeSessionAction(requestId: string, notes: string, plan: string[]): Promise<Result> {
  try {
    const { profile, request } = await myRequest(requestId);
    const steps = plan.map((s) => s.trim()).filter(Boolean).slice(0, 20);
    const inAWeek = new Date(Date.now() + 7 * 86400000);
    const topic = request.description.split("\n")[0] ?? "";

    await prisma.$transaction([
      prisma.guidanceReport.create({
        data: {
          requestId,
          counsellorId: profile.id,
          studentId: request.studentId,
          sessionDate: new Date(),
          concernsEncrypted: encrypt(topic),
          observationsEncrypted: encrypt(notes.trim() || "—"),
          supportEncrypted: encrypt("Counselling session (desk console)"),
          recommendationsEncrypted: encrypt(steps.join("\n") || "—"),
          followUpRequired: steps.length > 0,
          followUpDate: steps.length ? inAWeek : null,
          escalationRequired: false,
          referralRequired: false,
        },
      }),
      ...steps.map((purpose) =>
        prisma.supportFollowUp.create({
          data: { requestId, counsellorId: profile.id, scheduledDate: inAWeek, purpose, status: "PENDING" },
        })
      ),
      prisma.supportRequest.update({ where: { id: requestId }, data: { status: "RESOLVED", resolvedAt: new Date() } }),
    ]);
    await notifyStudent(
      request.student.userId,
      "CASE_RESOLVED",
      "Session completed",
      steps.length ? `Your counsellor shared ${steps.length} next step${steps.length > 1 ? "s" : ""} in your app.` : "Your counselling session is complete.",
      requestId
    );
    refresh(requestId);
    revalidatePath("/staff/reports");
    revalidatePath("/staff/follow-ups");
    return { success: true };
  } catch (e) { return fail(e); }
}

export async function setDutyAction(onDuty: boolean): Promise<Result> {
  try {
    const { profile } = await myCounsellor();
    await prisma.counsellorProfile.update({ where: { id: profile.id }, data: { acceptingPatients: onDuty } });
    revalidatePath("/staff/schedule");
    revalidatePath("/student/talk");
    return { success: true };
  } catch (e) { return fail(e); }
}

/* Weekly grid → CounsellorAvailability rows (one hour per ticked slot) */
export async function saveWeeklySlotsAction(slots: { dayOfWeek: number; time: string }[]): Promise<Result> {
  try {
    const { profile } = await myCounsellor();
    const clean = slots
      .filter((s) => Number.isInteger(s.dayOfWeek) && s.dayOfWeek >= 0 && s.dayOfWeek <= 6 && /^\d{2}:\d{2}$/.test(s.time))
      .slice(0, 100);
    const plusHour = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };
    await prisma.$transaction([
      prisma.counsellorAvailability.deleteMany({ where: { counsellorId: profile.id } }),
      prisma.counsellorAvailability.createMany({
        data: clean.map((s) => ({ counsellorId: profile.id, dayOfWeek: s.dayOfWeek, startTime: s.time, endTime: plusHour(s.time), slotDuration: 60, isActive: true })),
      }),
    ]);
    revalidatePath("/staff/schedule");
    return { success: true };
  } catch (e) { return fail(e); }
}

/* Async chat on a request — usable by the student who owns it or its assigned counsellor */
export async function sendCaseMessageAction(requestId: string, text: string): Promise<Result> {
  try {
    const body = text.trim().slice(0, 2000);
    if (!body) return { success: false, error: "Message is empty" };
    const user = await requireAuth();
    const request = await prisma.supportRequest.findUnique({
      where: { id: requestId },
      include: { student: { select: { userId: true } }, assignedCounsellor: { select: { userId: true } } },
    });
    if (!request) return { success: false, error: "Request not found" };
    const isStudent = user.role === "STUDENT" && request.student.userId === user.id;
    const isCounsellor = user.role === "COUNSELLOR" && request.assignedCounsellor?.userId === user.id;
    if (!isStudent && !isCounsellor) return { success: false, error: "Not allowed" };

    await prisma.supportMessage.create({
      data: { requestId, senderRole: isStudent ? "STUDENT" : "COUNSELLOR", senderUserId: user.id, bodyEncrypted: encrypt(body) },
    });
    const recipient = isStudent ? request.assignedCounsellor?.userId : request.student.userId;
    if (recipient) {
      await prisma.notification.create({
        data: { userId: recipient, type: "SYSTEM", channel: "IN_APP", title: "New message", body: body.slice(0, 120), metadata: { requestId } },
      });
    }
    revalidatePath("/staff/messages");
    revalidatePath(`/student/sessions/${requestId}/chat`);
    return { success: true };
  } catch (e) { return fail(e); }
}
