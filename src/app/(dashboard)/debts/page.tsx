import { DebtList } from "@/features/debts/components/debt-list";

export default function DebtsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Debts</h2>
          <p className="text-sm text-muted-foreground">
            Track money you owe or are owed
          </p>
        </div>
      </div>

      <DebtList />
    </div>
  );
}
