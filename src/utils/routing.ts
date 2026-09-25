import type { Page } from '../types'

const SEGMENT_TO_PAGE: Record<string, { list: Page; detail: Page }> = {
  propiedades: { list: 'properties', detail: 'property-detail' },
  terrenos: { list: 'lands', detail: 'land-detail' },
  emprendimientos: { list: 'projects', detail: 'project-detail' },
}

const PAGE_TO_SEGMENT: Record<string, string> = {
  properties: 'propiedades',
  'property-detail': 'propiedades',
  lands: 'terrenos',
  'land-detail': 'terrenos',
  projects: 'emprendimientos',
  'project-detail': 'emprendimientos',
}

export function parsePath(pathname: string): { page: Page; slug?: string } {
  const [first, second] = pathname.split('/').filter(Boolean)

  if (!first) return { page: 'home' }
  if (first === 'contacto') return { page: 'contact' }
  if (first === 'admin') return { page: 'admin' }

  const mapped = SEGMENT_TO_PAGE[first]
  if (!mapped) return { page: 'not-found' }

  return second ? { page: mapped.detail, slug: decodeURIComponent(second) } : { page: mapped.list }
}

export function buildPath(page: Page, slug?: string): string {
  if (page === 'home') return '/'
  if (page === 'contact') return '/contacto'
  if (page === 'admin') return '/admin'

  const segment = PAGE_TO_SEGMENT[page]
  if (!segment) return '/'

  return page.endsWith('-detail') && slug ? `/${segment}/${encodeURIComponent(slug)}` : `/${segment}`
}
