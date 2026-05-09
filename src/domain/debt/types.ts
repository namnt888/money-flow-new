import type { BaseEntity } from "@/domain/shared/types";

export type DebtStatus = "active" | "paid" | "overdue" | "settled";

export interface Debt extends BaseEntity {
  personId: string;
  personName: string;
  description: string;
  amount: number;
  remainingAmount: number;
  interestRate: number | null;
  dueDate: string | null;
  status: DebtStatus;
}

export interface CreateDebtInput {
  personId: string;
  personName: string;
  description: string;
  amount: number;
  interestRate?: number;
  dueDate?: string;
}

export interface UpdateDebtInput {
  description?: string;
  remainingAmount?: number;
  status?: DebtStatus;
  interestRate?: number;
  dueDate?: string;
}
