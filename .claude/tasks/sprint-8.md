# Sprint 8 Task — Polish Cycle Table and Organize Sync Assets

## Sprint Goal
Polish the existing cycle transaction table and organize the legacy Google Sheets sync assets in the repository as reference material for future sync work.

## Important Sprint Discipline
This sprint must stay clean.

Requirements:
- branch from the latest `main`
- do not include unrelated work from previous sprints
- do not rebuild Sprint 7 work from scratch
- do not implement real Google Sheets sync yet
- do not implement DB integration yet
- do not add lend / repay mutation buttons yet
- keep the branch and commits focused only on Sprint 8 scope

## Critical Context
Sprint 7 is already merged.

That means the repo already has:
- debt overview flow
- cycle detail flow
- cycle transaction table baseline
- cycle summary context
- debt summary context on cycle detail

This sprint must NOT re-plan or re-build Sprint 7 as if it does not exist.

Before implementation, inspect the actual latest repo state and work from that reality only.

## Main Objectives

### Objective 1 — Cycle Table Polish
Improve the existing cycle transaction table UI and formatting.

Target improvements:
- better readability
- cleaner spacing / density
- improve header styling
- optionally add vertical borders only if they clearly help readability
- preserve responsive behavior
- keep current debt summary context and cycle summary context intact

### Objective 2 — Formatting Rules
Improve display formatting for the existing table values.

Preferred display direction:
- use thousand separators
- hide unnecessary trailing `.00` where appropriate
- show blank instead of noisy `0.00` or `0%` where appropriate
- do NOT use compact display such as `58.5K`

Examples:
- `58485.00` → `58,485`
- `0.00` → blank
- `0%` → blank

### Objective 3 — Organize Legacy Google Sheets Sync Assets
Store and document the legacy Apps Script / clasp files in the correct location inside the repo.

## Canonical Legacy Sync Asset Location
The correct intended structure is:

```text
integrations/google-sheets/
  README.md
  code.gs
  .clasp.json
  appsscript.json
  DEV_NOTES.md
  scripts/
    push-sheet.mjs
    setup-clasp-auth.mjs
```

Important:
- do NOT move `code.gs` into `integrations/google-sheets/scripts/`
- only support tooling scripts belong under `scripts/`

## Docs Scope
Focus documentation changes narrowly on:
- `docs/reference/google-sheets-sync-notes.md`
- `integrations/google-sheets/README.md`

Only update other docs if they actually exist and clearly need small, relevant updates.

## In Scope
- polish the existing cycle transaction table
- improve formatting helpers used by the existing table
- keep the current transaction table behavior intact while improving readability
- organize legacy Google Sheets sync files into the correct folder structure
- add or update focused sync reference docs
- update unit tests for changed formatting or rendering behavior

## Out of Scope
- rebuilding the cycle transaction table from scratch
- changing the route structure
- real Google Sheets sync implementation
- DB / Neon integration
- recurring generation engine
- resizable table columns unless explicitly justified and approved
- full Playwright / BDD rollout
- mutation buttons

## Testing Scope
- unit/component tests remain required
- Playwright may be considered only if the repo already has setup and the change stays very small
- otherwise defer Playwright

## Required Plan Before Coding
Before implementation, inspect the repo and provide:

1. actual current state summary
2. exact current file paths for:
   - debt detail component
   - cycle detail component
   - cycle detail route page
   - formatting helper file(s)
3. what the existing cycle table already does
4. what exactly should be polished instead of rebuilt
5. which legacy sync files already exist and where they should move
6. files likely to change
7. implementation approach
8. test plan
9. deferred items
10. risks/questions

Then stop and wait for approval.

## Implementation Constraints
- stay narrow and focused
- keep branch diff clean
- do not regress Sprint 6 or Sprint 7 behavior
- do not rebuild already-existing table functionality
- do not invent a new repo structure
- do not create new generic utility layers unless clearly needed
- prefer extending existing formatting helpers over introducing parallel ones

## Required Validation Before Done
Run and report:
- lint
- typecheck
- unit tests
- build

If Playwright is introduced, also report the Playwright results.

## UI Verification Checklist
After coding, verify manually:

1. `/debts/[id]`
 - debt overview still renders correctly
 - cycles section still exists
 - no regression from Sprint 6

2. `/debts/[id]/cycles/[cycleId]`
 - debt summary context still exists
 - cycle summary still exists
 - transaction table still exists
 - table formatting is cleaner and easier to scan
 - In / Out styling still works

3. table formatting
 - large numbers use separators
 - noisy zero values are hidden where intended
 - no compact number format like `58.5K`

4. legacy sync assets
 - files are stored in the intended folder structure
 - docs clearly explain they are reference assets, not active sync implementation

## Done Criteria
This sprint is done when:
- the existing cycle table is polished without regressing behavior
- legacy sync assets are organized in the repo correctly
- focused sync docs are present and clear
- tests/build/lint/typecheck pass
- no unrelated sprint work is included
- PR is opened as Draft with a clear summary and validation notes