#!/usr/bin/env node

/**
 * Create a bootstrap session note for future agents.
 * Run manually when needed: node scripts/bootstrap-note.mjs
 */

const note = `
Bootstrap Session — ${new Date().toISOString()}

This repository was bootstrapped from scratch.
- Mock data only, no database
- Debt management is the first feature area
- shadcn/ui components installed manually
- See docs/ for architecture and roadmap details
- See .claude/ for agent workflow guidance

Key files created during bootstrap:
- package.json with all dependencies
- Next.js App Router structure with dashboard layout
- Mock data in src/data/mock/seed.ts
- In-memory repository in src/data/repositories/mock.ts
- Domain types in src/domain/
- Feature stubs in src/features/
- Documentation in docs/
- Agent conventions in .claude/
- GitHub templates in .github/
`;

console.log(note);
