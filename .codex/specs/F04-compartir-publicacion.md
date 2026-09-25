# F04 — Compartir publicación

**Prioridad:** P1 · **Esfuerzo:** S · **Depende de:** F01 (obligatorio), F03 (para que el link se vea bien)

## Contexto

Pedido del negocio (ToDo S8): poder compartir una publicación con un link. Hoy no es posible porque la URL no cambia (ver F01). Los canales reales del negocio son WhatsApp e Instagram. El uso más frecuente será **el agente mandándole fichas a un cliente**, no solo el visitante compartiendo.

## Requisitos

**Historia 1 — Como visitante quiero compartir una ficha.**

- R1.1 La ficha (`Detail.tsx`) DEBE mostrar un botón "Compartir" visible cerca del título/precio.
- R1.2 CUANDO el dispositivo soporta Web Share API (`navigator.share`), EL SISTEMA DEBE abrir el menú nativo con título, texto corto (tipo · barrio · precio) y URL canónica.
- R1.3 CUANDO no hay Web Share API (desktop), EL SISTEMA DEBE mostrar un menú con: "Copiar link", "WhatsApp", "Email".
- R1.4 CUANDO se copia el link, EL SISTEMA DEBE confirmar con un aviso breve ("Link copiado") accesible (`aria-live`).
- R1.5 SI el usuario cancela el menú nativo, EL SISTEMA NO DEBE mostrar error.

**Historia 2 — Como admin quiero copiar el link de una publicación sin salir del panel.**

- R2.1 Cada publicación **publicada** del listado de Admin DEBE tener "Copiar link".
- R2.2 CUANDO la publicación no está publicada, la acción DEBE estar deshabilitada con tooltip ("Publicala para compartir").

**Historia 3 — Como negocio quiero saber qué canal trae visitas.**

- R3.1 Los links generados DEBEN incluir `?utm_source=<canal>&utm_medium=share` (`whatsapp`, `email`, `copy`, `native`, `admin`).
- R3.2 La URL canónica (F03) NO DEBE incluir UTM.

## Diseño

- Componente `components/ShareButton.tsx` (default export) con props `{ url, title, text }`; detección `typeof navigator.share === 'function'`; fallback a popover propio con los 3 destinos.
- WhatsApp: `https://wa.me/?text=<título + url>` (sin número: el visitante elige el contacto).
- Email: `mailto:?subject=<título>&body=<texto + url>`.
- Copiar: `navigator.clipboard.writeText` con fallback a `document.execCommand('copy')`.
- Util `buildShareUrl(listing, source)` en `utils/share.ts`, reutilizado por Detail y Admin.
- Estilo alineado a los botones existentes (Montserrat, borde dorado `#B88E3A`).

## Tareas

- [ ] T1. `utils/share.ts` (`buildShareUrl`, texto por tipo). (R1.2, R3.1)
- [ ] T2. `ShareButton` con Web Share + fallback + aviso "Link copiado". (R1.2–R1.5)
- [ ] T3. Integrar en `Detail.tsx`. (R1.1)
- [ ] T4. "Copiar link" en `AdminPublications.tsx`. (R2.1, R2.2)
- [ ] T5. Verificar en iOS Safari, Android Chrome y desktop (Chrome/Firefox). (todos)

## Fuera de alcance (backlog, evaluar después)

- **Código QR** del link para carteles "Se vende" y folletos (alto valor físico, esfuerzo bajo con `qrcode`).
- **Ficha PDF/imprimible** para enviar por mail.
- **Selección compartible** ("te mando estas 3") — requiere favoritos, hoy fuera del MVP.
- Botón compartir en las cards del listado (evitar saturar el diseño; reconsiderar con métricas).

## Preguntas abiertas

- ¿El texto compartido incluye el precio? (propuesta: sí, salvo "Consultar")
- ¿Se agrega QR ya en esta feature o en una posterior?

## Definición de terminado

Criterios verificados en los 3 entornos; link compartido abre la ficha correcta en incógnito; ToDo S8 "Agregar botón de compartir" marcado.
