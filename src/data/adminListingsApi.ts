import { requireSupabase } from '../lib/supabase'
import type { Listing } from './listings'
import { mapListing } from './listingsApi'
import type { AdminTypology } from './adminListingTypologiesApi'
import type { ListingImage } from './listingImagesApi'

export interface AdminListingInput {
  type: 'propiedad' | 'terreno' | 'emprendimiento'
  title: string
  description: string
  operation: 'venta' | 'alquiler'
  address: string
  neighborhood: string
  city: string
  latitude: number | null
  longitude: number | null
  price: number | null
  price_from: boolean
  currency: string
  financing: boolean
  delivery_date: string | null
  services: string[]
  surface_m2: number | null
  bedrooms: number | null
  bathrooms: number | null
  garages: number | null
  rooms: number | null
  property_type: 'casa' | 'departamento' | 'ph' | 'local' | 'oficina' | 'campo' | 'cabana' | 'otro' | null
  financing_details: string
  mortgage_eligible: boolean
  publication_status: 'borrador' | 'publicado' | 'pausado'
  commercial_status: 'disponible' | 'reservado' | 'en_negociacion' | 'vendido' | 'alquilado'
  whatsapp_enabled: boolean
  whatsapp_message: string
}

export type AdminListing = AdminListingInput & { id: string; created_at: string; updated_at: string }

export const EMPTY_LISTING: AdminListingInput = {
  type: 'propiedad',
  title: '',
  description: '',
  operation: 'venta',
  address: '',
  neighborhood: '',
  city: 'Córdoba',
  latitude: null,
  longitude: null,
  price: null,
  price_from: false,
  currency: 'USD',
  financing: false,
  delivery_date: null,
  services: [],
  surface_m2: null,
  bedrooms: null,
  bathrooms: null,
  garages: null,
  rooms: null,
  property_type: null,
  financing_details: '',
  mortgage_eligible: false,
  publication_status: 'borrador',
  commercial_status: 'disponible',
  whatsapp_enabled: true,
  whatsapp_message: '',
}

export async function getAdminListings(): Promise<AdminListing[]> {
  const { data, error } = await requireSupabase()
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as AdminListing[]
}

export async function createListing(input: AdminListingInput): Promise<AdminListing> {
  const { data, error } = await requireSupabase()
    .from('listings')
    .insert(input)
    .select('*')
    .single()

  if (error) throw error
  return data as AdminListing
}

export async function updateListing(id: string, input: AdminListingInput): Promise<AdminListing> {
  const { data, error } = await requireSupabase()
    .from('listings')
    .update(input)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data as AdminListing
}

export async function deleteListing(id: string): Promise<void> {
  const { error } = await requireSupabase().from('listings').delete().eq('id', id)
  if (error) throw error
}

export function toAdminInput(listing: AdminListing): AdminListingInput {
  return {
    type: listing.type ?? 'propiedad',
    title: listing.title ?? '',
    description: listing.description ?? '',
    operation: listing.operation ?? 'venta',
    address: listing.address ?? '',
    neighborhood: listing.neighborhood ?? '',
    city: listing.city ?? '',
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    price: listing.price ?? null,
    price_from: listing.price_from ?? false,
    currency: listing.currency ?? 'USD',
    financing: listing.financing ?? false,
    delivery_date: listing.delivery_date ?? null,
    services: listing.services ?? [],
    surface_m2: listing.surface_m2 ?? null,
    bedrooms: listing.bedrooms ?? null,
    bathrooms: listing.bathrooms ?? null,
    garages: listing.garages ?? null,
    rooms: listing.rooms ?? null,
    property_type: listing.property_type ?? null,
    financing_details: listing.financing_details ?? '',
    mortgage_eligible: listing.mortgage_eligible ?? false,
    publication_status: listing.publication_status ?? 'borrador',
    commercial_status: listing.commercial_status ?? 'disponible',
    whatsapp_enabled: listing.whatsapp_enabled ?? true,
    whatsapp_message: listing.whatsapp_message ?? '',
  }
}

export function toPublicListingType(type: AdminListing['type']): Listing['tipo'] {
  return type === 'terreno' ? 'TERRENO' : type === 'emprendimiento' ? 'EMPRENDIMIENTO' : 'PROPIEDAD'
}

/** Texto plano con todos los campos buscables de la publicación, para filtrar por coincidencia de substring. */
export function adminSearchIndex(listing: AdminListing): string {
  return [
    listing.title,
    listing.description,
    listing.type,
    listing.operation,
    listing.address,
    listing.neighborhood,
    listing.city,
    listing.currency,
    listing.property_type,
    listing.financing_details,
    listing.whatsapp_message,
    listing.publication_status,
    listing.commercial_status,
    listing.delivery_date,
    listing.price != null ? String(listing.price) : undefined,
    listing.latitude != null ? String(listing.latitude) : undefined,
    listing.longitude != null ? String(listing.longitude) : undefined,
    listing.surface_m2 != null ? String(listing.surface_m2) : undefined,
    listing.bedrooms != null ? String(listing.bedrooms) : undefined,
    listing.bathrooms != null ? String(listing.bathrooms) : undefined,
    listing.garages != null ? String(listing.garages) : undefined,
    listing.rooms != null ? String(listing.rooms) : undefined,
    listing.services.join(' '),
  ].filter(Boolean).join(' ').toLowerCase()
}

export function toPreviewListing(listing: AdminListing, typologies: AdminTypology[], images: ListingImage[]): Listing {
  return mapListing({
    ...listing,
    listing_typologies: typologies,
    listing_images: images,
  })
}
