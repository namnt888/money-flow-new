import { CycleDetail } from "@/features/debts/components/cycle-detail";

type Params = Promise<{ id: string }>;

export default async function CyclePage({ params }: { params: Params }) {
  const { id } = await params;
  return <CycleDetail debtId={id} />;
}
