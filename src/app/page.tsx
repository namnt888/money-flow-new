import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-2 text-4xl font-bold">Money Flow</h1>
      <p className="mb-8 text-muted-foreground">Personal finance tracker</p>
      <div className="flex gap-4">
        <Link
          href="/debts"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to Dashboard
        </Link>
      </div>
      <p className="mt-12 text-xs text-muted-foreground">
        Foundation stage — mock data only
      </p>
    </main>
  );
}
