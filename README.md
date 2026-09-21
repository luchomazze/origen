# ORIGEN Real Estate

Frontend de ORIGEN Inversiones Inmobiliarias, construido con React, TypeScript, Vite y Tailwind CSS. El proyecto parte de una maqueta de Figma Make y se prepara para usar Supabase como backend, autenticacion y almacenamiento de imagenes.

## Requisitos

- Node.js 22
- pnpm 10.34.3

Las versiones tambien estan declaradas en `.mise.toml`.

## Instalacion

```bash
pnpm install
pnpm dev
```

La aplicacion usa el puerto configurado por Vite/Figma Make, normalmente `8443`.

## Variables de entorno

Copia `.env.example` como `.env` cuando exista un proyecto Supabase:

```bash
cp .env.example .env
```

Variables esperadas:

- `VITE_SUPABASE_URL`: URL publica del proyecto Supabase.
- `VITE_SUPABASE_ANON_KEY`: clave publica anonima del proyecto.

La anon key puede estar disponible en el frontend porque Supabase la protege mediante RLS. Una `service_role` key, credenciales administrativas o secretos nunca deben agregarse al frontend, al repositorio ni a variables `VITE_*`.

El proyecto Supabase aun no esta creado; hasta entonces la maqueta sigue usando sus datos demo locales.

## Base de datos

El esquema inicial y el seed reproducible estan preparados en:

- `supabase/migrations/20260921000000_initial_schema.sql`
- `supabase/seed.sql`

La migracion crea `listings`, `listing_units`, `listing_images`, `site_settings` y `profiles`, con constraints, indices, relaciones y RLS habilitado. Las politicas de acceso se implementaran junto con Auth en el siguiente sprint.

El seed contiene los 16 listings, 15 unidades y las imagenes demo actuales. No debe ejecutarse en produccion hasta revisar y reemplazar esos datos de demostracion.

La autenticacion y las politicas RLS estan preparadas en `src/auth/`, `src/pages/AdminLogin.tsx` y `supabase/migrations/20260921001000_rls_policies.sql`. Hasta crear el proyecto remoto y configurar `.env`, el login muestra que Supabase esta pendiente y el dashboard no se expone.

## Comandos

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm preview
pnpm format
```

## Direccion del proyecto

El repositorio previsto es `origen-real-estate`. Todavia no hay remoto configurado ni se hizo push.

## Estado de la migracion

- Sprint 0: preparacion local, documentacion y cliente Supabase aislado.
- Siguiente etapa: crear el esquema Supabase, migraciones y seed de listings.
- Autenticacion, RLS, Storage y CRUD administrativo aun no estan implementados.

Consulta `.codex/ToDo` para el roadmap completo.
