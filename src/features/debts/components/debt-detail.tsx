"use client";

import { useDebt } from "@/features/debts/hooks/use-debt";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DebtRepaymentList } from "./debt-repayment-list";
import { useRepayments } from "@/features/debts/hooks/use-repayments";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DebtDetail({ debtId }: { debtId: string }) {
  const { data: debt, isLoading } = useDebt(debtId);
  const { data: repayments, isLoading: isRepaymentsLoading } = useRepayments(debtId);

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

  const isOverdueHint =
    debt.dueDate &&
    new Date(debt.dueDate) < new Date() &&
    debt.remainingAmount > 0;

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <div>
            <span className="text-sm text-muted-foreground">Total</span>
            <p className="text-lg font-semibold">{formatCurrency(debt.amount)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Remaining</span>
            <p className="text-lg font-semibold">{formatCurrency(debt.remainingAmount)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Repaid</span>
            <p className="text-lg font-semibold">{formatCurrency(repaidAmount)}</p>
          </div>
        </div>
        {debt.dueDate && (
          <div className="text-muted-foreground text-sm">Due: {debt.dueDate}</div>
        )}
        {isOverdueHint && (
          <p className="text-sm text-destructive font-medium">
            This debt is past its due date and still has an outstanding balance.
          </p>
        )}
      </div>

      {/* Activity / Repayment section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Activity</h3>
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
