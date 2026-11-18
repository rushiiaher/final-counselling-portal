import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { decrypt } from "@/lib/encryption";
import { CoMessages, type Thread } from "@/components/desk/counsellor";
import { Panel, EmptyPanel } from "@/components/dashboard/Desk";
import { UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const initials = (n: string) =>
  n.split(" ").filter((w) => w && !/^(dr|mr|mrs|ms|prof)\.?$/i.test(w)).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "S";

function safeDecrypt(s: string) {
  try { return decrypt(s); } catch { return "[message could not be decrypted]"; }
}

/* Messages (design: desk-counsellor.jsx → CoMessages): one thread per assigned student request */
export default async function CounsellorMessagesPage({ searchParams }: { searchParams: Promise<{ thread?: string }> }) {
  const user = await requireAuth();
  const { thread } = await searchParams;
  const profile = await prisma.counsellorProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!profile) return <Panel><EmptyPanel icon={UserCheck} text="Counsellor profile not found. Contact admin." /></Panel>;

  const requests = await prisma.supportRequest.findMany({
    where: { assignedCounsellorId: profile.id },
    include: {
      student: { include: { user: { select: { name: true } } } },
      messages: { orderBy: { createdAt: "asc" }, take: 200 },
    },
    orderBy: { updatedAt: "desc" },
  });

  const threads: Thread[] = requests
    .map((r) => {
      const name = r.student.user?.name ?? r.student.firstName;
      return {
        requestId: r.id,
        studentName: name,
        init: initials(name),
        messages: r.messages.map((m) => ({
          from: m.senderRole === "COUNSELLOR" ? ("counsellor" as const) : ("student" as const),
          text: safeDecrypt(m.bodyEncrypted),
          ts: m.createdAt.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }),
        })),
        lastAt: r.messages[r.messages.length - 1]?.createdAt.getTime() ?? 0,
      };
    })
    .sort((a, b) => b.lastAt - a.lastAt)
    .map(({ lastAt: _l, ...t }) => t);

  return <CoMessages threads={threads} initial={thread ?? null} />;
}
