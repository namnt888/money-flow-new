"use client";

import type { DebtRepayment } from "@/domain/debt/types";
import { formatCurrency } from "@/lib/format";

interface DebtRepaymentListProps {
  repayments: DebtRepayment[];
}

export function DebtRepaymentList({ repayments }: DebtRepaymentListProps) {
  if (repayments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No repayment activity yet.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {repayments.map((repayment) => (
        <li key={repayment.id} className="flex justify-between items-center text-sm">
          <div className="flex flex-col">
            <span className="font-medium">{repayment.date}</span>
            {repayment.note && (
              <span className="text-xs text-muted-foreground">{repayment.note}</span>
            )}
          </div>
          <span className="font-semibold">{formatCurrency(repayment.amount)}</span>
        </li>
      ))}
    </ul>
  );
}
