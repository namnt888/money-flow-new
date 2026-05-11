import { describe, it, expect } from "vitest";
import { sheetSyncAdapter } from "./sheet-sync-adapter";
import type { Debt } from "@/domain/debt/types";
import type { DebtCycle } from "@/domain/debt/cycle";
import type { CycleRow } from "@/domain/debt/cycle-row";

describe("sheetSyncAdapter", () => {
  const mockDebt: Debt = {
    id: "d1",
    personId: "p1",
    personName: "Alice",
    description: "Test Debt",
    amount: 1000,
    remainingAmount: 1000,
    interestRate: null,
    dueDate: null,
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  const mockCycle: DebtCycle = {
    id: "c1",
    debtId: "d1",
    label: "2025-03",
    amount: 500,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  describe("toSyncPayload", () => {
    it("should transform domain data into the correct payload shape", () => {
      const rows: CycleRow[] = [
        {
          id: "cr1",
          cycleId: "c1",
          type: "Out",
          date: "2025-03-05",
          shop: "Test Shop",
          notes: "Some notes",
          amount: 100000,
          percentBack: 5,
          cashbackAmount: 5000,
          cumulativeBack: 5000,
          finalPrice: 95000,
          shopSource: "RAW_SHOP",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      const payload = sheetSyncAdapter.toSyncPayload(mockDebt, mockCycle, rows);

      expect(payload.action).toBe("syncTransactions");
      expect(payload.person_id).toBe("p1");
      expect(payload.cycle_tag).toBe("2025-03");
      expect(payload.rows).toHaveLength(1);
      
      const row = payload.rows[0];
      expect(row.id).toBe("cr1");
      expect(row.type).toBe("Out");
      expect(row.amount).toBe(100000);
      expect(row.shop).toBe("RAW_SHOP");
      expect(row.percent_back).toBe(5);
    });

    it("should handle optional fields like bank_account and img", () => {
      const payload = sheetSyncAdapter.toSyncPayload(mockDebt, mockCycle, [], {
        bankAccount: "Bank 123",
        imgUrl: "https://example.com/img.png",
      });

      expect(payload.bank_account).toBe("Bank 123");
      expect(payload.img).toBe("https://example.com/img.png");
    });
  });

  describe("normalizeType", () => {
    it("should normalize various strings to In or Out", () => {
      expect(sheetSyncAdapter.normalizeType("In")).toBe("In");
      expect(sheetSyncAdapter.normalizeType("repayment")).toBe("In");
      expect(sheetSyncAdapter.normalizeType("income")).toBe("In");
      
      expect(sheetSyncAdapter.normalizeType("Out")).toBe("Out");
      expect(sheetSyncAdapter.normalizeType("debt")).toBe("Out");
      expect(sheetSyncAdapter.normalizeType("expense")).toBe("Out");
      
      expect(sheetSyncAdapter.normalizeType("unknown")).toBe("Out");
    });
  });

  describe("toSheetRow", () => {
    it("should map shopSource to shop if available", () => {
      const row: CycleRow = {
        id: "cr1",
        cycleId: "c1",
        type: "Out",
        date: "2025-03-05",
        shop: "Display Name",
        notes: "Notes",
        amount: 50000,
        percentBack: 0,
        cashbackAmount: 0,
        cumulativeBack: 0,
        finalPrice: 50000,
        shopSource: "SOURCE_NAME",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      const result = sheetSyncAdapter.toSheetRow(row);
      expect(result.shop).toBe("SOURCE_NAME");
    });

    it("should fallback to shop if shopSource is empty", () => {
      const row: CycleRow = {
        id: "cr1",
        cycleId: "c1",
        type: "Out",
        date: "2025-03-05",
        shop: "Display Name",
        notes: "Notes",
        amount: 50000,
        percentBack: 0,
        cashbackAmount: 0,
        cumulativeBack: 0,
        finalPrice: 50000,
        shopSource: "",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      const result = sheetSyncAdapter.toSheetRow(row);
      expect(result.shop).toBe("Display Name");
    });

    it("should handle percentBack and fixed_back mapping", () => {
      const rowWithPercent: CycleRow = {
        id: "cr1",
        cycleId: "c1",
        type: "Out",
        date: "2025-03-05",
        shop: "Shop",
        notes: "Notes",
        amount: 100000,
        percentBack: 10,
        cashbackAmount: 10000,
        cumulativeBack: 10000,
        finalPrice: 90000,
        shopSource: "Shop",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      const result = sheetSyncAdapter.toSheetRow(rowWithPercent);
      expect(result.percent_back).toBe(10);
      expect(result.fixed_back).toBe(0); // We let sheet calculate it from percent

      const rowWithFixed: CycleRow = {
        id: "cr2",
        cycleId: "c1",
        type: "Out",
        date: "2025-03-05",
        shop: "Shop",
        notes: "Notes",
        amount: 100000,
        percentBack: 0,
        cashbackAmount: 5000,
        cumulativeBack: 5000,
        finalPrice: 95000,
        shopSource: "Shop",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      const resultFixed = sheetSyncAdapter.toSheetRow(rowWithFixed);
      expect(resultFixed.percent_back).toBe(0);
      expect(resultFixed.fixed_back).toBe(5000);
    });
  });
});
