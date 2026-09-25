# F11 — Mapa premium en la ficha

**Prioridad:** P2 · **Esfuerzo:** S · **Depende de:** —

## Contexto

`Detail.tsx` usa un iframe de OpenStreetMap (`export/embed.html`) que se ve genérico y no respeta la paleta de la marca. El ToDo propone Google Maps por percepción premium, con API key y billing.

## Comparación de opciones

| Opción | Look premium | Costo | Esfuerzo | Notas |
|---|---|---|---|---|
| OSM iframe (actual) | Bajo | $0 | — | Sin estilo, sin control |
| **Google Maps Embed API** (iframe con key) | Alto (familiar) | $0 ilimitado para el modo `place`/`view` | Bajo | Requiere key restringida por dominio; estilo limitado |
| Google Maps JS API + Map ID con estilo | Muy alto (colores de marca) | Gratis hasta el cupo mensual, luego pago | Medio | Carga JS pesado; necesita billing activo |
| MapLibre + tiles estilizados (MapTiler/Stadia) | Muy alto (estilo total) | Free tier generoso | Medio | Sin lock-in de Google |
| Imagen estática (Static Maps) + link "Abrir en Google Maps" | Alto | Casi $0 | Bajo | Liviano; ideal para performance |

**Recomendación:** mapa **estático con estilo de marca** (Google Static Maps con Map ID, o MapTiler static) + botón "Cómo llegar" que abre Google Maps. Es lo más liviano (F07), se ve premium y cuesta casi nada. Si se quiere interacción, Google Maps Embed API como segundo paso.

## Requisitos

- R1 CUANDO la publicación tiene coordenadas, la ficha DEBE mostrar un mapa con la estética de la marca y un marcador.
- R2 La ficha DEBE ofrecer "Cómo llegar" que abre Google Maps en la ubicación.
- R3 La API key DEBE estar restringida por dominio (referrer) y por API; nunca una key sin restricciones.
- R4 CUANDO no hay coordenadas, la sección NO DEBE mostrarse (comportamiento actual).
- R5 El mapa NO DEBE cargar hasta estar cerca del viewport.

## Tareas

- [ ] T1. Decidir opción (ver tabla) y crear la key/cuenta. (R3)
- [ ] T2. `VITE_MAPS_API_KEY` en `.env.example` y Vercel. (R3)
- [ ] T3. Componente `ListingMap` reemplazando el iframe de `Detail.tsx`. (R1, R4, R5)
- [ ] T4. Botón "Cómo llegar". (R2)

## Preguntas abiertas

- ¿Mapa interactivo o estático alcanza?
- ¿Se muestra la ubicación exacta o aproximada (privacidad del propietario)? Muchas inmobiliarias muestran un radio en vez de la dirección exacta.

## Definición de terminado

Mapa nuevo en fichas con coordenadas; key restringida; ToDo S4 "Cambiar el mapa…" marcado.
