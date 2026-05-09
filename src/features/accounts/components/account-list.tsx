"use client";

import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { Skeleton } from "@/components/ui/skeleton";

const accountTypeLabels: Record<string, string> = {
  checking: "Checking",
  savings: "Savings",
  credit: "Credit Card",
  cash: "Cash",
  investment: "Investment",
};

export function AccountList() {
  const { data: accounts, isLoading } = useAccounts();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No accounts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <p className="font-medium">{account.name}</p>
            <p className="text-sm text-muted-foreground">
              {accountTypeLabels[account.type] ?? account.type}
            </p>
          </div>
          <p
            className={`text-lg font-semibold ${
              account.balance < 0 ? "text-destructive" : ""
            }`}
          >
            ${Math.abs(account.balance).toFixed(2)}
            {account.balance < 0 && " due"}
          </p>
        </div>
      ))}
    </div>
  );
}
