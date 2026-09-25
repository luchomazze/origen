# ORIGEN — Análisis del ToDo y specs de features

Fecha del análisis: 2026-09-25. Fuente: `.codex/ToDo` contrastado contra el código real (no solo lo que dice el ToDo).

## 1. Cómo usar estas specs

Cada feature tiene su archivo `FNN-nombre.md` con el mismo formato (spec-driven):

1. **Contexto** — por qué existe y qué hay hoy en el código.
2. **Requisitos** — historias de usuario + criterios de aceptación en formato EARS (`CUANDO … EL SISTEMA DEBE …`). Cada criterio tiene id (`R1.2`) para trazarlo.
3. **Diseño** — decisiones técnicas, archivos afectados, datos.
4. **Tareas** — checklist ordenado; cada tarea referencia los requisitos que cubre.
5. **Fuera de alcance / Preguntas abiertas / Definición de terminado.**

Flujo: resolver *Preguntas abiertas* → aprobar la spec → ejecutar tareas en orden → validar cada criterio → marcar en el ToDo.

## 2. Estado real vs ToDo (discrepancias encontradas)

| Ítem del ToDo | Dice | Realidad en el código | Acción |
|---|---|---|---|
| Unificar `Detail.tsx` y `ProjectDetail.tsx` (S4) | Pendiente | `ProjectDetail.tsx` ya está eliminado; `Detail.tsx` cubre los 3 tipos | Marcar hecho |
| Completar estados vacío y no encontrado (S4) | Pendiente | Listados tienen "Sin resultados"; `Detail.tsx` tiene estado "no disponible". Falta 404 de ruta desconocida y vacío en Home | Mover a F01 |
| Guardar borrador, preview y publicar (S6) | Pendiente | Ya existen estados borrador/publicado/pausado, botones Publicar/Pausar y preview real | Marcar hecho (salvo confirmación antes de publicar, opcional) |
| Eliminar fallbacks y agregar logout (S6) | Pendiente | Logout existe. Quedan **15** usos de `wa.me/5493515000000` (número placeholder) + Unsplash | Logout hecho; fallbacks → F02 |
| Normalizar UTF-8 (S7) | Pendiente | No se encontró mojibake en `.ts/.tsx` | Solo verificación visual → F08 |
| SEO, sitemap y metadata (S7) | En curso | Metadata base en `index.html` lista (T1); falta metadata por página, `og:image`, OG por publicación y sitemap | F03 |
| Optimizar imágenes (S7) | Pendiente | Hallazgo nuevo: el `Logo` importa `logo-origen.png` de **320 KB** en cada página | F07 |
| Bundle (S7) | Pendiente | Build actual: 1 JS de **538 KB** (admin incluido en el bundle público) | F07 |
| Rutas reales con slug (S4) | Pendiente | **En curso**: router propio en `utils/routing.ts` con `pushState`. Falta 404, `<a href>`, query params, slug persistido y rewrite de Vercel | F01 |
| Botón compartir (S8) | Pendiente | Depende de F01; con el router nuevo las URLs ya existen en local | F04 depende de F01 |
| Deploy Vercel | Decidido | No hay `vercel.json`, ni `public/`, ni `.github/` | F09 |
| Definir "slug único" (S2) | Hecho | **No existe columna `slug`** en `listings`; el slug se deriva en el cliente como `slugify(title)-<uuid>` | F01 |
| Seed duplicado "Casa en Jardines del Jockey" x2 | Pendiente de decidir | Sigue x2 en `seed.sql` | F06 |

## 3. Mapa de features

| Spec | Feature | Prioridad | Esfuerzo | Depende de |
|---|---|---|---|---|
| [F01](F01-rutas-reales.md) | Rutas reales, deep links y 404 | **P0** | M | — |
| [F02](F02-configuracion-sitio.md) | Configuración del sitio en Supabase + eliminar placeholders | **P0** | S | — |
| [F03](F03-seo-link-previews.md) | SEO, metadata y vistas previas de links (Open Graph) | **P0** | M | F01, F09 |
| [F04](F04-compartir-publicacion.md) | Compartir publicación | P1 | S | F01 (F03 para preview linda) |
| [F05](F05-recuperar-contrasena.md) | Recuperación de contraseña e invitación admin | P1 | S | F09 (URL de redirect) |
| [F06](F06-contenido-real-imagenes.md) | Contenido real, imágenes y limpieza de Storage | **P0** | M | — |
| [F07](F07-performance.md) | Performance: bundle, logo, imágenes, fetch puntual | P1 | M | F01 (fetch por slug) |
| [F08](F08-calidad-ci.md) | Tests, lint y CI | P1 | M | — |
| [F09](F09-deploy-operacion.md) | Deploy en Vercel y operación | **P0** | S | — |
| [F10](F10-video-youtube.md) | Video de YouTube en la ficha | P2 | S | — |
| [F11](F11-mapas.md) | Mapa premium en la ficha | P2 | S | — |
| [F12](F12-tours-3d.md) | Tours 3D / 360 (spike de investigación) | P2 | M (spike) | — |

**P0** = bloquea salir a producción. **P1** = primeras semanas tras lanzar. **P2** = diferencial comercial.

## 4. Comparación y orden recomendado

**Impacto vs esfuerzo:**

```
Impacto alto │ F02  F09        │ F01  F03  F06
             │ F04  F05        │ F07  F08
─────────────┼─────────────────┼──────────────
Impacto medio│ F10  F11        │ F12
             │   esfuerzo bajo │ esfuerzo medio/alto
```

**Razonamiento:**

- **F02 y F09 primero**: son baratos y lo que hoy saldría mal en producción es grave: el botón de WhatsApp lleva a un número placeholder y la config vive en `localStorage` del navegador del admin (los visitantes nunca la ven).
- **F01 es la pieza estructural**: habilita compartir (F04), SEO real (F03), fetch puntual (F07), links desde el admin y el botón "Atrás" del navegador. Todo lo que se construya antes sobre `navigate(page, slug)` hay que migrarlo después.
- **F06 es de contenido, no de código**: puede avanzar en paralelo (lo hace el negocio cargando publicaciones reales).
- **F03 después de F01+F09**: las previews de WhatsApp necesitan URL por publicación y una función en el servidor de Vercel.
- **F04 es chico una vez que F01 existe** (~medio día).
- **F10/F11/F12 son diferenciales**; F12 arranca como spike de investigación, no como feature.

**Secuencia propuesta:**

1. Sprint A (pre-lanzamiento): F09 → F02 → F01 → F06 (en paralelo, contenido).
2. Sprint B (lanzamiento): F03 → F04 → F05.
3. Sprint C (post-lanzamiento): F07 → F08.
4. Backlog: F10, F11, F12.

## 5. Decisiones transversales pendientes

- **Formato de slug** (F01): hoy se calcula en el cliente como `slugify(title)-<uuid completo>` (`listingsApi.ts:114`), sin columna en la base. Recomiendo una columna `slug text unique` persistida (`casa-en-nordelta`, con sufijo `-2` solo si choca) para que las URLs sean limpias y **estables aunque cambie el título**, con redirect desde el formato viejo.
- **Router** (F01): ya se implementó un router propio (`utils/routing.ts`) el 2026-09-25. Recomiendo completarlo en vez de migrar a `react-router`; ver F01.
- **Dominio definitivo** (F03, F05, F09): las URLs absolutas de OG y los redirects de auth lo necesitan.
