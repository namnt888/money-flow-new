import { AccountList } from "@/features/accounts/components/account-list";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Accounts</h2>
        <p className="text-sm text-muted-foreground">All financial accounts</p>
      </div>

      <AccountList />
    </div>
  );
}
