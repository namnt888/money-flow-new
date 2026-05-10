/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DebtDetail } from "./debt-detail";

vi.mock("@/features/debts/hooks/use-debt", () => ({
  useDebt: vi.fn(),
}));

vi.mock("@/features/debts/hooks/use-repayments", () => ({
  useRepayments: vi.fn(),
}));
vi.mock("@/features/debts/hooks/use-cycles", () => ({
  useCycles: vi.fn(),
}));

import { useDebt } from "@/features/debts/hooks/use-debt";
import { useRepayments } from "@/features/debts/hooks/use-repayments";
import { useCycles } from "@/features/debts/hooks/use-cycles";

const mockUseDebt = useDebt as ReturnType<typeof vi.fn>;
const mockUseRepayments = useRepayments as ReturnType<typeof vi.fn>;
const mockUseCycles = useCycles as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

const validDebt = {
  id: "d1",
  personId: "p1",
  personName: "Alice Johnson",
  description: "Personal loan",
  amount: 2000,
  cashback: 50,
  finalPrice: 1950,
  remainingAmount: 1500,
  interestRate: 5.5,
  dueDate: "2025-12-31",
  status: "active",
  createdAt: "2024-08-15T00:00:00Z",
  updatedAt: "2025-04-01T00:00:00Z",
};

const mockRepayments = [
  {
    id: "r1",
    debtId: "d1",
    date: "2025-03-15",
    amount: 300.00,
    note: "Partial payment",
    createdAt: "2025-03-15T00:00:00Z",
    updatedAt: "2025-03-15T00:00:00Z",
  },
  {
    id: "r2",
    debtId: "d1",
    date: "2025-01-20",
    amount: 200.00,
    note: "Initial payment",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z",
  },
];

describe("DebtDetail", () => {
  it("shows skeleton while loading debt", () => {
    mockUseDebt.mockReturnValue({ data: undefined, isLoading: true });
    mockUseRepayments.mockReturnValue({ data: undefined, isLoading: true });
    mockUseCycles.mockReturnValue({ data: undefined, isLoading: true });
    render(<DebtDetail debtId="d1" />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(4);
  });

  it("shows not-found when debt is null", () => {
    mockUseDebt.mockReturnValue({ data: null, isLoading: false });
    mockUseRepayments.mockReturnValue({ data: undefined, isLoading: false });
    mockUseCycles.mockReturnValue({ data: undefined, isLoading: false });
    render(<DebtDetail debtId="d-none" />);
    expect(screen.getByText("Debt not found.")).toBeInTheDocument();
    expect(screen.getByText("Back to debts")).toBeInTheDocument();
  });

  it("renders debt summary fields when data is available", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseRepayments.mockReturnValue({ data: mockRepayments, isLoading: false });
    mockUseCycles.mockReturnValue({ data: [], isLoading: false });
    render(<DebtDetail debtId="d1" />);
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Personal loan")).toBeInTheDocument();
    expect(screen.getByText("2000.00")).toBeInTheDocument();
  });

  it("no longer shows due date or overdue hint", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseRepayments.mockReturnValue({ data: [], isLoading: false });
    mockUseCycles.mockReturnValue({ data: [], isLoading: false });
    render(<DebtDetail debtId="d1" />);
    expect(screen.queryByText(/Due:/)).toBeNull();
    expect(screen.queryByText(/past its due date/)).toBeNull();
  });

  it("shows repaid amount derived from total minus remaining", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseRepayments.mockReturnValue({ data: mockRepayments, isLoading: false });
    mockUseCycles.mockReturnValue({ data: [], isLoading: false });
    render(<DebtDetail debtId="d1" />);
    // 2000 - 1500 = 500
    expect(screen.getByText("500.00")).toBeInTheDocument();
  });

  it("shows activity items when repayments exist", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseRepayments.mockReturnValue({ data: mockRepayments, isLoading: false });
    mockUseCycles.mockReturnValue({ data: [], isLoading: false });
    render(<DebtDetail debtId="d1" />);
    expect(screen.getByText("2025-03-15")).toBeInTheDocument();
    expect(screen.getByText("Partial payment")).toBeInTheDocument();
    expect(screen.getByText("2025-01-20")).toBeInTheDocument();
    expect(screen.getByText("Initial payment")).toBeInTheDocument();
  });

  it("shows empty message when no activity", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseRepayments.mockReturnValue({ data: [], isLoading: false });
    mockUseCycles.mockReturnValue({ data: [], isLoading: false });
    render(<DebtDetail debtId="d1" />);
    expect(screen.getByText("No repayment activity yet.")).toBeInTheDocument();
  });

  it("shows activity skeleton while loading repayments", () => {
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseRepayments.mockReturnValue({ data: undefined, isLoading: true });
    mockUseCycles.mockReturnValue({ data: [], isLoading: false });
    render(<DebtDetail debtId="d1" />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    // Should have at least the 2 repayment skeletons
    expect(skeletons.length).toBeGreaterThanOrEqual(2);
  });

  it("shows cycles section with multiple cycles", () => {
    const mockCycles = [
      { id: "c1", debtId: "d1", label: "2025-03", amount: 500 },
      { id: "c2", debtId: "d1", label: "2025-04", amount: 500 },
    ];
    mockUseDebt.mockReturnValue({ data: validDebt, isLoading: false });
    mockUseRepayments.mockReturnValue({ data: [], isLoading: false });
    mockUseCycles.mockReturnValue({ data: mockCycles, isLoading: false });
    render(<DebtDetail debtId="d1" />);
    expect(screen.getByText("Cycles")).toBeInTheDocument();
    expect(screen.getByText("2025-03")).toBeInTheDocument();
    expect(screen.getByText("2025-04")).toBeInTheDocument();
  });
});
