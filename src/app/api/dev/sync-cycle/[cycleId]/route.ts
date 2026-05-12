import { NextResponse } from "next/server";
import { syncCycleToSheet } from "@/features/debts/actions/sync-cycle";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ cycleId: string }> }
) {
  // Guard: this endpoint is for development/integration-verification only
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, mode: "error", message: "Dev endpoint not available in production" },
      { status: 404 }
    );
  }

  const { cycleId } = await params;

  if (!cycleId) {
    return NextResponse.json(
      { success: false, mode: "error", message: "cycleId is required" },
      { status: 400 }
    );
  }

  const result = await syncCycleToSheet(cycleId);

  const status = result.success ? 200 : 500;
  return NextResponse.json(result, { status });
}
