"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import {
  addTransactionSchema,
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

const defaultValues: AddTransactionFormValues = {
  type: "Out",
  date: new Date().toISOString().slice(0, 10),
  shop: "",
  notes: "",
  amount: 0,
  percentBack: 0,
  cashbackAmount: 0,
};

export function AddTransactionSheet({ cycleId }: AddTransactionSheetProps) {
  const [open, setOpen] = useState(false);
  const addRow = useAddCycleRow();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<AddTransactionFormValues>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues,
  });

  const percentBack = watch("percentBack");
  const cashbackAmount = watch("cashbackAmount");

  const handleFormSubmit = async (data: AddTransactionFormValues) => {
    await addRow.mutateAsync({ ...data, cycleId });
    reset(defaultValues);
    setOpen(false);
  };

  const onSubmit = handleSubmit(handleFormSubmit);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset(defaultValues);
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
              type="number"
              step="any"
              placeholder="0"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Cashback section */}
          <div className="rounded-md border p-4 space-y-3 bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cashback — use percentage <em>or</em> fixed amount, not both
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="percentBack">% Back</Label>
                <Input
                  id="percentBack"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  placeholder="0"
                  {...register("percentBack")}
                  onChange={(e) => {
                    const val = e.target.value;
                    register("percentBack").onChange(e);
                    if (parseFloat(val) > 0) {
                      setValue("cashbackAmount", 0, { shouldValidate: true });
                    }
                  }}
                />
                {errors.percentBack && (
                  <p className="text-xs text-destructive">{errors.percentBack.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cashbackAmount">đ Back (fixed)</Label>
                <Input
                  id="cashbackAmount"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  {...register("cashbackAmount")}
                  onChange={(e) => {
                    const val = e.target.value;
                    register("cashbackAmount").onChange(e);
                    if (parseFloat(val) > 0) {
                      setValue("percentBack", 0, { shouldValidate: true });
                    }
                  }}
                />
                {errors.cashbackAmount && (
                  <p className="text-xs text-destructive">{errors.cashbackAmount.message}</p>
                )}
              </div>
            </div>
            {percentBack > 0 && cashbackAmount > 0 && (
              <p className="text-xs text-destructive">
                Use either percentage cashback or fixed cashback, not both
              </p>
            )}
          </div>

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
