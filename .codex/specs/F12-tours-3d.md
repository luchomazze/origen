# F12 — Tours 3D / 360 (spike de investigación)

**Prioridad:** P2 · **Esfuerzo:** spike de 1–2 días, luego feature S–M según resultado · **Depende de:** —

## Contexto

ToDo S8: "cargar planos 3D navegables". Antes de implementar hay que decidir **qué contenido real va a tener el negocio**, porque la librería depende del formato de origen: no es lo mismo un tour de Matterport que una foto 360 de celular o un modelo 3D de un render de emprendimiento.

## Comparación de opciones

| Opción | Contenido de origen | Costo | Integración | Ideal para |
|---|---|---|---|---|
| **Matterport** (embed) | Escaneo con cámara Matterport o iPhone LiDAR | Suscripción Matterport | iframe (muy simple) | Propiedades terminadas, estándar del mercado |
| **Kuula / CloudPano** (embed) | Fotos 360 (cámara Insta360/Ricoh) | Free / bajo | iframe | Recorridos 360 baratos |
| **Pannellum** (open source) | Fotos 360 equirectangulares | $0 | Librería JS, archivos en Storage | Control total sin suscripción |
| **`<model-viewer>`** (Google) | Modelo `.glb` (exportado de SketchUp/Blender/renders) | $0 | Web component liviano, AR en mobile | Emprendimientos en pozo |
| **react-three-fiber** | `.glb` + desarrollo a medida | $0 + mucho tiempo | Alto | Experiencias a medida (sobreingeniería para el MVP) |

**Hipótesis inicial:** embed genérico por URL (Matterport/Kuula) para propiedades + `<model-viewer>` para emprendimientos. react-three-fiber descartado por costo/beneficio.

## Preguntas que el spike debe responder

1. ¿Qué material existe o puede producir el negocio (escaneos, fotos 360, renders 3D)?
2. Peso típico de un `.glb` de emprendimiento y tiempo de carga en 4G.
3. ¿Alcanza con permitir una URL de embed de proveedores confiables (lista blanca de dominios)?
4. Impacto en el bundle (debe cargarse con lazy, solo si la publicación tiene tour).

## Requisitos preliminares (a confirmar tras el spike)

- R1 Admin DEBE permitir asociar un tour (URL de proveedor permitido) o un modelo `.glb` a una publicación.
- R2 La ficha DEBE mostrar el tour en una sección propia, cargado solo al hacer clic en "Ver recorrido 3D".
- R3 Solo DEBEN aceptarse URLs de dominios en lista blanca (seguridad del iframe).

## Tareas del spike

- [ ] S1. Relevar con el negocio el material disponible.
- [ ] S2. Prototipo descartable: embed Matterport/Kuula + `<model-viewer>` con un `.glb` de ejemplo.
- [ ] S3. Medir peso y Lighthouse.
- [ ] S4. Escribir la decisión en esta spec y convertirla en feature con requisitos definitivos.

## Definición de terminado (spike)

Decisión documentada con datos; requisitos definitivos escritos; ToDo S8 "Investigar y elegir librería…" marcado.
