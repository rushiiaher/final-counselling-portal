import { CareerDetail } from "@/components/student-app/screens";

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CareerDetail id={id} />;
}
