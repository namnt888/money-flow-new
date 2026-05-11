/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CycleRowsTable } from "./cycle-rows-table";
import type { CycleRow } from "@/domain/debt/cycle-row";

const mockRows: CycleRow[] = [
  {
    id: "cr1",
    cycleId: "c1",
    type: "Out",
    date: "2025-03-05",
    shop: "Youtube",
    notes: "Youtube 2025-03 [2 slots]",
    amount: 58485,
    percentBack: 0,
    cashbackAmount: 0,
    cumulativeBack: 0,
    finalPrice: 58485,
    shopSource: "Youtube",
    createdAt: "2025-03-05T00:00:00Z",
    updatedAt: "2025-03-05T00:00:00Z",
  },
  {
    id: "cr2",
    cycleId: "c1",
    type: "In",
    date: "2025-03-10",
    shop: "Shopee",
    notes: "Cashback from promos",
    amount: 50000,
    percentBack: 5,
    cashbackAmount: 2500,
    cumulativeBack: 2500,
    finalPrice: 47500,
    shopSource: "Shopee",
    createdAt: "2025-03-10T00:00:00Z",
    updatedAt: "2025-03-10T00:00:00Z",
  },
];

describe("CycleRowsTable", () => {
  it("renders column headers", () => {
    render(<CycleRowsTable rows={mockRows} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("% Back")).toBeInTheDocument();
    expect(screen.getByText("đ Back")).toBeInTheDocument();
    expect(screen.getByText("Σ Back")).toBeInTheDocument();
    expect(screen.getByText("Final Price")).toBeInTheDocument();
    expect(screen.getByText("Source")).toBeInTheDocument();
  });

  it("renders row values correctly", () => {
    render(<CycleRowsTable rows={mockRows} />);
    const shopCells = screen.getAllByText("Youtube");
    expect(shopCells.length).toBeGreaterThanOrEqual(1);
    const shopeeCells = screen.getAllByText("Shopee");
    expect(shopeeCells.length).toBeGreaterThanOrEqual(1);
    const amountCells = screen.getAllByText("58485.00");
    expect(amountCells.length).toBeGreaterThanOrEqual(1);
    const amount50000 = screen.getAllByText("50000.00");
    expect(amount50000.length).toBeGreaterThanOrEqual(1);
    const cbCells = screen.getAllByText("2500.00");
    expect(cbCells.length).toBeGreaterThanOrEqual(1);
    const fpCells = screen.getAllByText("47500.00");
    expect(fpCells.length).toBeGreaterThanOrEqual(1);
    const zeroPctCells = screen.getAllByText("0%");
    expect(zeroPctCells.length).toBeGreaterThanOrEqual(1);
  });

  it("shows empty state when no rows", () => {
    render(<CycleRowsTable rows={[]} />);
    expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
  });

  it("renders mobile card fallback with row data", () => {
    const { container } = render(<CycleRowsTable rows={mockRows} />);
    const mobileCards = container.querySelectorAll(".sm\\:hidden");
    expect(mobileCards.length).toBeGreaterThan(0);
  });
});
