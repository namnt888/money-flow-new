# Sprint 9A Task List

- [x] Build typed Google Sheets sync adapter
    - [x] Define payload types matching `code.gs` v8.0
    - [x] Implement mapping logic in `src/features/debts/services/sheet-sync-adapter.ts`
    - [x] Add type normalization (`In`/`Out`)
    - [x] Add date and cycle tag normalization
- [x] Add contract-focused tests
    - [x] Create `src/features/debts/services/sheet-sync-adapter.test.ts`
    - [x] Test payload generation for various scenarios
    - [x] Test optional field behavior (bank account, image)
- [x] Implement server-side invocation boundary
    - [x] Create `src/features/debts/actions/sync-cycle.ts`
    - [x] Implement webhook POST logic
- [x] Documentation
    - [x] Document required environment variables in `docs/sheet-sync-setup.md`
- [x] Verification
    - [x] Run `npm run lint`
    - [x] Run `npm run test`
