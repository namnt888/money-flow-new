# Architecture

## Layers

```
Pages (Next.js App Router)
  │
  ├── UI Components (shadcn/ui + custom)
  │
  ├── Features (hooks, components, services per domain)
  │
  ├── Domain (types, models — no framework deps)
  │
  ├── Data (repositories, adapters, mock)
  │
  └── lib (utils, validation, formatting, query)
```

## Mock-First Strategy

- Start without a database
- All repositories implement an in-memory interface
- Swap to real DB repositories later when ready
- Mock seed data lives in `src/data/mock/`

## File Conventions

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — Shared UI components
- `src/features/<name>/` — Feature modules (components, hooks, services)
- `src/domain/` — Pure types and business logic (no React, no DB)
- `src/data/` — Repositories, mock data, DB adapters
- `src/lib/` — Utility functions and config
