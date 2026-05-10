import type { Account } from "@/domain/account/types";
import type { Debt, DebtRepayment } from "@/domain/debt/types";
import type { DebtCycle } from "@/domain/debt/cycle";
import type { Transaction } from "@/domain/transaction/types";

export const mockPeople = [
  { id: "p1", name: "Alice Johnson", email: "alice@example.com", phone: "555-0101" },
  { id: "p2", name: "Bob Smith", email: "bob@example.com", phone: "555-0102" },
  { id: "p3", name: "Carol Williams", email: "carol@example.com", phone: "555-0103" },
];

export const mockAccounts: Account[] = [
  {
    id: "acc1",
    name: "Primary Checking",
    type: "checking",
    balance: 5230.50,
    currency: "USD",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "acc2",
    name: "Emergency Savings",
    type: "savings",
    balance: 12500.00,
    currency: "USD",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-04-20T00:00:00Z",
  },
  {
    id: "acc3",
    name: "Travel Credit Card",
    type: "credit",
    balance: -850.25,
    currency: "USD",
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2025-05-05T00:00:00Z",
  },
  {
    id: "acc4",
    name: "Cash on Hand",
    type: "cash",
    balance: 250.00,
    currency: "USD",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-03-15T00:00:00Z",
  },
];

export const mockDebts: Debt[] = [
  {
    id: "d1",
    personId: "p1",
    personName: "Alice Johnson",
    description: "Personal loan for car repairs",
    amount: 2000.00,
    cashback: 50.00,
    finalPrice: 1950.00,
    remainingAmount: 1500.00,
    interestRate: 5.5,
    dueDate: "2025-12-31",
    status: "active",
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
  },
  {
    id: "d2",
    personId: "p2",
    personName: "Bob Smith",
    description: "Shared expenses from trip",
    amount: 450.00,
    cashback: 0.00,
    finalPrice: 450.00,
    remainingAmount: 450.00,
    interestRate: null,
    dueDate: null,
    status: "overdue",
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "d3",
    personId: "p3",
    personName: "Carol Williams",
    description: "Business advance - Q1 project",
    amount: 5000.00,
    cashback: 100.00,
    finalPrice: 4900.00,
    remainingAmount: 0,
    interestRate: null,
    dueDate: "2025-03-31",
    status: "paid",
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2025-03-30T00:00:00Z",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    accountId: "acc1",
    type: "income",
    category: "Salary",
    description: "Monthly salary",
    amount: 4500.00,
    date: "2025-05-01",
    createdAt: "2025-05-01T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "t2",
    accountId: "acc1",
    category: "Housing",
    description: "Rent payment",
    type: "expense",
    amount: 1800.00,
    date: "2025-05-03",
    createdAt: "2025-05-03T00:00:00Z",
    updatedAt: "2025-05-03T00:00:00Z",
  },
  {
    id: "t3",
    accountId: "acc3",
    category: "Travel",
    description: "Flight booking",
    type: "expense",
    amount: 350.00,
    date: "2025-04-28",
    createdAt: "2025-04-28T00:00:00Z",
    updatedAt: "2025-04-28T00:00:00Z",
  },
  {
    id: "t4",
    accountId: "acc2",
    type: "transfer",
    category: "Savings",
    description: "Monthly savings deposit",
    amount: 500.00,
    date: "2025-05-05",
    createdAt: "2025-05-05T00:00:00Z",
    updatedAt: "2025-05-05T00:00:00Z",
  },
];

export const mockRepayments: DebtRepayment[] = [
  // d1 (active/partial) — 2 repayments, newest first
  {
    id: "r1",
    debtId: "d1",
    date: "2025-03-15",
    amount: 300.00,
    note: "First partial payment",
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
  // d3 (paid) — 1 final repayment
  {
    id: "r3",
    debtId: "d3",
    date: "2025-03-30",
    amount: 5000.00,
    note: "Final settlement",
    createdAt: "2025-03-30T00:00:00Z",
    updatedAt: "2025-03-30T00:00:00Z",
  },
  // d2 has no repayments — tests empty state
];

export const mockCycles: DebtCycle[] = [
  {
    id: "c1",
    debtId: "d1",
    label: "2025-03",
    amount: 500,
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "c2",
    debtId: "d1",
    label: "2025-04",
    amount: 500,
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
  },
];
