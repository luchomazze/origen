# F09 — Deploy en Vercel y operación

**Prioridad:** P0 · **Esfuerzo:** S · **Depende de:** —

## Contexto

Vercel está decidido (ToDo, Decisiones) pero no hay `vercel.json`, `public/` ni documentación de operación. Solo hay un proyecto de Supabase (usado para desarrollo y pruebas). Las migraciones se corren a mano en el SQL Editor.

## Requisitos

- R1 CUANDO se hace push a `main`, Vercel DEBE desplegar a producción; CUANDO se abre un PR, DEBE generar un preview.
- R2 Cualquier ruta pública (F01) DEBE servir la SPA (rewrite a `index.html`), excepto `/api/*` y los assets.
- R3 Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` DEBEN configurarse por ambiente (Production / Preview), apuntando a proyectos de Supabase distintos.
- R4 El sitio DEBE responder con headers de seguridad: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY` (salvo que se necesite embeber), y cache largo (`immutable`) para `/assets/*`.
- R5 DEBE existir documentación de: cómo correr migraciones en orden, cómo hacer rollback, cómo crear un admin (F05), y checklist de release.
- R6 Antes del primer lanzamiento, DEBE ejecutarse un smoke test en desktop y mobile sobre el preview.

## Diseño

- `vercel.json`: `rewrites` SPA, `headers`, y los rewrites de F03 (OG por user-agent, sitemap).
- Supabase: proyecto `origen-prod` separado; aplicar migraciones con Supabase CLI (`supabase link` + `supabase db push`) en vez de copiar/pegar.
- Documentación en `README.md` → sección "Operación" (o `docs/operacion.md`).
- Dominio propio configurado en Vercel + agregado en Supabase Auth Redirect URLs.

## Tareas

- [ ] T1. Conectar el repo `origen-real-estate` a Vercel; variables por ambiente. (R1, R3)
- [ ] T2. `vercel.json` con rewrites y headers. (R2, R4)
- [ ] T3. Crear proyecto Supabase de producción; aplicar migraciones con CLI; crear admin. (R3)
- [ ] T4. Documentar operación, migraciones, rollback y checklist de release. (R5)
- [ ] T5. Dominio + DNS + HTTPS. (R1)
- [ ] T6. Smoke test desktop/mobile en preview. (R6)

## Preguntas abiertas

- Dominio.
- ¿Plan de Supabase (Free pausa proyectos inactivos a la semana; para producción conviene Pro)?

## Definición de terminado

Push a `main` publica en el dominio; recargar cualquier ruta funciona; ToDo S7 "Configurar Vercel", "Documentar operación" y "Smoke test" marcados.
