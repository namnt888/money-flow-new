import type { BaseEntity } from "@/domain/shared/types";

export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction extends BaseEntity {
  accountId: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface CreateTransactionInput {
  accountId: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string;
}
