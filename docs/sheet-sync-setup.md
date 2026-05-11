# Google Sheets Sync Setup

This document describes how to configure the Google Sheets synchronization for the Money Flow application.

## Environment Variables

To enable synchronization with the Google Apps Script webhook, you must define the following environment variable in your `.env.local` (for local development) or your production environment:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `GOOGLE_SHEET_WEBHOOK_URL` | The URL of the deployed Apps Script Web App (`doPost`). | `https://script.google.com/macros/s/.../exec` |

> [!IMPORTANT]
> If this variable is missing, the application will log the synchronization payload to the console instead of attempting a network request. This is useful for debugging the payload contract.

## Legacy Sync Contract

The application uses a typed adapter to map domain models to the legacy `code.gs` (v8.0) format. 

### Payload Structure
The adapter (`src/features/debts/services/sheet-sync-adapter.ts`) generates a JSON payload with:
- `action`: "syncTransactions"
- `person_id`: Maps to `Debt.personId` (used for spreadsheet lookup).
- `cycle_tag`: Maps to `DebtCycle.label` (formatted as `YYYY-MM`).
- `rows`: Array of transaction rows with fields `id`, `type`, `date`, `notes`, `amount`, and `shop` (raw ShopSource).

### Cashback Mapping Assumptions
To align with the logic in `code.gs` (v8.0), the following assumptions are applied during mapping:
1. **Percentage Priority**: If `percentBack > 0`, the adapter sends `percent_back` and sets `fixed_back` to `0`. The Google Sheet then calculates the absolute cashback value via formula.
2. **Fixed Fallback**: If `percentBack` is `0`, the `cashbackAmount` is mapped to `fixed_back`.
3. **Exclusive Usage**: The current implementation assumes that transactions do not use both percentage and fixed cashback simultaneously.

## Testing the Contract

You can verify the mapping logic by running the unit tests:

```bash
npm test src/features/debts/services/sheet-sync-adapter.test.ts
```

## Security Note

- The webhook URL contains a deployment ID which is effectively a secret. Do not commit it to the repository.
- Authentication between the app and Apps Script is currently handled via the possession of the webhook URL.
