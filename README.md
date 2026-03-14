# SaaS Zona Sur Tech

Monorepo `pnpm` + `turbo` para una plataforma SaaS multi-tenant con:

- `apps/web`: Next.js 14 App Router. Frontend principal y SaaS core temporal.
- `apps/api`: NestJS. Backend oficial del dominio ERP.
- `packages/auth`: guards y helpers de auth/tenancy sobre Supabase Auth.
- `packages/db`: esquema Drizzle, migraciones SQL y acceso PostgreSQL.
- `packages/platform`: rate limiting, logging y utilidades operativas.
- `packages/email`: envío de correos transaccionales.
- `packages/ui`: componentes compartidos.

## Arquitectura actual

- Auth y sesión: Supabase Auth.
- Organización activa: se resuelve en `web` y viaja al API como `X-Organization-Id`.
- SaaS core multi-tenant: rutas `app/api` dentro de `apps/web`.
- ERP: `apps/api` con NestJS.
- Contrato web -> API:
  - `Authorization: Bearer <supabase_access_token>`
  - `X-Organization-Id: <active_org_id>`

El API valida JWT, membership activa y permisos por rol. `organizationId` en `app_metadata` no es autoridad para el workspace activo.

## Estructura

```text
apps/
  api/        NestJS ERP API
  web/        Next.js frontend + SaaS core
packages/
  auth/       Auth, permisos, memberships, invitaciones
  db/         Drizzle schema + migrations
  email/      Email transactional
  platform/   Logging, rate limit, helpers
  ui/         Design system compartido
  ui-experiments/
infra/
  docker/     Compose de producción
  nginx/      Reverse proxy de VPS
  scripts/    Deploy, rollback y healthchecks
```

## Requisitos

- Node.js `20.x`
- `pnpm` `9.x`
- Docker Desktop / Docker Engine
- PostgreSQL accesible por `DATABASE_URL`
- Proyecto Supabase configurado

## Instalación

```bash
corepack enable pnpm
pnpm install
cp .env.example .env
```

## Variables mínimas

Revisar `.env.example`. Las claves mínimas para desarrollo son:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_API_URL`
- `SUPABASE_JWKS_URL`
- `CORS_ORIGIN`

## Desarrollo local

Web:

```bash
pnpm dev:web
```

API:

```bash
pnpm dev:api
```

Ambos:

```bash
pnpm dev
```

Por defecto:

- Web: `http://localhost:3000`
- API ERP: `http://localhost:4000`

## Comandos útiles

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm --filter @repo/web dev
pnpm --filter api start:dev
docker compose up --build
docker compose build
```

## Base de datos

Migraciones SQL versionadas en `packages/db/drizzle`.

Aplicar migraciones:

```bash
pnpm --filter @repo/db db:migrate
```

Generar artefactos Drizzle:

```bash
pnpm --filter @repo/db db:generate
```

## Docker local

`docker-compose.yml` levanta:

- `db` PostgreSQL
- `redis`
- `api`
- `web`

El archivo está alineado con la estructura real del repo. No existen `apps/dashboard` ni `apps/client`.

## Producción en VPS

- Compose de producción: `infra/docker/docker-compose.prod.yml`
- Nginx VPS: `infra/nginx/vm-platform.conf`
- Healthcheck: `infra/scripts/healthcheck.sh`

Recomendación actual:

- `zonasurtech.online` -> `web`
- `api.zonasurtech.online` -> `api`

## Estado del repositorio

Estado actual recomendado: `MVP estable para desarrollo`.

No está listo todavía para producción pública. Faltan al menos:

- gestión formal de secretos
- observabilidad/alerting real
- backups validados
- endurecimiento de CORS/cookies según dominio final
- pruebas automatizadas de flujos críticos
- revisión de seguridad y límites operativos
