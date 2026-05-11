"use client";

import type { CycleRow } from "@/domain/debt/cycle-row";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CycleRowsTableProps {
  rows: CycleRow[];
}

export function CycleRowsTable({ rows }: CycleRowsTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No transactions yet.</p>
    );
  }

  const thClass = "py-3 px-4 font-semibold text-xs uppercase tracking-wider border-r last:border-r-0 border-muted/50 bg-muted/40";
  const tdClass = "py-3 px-4 border-r last:border-r-0 border-muted/30";

  return (
    <div className="rounded-md border bg-card">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap border-collapse">
          <thead className="bg-muted/50">
            <tr className="text-left text-muted-foreground border-b">
              <th className={cn(thClass, "pl-6")}>ID</th>
              <th className={thClass}>Type</th>
              <th className={thClass}>Date</th>
              <th className={thClass}>Shop</th>
              <th className={thClass}>Notes</th>
              <th className={cn(thClass, "text-right")}>Amount</th>
              <th className={cn(thClass, "text-center")}>% Back</th>
              <th className={cn(thClass, "text-right")}>đ Back</th>
              <th className={cn(thClass, "text-right")}>Σ Back</th>
              <th className={cn(thClass, "text-right")}>Final Price</th>
              <th className={cn(thClass, "pr-6")}>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                <td className={cn(tdClass, "pl-6 text-xs text-muted-foreground")}>{shortId(row.id)}</td>
                <td className={tdClass}>{typeBadge(row.type)}</td>
                <td className={cn(tdClass, "text-muted-foreground")}>{row.date}</td>
                <td className={cn(tdClass, "font-medium text-foreground")}>{row.shop}</td>
                <td className={cn(tdClass, "max-w-[300px] truncate text-muted-foreground text-xs")} title={row.notes}>
                  {row.notes}
                </td>
                <td className={cn(
                  tdClass, 
                  "text-right font-medium",
                  row.type === "In" ? "text-green-600" : "text-red-600"
                )}>
                  {formatCurrency(row.amount)}
                </td>
                <td className={cn(tdClass, "text-center text-muted-foreground")}>
                  {formatPercent(row.percentBack, { blankZero: true })}
                </td>
                <td className={cn(tdClass, "text-right text-muted-foreground")}>
                  {formatCurrency(row.cashbackAmount, { blankZero: true })}
                </td>
                <td className={cn(tdClass, "text-right font-semibold text-blue-600")}>
                  {formatCurrency(row.cumulativeBack)}
                </td>
                <td className={cn(
                  tdClass, 
                  "text-right font-bold pr-6",
                  row.type === "In" ? "text-green-700" : "text-red-700"
                )}>
                  {formatCurrency(row.finalPrice)}
                </td>
                <td className={cn(tdClass, "pr-6 text-xs text-muted-foreground italic")}>{row.shopSource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y">
        {rows.map((row) => (
          <div key={row.id} className="p-4 space-y-3 hover:bg-muted/10 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{shortId(row.id)}</span>
                {typeBadge(row.type)}
              </div>
              <span className={cn(
                "font-bold text-base",
                row.type === "In" ? "text-green-600" : "text-red-600"
              )}>
                {formatCurrency(row.amount)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{row.shop}</span>
              <span className="text-xs text-muted-foreground">{row.date}</span>
            </div>
            
            {row.notes && (
              <p className="text-xs text-muted-foreground line-clamp-1 italic bg-muted/20 p-1.5 rounded">{row.notes}</p>
            )}
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">% Back:</span>
                <span className="font-medium">{formatPercent(row.percentBack, { blankZero: true }) || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">đ Back:</span>
                <span className="font-medium">{formatCurrency(row.cashbackAmount, { blankZero: true }) || "-"}</span>
              </div>
              <div className="flex justify-between col-span-2 bg-primary/5 p-2 rounded border border-primary/10">
                <span className="text-muted-foreground font-medium">Σ Back Total:</span>
                <span className="font-bold text-primary">{formatCurrency(row.cumulativeBack)}</span>
              </div>
              <div className="flex justify-between col-span-2 pt-1">
                <span className="text-muted-foreground">Final Price:</span>
                <span className={cn(
                  "font-semibold",
                  row.type === "In" ? "text-green-700" : "text-red-700"
                )}>{formatCurrency(row.finalPrice)}</span>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
              <span className="uppercase font-bold tracking-tighter opacity-50">Source:</span>
              {row.shopSource}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function shortId(id: string): string {
  return id.length > 6 ? id.slice(0, 6) : id;
}

function typeBadge(type: string) {
  if (type === "In") {
    return <Badge className="bg-green-600/90 hover:bg-green-600 font-bold text-[10px] h-5">{type}</Badge>;
  }
  if (type === "Out") {
    return <Badge variant="destructive" className="font-bold text-[10px] h-5">{type}</Badge>;
  }
  return <Badge variant="outline" className="font-bold text-[10px] h-5">{type}</Badge>;
}
