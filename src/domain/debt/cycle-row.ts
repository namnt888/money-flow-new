import type { BaseEntity } from "@/domain/shared/types";

export interface CycleRow extends BaseEntity {
  cycleId: string;
  type: string;
  date: string;
  shop: string;
  notes: string;
  amount: number;
  percentBack: number;
  cashbackAmount: number;
  cumulativeBack: number;
  finalPrice: number;
  shopSource: string;
}
