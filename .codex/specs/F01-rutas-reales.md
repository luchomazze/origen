# F01 — Rutas reales, deep links y 404

**Prioridad:** P0 · **Esfuerzo:** M · **Depende de:** — · **Habilita:** F03, F04, F07

## Contexto

Hasta el 2026-09-25 la navegación era solo estado de React y la URL nunca cambiaba. **Avance en curso (2026-09-25):** se agregó un router propio mínimo (`src/utils/routing.ts`: `parsePath` / `buildPath`; `App.tsx` hace `pushState` en `navigate` y escucha `popstate`). Ya usa el mapa de rutas de abajo, así que cubre en parte R1.1, R1.2 y R1.3. Pendiente: las rutas desconocidas caen en Home en vez de 404, los links no son `<a href>`, no hay query params ni slug persistido, y no existe el rewrite SPA de Vercel (sin él, recargar `/propiedades/x` en producción da 404).

`slug` se deriva en el cliente (`slugify(title)-<uuid>`, `listingsApi.ts:114`); no hay columna `slug` en `listings`.

## Requisitos

**Historia 1 — Como visitante quiero que cada página tenga su URL para poder volver a ella, recargarla o compartirla.**

- R1.1 CUANDO el visitante navega a una sección, EL SISTEMA DEBE actualizar la URL según el mapa de rutas (ver Diseño).
- R1.2 CUANDO el visitante abre directamente una URL válida (pegada, recargada o desde un link externo), EL SISTEMA DEBE mostrar esa página.
- R1.3 CUANDO el visitante usa Atrás/Adelante del navegador, EL SISTEMA DEBE mostrar la página correspondiente y restaurar el scroll arriba en páginas nuevas.
- R1.4 Los links internos DEBEN ser `<a href>` reales (clic medio / "abrir en pestaña nueva" funciona).

**Historia 2 — Como visitante quiero URLs legibles.**

- R2.1 La URL de una publicación DEBE tener la forma `/propiedades/<slug>`, `/terrenos/<slug>`, `/emprendimientos/<slug>`.
- R2.2 El slug DEBE ser legible (derivado del título), único y estable: cambiar el título NO DEBE romper links ya compartidos.
- R2.3 CUANDO se accede con un slug viejo o con formato `titulo-<uuid>`, EL SISTEMA DEBE redirigir (replace) a la URL canónica.

**Historia 3 — Como visitante quiero que los filtros se reflejen en la URL.**

- R3.1 CUANDO el visitante aplica búsqueda o filtros en un catálogo, EL SISTEMA DEBE reflejarlos como query params (`?q=&ciudad=&dormitorios=`), sin agregar una entrada de historial por cada tecla (usar `replace`).
- R3.2 CUANDO se abre un catálogo con query params, EL SISTEMA DEBE aplicar esos filtros y abrir el panel "Buscar y filtrar".

**Historia 4 — Estados de error.**

- R4.1 CUANDO la ruta no existe, EL SISTEMA DEBE mostrar una página 404 con Header/Footer y links a los catálogos.
- R4.2 CUANDO la publicación no existe o no está publicada, EL SISTEMA DEBE mostrar el estado "no disponible" existente de `Detail.tsx`.
- R4.3 CUANDO el Home no tiene destacados que mostrar, EL SISTEMA DEBE ocultar la sección en vez de dejarla vacía.

**Historia 5 — Admin.**

- R5.1 El panel DEBE vivir en `/admin` (secciones como `/admin/publicaciones`, `/admin/whatsapp`).
- R5.2 "Ver en el sitio" en Admin DEBE abrir la ficha pública en pestaña nueva.

## Diseño

**Mapa de rutas**

| Ruta | Página |
|---|---|
| `/` | Home |
| `/propiedades`, `/propiedades/:slug` | Properties / Detail PROPIEDAD |
| `/terrenos`, `/terrenos/:slug` | Lands / Detail TERRENO |
| `/emprendimientos`, `/emprendimientos/:slug` | Projects / Detail EMPRENDIMIENTO |
| `/contacto` | Contact |
| `/admin`, `/admin/:section` | AdminRoute |
| `*` | NotFound |

- **Router:** se optó por el router propio (`utils/routing.ts`), ya implementado. Es suficiente para 8 páginas y no suma dependencias. Completarlo con: ruta `not-found` en `parsePath`, un componente `<AppLink>` que renderice `<a href={buildPath(...)}>` e intercepte el clic (R1.4), y helpers de query params con `URLSearchParams` + `history.replaceState` (R3). Migrar a `react-router` solo si aparecen rutas anidadas o hace falta `lazy` por ruta (F07 puede resolverse con `React.lazy` igual).
- **Slug persistido:** migración `add_listing_slug.sql`: columna `slug text unique not null`, backfill con `slugify(title)` + sufijo `-2`, `-3` si colisiona; trigger o lógica en Admin para generarlo al crear. El slug **no** se regenera al editar el título (R2.2); Admin permite editarlo a mano con validación de formato y unicidad.
- **Compatibilidad (R2.3):** si `:slug` termina en un uuid, buscar por id y redirigir a la canónica.
- **Vercel:** rewrite de todas las rutas a `index.html` (`vercel.json`, ver F09).
- **Datos:** `Detail` pasa a pedir la publicación por slug (`.eq('slug', …).single()`) + relacionadas con `.limit(3)` (cierra el pendiente de F07).

**Archivos afectados:** `App.tsx`, `types.ts` (`Page`, `NavProps`), `Header.tsx`, `Footer.tsx`, cards, las 8 páginas, `Admin.tsx`, `AdminPublications.tsx`, `listingsApi.ts`, `adminListingsApi.ts`, nueva migración, `vercel.json`.

## Tareas

- [ ] T1. Migración `slug` + backfill + índice único; ejecutar en Supabase y verificar con `information_schema`. (R2.2)
- [ ] T2. Admin: campo slug (autogenerado al crear, editable, validado). (R2.2)
- [ ] T3. `listingsApi`: usar `slug` de la base; función `getPublicListingBySlug(slug)` + `getRelated(tipo, excludeId, 3)`. (R2.1)
- [x] T4. Router propio: `parsePath`/`buildPath`, `pushState` en `navigate`, `popstate`. (R1.1, R1.2, R1.3 parcial)
- [ ] T5. `<AppLink>` con `href` real y migrar Header/Footer/cards. (R1.4)
- [ ] T6. Scroll: al tope en navegación nueva, conservar posición al volver con Atrás. (R1.3)
- [ ] T7. Redirect de formato viejo `titulo-<uuid>` a canónica. (R2.3)
- [ ] T8. Filtros ↔ query params en los 3 catálogos. (R3.1, R3.2)
- [ ] T9. Página 404 + ocultar secciones vacías en Home. (R4.1, R4.3)
- [ ] T10. Rutas de Admin y "Ver en el sitio" en pestaña nueva. (R5.1, R5.2)
- [ ] T11. `vercel.json` con rewrite SPA (coordinar con F09). (R1.2)
- [ ] T12. Verificación manual: recarga en cada ruta, Atrás/Adelante, link directo en incógnito, 404. (todos)

## Fuera de alcance

- SSR/prerender (se resuelve la parte de SEO/previews en F03 con funciones puntuales).
- URLs en inglés o multi-idioma.

## Preguntas abiertas

- ¿Slugs con o sin barrio (`casa-en-nordelta` vs `casa-4-dormitorios-nordelta`)? Propuesta: el admin lo decide editando el slug.

## Definición de terminado

Todos los criterios R* verificados en `pnpm build && pnpm preview` y en el preview de Vercel; `pnpm typecheck` limpio; ToDo S4 "Agregar rutas reales" marcado.
