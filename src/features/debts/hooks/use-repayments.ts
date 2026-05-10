"use client";

import { useQuery } from "@tanstack/react-query";
import { repaymentRepository } from "@/data/repositories/mock";

export function useRepayments(debtId: string) {
  return useQuery({
    queryKey: ["repayments", debtId],
    queryFn: async () => {
      const all = await repaymentRepository.getAll();
      return all
        .filter((r) => r.debtId === debtId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    enabled: !!debtId,
  });
}
