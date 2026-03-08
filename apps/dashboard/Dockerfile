# ==========================================
# Stage 1 – base: minimal Node image with package managers
# ==========================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo

# ==========================================
# Stage 2 – pruner: isolate @repo/dashboard deps for Docker layer caching
# ==========================================
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=@repo/dashboard --docker

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
RUN pnpm turbo run build --filter=@repo/dashboard

# ==========================================
# Stage 4 – runner: minimal production image
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/dashboard/.next/standalone ./
COPY --from=builder /app/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=builder /app/apps/dashboard/public ./apps/dashboard/public

USER nextjs
EXPOSE 3001

CMD ["node", "apps/dashboard/server.js"]
