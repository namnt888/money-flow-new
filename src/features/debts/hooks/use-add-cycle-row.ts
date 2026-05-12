"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cycleRowRepository } from "@/data/repositories/mock";
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

      const totalBack = input.percentBack > 0
        ? Math.round(input.amount * input.percentBack) / 100
        : input.cashbackAmount;

      const cumulativeBack = totalBack;
      const finalPrice = input.type === "In"
        ? input.amount - cumulativeBack
        : input.amount + cumulativeBack;

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
