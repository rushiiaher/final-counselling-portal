import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  // Appointment.studentId / counsellorId reference User ids
  const appointments = await prisma.appointment.findMany({
    where: { studentId: session.user.id, deletedAt: null },
    include: {
      counsellor: { select: { name: true } },
    },
    orderBy: { startTime: "desc" },
  });

  return NextResponse.json(appointments.map(a => ({
    id: a.id,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    mode: a.mode,
    status: a.status,
    counsellorName: a.counsellor?.name ?? null,
  })));
}
