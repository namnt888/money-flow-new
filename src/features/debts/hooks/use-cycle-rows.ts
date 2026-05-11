"use client";

import { useQuery } from "@tanstack/react-query";
import { cycleRowRepository } from "@/data/repositories/mock";

export function useCycleRows(cycleId: string) {
  return useQuery({
    queryKey: ["cycleRows", cycleId],
    queryFn: async () => {
      const all = await cycleRowRepository.getAll();
      return all
        .filter((r) => r.cycleId === cycleId)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    enabled: !!cycleId,
  });
}
