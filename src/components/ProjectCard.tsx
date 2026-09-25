import { buildWAUrl } from '../utils/whatsapp'
import type { WAConfig } from '../utils/whatsapp'
import type { Page } from '../types'
import type { Listing } from '../data/listings'
import { displayPrecio } from '../data/listings'
import { TEXTS } from '../content/texts'
import ListingImageSlider from './ListingImageSlider'

interface Props {
  listing: Listing
  navigate: (to: Page, project?: string) => void
  waConfig: WAConfig
}

const estadoBadge: Record<string, { bg: string; text: string; border: string; label: string }> = {
  DISPONIBLE: { bg: 'rgba(184,142,58,0.12)', text: '#B88E3A', border: 'rgba(184,142,58,0.35)', label: TEXTS.commercialStatus.available },
  RESERVADO: { bg: 'rgba(220,200,163,0.15)', text: '#DCC8A3', border: 'rgba(220,200,163,0.4)', label: TEXTS.commercialStatus.reserved },
  EN_NEGOCIACION: { bg: 'rgba(92,99,107,0.2)', text: 'rgba(245,242,236,0.7)', border: 'rgba(92,99,107,0.4)', label: TEXTS.commercialStatus.inNegotiation },
  ALQUILADO: { bg: 'rgba(92,99,107,0.2)', text: 'rgba(245,242,236,0.7)', border: 'rgba(92,99,107,0.4)', label: TEXTS.commercialStatus.rented },
  VENDIDO: { bg: 'rgba(92,99,107,0.2)', text: 'rgba(245,242,236,0.7)', border: 'rgba(92,99,107,0.4)', label: TEXTS.commercialStatus.sold },
}

export default function ProjectCard({ listing, navigate, waConfig }: Props) {
  const waUrl = buildWAUrl(waConfig, 'projectMsg', listing.titulo)

  const locationLabel = [listing.barrio, listing.ciudad].filter(Boolean).join(' · ')
  const precio = displayPrecio(listing)
  const badge = estadoBadge[listing.estado_comercial] ?? estadoBadge.DISPONIBLE

  return (
    <article
      className="group cursor-pointer flex flex-col overflow-hidden"
      style={{ backgroundColor: '#0D1B2A' }}
      onClick={() => navigate('project-detail', listing.slug)}
    >
      <div className="relative overflow-hidden" style={{ height: '260px', backgroundColor: '#1a2e42' }}>
        <ListingImageSlider images={listing.imagenes ?? (listing.imagen ? [listing.imagen] : [])} alt={listing.titulo} sizeParams="w=600&h=520" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.7) 0%, transparent 60%)', pointerEvents: 'none' }} />
        {listing.estado_comercial !== 'DISPONIBLE' && (
          <div
            className="absolute top-4 left-4 px-3 py-1.5"
            style={{ backgroundColor: badge.bg, border: `1px solid ${badge.border}`, backdropFilter: 'blur(4px)' }}
          >
            <span style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: badge.text, fontWeight: 600 }}>
              {badge.label}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6" style={{ borderBottom: '1px solid rgba(245,242,236,0.08)' }}>
        {locationLabel && (
          <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '8px' }}>
            {locationLabel}
          </div>
        )}
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 600, color: '#F5F2EC', lineHeight: 1.2, marginBottom: '10px' }}>
          {listing.titulo}
        </h3>
        {listing.descripcion && (
          <p style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: 'rgba(245,242,236,0.55)', lineHeight: 1.65, marginBottom: '20px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {listing.descripcion}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mb-5" style={{ borderTop: '1px solid rgba(245,242,236,0.08)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)', marginBottom: '3px' }}>
              {listing.precio_desde ? TEXTS.cards.priceFromLabel : TEXTS.cards.priceLabel}
            </div>
            <div style={{ fontFamily: "'Playfair Display'", fontSize: '15px', color: '#F5F2EC', fontWeight: 600 }}>{precio ?? TEXTS.common.emptyValue}</div>
          </div>
          {listing.fecha_entrega && (
            <div>
              <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)', marginBottom: '3px' }}>{TEXTS.cards.deliveryLabel}</div>
              <div style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: '#DCC8A3', fontWeight: 500 }}>{listing.fecha_entrega}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            style={{
              fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: 600, color: '#B88E3A', border: '1px solid rgba(184,142,58,0.5)',
              padding: '11px 0', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.3s', width: '100%',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#B88E3A'; e.currentTarget.style.color = '#0D1B2A' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#B88E3A' }}
            onClick={e => { e.stopPropagation(); navigate('project-detail', listing.slug) }}
          >
            {TEXTS.cards.viewProject}
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-2 transition-all"
            style={{
              fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
              fontWeight: 600, color: 'rgba(245,242,236,0.5)', border: '1px solid rgba(245,242,236,0.12)',
              padding: '10px 0', textDecoration: 'none', transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F5F2EC'; e.currentTarget.style.borderColor = 'rgba(245,242,236,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,242,236,0.5)'; e.currentTarget.style.borderColor = 'rgba(245,242,236,0.12)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            {TEXTS.common.consultByWhatsapp}
          </a>
        </div>
      </div>
    </article>
  )
}
