# F10 — Video de YouTube en la ficha

**Prioridad:** P2 · **Esfuerzo:** S · **Depende de:** —

## Contexto

ToDo S8. Los recorridos en video aumentan el tiempo en la ficha y las consultas calificadas. Hoy la ficha solo tiene galería de fotos y mapa.

## Requisitos

- R1 Admin DEBE permitir cargar una URL de video por publicación (opcional).
- R2 El sistema DEBE aceptar formatos `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/` y rechazar otras URLs con un mensaje claro.
- R3 CUANDO la publicación tiene video, la ficha DEBE mostrar una sección "Video" con embed responsive 16:9 (9:16 si es Short).
- R4 El embed NO DEBE cargar el reproductor de YouTube hasta que el visitante haga clic (miniatura + botón play), para no penalizar performance.
- R5 El embed DEBE usar `youtube-nocookie.com`.

## Diseño

- Migración: `listings.video_url text` (nullable) + check simple de dominio.
- `utils/youtube.ts`: `parseYouTubeId(url) → { id, isShort } | null`.
- Componente `VideoEmbed` estilo "lite embed": miniatura `https://i.ytimg.com/vi/<id>/hqdefault.jpg` → iframe al clic.
- Agregar a `mapListing`, `AdminListingInput`, formulario y `toPreviewListing`.

## Tareas

- [ ] T1. Migración `video_url` y ejecutarla. (R1)
- [ ] T2. `parseYouTubeId` + tests (F08). (R2)
- [ ] T3. Campo en Admin con validación y hint. (R1, R2)
- [ ] T4. `VideoEmbed` lite en Detail. (R3, R4, R5)

## Fuera de alcance

- Varios videos por publicación; Vimeo; videos subidos a Storage.

## Definición de terminado

Video visible en ficha real y en el preview de Admin; ToDo S8 "Agregar sección para video" marcado.
