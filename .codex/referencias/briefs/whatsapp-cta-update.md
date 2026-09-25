MODIFICACIÓN DEL PROTOTIPO EXISTENTE – ORIGEN INVERSIONES INMOBILIARIAS

Continuá trabajando sobre el prototipo actual de ORIGEN – Inversiones Inmobiliarias. NO rediseñes desde cero ni cambies la identidad visual existente. Mantené la estética, estructura, componentes, tipografías y paleta de colores ya definidos.

OBJETIVO DE ESTA MODIFICACIÓN

Incorporar WhatsApp como canal principal de contacto comercial en toda la web.

Los botones de WhatsApp deben ser CTAs contextuales: el mensaje que se abre en WhatsApp debe variar según el tipo de contenido que el usuario está consultando.

Además, esta configuración debe poder administrarse desde el panel /admin, sin necesidad de modificar código.

--------------------------------------------------
1. WHATSAPP COMO CTA PRINCIPAL
--------------------------------------------------

Agregar un CTA de WhatsApp en los lugares donde tenga sentido comercialmente.

Usar como CTA principal textos como:

- "Consultar por WhatsApp"
- "Quiero conocer este proyecto"
- "Consultar disponibilidad"
- "Hablar con un asesor"

No utilizar WhatsApp de forma invasiva ni convertir toda la interfaz en botones verdes. El diseño debe seguir respetando la identidad premium de ORIGEN.

El botón puede utilizar un pequeño ícono de WhatsApp, pero debe integrarse visualmente con la identidad de ORIGEN.

--------------------------------------------------
2. HERO / HOME
--------------------------------------------------

Mantener el hero principal existente.

Incorporar WhatsApp como CTA secundario cuando corresponda.

Ejemplo:

"Cada gran decisión inmobiliaria tiene un origen."

[ Conocé nuestros proyectos ]

[ Consultar por WhatsApp ]

El CTA principal debe continuar siendo visualmente predominante.

--------------------------------------------------
3. EMPRENDIMIENTOS
--------------------------------------------------

En cada Project Card / tarjeta de emprendimiento incorporar una opción:

"Consultar por WhatsApp"

En la página de detalle del emprendimiento, incluir un CTA destacado:

"Quiero conocer este proyecto"

o

"Consultar por WhatsApp"

Al hacer clic, debe abrir WhatsApp con un mensaje prearmado contextualizado.

Ejemplo:

"Hola ORIGEN, quiero consultar por el emprendimiento Origen Park."

El nombre del emprendimiento debe ser dinámico.

No escribir un mensaje diferente manualmente para cada proyecto. El sistema debe utilizar una plantilla configurable.

--------------------------------------------------
4. PROPIEDADES
--------------------------------------------------

En cada Property Card incorporar:

"Consultar por WhatsApp"

En el detalle de una propiedad:

"Me interesa esta propiedad"

Al hacer clic, abrir WhatsApp con un mensaje como:

"Hola ORIGEN, quiero consultar por la propiedad Casa en Jardines del Sur."

El nombre de la propiedad debe ser dinámico.

--------------------------------------------------
5. TERRENOS
--------------------------------------------------

Aplicar la misma lógica a terrenos.

CTA:

"Consultar por WhatsApp"

Mensaje de ejemplo:

"Hola ORIGEN, quiero consultar por el terreno Lote 12 – La Arboleda."

El nombre del terreno debe ser dinámico.

--------------------------------------------------
6. MENSAJES CONTEXTUALES
--------------------------------------------------

Implementar conceptualmente un sistema de plantillas.

Variables disponibles:

{nombre}
{ubicacion}
{tipo}

Para el MVP utilizar principalmente:

{nombre}

Ejemplos:

Emprendimiento:
"Hola ORIGEN, quiero consultar por el emprendimiento {nombre}."

Propiedad:
"Hola ORIGEN, quiero consultar por la propiedad {nombre}."

Terreno:
"Hola ORIGEN, quiero consultar por el terreno {nombre}."

La interfaz debe representar claramente que estos mensajes son configurables.

--------------------------------------------------
7. PANEL DE ADMINISTRACIÓN
--------------------------------------------------

Actualizar el panel /admin existente.

Agregar una sección:

"Configuración"

Dentro de ella:

"WhatsApp"

La pantalla debe permitir configurar:

1. Número de WhatsApp comercial

Campo:
"WhatsApp comercial"

Ejemplo visual:
+54 9 351 XXX XXXX

2. Mensaje para emprendimientos

Campo de texto:

"Hola ORIGEN, quiero consultar por el emprendimiento {nombre}."

3. Mensaje para propiedades

Campo de texto:

"Hola ORIGEN, quiero consultar por la propiedad {nombre}."

4. Mensaje para terrenos

Campo de texto:

"Hola ORIGEN, quiero consultar por el terreno {nombre}."

Mostrar debajo de los campos una pequeña ayuda:

"Podés utilizar {nombre} para insertar automáticamente el nombre del contenido que el visitante está consultando."

Agregar:

[ Guardar cambios ]

Y opcionalmente:

[ Probar WhatsApp ]

--------------------------------------------------
8. PREVISUALIZACIÓN
--------------------------------------------------

Dentro de la configuración de WhatsApp mostrar una pequeña previsualización del mensaje.

Por ejemplo:

PREVISUALIZACIÓN

Hola ORIGEN, quiero consultar por el emprendimiento Origen Park.

[ Abrir WhatsApp de prueba ]

Esto permite al administrador comprobar cómo funcionará el CTA antes de guardar/publicar.

--------------------------------------------------
9. MODELO DE DATOS CONCEPTUAL
--------------------------------------------------

Representar visualmente que la configuración pertenece a una configuración global del sitio.

Conceptualmente:

SITE SETTINGS

- whatsapp_number
- whatsapp_message_project
- whatsapp_message_property
- whatsapp_message_land

Los contenidos individuales NO deben almacenar un número de WhatsApp propio salvo que sea necesario en una futura versión.

El número comercial es global.

Los mensajes son plantillas globales.

El nombre del contenido se inserta automáticamente.

--------------------------------------------------
10. EXPERIENCIA RESPONSIVE
--------------------------------------------------

Mantener comportamiento responsive.

Desktop:
- CTA integrado naturalmente en las fichas.
- En detalles de contenido, WhatsApp debe ser claramente visible.
- No saturar la interfaz.

Mobile:
- El CTA de WhatsApp debe ser fácil de tocar.
- Puede utilizarse un botón sticky inferior en páginas de detalle si visualmente encaja con el diseño.
- Evitar que tape contenido importante.

--------------------------------------------------
11. ESTILO VISUAL
--------------------------------------------------

Mantener estrictamente la identidad visual existente de ORIGEN:

Azul Origen:
#0D1B2A

Marfil:
#F5F2EC

Arena:
#DCC8A3

Oro:
#B88E3A

Gris Piedra:
#5C636B

Tipografías:

Playfair Display para títulos y elementos de marca.

Montserrat para textos, información y UI.

No convertir los botones de WhatsApp en grandes bloques verdes que rompan la identidad.

El ícono de WhatsApp puede conservar su reconocimiento visual, pero el botón debe integrarse con el lenguaje visual de ORIGEN.

--------------------------------------------------
12. IMPORTANTE – NO MODIFICAR LA ARQUITECTURA GENERAL
--------------------------------------------------

Esta es una modificación del prototipo existente.

Mantener:

- Home
- Propiedades
- Terrenos
- Emprendimientos
- Detalle de emprendimiento
- Nosotros
- Contacto
- /admin
- Dashboard administrativo
- Gestión de propiedades
- Gestión de terrenos
- Gestión de emprendimientos

No eliminar funcionalidades existentes.

No agregar funcionalidades complejas innecesarias.

El objetivo es que ORIGEN tenga un flujo comercial simple:

VISITANTE
→ descubre contenido
→ encuentra una propiedad / terreno / emprendimiento
→ hace clic en WhatsApp
→ WhatsApp se abre con contexto
→ equipo comercial continúa la conversación

ADMIN
→ configura número de WhatsApp
→ configura plantillas de mensajes
→ guarda cambios
→ todos los CTAs de la web utilizan automáticamente esa configuración.

--------------------------------------------------
13. PROTOTIPO FUNCIONAL
--------------------------------------------------

Hacer que los botones sean interactivos.

Crear estados visuales para:

- normal
- hover
- pressed
- disabled cuando corresponda

Simular el flujo:

Detalle de emprendimiento
→ "Consultar por WhatsApp"
→ pantalla/estado que represente apertura de WhatsApp con el mensaje contextual.

Y desde:

/admin
→ Configuración
→ WhatsApp
→ modificar número/mensaje
→ Guardar cambios
→ previsualización actualizada.

La prioridad es mostrar claramente la experiencia completa y la relación entre la configuración del administrador y los CTAs públicos.

NO inventar información real de ORIGEN, números telefónicos, direcciones o datos comerciales.
Utilizar datos ficticios únicamente como contenido de demostración.