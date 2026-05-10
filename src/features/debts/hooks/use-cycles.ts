"use client";
import { useQuery } from "@tanstack/react-query";
import { cycleRepository } from "@/data/repositories/mock";

export function useCycles(debtId: string) {
  return useQuery({
    queryKey: ["cycles", debtId],
    queryFn: async () => {
      const all = await cycleRepository.getAll();
      return all.filter((c) => c.debtId === debtId);
    },
    enabled: !!debtId,
  });
}
