// Shared type definitions for the application

export type DebtStatus = "active" | "paid" | "overdue" | "settled";

export interface Debt {
  id: string;
  personId: string;
  personName: string;
  description: string;
  amount: number;
  remainingAmount: number;
  interestRate?: number;
  dueDate?: string;
  status: DebtStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "cash" | "investment";
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: "income" | "expense" | "transfer";
  category: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}
