"use client";

import { useCycle } from "@/features/debts/hooks/use-cycle";
import { useDebt } from "@/features/debts/hooks/use-debt";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function CycleDetail({ debtId, cycleId }: { debtId: string; cycleId: string }) {
  const { data: debt, isLoading: isDebtLoading } = useDebt(debtId);
  const { data: cycle, isLoading: isCycleLoading } = useCycle(cycleId);

  const isLoading = isDebtLoading || isCycleLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
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

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href={`/debts/${debtId}`} className="flex items-center gap-2 text-primary underline">
        <ArrowLeft className="h-4 w-4" />
        Back to debt
      </Link>

      {/* Debt Context Summary */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Cycle Detail</h2>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium">{debt.personName}</p>
          <p className="text-muted-foreground">{debt.description}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-4 border-t">
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Original</span>
            <p className="text-base font-semibold text-muted-foreground">{formatCurrency(debt.amount)}</p>
          </div>
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Cashback</span>
            <p className="text-base font-semibold text-blue-600">{formatCurrency(debt.cashback ?? 0)}</p>
          </div>
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Final Price</span>
            <p className="text-base font-semibold">{formatCurrency(debt.finalPrice ?? debt.amount)}</p>
          </div>
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Repaid</span>
            <p className="text-base font-semibold text-green-600">
              {formatCurrency(debt.amount - debt.remainingAmount)}
            </p>
          </div>
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Remaining</span>
            <p className="text-base font-semibold text-destructive">{formatCurrency(debt.remainingAmount)}</p>
          </div>
        </div>
      </div>

      {/* Cycle summary */}
      {cycle ? (
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Cycle</span>
            <Badge variant="outline">{cycle.label}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-muted-foreground">Cycle Amount</span>
              <p className="text-lg font-semibold">{formatCurrency(cycle.amount)}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Remaining</span>
              <p className="text-lg font-semibold text-destructive">
                {formatCurrency(debt.remainingAmount)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground">No cycle data available.</p>
        </div>
      )}

      {/* Cycle rows / activity area */}
      <div className="space-y-3 border-t pt-4">
        <h3 className="text-lg font-semibold">Cycle Activity</h3>
        <p className="text-sm text-muted-foreground">No cycle activity yet.</p>
      </div>
    </div>
  );
}
