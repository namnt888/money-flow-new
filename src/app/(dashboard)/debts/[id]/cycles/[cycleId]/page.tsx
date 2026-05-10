import { CycleDetail } from "@/features/debts/components/cycle-detail";

type Params = Promise<{ id: string; cycleId: string }>;

export default async function CycleDetailPage({ params }: { params: Params }) {
  const { id, cycleId } = await params;
  return <CycleDetail debtId={id} cycleId={cycleId} />;
}
