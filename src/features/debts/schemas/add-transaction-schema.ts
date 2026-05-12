import { z } from "zod";

export const addTransactionSchema = z
  .object({
    type: z.enum(["In", "Out"], {
      required_error: "Select In or Out",
    }),
    date: z
      .string()
      .min(1, "Date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    shop: z.string().min(1, "Shop is required").max(200),
    notes: z.string().max(500),
    amount: z.coerce
      .number({ required_error: "Amount is required", invalid_type_error: "Amount must be a number" })
      .positive("Amount must be positive"),
    percentBack: z.coerce.number().min(0).max(100),
    cashbackAmount: z.coerce.number().min(0),
  })
  .refine(
    (data) => {
      const totalBack = (data.amount * data.percentBack) / 100 + data.cashbackAmount;
      return totalBack <= data.amount;
    },
    {
      message: "Total cashback (percentage + fixed) must not exceed the amount",
      path: ["cashbackAmount"],
    }
  );

export type AddTransactionFormValues = z.infer<typeof addTransactionSchema>;

/** Helper to compute derived values for preview and internal use */
export function computeDerivedValues(data: {
  amount: number;
  percentBack: number;
  cashbackAmount: number;
}) {
  const totalBack = Math.round((data.amount * data.percentBack) / 100 + data.cashbackAmount);
  const finalPrice = data.amount - totalBack;
  return { totalBack, finalPrice };
}
