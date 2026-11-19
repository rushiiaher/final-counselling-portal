import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { parseDescription } from "@/lib/student-app/sessions";
import { formatWhen, isSameDay } from "@/lib/student-app/slots";

/* One row of the counsellor desk (design: an "appointment" in desk-counsellor.jsx),
   built from a real SupportRequest assigned to this counsellor. */
export type DeskAppt = {
  id: string;
  studentId: string;
  studentName: string;
  init: string;
  institution: string;
  block: string;
  cls: string;
  phone: string;
  concern: string;           // career | exam | studies | wellbeing | personal
  mode: string | null;       // in-person | video | phone
  when: string;              // "Today · 3:00 pm" …
  dateISO: string | null;
  isToday: boolean;
  topic: string;
  status: string;            // design status key (requested, confirmed, in-progress, follow-up, completed, escalated)
  urgency: string;
  categories: string[];
  counsellorPref: string | null;
  createdAt: string;
};

const CATEGORY_CONCERN: Record<string, string> = {
  CAREER_COUNSELLING: "career",
  EDUCATIONAL_GUIDANCE: "studies",
  MENTAL_WELLNESS: "wellbeing",
  PERSONAL_COUNSELLING: "personal",
  FAMILY_COUNSELLING: "personal",
  YOUTH_GUIDANCE: "career",
  SKILL_DEVELOPMENT: "studies",
  CRISIS_SUPPORT: "wellbeing",
};

export function designStatus(status: string, pendingAcceptance: boolean) {
  if (pendingAcceptance) return "requested";
  switch (status) {
    case "IN_PROGRESS": return "in-progress";
    case "FOLLOW_UP_REQUIRED": return "follow-up";
    case "RESOLVED": return "completed";
    case "ESCALATED": return "escalated";
    default: return "confirmed"; // SUBMITTED / UNDER_REVIEW / COUNSELLOR_ASSIGNED / SESSION_SCHEDULED
  }
}

const initials = (n: string) =>
  n.split(" ").filter((w) => w && !/^(dr|mr|mrs|ms|prof)\.?$/i.test(w)).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "S";

export async function loadCounsellorDesk() {
  const user = await requireAuth();
  const profile = await prisma.counsellorProfile.findUnique({
    where: { userId: user.id },
    include: { user: { select: { name: true } } },
  });
  if (!profile) return null;

  const rows = await prisma.supportRequest.findMany({
    where: { assignedCounsellorId: profile.id },
    include: {
      student: {
        include: {
          user: { select: { name: true } },
          institution: { select: { name: true } },
        },
      },
      assignments: { where: { counsellorId: profile.id, status: "PENDING_ACCEPTANCE" }, select: { id: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const appts: DeskAppt[] = rows.map((r) => {
    const p = parseDescription(r.description);
    const name = r.student.user?.name ?? [r.student.firstName, r.student.lastName].filter(Boolean).join(" ");
    const date = p.date;
    return {
      id: r.id,
      studentId: r.studentId,
      studentName: name,
      init: initials(name),
      institution: r.student.institution?.name ?? r.student.school ?? (r.student.district ? `${r.student.district} district` : "—"),
      block: r.student.area ?? r.student.district ?? "—",
      cls: r.student.grade ?? r.student.ageRange ?? "Student",
      phone: r.student.mobile ?? r.student.guardianPhone ?? "—",
      concern: p.concern ?? CATEGORY_CONCERN[r.serviceCategories[0]] ?? "career",
      mode: p.mode,
      when: date ? formatWhen(date, now) : p.time ?? `Requested ${r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
      dateISO: date ? date.toISOString() : null,
      isToday: date ? isSameDay(date, now) : false,
      topic: p.topic,
      status: designStatus(r.status, r.assignments.length > 0),
      urgency: r.urgency,
      categories: r.serviceCategories,
      counsellorPref: p.counsellorPref,
      createdAt: r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };
  });

  const specialty = profile.specializations[0] ?? null;
  return {
    me: {
      profileId: profile.id,
      name: profile.user?.name ?? "Counsellor",
      sub: specialty,
      onDuty: profile.acceptingPatients,
    },
    appts,
  };
}
