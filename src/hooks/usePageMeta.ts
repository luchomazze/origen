import { useEffect } from 'react'

interface PageMetaOptions {
  title: string
  description: string
  path: string
  image?: string
  jsonLd?: Record<string, unknown>
  /** false para saltear la actualización (ej. previsualización de un borrador dentro de Admin). Default true. */
  enabled?: boolean
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const JSONLD_ID = 'page-jsonld'

/** Mantiene <title>, meta description/OG, canonical y JSON-LD sincronizados con la página actual. Google ejecuta JS y lee esto; WhatsApp/Facebook no (ver F03, requiere una función server-side aparte para esas previews). */
export function usePageMeta({ title, description, path, image, jsonLd, enabled = true }: PageMetaOptions) {
  useEffect(() => {
    if (!enabled) return
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', `${window.location.origin}${path}`)
    if (image) upsertMeta('property', 'og:image', image)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${window.location.origin}${path}`

    let script = document.getElementById(JSONLD_ID) as HTMLScriptElement | null
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script')
        script.id = JSONLD_ID
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    } else if (script) {
      script.remove()
    }
  }, [title, description, path, image, jsonLd, enabled])
}
