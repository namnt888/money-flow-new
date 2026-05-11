import { describe, it, expect } from "vitest";
import { formatCurrency, formatPercent } from "./format";

describe("formatCurrency", () => {
  it("formats large numbers with thousand separators", () => {
    expect(formatCurrency(58485)).toBe("58,485");
    expect(formatCurrency(1234567.89)).toBe("1,234,567.89");
  });

  it("hides trailing .00", () => {
    expect(formatCurrency(58485.00)).toBe("58,485");
  });

  it("returns blank for zero when blankZero is true", () => {
    expect(formatCurrency(0, { blankZero: true })).toBe("");
  });

  it("returns 0 for zero when blankZero is false or missing", () => {
    expect(formatCurrency(0)).toBe("0");
    expect(formatCurrency(0, { blankZero: false })).toBe("0");
  });

  it("does not use compact formatting", () => {
    expect(formatCurrency(58500)).not.toBe("58.5K");
  });
});

describe("formatPercent", () => {
  it("formats percentage values", () => {
    expect(formatPercent(5.5)).toBe("5.5%");
    expect(formatPercent(10)).toBe("10%");
  });

  it("returns blank for zero when blankZero is true", () => {
    expect(formatPercent(0, { blankZero: true })).toBe("");
  });

  it("returns 0% for zero when blankZero is false or missing", () => {
    expect(formatPercent(0)).toBe("0%");
  });
});
