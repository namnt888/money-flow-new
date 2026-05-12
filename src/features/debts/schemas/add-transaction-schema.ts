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
    (data) => !(data.percentBack > 0 && data.cashbackAmount > 0),
    {
      message: "Use either percentage cashback or fixed cashback, not both",
      path: ["cashbackAmount"],
    }
  );

export type AddTransactionFormValues = z.infer<typeof addTransactionSchema>;
