import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { decrypt } from "@/lib/encryption";
import { StudentChat, GuestSignIn } from "@/components/student-app/counselling";

export const dynamic = "force-dynamic";

function safeDecrypt(s: string) {
  try { return decrypt(s); } catch { return "[message could not be decrypted]"; }
}

/* Student ↔ counsellor chat on one request (design: StudentChat) */
export default async function StudentChatPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return <div style={{ padding: 16 }}><GuestSignIn title="Sign in to message your counsellor" text="Your conversations are private to you and your counsellor." /></div>;
  const { id } = await params;
  const profile = await prisma.studentProfile.findUnique({ where: { userId: (user as { id: string }).id }, select: { id: true } });
  if (!profile) notFound();
  const r = await prisma.supportRequest.findFirst({
    where: { id, studentId: profile.id },
    include: {
      assignedCounsellor: { include: { user: { select: { name: true } } } },
      messages: { orderBy: { createdAt: "asc" }, take: 200 },
    },
  });
  if (!r) notFound();
  return (
    <StudentChat
      requestId={r.id}
      counsellor={r.assignedCounsellor?.user?.name ?? null}
      messages={r.messages.map((m) => ({
        from: m.senderRole === "STUDENT" ? "student" : "counsellor",
        text: safeDecrypt(m.bodyEncrypted),
        ts: m.createdAt.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }),
      }))}
    />
  );
}
