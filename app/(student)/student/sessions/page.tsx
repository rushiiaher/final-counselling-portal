import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { MySessions } from "@/components/student-app/counselling";
import { parseDescription, type SessionView } from "@/lib/student-app/sessions";

export const dynamic = "force-dynamic";

export default async function MySessionsPage() {
  const user = await getCurrentUser();
  if (!user) return <MySessions sessions={[]} hasProfile={false} isGuest />;
  const session = user as { id: string };
  const profile = await prisma.studentProfile.findUnique({ where: { userId: session.id }, select: { id: true } });

  const requests = profile
    ? await prisma.supportRequest.findMany({
        where: { studentId: profile.id },
        include: {
          assignedCounsellor: { include: { user: { select: { name: true } } } },
          followUps: { select: { purpose: true, scheduledDate: true, status: true }, orderBy: { scheduledDate: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const sessions: SessionView[] = requests.map((r) => {
    const p = parseDescription(r.description);
    return {
      id: r.id,
      status: r.status,
      topic: p.topic,
      counsellor: r.assignedCounsellor?.user?.name ?? null,
      mode: p.mode,
      modeLabel: p.modeLabel,
      time: p.time,
      categories: r.serviceCategories,
      createdAt: r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      followUps: r.followUps.map((f) => ({
        purpose: f.purpose,
        date: f.scheduledDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        done: f.status === "COMPLETED",
      })),
    };
  });

  return <MySessions sessions={sessions} hasProfile={!!profile} />;
}
