# Money Flow

Personal finance web app. Debt management first, cashback and expense tracking later.

**Current stage:** Foundation — app shell with mock data, no database.

## Quick Start

```bash
nvm use       # or ensure Node 22+
npm install
npm run dev   # http://localhost:3000
```

## Tech Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- TanStack Query
- date-fns, lucide-react, clsx + tailwind-merge

## Mock Mode

No database is connected. Mock data lives in `src/data/mock/seed.ts`.
All repositories implement an in-memory adapter in `src/data/repositories/mock.ts`.

To switch to a real database later, implement the repository interface and swap at the injection point.

## Project Structure

```
src/
  app/          — Next.js App Router pages & API routes
  components/   — Shared UI components (shadcn/ui + custom)
  features/     — Feature modules (debts, accounts, transactions)
  domain/       — Pure types & business logic
  data/         — Repositories & mock data
  lib/          — Utilities & config
docs/           — Architecture, roadmap, planning
.github/        — CI, PR template
db/             — Future migration files
```

## Next Milestone

Debt UI — list debts with status badges and person details.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint check |
| `npm run format` | Format with Prettier |
| `npm run report` | Generate task report |
