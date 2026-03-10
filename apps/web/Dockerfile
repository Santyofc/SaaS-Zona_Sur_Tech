# ==========================================
# Stage 1 – base: minimal Node image with package managers
# ==========================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo

# ==========================================
# Stage 2 – pruner: isolate @repo/web deps for Docker layer caching
# ==========================================
FROM node:20-alpine AS pruner

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY turbo.json .
COPY tsconfig.base.json .
COPY apps ./apps
COPY packages ./packages

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

RUN pnpm dlx turbo prune --scope=@repo/web --docker

# ==========================================
# Stage 3 – builder: install deps and build
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json
RUN pnpm turbo run build --filter=@repo/web

# ==========================================
# Stage 4 – runner: minimal production image
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
