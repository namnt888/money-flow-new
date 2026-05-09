"use client";

import { useQuery } from "@tanstack/react-query";
import { accountRepository } from "@/data/repositories/mock";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => accountRepository.getAll(),
  });
}
