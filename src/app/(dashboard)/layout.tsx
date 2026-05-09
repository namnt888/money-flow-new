import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { QueryProvider } from "@/lib/query/query-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <DashboardShell>{children}</DashboardShell>
    </QueryProvider>
  );
}
