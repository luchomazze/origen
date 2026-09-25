# F07 — Performance: bundle, logo, imágenes y fetch puntual

**Prioridad:** P1 · **Esfuerzo:** M · **Depende de:** F01 (lazy routes y fetch por slug)

## Contexto (medido 2026-09-24, `dist/`)

- JS: **un solo archivo de 538 KB** (sin gzip); incluye todo el Admin, que el 99% de los visitantes nunca abre.
- `Logo.tsx` importa `src/assets/logo-origen.png`: **320 KB** de PNG para un wordmark que se ve en cada página.
- Imágenes de publicaciones: URLs completas, sin tamaños responsive; solo el iframe del mapa usa `loading="lazy"`.
- `Detail.tsx` trae todas las publicaciones del tipo (con tipologías e imágenes) para mostrar una + 3 relacionadas.

## Requisitos

- R1 El JS inicial de una página pública DEBE ser < 200 KB (sin gzip); el Admin DEBE cargarse en un chunk aparte solo al entrar a `/admin`.
- R2 El logo DEBE pesar < 20 KB (SVG preferido).
- R3 Las imágenes fuera del primer viewport DEBEN usar `loading="lazy"` y `decoding="async"`; la imagen principal de la ficha DEBE usar `fetchpriority="high"`.
- R4 Las cards y la galería DEBEN pedir imágenes del tamaño que se muestran (`srcset`/transformación).
- R5 CUANDO se abre una ficha, EL SISTEMA DEBE pedir solo esa publicación + como máximo 3 relacionadas.
- R6 Lighthouse mobile en Home y en una ficha: Performance ≥ 85, LCP < 2,5 s.

## Diseño

- `React.lazy` / `lazy` de react-router para `Admin`, `AdminLogin` y editores (`ListingImagesEditor`, `ListingTypologiesEditor`).
- Logo: exportar SVG desde la guía de identidad → `src/assets/logo.svg`.
- Imágenes: transformación de Supabase Storage (`?width=`; requiere Pro) o variantes generadas al subir (F06-R3.1: guardar `-800` y `-1600`).
- Fetch: `getPublicListingBySlug` + `getRelated(limit 3)` (compartido con F01-T3); conservar el cache en memoria existente.
- Medir con `vite build` + `rollup-plugin-visualizer` antes y después.

## Tareas

- [ ] T1. Logo a SVG. (R2)
- [ ] T2. Code splitting de Admin y editores. (R1)
- [ ] T3. Atributos de carga en imágenes. (R3)
- [ ] T4. Tamaños responsive de imágenes. (R4)
- [ ] T5. Fetch puntual en Detail (si no se hizo en F01). (R5)
- [ ] T6. Medir bundle y Lighthouse antes/después y registrar números en SKILL.md. (R1, R6)

## Fuera de alcance

- Paginación del catálogo (no hace falta con el volumen actual; reevaluar a partir de ~60 publicaciones por tipo).
- Service worker / PWA.

## Definición de terminado

Números antes/después registrados; R1–R6 cumplidos; ToDo S7 "Optimizar imágenes…" y "Dividir el bundle" marcados.
