import { ExamDetail } from "@/components/student-app/screens";

export default async function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExamDetail id={id} />;
}
