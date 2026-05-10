/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DebtDetail } from "./debt-detail";

// Mock the hook so we control loading / data / null
vi.mock("@/features/debts/hooks/use-debt", () => ({
  useDebt: vi.fn(),
}));

import { useDebt } from "@/features/debts/hooks/use-debt";

const mockUseDebt = useDebt as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

const validDebt = {
  id: "d1",
  personId: "p1",
  personName: "Alice Johnson",
  description: "Personal loan",
  amount: 2000,
  remainingAmount: 1500,
  interestRate: 5.5,
  dueDate: "2025-12-31",
  status: "active",
  createdAt: "2024-08-15T00:00:00Z",
  updatedAt: "2025-04-01T00:00:00Z",
};

describe("DebtDetail", () => {
  it("shows skeleton while loading", () => {
    mockUseDebt.mockReturnValue({ data: undefined, isLoading: true });
    render(<DebtDetail debtId="d1" />);
    // Should render multiple skeleton elements
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(4);
  });

  it("shows not-found when debt is null", () => {
    mockUseDebt.mockReturnValue({ data: null, isLoading: false });
    render(<DebtDetail debtId="d-none" />);
    expect(screen.getByText("Debt not found.")).toBeInTheDocument();
    expect(screen.getByText("Back to debts")).toBeInTheDocument();
  });

  it("renders debt fields when data is available", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    render(<DebtDetail debtId="d1" />);
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Personal loan")).toBeInTheDocument();
    expect(screen.getByText("$2000.00 total")).toBeInTheDocument();
    expect(screen.getByText("$1500.00 remaining")).toBeInTheDocument();
    expect(screen.getByText("Due: 2025-12-31")).toBeInTheDocument();
  });

  it("omits due date line when dueDate is null", () => {
    mockUseDebt.mockReturnValue({
      data: { ...validDebt, dueDate: null },
      isLoading: false,
    });
    render(<DebtDetail debtId="d1" />);
    expect(screen.queryByText(/Due:/)).toBeNull();
  });
});
