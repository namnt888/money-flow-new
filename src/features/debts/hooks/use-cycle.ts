"use client";

import { useQuery } from "@tanstack/react-query";
import { cycleRepository } from "@/data/repositories/mock";

export function useCycle(cycleId: string) {
  return useQuery({
    queryKey: ["cycle", cycleId],
    queryFn: async () => {
      return cycleRepository.getById(cycleId);
    },
    enabled: !!cycleId,
  });
}
