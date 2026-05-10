# Sprint 7 Task — Build Cycle Transaction Table

## Sprint Goal
Turn the current cycle activity placeholder into a usable mock transaction table on the cycle detail page.

## Important Sprint Discipline
This sprint must stay clean.

Requirements:
- branch from the latest `main`
- do not include unrelated work from previous sprints
- do not mix in DB integration
- do not integrate Google Sheets sync yet
- do not add lend / repay mutation buttons yet
- keep the branch and commits focused only on Sprint 7 scope

## Current State
The app already has:
- debt list page
- debt overview page
- cycle detail page at `/debts/[id]/cycles/[cycleId]`
- debt summary context visible on cycle detail
- cycle shell and empty cycle activity state
- refined debt summary semantics:
  - Original
  - Cashback
  - Final Price
  - Repaid
  - Remaining

The cycle detail page currently does not yet show a real list/table of cycle rows.

## Product Direction
Cycle detail should become the place where transaction/service-like rows are shown.

This sprint should establish the first mock table UI using a structure close to the future Google Sheets / sync model, but without implementing sync yet.

## Main Objective
Replace the empty cycle activity state with a mock transaction table on cycle detail.

## Scope

### In Scope
- define a mock cycle transaction row model
- add mock rows for at least one cycle
- render a cycle transaction table on `/debts/[id]/cycles/[cycleId]`
- support empty state when a cycle has no rows
- keep the cycle summary block above the table
- make the table readable on desktop and usable on mobile
- add tests for new rendering states and table rows

### Target Table Direction
Use the following columns as the target direction for the mock table:

- ID
- Type
- Date
- Shop
- Notes
- Amount
- % Back
- đ Back
- Σ Back
- Final Price
- ShopSource

The exact UI may be responsive and condensed on mobile, but the model should support these fields.

### Data / Domain Direction
Add a lightweight mock row model for cycle transactions.

Suggested shape:
- id
- cycleId
- type
- date
- shop
- notes
- amount
- percentBack
- cashbackAmount
- cumulativeBack
- finalPrice
- shopSource

Keep it mock-first and explicit.

### Sample Direction
The UI should move toward supporting rows similar to:

- Youtube 2026-05 [2 slots] [29,243]/6
- iCloud 2026-05 [2 slots] [43,150]/6

Do not implement actual sheet sync or generation logic yet.

### Optional if small and clean
- add a simple reusable table component for cycle rows
- add a compact mobile card fallback if a full table is too dense on small screens
- add minimal formatting helpers for table values

### Out of Scope
- Google Sheets sync implementation
- importing and executing `code.gs`
- DB / Neon integration
- lend / repay buttons
- recurring monthly generation logic
- account balance side effects
- row editing / deletion
- CSV export/import

## Required Plan Before Coding
Before implementation, inspect the repo and provide:

1. current state summary
2. what the cycle detail page currently shows
3. what model additions are needed for cycle rows
4. files likely to change
5. table UI strategy for desktop and mobile
6. implementation approach
7. test plan
8. deferred items
9. risks/questions

Then stop and wait for approval.

## Implementation Constraints
- stay narrow and focused
- keep branch diff clean
- do not touch unrelated files
- do not introduce DB or sync code
- do not add mutation buttons
- preserve current cycle summary context
- keep responsive behavior in mind

## Required Validation Before Done
Run and report:
- lint
- typecheck
- unit tests
- build

## Summary of What Must Be Testable After Implementation

### Cycle Detail
- `/debts/[id]/cycles/[cycleId]` shows cycle summary plus transaction table
- table renders mock rows correctly for cycles with data
- cycles without rows show a clean empty state

### Table Rendering
- rows render the expected fields clearly
- important values such as Amount, Final Price, and cashback-related fields are readable
- mobile layout is still usable

### Validation Commands
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## UI Verification Checklist
After coding, verify manually:

1. `/debts/[id]`
 - debt overview still works
 - cycles list still links correctly

2. `/debts/[id]/cycles/[cycleId]`
 - summary context still visible
 - table rows appear for cycles with mock data
 - empty state appears for cycles with no rows

3. responsive behavior
 - desktop table readable
 - mobile layout does not overflow badly
 - important row values remain visible

## Done Criteria
This sprint is done when:
- cycle detail includes a mock transaction table
- the table follows the intended future sheet/sync direction
- empty state is clean for cycles with no rows
- tests/build/lint/typecheck pass
- no unrelated sprint work is included
- PR is opened as Draft with a clear summary and validation notes