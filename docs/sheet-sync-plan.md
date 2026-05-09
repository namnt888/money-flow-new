# Google Sheets Sync Plan

## Status

Not implemented. This document captures future intent.

## Goal

Sync debt and transaction data to a Google Sheet for external reporting.

## Approach (Future)

- Use Google Sheets API v4
- Single sheet per data type (debts, transactions)
- One-way sync: app → sheet only
- Manual trigger (no auto-sync for MVP)
- OAuth via Google Cloud Console

## Not in Scope Yet

- Two-way sync
- Real-time updates
- Conflict resolution
- Template sheet management
