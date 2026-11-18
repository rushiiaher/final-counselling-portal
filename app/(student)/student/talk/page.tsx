import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { BookCounselling, type BookableCounsellor } from "@/components/student-app/counselling";
import { CATEGORY_TO_CONCERNS } from "@/lib/student-app/data";
import { openSlotsFor, centerSlots } from "@/lib/desk/availability";

export const dynamic = "force-dynamic";

const titleCase = (s: string) => s.replace(/_/g, " ").toLowerCase().replace(/^\w/, (x) => x.toUpperCase());
const initials = (n: string) =>
  n.split(" ").filter((w) => w && !/^(dr|mr|mrs|ms|prof)\.?$/i.test(w)).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "C";

export default async function TalkPage({ searchParams }: { searchParams: Promise<{ concern?: string; counsellor?: string }> }) {
  const user = await getCurrentUser();
  const { concern, counsellor: wanted } = await searchParams;
  if (!user) return <BookCounselling counsellors={[]} anySlots={[]} hasProfile={false} isGuest initialConcern={concern ?? null} />;
  const session = user as { id: string };

  const [profile, account, rows] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: session.id }, select: { id: true } }),
    prisma.user.findUnique({ where: { id: session.id }, select: { profileCompleted: true, role: true } }),
    prisma.counsellorProfile.findMany({
      where: { acceptingPatients: true, deletedAt: null, user: { isActive: true } },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (account && account.role !== "STUDENT") {
    const roleName = account.role === "COUNSELLOR" ? "a counsellor" : account.role === "ADMIN" ? "a District Admin" : "a non-student user";
    return <BookCounselling counsellors={[]} anySlots={[]} hasProfile={false} staffRole={roleName} />;
  }

  const slots = await openSlotsFor(rows.map((r) => r.id));
  const counsellors: BookableCounsellor[] = rows.map((c) => {
    const name = c.user?.name ?? "Counsellor";
    const tags = Array.from(new Set(c.serviceCategories.flatMap((cat) => CATEGORY_TO_CONCERNS[cat] ?? [])));
    return {
      id: c.id,
      name,
      init: initials(name),
      expertise: c.specializations.slice(0, 2).join(" · ") || c.serviceCategories.slice(0, 2).map(titleCase).join(" · ") || "Counsellor",
      years: c.yearsOfExperience ?? null,
      languages: c.languages,
      // counsellors without listed categories can take any concern
      tags: tags.length ? tags : ["career", "exam", "studies", "wellbeing", "scholarship", "personal"],
      slots: slots.get(c.id) ?? [],
    };
  });

  // Arrived from a counsellor's card on the website (?counsellor=Dr.%20Aamir%20Wani)
  const preselect = wanted ? counsellors.find((c) => c.name.toLowerCase() === wanted.toLowerCase())?.id ?? null : null;

  // Counselling needs a student profile + accepted consent (onboarding step 2)
  const ready = !!profile && !!account?.profileCompleted;
  return (
    <BookCounselling
      counsellors={counsellors}
      anySlots={centerSlots()}
      hasProfile={ready}
      initialConcern={concern ?? null}
      initialCounsellorId={preselect}
    />
  );
}
