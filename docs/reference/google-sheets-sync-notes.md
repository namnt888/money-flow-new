# Google Sheets Sync Reference Notes

This document captures the technical details of the legacy Google Sheets sync implementation (Apps Script) to serve as a reference for future integration work.

> [!NOTE]
> These notes are based on `integrations/google-sheets/code.gs` (v8.0).

## Sheet Layout (v7.6+)

The integration expects a specific column layout for transaction cycles.

| Column | Label | Description | Formatting |
| :--- | :--- | :--- | :--- |
| **A** | ID | Unique transaction ID (UUID) | Hidden |
| **B** | Type | `In` (Repayment) or `Out` (Expense) | Center aligned |
| **C** | Date | Transaction date | `dd-MM`, Center aligned |
| **D** | Shop | Display name (mapped via formula) | Center aligned |
| **E** | Notes | User-provided notes | Left aligned |
| **F** | Amount | Original transaction amount | `#,,##0`, Right aligned |
| **G** | % Back | Cashback percentage | `0.00`, Right aligned |
| **H** | đ Back | Cashback amount | `#,,##0`, Right aligned |
| **I** | Σ Back | Cumulative cashback in cycle | `#,,##0`, Right aligned, Formula |
| **J** | Final Price | Amount after cashback | `#,,##0`, Right aligned, Formula |
| **K** | ShopSource | Raw shop identifier | Hidden |

## Summary Area
- Starts at Column **M** (Col 13).
- Contains cycle totals, remaining debt, and potentially bank account information.
- Re-drawn on every sync.

## Visual Rules (Conditional Formatting)
- **In (Repayments)**: Entire row (`A:J`) is highlighted with light green (`#DCFCE7`) and dark green text (`#166534`).
- **Out (Expenses)**: Only the **Type** column (`B`) is highlighted with light red (`#FFF1F1`) and dark red text (`#991B1B`).

## Sync Logic Patterns
- **Upsert Strategy**: Matches existing rows by **ID** (Column A).
- **Smart Merge**: If no ID match, attempts to match by `Type`, `Amount`, and `Date` (within 24h) to adopt manually entered rows.
- **Formulas**: Many columns (D, I, J) are managed via `ARRAYFORMULA` or re-applied via script to ensure consistency.
- **Self-Healing**: Cleans up empty rows and ensures headers exist on every sync.

## Future Integration Questions
- [ ] How to handle `Shop` mapping if the `ShopSource` is not in the `Shop` reference tab?
- [ ] Should the app manage the `ARRAYFORMULA` or just write raw values?
- [ ] How to robustly handle manual edits in the sheet without breaking sync?
- [ ] Support for multi-currency or fixed-rate cashback?
