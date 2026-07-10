# Manthan

Conference and research paper management platform.

> Status: Phase 0 — Foundation Setup

## Monorepo layout

```
manthan/
├── apps/
│   ├── web/      Next.js frontend (App Router, TypeScript, Tailwind, shadcn/ui)
│   └── api/      Express backend (TypeScript)
├── packages/
│   └── shared/   Shared enums, DTOs, constants, and validation schemas
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Prerequisites

- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)
- Docker + Docker Compose

## Getting started

```bash
# Initialize git (Husky hooks require a git repo to attach to)
git init

# Install dependencies for all workspaces
pnpm install

# Start Postgres, api, and web via Docker
docker compose up

# Or run everything locally without Docker
pnpm dev
```

`pnpm install` runs the `prepare` script, which wires up Husky's git hooks
(`.husky/pre-commit` runs `lint-staged` on every commit).

## Common scripts

| Command | Description |
|---|---|
| `pnpm dev` | Run all apps in dev mode (via Turborepo) |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all workspaces |
| `pnpm typecheck` | Type-check all workspaces |
| `pnpm format` | Format the repo with Prettier |

## Health check

Once the API is running: `GET http://localhost:4000/api/v1/health`

## Notes

This is Phase 0 scaffolding only — no authentication, business modules, or
Prisma schema have been implemented yet. See the project roadmap for the
phased build plan.