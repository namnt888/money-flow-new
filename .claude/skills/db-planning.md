# Database Planning

The project uses mock data. Do NOT wire a real database yet.

- Read `docs/db-evolution-plan.md` before planning DB work
- Read `docs/neon-migrations-plan.md` for migration conventions
- Repository interfaces in `src/domain/shared/repository.ts`
- Current implementation: `src/data/repositories/mock.ts`

When the time comes to add a database:
1. Create the repository interface
2. Write migrations as SQL files in `db/migrations/`
3. Implement Neon-backed repositories
4. Swap at injection point
