"use client";

import type { CycleRow } from "@/domain/debt/cycle-row";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface CycleRowsTableProps {
  rows: CycleRow[];
}

export function CycleRowsTable({ rows }: CycleRowsTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No transactions yet.</p>
    );
  }

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-2 font-medium">ID</th>
              <th className="pb-2 pr-2 font-medium">Type</th>
              <th className="pb-2 pr-2 font-medium">Date</th>
              <th className="pb-2 pr-2 font-medium">Shop</th>
              <th className="pb-2 pr-2 font-medium">Notes</th>
              <th className="pb-2 pr-2 text-right font-medium">Amount</th>
              <th className="pb-2 pr-2 font-medium">% Back</th>
              <th className="pb-2 pr-2 text-right font-medium">đ Back</th>
              <th className="pb-2 pr-2 text-right font-medium">Σ Back</th>
              <th className="pb-2 pr-2 text-right font-medium">Final Price</th>
              <th className="pb-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="py-2 pr-2 text-xs text-muted-foreground">{shortId(row.id)}</td>
                <td className="py-2 pr-2">
                  <Badge variant={row.type === "In" ? "secondary" : "outline"}>{row.type}</Badge>
                </td>
                <td className="py-2 pr-2">{row.date}</td>
                <td className="py-2 pr-2 font-medium">{row.shop}</td>
                <td className="py-2 pr-2 max-w-[160px] truncate text-muted-foreground" title={row.notes}>
                  {row.notes}
                </td>
                <td className="py-2 pr-2 text-right">{formatCurrency(row.amount)}</td>
                <td className="py-2 pr-2 text-xs">{formatPercent(row.percentBack)}</td>
                <td className="py-2 pr-2 text-right">{formatCurrency(row.cashbackAmount)}</td>
                <td className="py-2 pr-2 text-right font-semibold">{formatCurrency(row.cumulativeBack)}</td>
                <td className="py-2 pr-2 text-right">{formatCurrency(row.finalPrice)}</td>
                <td className="py-2 text-xs text-muted-foreground">{row.shopSource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{shortId(row.id)}</span>
                <Badge variant={row.type === "In" ? "secondary" : "outline"}>{row.type}</Badge>
              </div>
              <span className="font-semibold">{formatCurrency(row.amount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{row.shop}</span>
              <span className="text-sm text-muted-foreground">{row.date}</span>
            </div>
            {row.notes && (
              <p className="text-xs text-muted-foreground truncate">{row.notes}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">% Back: </span>
                {formatPercent(row.percentBack)}
              </div>
              <div className="text-right">
                <span className="text-muted-foreground">đ Back: </span>
                {formatCurrency(row.cashbackAmount)}
              </div>
              <div>
                <span className="text-muted-foreground">Σ Back: </span>
                <span className="font-semibold">{formatCurrency(row.cumulativeBack)}</span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground">Final: </span>
                {formatCurrency(row.finalPrice)}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Source: {row.shopSource}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function shortId(id: string): string {
  return id.length > 6 ? id.slice(0, 6) + "…" : id;
}

function formatPercent(value: number): string {
  if (value === 0) return "0%";
  return `${value.toFixed(2)}%`;
}
