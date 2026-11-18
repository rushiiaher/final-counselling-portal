import { RoadmapScreen } from "@/components/student-app/screens";

export default async function RoadmapPage({ searchParams }: { searchParams: Promise<{ preselect?: string }> }) {
  const { preselect } = await searchParams;
  return <RoadmapScreen preselect={preselect ?? null} />;
}
