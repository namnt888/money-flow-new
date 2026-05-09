# Agent Workflow Guide

This file tells coding agents how to work in this repository.

## Before Any Task

1. Read this file
2. Read `README.md` for project context
3. Read relevant `docs/` files for the task area
4. Read relevant `.claude/skills/` files for conventions
5. Read `.claude/workflows/start-session.md` for session setup
6. Check `git status` and current branch

## During Implementation

- Follow conventions in `.claude/skills/repo-conventions.md`
- Check `.claude/skills/ui-delivery.md` for UI work
- Check `.claude/skills/debt-feature.md` for debt feature work
- Check `.claude/skills/db-planning.md` for database planning
- Handle loading, empty, error, and edge case states
- Keep files small and modular
- Use strict TypeScript

## After Finishing

- Run `npm run lint`
- Run `npm run build`
- Produce a task report including:
  - Summary of work done
  - Files created and modified
  - What was intentionally deferred
  - Suggested next task
- If creating a PR, follow `.claude/workflows/review-before-pr.md`

## Working in Parallel

If working in multiple chat sessions simultaneously, read `.claude/workflows/parallel-session-rules.md` first and coordinate modifications to avoid conflicts.

## Guiding Principles

- Mock-first data layer — no real DB until explicitly planned
- Debt management is the first-class feature
- Mobile-first responsive design
- Fast-feeling UI — optimistic updates, quick close on submit
- Avoid premature abstraction
- Prefer explicit naming over clever naming
