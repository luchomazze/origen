import { TEXTS } from '../content/texts'
export type TipoListing = 'PROPIEDAD' | 'TERRENO' | 'EMPRENDIMIENTO'
export type EstadoPublicacion = 'BORRADOR' | 'PUBLICADO' | 'OCULTO'
export type EstadoComercial = 'DISPONIBLE' | 'RESERVADO' | 'EN_NEGOCIACION' | 'VENDIDO' | 'ALQUILADO'
export type Operacion = 'VENTA' | 'ALQUILER'
export type TipoPropiedad = 'CASA' | 'DEPARTAMENTO' | 'PH' | 'LOCAL' | 'OFICINA' | 'CAMPO' | 'CABAÑA' | 'OTRO'

export interface ListingUnidad {
  id: string
  nombre: string
  descripcion?: string
  superficie_m2?: number
  dormitorios?: number
  banos?: number
  cocheras?: number
  precio?: number
  moneda?: string
  estado_comercial: EstadoComercial
  orden: number
}

export interface Listing {
  id: string
  tipo: TipoListing
  titulo: string
  slug: string
  descripcion?: string
  precio?: number
  moneda?: string
  precio_desde?: boolean
  estado_publicacion: EstadoPublicacion
  estado_comercial: EstadoComercial
  operacion: Operacion
  ciudad?: string
  barrio?: string
  direccion?: string
  latitud?: number
  longitud?: number
  superficie_m2?: number
  tipo_propiedad?: TipoPropiedad
  dormitorios?: number
  banos?: number
  cocheras?: number
  ambientes?: number
  apto_credito?: boolean
  fecha_entrega?: string
  financiamiento?: string
  url_zonaprop?: string
  services?: string[]
  imagen?: string
  imagenes?: string[]
  unidades?: ListingUnidad[]
}

export const ALL_SERVICES = [
  'Gas natural',
  'Agua corriente',
  'Electricidad',
  'Cloacas',
  'Internet',
  'Fibra óptica',
  'Seguridad',
] as const

export function formatPrecio(precio: number, moneda = 'USD'): string {
  return `${moneda} ${precio.toLocaleString('es-AR')}`
}

export function displayPrecio(listing: Listing): string | null {
  if (listing.precio == null) return null
  const base = formatPrecio(listing.precio, listing.moneda ?? 'USD')
  return listing.precio_desde ? TEXTS.units.priceFrom(base) : base
}

export function displayUnidadPrecio(unidad: ListingUnidad): string | null {
  if (unidad.precio == null) return null
  return formatPrecio(unidad.precio, unidad.moneda ?? 'USD')
}

export function isPubliclyVisible(listing: Listing): boolean {
  return listing.estado_publicacion === 'PUBLICADO'
}

/** Texto plano con todos los campos buscables de la publicación, para filtrar por coincidencia de substring. */
export function searchIndex(listing: Listing): string {
  return [
    listing.titulo,
    listing.descripcion,
    listing.tipo,
    listing.ciudad,
    listing.barrio,
    listing.direccion,
    listing.tipo_propiedad,
    listing.financiamiento,
    listing.moneda,
    listing.fecha_entrega,
    listing.url_zonaprop,
    listing.estado_publicacion,
    listing.estado_comercial,
    listing.precio != null ? String(listing.precio) : undefined,
    listing.superficie_m2 != null ? String(listing.superficie_m2) : undefined,
    listing.dormitorios != null ? String(listing.dormitorios) : undefined,
    listing.banos != null ? String(listing.banos) : undefined,
    listing.cocheras != null ? String(listing.cocheras) : undefined,
    listing.ambientes != null ? String(listing.ambientes) : undefined,
    listing.services?.join(' '),
    listing.unidades?.map(u => `${u.nombre} ${u.descripcion ?? ''}`).join(' '),
  ].filter(Boolean).join(' ').toLowerCase()
}

/** true si cada palabra de `query` aparece en `index` (en cualquier orden/campo). */
export function matchesSearchTerms(index: string, query: string): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return terms.every(term => index.includes(term))
}
