"use server";

import { debtRepository, cycleRepository, cycleRowRepository } from "@/data/repositories/mock";
import { sheetSyncAdapter } from "../services/sheet-sync-adapter";
import { revalidatePath } from "next/cache";

/**
 * Server action to synchronize a debt cycle with Google Sheets.
 * Maps domain data to the legacy Apps Script payload and POSTs to the webhook.
 */
export async function syncCycleToSheet(cycleId: string) {
  try {
    // 1. Fetch data from mock repositories
    const cycle = await cycleRepository.getById(cycleId);
    if (!cycle) throw new Error("Cycle not found");

    const debt = await debtRepository.getById(cycle.debtId);
    if (!debt) throw new Error("Debt not found");

    const allRows = await cycleRowRepository.getAll();
    const cycleRows = allRows
      .filter((r) => r.cycleId === cycleId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 2. Transform to sheet payload
    const payload = sheetSyncAdapter.toSyncPayload(debt, cycle, cycleRows);

    // 3. Invoke webhook
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    
    if (!webhookUrl) {
      // In development/mock mode, we log the payload if URL is missing
      console.info("Sheet Sync Payload (Mock):", JSON.stringify(payload, null, 2));
      return {
        success: true,
        mode: "simulated" as const,
        message: "Simulated sync: GOOGLE_SHEET_WEBHOOK_URL not configured. Payload logged to console.",
        payload
      };
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // 4. Revalidate cache
    revalidatePath(`/debts/${debt.id}/cycles/${cycleId}`);
    
    return {
      success: true,
      mode: "real" as const,
      message: "Successfully synced to Google Sheets",
      result
    };
  } catch (error) {
    console.error("[syncCycleToSheet] Error:", error);
    return {
      success: false,
      mode: "error" as const,
      message: error instanceof Error ? error.message : "Unknown sync error"
    };
  }
}
