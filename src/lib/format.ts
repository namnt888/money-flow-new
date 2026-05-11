export interface FormatOptions {
  blankZero?: boolean;
}

export function formatCurrency(amount: number, options: FormatOptions = {}): string {
  if (amount === 0 && options.blankZero) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(amount);
}

export function formatPercent(value: number, options: FormatOptions = {}): string {
  if (value === 0 && options.blankZero) {
    return "";
  }
  
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
  
  return `${formatted}%`;
}
