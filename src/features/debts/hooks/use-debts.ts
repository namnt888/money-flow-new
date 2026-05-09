"use client";

import { useQuery } from "@tanstack/react-query";
import { debtRepository } from "@/data/repositories/mock";

export function useDebts() {
  return useQuery({
    queryKey: ["debts"],
    queryFn: async () => debtRepository.getAll(),
  });
}
