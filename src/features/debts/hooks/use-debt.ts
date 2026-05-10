"use client";

import { useQuery } from "@tanstack/react-query";
import { debtRepository } from "@/data/repositories/mock";

export function useDebt(id: string) {
  return useQuery({
    queryKey: ["debt", id],
    queryFn: async () => debtRepository.getById(id),
    enabled: !!id,
  });
}
