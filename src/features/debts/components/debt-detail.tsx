"use client";

import { useDebt } from "@/features/debts/hooks/use-debt";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DebtDetail({ debtId }: { debtId: string }) {
  const { data: debt, isLoading } = useDebt(debtId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  if (!debt) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Debt not found.</p>
        <Link
          href="/debts"
          className="mt-4 flex items-center gap-2 text-primary underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to debts
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    paid: "secondary",
    overdue: "destructive",
    settled: "outline",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/debts" className="flex items-center gap-2 text-primary underline">
        <ArrowLeft className="h-4 w-4" />
        Back to debts
      </Link>
      <h2 className="text-2xl font-bold">{debt.personName}</h2>
      <Badge variant={statusColors[debt.status] ?? "outline"} aria-label={`Status: ${debt.status}`}>
        {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
      </Badge>
      <p className="text-muted-foreground">{debt.description}</p>
      <div className="text-lg font-semibold">${debt.amount.toFixed(2)} total</div>
      <div className="text-lg font-semibold">${debt.remainingAmount.toFixed(2)} remaining</div>
      {debt.dueDate && (
        <div className="text-muted-foreground">Due: {debt.dueDate}</div>
      )}
    </div>
  );
}
