"use client";

import type { DebtCycle } from "@/domain/debt/cycle";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CycleCardProps {
  debtId: string;
  cycle: DebtCycle;
  remainingAmount: number;
}

export function CycleCard({ debtId, cycle, remainingAmount }: CycleCardProps) {
  return (
    <Link href={`/debts/${debtId}/cycles/${cycle.id}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{cycle.label}</span>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Amount: </span>
                <span>{formatCurrency(cycle.amount)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining: </span>
                <span className="text-destructive font-medium">
                  {formatCurrency(remainingAmount)}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}
