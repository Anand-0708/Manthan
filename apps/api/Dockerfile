# ---------- Base ----------
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable

WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps

COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY turbo.json .
COPY tsconfig.base.json .

COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN pnpm install --frozen-lockfile

# ---------- Builder ----------
FROM deps AS builder

COPY . .

RUN pnpm --filter @manthan/shared build

RUN pnpm --filter @manthan/api db:generate

RUN pnpm --filter @manthan/api build

# ---------- Runner ----------
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/package.json .
COPY --from=deps /app/pnpm-lock.yaml .
COPY --from=deps /app/pnpm-workspace.yaml .

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/api ./apps/api

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["pnpm", "start"]