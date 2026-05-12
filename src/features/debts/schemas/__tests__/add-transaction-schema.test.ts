/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { addTransactionSchema, computeDerivedValues } from "@/features/debts/schemas/add-transaction-schema";

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

  it("accepts transaction with percent cashback only", () => {
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

  it("accepts transaction with fixed cashback only", () => {
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

  it("accepts both percent and fixed cashback when total ≤ amount", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "Test",
      notes: "",
      amount: 100000,
      percentBack: 5,
      cashbackAmount: 2000,
    });
    // totalBack = (100000 * 5)/100 + 2000 = 5000 + 2000 = 7000 ≤ 100000
    expect(result.success).toBe(true);
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

  it("rejects when total back exceeds amount", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "Test",
      notes: "",
      amount: 100000,
      percentBack: 50,
      cashbackAmount: 60000,
    });
    // totalBack = 50000 + 60000 = 110000 > 100000
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("cashbackAmount"))).toBe(true);
    }
  });

  it("rejects when percent alone exceeds amount", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "Test",
      notes: "",
      amount: 1000,
      percentBack: 200,
      cashbackAmount: 0,
    });
    // percentBack > 100 rejected first
    expect(result.success).toBe(false);
  });

  it("rejects negative cashbackAmount", () => {
    const result = addTransactionSchema.safeParse({
      type: "Out",
      date: "2025-06-01",
      shop: "Test",
      notes: "",
      amount: 100000,
      percentBack: 0,
      cashbackAmount: -100,
    });
    expect(result.success).toBe(false);
  });
});

describe("computeDerivedValues", () => {
  it("computes totalBack and finalPrice for percent only", () => {
    const r = computeDerivedValues({ amount: 200000, percentBack: 10, cashbackAmount: 0 });
    expect(r.totalBack).toBe(20000);
    expect(r.finalPrice).toBe(180000);
  });

  it("computes totalBack and finalPrice for fixed only", () => {
    const r = computeDerivedValues({ amount: 200000, percentBack: 0, cashbackAmount: 15000 });
    expect(r.totalBack).toBe(15000);
    expect(r.finalPrice).toBe(185000);
  });

  it("computes totalBack and finalPrice for both combined", () => {
    const r = computeDerivedValues({ amount: 200000, percentBack: 5, cashbackAmount: 5000 });
    // (200000 * 5)/100 = 10000 + 5000 = 15000
    expect(r.totalBack).toBe(15000);
    expect(r.finalPrice).toBe(185000);
  });

  it("returns zero for all-zero inputs", () => {
    const r = computeDerivedValues({ amount: 0, percentBack: 0, cashbackAmount: 0 });
    expect(r.totalBack).toBe(0);
    expect(r.finalPrice).toBe(0);
  });
});
