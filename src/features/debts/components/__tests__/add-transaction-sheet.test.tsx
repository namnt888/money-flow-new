/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTransactionSheet } from "@/features/debts/components/add-transaction-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/features/debts/hooks/use-add-cycle-row", () => ({
  useAddCycleRow: vi.fn(),
}));

import { useAddCycleRow } from "@/features/debts/hooks/use-add-cycle-row";

const mockMutateAsync = vi.fn();
const mockUseAddCycleRow = useAddCycleRow as ReturnType<typeof vi.fn>;

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("AddTransactionSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAddCycleRow.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isError: false,
    });
  });

  it("renders the Add Transaction trigger button", () => {
    render(
      <Wrapper>
        <AddTransactionSheet cycleId="c1" />
      </Wrapper>
    );
    expect(screen.getByRole("button", { name: /add transaction/i })).toBeInTheDocument();
  });

  it("opens sheet on button click", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <AddTransactionSheet cycleId="c1" />
      </Wrapper>
    );

    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add a new transaction row to this cycle.")).toBeInTheDocument();
  });

  it("shows form fields when open", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <AddTransactionSheet cycleId="c1" />
      </Wrapper>
    );

    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    expect(screen.getByLabelText("Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Shop")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByLabelText("% Back")).toBeInTheDocument();
    expect(screen.getByText(/Cashback/)).toBeInTheDocument();
  });

  it("closes sheet on Cancel button", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <AddTransactionSheet cycleId="c1" />
      </Wrapper>
    );

    await user.click(screen.getByRole("button", { name: /add transaction/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("submits valid form and calls mutateAsync", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({ id: "new_cr" });

    render(
      <Wrapper>
        <AddTransactionSheet cycleId="c1" />
      </Wrapper>
    );

    // Open sheet
    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    // Fill Type (default is Out, skip)
    // Fill Date
    const dateInput = screen.getByLabelText("Date");
    await user.clear(dateInput);
    await user.type(dateInput, "2025-06-15");

    // Fill Shop
    const shopInput = screen.getByLabelText("Shop");
    await user.type(shopInput, "Test Shop");

    // Fill Amount
    const amountInput = screen.getByLabelText("Amount");
    await user.type(amountInput, "100000");

    // Submit
    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    // Wait for async
    await vi.waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          cycleId: "c1",
          type: "Out",
          amount: 100000,
          shop: "Test Shop",
        })
      );
    });
  });

  it("shows loading state while submitting", async () => {
    // Keep mutateAsync pending
    mockMutateAsync.mockReturnValue(new Promise(() => {}));

    const user = userEvent.setup();
    render(
      <Wrapper>
        <AddTransactionSheet cycleId="c1" />
      </Wrapper>
    );

    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    // Fill required fields
    await user.type(screen.getByLabelText("Shop"), "Test");
    await user.type(screen.getByLabelText("Amount"), "50000");

    // Submit
    const submitBtn = screen.getByRole("button", { name: /^add transaction$/i });
    await user.click(submitBtn);

    expect(screen.getByRole("button", { name: /adding/i })).toBeInTheDocument();
  });
});
