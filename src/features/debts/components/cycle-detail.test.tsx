/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CycleDetail } from "./cycle-detail";

vi.mock("@/features/debts/hooks/use-debt", () => ({
  useDebt: vi.fn(),
}));

vi.mock("@/features/debts/hooks/use-cycle", () => ({
  useCycle: vi.fn(),
}));

import { useDebt } from "@/features/debts/hooks/use-debt";
import { useCycle } from "@/features/debts/hooks/use-cycle";

const mockUseDebt = useDebt as ReturnType<typeof vi.fn>;
const mockUseCycle = useCycle as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

const validDebt = {
  id: "d1",
  personId: "p1",
  personName: "Alice Johnson",
  description: "Personal loan for car repairs",
  amount: 2000,
  cashback: 50,
  finalPrice: 1950,
  remainingAmount: 1500,
  interestRate: 5.5,
  dueDate: null,
  status: "active" as const,
  createdAt: "2024-08-15T00:00:00Z",
  updatedAt: "2025-04-01T00:00:00Z",
};

const validCycle = {
  id: "c1",
  debtId: "d1",
  label: "2025-03",
  amount: 500,
  createdAt: "2025-03-01T00:00:00Z",
  updatedAt: "2025-03-01T00:00:00Z",
};

describe("CycleDetail", () => {
  it("shows skeleton while loading", () => {
    mockUseDebt.mockReturnValue({ data: undefined, isLoading: true });
    mockUseCycle.mockReturnValue({ data: undefined, isLoading: true });
    render(<CycleDetail debtId="d1" />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });

  it("shows not-found when debt is null", () => {
    mockUseDebt.mockReturnValue({ data: null, isLoading: false });
    mockUseCycle.mockReturnValue({ data: undefined, isLoading: false });
    render(<CycleDetail debtId="d-none" />);
    expect(screen.getByText("Debt not found.")).toBeInTheDocument();
    expect(screen.getByText("Back to debts")).toBeInTheDocument();
  });

  it("renders cycle summary when cycle exists", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    render(<CycleDetail debtId="d1" />);
    expect(screen.getByText("Cycle Detail")).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("Alice Johnson"))).toBeInTheDocument();
    expect(screen.getByText("2025-03")).toBeInTheDocument();
    expect(screen.getByText("500.00")).toBeInTheDocument();
  });

  it("shows no-cycle fallback when cycle is null", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: null, isLoading: false });
    render(<CycleDetail debtId="d1" />);
    expect(screen.getByText("No cycle data available.")).toBeInTheDocument();
  });

  it("shows empty cycle activity state", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    render(<CycleDetail debtId="d1" />);
    expect(screen.getByText("Cycle Activity")).toBeInTheDocument();
    expect(screen.getByText("No cycle activity yet.")).toBeInTheDocument();
  });

  it("shows remaining amount from debt", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    render(<CycleDetail debtId="d1" />);
    expect(screen.getByText("1500.00")).toBeInTheDocument();
  });

  it("shows back link to debt detail", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    render(<CycleDetail debtId="d1" />);
    expect(screen.getByText("Back to debt")).toBeInTheDocument();
  });
});
