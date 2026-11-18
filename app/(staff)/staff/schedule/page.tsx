import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { CoAvailability } from "@/components/desk/counsellor";
import { SLOT_TIMES } from "@/lib/desk/slots";
import { Panel, EmptyPanel } from "@/components/dashboard/Desk";
import { UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

/* Availability (design: desk-counsellor.jsx → CoAvailability) */
export default async function CounsellorAvailabilityPage() {
  const user = await requireAuth();
  const profile = await prisma.counsellorProfile.findUnique({
    where: { userId: user.id },
    select: { acceptingPatients: true, availabilities: { where: { isActive: true }, select: { dayOfWeek: true, startTime: true } } },
  });
  if (!profile) return <Panel><EmptyPanel icon={UserCheck} text="Counsellor profile not found. Contact admin." /></Panel>;
  const valid = new Set(SLOT_TIMES.map((t) => t.value));
  const slots = profile.availabilities.filter((a) => valid.has(a.startTime)).map((a) => ({ dayOfWeek: a.dayOfWeek, time: a.startTime }));
  return <CoAvailability onDuty={profile.acceptingPatients} slots={slots} />;
}
