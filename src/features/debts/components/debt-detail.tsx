"use client";

import { useDebt } from "@/features/debts/hooks/use-debt";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DebtRepaymentList } from "./debt-repayment-list";
import { useRepayments } from "@/features/debts/hooks/use-repayments";
import { useCycles } from "@/features/debts/hooks/use-cycles";
import { formatCurrency } from "@/lib/format";
import { CycleCard } from "./cycle-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DebtDetail({ debtId }: { debtId: string }) {
  const { data: debt, isLoading } = useDebt(debtId);
  const { data: repayments, isLoading: isRepaymentsLoading } = useRepayments(debtId);
  const { data: cycles, isLoading: isCyclesLoading } = useCycles(debtId);

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

  const repaidAmount = debt.amount - debt.remainingAmount;

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

      {/* Summary section */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">{debt.personName}</h2>
        <Badge variant={statusColors[debt.status] ?? "outline"} aria-label={`Status: ${debt.status}`}>
          {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
        </Badge>
        <p className="text-muted-foreground">{debt.description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-4 border-t">
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Original</span>
            <p className="text-lg font-semibold text-muted-foreground">{formatCurrency(debt.amount)}</p>
          </div>
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Cashback Back</span>
            <p className="text-lg font-semibold text-blue-600">{formatCurrency(debt.cashback ?? 0)}</p>
          </div>
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Final Price</span>
            <p className="text-lg font-semibold">{formatCurrency(debt.finalPrice ?? debt.amount)}</p>
          </div>
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Repaid</span>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(repaidAmount)}</p>
          </div>
          <div className="pt-3">
            <span className="text-xs text-muted-foreground">Remaining</span>
            <p className="text-lg font-semibold text-destructive">{formatCurrency(debt.remainingAmount)}</p>
          </div>
        </div>
      </div>

      {/* Cycles section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Cycles</h3>
        {isCyclesLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : cycles && cycles.length > 0 ? (
          <div className="grid gap-3">
            {cycles.map((cycle) => (
              <CycleCard
                key={cycle.id}
                debtId={debtId}
                cycle={cycle}
                remainingAmount={debt.remainingAmount}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No cycles found for this debt.</p>
        )}
      </div>

      {/* Activity / Repayment section - De-emphasized */}
      <div className="space-y-3 pt-6 border-t">
        <h3 className="text-lg font-semibold text-muted-foreground">Recent Activity</h3>
        {isRepaymentsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : (
          <DebtRepaymentList repayments={repayments ?? []} />
        )}
      </div>
    </div>
  );
}
