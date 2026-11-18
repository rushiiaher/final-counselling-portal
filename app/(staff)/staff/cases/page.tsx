import { loadCounsellorDesk } from "@/lib/desk/counsellor";
import { CoCaseload } from "@/components/desk/counsellor";
import { Panel, EmptyPanel } from "@/components/dashboard/Desk";
import { UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

/* My caseload (design: desk-counsellor.jsx → CoCaseload) */
export default async function CounsellorCaseloadPage() {
  const desk = await loadCounsellorDesk();
  if (!desk) return <Panel><EmptyPanel icon={UserCheck} text="Counsellor profile not found. Contact admin." /></Panel>;
  return <CoCaseload appts={desk.appts} />;
}
