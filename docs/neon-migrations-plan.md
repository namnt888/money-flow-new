# Neon Migrations Plan

## Future CLI Workflow

This document records the intended workflow for Postgres migrations via Neon CLI. Not active yet.

## Setup (Future)

```bash
# Install Neon CLI
npm install -g neonctl

# Authenticate
neonctl auth login

# List or create project
neonctl projects list
neonctl projects create --name money-flow --region aws-us-east-1

# Get connection string
neonctl connection-string --project-id <id>
```

## Migration Convention

- Numbered SQL files in `db/migrations/`
- Format: `001_<description>.sql`, `002_<description>.sql`, etc.
- Each file is a complete, reversible migration
- Apply via controlled script later

## Example Migration

```sql
-- db/migrations/001_create_debts.sql
CREATE TABLE debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES people(id),
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  remaining_amount numeric(12,2) NOT NULL,
  interest_rate numeric(5,2),
  due_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

## Apply Migrations (Future)

```bash
# Apply pending migrations
psql "$DATABASE_URL" -f db/migrations/001_create_debts.sql

# CI will apply migrations in order via a controlled script
```
