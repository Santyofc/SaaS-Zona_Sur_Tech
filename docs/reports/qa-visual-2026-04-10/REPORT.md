# QA Visual + UX Report
Fecha: 2026-04-10
Scope: Landing, Auth, Dashboard Team (UI/UX + accesibilidad)

## Evidencia (capturas)
- `home-mobile.png`
- `home-tablet.png`
- `home-desktop.png`
- `signin-mobile.png`
- `signin-desktop.png`
- `dashboard-team-desktop.png`

## Breakpoints revisados
- Mobile: 390x844
- Tablet: 1024x1366
- Desktop: 1440x1800 / 1440x1400

## Hallazgos visuales
- Landing: jerarquía visual consistente entre hero, features, emuladores, bento y CTA.
- Landing mobile: contenido legible, sin overflow horizontal detectado en la captura full-page.
- Auth signin: layout estable en mobile y desktop, con contraste consistente.
- Dashboard Team: la ruta en contexto de navegador limpio redirige a signin (esperado por autenticación).

## Hallazgos UX / Accesibilidad corregidos
- Idioma EN/ES unificado en feedback y acciones de Team:
  - Members, Invitations, Activity, modales de confirmación, botones de acción.
- Tabs Team:
  - `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-controls`, `aria-labelledby`, `tabIndex` y navegación por flechas izquierda/derecha.
- ConfirmDialog:
  - `aria-labelledby` único por instancia.
  - foco inicial en botón de cancelar.
  - restauración de foco al cerrar.
  - focus trap básico con `Tab`/`Shift+Tab`.
- ActionMenu:
  - `Escape` para cerrar.
  - foco inicial en primer item al abrir.
  - etiqueta accesible en español.
- WorkspaceSwitcher:
  - cierre por `Escape`.
  - labels y mensajes de estado/error en español.

## Estados vacio/error/loading verificados
- Vacío: `EmptyState` en Activity, Members, Invitations.
- Error: `ErrorBanner` (acciones y formulario de invitaciones / miembros).
- Loading:
  - Spinner en Team y Dashboard.
  - overlay de procesamiento en acciones de miembros.
  - estado de carga en switch de workspace.

## Riesgos / pendientes menores
- El screenshot de `/dashboard/team` desde contexto sin sesión muestra signin (correcto funcionalmente), por lo que la validación visual del Team autenticado requiere estado de sesión de QA.
- Quedan textos en inglés fuera del scope inmediato (módulos ERP y algunos comments internos), no bloqueantes para este cierre visual de landing/dashboard.
