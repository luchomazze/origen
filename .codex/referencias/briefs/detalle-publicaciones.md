Quiero implementar y ajustar las páginas de DETALLE de las publicaciones de ORIGEN.

El objetivo es que al hacer click sobre una publicación desde:

/propiedades
/terrenos
/emprendimientos

el usuario acceda a una página de detalle completa de esa publicación.

IMPORTANTE:

- Mantener exactamente la identidad visual actual de ORIGEN.
- No rediseñar el sitio.
- No inventar campos ni información.
- La página debe utilizar exclusivamente datos disponibles en LISTINGS y, cuando corresponda, LISTING_UNIDADES.
- Mantener una experiencia premium, editorial, minimalista y cálida.
- La imagen y el contenido deben tener protagonismo.
- WhatsApp debe ser el CTA principal.
- No utilizar formularios de contacto.
- No agregar funcionalidades de portal inmobiliario que no estén definidas.

==================================================
1. RUTAS
==================================================

Crear páginas dinámicas utilizando el slug:

PROPIEDAD:

/propiedades/[slug]

TERRENO:

/terrenos/[slug]

EMPRENDIMIENTO:

/emprendimientos/[slug]

El slug proviene de:

listings.slug

==================================================
2. ESTRUCTURA GENERAL
==================================================

Las tres páginas deben compartir la misma estructura visual:

HEADER

Breadcrumb / navegación

GALERÍA PRINCIPAL

INFORMACIÓN PRINCIPAL

DESCRIPCIÓN

CARACTERÍSTICAS

UBICACIÓN

INFORMACIÓN ADICIONAL cuando corresponda

UNIDADES / TIPOLOGÍAS cuando corresponda

CTA WHATSAPP

PUBLICACIÓN RELACIONADA CON ZONAPROP cuando corresponda

PROPIEDADES / TERRENOS / EMPRENDIMIENTOS RELACIONADOS

FOOTER

La estructura debe adaptarse dinámicamente según el tipo de publicación.

==================================================
3. GALERÍA
==================================================

La galería debe tener gran protagonismo visual.

Utilizar las imágenes asociadas a la publicación.

Soportar:

- imagen principal
- galería
- planos
- video cuando exista

No mostrar espacios vacíos si no existe algún tipo de multimedia.

Diseñar una galería elegante y fácil de navegar:

Desktop:
- imagen principal grande
- imágenes secundarias
- navegación mediante flechas
- posibilidad de abrir galería ampliada

Mobile:
- carrusel horizontal
- navegación táctil
- imagen a pantalla casi completa

No inventar imágenes.

==================================================
4. ENCABEZADO DE LA PUBLICACIÓN
==================================================

Debajo o junto a la galería mostrar:

TÍTULO

listings.titulo

UBICACIÓN

listings.barrio
listings.ciudad

PRECIO

listings.precio
listings.moneda

Si:

precio_desde = true

mostrar:

"Desde USD X"

o:

"Desde ARS X"

según moneda.

Mostrar estado comercial cuando corresponda:

Disponible
Reservado
En negociación

No mostrar VENDIDO como publicación activa.

==================================================
5. CTA PRINCIPAL
==================================================

El CTA principal de toda la página debe ser:

"Consultar por WhatsApp"

Debe utilizar el título de la publicación para generar un mensaje contextual.

Ejemplo:

"Hola, quisiera consultar por la propiedad Casa en Manantiales."

Para terreno:

"Hola, quisiera consultar por el terreno Lote en Docta."

Para emprendimiento:

"Hola, quisiera consultar por el emprendimiento Torre Origen."

El nombre debe obtenerse dinámicamente de:

listing.titulo

No hardcodear números ni mensajes dentro de los componentes.

Utilizar la configuración global de WhatsApp existente.

==================================================
6. DETALLE DE PROPIEDAD
==================================================

Para:

tipo = PROPIEDAD

mostrar:

Título

Ubicación

Precio

Estado comercial

Galería

Descripción

CARACTERÍSTICAS

- tipo de propiedad
- superficie_m2
- ambientes
- dormitorios
- baños
- cocheras
- apto_credito

No mostrar campos cuyo valor sea null o no exista.

Ejemplo:

Casa en Manantiales

Manantiales · Córdoba

USD 145.000

Disponible

180 m²
4 ambientes
3 dormitorios
2 baños
2 cocheras

Apto crédito

Descripción...

==================================================
7. DETALLE DE TERRENO
==================================================

Para:

tipo = TERRENO

mostrar:

Título

Ubicación

Precio

Estado comercial

Galería

Descripción

CARACTERÍSTICAS

- superficie_m2

No mostrar:

- dormitorios
- baños
- ambientes
- cocheras
- apto crédito

si no corresponden.

Ejemplo:

Lote en Docta

Docta · Córdoba

USD 38.000

Disponible

360 m²

Descripción...

==================================================
8. TERRENO CON VARIAS UNIDADES
==================================================

Si el terreno tiene registros relacionados en:

LISTING_UNIDADES

mostrar una sección:

"LOTES DISPONIBLES"

Cada unidad debe mostrar:

- nombre
- superficie_m2
- precio
- moneda
- estado_comercial

Ejemplo:

Lotes disponibles

Lote 01
360 m²
USD 35.000
Disponible

Lote 02
420 m²
USD 42.000
Reservado

Cada unidad puede tener un CTA:

"Consultar por este lote"

El mensaje de WhatsApp debe identificar tanto la publicación como la unidad.

Ejemplo:

"Hola, quisiera consultar por el Lote 01 de Loteo Los Álamos."

==================================================
9. DETALLE DE EMPRENDIMIENTO
==================================================

Para:

tipo = EMPRENDIMIENTO

mantener la estructura de detalle de emprendimiento existente, pero alinearla al mismo modelo.

Mostrar:

Título

Ubicación

Precio desde

Estado

Galería

Descripción

Superficie cuando corresponda

Fecha de entrega

Financiamiento

Ubicación / mapa

Y si existen registros en LISTING_UNIDADES:

"TIPOLOGÍAS DISPONIBLES"

Cada tipología debe mostrar:

- nombre
- descripción
- superficie_m2
- dormitorios
- baños
- cocheras
- precio
- moneda
- estado_comercial

No mostrar la sección si no existen unidades.

==================================================
10. UBICACIÓN
==================================================

Toda publicación puede tener:

- ciudad
- barrio
- dirección
- latitud
- longitud

Mostrar una sección:

"Ubicación"

Mostrar texto:

Barrio
Ciudad

Cuando existan latitud y longitud, mostrar un mapa.

No inventar una dirección.

Si no existe latitud/longitud, no mostrar un mapa ficticio.

==================================================
11. INFORMACIÓN ADICIONAL
==================================================

EMPRENDIMIENTO:

Mostrar cuando existan:

- fecha_entrega
- financiamiento

PROPIEDAD:

Mostrar cuando exista:

- apto_credito

TERRENO:

Mostrar únicamente información disponible en el modelo.

No inventar servicios, amenities o características.

==================================================
12. ZONAPROP
==================================================

Si:

url_zonaprop

existe:

mostrar una acción secundaria:

"Ver publicación en ZonaProp"

Debe estar claramente subordinada al contacto con ORIGEN.

El CTA principal sigue siendo:

"Consultar por WhatsApp"

Si no existe url_zonaprop, no mostrar el botón.

==================================================
13. PUBLICACIONES RELACIONADAS
==================================================

Al final de la página mostrar:

"También puede interesarte"

Utilizar publicaciones:

- PUBLICADAS
- no VENDIDAS
- del mismo tipo cuando sea posible
- con ubicación relacionada cuando sea posible

Ejemplo:

Desde una propiedad:

"Más propiedades"

Desde un terreno:

"Más terrenos"

Desde un emprendimiento:

"Otros emprendimientos"

No inventar publicaciones.

==================================================
14. PUBLICACIÓN NO DISPONIBLE
==================================================

Si el usuario accede mediante una URL existente a una publicación que ya no está disponible:

mostrar una página especial.

Título:

"Esta propiedad ya no se encuentra disponible."

Para terreno:

"Este terreno ya no se encuentra disponible."

Para emprendimiento:

"Este emprendimiento ya no se encuentra disponible."

No mostrar la información comercial como si siguiera activa.

Debajo mostrar:

"Quizás te interese alguna de estas opciones."

y publicaciones relacionadas actualmente disponibles.

==================================================
15. RESPONSIVE
==================================================

Desktop:

- galería protagonista
- información bien jerarquizada
- CTA visible
- características ordenadas
- mapa correctamente integrado

Mobile:

- galería tipo carrusel
- título y precio inmediatamente visibles
- CTA WhatsApp accesible
- características en grid de 2 columnas cuando corresponda
- contenido cómodo de leer
- no utilizar tablas horizontales

==================================================
16. PRINCIPIO DE DISEÑO
==================================================

La página de detalle NO debe sentirse como una ficha técnica de un portal inmobiliario.

Debe sentirse como una presentación editorial de ORIGEN.

Prioridad visual:

1. Fotografías
2. Título + ubicación
3. Precio
4. CTA WhatsApp
5. Descripción
6. Características
7. Ubicación
8. Información secundaria

Utilizar espacios en blanco, tipografía elegante y una composición limpia.

Evitar:

- exceso de iconos
- exceso de badges
- tarjetas innecesarias
- sombras fuertes
- gradientes
- colores saturados
- bloques gigantes de WhatsApp
- apariencia genérica de portal inmobiliario

==================================================
17. MODELO DE DATOS
==================================================

La página debe respetar estrictamente:

LISTINGS

- id
- tipo
- titulo
- slug
- descripcion
- precio
- moneda
- precio_desde
- estado_publicacion
- estado_comercial
- ciudad
- barrio
- direccion
- latitud
- longitud
- superficie_m2
- tipo_propiedad
- dormitorios
- banos
- cocheras
- ambientes
- apto_credito
- fecha_entrega
- financiamiento
- url_zonaprop
- seo_titulo
- meta_descripcion
- creado_en
- actualizado_en

LISTING_UNIDADES

- id
- listing_id
- nombre
- descripcion
- superficie_m2
- dormitorios
- banos
- cocheras
- precio
- moneda
- estado_comercial
- orden

No crear nuevos campos de backend para resolver necesidades visuales.

Si un dato no existe, ocultar esa sección o campo.

==================================================
18. OBJETIVO
==================================================

Quiero que:

/propiedades
        ↓
/propiedades/[slug]

/terrenos
        ↓
/terrenos/[slug]

/emprendimientos
        ↓
/emprendimientos/[slug]

formen una experiencia coherente.

Las tres páginas deben compartir componentes y lenguaje visual, pero mostrar únicamente la información relevante para cada tipo.

No rediseñar ORIGEN.

No inventar funcionalidades.

No inventar datos.

No modificar el modelo de datos.

Implementar únicamente esta experiencia de detalle alineada con LISTINGS + LISTING_UNIDADES.