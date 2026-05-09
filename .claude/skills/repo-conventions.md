# Repo Conventions

- TypeScript strict mode
- Feature folders in `src/features/<name>/`
- Domain types in `src/domain/<name>/types.ts`
- Mock-first data layer — no DB client
- Use named exports, not default exports (except Next.js pages)
- CSS classes via `cn()` helper from `@/lib/utils`
- Icons from `lucide-react`
- Forms: React Hook Form + Zod + `@hookform/resolvers`
- Server state: TanStack Query
- Local state: React built-in (useState/useReducer) — Zustand only if needed globally
