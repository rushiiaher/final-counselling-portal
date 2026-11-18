import { loadCounsellorDesk } from "@/lib/desk/counsellor";
import { CoOverview } from "@/components/desk/counsellor";
import { Panel, EmptyPanel } from "@/components/dashboard/Desk";
import { UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

/* Overview (design: desk-counsellor.jsx → CoOverview) */
export default async function CounsellorOverviewPage() {
  const desk = await loadCounsellorDesk();
  if (!desk) return <Panel><EmptyPanel icon={UserCheck} text="Counsellor profile not found. Contact admin." /></Panel>;
  return <CoOverview me={desk.me} appts={desk.appts} />;
}
