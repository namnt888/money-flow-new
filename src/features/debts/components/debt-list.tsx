"use client";

import Link from "next/link";
import { useDebts } from "@/features/debts/hooks/use-debts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  paid: "secondary",
  overdue: "destructive",
  settled: "outline",
};

export function DebtList() {
  const { data: debts, isLoading } = useDebts();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!debts || debts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No debts yet.</p>
        <p className="text-sm text-muted-foreground">
          Add your first debt to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {debts.map((debt) => (
        <Link
          key={debt.id}
          href={`/debts/${debt.id}`}
          className="flex flex-col gap-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{debt.personName}</span>
              <Badge variant={statusColors[debt.status] ?? "outline"}>
                {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{debt.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold">
              ${debt.remainingAmount.toFixed(2)}
            </p>
            {debt.remainingAmount < debt.amount && (
              <p className="text-xs text-muted-foreground">
                of ${debt.amount.toFixed(2)} total
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
