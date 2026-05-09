# Debt Feature Scope

Debt management is the first-class feature area. This document defines its scope for the initial milestone.

## MVP (Milestone 2 — Debt UI)

- Display all debts in a list grouped by status
- Show: person name, description, amount, remaining, status badge
- Empty state when no debts exist
- Loading skeleton while data loads

## Next (Milestone 3 — Debt CRUD)

- Create debt via bottom sheet (mobile) / side sheet (desktop)
- Edit debt details
- Mark as paid (with optional partial payment)
- Delete debt
- Basic form validation (React Hook Form + Zod)

## Future

- Payment history per debt
- Interest calculation
- Due date reminders
- Debt-owned vs debt-owed distinction
