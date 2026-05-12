"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Calculator } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import {
  addTransactionSchema,
  computeDerivedValues,
  type AddTransactionFormValues,
} from "@/features/debts/schemas/add-transaction-schema";
import { useAddCycleRow } from "@/features/debts/hooks/use-add-cycle-row";

interface AddTransactionSheetProps {
  cycleId: string;
}

const typeOptions = [
  { value: "In", label: "In" },
  { value: "Out", label: "Out" },
];

export function AddTransactionSheet({ cycleId }: AddTransactionSheetProps) {
  const [open, setOpen] = useState(false);
  const addRow = useAddCycleRow();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<AddTransactionFormValues>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      type: "Out",
      date: new Date().toISOString().slice(0, 10),
      shop: "",
      notes: "",
      amount: undefined as unknown as number,
      percentBack: undefined as unknown as number,
      cashbackAmount: undefined as unknown as number,
    },
  });

  const watched = watch();
  const preview = useMemo(() => {
    const amount = Number(watched.amount) || 0;
    const percentBack = Number(watched.percentBack) || 0;
    const cashbackAmount = Number(watched.cashbackAmount) || 0;
    if (amount <= 0) return null;
    return computeDerivedValues({ amount, percentBack, cashbackAmount });
  }, [watched.amount, watched.percentBack, watched.cashbackAmount]);

  const handleFormSubmit = async (data: AddTransactionFormValues) => {
    await addRow.mutateAsync({ ...data, cycleId });
    reset();
    setOpen(false);
  };

  const onSubmit = handleSubmit(handleFormSubmit);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Add Transaction</SheetTitle>
          <SheetDescription>
            Add a new transaction row to this cycle.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              options={typeOptions}
              {...register("type")}
            />
            {errors.type && (
              <p className="text-xs text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Shop */}
          <div className="space-y-2">
            <Label htmlFor="shop">Shop</Label>
            <Input id="shop" placeholder="e.g. Shopee, Netflix" {...register("shop")} />
            {errors.shop && (
              <p className="text-xs text-destructive">{errors.shop.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Optional notes" {...register("notes")} />
            {errors.notes && (
              <p className="text-xs text-destructive">{errors.notes.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 100000"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Cashback section */}
          <div className="rounded-md border p-4 space-y-3 bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cashback (optional)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="percentBack">% Back</Label>
                <Input
                  id="percentBack"
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  {...register("percentBack")}
                />
                {errors.percentBack && (
                  <p className="text-xs text-destructive">{errors.percentBack.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cashbackAmount">đ Back (fixed)</Label>
                <Input
                  id="cashbackAmount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  {...register("cashbackAmount")}
                />
                {errors.cashbackAmount && (
                  <p className="text-xs text-destructive">{errors.cashbackAmount.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Live preview */}
          {preview && (
            <div className="rounded-md border bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Calculator className="h-3.5 w-3.5" />
                Summary
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <p className="font-semibold">{formatCurrency(Number(watched.amount) || 0)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Total Back</span>
                  <p className="font-semibold text-blue-600">{formatCurrency(preview.totalBack)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Final Price</span>
                  <p className="font-bold text-lg">{formatCurrency(preview.finalPrice)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit / Cancel */}
          <div className="flex gap-3 pt-2">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </Button>
          </div>

          {addRow.isError && (
            <p className="text-xs text-destructive text-center">
              Failed to add transaction. Please try again.
            </p>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
