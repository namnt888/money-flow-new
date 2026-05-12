/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { addTransactionSchema } from "@/features/debts/schemas/add-transaction-schema";

describe("addTransactionSchema", () => {
  it("accepts valid Out transaction with no cashback", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "Shopee",
      notes: "test purchase",
      amount: 100000,
      percentBack: 0,
      cashbackAmount: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid In transaction with percent cashback", () => {
    const result = addTransactionSchema.safeParse({
      type: "In",
      date: "2025-06-01",
      shop: "Shopee",
      notes: "",
      amount: 50000,
      percentBack: 5,
      cashbackAmount: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid transaction with fixed cashback only", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "Netflix",
      notes: "",
      amount: 220000,
      percentBack: 0,
      cashbackAmount: 4400,
    });
    expect(result.success).toBe(true);
  });

  it("rejects transaction with both percent and fixed cashback", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "Test",
      notes: "",
      amount: 100000,
      percentBack: 5,
      cashbackAmount: 5000,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("cashbackAmount"))).toBe(true);
    }
  });

  it("rejects empty shop", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "",
      notes: "",
      amount: 100000,
      percentBack: 0,
      cashbackAmount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero amount", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "Test",
      notes: "",
      amount: 0,
      percentBack: 0,
      cashbackAmount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "06-01-2025",
      shop: "Test",
      notes: "",
      amount: 100000,
      percentBack: 0,
      cashbackAmount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects percent > 100", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "Test",
      notes: "",
      amount: 100000,
      percentBack: 101,
      cashbackAmount: 0,
    });
    expect(result.success).toBe(false);
  });
});
