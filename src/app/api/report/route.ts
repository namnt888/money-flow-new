import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    app: "money-flow",
    stage: "foundation",
    features: {
      debts: "placeholder",
      accounts: "placeholder",
      transactions: "placeholder",
    },
    database: "mock",
    auth: "none",
  });
}
