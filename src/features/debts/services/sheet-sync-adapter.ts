import type { Debt } from "@/domain/debt/types";
import type { DebtCycle } from "@/domain/debt/cycle";
import type { CycleRow } from "@/domain/debt/cycle-row";

/**
 * Payload shape expected by Google Apps Script `code.gs` (v8.0)
 * Action: syncTransactions
 */
export interface SheetSyncPayload {
  action: "syncTransactions";
  person_id: string;
  cycle_tag: string;
  rows: SheetTransactionRow[];
  bank_account?: string;
  img?: string;
}

export interface SheetTransactionRow {
  id: string;
  type: "In" | "Out";
  date: string;
  notes: string;
  amount: number;
  shop: string; // This maps to ShopSource in the sheet (Col K)
  percent_back?: number;
  fixed_back?: number;
}

/**
 * Adapter to transform app-side domain data into Google Sheets sync payload.
 * Follows the contract established in `integrations/google-sheets/code.gs`.
 */
export const sheetSyncAdapter = {
  /**
   * Transforms a Debt Cycle and its rows into the sync payload.
   */
  toSyncPayload(
    debt: Debt,
    cycle: DebtCycle,
    rows: CycleRow[],
    options?: {
      bankAccount?: string;
      imgUrl?: string;
    }
  ): SheetSyncPayload {
    return {
      action: "syncTransactions",
      person_id: debt.personId,
      cycle_tag: this.normalizeCycleTag(cycle.label),
      rows: rows.map((row) => this.toSheetRow(row)),
      bank_account: options?.bankAccount,
      img: options?.imgUrl,
    };
  },

  /**
   * Normalizes a cycle label (e.g., "2025-03") for the sheet tag.
   */
  normalizeCycleTag(label: string): string {
    // code.gs expects YYYY-MM or YYYY
    const trimmed = label.trim();
    if (/^\d{4}-\d{2}$/.test(trimmed)) return trimmed;
    if (/^\d{4}$/.test(trimmed)) return trimmed;
    
    // Fallback or basic normalization if needed
    return trimmed;
  },

  /**
   * Maps a domain CycleRow to the sheet-friendly transaction row.
   */
  toSheetRow(row: CycleRow): SheetTransactionRow {
    return {
      id: row.id,
      type: this.normalizeType(row.type),
      date: row.date, // Assumed to be in a format code.gs can parse (e.g., YYYY-MM-DD)
      notes: row.notes || "",
      amount: Math.abs(row.amount), // code.gs resolveAmountValue uses Math.abs
      shop: row.shopSource || row.shop || "",
      percent_back: row.percentBack,
      /**
       * CASHBACK MAPPING ASSUMPTION (v1):
       * The adapter assumes a simplified mapping to match code.gs (v8.0) logic:
       * 1. If percentBack > 0, we prioritize sending the percent to let the sheet calculate the value.
       * 2. If percentBack is 0, we send cashbackAmount as fixed_back.
       * 3. This assumes the domain does not currently use both percent and fixed back simultaneously.
       */
      fixed_back: row.percentBack === 0 ? row.cashbackAmount : 0,
    };
  },

  /**
   * Normalizes type string to "In" or "Out".
   */
  normalizeType(type: string): "In" | "Out" {
    const t = type.toLowerCase();
    if (t === "in" || t === "repayment" || t === "income") return "In";
    if (t === "out" || t === "debt" || t === "expense") return "Out";
    return "Out"; // Default to Out for safety
  },
};
