# F02 — Configuración del sitio en Supabase y eliminación de placeholders

**Prioridad:** P0 · **Esfuerzo:** S · **Depende de:** —

## Contexto

La configuración de WhatsApp (número + plantillas) se guarda en `localStorage` (`utils/whatsapp.ts`, clave `origen_wa_config`). Lo que edita el admin **solo lo ve el navegador del admin**: todos los visitantes usan `DEFAULT_CONFIG` con el número placeholder `5493515000000`. Además hay **15** apariciones hardcodeadas de `wa.me/5493515000000` en cards, `Home.tsx`, `Footer.tsx`, `Lands.tsx`. La tabla `site_settings` (fila única `id = 'global'`) y sus policies RLS ya existen, pero nadie las usa. Advertencia en SKILL.md: `site_settings` no tiene policy pública de SELECT confirmada en el remoto; verificarla antes.

## Requisitos

**Historia 1 — Como admin quiero cambiar el WhatsApp e Instagram una vez y que lo vean todos los visitantes.**

- R1.1 CUANDO el admin guarda la configuración, EL SISTEMA DEBE persistirla en `site_settings` y mostrar confirmación o error.
- R1.2 CUANDO un visitante carga el sitio, EL SISTEMA DEBE usar la configuración de `site_settings`.
- R1.3 SI `site_settings` no responde, EL SISTEMA DEBE seguir funcionando con un valor por defecto definido en **un único lugar** (no número placeholder: usar variable de entorno `VITE_DEFAULT_WHATSAPP` o, en su defecto, ocultar el CTA).
- R1.4 Las plantillas DEBEN soportar `{nombre}` como hoy.

**Historia 2 — Como negocio no quiero ningún dato ficticio en producción.**

- R2.1 NO DEBE existir ningún `wa.me/<número>` literal en `src/`; todos los links de WhatsApp DEBEN salir de `buildWAUrl`.
- R2.2 El link de Instagram DEBE salir de `site_settings.instagram_url`.
- R2.3 CUANDO `whatsapp_enabled` es falso (global), EL SISTEMA DEBE ocultar los CTAs de WhatsApp.

## Diseño

- Migración: confirmar/crear policy pública `select` sobre `site_settings`; `insert ... on conflict do nothing` de la fila `global` con datos reales.
- Nuevo `data/siteSettingsApi.ts`: `getSiteSettings()` (cacheado en memoria, prefetch al bootear como `getPublicListings`) y `updateSiteSettings()` (admin).
- Mapear columnas → `WAConfig` extendido: `{ number, projectMsg, propertyMsg, landMsg, instagramUrl, enabled }`.
- Reemplazar `loadConfig/saveConfig` por un `SiteSettingsProvider` (Context) o por el `waConfig` que ya se hila desde `App.tsx` (menos cambio: mantener el prop drilling actual, cambiar solo la fuente).
- Migración única desde `localStorage`: si existe `origen_wa_config` y el admin está logueado, ofrecer "Importar configuración local" una vez.

## Tareas

- [ ] T1. Verificar policies de `site_settings` en el remoto (`pg_policies`); agregar SELECT pública si falta. (R1.2)
- [ ] T2. Seed/upsert de la fila `global` con número e Instagram reales. (R1.2)
- [ ] T3. `siteSettingsApi.ts` con cache + prefetch. (R1.2)
- [ ] T4. Sección WhatsApp de Admin guarda en Supabase, con estados de guardado y error. (R1.1)
- [ ] T5. Reemplazar las 15 URLs hardcodeadas por `buildWAUrl` / `instagramUrl`. (R2.1, R2.2)
- [ ] T6. Manejo de `enabled` y de fallo de carga. (R1.3, R2.3)
- [ ] T7. Eliminar `localStorage` de WhatsApp (dejar solo el importador de una vez). (R1.1)
- [ ] T8. Verificar: cambiar número en Admin → abrir el sitio en incógnito → CTA con número nuevo. (todos)

## Fuera de alcance

- Configurar otros textos del sitio (hero, "Quiénes somos") desde Admin.

## Preguntas abiertas

- Número de WhatsApp e Instagram reales.
- ¿Un número por tipo de publicación o uno solo? (hoy: uno solo)

## Definición de terminado

`grep -rn "wa.me/[0-9]" src` sin resultados; prueba en incógnito OK; ToDo S6 "Migrar WhatsApp a `site_settings`" y "Eliminar fallbacks" marcados.
