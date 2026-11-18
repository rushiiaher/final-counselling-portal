import { loadCounsellorDesk } from "@/lib/desk/counsellor";
import { CoRequests } from "@/components/desk/counsellor";
import { Panel, EmptyPanel } from "@/components/dashboard/Desk";
import { UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

/* Requests (design: desk-counsellor.jsx → CoRequests) */
export default async function CounsellorRequestsPage() {
  const desk = await loadCounsellorDesk();
  if (!desk) return <Panel><EmptyPanel icon={UserCheck} text="Counsellor profile not found. Contact admin." /></Panel>;
  return <CoRequests appts={desk.appts} />;
}
