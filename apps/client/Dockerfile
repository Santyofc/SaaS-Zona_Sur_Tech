# ==========================================
# Stage 1 – base: minimal Node image with package managers
# ==========================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo

# ==========================================
# Stage 2 – pruner: isolate @repo/client deps for Docker layer caching
# ==========================================
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=@repo/client --docker

# ==========================================
# Stage 3 – builder: install deps and build
# ==========================================
FROM base AS builder
WORKDIR /app

# Install dependencies from the pruned lockfile
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copy the full pruned source and build
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@repo/client

# ==========================================
# Stage 4 – runner: minimal production image
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static

USER nextjs
EXPOSE 3002

CMD ["node", "apps/client/server.js"]
