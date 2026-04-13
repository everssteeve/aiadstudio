FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY server/package.json ./server/
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
COPY packages/adapters/package.json ./packages/adapters/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter server build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "server/dist/index.js"]
