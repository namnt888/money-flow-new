"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cycleRowRepository } from "@/data/repositories/mock";
import { computeDerivedValues } from "@/features/debts/schemas/add-transaction-schema";
import type { CycleRow } from "@/domain/debt/cycle-row";

export interface AddCycleRowInput {
  cycleId: string;
  type: string;
  date: string;
  shop: string;
  notes: string;
  amount: number;
  percentBack: number;
  cashbackAmount: number;
}

function generateId(): string {
  return `cr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

export function useAddCycleRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddCycleRowInput): Promise<CycleRow> => {
      const shopSource = input.shop;

      // Compute derived values using shared schema helper
      const { totalBack, finalPrice } = computeDerivedValues({
        amount: input.amount,
        percentBack: input.percentBack,
        cashbackAmount: input.cashbackAmount,
      });

      // cumulativeBack = running total of all cashbackAmount up to this row
      const allRows = await cycleRowRepository.getAll();
      const priorTotal = allRows
        .filter((r) => r.cycleId === input.cycleId)
        .reduce((sum, r) => sum + r.cashbackAmount, 0);
      const cumulativeBack = priorTotal + totalBack;

      const row: CycleRow = {
        id: generateId(),
        cycleId: input.cycleId,
        type: input.type,
        date: input.date,
        shop: input.shop,
        notes: input.notes,
        amount: input.amount,
        percentBack: input.percentBack,
        cashbackAmount: totalBack,
        cumulativeBack,
        finalPrice,
        shopSource,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };

      return cycleRowRepository.create(row as CycleRow & { id: string });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cycleRows", variables.cycleId] });
    },
  });
}
