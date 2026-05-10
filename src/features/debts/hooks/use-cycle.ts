"use client";

import { useQuery } from "@tanstack/react-query";
import { cycleRepository } from "@/data/repositories/mock";

export function useCycle(debtId: string) {
  return useQuery({
    queryKey: ["cycle", debtId],
    queryFn: async () => {
      const all = await cycleRepository.getAll();
      return all.find((c) => c.debtId === debtId) ?? null;
    },
    enabled: !!debtId,
  });
}
