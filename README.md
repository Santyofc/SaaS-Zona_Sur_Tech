<h1 align="center">
  SaaS Zona Sur Tech
</h1>

<p align="center">
  Plataforma SaaS multi-tenant tipo ERP para PYMEs.
  <br/>
  Ventas · Inventario · Facturación · Automatización
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/NestJS-API-E0234E?style=for-the-badge&logo=nestjs" />
  <img src="https://img.shields.io/badge/PostgreSQL-DB-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazonaws" />
</p>

<p align="center">
  <a href="https://zonasurtech.online">🌐 Website</a> ·
  <a href="https://github.com/Santyofc">💻 GitHub</a>
</p>

---

## 🚀 Overview

SaaS modular diseñado para negocios que necesitan:

- Control de ventas
- Gestión de inventario
- Facturación electrónica (CR)
- Automatización de procesos
- Centralización de operaciones

Arquitectura enfocada en **multi-tenancy real + escalabilidad + módulos independientes**.

---

## 🧠 Arquitectura

```text
Cliente (Browser)
      ↓
Next.js (apps/web)
      ↓  JWT + OrgID
NestJS API (apps/api)
      ↓
PostgreSQL (Drizzle ORM)
      ↓
Servicios externos (Facturación / Bots / IA)
```
