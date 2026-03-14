# ERP API

Backend oficial del dominio ERP en NestJS.

## Responsabilidad

`apps/api` es la autoridad para:

- productos
- movimientos de inventario
- balances
- ventas
- cancelaciones de venta
- dashboard ERP

El frontend no debe mutar datos ERP directo a DB.

## Contrato de autenticación y tenancy

Headers requeridos:

```http
Authorization: Bearer <supabase_access_token>
X-Organization-Id: <active_org_id>
```

El API:

- valida el JWT contra `SUPABASE_JWKS_URL`
- identifica usuario
- valida membership activa en la organización enviada
- resuelve permisos por rol
- rechaza requests inconsistentes

## Variables mínimas

- `DATABASE_URL`
- `SUPABASE_JWKS_URL`
- `CORS_ORIGIN`
- `PORT`

## Desarrollo

```bash
pnpm --filter api start:dev
```

Health:

```bash
GET /health
```

## Build

```bash
pnpm --filter api build
pnpm --filter api lint
pnpm --filter api typecheck
```
