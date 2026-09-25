# F06 — Contenido real, imágenes y limpieza de Storage

**Prioridad:** P0 · **Esfuerzo:** M (mayormente contenido, poco código) · **Depende de:** —

## Contexto

El catálogo usa datos demo: 16 imágenes de Unsplash en `seed.sql` y más en `Home.tsx`. El seed tiene "Casa en Jardines del Jockey" duplicada. El editor de imágenes borra el archivo de Storage al eliminar una imagen, pero pueden quedar huérfanos (subidas canceladas, publicaciones eliminadas: el `on delete cascade` borra las filas de `listing_images` pero **no** los archivos del bucket).

## Requisitos

**Historia 1 — Como negocio quiero salir con contenido real.**

- R1.1 En producción NO DEBE haber imágenes de Unsplash ni publicaciones demo visibles.
- R1.2 Las imágenes del Home (hero, secciones) DEBEN ser propias y servirse desde el proyecto o desde Storage.
- R1.3 Las publicaciones demo DEBEN quedar solo en el seed de desarrollo, no en la base de producción.

**Historia 2 — Storage sin basura.**

- R2.1 CUANDO se elimina una publicación, EL SISTEMA DEBE eliminar sus archivos del bucket `listing-images`.
- R2.2 DEBE existir un procedimiento (script o función) que liste y borre archivos del bucket sin fila en `listing_images`, con modo "solo listar" (dry run).

**Historia 3 — Calidad de las imágenes subidas.**

- R3.1 CUANDO el admin sube una imagen de más de 2560 px de lado, EL SISTEMA DEBERÍA redimensionarla en el navegador antes de subirla (y convertirla a WebP), manteniendo el límite de 10 MB.

## Diseño

- Separar `supabase/seed.sql` (dev) de la carga de producción; producción arranca vacía y el negocio carga desde Admin.
- R2.1: en `adminListingsApi.remove()`, antes de borrar la fila, listar `listing_images` de la publicación y borrar sus paths del bucket (reutilizar la lógica de path de `listingImagesApi.ts`). Alternativa: organizar el bucket por carpeta `listing_id/` y borrar el prefijo completo.
- R2.2: script `scripts/cleanup-orphans.ts` que se corre local con la service role key (nunca en el cliente), `--dry-run` por defecto.
- R3.1: `canvas.toBlob('image/webp', 0.85)` en `ListingImagesEditor.tsx`.

## Tareas

- [ ] T1. Decidir qué hacer con el duplicado del seed y limpiarlo. (R1.3)
- [ ] T2. Reemplazar imágenes de `Home.tsx` por assets propios. (R1.2)
- [ ] T3. Borrar archivos de Storage al eliminar publicación. (R2.1)
- [ ] T4. Script de huérfanos con dry run. (R2.2)
- [ ] T5. Redimensionar/convertir a WebP al subir. (R3.1)
- [ ] T6. Carga de contenido real por el negocio (checklist: fotos, textos, precios, coordenadas). (R1.1)
- [ ] T7. Auditoría final: `grep -rn unsplash src supabase` solo en el seed de dev. (R1.1)

## Fuera de alcance

- CDN de imágenes externo (Cloudinary/Imgix); ver F07.

## Preguntas abiertas

- ¿Quién provee fotos y textos reales y para cuándo?
- ¿Producción usa un proyecto de Supabase distinto al de desarrollo? (recomendado: sí)

## Definición de terminado

Sitio de producción sin contenido demo; eliminar una publicación deja el bucket limpio; ToDo S5 "Reemplazar imágenes Unsplash" y "Limpiar archivos huérfanos" marcados.
