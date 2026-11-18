import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { loadCounsellorDesk } from "@/lib/desk/counsellor";
import { SessionConsole } from "@/components/desk/counsellor";

export const dynamic = "force-dynamic";

/* Session console (design: desk-counsellor.jsx → SessionConsole) */
export default async function SessionConsolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const desk = await loadCounsellorDesk();
  const appt = desk?.appts.find((a) => a.id === id);
  if (!appt) notFound();
  const extra = await prisma.supportRequest.findUnique({ where: { id }, select: { urgency: true, preferredLanguage: true } });
  return (
    <>
      <SessionConsole appt={appt} urgency={extra?.urgency ?? "MEDIUM"} language={extra?.preferredLanguage ?? "en"} />
      <div className="mt-5 text-[12.5px] text-ink-2">
        Need the full case tools (detailed guidance report, referrals, follow-ups)?{" "}
        <Link href={`/staff/cases/${id}/details`} className="font-semibold text-kashmir hover:underline">Open case details</Link>
      </div>
    </>
  );
}
