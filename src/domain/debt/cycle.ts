import type { BaseEntity } from "@/domain/shared/types";

export interface DebtCycle extends BaseEntity {
  debtId: string;
  label: string; // YYYY-MM format
  amount: number;
}