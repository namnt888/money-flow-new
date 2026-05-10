import type { Debt, DebtRepayment } from "@/domain/debt/types";
import type { Account } from "@/domain/account/types";
import type { Transaction } from "@/domain/transaction/types";
import { mockDebts, mockAccounts, mockTransactions, mockRepayments } from "../mock/seed";

/** In‑memory repository – no persistence, suitable for UI prototyping */
export class InMemoryRepository<T> {
  private items: Map<string, T> = new Map();

  constructor(initial: T[] = []) {
    for (const item of initial) {
      // @ts-ignore – assume entity has id string
      this.items.set((item as any).id, item);
    }
  }

  async getAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async getById(id: string): Promise<T | null> {
    return this.items.get(id) ?? null;
  }

  async create(item: T & { id: string }): Promise<T> {
    this.items.set(item.id, item);
    return item;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...(existing as any), ...data };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}

/** Export concrete mock repositories for UI */
export const debtRepository = new InMemoryRepository<Debt>(mockDebts);
export const repaymentRepository = new InMemoryRepository<DebtRepayment>(mockRepayments);

export const accountRepository = new InMemoryRepository<Account>(mockAccounts);
export const transactionRepository = new InMemoryRepository<Transaction>(mockTransactions);
