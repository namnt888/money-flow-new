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

vi.mock("@/features/debts/hooks/use-cycle-rows", () => ({
  useCycleRows: vi.fn(),
}));

vi.mock("@/features/debts/hooks/use-add-cycle-row", () => ({
  useAddCycleRow: () => ({
    mutateAsync: vi.fn(),
    isError: false,
  }),
}));

import { useDebt } from "@/features/debts/hooks/use-debt";
import { useCycle } from "@/features/debts/hooks/use-cycle";
import { useCycleRows } from "@/features/debts/hooks/use-cycle-rows";

const mockUseDebt = useDebt as ReturnType<typeof vi.fn>;
const mockUseCycle = useCycle as ReturnType<typeof vi.fn>;
const mockUseCycleRows = useCycleRows as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockUseCycleRows.mockReturnValue({ data: [], isLoading: false });
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
    render(<CycleDetail debtId="d1" cycleId="c1" />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });

  it("shows not-found when debt is null", () => {
    mockUseDebt.mockReturnValue({ data: null, isLoading: false });
    mockUseCycle.mockReturnValue({ data: undefined, isLoading: false });
    render(<CycleDetail debtId="d-none" cycleId="c1" />);
    expect(screen.getByText("Debt not found.")).toBeInTheDocument();
    expect(screen.getByText("Back to debts")).toBeInTheDocument();
  });

  it("renders cycle summary when cycle exists", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    render(<CycleDetail debtId="d1" cycleId="c1" />);
    expect(screen.getByText("Cycle Detail")).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("Alice Johnson"))).toBeInTheDocument();
    expect(screen.getByText("2025-03")).toBeInTheDocument();
    const amountCells = screen.getAllByText("500");
    expect(amountCells.length).toBeGreaterThanOrEqual(1);
  });

  it("shows no-cycle fallback when cycle is null", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: null, isLoading: false });
    render(<CycleDetail debtId="d1" cycleId="c1" />);
    expect(screen.getByText("No cycle data available.")).toBeInTheDocument();
  });

  it("shows cycle activity section", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    mockUseCycleRows.mockReturnValue({ data: [], isLoading: false });
    render(<CycleDetail debtId="d1" cycleId="c1" />);
    expect(screen.getByText("Cycle Activity")).toBeInTheDocument();
  });

  it("shows remaining amount from debt", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    render(<CycleDetail debtId="d1" cycleId="c1" />);
    const remainingCells = screen.getAllByText("1,500");
    expect(remainingCells.length).toBeGreaterThanOrEqual(1);
  });

  it("shows back link to debt detail", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    mockUseCycleRows.mockReturnValue({ data: [], isLoading: false });
    render(<CycleDetail debtId="d1" cycleId="c1" />);
    expect(screen.getByText("Back to debt")).toBeInTheDocument();
  });

  it("renders transaction rows when cycle rows exist", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    mockUseCycleRows.mockReturnValue({
      data: [
        {
          id: "cr1",
          cycleId: "c1",
          type: "Out",
          date: "2025-03-05",
          shop: "Youtube",
          notes: "test note",
          amount: 58485,
          percentBack: 0,
          cashbackAmount: 0,
          cumulativeBack: 0,
          finalPrice: 58485,
          shopSource: "Youtube",
          createdAt: "2025-03-05T00:00:00Z",
          updatedAt: "2025-03-05T00:00:00Z",
        },
      ],
      isLoading: false,
    });
    render(<CycleDetail debtId="d1" cycleId="c1" />);
    const shopCells = screen.getAllByText("Youtube");
    expect(shopCells.length).toBeGreaterThanOrEqual(1);
    const amountCells = screen.getAllByText("58,485");
    expect(amountCells.length).toBeGreaterThanOrEqual(1);
  });

  it("shows no-transactions state when rows are empty", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseCycle.mockReturnValue({ data: validCycle, isLoading: false });
    mockUseCycleRows.mockReturnValue({ data: [], isLoading: false });
    render(<CycleDetail debtId="d1" cycleId="c1" />);
    expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
  });
});
