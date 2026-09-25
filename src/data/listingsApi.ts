import { TEXTS } from '../content/texts'
import type { EstadoComercial, EstadoPublicacion, Listing, ListingUnidad, Operacion, TipoListing, TipoPropiedad } from './listings'
import { requireSupabase } from '../lib/supabase'

type ListingRow = {
  id: string
  type: string
  title: string
  description: string | null
  operation: string | null
  address: string | null
  neighborhood: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  price: number | null
  price_from?: boolean | null
  currency: string | null
  financing: boolean | null
  delivery_date: string | null
  services: string[] | null
  surface_m2: number | null
  bedrooms: number | null
  bathrooms: number | null
  garages: number | null
  rooms: number | null
  property_type: string | null
  financing_details: string | null
  mortgage_eligible: boolean | null
  publication_status: string
  commercial_status: string
  whatsapp_enabled: boolean | null
  whatsapp_message: string | null
}

type TypologyRow = {
  id: string
  listing_id: string
  name: string
  description: string | null
  surface_m2: number | null
  price: number | null
  currency: string | null
  bedrooms: number | null
  bathrooms: number | null
}

type ImageRow = {
  id: string
  listing_id: string
  image_url: string
  display_order: number
}

type ListingWithRelations = ListingRow & {
  listing_typologies: TypologyRow[] | null
  listing_images: ImageRow[] | null
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function mapTipo(value: string): TipoListing {
  const tipo = value.toLowerCase()
  if (tipo === 'terreno') return 'TERRENO'
  if (tipo === 'emprendimiento') return 'EMPRENDIMIENTO'
  return 'PROPIEDAD'
}

const PROPERTY_TYPES: Record<string, TipoPropiedad> = {
  casa: 'CASA',
  departamento: 'DEPARTAMENTO',
  ph: 'PH',
  local: 'LOCAL',
  oficina: 'OFICINA',
  campo: 'CAMPO',
  cabana: 'CABAÑA',
  otro: 'OTRO',
}

function mapTipoPropiedad(value: string | null): TipoPropiedad | undefined {
  return value ? PROPERTY_TYPES[value.toLowerCase()] : undefined
}

function mapPublicationStatus(value: string): EstadoPublicacion {
  if (value.toLowerCase() === 'publicado') return 'PUBLICADO'
  if (value.toLowerCase() === 'pausado' || value.toLowerCase() === 'oculto') return 'OCULTO'
  return 'BORRADOR'
}

function mapCommercialStatus(value: string): EstadoComercial {
  const status = value.toLowerCase()
  if (status === 'reservado') return 'RESERVADO'
  if (status === 'vendido') return 'VENDIDO'
  if (status === 'en_negociacion' || status === 'en negociación') return 'EN_NEGOCIACION'
  if (status === 'alquilado') return 'ALQUILADO'
  return 'DISPONIBLE'
}

function mapOperacion(value: string | null): Operacion {
  return value?.toLowerCase() === 'alquiler' ? 'ALQUILER' : 'VENTA'
}

export function mapListing(row: ListingWithRelations): Listing {
  const images = (row.listing_images ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map(image => image.image_url)

  return {
    id: row.id,
    tipo: mapTipo(row.type),
    titulo: row.title,
    slug: `${slugify(row.title)}-${row.id}`,
    descripcion: row.description ?? undefined,
    precio: row.price ?? undefined,
    moneda: row.currency ?? undefined,
    precio_desde: row.price_from ?? false,
    estado_publicacion: mapPublicationStatus(row.publication_status),
    estado_comercial: mapCommercialStatus(row.commercial_status),
    operacion: mapOperacion(row.operation),
    ciudad: row.city ?? undefined,
    barrio: row.neighborhood ?? undefined,
    direccion: row.address ?? undefined,
    latitud: row.latitude ?? undefined,
    longitud: row.longitude ?? undefined,
    superficie_m2: row.surface_m2 ?? undefined,
    tipo_propiedad: mapTipoPropiedad(row.property_type),
    dormitorios: row.bedrooms ?? undefined,
    banos: row.bathrooms ?? undefined,
    cocheras: row.garages ?? undefined,
    ambientes: row.rooms ?? undefined,
    apto_credito: row.mortgage_eligible ?? undefined,
    fecha_entrega: row.delivery_date ?? undefined,
    financiamiento: row.financing_details || (row.financing ? TEXTS.listingsData.financingAvailableFallback : undefined),
    services: row.services ?? undefined,
    imagen: images[0],
    imagenes: images,
    unidades: (row.listing_typologies ?? [])
      .slice()
      .map((typology, index): ListingUnidad => ({
        id: typology.id,
        nombre: typology.name,
        descripcion: typology.description ?? undefined,
        superficie_m2: typology.surface_m2 ?? undefined,
        dormitorios: typology.bedrooms ?? undefined,
        banos: typology.bathrooms ?? undefined,
        precio: typology.price ?? undefined,
        moneda: typology.currency ?? undefined,
        estado_comercial: 'DISPONIBLE',
        orden: index + 1,
      })),
  }
}

async function fetchPublicListings(tipo?: TipoListing): Promise<Listing[]> {
  let query = requireSupabase()
    .from('listings')
    .select('*, listing_typologies(*), listing_images(*)')
    .eq('publication_status', 'publicado')
    .order('created_at', { ascending: false })

  if (tipo) query = query.eq('type', tipo.toLowerCase())

  const { data, error } = await query
  if (error) throw error
  return (data as ListingWithRelations[]).map(mapListing)
}

const cacheKey = (tipo?: TipoListing) => tipo ?? 'ALL'
const resolvedCache = new Map<string, Listing[]>()
const inFlightCache = new Map<string, Promise<Listing[]>>()

// Publicaciones cargadas por un admin no se ven reflejadas hasta recargar la pestaña pública (sin invalidación).
export function getCachedPublicListings(tipo?: TipoListing): Listing[] | undefined {
  return resolvedCache.get(cacheKey(tipo))
}

export function getPublicListings(tipo?: TipoListing): Promise<Listing[]> {
  const key = cacheKey(tipo)
  const cached = resolvedCache.get(key)
  if (cached) return Promise.resolve(cached)

  let promise = inFlightCache.get(key)
  if (!promise) {
    promise = fetchPublicListings(tipo)
      .then(data => {
        resolvedCache.set(key, data)
        inFlightCache.delete(key)
        return data
      })
      .catch(error => {
        inFlightCache.delete(key)
        throw error
      })
    inFlightCache.set(key, promise)
  }
  return promise
}
