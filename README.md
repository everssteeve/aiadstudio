# AIAD Studio

AI-Assisted Development Studio — orchestrates intent-driven development workflows via specialized Claude agents.

## Structure

- `server/` — Express/Fastify API backend
- `ui/` — React frontend
- `packages/db/` — Database schema & migrations (Drizzle ORM)
- `packages/shared/` — Shared types & validators
- `packages/adapters/` — External service adapters
- `cli/` — CLI for SDD/AIAD/context commands
- `.claude/agents/` — Specialized Claude agent profiles

## Getting Started

```bash
pnpm install
docker-compose up -d
pnpm dev
```
