import { requireSupabase } from '../lib/supabase'

export interface AdminTypologyInput {
  name: string
  description: string
  surface_m2: number | null
  price: number | null
  currency: string
  bedrooms: number | null
  bathrooms: number | null
}

export type AdminTypology = AdminTypologyInput & { id: string; listing_id: string }

export const EMPTY_TYPOLOGY: AdminTypologyInput = {
  name: '',
  description: '',
  surface_m2: null,
  price: null,
  currency: 'USD',
  bedrooms: null,
  bathrooms: null,
}

export async function getAdminListingTypologies(listingId: string): Promise<AdminTypology[]> {
  const { data, error } = await requireSupabase()
    .from('listing_typologies')
    .select('*')
    .eq('listing_id', listingId)
    .order('created_at')

  if (error) throw error
  return (data ?? []) as AdminTypology[]
}

export async function createListingTypology(listingId: string, input: AdminTypologyInput): Promise<AdminTypology> {
  const { data, error } = await requireSupabase()
    .from('listing_typologies')
    .insert({ ...input, listing_id: listingId })
    .select('*')
    .single()

  if (error) throw error
  return data as AdminTypology
}

export async function updateListingTypology(id: string, input: AdminTypologyInput): Promise<AdminTypology> {
  const { data, error } = await requireSupabase()
    .from('listing_typologies')
    .update(input)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data as AdminTypology
}

export async function deleteListingTypology(id: string): Promise<void> {
  const { error } = await requireSupabase().from('listing_typologies').delete().eq('id', id)
  if (error) throw error
}
