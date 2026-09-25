import { useEffect, useState } from 'react'
import {
  createListingTypology,
  deleteListingTypology,
  EMPTY_TYPOLOGY,
  getAdminListingTypologies,
  updateListingTypology,
  type AdminTypology,
  type AdminTypologyInput,
} from '../../data/adminListingTypologiesApi'
import { TEXTS } from '../../content/texts'

const INPUT_STYLE = { fontFamily: "'Montserrat'", fontSize: '12px', color: '#F5F2EC', backgroundColor: 'rgba(245,242,236,0.04)', border: '1px solid rgba(245,242,236,0.12)', padding: '9px 10px', width: '100%', outline: 'none' }
const LABEL_STYLE = { fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(245,242,236,0.45)', fontWeight: 600, display: 'block', marginBottom: '6px' }
const HINT_STYLE = { fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.35)', marginTop: '5px', display: 'block' }
const BUTTON = { fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: 'none', padding: '8px 10px', cursor: 'pointer' }

function errorMessage(reason: unknown, fallback: string): string {
  if (reason instanceof Error) return reason.message
  if (reason && typeof reason === 'object' && 'message' in reason && typeof (reason as { message?: unknown }).message === 'string') {
    return (reason as { message: string }).message
  }
  return fallback
}

export default function ListingTypologiesEditor({ listingId }: { listingId: string }) {
  const [typologies, setTypologies] = useState<AdminTypology[]>([])
  const [draft, setDraft] = useState<AdminTypologyInput>(EMPTY_TYPOLOGY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getAdminListingTypologies(listingId)
      .then(setTypologies)
      .catch(reason => setError(errorMessage(reason, TEXTS.admin.typologies.loadError)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [listingId])

  const updateDraft = <Key extends keyof AdminTypologyInput>(key: Key, value: AdminTypologyInput[Key]) => {
    setDraft(current => ({ ...current, [key]: value }))
  }

  const startCreate = () => {
    setEditingId(null)
    setDraft(EMPTY_TYPOLOGY)
    setError(null)
  }

  const startEdit = (typology: AdminTypology) => {
    setEditingId(typology.id)
    setDraft({
      name: typology.name,
      description: typology.description,
      surface_m2: typology.surface_m2,
      price: typology.price,
      currency: typology.currency,
      bedrooms: typology.bedrooms,
      bathrooms: typology.bathrooms,
    })
    setError(null)
  }

  const save = async () => {
    if (!draft.name.trim()) {
      setError(TEXTS.admin.typologies.nameRequired)
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (editingId) await updateListingTypology(editingId, draft)
      else await createListingTypology(listingId, draft)
      startCreate()
      load()
    } catch (reason) {
      setError(errorMessage(reason, TEXTS.admin.typologies.saveError))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (typology: AdminTypology) => {
    if (!window.confirm(TEXTS.common.confirmDelete(typology.name))) return
    setError(null)
    try {
      await deleteListingTypology(typology.id)
      if (editingId === typology.id) startCreate()
      load()
    } catch (reason) {
      setError(errorMessage(reason, TEXTS.admin.typologies.deleteError))
    }
  }

  return (
    <section className="lg:col-span-2" style={{ borderTop: '1px solid rgba(245,242,236,0.1)', paddingTop: '22px', marginTop: '4px' }}>
      <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', marginBottom: '12px' }}>{TEXTS.admin.typologies.title}</div>
      {error && <p role="alert" style={{ color: '#F0B0B0', fontSize: '11px', marginBottom: '12px' }}>{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4" style={{ backgroundColor: 'rgba(245,242,236,0.03)', border: '1px solid rgba(245,242,236,0.1)', padding: '16px' }}>
        <label className="col-span-2"><span style={LABEL_STYLE}>{TEXTS.admin.typologies.nameLabel}</span><input value={draft.name} onChange={event => updateDraft('name', event.target.value)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.typologies.nameHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.typologies.surfaceLabel}</span><input type="number" min="0" value={draft.surface_m2 ?? ''} onChange={event => updateDraft('surface_m2', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.typologies.surfaceHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.typologies.bedroomsLabel}</span><input type="number" min="0" value={draft.bedrooms ?? ''} onChange={event => updateDraft('bedrooms', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.typologies.bedroomsHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.typologies.bathroomsLabel}</span><input type="number" min="0" value={draft.bathrooms ?? ''} onChange={event => updateDraft('bathrooms', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.typologies.bathroomsHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.typologies.priceLabel}</span><input type="number" min="0" value={draft.price ?? ''} onChange={event => updateDraft('price', event.target.value ? Number(event.target.value) : null)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.typologies.priceHint}</span></label>
        <label><span style={LABEL_STYLE}>{TEXTS.admin.typologies.currencyLabel}</span><input value={draft.currency} onChange={event => updateDraft('currency', event.target.value.toUpperCase())} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.typologies.currencyHint}</span></label>
        <label className="col-span-2 md:col-span-4"><span style={LABEL_STYLE}>{TEXTS.admin.typologies.descriptionLabel}</span><textarea rows={2} value={draft.description} onChange={event => updateDraft('description', event.target.value)} style={INPUT_STYLE} /><span style={HINT_STYLE}>{TEXTS.admin.typologies.descriptionHint}</span></label>
        <div className="col-span-2 md:col-span-4 flex gap-3">
          <button type="button" disabled={saving} onClick={() => void save()} style={{ ...BUTTON, color: '#0D1B2A', backgroundColor: '#B88E3A', border: '1px solid #B88E3A', cursor: saving ? 'wait' : 'pointer' }}>{saving ? TEXTS.common.saving : editingId ? TEXTS.common.saveChanges : TEXTS.admin.typologies.addButton}</button>
          {editingId && <button type="button" onClick={startCreate} style={{ ...BUTTON, color: 'rgba(245,242,236,0.55)', border: '1px solid rgba(245,242,236,0.15)' }}>{TEXTS.common.cancel}</button>}
        </div>
      </div>

      {loading ? <p style={{ color: 'rgba(245,242,236,0.45)', fontSize: '11px' }}>{TEXTS.admin.typologies.loading}</p> : !typologies.length ? <p style={{ color: 'rgba(245,242,236,0.45)', fontSize: '11px' }}>{TEXTS.admin.typologies.empty}</p> : (
        <div className="flex flex-col gap-2">
          {typologies.map(typology => (
            <article key={typology.id} className="flex flex-col sm:flex-row sm:items-center gap-3" style={{ border: '1px solid rgba(245,242,236,0.1)', padding: '12px 14px' }}>
              <div className="flex-1">
                <div style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: '#F5F2EC' }}>{typology.name}</div>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.4)' }}>{[typology.surface_m2 ? TEXTS.units.squareMeters(typology.surface_m2) : null, typology.bedrooms != null ? TEXTS.units.bedroomsShort(typology.bedrooms) : null, typology.price != null ? `${typology.currency} ${typology.price.toLocaleString('es-AR')}` : null].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(typology)} style={{ ...BUTTON, color: '#DCC8A3', border: '1px solid rgba(220,200,163,0.35)' }}>{TEXTS.common.edit}</button>
                <button type="button" onClick={() => void remove(typology)} style={{ ...BUTTON, color: '#F0B0B0', border: '1px solid rgba(220,100,100,0.35)' }}>{TEXTS.common.delete}</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
