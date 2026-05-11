# Google Sheets Integration

## Purpose
This folder stores the legacy Google Apps Script source and related tooling that will be used as the reference for future Google Sheets sync implementation.

The goal is to reuse and adapt the existing logic instead of rewriting it blindly.

## Current Status
- The app itself is still mock-first
- Real Google Sheets sync is **not implemented yet**
- Files in this folder are currently treated as **legacy reference + support tooling**
- Future sync work should be driven by these files and the existing sheet behavior

## Canonical Structure
```text
integrations/google-sheets/
  README.md
  code.gs             — main legacy Apps Script logic
  .clasp.json         — clasp project configuration
  appsscript.json     — Apps Script manifest
  DEV_NOTES.md        — legacy sync implementation notes
  scripts/            — Support tooling
    push-sheet.mjs
    setup-clasp-auth.mjs
```

## Related Reference Docs
Also see:
- `docs/reference/google-sheets-sync-notes.md`

That document captures:
- target row direction
- expected columns
- open sync questions
- future integration phases

## Important Rule
Do not implement sheet sync by guessing.

Future sync implementation must be based on:
- the real existing Apps Script logic
- the actual sheet schema
- the real business rules already encoded there

## Recommended Future Workflow

### Phase 1 — Reference Intake
- store legacy Apps Script files in this folder
- document what each file does
- identify sheet tabs, formulas, triggers, and payload expectations

### Phase 2 — Mapping
- map Apps Script logic to app domain types
- define normalization rules
- define importer/sync adapter behavior

### Phase 3 — Integration
- connect with DB-backed models
- implement sync jobs/services
- validate app ↔ sheet consistency

## Security / Auth Note
Authentication/token files should never be committed if they contain secrets.

Only commit safe config/reference files.
Be careful with:
- local clasp auth files
- tokens
- environment-specific secrets