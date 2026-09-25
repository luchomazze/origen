import { useEffect, useRef, useState } from 'react'
import LandCard from '../components/LandCard'
import { ALL_SERVICES, matchesSearchTerms, searchIndex } from '../data/listings'
import { usePublicListings } from '../hooks/usePublicListings'
import { usePageMeta } from '../hooks/usePageMeta'
import { buildPath } from '../utils/routing'
import type { NavProps } from '../types'
import { buildWAMessageUrl } from '../utils/whatsapp'
import { TEXTS } from '../content/texts'

export default function Lands({ navigate, waConfig }: NavProps) {
  const { listings, loading, error } = usePublicListings('TERRENO')
  usePageMeta({ title: `${TEXTS.lands.title} | ORIGEN`, description: TEXTS.lands.subtitle, path: buildPath('lands') })
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [ubicacion, setUbicacion] = useState(TEXTS.common.allFeminine)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (filtersOpen) filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [filtersOpen])
  const ubicaciones = [TEXTS.common.allFeminine, ...Array.from(new Set(listings.map(l => l.barrio).filter(Boolean) as string[]))]
  const serviciosDisponibles = ALL_SERVICES.filter(s => listings.some(l => l.services?.includes(s)))

  const toggleService = (s: string) =>
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const filtered = listings.filter(l => {
    if (search.trim() && !matchesSearchTerms(searchIndex(l), search)) return false
    if (ubicacion !== TEXTS.common.allFeminine && l.barrio !== ubicacion) return false
    if (selectedServices.length > 0) {
      if (!l.services) return false
      if (!selectedServices.every(s => l.services!.includes(s))) return false
    }
    return true
  })

  const activeCount = [search.trim() !== '', ubicacion !== TEXTS.common.allFeminine, selectedServices.length > 0].filter(Boolean).length

  const filterStyle = (active: boolean) => ({
    fontFamily: "'Montserrat'",
    fontSize: '9px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    color: active ? '#F5F2EC' : '#5C636B',
    backgroundColor: active ? '#B88E3A' : 'transparent',
    border: `1px solid ${active ? '#B88E3A' : 'rgba(13,27,42,0.15)'}`,
    padding: '9px 18px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  const groupLabelStyle = { fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(13,27,42,0.4)' }

  const ctaUrl = buildWAMessageUrl(waConfig, TEXTS.lands.whatsappInquiryMessage)

  return (
    <main style={{ paddingTop: '80px', backgroundColor: '#F5F2EC', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#0D1B2A', padding: '72px 0' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '14px' }}>
            {TEXTS.catalog.eyebrow}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, color: '#F5F2EC', marginBottom: '14px' }}>
            {TEXTS.lands.title}
          </h1>
          <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: 'rgba(245,242,236,0.55)', lineHeight: 1.7 }}>
            {TEXTS.lands.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div ref={filtersRef} className="mb-10" style={{ backgroundColor: '#F5F2EC', border: '1px solid rgba(13,27,42,0.1)', scrollMarginTop: '96px' }}>
          <button type="button" onClick={() => setFiltersOpen(open => !open)} className="w-full flex items-center justify-between" style={{ padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 600 }}>{TEXTS.catalog.searchAndFilter}{TEXTS.catalog.activeFiltersSuffix(activeCount)}</span>
            <span style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: '#5C636B' }}>{filtersOpen ? TEXTS.common.hide : TEXTS.common.show}</span>
          </button>
          {filtersOpen && (
            <div style={{ padding: '4px 20px 24px', borderTop: '1px solid rgba(13,27,42,0.08)' }}>
              <div className="flex flex-col gap-5 pt-5">
                <div className="relative" style={{ maxWidth: '440px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ position: 'absolute', left: '2px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(13,27,42,0.35)', pointerEvents: 'none' }}>
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder={TEXTS.catalog.searchPlaceholder}
                    style={{ fontFamily: "'Montserrat'", fontSize: '13px', letterSpacing: '0.01em', color: '#0D1B2A', backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${searchFocused ? '#B88E3A' : 'rgba(13,27,42,0.15)'}`, padding: '10px 4px 10px 26px', width: '100%', outline: 'none', transition: 'border-color 0.2s' }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div style={groupLabelStyle}>{TEXTS.catalog.locationFilterLabel}</div>
                  <div className="flex gap-2 flex-wrap">
                    {ubicaciones.map(u => <button key={u} onClick={() => setUbicacion(u)} style={filterStyle(ubicacion === u)}>{u}</button>)}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div style={groupLabelStyle}>{TEXTS.lands.servicesFilterLabel}</div>
                  <div className="flex gap-2 flex-wrap">
                    {serviciosDisponibles.map(s => (
                      <button key={s} onClick={() => toggleService(s)} style={filterStyle(selectedServices.includes(s))}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading && <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B', marginBottom: '24px' }}>{TEXTS.lands.loading}</div>}
        {error && <div role="alert" style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#9B3D3D', marginBottom: '24px' }}>{error}</div>}
        <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B', marginBottom: '24px' }}>
          {TEXTS.lands.resultsCount(filtered.length)}
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(l => <LandCard key={l.id} listing={l} waConfig={waConfig} navigate={navigate} />)}
          </div>
        ) : !loading && listings.length === 0 ? (
          <div className="text-center py-24">
            <div style={{ fontFamily: "'Playfair Display'", fontSize: '22px', color: '#0D1B2A', marginBottom: '10px' }}>{TEXTS.catalog.comingSoonTitle}</div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: '#5C636B', marginBottom: '24px' }}>{TEXTS.catalog.comingSoonHint('terrenos')}</div>
            <a
              href={buildWAMessageUrl(waConfig, TEXTS.common.comingSoonInquiryMessage('terrenos'))}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A', backgroundColor: '#B88E3A', padding: '13px 24px', textDecoration: 'none', display: 'inline-block' }}
            >
              {TEXTS.catalog.comingSoonCta}
            </a>
          </div>
        ) : (
          <div className="text-center py-24">
            <div style={{ fontFamily: "'Playfair Display'", fontSize: '22px', color: '#0D1B2A', marginBottom: '10px' }}>{TEXTS.catalog.noResultsTitle}</div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: '#5C636B' }}>{TEXTS.catalog.noResultsHint}</div>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#0D1B2A', padding: '64px 0', marginTop: '32px' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#F5F2EC', marginBottom: '8px' }}>
              {TEXTS.lands.ctaTitle}
            </h3>
            <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.5)', lineHeight: 1.7 }}>
              {TEXTS.lands.ctaText}
            </p>
          </div>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A',
              backgroundColor: '#B88E3A', padding: '14px 32px', textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            {TEXTS.lands.ctaButton}
          </a>
        </div>
      </div>
    </main>
  )
}
