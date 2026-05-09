# Database Evolution Plan

## Why Start Without a Database

- Faster iteration on UI
- Avoid schema lock-in during early prototyping
- Mock data is sufficient for building trust in UX patterns

## Path to Real Database

```
Mock repositories → Interface extraction → Postgres repositories → Neon
```

1. **Extract interfaces** — Create `Repository<T>` interface in `src/data/adapters/`
2. **Implement Postgres** — Create Neon-backed repository implementations
3. **Swap at injection** — Replace mock repos with real repos at a single entry point
4. **Seeding** — Use seed scripts for development data (never mock in production)

## Schema Convention

- Tables named in lowercase plural: `debts`, `accounts`, `transactions`
- Primary key: `uuid DEFAULT gen_random_uuid()`
- Timestamps: `created_at`, `updated_at` with `DEFAULT now()`
- Soft-delete not planned (hard delete for MVP)

## Repository Interface (Future)

```typescript
interface Repository<T, CreateInput, UpdateInput> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | null>
  create(input: CreateInput): Promise<T>
  update(id: string, input: UpdateInput): Promise<T | null>
  delete(id: string): Promise<boolean>
}
```
