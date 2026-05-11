"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDebts } from "@/features/debts/hooks/use-debts";
import { useCycles } from "@/features/debts/hooks/use-cycles";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Debt } from "@/domain/debt/types";

function DebtNavItem({
  debt,
  onNavigate,
}: {
  debt: Debt;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: cycles, isLoading: cyclesLoading } = useCycles(debt.id);

  const isDebtActive = pathname === `/debts/${debt.id}`;
  const isCycleActive = pathname.startsWith(`/debts/${debt.id}/cycles/`);
  const isActive = isDebtActive || isCycleActive;
  const hasCycles = cycles && cycles.length > 0;

  const [expanded, setExpanded] = useState(isActive);
  const prevActive = useRef(isActive);

  useEffect(() => {
    if (isActive && !prevActive.current) {
      setExpanded(true);
    }
    prevActive.current = isActive;
  }, [isActive]);

  return (
    <li>
      <div className="flex items-center gap-0">
        {hasCycles && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className={cn(
              "flex items-center justify-center rounded-md p-1 text-muted-foreground hover:text-foreground shrink-0",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            )}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={cn(
                "h-3 w-3 transition-transform",
                expanded && "rotate-90"
              )}
            />
          </button>
        )}
        <Link
          href={`/debts/${debt.id}`}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors flex-1",
            isActive
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {debt.personName}
        </Link>
      </div>

      {expanded && (
        <div className="ml-4 mt-0.5 border-l border-border pl-2">
          {cyclesLoading ? (
            <div className="space-y-1 py-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : hasCycles ? (
            <ul className="space-y-0.5">
              {cycles.map((cycle) => {
                const isThisCycleActive =
                  pathname === `/debts/${debt.id}/cycles/${cycle.id}`;
                return (
                  <li key={cycle.id}>
                    <Link
                      href={`/debts/${debt.id}/cycles/${cycle.id}`}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors",
                        isThisCycleActive
                          ? "bg-accent/60 text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {cycle.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-2 py-1 text-xs text-muted-foreground">
              No cycles
            </p>
          )}
        </div>
      )}
    </li>
  );
}

export function DebtNavTree({ onNavigate }: { onNavigate?: () => void }) {
  const { data: debts, isLoading } = useDebts();

  if (isLoading) {
    return (
      <div className="space-y-2 pl-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-28" />
      </div>
    );
  }

  if (!debts || debts.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-0.5">
      {debts.map((debt) => (
        <DebtNavItem key={debt.id} debt={debt} onNavigate={onNavigate} />
      ))}
    </ul>
  );
}
