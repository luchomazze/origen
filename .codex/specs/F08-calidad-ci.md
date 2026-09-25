# F08 — Tests, lint y CI

**Prioridad:** P1 · **Esfuerzo:** M · **Depende de:** —

## Contexto

Scripts actuales: `dev`, `build`, `preview`, `typecheck`, `format`. No hay tests, linter ni `.github/`. La lógica con más riesgo de regresión es pura y fácil de testear: `mapListing`, `slugify`, `searchIndex` / `matchesSearchTerms`, `adminSearchIndex`, `validate()` del formulario de Admin, `buildWAUrl`. Los bugs reales de este proyecto (colisión de slugs, policies RLS faltantes) habrían aparecido con tests.

## Requisitos

- R1 `pnpm test` DEBE correr tests unitarios de: `slugify`, `mapListing`, búsqueda multipalabra, `validate()`, `buildWAUrl`/plantillas, `buildShareUrl` (F04).
- R2 DEBE existir un test de regresión para la colisión de slugs (dos títulos iguales → slugs distintos).
- R3 DEBE existir un test de RLS contra un Supabase local (`supabase start`): anónimo solo lee publicadas y sus tipologías/imágenes; anónimo no escribe; admin lee borradores.
- R4 `pnpm lint` DEBE correr ESLint (reglas de hooks de React + TS).
- R5 CUANDO se abre un PR o se hace push a `main`, GitHub Actions DEBE correr `typecheck`, `lint`, `test` y `build`, y bloquear el merge si falla.
- R6 DEBERÍA existir un smoke test E2E (Playwright): Home → catálogo → ficha → CTA WhatsApp con URL correcta; login admin inválido muestra error.

## Diseño

- Vitest (mismo pipeline que Vite) + `@testing-library/react` para componentes puntuales.
- `validate()` hoy vive dentro de `AdminPublications.tsx`: extraerla a `components/admin/validateListing.ts` para testearla.
- RLS: tests en `supabase/tests/*.sql` con pgTAP (`supabase test db`) o Vitest con dos clientes (anon / admin) contra Supabase local.
- CI: `.github/workflows/ci.yml` con Node 22 + pnpm 10.34.3 (según `.mise.toml`), cache de pnpm.

## Tareas

- [ ] T1. Vitest + scripts `test`. (R1)
- [ ] T2. Extraer `validate()` y escribir tests unitarios. (R1, R2)
- [ ] T3. ESLint + script `lint`; corregir errores iniciales. (R4)
- [ ] T4. Tests RLS con Supabase local. (R3)
- [ ] T5. Workflow de CI + protección de rama `main`. (R5)
- [ ] T6. Playwright smoke test (opcional en CI, obligatorio antes de lanzar). (R6)

## Fuera de alcance

- Cobertura mínima obligatoria; tests visuales.

## Definición de terminado

CI verde en un PR; ToDo S7 "Tests unitarios", "Tests de login, CRUD, Storage y RLS" y "GitHub Actions" marcados.
