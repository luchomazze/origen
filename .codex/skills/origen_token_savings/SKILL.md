# Codex — ORIGEN Token Saving

## Objetivo

Reducir aproximadamente **90% el consumo innecesario de tokens** durante tareas de desarrollo, manteniendo la corrección del código.

## Regla principal

**Investigar menos, modificar menos, explicar menos.**

---

## 1. Antes de modificar

* Leer solamente los archivos relevantes.
* No recorrer todo el proyecto si no es necesario.
* Buscar primero por nombre de componente, función, endpoint, tabla o variable mencionada.
* No leer archivos completos cuando `search/find` permita localizar la sección necesaria.
* No inspeccionar dependencias o configuraciones irrelevantes.

## 2. Cambios

* Modificar únicamente lo necesario para cumplir el pedido.
* No refactorizar código no relacionado.
* No cambiar nombres, estructura o estilos existentes sin necesidad.
* No agregar abstracciones prematuras.
* No crear archivos nuevos si puede resolverse correctamente modificando uno existente.
* No instalar dependencias salvo que sean realmente necesarias.

## 3. Mantener el proyecto

Preservar siempre:

* arquitectura existente;
* convenciones de nombres;
* estilos;
* componentes reutilizables;
* comportamiento existente;
* configuración;
* integraciones.

**No "mejorar" código fuera del alcance solicitado.**

## 4. Cuando falte información

Antes de preguntar:

1. Buscar en el repositorio.
2. Revisar imports y referencias.
3. Revisar tipos/interfaces.
4. Revisar configuración relacionada.

Preguntar solamente si la información faltante cambia materialmente la implementación.

## 5. Supabase

Antes de crear/modificar tablas:

* buscar primero si ya existe la estructura;
* reutilizar tablas existentes;
* evitar tablas duplicadas;
* evitar campos redundantes.

Para ORIGEN:

* priorizar `listings` como entidad principal;
* agregar una tabla relacionada solamente cuando exista una relación 1:N real que lo justifique.

## 6. Frontend

Antes de crear un componente:

* buscar si ya existe uno reutilizable.

Antes de agregar estado:

* comprobar si el dato ya puede derivarse del estado existente.

Antes de agregar una librería:

* comprobar si React/TypeScript o dependencias existentes ya resuelven el problema.

## 7. Backend/API

* Reutilizar endpoints existentes cuando sea posible.
* No crear endpoints separados para operaciones que pueden resolverse coherentemente mediante uno existente.
* Validar únicamente lo necesario.
* Mantener respuestas simples y consistentes.

## 8. UI existente → código

Al trabajar sobre la UI ya diseñada:

* No rehacer la UI.
* No reemplazar componentes visuales innecesariamente.
* Mantener el diseño generado.
* Concentrarse en conectar la lógica real.
* Separar claramente UI, datos y acceso a Supabase cuando sea necesario.

## 9. Errores

Cuando aparezca un error:

1. Identificar el error exacto.
2. Buscar su origen.
3. Aplicar el cambio mínimo.
4. Verificar.
5. No modificar otras partes del sistema.

No hacer múltiples cambios especulativos.

## 10. Respuesta final

Después de realizar cambios, responder solamente:

**Hecho.**

* `archivo`: cambio realizado.
* `archivo`: cambio realizado.

**Verificación:** resultado.

Si existe algo que el usuario deba hacer manualmente, indicarlo en una línea.

No explicar código salvo que el usuario lo solicite.

## 11. Código en la respuesta

No pegar archivos completos.

Mostrar código únicamente cuando:

* el usuario lo solicite;
* sea necesario para explicar un cambio;
* haya que copiar/pegar una configuración concreta.

## 12. Regla anti-sobreingeniería

Ante varias soluciones válidas:

**elegir la más simple que funcione con la arquitectura actual.**

No diseñar para una escala hipotética.

## 13. Regla de contexto

El contexto del proyecto ya conocido es válido.

No volver a preguntar ni repetir:

* stack;
* arquitectura;
* decisiones ya tomadas;
* requisitos ya establecidos.

## 14. Objetivo de tokens

Optimizar cada tarea para:

**~90% menos tokens innecesarios**

sin sacrificar:

* precisión;
* seguridad;
* integridad del código;
* verificación del cambio.

### Principio final

> **Search → Read minimum → Change minimum → Verify → Report minimum.**

---

## 15. Contexto acumulado del proyecto (evita re-descubrir esto)

Actualizar esta sección cada vez que se resuelva algo que valga la pena recordar, en vez de volver a investigar desde cero en la próxima sesión.

### Estado de Supabase (2026-09-23)

* La base remota **diverge del repo**. `supabase/migrations/20260921001000_rls_policies.sql` todavía define una sola policy `for all` por tabla, pero la base real tiene policies separadas por comando (`insert`/`update`/`delete`, y ahora también `select` para admin). **No asumir que las migraciones locales reflejan el estado real** — ante dudas de RLS, pedir `select policyname, cmd, roles, qual, with_check from pg_policies where tablename = '<tabla>';` antes de teorizar.
* `listings` tiene hoy: SELECT pública (`publication_status='publicado' and commercial_status<>'vendido'`), **SELECT admin** (`is_admin()`, agregada a mano), INSERT admin (`with_check is_admin()`), UPDATE admin (`qual` y `with_check is_admin()`), DELETE admin (`qual is_admin()`).
* `listing_images` tiene el mismo patrón: se le agregó **SELECT admin** (`is_admin()`) a mano.
* `listing_typologies` ya tiene sus 4 policies de admin (select/insert/update/delete, `is_admin()`) más la pública `"Public can read typologies for visible listings"`.
* `profiles` ya tiene sus 2 policies (`"Admins can read profiles"`, `"Admins can manage profiles"`), agregadas a mano — antes no tenía ninguna y funcionaba igual porque `is_admin()` es `security definer` y bypassea RLS.
* `storage.objects` **sigue sin policy pública de SELECT** (no hace falta: el bucket `listing-images` es público y las URLs públicas bypassean RLS).
* `site_settings` (2026-09-25): la config de WhatsApp ya no vive en `localStorage`, se lee y escribe en `site_settings` mediante `src/data/siteSettingsApi.ts`. **En producción `site_settings.id` es `uuid`, no `text` con valor `'global'`** como dice `initial_schema.sql`, así que `using (id = 'global')` falla con `22P02 invalid input syntax for type uuid`. Por eso el código trata la tabla como fila única: lee la primera por `created_at`, y al guardar hace `update` por su `id` o `insert` si no existe, sin upsert por `'global'`. La policy pública de SELECT (`using (true)`) está en `20260925000000_site_settings_public_read.sql`. Si no hay fila, `getWAConfig` devuelve `DEFAULT_CONFIG` con número vacío.
* `supabase/migrations/20260921001000_rls_policies.sql` ya fue reescrito (2026-09-23) para reflejar exactamente el estado real de `pg_policies` en producción — es la fuente de verdad actualizada, no hace falta re-auditar todo desde cero, solo lo que cambie de acá en adelante.
* Admins actuales (`profiles.role='admin'`): Luciano (`57d3cadc-efea-422a-98b0-8d97f7b151f0`) y Verónica (`578e0cd8-57fb-47cd-b966-3560a075e472`).
* `price_from` (boolean, default false) ya está en producción y funcionando end to end (form admin, preview, front público).
* CRUD completo de `listings` (crear/editar/eliminar) y carga de imágenes a `listing-images` ya probados y funcionando en navegador con sesión admin real.

### Gotcha de RLS: INSERT ok mientras `.select().single()` falla

Si un `insert(...).select().single()` (o `update` similar) tira `new row violates row-level security policy for table X`, **no asumir que el INSERT/UPDATE está mal**. Postgres aplica la policy de SELECT también al `RETURNING`. Si la única policy de SELECT es la pública (ej. requiere `publication_status='publicado'`) y la fila recién creada nace en `borrador`, el INSERT pasa pero el RETURNING no encuentra policy que lo cubra y el error sale como si fuera el INSERT. Diagnóstico rápido: pedir el resultado de `pg_policies` para esa tabla y ver si existe una policy SELECT que cubra al admin (`using (is_admin())`), no solo la pública.

### Gotcha de React: `<form>` anidado dentro de otro `<form>`

En `AdminPublications.tsx` los sub-editores (`ListingTypologiesEditor`, `ListingImagesEditor`) se renderizan **dentro** del `<form onSubmit={save}>` principal de la publicación. Si un sub-editor usa su propio `<form>`, el HTML resultante queda con formularios anidados (inválido); el navegador descarta el `<form>` interno y el botón submit termina disparando un submit nativo no interceptado por React → recarga completa de página / navegación a home, sin error visible y sin ningún request a Supabase (parecía un bug de RLS pero era esto). Los sub-editores que van dentro de ese formulario deben usar `<div>` + botones `type="button"` con `onClick`, nunca su propio `<form>`.

### Diagnóstico de "auth.uid() es NULL" en SQL Editor

Es esperado: el SQL Editor de Supabase corre sin contexto de sesión de usuario, así que `auth.uid()` da `NULL` y `is_admin()` da `false` ahí aunque el usuario sea admin real. No es un bug — para probar el rol hay que consultar `profiles` directamente por UUID, o probar desde el navegador con sesión real.

### Formulario de Admin: estado a fecha 2026-09-23

* `AdminPublications.tsx` tiene 2 botones de submit que hacen exactamente lo mismo por ahora (guardan solo la fila de `listings`): **"Aplicar cambios"** (arriba, junto a los campos de texto) y **"Guardar cambios"** (abajo de todo, después de unidades e imágenes). Es intencional — el usuario pidió mover el guardado al final del formulario y dejar uno rápido arriba, con la idea de que a futuro "Guardar cambios" evolucione a un guardado global (listing + tipologías + imágenes en un solo click). Hoy tipologías e imágenes ya se guardan al instante con sus propios botones dentro de `ListingTypologiesEditor`/`ListingImagesEditor`, no dependen de ningún submit del formulario padre.
* El editor de tipologías se muestra solo si se tilda el checkbox "Esta publicación tiene unidades / tipologías" (`hasTypologies` en `AdminPublications.tsx`). Es un toggle **solo de UI, no persistido** — arranca destildado en cada alta/edición aunque la publicación ya tenga tipologías guardadas (hay que volver a tildarlo para verlas/editarlas). No se pierden datos al destildarlo, solo se oculta el formulario.
* Los `<select>` del form (tipo, operación, estado de publicación, estado comercial) tienen un `OPTION_STYLE` (texto claro sobre fondo `#0D1B2A`) aplicado a cada `<option>` para que el desplegable no se vea invisible sobre fondo blanco. Aun así el contenedor del popup (fondo blanco redondeado, resaltado de la opción seleccionada) es "chrome" nativo del navegador y no se puede restylear del todo — reemplazarlo por un dropdown propio ya está anotado en el ToDo, sección "Fuera del MVP".
* El formulario ya tiene campos de Latitud/Longitud (agregados 2026-09-24, junto a Dirección) y una función `validate()` que chequea título, slug no vacío, ciudad, precio, moneda, `price_from` y rango/consistencia de coordenadas antes de guardar — devuelve el primer mensaje de error en vez de dejar que Supabase rechace por constraint.

### Cache en memoria de `getPublicListings` (2026-09-24)

`listingsApi.ts` cachea el resultado de `getPublicListings(tipo)` en un `Map` a nivel de módulo (`resolvedCache`/`inFlightCache`), clave por tipo (`'PROPIEDAD' | 'TERRENO' | 'EMPRENDIMIENTO' | 'ALL'`). `App.tsx` dispara un prefetch de los 3 tipos en un `useEffect` al montar, así que para cuando el usuario navega a cualquier listado o detalle, los datos ya están en memoria — sin esto, cada navegación entre Home/Properties/Lands/Projects/Detail volvía a pedir todo a Supabase porque `App.tsx` desmonta/remonta esas páginas por routing con estado (no hay router real). `usePublicListings` lee el cache de forma síncrona al inicializar el estado para no mostrar el loader si ya está disponible.

**Trade-off importante:** el cache es de sesión de pestaña, sin invalidación. Si el admin publica/edita/pausa algo, una pestaña pública ya abierta con esos datos en cache **no lo va a reflejar hasta que se recargue la página**. No afecta al panel de Admin (usa `adminListingsApi.ts`, sin cache), pero si alguna vez hay que ver cambios en vivo sin recargar (ej. probar publicaciones desde la misma sesión del navegador), hay que agregar invalidación (`resolvedCache.clear()` o similar) — no implementado todavía, no estaba en el alcance pedido.

### Gotcha: colisión de slugs con títulos duplicados (2026-09-25)

`slug` se generaba como `slugify(titulo) + '-' + id.slice(0,8)`. Los ids del seed usan el patrón `00000000-0000-4000-8000-00000000000X` — los primeros 8 caracteres son literalmente "00000000" en TODOS los registros del seed, así que dos publicaciones con el mismo título (ej. dos "Casa en Jardines del Jockey") terminaban con el slug idéntico. `Detail.tsx` resuelve por `.find(l => l.slug === slug)`, que devuelve la primera coincidencia del array — así que al entrar a una de las dos, a veces se mostraba la OTRA (sin avisar, sin error). Esto se manifestó como "la tipología no se muestra" cuando en realidad era la publicación equivocada.

**Cómo se diagnosticó:** en vez de asumir que era RLS, se replicó la query pública real con `curl` usando la `anon key` de `.env` (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`) para ver exactamente qué le llega al navegador sin sesión de admin — confirmó que los datos y permisos estaban perfectos, aislando el problema a la resolución de slug del lado del cliente. Útil para la próxima vez que "el público no ve algo que el admin sí": probar primero con `curl` + anon key antes de sospechar de RLS, es más rápido que ir policy por policy.

**Fix:** `slug` ahora usa el `id` completo (`listingsApi.ts`, `mapListing`), garantiza unicidad siempre. Seguro de cambiar porque todavía no hay rutas reales en la URL del navegador (el ToDo "Agregar rutas reales con slug y deep links" sigue pendiente) — `slug` es solo estado interno de React, no aparece en la barra de direcciones.

**Sigue habiendo contenido duplicado real en el seed** (dos "Casa en Jardines del Jockey", una con tipologías cargadas y otra sin) — no se tocó, es una decisión de datos que le corresponde al usuario.

### Columnas de "características" agregadas a `listings` (2026-09-24)

`listings` no tenía columnas para dormitorios/baños/cocheras/ambientes/superficie/tipo de propiedad, aunque el tipo público `Listing` y `Detail.tsx` (sección "Características", función `getChars`) ya los esperaban — nunca se mostraban con datos reales. Se agregaron y **ya están corridas en Supabase**: `surface_m2 numeric`, `bedrooms int`, `bathrooms int`, `garages int`, `rooms int`, `property_type text` (valores en minúscula sin tilde: `casa/departamento/ph/local/oficina/campo/cabana/otro`, mapeados a los enums `TipoPropiedad` en mayúscula con tilde vía `PROPERTY_TYPES`/`mapTipoPropiedad` en `listingsApi.ts`), `financing_details text`.

**`financing_details` y `mortgage_eligible` son columnas separadas, no alternativas:** primero el usuario corrió una versión de la migración con `financing_details text` (detalle libre) en vez de `mortgage_eligible boolean` ("apto crédito"); después pidió agregar `mortgage_eligible` también, como columna adicional. Terminaron conviviendo las dos. Si en el futuro una migración local no coincide con lo que hay en Supabase, no asumir que el archivo del repo es la verdad — pedir `information_schema.columns` como se hizo acá.

**`mortgage_eligible`** (migración `20260924001000_add_mortgage_eligible.sql`) ya está corrida en Supabase y confirmada por `information_schema` — código y base alineados (formulario "Apto crédito" solo para `type === 'propiedad'`, `AdminListingInput`, `mapListing` → `apto_credito`).

El formulario de Admin tiene los inputs: "Superficie m²" y "Detalle de financiación" siempre visibles; dormitorios/baños/cocheras/ambientes/tipo de propiedad/apto crédito solo cuando `type === 'propiedad'`.

### Filtros de Admin + Dashboard clickeable + sidebar colapsable (2026-09-24)

`AdminPublications.tsx` exporta `AdminListingFilters` (tipo), `EMPTY_FILTERS` y `PROPERTY_TYPE_LABELS`, y acepta una prop opcional `initialFilters?: Partial<AdminListingFilters>` que se usa como estado inicial (`useState(() => ({...EMPTY_FILTERS, ...initialFilters}))`-style, vía inicializador directo). El filtrado es 100% client-side sobre los `listings` ya cargados por `getAdminListings()` — no hay refetch a Supabase por filtro. Las opciones de ciudad/barrio/tipo de propiedad/servicio se calculan dinámicamente desde los datos reales (mismo patrón que ya se usaba en el sitio público para "Ubicación").

`AdminDashboard.tsx` ahora recibe `onSelectFilter: (filters: Partial<AdminListingFilters>) => void` y cada métrica es un `<button>` que llama a esa función con el filtro correspondiente (ej. "Borradores" → `{ publication_status: 'borrador' }`).

`Admin.tsx` orquesta todo: guarda `publicationsFilter` en estado, y tiene dos caminos distintos a propósito — `goToSection('publicaciones')` (click directo en el nav del sidebar) **resetea** el filtro a `EMPTY_FILTERS`, mientras que `goToPublicationsFiltered(filters)` (click en una métrica del Dashboard) aplica ese filtro puntual. Esto evita que un filtro viejo de una métrica quede "pegado" si el usuario después entra a Publicaciones por el menú normal. Funciona porque `AdminPublications` se desmonta/remonta cada vez que `section` cambia (render condicional en `Admin.tsx`), así que la prop `initialFilters` solo se lee una vez al montar — no hace falta ningún `useEffect` de sincronización.

Sidebar colapsable: `sidebarCollapsed` en `Admin.tsx`, ancho `220px`/`60px`. Colapsado: se oculta el `Logo` (es una imagen wordmark horizontal, no un ícono, así que no cabe en 60px) y los textos de nav/labels de sección, dejando solo la primera letra de cada botón (con `title` para accesibilidad) y glyphs unicode para logout (`⏻`)/volver al sitio (`←`).

`AdminPublications.tsx` ya no tiene un modal de preview con markup propio/duplicado. `Detail.tsx` ahora acepta una prop opcional `previewListing?: Listing`: cuando está presente, salta el fetch a Supabase y el gate de `isPubliclyVisible` (para poder previsualizar borradores), y usa ese listing directamente. `toPreviewListing()` en `adminListingsApi.ts` arma el objeto `Listing` a partir de un `AdminListing` + sus tipologías (`AdminTypology[]`) + imágenes (`ListingImage[]`) reutilizando `mapListing` (exportado de `listingsApi.ts`) — funciona porque `AdminListing`/`AdminTypology`/`ListingImage` son estructuralmente compatibles con los tipos privados `ListingRow`/`TypologyRow`/`ImageRow` que ya usaba `mapListing`. Al abrir "Previsualizar" se hace un fetch puntual de tipologías e imágenes de esa publicación (`getAdminListingTypologies` + `getListingImages`) antes de mostrar el modal. `AdminPublications` ahora recibe `waConfig` como prop (antes no lo necesitaba) porque `Detail` lo requiere para el botón de WhatsApp — hilado desde `Admin.tsx`.

### Perf: `Detail.tsx` hacía 2 fetches idénticos

`getPublicListingBySlug(slug, tipo)` llamaba internamente a `getPublicListings(tipo)` (trae TODAS las publicaciones del tipo con sus joins de `listing_typologies` y `listing_images`) y filtraba por slug en el cliente; `Detail.tsx` además volvía a llamar `getPublicListings(tipo)` aparte para las relacionadas — dos fetches completos e idénticos en paralelo. Se sacó `getPublicListingBySlug` (no queda ningún otro uso) y ahora `Detail.tsx` hace un solo `getPublicListings(tipo)` y deriva tanto la publicación actual como las relacionadas de ese mismo resultado. Sigue trayendo de más (todo el tipo, no solo 1 + relacionadas limitadas) — eso queda pendiente para cuando se implementen rutas reales con slug/id (ToDo Sprint 4).

### Specs de features y hallazgos del análisis del ToDo (2026-09-25)

Las features pendientes tienen spec en `.codex/specs/` (índice y comparación de prioridades en `README.md`, una spec `FNN-*.md` por feature con requisitos EARS, diseño y tareas). El ToDo referencia cada ítem pendiente con `[FNN]`. Antes de implementar algo del ToDo, leer su spec.

Hallazgos verificados contra el código (no re-descubrir):

* `listings` **no tiene columna `slug`**; el slug se deriva en el cliente como `slugify(title)-<uuid>` (`listingsApi.ts`). Persistirlo es parte de F01.
* `index.html` ya tiene título, description, `theme-color`, favicon (`public/favicon.svg`) y OG genérico sin imagen (F03 T1, 2026-09-25). Falta metadata por página, `og:image` (necesita el dominio definitivo para armar una URL absoluta), previews por publicación y sitemap.
* Sin rastros de Figma Make (2026-09-25): `vite.config.ts` solo tiene los plugins de React y Tailwind. Las capturas y briefs originales están en `.codex/referencias/`, fuera del build.
* `Logo.tsx` importa `src/assets/logo-origen.png` (320 KB) en todas las páginas; el build es un solo JS de 538 KB que incluye el Admin (F07).
* Hay 15 URLs `wa.me/5493515000000` (número placeholder) hardcodeadas en `src/`; la config de WhatsApp vive en `localStorage`, así que los visitantes nunca ven lo que edita el admin (F02).
* No existen `vercel.json`, `public/` ni `.github/`. Sin rewrite SPA, recargar una ruta profunda en Vercel da 404 (F09).
* En este equipo no hay Python; para scripts de edición usar Node.

### Textos de la UI centralizados en `src/content/texts.ts` (2026-09-25)

Todo texto visible (sitio público y Admin: títulos, botones, labels, hints, placeholders, `alt`/`title`/`aria-label`, mensajes de validación y de error) vive en `TEXTS`, agrupado por pantalla (`TEXTS.home`, `TEXTS.detail`, `TEXTS.admin.publications.fields`, etc.). Claves en inglés descriptivo, valores en español. Los textos con datos variables son funciones (`TEXTS.properties.resultsCount(n)`, `TEXTS.units.bathrooms(n)`), que ya resuelven singular/plural. **Al agregar UI nueva, sumar el texto a `TEXTS` en vez de escribirlo en el JSX.**

Quedan fuera a propósito: valores que se guardan en la base (`ALL_SERVICES`, estados, `city: 'Córdoba'` por defecto del formulario), las plantillas de WhatsApp por defecto de `utils/whatsapp.ts` (el admin las edita desde el panel) y los mensajes técnicos de consola / `throw` para desarrolladores.

Gotcha: en los catálogos, `TEXTS.common.allFeminine` ("Todas") es a la vez el texto del botón y el valor centinela del filtro de ubicación (`ubicacion !== TEXTS.common.allFeminine`); si se cambia el texto, el filtro sigue funcionando porque ambos lados usan la misma clave.
