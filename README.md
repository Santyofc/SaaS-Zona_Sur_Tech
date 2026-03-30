# SaaS Zona Sur Tech

Plataforma SaaS multi-tenant tipo ERP para PYMEs.

[![CI](https://github.com/Santyofc/SaaS-Zona_Sur_Tech/actions/workflows/ci.yml/badge.svg)](https://github.com/Santyofc/SaaS-Zona_Sur_Tech/actions/workflows/ci.yml)
![Monorepo](https://img.shields.io/badge/monorepo-turborepo-ef4444)
![Node](https://img.shields.io/badge/node-20%2B-16a34a)
![pnpm](https://img.shields.io/badge/pnpm-9-f59e0b)

## Que resuelve
- Ventas y operaciones para equipos pequenos y medianos.
- Inventario, CRM, facturacion electronica y flujos de workspace.
- Base multi-tenant con enfoque en aislamiento y permisos.

## Stack principal
- Frontend: Next.js 14 (`apps/web`)
- Backend: NestJS (`apps/api`)
- Data: PostgreSQL + Drizzle (`packages/db`)
- Auth: Supabase + utilidades de autorizacion (`packages/auth`)
- Monorepo tooling: Turborepo + pnpm

## Quickstart
```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Produccion
- Nginx productivo: [infra/nginx/zonasurtech.production.conf](C:/Users/Dev%20Profile/Desktop/SaaS-Zona_Sur_Tech/infra/nginx/zonasurtech.production.conf)
- Deploy EC2: [infra/scripts/deploy-ec2.sh](C:/Users/Dev%20Profile/Desktop/SaaS-Zona_Sur_Tech/infra/scripts/deploy-ec2.sh)
- Cloudflare setup: [infra/scripts/cloudflare-setup.sh](C:/Users/Dev%20Profile/Desktop/SaaS-Zona_Sur_Tech/infra/scripts/cloudflare-setup.sh)
- Checklist: [docs/production-checklist.md](C:/Users/Dev%20Profile/Desktop/SaaS-Zona_Sur_Tech/docs/production-checklist.md)

## Scripts utiles
- `pnpm dev`: arranca entorno de desarrollo.
- `pnpm dev:web`: arranca solo el frontend.
- `pnpm dev:api`: arranca solo la API.
- `pnpm lint`: corre linters en el monorepo.
- `pnpm typecheck`: valida tipos en workspaces.
- `pnpm build`: build completo con Turbo.

## Estructura
```text
apps/
  web/          # Next.js app
  api/          # NestJS API
packages/
  auth/         # authz, membership, roles
  db/           # schema, migrations, RLS
  email/        # templates y delivery
  platform/     # rate-limit, jobs, logging
infra/          # deploy, nginx, operaciones
```

## Documentacion
- [Architecture](docs/ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Infra docs](infra/docs/DEPLOY.md)
- [Operations](infra/docs/OPERATIONS.md)

## Calidad y colaboración
- CI automatizada en Pull Requests y ramas principales.
- Templates de Issues/PR para cambios mas claros.
- `CODEOWNERS` y `Dependabot` para mantenimiento continuo.

## Sitio
- Produccion: https://zonasurtech.online

## Support
- GitHub Sponsors: https://github.com/sponsors/Santyofc

Sponsor button:
```html
<iframe src="https://github.com/sponsors/Santyofc/button" title="Sponsor Santyofc" height="32" width="114" style="border: 0; border-radius: 6px;"></iframe>
```

Sponsor card:
```html
<iframe src="https://github.com/sponsors/Santyofc/card" title="Sponsor Santyofc" height="225" width="600" style="border: 0;"></iframe>
```
