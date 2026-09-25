# F03 — SEO, metadata y vistas previas de links

**Prioridad:** P0 · **Esfuerzo:** M · **Depende de:** F01 (URLs), F09 (Vercel + dominio)

## Contexto

`index.html` ya tiene título, description, favicon, `theme-color`, OG genérico y `robots.txt` (T1). Siguen faltando `sitemap.xml`, `og:image` y la metadata por página. Además, al ser una SPA, los crawlers de WhatsApp/Facebook/LinkedIn/X **no ejecutan JavaScript**: aunque React cambie los meta tags, al pegar un link todos se ven iguales (o sin preview). En inmobiliaria la tarjeta de preview (foto + título + precio) es lo que genera el clic.

## Requisitos

**Historia 1 — Metadata base.**

- R1.1 Cada página DEBE tener `<title>` y `<meta name="description">` propios (ej. "Casa en Nordelta · USD 350.000 | ORIGEN").
- R1.2 El sitio DEBE tener favicon y `theme-color` de marca.
- R1.3 Cada página DEBE declarar `<link rel="canonical">` con la URL canónica de F01.

**Historia 2 — Vista previa al compartir. Como agente quiero que al pegar el link en WhatsApp aparezca la foto, el título y el precio.**

- R2.1 CUANDO un crawler social pide `/propiedades/:slug` (y equivalentes), EL SISTEMA DEBE responder HTML con `og:title`, `og:description`, `og:image` (portada, ≥1200×630 recomendado), `og:url`, `og:type=website` y `twitter:card=summary_large_image`.
- R2.2 SI la publicación no existe o no está publicada, EL SISTEMA DEBE responder con la metadata genérica del sitio (sin filtrar datos de borradores).
- R2.3 Las páginas de catálogo y el Home DEBEN tener metadata OG genérica con imagen de marca.
- R2.4 Los visitantes humanos DEBEN recibir la misma SPA de siempre (sin cambio de comportamiento).

**Historia 3 — Indexación.**

- R3.1 `robots.txt` DEBE permitir el sitio público y bloquear `/admin`.
- R3.2 `sitemap.xml` DEBE listar las rutas públicas y todas las publicaciones publicadas, generado dinámicamente desde Supabase.
- R3.3 Las fichas DEBERÍAN incluir datos estructurados JSON-LD (`RealEstateListing` / `Offer`).

## Diseño

- **Metadata en cliente (R1):** hook `usePageMeta({ title, description, image, canonical })` que actualiza `document.head`; React 19 también permite `<title>`/`<meta>` dentro de componentes. Suficiente para Google (que sí ejecuta JS).
- **Previews sociales (R2):** Vercel Function `api/og/[tipo]/[slug].ts` + rewrite condicional en `vercel.json` por `user-agent` (`facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot`) hacia la función; la función consulta Supabase con la anon key (RLS ya limita a publicadas) y devuelve un HTML mínimo con meta tags + `<meta http-equiv="refresh">` a la URL real.
  - Alternativa evaluada: prerender en build (`vite-plugin-ssg`/prerender) → descartada: el catálogo cambia sin redeploy.
  - Alternativa evaluada: Supabase Edge Function → posible, pero requiere enrutar desde Vercel igual; mantener todo en Vercel es más simple.
- **Imagen OG:** usar la portada de `listing_images`; si hace falta el formato 1200×630, usar la transformación de imágenes de Supabase Storage (`/render/image/...?width=1200&height=630&resize=cover`, requiere plan Pro) o `@vercel/og` para generar una tarjeta con marca, precio y foto (opción más premium).
- **Sitemap (R3.2):** Vercel Function `api/sitemap.xml.ts` con rewrite de `/sitemap.xml`, cache `s-maxage=3600`.
- **Archivos nuevos:** `public/robots.txt`, `public/favicon.svg`, `public/og-default.jpg`, `api/og/...`, `api/sitemap...`.

## Tareas

- [x] T1. Reemplazar el placeholder de `index.html`: título, description, favicon, theme-color, OG por defecto. (R1.2, R2.3) `og:image` queda pendiente hasta tener el dominio, porque necesita una URL absoluta. `public/robots.txt` bloquea `/admin` (parte de R3.1).
- [ ] T2. Hook `usePageMeta` y aplicarlo en todas las páginas y en Detail. (R1.1, R1.3)
- [ ] T3. Función OG por publicación + rewrite por user-agent. (R2.1, R2.2, R2.4)
- [ ] T4. Imagen OG (portada transformada o `@vercel/og`). (R2.1)
- [ ] T5. `robots.txt` y sitemap dinámico. (R3.1, R3.2)
- [ ] T6. JSON-LD en Detail. (R3.3)
- [ ] T7. Verificar con Facebook Sharing Debugger, pegando el link en WhatsApp y con Google Rich Results Test. (todos)

## Fuera de alcance

- SSR completo / migración a Next.js.
- Estrategia de contenido SEO (blog, landing por barrio).

## Preguntas abiertas

- Dominio definitivo.
- ¿Tarjeta OG con marca y precio generada (`@vercel/og`) o solo la foto de portada?
- ¿Plan de Supabase (la transformación de imágenes es Pro)?

## Definición de terminado

Un link de ficha pegado en WhatsApp muestra foto, título y precio; Sharing Debugger sin errores; `/sitemap.xml` lista las publicadas; ToDo S7 "Revisar SEO, sitemap y metadata" marcado.
