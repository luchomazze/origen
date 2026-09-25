import { TEXTS } from '../../content/texts'
import { useEffect, useMemo, useState } from 'react'
import {
  createListing,
  deleteListing,
  EMPTY_LISTING,
  getAdminListings,
  toAdminInput,
  adminSearchIndex,
  toPreviewListing,
  updateListing,
  type AdminListing,
  type AdminListingInput,
} from '../../data/adminListingsApi'
import { slugify } from '../../data/listingsApi'
import { ALL_SERVICES, matchesSearchTerms } from '../../data/listings'
import { getAdminListingTypologies, type AdminTypology } from '../../data/adminListingTypologiesApi'
import { getListingImages, type ListingImage } from '../../data/listingImagesApi'
import type { WAConfig } from '../../utils/whatsapp'
import type { Page } from '../../types'
import Detail from '../../pages/Detail'
import ListingImagesEditor from './ListingImagesEditor'
import ListingTypologiesEditor from './ListingTypologiesEditor'

const INPUT_STYLE = { fontFamily: "'Montserrat'", fontSize: '12px', color: '#F5F2EC', backgroundColor: 'rgba(245,242,236,0.04)', border: '1px solid rgba(245,242,236,0.12)', padding: '11px 12px', width: '100%', outline: 'none' }
const OPTION_STYLE = { color: '#F5F2EC', backgroundColor: '#0D1B2A' }
const LABEL_STYLE = { fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(245,242,236,0.45)', fontWeight: 600, display: 'block', marginBottom: '7px' }
const HINT_STYLE = { fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.35)', marginTop: '5px', display: 'block' }

const DETAIL_PAGE: Record<AdminListingInput['type'], Page> = {
  propiedad: 'property-detail',
  terreno: 'land-detail',
  emprendimiento: 'project-detail',
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  casa: TEXTS.propertyTypes.CASA, departamento: TEXTS.propertyTypes.DEPARTAMENTO, ph: TEXTS.propertyTypes.PH, local: TEXTS.propertyTypes.LOCAL,
  oficina: TEXTS.propertyTypes.OFICINA, campo: TEXTS.propertyTypes.CAMPO, cabana: TEXTS.propertyTypes.CABAÑA, otro: TEXTS.propertyTypes.OTRO,
}

export interface AdminListingFilters {
  search: string
  type: '' | AdminListingInput['type']
  operation: '' | AdminListingInput['operation']
  publication_status: '' | AdminListingInput['publication_status']
  commercial_status: '' | AdminListingInput['commercial_status']
  city: string
  neighborhood: string
  property_type: string
  service: string
  price_from: 'todos' | 'si' | 'no'
  financing: 'todos' | 'si' | 'no'
  mortgage_eligible: 'todos' | 'si' | 'no'
}

export const EMPTY_FILTERS: AdminListingFilters = {
  search: '', type: '', operation: '', publication_status: '', commercial_status: '',
  city: '', neighborhood: '', property_type: '', service: '',
  price_from: 'todos', financing: 'todos', mortgage_eligible: 'todos',
}

function matchesFilters(listing: AdminListing, filters: AdminListingFilters): boolean {
  if (filters.search.trim() && !matchesSearchTerms(adminSearchIndex(listing), filters.search)) return false
  if (filters.type && listing.type !== filters.type) return false
  if (filters.operation && listing.operation !== filters.operation) return false
  if (filters.publication_status && listing.publication_status !== filters.publication_status) return false
  if (filters.commercial_status && listing.commercial_status !== filters.commercial_status) return false
  if (filters.city && listing.city !== filters.city) return false
  if (filters.neighborhood && listing.neighborhood !== filters.neighborhood) return false
  if (filters.property_type && listing.property_type !== filters.property_type) return false
  if (filters.service && !listing.services.includes(filters.service)) return false
  if (filters.price_from === 'si' && !listing.price_from) return false
  if (filters.price_from === 'no' && listing.price_from) return false
  if (filters.financing === 'si' && !listing.financing) return false
  if (filters.financing === 'no' && listing.financing) return false
  if (filters.mortgage_eligible === 'si' && !listing.mortgage_eligible) return false
  if (filters.mortgage_eligible === 'no' && listing.mortgage_eligible) return false
  return true
}

function emptyInput(): AdminListingInput {
  return { ...EMPTY_LISTING, services: [] }
}

function validate(draft: AdminListingInput): string | null {
  if (!draft.title.trim()) return TEXTS.admin.publications.validation.titleRequired
  if (!slugify(draft.title)) return TEXTS.admin.publications.validation.titleNeedsLetterOrNumber
  if (!draft.city.trim()) return TEXTS.admin.publications.validation.cityRequired
  if (draft.price != null && draft.price < 0) return TEXTS.admin.publications.validation.priceNegative
  if (draft.currency && (draft.currency.length < 3 || draft.currency.length > 4)) return TEXTS.admin.publications.validation.currencyLength
  if (draft.price_from && draft.price == null) return TEXTS.admin.publications.validation.priceFromWithoutPrice
  if ((draft.latitude == null) !== (draft.longitude == null)) return TEXTS.admin.publications.validation.coordinatesTogether
  if (draft.latitude != null && (draft.latitude < -90 || draft.latitude > 90)) return TEXTS.admin.publications.validation.latitudeRange
  if (draft.longitude != null && (draft.longitude < -180 || draft.longitude > 180)) return TEXTS.admin.publications.validation.longitudeRange
  if (draft.surface_m2 != null && draft.surface_m2 < 0) return TEXTS.admin.publications.validation.surfaceNegative
  if (draft.bedrooms != null && draft.bedrooms < 0) return TEXTS.admin.publications.validation.bedroomsNegative
  if (draft.bathrooms != null && draft.bathrooms < 0) return TEXTS.admin.publications.validation.bathroomsNegative
  if (draft.garages != null && draft.garages < 0) return TEXTS.admin.publications.validation.garagesNegative
  if (draft.rooms != null && draft.rooms < 0) return TEXTS.admin.publications.validation.roomsNegative
  return null
}

function errorMessage(reason: unknown, fallback: string): string {
  if (reason instanceof Error) return reason.message
  if (reason && typeof reason === 'object' && 'message' in reason && typeof (reason as { message?: unknown }).message === 'string') {
    return (reason as { message: string }).message
  }
  return fallback
}

export default function AdminPublications({ waConfig, navigate, initialFilters }: { waConfig: WAConfig; navigate: (to: Page, slug?: string) => void; initialFilters?: Partial<AdminListingFilters> }) {
  const [listings, setListings] = useState<AdminListing[]>([])
  const [draft, setDraft] = useState<AdminListingInput>(emptyInput)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<{ listing: AdminListing; typologies: AdminTypology[]; images: ListingImage[] } | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [hasTypologies, setHasTypologies] = useState(false)
  const [filters, setFilters] = useState<AdminListingFilters>({ ...EMPTY_FILTERS, ...initialFilters })
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [formOpen, setFormOpen] = useState(false)

  const previewListing = useMemo(
    () => previewData && toPreviewListing(previewData.listing, previewData.typologies, previewData.images),
    [previewData],
  )

  const updateFilter = <Key extends keyof AdminListingFilters>(key: Key, value: AdminListingFilters[Key]) => {
    setFilters(current => ({ ...current, [key]: value }))
  }

  const cities = useMemo(() => Array.from(new Set(listings.map(l => l.city).filter(Boolean))).sort(), [listings])
  const neighborhoods = useMemo(() => Array.from(new Set(listings.map(l => l.neighborhood).filter(Boolean))).sort(), [listings])
  const propertyTypesPresent = useMemo(() => Array.from(new Set(listings.map(l => l.property_type).filter(Boolean))) as string[], [listings])
  const servicesPresent = useMemo(() => Array.from(new Set(listings.flatMap(l => l.services))).sort(), [listings])
  const filteredListings = useMemo(() => listings.filter(l => matchesFilters(l, filters)), [listings, filters])
  const activeFilterCount = Object.entries(filters).filter(([key, value]) =>
    key === 'price_from' || key === 'financing' || key === 'mortgage_eligible' ? value !== 'todos' : value !== ''
  ).length

  const openPreview = async (listing: AdminListing) => {
    setPreviewLoading(true)
    setError(null)
    try {
      const [typologies, images] = await Promise.all([
        getAdminListingTypologies(listing.id),
        getListingImages(listing.id),
      ])
      setPreviewData({ listing, typologies, images })
    } catch (reason) {
      setError(errorMessage(reason, TEXTS.admin.publications.errors.previewLoad))
    } finally {
      setPreviewLoading(false)
    }
  }

  const load = () => {
    setLoading(true)
    getAdminListings()
      .then(setListings)
      .catch(reason => setError(reason instanceof Error ? reason.message : TEXTS.admin.publications.errors.listLoad))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const updateDraft = <Key extends keyof AdminListingInput>(key: Key, value: AdminListingInput[Key]) => {
    setDraft(current => ({ ...current, [key]: value }))
  }

  const toggleService = (service: string) => {
    setDraft(current => ({
      ...current,
      services: current.services.includes(service)
        ? current.services.filter(s => s !== service)
        : [...current.services, service],
    }))
  }

  const startCreate = () => {
    setEditingId(null)
    setDraft(emptyInput())
    setError(null)
    setNotice(null)
    setHasTypologies(false)
  }

  const startEdit = async (listing: AdminListing) => {
    setEditingId(listing.id)
    setDraft(toAdminInput(listing))
    setError(null)
    setNotice(null)
    setHasTypologies(false)
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    try {
      const typologies = await getAdminListingTypologies(listing.id)
      setHasTypologies(typologies.length > 0)
    } catch {
      // si falla la consulta, se deja destildado y el admin puede tildarlo a mano
    }
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    const validationError = validate(draft)
    if (validationError) {
      setError(validationError)
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (editingId) await updateListing(editingId, draft)
      else {
        const created = await createListing(draft)
        setEditingId(created.id)
      }
      setNotice(editingId ? TEXTS.admin.publications.notices.updated : TEXTS.admin.publications.notices.created)
      load()
    } catch (reason) {
      setError(errorMessage(reason, TEXTS.admin.publications.errors.save))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (listing: AdminListing) => {
    if (!window.confirm(TEXTS.common.confirmDelete(listing.title))) return
    setError(null)
    try {
      await deleteListing(listing.id)
      setNotice(TEXTS.admin.publications.notices.deleted)
      if (editingId === listing.id) { startCreate(); setFormOpen(false) }
      load()
    } catch (reason) {
      setError(errorMessage(reason, TEXTS.admin.publications.errors.delete))
    }
  }

  const editingListing = editingId ? listings.find(l => l.id === editingId) : undefined

  const setPublicationStatus = async (listing: AdminListing, publication_status: AdminListingInput['publication_status']) => {
    try {
      await updateListing(listing.id, { ...toAdminInput(listing), publication_status })
      setNotice(TEXTS.admin.publications.notices.statusUpdated)
      load()
    } catch (reason) {
      setError(errorMessage(reason, TEXTS.admin.publications.errors.statusUpdate))
    }
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#F5F2EC', marginBottom: '6px' }}>{TEXTS.admin.publications.title}</h1>
          <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.4)' }}>{TEXTS.admin.publications.subtitle}</p>
        </div>
        {!formOpen && <button onClick={() => { startCreate(); setFormOpen(true) }} style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0D1B2A', backgroundColor: '#B88E3A', border: '1px solid #B88E3A', padding: '12px 18px', cursor: 'pointer' }}>{TEXTS.admin.publications.newButton}</button>}
      </div>

      {error && <div role="alert" className="mb-5" style={{ color: '#F0B0B0', border: '1px solid rgba(220,100,100,0.35)', padding: '12px 14px', fontFamily: "'Montserrat'", fontSize: '11px' }}>{error}</div>}
      {notice && <div className="mb-5" style={{ color: '#DCC8A3', border: '1px solid rgba(184,142,58,0.3)', padding: '12px 14px', fontFamily: "'Montserrat'", fontSize: '11px' }}>{notice}</div>}

      {!formOpen && (
        <button type="button" onClick={() => setFormOpen(true)} className="w-full flex items-center justify-between mb-10" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '18px 24px', cursor: 'pointer' }}>
          <span style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A' }}>{editingId ? TEXTS.admin.publications.editTitle : TEXTS.admin.publications.newCollapsedButton}</span>
          <span style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.4)' }}>{TEXTS.common.show}</span>
        </button>
      )}

      {formOpen && (
      <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '24px' }}>
        <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A' }}>{editingId ? TEXTS.admin.publications.editTitle : TEXTS.admin.publications.newTitle}</div>
          <div className="flex flex-wrap items-center gap-2">
            {editingListing && (
              <>
                <button type="button" onClick={() => void openPreview(editingListing)} disabled={previewLoading} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F5F2EC', background: 'none', border: '1px solid rgba(245,242,236,0.25)', padding: '8px 10px', cursor: previewLoading ? 'wait' : 'pointer' }}>{TEXTS.admin.publications.previewButton}</button>
                {editingListing.publication_status === 'publicado' && <button type="button" onClick={() => navigate(DETAIL_PAGE[editingListing.type], `${slugify(editingListing.title)}-${editingListing.id}`)} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DCC8A3', background: 'none', border: '1px solid rgba(220,200,163,0.35)', padding: '8px 10px', cursor: 'pointer' }}>{TEXTS.admin.publications.viewOnSiteButton}</button>}
                {editingListing.publication_status !== 'publicado' && <button type="button" onClick={() => void setPublicationStatus(editingListing, 'publicado')} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B88E3A', background: 'none', border: '1px solid rgba(184,142,58,0.4)', padding: '8px 10px', cursor: 'pointer' }}>{TEXTS.admin.publications.publishButton}</button>}
                {editingListing.publication_status === 'publicado' && <button type="button" onClick={() => void setPublicationStatus(editingListing, 'pausado')} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.6)', background: 'none', border: '1px solid rgba(245,242,236,0.18)', padding: '8px 10px', cursor: 'pointer' }}>{TEXTS.admin.publications.pauseButton}</button>}
                <button type="button" onClick={() => void remove(editingListing)} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F0B0B0', background: 'none', border: '1px solid rgba(220,100,100,0.35)', padding: '8px 10px', cursor: 'pointer' }}>{TEXTS.common.delete}</button>
              </>
            )}
            <button type="button" onClick={() => setFormOpen(false)} style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>{TEXTS.common.hide}</button>
          </div>
        </div>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.title}</span><input required value={draft.title} onChange={event => updateDraft('title', event.target.value)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.titleHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.type}</span><select value={draft.type} onChange={event => updateDraft('type', event.target.value as AdminListingInput['type'])} style={INPUT_STYLE}><option value="propiedad" style={OPTION_STYLE}>{TEXTS.listingTypes.property}</option><option value="terreno" style={OPTION_STYLE}>{TEXTS.listingTypes.land}</option><option value="emprendimiento" style={OPTION_STYLE}>{TEXTS.listingTypes.project}</option></select><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.typeHint}</span></label>
        <label className="lg:col-span-2"><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.description}</span><textarea rows={3} value={draft.description} onChange={event => updateDraft('description', event.target.value)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.descriptionHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.operation}</span><select value={draft.operation} onChange={event => updateDraft('operation', event.target.value as AdminListingInput['operation'])} style={INPUT_STYLE}><option value="venta" style={OPTION_STYLE}>{TEXTS.operations.sale}</option><option value="alquiler" style={OPTION_STYLE}>{TEXTS.operations.rent}</option></select><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.operationHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.publicationStatus}</span><select value={draft.publication_status} onChange={event => updateDraft('publication_status', event.target.value as AdminListingInput['publication_status'])} style={INPUT_STYLE}><option value="borrador" style={OPTION_STYLE}>{TEXTS.publicationStatus.draft}</option><option value="publicado" style={OPTION_STYLE}>{TEXTS.publicationStatus.published}</option><option value="pausado" style={OPTION_STYLE}>{TEXTS.publicationStatus.paused}</option></select><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.publicationStatusHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.commercialStatus}</span><select value={draft.commercial_status} onChange={event => updateDraft('commercial_status', event.target.value as AdminListingInput['commercial_status'])} style={INPUT_STYLE}><option value="disponible" style={OPTION_STYLE}>{TEXTS.commercialStatus.available}</option><option value="reservado" style={OPTION_STYLE}>{TEXTS.commercialStatus.reserved}</option><option value="en_negociacion" style={OPTION_STYLE}>{TEXTS.commercialStatus.inNegotiation}</option><option value="vendido" style={OPTION_STYLE}>{TEXTS.commercialStatus.sold}</option><option value="alquilado" style={OPTION_STYLE}>{TEXTS.commercialStatus.rented}</option></select><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.commercialStatusHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.price}</span><input type="number" min="0" value={draft.price ?? ''} onChange={event => updateDraft('price', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.priceHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.currency}</span><input value={draft.currency} onChange={event => updateDraft('currency', event.target.value.toUpperCase())} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.currencyHint}</span></label>
        <label className="flex flex-col" style={{ alignSelf: 'end', color: '#F5F2EC', fontSize: '12px' }}><span className="flex items-center gap-3"><input type="checkbox" checked={draft.price_from} onChange={event => updateDraft('price_from', event.target.checked)} /> {TEXTS.admin.publications.fields.priceFrom}</span><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.priceFromHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.city}</span><input value={draft.city} onChange={event => updateDraft('city', event.target.value)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.cityHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.neighborhood}</span><input value={draft.neighborhood} onChange={event => updateDraft('neighborhood', event.target.value)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.neighborhoodHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.address}</span><input value={draft.address} onChange={event => updateDraft('address', event.target.value)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.addressHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.latitude}</span><input type="number" step="any" min="-90" max="90" value={draft.latitude ?? ''} onChange={event => updateDraft('latitude', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.latitudeHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.longitude}</span><input type="number" step="any" min="-180" max="180" value={draft.longitude ?? ''} onChange={event => updateDraft('longitude', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.longitudeHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.deliveryDate}</span><input type="date" value={draft.delivery_date ?? ''} onChange={event => updateDraft('delivery_date', event.target.value || null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.deliveryDateHint}</span></label>
        <label className="flex flex-col" style={{ alignSelf: 'end', color: '#F5F2EC', fontSize: '12px' }}><span className="flex items-center gap-3"><input type="checkbox" checked={draft.financing} onChange={event => updateDraft('financing', event.target.checked)} /> {TEXTS.admin.publications.fields.financing}</span><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.financingHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.surface}</span><input type="number" min="0" value={draft.surface_m2 ?? ''} onChange={event => updateDraft('surface_m2', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.surfaceHint}</span></label>
        {draft.type === 'propiedad' && (
          <>
            <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.propertyType}</span><select value={draft.property_type ?? ''} onChange={event => updateDraft('property_type', (event.target.value || null) as AdminListingInput['property_type'])} style={INPUT_STYLE}><option value="" style={OPTION_STYLE}>{TEXTS.admin.publications.fields.propertyTypeUnspecified}</option><option value="casa" style={OPTION_STYLE}>{TEXTS.propertyTypes.CASA}</option><option value="departamento" style={OPTION_STYLE}>{TEXTS.propertyTypes.DEPARTAMENTO}</option><option value="ph" style={OPTION_STYLE}>{TEXTS.propertyTypes.PH}</option><option value="local" style={OPTION_STYLE}>{TEXTS.propertyTypes.LOCAL}</option><option value="oficina" style={OPTION_STYLE}>{TEXTS.propertyTypes.OFICINA}</option><option value="campo" style={OPTION_STYLE}>{TEXTS.propertyTypes.CAMPO}</option><option value="cabana" style={OPTION_STYLE}>{TEXTS.propertyTypes.CABAÑA}</option><option value="otro" style={OPTION_STYLE}>{TEXTS.propertyTypes.OTRO}</option></select><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.propertyTypeHint}</span></label>
            <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.rooms}</span><input type="number" min="0" value={draft.rooms ?? ''} onChange={event => updateDraft('rooms', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.roomsHint}</span></label>
            <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.bedrooms}</span><input type="number" min="0" value={draft.bedrooms ?? ''} onChange={event => updateDraft('bedrooms', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.bedroomsHint}</span></label>
            <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.bathrooms}</span><input type="number" min="0" value={draft.bathrooms ?? ''} onChange={event => updateDraft('bathrooms', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.bathroomsHint}</span></label>
            <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.garages}</span><input type="number" min="0" value={draft.garages ?? ''} onChange={event => updateDraft('garages', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.garagesHint}</span></label>
            <label className="flex flex-col" style={{ alignSelf: 'end', color: '#F5F2EC', fontSize: '12px' }}><span className="flex items-center gap-3"><input type="checkbox" checked={draft.mortgage_eligible} onChange={event => updateDraft('mortgage_eligible', event.target.checked)} /> {TEXTS.admin.publications.fields.mortgageEligible}</span><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.mortgageEligibleHint}</span></label>
          </>
        )}
        <label className="lg:col-span-2"><span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.financingDetails}</span><input value={draft.financing_details} onChange={event => updateDraft('financing_details', event.target.value)} style={INPUT_STYLE} placeholder={TEXTS.admin.publications.fields.financingDetailsPlaceholder} /><span style={HINT_STYLE}>{TEXTS.admin.publications.fields.financingDetailsHint}</span></label>
        <div className="lg:col-span-2">
          <span style={LABEL_STYLE}>{TEXTS.admin.publications.fields.services}</span>
          <div className="flex flex-wrap gap-2">
            {ALL_SERVICES.map(service => (
              <label key={service} className="flex items-center gap-2" style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#F5F2EC', border: '1px solid rgba(245,242,236,0.15)', padding: '7px 10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={draft.services.includes(service)} onChange={() => toggleService(service)} /> {service}
              </label>
            ))}
          </div>
          <span style={{ ...HINT_STYLE, marginTop: '8px' }}>{TEXTS.admin.publications.fields.servicesHint}</span>
        </div>
        {!editingId && <div className="lg:col-span-2 flex gap-3"><button type="submit" disabled={saving} style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0D1B2A', backgroundColor: '#B88E3A', border: '1px solid #B88E3A', padding: '12px 18px', cursor: saving ? 'wait' : 'pointer' }}>{saving ? TEXTS.common.saving : TEXTS.admin.publications.createButton}</button></div>}
        {editingId && (
          <div className="lg:col-span-2 flex gap-3" style={{ borderTop: '1px solid rgba(245,242,236,0.1)', paddingTop: '20px' }}>
            <button type="submit" disabled={saving} style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0D1B2A', backgroundColor: '#B88E3A', border: '1px solid #B88E3A', padding: '12px 18px', cursor: saving ? 'wait' : 'pointer' }}>{saving ? TEXTS.common.saving : TEXTS.admin.publications.applyChangesButton}</button>
            <button type="button" onClick={() => { startCreate(); setFormOpen(false) }} style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.55)', background: 'none', border: '1px solid rgba(245,242,236,0.15)', padding: '12px 18px', cursor: 'pointer' }}>{TEXTS.common.cancel}</button>
          </div>
        )}
        {editingId && (
          <label className="lg:col-span-2 flex items-center gap-3" style={{ borderTop: '1px solid rgba(245,242,236,0.1)', paddingTop: '20px', color: '#F5F2EC', fontSize: '12px' }}>
            <input type="checkbox" checked={hasTypologies} onChange={event => setHasTypologies(event.target.checked)} /> {TEXTS.admin.publications.hasTypologiesCheckbox}
          </label>
        )}
        {editingId && hasTypologies && <ListingTypologiesEditor listingId={editingId} />}
        {editingId && <ListingImagesEditor listingId={editingId} />}
        {!editingId && <p className="lg:col-span-2" style={{ color: 'rgba(245,242,236,0.45)', fontSize: '11px', borderTop: '1px solid rgba(245,242,236,0.1)', paddingTop: '20px' }}>{TEXTS.admin.publications.saveBeforeImagesHint}</p>}
        {editingId && (
          <div className="lg:col-span-2 flex gap-3" style={{ borderTop: '1px solid rgba(245,242,236,0.1)', paddingTop: '20px' }}>
            <button type="submit" disabled={saving} style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0D1B2A', backgroundColor: '#B88E3A', border: '1px solid #B88E3A', padding: '12px 18px', cursor: saving ? 'wait' : 'pointer' }}>{saving ? TEXTS.common.saving : TEXTS.common.saveChanges}</button>
            <button type="button" onClick={() => { startCreate(); setFormOpen(false) }} style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.55)', background: 'none', border: '1px solid rgba(245,242,236,0.15)', padding: '12px 18px', cursor: 'pointer' }}>{TEXTS.common.cancel}</button>
          </div>
        )}
      </form>
      )}

      <div className="mb-5" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)' }}>
        <button type="button" onClick={() => setFiltersOpen(open => !open)} className="w-full flex items-center justify-between" style={{ padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <span style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B88E3A' }}>{TEXTS.admin.publications.filters.title}{TEXTS.admin.publications.filters.activeCountSuffix(activeFilterCount)}</span>
          <span style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.4)' }}>{filtersOpen ? TEXTS.common.hide : TEXTS.common.show}</span>
        </button>
        {filtersOpen && (
          <div style={{ padding: '0 18px 18px' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <label className="col-span-2"><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.search}</span><input value={filters.search} onChange={event => updateFilter('search', event.target.value)} placeholder={TEXTS.admin.publications.filters.searchPlaceholder} style={INPUT_STYLE} /></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.type}</span><select value={filters.type} onChange={event => updateFilter('type', event.target.value as AdminListingFilters['type'])} style={INPUT_STYLE}><option value="" style={OPTION_STYLE}>{TEXTS.common.all}</option><option value="propiedad" style={OPTION_STYLE}>{TEXTS.listingTypes.property}</option><option value="terreno" style={OPTION_STYLE}>{TEXTS.listingTypes.land}</option><option value="emprendimiento" style={OPTION_STYLE}>{TEXTS.listingTypes.project}</option></select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.operation}</span><select value={filters.operation} onChange={event => updateFilter('operation', event.target.value as AdminListingFilters['operation'])} style={INPUT_STYLE}><option value="" style={OPTION_STYLE}>{TEXTS.common.allFeminine}</option><option value="venta" style={OPTION_STYLE}>{TEXTS.operations.sale}</option><option value="alquiler" style={OPTION_STYLE}>{TEXTS.operations.rent}</option></select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.publicationStatus}</span><select value={filters.publication_status} onChange={event => updateFilter('publication_status', event.target.value as AdminListingFilters['publication_status'])} style={INPUT_STYLE}><option value="" style={OPTION_STYLE}>{TEXTS.common.all}</option><option value="borrador" style={OPTION_STYLE}>{TEXTS.publicationStatus.draft}</option><option value="publicado" style={OPTION_STYLE}>{TEXTS.publicationStatus.published}</option><option value="pausado" style={OPTION_STYLE}>{TEXTS.publicationStatus.paused}</option></select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.commercialStatus}</span><select value={filters.commercial_status} onChange={event => updateFilter('commercial_status', event.target.value as AdminListingFilters['commercial_status'])} style={INPUT_STYLE}><option value="" style={OPTION_STYLE}>{TEXTS.common.all}</option><option value="disponible" style={OPTION_STYLE}>{TEXTS.commercialStatus.available}</option><option value="reservado" style={OPTION_STYLE}>{TEXTS.commercialStatus.reserved}</option><option value="en_negociacion" style={OPTION_STYLE}>{TEXTS.commercialStatus.inNegotiation}</option><option value="vendido" style={OPTION_STYLE}>{TEXTS.commercialStatus.sold}</option><option value="alquilado" style={OPTION_STYLE}>{TEXTS.commercialStatus.rented}</option></select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.city}</span><select value={filters.city} onChange={event => updateFilter('city', event.target.value)} style={INPUT_STYLE}><option value="" style={OPTION_STYLE}>{TEXTS.common.allFeminine}</option>{cities.map(city => <option key={city} value={city} style={OPTION_STYLE}>{city}</option>)}</select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.neighborhood}</span><select value={filters.neighborhood} onChange={event => updateFilter('neighborhood', event.target.value)} style={INPUT_STYLE}><option value="" style={OPTION_STYLE}>{TEXTS.common.all}</option>{neighborhoods.map(n => <option key={n} value={n} style={OPTION_STYLE}>{n}</option>)}</select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.propertyType}</span><select value={filters.property_type} onChange={event => updateFilter('property_type', event.target.value)} style={INPUT_STYLE}><option value="" style={OPTION_STYLE}>{TEXTS.common.all}</option>{propertyTypesPresent.map(p => <option key={p} value={p} style={OPTION_STYLE}>{PROPERTY_TYPE_LABELS[p] ?? p}</option>)}</select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.service}</span><select value={filters.service} onChange={event => updateFilter('service', event.target.value)} style={INPUT_STYLE}><option value="" style={OPTION_STYLE}>{TEXTS.common.all}</option>{servicesPresent.map(s => <option key={s} value={s} style={OPTION_STYLE}>{s}</option>)}</select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.priceFrom}</span><select value={filters.price_from} onChange={event => updateFilter('price_from', event.target.value as AdminListingFilters['price_from'])} style={INPUT_STYLE}><option value="todos" style={OPTION_STYLE}>{TEXTS.common.all}</option><option value="si" style={OPTION_STYLE}>{TEXTS.common.yes}</option><option value="no" style={OPTION_STYLE}>{TEXTS.common.no}</option></select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.financing}</span><select value={filters.financing} onChange={event => updateFilter('financing', event.target.value as AdminListingFilters['financing'])} style={INPUT_STYLE}><option value="todos" style={OPTION_STYLE}>{TEXTS.common.all}</option><option value="si" style={OPTION_STYLE}>{TEXTS.common.yes}</option><option value="no" style={OPTION_STYLE}>{TEXTS.common.no}</option></select></label>
              <label><span style={LABEL_STYLE}>{TEXTS.admin.publications.filters.mortgageEligible}</span><select value={filters.mortgage_eligible} onChange={event => updateFilter('mortgage_eligible', event.target.value as AdminListingFilters['mortgage_eligible'])} style={INPUT_STYLE}><option value="todos" style={OPTION_STYLE}>{TEXTS.common.all}</option><option value="si" style={OPTION_STYLE}>{TEXTS.common.yes}</option><option value="no" style={OPTION_STYLE}>{TEXTS.common.no}</option></select></label>
            </div>
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.55)', background: 'none', border: '1px solid rgba(245,242,236,0.15)', padding: '10px 16px', cursor: 'pointer' }}>{TEXTS.admin.publications.filters.clearButton}</button>
          </div>
        )}
      </div>

      <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: 'rgba(245,242,236,0.4)', marginBottom: '14px' }}>{TEXTS.admin.publications.resultsCount(filteredListings.length, listings.length)}</div>

      {loading ? <p style={{ color: 'rgba(245,242,236,0.5)', fontSize: '12px' }}>{TEXTS.admin.publications.loading}</p> : (
        <div className="flex flex-col gap-3">
          {filteredListings.map(listing => (
            <article key={listing.id} className="flex flex-col lg:flex-row lg:items-center gap-4" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '18px 20px' }}>
              <div className="flex-1"><div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '17px', color: '#F5F2EC', marginBottom: '5px' }}>{listing.title}</div><div style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.4)' }}>{listing.type} · {listing.neighborhood || listing.city || TEXTS.admin.publications.noLocation} · {listing.publication_status}</div></div>
              <div className="flex flex-wrap gap-2"><button onClick={() => void openPreview(listing)} disabled={previewLoading} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F5F2EC', background: 'none', border: '1px solid rgba(245,242,236,0.25)', padding: '8px 10px', cursor: previewLoading ? 'wait' : 'pointer' }}>{TEXTS.admin.publications.previewButton}</button><button onClick={() => void startEdit(listing)} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DCC8A3', background: 'none', border: '1px solid rgba(220,200,163,0.35)', padding: '8px 10px', cursor: 'pointer' }}>{TEXTS.common.edit}</button>{listing.publication_status !== 'publicado' && <button onClick={() => void setPublicationStatus(listing, 'publicado')} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B88E3A', background: 'none', border: '1px solid rgba(184,142,58,0.4)', padding: '8px 10px', cursor: 'pointer' }}>{TEXTS.admin.publications.publishButton}</button>}{listing.publication_status === 'publicado' && <button onClick={() => void setPublicationStatus(listing, 'pausado')} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.6)', background: 'none', border: '1px solid rgba(245,242,236,0.18)', padding: '8px 10px', cursor: 'pointer' }}>{TEXTS.admin.publications.pauseButton}</button>}<button onClick={() => void remove(listing)} style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F0B0B0', background: 'none', border: '1px solid rgba(220,100,100,0.35)', padding: '8px 10px', cursor: 'pointer' }}>{TEXTS.common.delete}</button></div>
            </article>
          ))}
          {!filteredListings.length && <p style={{ color: 'rgba(245,242,236,0.5)', fontSize: '12px' }}>{listings.length ? TEXTS.admin.publications.noMatches : TEXTS.admin.publications.emptyCatalog}</p>}
        </div>
      )}

      {previewListing && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'rgba(8,15,24,0.82)' }} role="dialog" aria-modal="true" aria-label={TEXTS.admin.publications.previewDialogLabel}>
          <div className="flex items-center justify-between p-5" style={{ backgroundColor: '#0D1B2A', color: '#F5F2EC', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A' }}>{TEXTS.admin.publications.previewHeader(previewData?.listing.publication_status ?? '')}</div>
            <button onClick={() => setPreviewData(null)} aria-label={TEXTS.admin.publications.closePreview} style={{ color: '#F5F2EC', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
          </div>
          <div className="flex-1 overflow-auto">
            <Detail
              slug=""
              tipo={previewListing.tipo}
              previewListing={previewListing}
              navigate={() => {}}
              waConfig={waConfig}
              onConfigSave={async () => {}}
            />
          </div>
        </div>
      )}
    </div>
  )
}
