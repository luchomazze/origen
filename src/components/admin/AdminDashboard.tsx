import { TEXTS } from '../../content/texts'
import { useEffect, useState } from 'react'
import { getAdminListings, type AdminListing } from '../../data/adminListingsApi'
import { EMPTY_FILTERS, type AdminListingFilters } from './AdminPublications'

const CARD_STYLE = { backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '24px', textAlign: 'left' as const, cursor: 'pointer', width: '100%' }

export default function AdminDashboard({ onSelectFilter }: { onSelectFilter: (filters: Partial<AdminListingFilters>) => void }) {
  const [listings, setListings] = useState<AdminListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAdminListings()
      .then(setListings)
      .catch(reason => setError(reason instanceof Error ? reason.message : TEXTS.admin.dashboard.loadError))
      .finally(() => setLoading(false))
  }, [])

  const count = (predicate: (listing: AdminListing) => boolean) => listings.filter(predicate).length
  const metrics: { label: string; value: number; note: string; filters: Partial<AdminListingFilters> }[] = [
    { label: TEXTS.admin.dashboard.metricTotal, value: listings.length, note: TEXTS.admin.dashboard.noteListings, filters: EMPTY_FILTERS },
    { label: TEXTS.admin.dashboard.metricPublished, value: count(listing => listing.publication_status === 'publicado'), note: TEXTS.admin.dashboard.noteVisible, filters: { publication_status: 'publicado' } },
    { label: TEXTS.admin.dashboard.metricDrafts, value: count(listing => listing.publication_status === 'borrador'), note: TEXTS.admin.dashboard.notePending, filters: { publication_status: 'borrador' } },
    { label: TEXTS.admin.dashboard.metricProperties, value: count(listing => listing.type === 'propiedad'), note: TEXTS.admin.dashboard.noteInCatalog, filters: { type: 'propiedad' } },
    { label: TEXTS.admin.dashboard.metricLands, value: count(listing => listing.type === 'terreno'), note: TEXTS.admin.dashboard.noteInCatalog, filters: { type: 'terreno' } },
    { label: TEXTS.admin.dashboard.metricProjects, value: count(listing => listing.type === 'emprendimiento'), note: TEXTS.admin.dashboard.noteInCatalog, filters: { type: 'emprendimiento' } },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#F5F2EC', marginBottom: '8px' }}>{TEXTS.admin.dashboard.title}</h1>
      <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.4)', marginBottom: '40px' }}>{TEXTS.admin.dashboard.subtitle}</p>
      {loading && <p style={{ color: 'rgba(245,242,236,0.5)', fontSize: '12px' }}>{TEXTS.admin.dashboard.loading}</p>}
      {error && <p role="alert" style={{ color: '#F0B0B0', fontSize: '12px' }}>{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map(metric => (
            <button key={metric.label} type="button" onClick={() => onSelectFilter(metric.filters)} style={CARD_STYLE}>
              <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', marginBottom: '12px' }}>{metric.label}</div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '36px', color: '#F5F2EC', fontWeight: 600 }}>{metric.value}</div>
              <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: 'rgba(245,242,236,0.3)', marginTop: '4px' }}>{metric.note}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
