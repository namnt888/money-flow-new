import { DebtDetail } from "@/features/debts/components/debt-detail";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Params = Promise<{ id: string }>;

export default async function DebtDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  return <DebtDetail debtId={id} />;
}
