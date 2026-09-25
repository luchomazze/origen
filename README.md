# ORIGEN Real Estate

Frontend de ORIGEN Inversiones Inmobiliarias, construido con React, TypeScript, Vite y Tailwind CSS. Usa Supabase como backend, autenticacion y almacenamiento de imagenes.

## Requisitos

- Node.js 22
- pnpm 10.34.3

Las versiones tambien estan declaradas en `.mise.toml`.

## Instalacion

```bash
pnpm install
pnpm dev
```

La aplicacion usa el puerto `8443` (configurable con la variable `PORT`).

## Variables de entorno

Copia `.env.example` como `.env` cuando exista un proyecto Supabase:

```bash
cp .env.example .env
```

Variables esperadas:

- `VITE_SUPABASE_URL`: URL publica del proyecto Supabase.
- `VITE_SUPABASE_ANON_KEY`: clave publica anonima del proyecto.

La anon key puede estar disponible en el frontend porque Supabase la protege mediante RLS. Una `service_role` key, credenciales administrativas o secretos nunca deben agregarse al frontend, al repositorio ni a variables `VITE_*`.

El proyecto Supabase ya esta configurado en el entorno local y el sitio publico consulta sus datos reales. Las credenciales viven solamente en `.env`, que no se versiona.

## Base de datos

El esquema inicial y el seed reproducible estan preparados en:

- `supabase/migrations/20260921000000_initial_schema.sql`
- `supabase/seed.sql`

El repositorio contiene SQL de referencia y seed para las tablas reales `listings`, `listing_typologies`, `listing_images`, `site_settings` y `profiles`. Las migraciones iniciales fueron creadas antes de conocer el esquema remoto y deben alinearse antes de usarse para provisionar un proyecto nuevo.

El seed contiene 16 listings, 15 tipologias, 16 imagenes de portada y configuracion inicial de WhatsApp. El frontend ya no usa el dataset mock local; el seed se conserva como carga inicial reproducible.

La autenticacion y las politicas RLS estan implementadas en `src/auth/`, `src/pages/AdminLogin.tsx` y las migraciones de `supabase/`. El login, perfil admin, rechazo de usuario no autorizado y logout fueron probados; el sitio publico ya muestra listings reales.

Para permitir que la API REST de Supabase consulte las tablas con los roles `anon` y `authenticated`, ejecuta tambien `supabase/migrations/20260921002000_api_grants.sql` en el SQL Editor. RLS y los grants son controles complementarios: ambos deben estar configurados.

Si el proyecto remoto ya existia antes de integrar la carga de imagenes, ejecuta tambien `supabase/migrations/20260921004000_create_listing_images_bucket.sql` y `supabase/migrations/20260921005000_listing_images_storage_policies.sql` en el SQL Editor. Crean el bucket publico `listing-images` y aplican las politicas RLS que permiten cargar, actualizar y eliminar archivos solo al administrador.

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
