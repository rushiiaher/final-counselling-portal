import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { SessionDetail } from "@/components/student-app/counselling";
import { parseDescription, type SessionView } from "@/lib/student-app/sessions";

export const dynamic = "force-dynamic";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;
  const profile = await prisma.studentProfile.findUnique({ where: { userId: session.id }, select: { id: true } });
  if (!profile) notFound();

  // Students can only open their own requests
  const r = await prisma.supportRequest.findFirst({
    where: { id, studentId: profile.id },
    include: {
      assignedCounsellor: { include: { user: { select: { name: true } } } },
      followUps: { select: { purpose: true, scheduledDate: true, status: true }, orderBy: { scheduledDate: "asc" } },
    },
  });
  if (!r) notFound();

  const p = parseDescription(r.description);
  const view: SessionView = {
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

  return <SessionDetail session={view} />;
}
