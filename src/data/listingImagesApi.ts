import { requireSupabase } from '../lib/supabase'
import { TEXTS } from '../content/texts'

const BUCKET = 'listing-images'
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  display_order: number
}

function extensionFor(file: File): string {
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return 'jpg'
}

function storagePathFromUrl(imageUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`
  const index = imageUrl.indexOf(marker)
  return index === -1 ? null : decodeURIComponent(imageUrl.slice(index + marker.length).split('?')[0])
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) return TEXTS.admin.images.invalidFileType
  if (file.size > MAX_FILE_SIZE) return TEXTS.admin.images.fileTooLarge
  return null
}

const MAX_DIMENSION = 1920
const COMPRESS_ABOVE_BYTES = 500 * 1024

/** Achica fotos pesadas a WebP de hasta 1920 px para que los carruseles carguen rápido. Si no conviene, devuelve el original. */
async function compressImage(file: File): Promise<File> {
  if (file.size <= COMPRESS_ABOVE_BYTES) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.82))
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' })
  } catch {
    return file
  }
}

export async function getListingImages(listingId: string): Promise<ListingImage[]> {
  const { data, error } = await requireSupabase()
    .from('listing_images')
    .select('id, listing_id, image_url, display_order')
    .eq('listing_id', listingId)
    .order('display_order')

  if (error) throw error
  return (data ?? []) as ListingImage[]
}

export async function uploadListingImage(listingId: string, originalFile: File, displayOrder: number): Promise<ListingImage> {
  const validationError = validateImageFile(originalFile)
  if (validationError) throw new Error(validationError)

  const file = await compressImage(originalFile)

  const client = requireSupabase()
  const path = `${listingId}/${crypto.randomUUID()}.${extensionFor(file)}`
  const { error: uploadError } = await client.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (uploadError) {
    if (uploadError.message.toLowerCase().includes('bucket not found')) {
      throw new Error(TEXTS.admin.images.bucketMissing)
    }
    throw uploadError
  }

  const { data: publicUrl } = client.storage.from(BUCKET).getPublicUrl(path)
  const { data, error } = await client
    .from('listing_images')
    .insert({ listing_id: listingId, image_url: publicUrl.publicUrl, display_order: displayOrder })
    .select('id, listing_id, image_url, display_order')
    .single()

  if (error) {
    await client.storage.from(BUCKET).remove([path])
    throw error
  }
  return data as ListingImage
}

export async function reorderListingImages(images: ListingImage[]): Promise<void> {
  const client = requireSupabase()
  // Temporary high values avoid collisions when the database enforces unique ordering per listing.
  for (const [index, image] of images.entries()) {
    const { error } = await client.from('listing_images').update({ display_order: 1_000_000 + index }).eq('id', image.id)
    if (error) throw error
  }
  for (const [index, image] of images.entries()) {
    const { error } = await client.from('listing_images').update({ display_order: index }).eq('id', image.id)
    if (error) throw error
  }
}

export async function deleteListingImage(image: ListingImage): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('listing_images').delete().eq('id', image.id)
  if (error) throw error

  const path = storagePathFromUrl(image.image_url)
  if (path) {
    const { error: storageError } = await client.storage.from(BUCKET).remove([path])
    if (storageError) console.warn('Image database record deleted, but its storage file could not be removed.', storageError)
  }
}
