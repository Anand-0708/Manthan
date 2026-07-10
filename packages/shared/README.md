# @manthan/shared

Shared enums, DTOs, constants, and validation schemas used by both
`apps/api` and `apps/web`, so type/enum drift between frontend and backend
is structurally impossible.

## Structure

```
src/
├── enums/       Domain enums (ConferenceStatus, PaperStatus, etc.) — added per module
├── dtos/        Request/response DTOs — added per module
├── constants/   Cross-cutting constants (pagination defaults, etc.)
└── schemas/     Zod validation schemas
```

## Phase 0 status

Only cross-cutting infrastructure (pagination constants/schema) is
populated. Domain-specific enums, DTOs, and schemas are added module by
module as each business module is implemented in later phases.

## Build

```bash
pnpm --filter @manthan/shared build
```

Outputs dual CJS + ESM bundles with type declarations via `tsup`, so it can
be consumed by both the CommonJS Express backend and the ESM-based Next.js
frontend.