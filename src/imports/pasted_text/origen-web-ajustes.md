Quiero ajustar las secciones públicas de la web de ORIGEN – Inversiones Inmobiliarias: PROPIEDADES, TERRENOS y EMPRENDIMIENTOS.

IMPORTANTE:
- No rediseñes la identidad visual existente.
- No cambies la estética general de ORIGEN.
- No inventes campos, filtros, funcionalidades ni información.
- No agregues funcionalidades de portal inmobiliario que no estén especificadas.
- El objetivo es alinear el frontend con el modelo de datos que vamos a implementar en backend.
- Si actualmente existen datos ficticios o campos que no corresponden al modelo, reemplazarlos/eliminarlos.
- Mantener el diseño elegante, minimalista, cálido y premium de ORIGEN.
- Mantener Playfair Display para títulos y Montserrat para textos.
- Mantener la paleta existente: Azul Origen #0D1B2A, Marfil #F5F2EC, Arena #DCC8A3, Oro #B88E3A y Gris Piedra #5C636B.

==================================================
1. MODELO DE DATOS QUE EL FRONTEND DEBE RESPETAR
==================================================

La entidad principal es:

LISTINGS

Campos disponibles:

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

Valores de tipo:

- PROPIEDAD
- TERRENO
- EMPRENDIMIENTO

Estado de publicación:

- BORRADOR
- PUBLICADO
- OCULTO

Estado comercial:

- DISPONIBLE
- RESERVADO
- EN_NEGOCIACION
- VENDIDO

IMPORTANTE:
Solo las publicaciones con estado_publicacion = PUBLICADO deben aparecer públicamente.

Si estado_comercial = VENDIDO, la publicación no debe aparecer en los listados públicos activos.

Las publicaciones RESERVADO o EN_NEGOCIACION sí pueden aparecer si están publicadas, mostrando claramente su estado comercial.

==================================================
2. TABLA HIJA: LISTING_UNIDADES
==================================================

Una publicación puede tener cero o muchas unidades.

Relación:

LISTINGS 1 ───── N LISTING_UNIDADES

Campos:

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

Esta tabla se utiliza especialmente para:

- emprendimientos con varias tipologías
- loteos con varios lotes
- complejos con varias unidades

No asumir que todas las publicaciones tienen unidades.

Si una publicación no tiene unidades, no mostrar una sección vacía.

==================================================
3. SECCIÓN PROPIEDADES
==================================================

Ruta:

/propiedades

Debe mostrar solamente:

tipo = PROPIEDAD
estado_publicacion = PUBLICADO
estado_comercial != VENDIDO

Filtros disponibles:

1. Ubicación
2. Tipo de propiedad
3. Apto crédito

NO agregar otros filtros.

El filtro "Ubicación" debe permitir filtrar por ciudad/barrio.

El filtro "Tipo de propiedad" debe utilizar tipo_propiedad.

Tipos posibles:

- CASA
- DEPARTAMENTO
- PH
- LOCAL
- OFICINA
- CAMPO
- CABAÑA
- OTRO

El filtro "Apto crédito" debe permitir:

- Todos
- Sí
- No

==================================================
4. CARDS DE PROPIEDADES
==================================================

Cada card debe mostrar solamente información disponible en LISTINGS.

Mostrar:

- imagen principal
- título
- ubicación
- tipo de propiedad
- superficie_m2
- dormitorios, si existe
- banos, si existe
- cocheras, si existe
- precio
- moneda
- "Desde" si precio_desde = true
- estado comercial cuando corresponda

No inventar amenities ni características que no estén en el modelo.

Ejemplo:

Casa en Manantiales

Manantiales · Córdoba

180 m²
3 dormitorios
2 baños
2 cocheras

USD 145.000

[Consultar por WhatsApp]

==================================================
5. DETALLE DE PROPIEDAD
==================================================

Ruta conceptual:

/propiedades/[slug]

Mostrar:

- título
- ubicación
- precio
- estado comercial
- galería
- descripción
- superficie
- tipo de propiedad
- ambientes
- dormitorios
- baños
- cocheras
- apto crédito
- ubicación/mapa utilizando latitud y longitud
- WhatsApp

Si existe url_zonaprop, mostrarla como acción secundaria al final de la página.

La acción principal debe seguir siendo contactar a ORIGEN por WhatsApp.

No agregar formularios de contacto.

==================================================
6. SECCIÓN TERRENOS
==================================================

Ruta:

/terrenos

Debe mostrar solamente:

tipo = TERRENO
estado_publicacion = PUBLICADO
estado_comercial != VENDIDO

Filtro disponible:

1. Ubicación

NO agregar precio, superficie, dormitorios, apto crédito ni otros filtros en esta primera versión.

Los terrenos pueden tener información adicional en su descripción.

==================================================
7. CARDS DE TERRENOS
==================================================

Mostrar:

- imagen
- título
- ubicación
- superficie_m2
- precio
- moneda
- "Desde" si corresponde
- estado comercial
- CTA WhatsApp

Ejemplo:

Lote en Docta

Docta · Córdoba

360 m²

USD 38.000

[Consultar por WhatsApp]

==================================================
8. TERRENOS CON VARIAS UNIDADES
==================================================

Si un TERRENO tiene registros relacionados en LISTING_UNIDADES:

mostrar la publicación como una publicación agrupadora.

Ejemplo:

Loteo Los Álamos

Docta · Córdoba

Desde USD 35.000

12 lotes disponibles

Al entrar:

Loteo Los Álamos

Descripción...

Luego:

LOTES DISPONIBLES

Lote 01
360 m²
USD 35.000
Disponible

Lote 02
420 m²
USD 42.000
Reservado

etc.

No convertir cada unidad automáticamente en una publicación independiente.

Las unidades pertenecen a la publicación principal.

==================================================
9. SECCIÓN EMPRENDIMIENTOS
==================================================

Ruta:

/emprendimientos

Debe mostrar solamente:

tipo = EMPRENDIMIENTO
estado_publicacion = PUBLICADO
estado_comercial != VENDIDO

Filtro disponible:

1. Ubicación

No agregar filtros adicionales.

==================================================
10. CARDS DE EMPRENDIMIENTOS
==================================================

Mostrar:

- imagen principal
- nombre/título
- ubicación
- precio
- moneda
- "Desde" cuando corresponda
- fecha de entrega, si existe
- estado comercial
- CTA

Ejemplo:

Torre Origen

Manantiales · Córdoba

Desde USD 85.000

Entrega: Diciembre 2027

[Ver emprendimiento]

==================================================
11. DETALLE DE EMPRENDIMIENTO
==================================================

Ruta conceptual:

/emprendimientos/[slug]

Debe tener una presentación más completa que una propiedad individual.

Mostrar:

HERO

- imagen/video
- título
- ubicación
- estado
- precio desde

INFORMACIÓN

- descripción
- superficie_m2 si corresponde
- fecha_entrega
- financiamiento

UBICACIÓN

- ciudad
- barrio
- dirección
- mapa usando latitud y longitud

GALERÍA

- imágenes
- planos
- videos cuando existan

==================================================
12. TIPLOGÍAS / UNIDADES
==================================================

Si existen registros en LISTING_UNIDADES, mostrar una sección:

"Tipologías disponibles"

Cada unidad debe utilizar exclusivamente sus propios datos:

- nombre
- descripción
- superficie_m2
- dormitorios
- banos
- cocheras
- precio
- moneda
- estado_comercial

Ejemplo:

TIPOLOGÍAS DISPONIBLES

┌──────────────────────────────┐
│ 1 dormitorio                 │
│ 42 m²                        │
│ 1 dormitorio · 1 baño        │
│                              │
│ USD 85.000                   │
│ Disponible                   │
│                              │
│ [Consultar]                  │
└──────────────────────────────┘

┌──────────────────────────────┐
│ 2 dormitorios                │
│ 55 m²                        │
│ 2 dormitorios · 1 baño       │
│                              │
│ USD 105.000                  │
│ Disponible                   │
│                              │
│ [Consultar]                  │
└──────────────────────────────┘

No mostrar una lista gigante ni dropdowns complejos.

El objetivo es que las tipologías sean fáciles de comparar visualmente.

==================================================
13. REGLAS PARA PRECIO
==================================================

Si:

precio_desde = true

mostrar:

"Desde USD 85.000"

Si:

precio_desde = false

mostrar:

"USD 85.000"

No inventar rangos de precios.

Para emprendimientos con unidades, el precio principal puede representar el precio inicial y las unidades contienen sus precios individuales.

==================================================
14. WHATSAPP
==================================================

WhatsApp es el CTA principal de contacto.

No mostrar grandes bloques verdes de WhatsApp.

Utilizar el botón dentro de las cards y páginas de detalle.

El mensaje debe ser contextual.

Ejemplo:

"Hola, quisiera consultar por la propiedad Casa en Manantiales."

Para emprendimientos:

"Hola, quisiera consultar por el emprendimiento Torre Origen."

Para terrenos:

"Hola, quisiera consultar por el terreno Loteo Los Álamos."

El nombre debe provenir dinámicamente de:

listing.titulo

No hardcodear publicaciones.

==================================================
15. PUBLICACIONES NO DISPONIBLES
==================================================

No mostrar VENDIDO en los listados públicos activos.

Si un usuario entra directamente mediante una URL antigua de una publicación que ya no está disponible:

mostrar una página clara:

"Esta propiedad ya no se encuentra disponible."

Debajo:

"Quizás te interese alguna de estas propiedades."

Mostrar publicaciones similares disponibles.

No borrar visualmente la URL ni inventar información.

==================================================
16. RESPONSIVE
==================================================

Mantener el diseño completamente responsive.

Desktop:

- catálogo cómodo
- cards visuales
- filtros claros

Mobile:

- filtros compactos
- cards apiladas
- galería usable
- CTA WhatsApp accesible
- no crear tablas horizontales incómodas para las tipologías

==================================================
17. DATOS FICTICIOS
==================================================

Los datos actuales del prototipo pueden mantenerse únicamente como datos de demostración si son necesarios para visualizar la interfaz.

Pero deben respetar exactamente el modelo definido.

No inventar:

- cantidad de propiedades
- cantidad de clientes
- cantidad de operaciones
- metros vendidos
- porcentajes
- años de experiencia
- cantidad de desarrollos
- amenities
- características inmobiliarias
- estados
- precios

No mostrar métricas comerciales ficticias.

==================================================
18. OBJETIVO FINAL
==================================================

Quiero que las tres secciones se sientan como partes del mismo sitio ORIGEN:

/propiedades
/terrenos
/emprendimientos

pero que cada una tenga la información y filtros que realmente corresponden a su tipo.

La regla principal es:

EL FRONTEND NO DEBE INVENTAR EL MODELO DE DATOS.

Debe representar el modelo:

LISTINGS
    └── LISTING_UNIDADES (0..N)

Mantener la estética actual de ORIGEN y realizar solamente los cambios necesarios para que las pantallas, filtros, cards y páginas de detalle queden alineados con este contrato de datos.