# Google Sheets Sync QA Runbook

## Purpose
This runbook explains how to manually verify the Google Sheets sync integration from the app to the deployed Apps Script webhook.

This document is intended for:
- future agents
- future chat sessions
- manual QA
- developers verifying sync behavior

## Scope
This runbook is for **integration verification** only.

It does **not** assume that the app already has:
- transaction entry modal/slide
- mutation buttons
- automatic sync after user actions
- full production sync UX

The current sync verification uses **existing cycle data already present in the app**.

---

## Current Verification Model

The current app sync flow is:

1. load existing debt/cycle/row data from the app
2. map that data through the typed sync adapter
3. send the payload to the Apps Script webhook
4. verify the sheet result
5. verify the app-side reported state

If the webhook URL is not configured, the app should run in **simulated/mock mode** and log the payload instead of sending a real request.

## Manual / Dev Sync Trigger

A **dev-only** POST endpoint is available for manual sync triggering:

```
POST /api/dev/sync-cycle/[cycleId]
```

This endpoint:
- is guarded against production use (returns 404 if `NODE_ENV=production`)
- accepts a `cycleId` path parameter
- calls the same `syncCycleToSheet` server action used elsewhere
- returns the same result shape with explicit `mode` field

To use it:

```bash
# With webhook configured
curl -X POST http://localhost:3000/api/dev/sync-cycle/<cycleId>

# Response (real):
# { "success": true, "mode": "real", "message": "...", "result": {...} }

# Without webhook (simulated):
# { "success": true, "mode": "simulated", "message": "...", "payload": {...} }
```

The cycle ID can be obtained from the app UI or mock data sources.

---

## Required Environment

Set the following environment variable locally or in the target environment:

- `GOOGLE_SHEET_WEBHOOK_URL`

Example:
```env
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
```

Important:
- do not commit this value to the repository
- treat it as sensitive configuration

---

## Reference Files

Important files for sync verification:

### App-side
- `src/features/debts/services/sheet-sync-adapter.ts`
- `src/features/debts/actions/sync-cycle.ts`

### Legacy Apps Script
- `integrations/google-sheets/code.gs`
- `integrations/google-sheets/DEV_NOTES.md`
- `integrations/google-sheets/appsscript.json`
- `integrations/google-sheets/.clasp.json`

### Docs
- `docs/reference/google-sheets-sync-notes.md`
- `docs/sheet-sync-setup.md`
- `docs/project-progress.md`

---

## Expected Payload Shape

The current adapter targets the `syncTransactions` Apps Script action.

Expected top-level structure:
- `action`
- `person_id`
- `cycle_tag`
- `rows`
- optional `bank_account`
- optional `img`

Expected row structure includes:
- `id`
- `type`
- `date`
- `notes`
- `amount`
- `shop`
- optional `percent_back`
- optional `fixed_back`

---

## Current Cashback Mapping Assumption

The current adapter assumes:

1. if `percentBack > 0`, send:
   - `percent_back`
   - `fixed_back = 0`

2. if `percentBack === 0`, send:
   - `fixed_back = cashbackAmount`

3. current implementation assumes the same row does not simultaneously require both a meaningful percentage cashback and a meaningful fixed cashback value

If this assumption changes in the future, update:
- adapter code
- adapter tests
- this runbook
- sync docs

---

## Manual QA Checklist

### A. Simulated Mode Verification
Use this when `GOOGLE_SHEET_WEBHOOK_URL` is NOT configured.

Steps:
1. ensure the webhook URL is absent
2. trigger sync for a known cycle (via dev endpoint or action)
3. verify the app reports `mode: "simulated"`
4. inspect logged payload
5. verify payload fields look correct

Expected result:
- sync does not hard-fail
- payload is visible/logged for inspection
- response includes `mode: "simulated"`

### B. Real Webhook Verification
Use this when `GOOGLE_SHEET_WEBHOOK_URL` is configured.

Steps:
1. set a valid Apps Script webhook URL
2. run the app locally or in the target environment
3. navigate to a known cycle with existing rows (or use its cycle ID directly)
4. trigger sync:
   - via POST to `/api/dev/sync-cycle/<cycleId>` (if accepting curl/Postman), or
   - via another manual sync path defined in this sprint
5. observe app-side result — should include `mode: "real"` on success
6. open the target Google Sheet
7. verify:
   - correct sheet/tab exists
   - correct cycle tag used
   - rows are present
   - type/date/amount/shop values look correct
   - formulas/summary area behave as expected

Expected result:
- request succeeds
- Apps Script responds successfully
- response includes `mode: "real"` and a `result` with webhook response
- target sheet reflects the synced cycle data

---

## Suggested Verification Data

Use a cycle that already has:
- multiple rows
- at least one `Out`
- at least one cashback-related case
- stable known label such as `YYYY-MM`

Prefer using a well-known mock debt/cycle already used in tests.

---

## What to Observe in the Sheet

After a successful sync, verify:

### Layout
- the expected cycle sheet/tab exists
- headers are correct
- hidden/source columns behave as expected

### Rows
- transaction IDs exist
- type values are correct
- dates are parseable and shown correctly
- amounts are correct
- shop/source mapping is correct

### Formula-driven fields
- cashback totals
- final price
- summary area values

### Stability
- repeated sync does not obviously corrupt layout
- rows are not duplicated unexpectedly
- headers and formulas remain intact

---

## Failure Modes to Watch For

### App-side
- missing webhook URL
- payload shape mismatch
- fetch/network failure
- unexpected webhook response format
- server action returns unclear status

### Sheet-side
- wrong tab naming
- duplicated rows
- formula breakage
- summary area shifting
- shop mapping not resolving as expected

---

## Reporting Template

When a QA pass is completed, record:

### Environment
- local / staging / production-like
- webhook configured: yes/no

### Cycle tested
- debt id:
- cycle id:
- cycle label:

### App result
- simulated / real / error
- mode:
- success / error
- returned message:

### Sheet result
- tab created or updated:
- rows present:
- summary correct:
- issues observed:

### Follow-up
- blocker:
- non-blocker:
- next action:

---

## Out of Scope for This Runbook
This runbook does not yet cover:
- add transaction modal/slide flows
- edit/delete transaction flows
- automatic sync after user mutations
- background or queued sync
- DB-backed persistence verification

Those will require a later QA runbook expansion.

---

## Future Expansion
Later versions of this runbook may include:
- mutation-triggered sync QA
- DB-backed sync QA
- reconciliation QA
- search/filter/navigation related QA if sync entry points move