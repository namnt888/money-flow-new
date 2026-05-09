import type { BaseEntity } from "@/domain/shared/types";

export type AccountType = "checking" | "savings" | "credit" | "cash" | "investment";

export interface Account extends BaseEntity {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
}
