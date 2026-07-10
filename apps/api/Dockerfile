# syntax=docker/dockerfile:1

# ---- Base ----
FROM node:20-slim AS base
RUN corepack enable
WORKDIR /repo

# ---- Dependencies (all workspaces, so pnpm can dedupe correctly) ----
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile --filter=@manthan/api...

# ---- Builder ----
FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /repo/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
RUN pnpm --filter=@manthan/shared build
RUN pnpm --filter=@manthan/api build

# ---- Runtime ----
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 expressjs

COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/package.json ./package.json
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/packages/shared/dist ./node_modules/@manthan/shared/dist
COPY --from=builder /repo/packages/shared/package.json ./node_modules/@manthan/shared/package.json

USER expressjs

EXPOSE 4000

CMD ["node", "dist/server.js"]