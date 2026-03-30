FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile

FROM deps AS builder
RUN pnpm --filter @repo/db build \
 && pnpm --filter @repo/auth build \
 && pnpm --filter @repo/email build \
 && pnpm --filter api build

FROM builder AS deploy
RUN pnpm --filter api --prod deploy /app/deploy

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=deploy /app/deploy ./
USER nestjs
EXPOSE 4000
CMD ["node", "dist/main.js"]
