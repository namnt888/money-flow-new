# Sheet Sync Dev Notes

- Safe delete shifts cells only inside the table (A:J plus the Shop raw column) so Summary columns (L:N) never move.
- Sorting is range-limited to the table data; Summary columns are intentionally left untouched.

## Web App URL (doPost)
- Current: `https://script.google.com/macros/s/.../exec` (Configure in .env)
- Deployment: Manual or via `clasp push`

## Versions
- Script: v8.0 (Master Sheet Support)
- Layout: v7.6 (Explicit Columns A:K)
- Sync Mode: per-person (default) or master (optional)

## Payload Format (syncTransactions)
- `action`: "syncTransactions"
- `person_id`: UUID
- `cycle_tag`: YYYY-MM
- `rows`: Array of { id, type, date, notes, amount, shop }
- `bank_account`: String (Bank + No + Name)
- `img`: Optional URL

## clasp token expires → push fails

**Symptom:** `Push to ... failed. This is likely a permission issue for namnt05@gmail.com.`
When you hit `y` to re-login, nothing happens (browser OAuth doesn't work inside `spawnSync` on Windows terminal).

**Fix:** Run this once to refresh the token without needing the browser:

```bash
pnpm clasp:refresh
```

This uses the existing `refresh_token` in `~/.clasprc.json` to get a new `access_token` silently.
Then retry the push command normally.

**Do NOT** run `clasp login` through the push script on Windows — it will hang.
Only run `clasp login` directly in a standalone CMD/PowerShell window if the refresh_token itself has been revoked.
