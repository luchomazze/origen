import { requireSupabase } from '../lib/supabase'
import { TEXTS } from '../content/texts'
import { EMPTY_LISTING, type AdminListingInput } from './adminListingsApi'
import { uploadListingImage } from './listingImagesApi'

/** Formato que arma el bookmarklet "Importar a ORIGEN" (`utils/zonapropBookmarklet.ts`). */
interface ZonapropExport {
  source: 'zonaprop'
  version: 1
  url: string
  zonapropId: string
  title: string
  postingType: string | null
  propertyType: string | null
  operation: string | null
  currency: string | null
  price: number | null
  reserved: boolean
  expenses: string | null
  neighborhood: string | null
  city: string | null
  address: string | null
  lat: number | null
  lng: number | null
  features: Record<string, { label: string; value: string | null; measure: string | null }>
  generalFeatures: string[]
  description: string
  pictures: string[]
}

/** El bookmarklet abre `/admin#zonaprop=<json>`; el hash no se envía al servidor. */
export const ZONAPROP_IMPORT_HASH = '#zonaprop='

/** Devuelve el JSON que dejó el bookmarklet en el hash, sin modificar la URL. */
export function readZonapropImportFromHash(): string | undefined {
  const { hash } = window.location
  if (!hash.startsWith(ZONAPROP_IMPORT_HASH)) return undefined
  try {
    return decodeURIComponent(hash.slice(ZONAPROP_IMPORT_HASH.length))
  } catch {
    return undefined
  }
}

export interface ZonapropImport {
  zonapropId: string
  input: AdminListingInput
  pictures: string[]
}

/** Características de Zonaprop que tienen columna propia; el resto va al bloque de detalles de la descripción. */
const MAPPED_FEATURES = new Set(['stotal', 'ambiente', 'dormitorio', 'bano', 'cochera'])

const PROPERTY_TYPES: [prefix: string, value: NonNullable<AdminListingInput['property_type']>][] = [
  ['casa', 'casa'], ['departamento', 'departamento'], ['ph', 'ph'], ['local', 'local'],
  ['oficina', 'oficina'], ['campo', 'campo'], ['quinta', 'campo'], ['chacra', 'campo'], ['cabaña', 'cabana'],
]

function toInt(value: string | null | undefined): number | null {
  const parsed = parseInt(value ?? '', 10)
  return Number.isNaN(parsed) ? null : parsed
}

function toNumber(value: string | null | undefined): number | null {
  const parsed = parseFloat((value ?? '').replace(',', '.'))
  return Number.isNaN(parsed) ? null : parsed
}

function listingType(data: ZonapropExport): AdminListingInput['type'] {
  if (data.postingType === 'DEVELOPMENT') return 'emprendimiento'
  const propertyType = (data.propertyType ?? '').toLowerCase()
  return propertyType.includes('terreno') || propertyType.includes('lote') ? 'terreno' : 'propiedad'
}

function propertyType(data: ZonapropExport): AdminListingInput['property_type'] {
  const normalized = (data.propertyType ?? '').toLowerCase()
  if (!normalized) return null
  return PROPERTY_TYPES.find(([prefix]) => normalized.startsWith(prefix))?.[1] ?? 'otro'
}

/** Arma el bloque "Clave: valor, Clave: valor..." con los datos de Zonaprop que no tienen columna. */
function extraDetails(data: ZonapropExport): string {
  const labels = TEXTS.admin.zonapropImport.extraLabels
  const parts: string[] = []
  const expenses = toNumber(data.expenses)
  if (expenses) parts.push(`${labels.expenses}: ${expenses.toLocaleString('es-AR')}`)
  for (const [key, feature] of Object.entries(data.features ?? {})) {
    if (MAPPED_FEATURES.has(key) || !feature.value) continue
    const label = labels.features[key] ?? feature.label
    parts.push(`${label}: ${feature.value}${feature.measure ? ` ${feature.measure}` : ''}`)
  }
  const withValue = data.generalFeatures.filter(item => item.includes(':'))
  const amenities = data.generalFeatures.filter(item => !item.includes(':'))
  parts.push(...withValue)
  if (amenities.length) parts.push(`${labels.amenities}: ${amenities.join(', ')}`)
  return parts.join(', ')
}

export function parseZonapropExport(text: string): ZonapropImport {
  let data: ZonapropExport
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(TEXTS.admin.zonapropImport.invalidData)
  }
  if (data?.source !== 'zonaprop' || data.version !== 1 || !data.zonapropId) throw new Error(TEXTS.admin.zonapropImport.invalidData)

  const type = listingType(data)
  const features = data.features ?? {}
  const surface = features.stotal?.value ?? features.scubierta?.value
  const extras = extraDetails(data)
  const isProperty = type === 'propiedad'

  return {
    zonapropId: String(data.zonapropId),
    pictures: data.pictures ?? [],
    input: {
      ...EMPTY_LISTING,
      services: [],
      type,
      title: data.title?.trim() ?? '',
      description: [data.description?.trim(), extras].filter(Boolean).join('\n\n'),
      operation: (data.operation ?? '').toLowerCase().includes('alquiler') ? 'alquiler' : 'venta',
      address: data.address ?? '',
      neighborhood: data.neighborhood ?? '',
      city: data.city ?? EMPTY_LISTING.city,
      latitude: data.lat != null && data.lng != null ? data.lat : null,
      longitude: data.lat != null && data.lng != null ? data.lng : null,
      price: data.price ?? null,
      currency: data.currency ?? EMPTY_LISTING.currency,
      surface_m2: toNumber(surface),
      rooms: isProperty ? toInt(features.ambiente?.value) : null,
      bedrooms: isProperty ? toInt(features.dormitorio?.value) : null,
      bathrooms: isProperty ? toInt(features.bano?.value) : null,
      garages: isProperty ? toInt(features.cochera?.value) : null,
      property_type: isProperty ? propertyType(data) : null,
      commercial_status: data.reserved ? 'reservado' : 'disponible',
      publication_status: 'borrador',
      zonaprop_id: String(data.zonapropId),
    },
  }
}

function imageTypeFor(url: string): string {
  const extension = url.split('?')[0].split('.').pop()?.toLowerCase()
  if (extension === 'png') return 'image/png'
  if (extension === 'webp') return 'image/webp'
  return 'image/jpeg'
}

async function downloadZonapropImage(url: string): Promise<File> {
  const { data, error } = await requireSupabase().functions.invoke<Blob>('zonaprop-image', { body: { url } })
  if (error) throw error
  if (!(data instanceof Blob)) throw new Error(TEXTS.admin.zonapropImport.imageDownloadFailed)
  const type = imageTypeFor(url)
  const name = url.split('?')[0].split('/').pop() ?? 'zonaprop.jpg'
  return new File([data], name, { type })
}

/** Descarga cada foto vía la Edge Function y la sube con el mismo flujo que el editor de imágenes. */
export async function importZonapropImages(
  listingId: string,
  urls: string[],
  onProgress: (done: number, total: number) => void,
): Promise<{ imported: number; failed: number }> {
  let imported = 0
  let failed = 0
  for (const url of urls) {
    try {
      const file = await downloadZonapropImage(url)
      await uploadListingImage(listingId, file, imported)
      imported++
    } catch (reason) {
      console.warn('Zonaprop image import failed', url, reason)
      failed++
    }
    onProgress(imported + failed, urls.length)
  }
  return { imported, failed }
}
