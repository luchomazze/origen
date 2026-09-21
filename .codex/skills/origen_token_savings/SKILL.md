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

## 8. Figma Make → código

Cuando el código provenga de Figma Make:

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
