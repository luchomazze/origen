import { useState } from 'react'
import type { NavProps } from '../types'
import { buildWAUrl, resolveMsg } from '../utils/whatsapp'
import { EMPRENDIMIENTOS, DEMO_LISTINGS, displayPrecio, displayUnidadPrecio, isPubliclyVisible } from '../data/listings'

interface Props extends NavProps {
  projectId: string
}

const estadoBadgeDetail: Record<string, { bg: string; text: string; border: string }> = {
  DISPONIBLE: { bg: 'rgba(184,142,58,0.15)', text: '#B88E3A', border: 'rgba(184,142,58,0.4)' },
  RESERVADO: { bg: 'rgba(220,200,163,0.15)', text: '#DCC8A3', border: 'rgba(220,200,163,0.4)' },
  EN_NEGOCIACION: { bg: 'rgba(92,99,107,0.2)', text: 'rgba(245,242,236,0.7)', border: 'rgba(92,99,107,0.4)' },
}

const unidadEstadoLabel: Record<string, { color: string; label: string }> = {
  DISPONIBLE: { color: '#B88E3A', label: 'Disponible' },
  RESERVADO: { color: '#DCC8A3', label: 'Reservado' },
  EN_NEGOCIACION: { color: '#5C636B', label: 'En negociación' },
  VENDIDO: { color: 'rgba(245,242,236,0.3)', label: 'Vendido' },
}

export default function ProjectDetail({ projectId, navigate, waConfig }: Props) {
  const listing =
    EMPRENDIMIENTOS.find(e => e.slug === projectId) ??
    DEMO_LISTINGS.find(e => e.tipo === 'EMPRENDIMIENTO' && e.slug === projectId)

  const [activeImage, setActiveImage] = useState(0)

  if (!listing || !isPubliclyVisible(listing)) {
    const similarListings = EMPRENDIMIENTOS.slice(0, 3)
    return (
      <main style={{ paddingTop: '80px', backgroundColor: '#F5F2EC', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#0D1B2A', padding: '72px 0 56px' }}>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '36px', fontWeight: 600, color: '#F5F2EC', marginBottom: '14px' }}>
              Este emprendimiento ya no se encuentra disponible.
            </h1>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
          <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', marginBottom: '32px' }}>
            Quizás te interese alguno de estos emprendimientos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {similarListings.map(e => (
              <div key={e.id} className="cursor-pointer group overflow-hidden" style={{ backgroundColor: '#0D1B2A' }} onClick={() => navigate('project-detail', e.slug)}>
                {e.imagen && <img src={`${e.imagen}&w=400&h=300&fit=crop&auto=format`} alt={e.titulo} className="w-full object-cover" style={{ height: '160px' }} />}
                <div className="p-5">
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px', color: '#F5F2EC', fontWeight: 600, marginBottom: '4px' }}>{e.titulo}</div>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.45)' }}>{[e.barrio, e.ciudad].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  const images = listing.imagenes ?? (listing.imagen ? [listing.imagen] : [])
  const locationLabel = [listing.barrio, listing.ciudad].filter(Boolean).join(' · ')
  const precio = displayPrecio(listing)
  const waUrl = buildWAUrl(waConfig, 'projectMsg', listing.titulo)
  const waMsg = resolveMsg(waConfig.projectMsg, listing.titulo)
  const badge = estadoBadgeDetail[listing.estado_comercial] ?? estadoBadgeDetail.DISPONIBLE

  const hasUnidades = listing.unidades && listing.unidades.length > 0

  return (
    <main style={{ paddingTop: '80px', backgroundColor: '#F5F2EC', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#0D1B2A', padding: '14px 0', borderBottom: '1px solid rgba(245,242,236,0.06)' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center gap-2">
          <button onClick={() => navigate('projects')} style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.4)', cursor: 'pointer', background: 'none', border: 'none' }}>Emprendimientos</button>
          <span style={{ color: 'rgba(245,242,236,0.2)' }}>·</span>
          <span style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B88E3A' }}>{listing.titulo}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: '560px', backgroundColor: '#0D1B2A' }}>
        {images[activeImage] && (
          <img
            src={`${images[activeImage]}?w=1400&h=1120&fit=crop&auto=format`}
            alt={listing.titulo}
            className="w-full h-full object-cover"
            style={{ opacity: 0.6 }}
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.85) 0%, rgba(13,27,42,0.2) 60%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pb-12">
            {listing.estado_comercial !== 'DISPONIBLE' && (
              <div
                className="inline-block mb-5 px-4 py-2"
                style={{ backgroundColor: badge.bg, border: `1px solid ${badge.border}`, backdropFilter: 'blur(6px)' }}
              >
                <span style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: badge.text, fontWeight: 700 }}>
                  {listing.estado_comercial === 'EN_NEGOCIACION' ? 'En negociación' : 'Reservado'}
                </span>
              </div>
            )}
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 600, color: '#F5F2EC', lineHeight: 1.1, marginBottom: '10px' }}>
              {listing.titulo}
            </h1>
            {locationLabel && (
              <div style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500 }}>
                {locationLabel}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key info bar */}
      <div style={{ backgroundColor: '#0D1B2A' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(245,242,236,0.06)' }}>
            {precio && (
              <div className="p-6 lg:p-8" style={{ backgroundColor: '#0D1B2A' }}>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)', marginBottom: '8px' }}>
                  {listing.precio_desde ? 'Desde' : 'Precio'}
                </div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', color: '#F5F2EC', fontWeight: 600 }}>{precio}</div>
              </div>
            )}
            {listing.fecha_entrega && (
              <div className="p-6 lg:p-8" style={{ backgroundColor: '#0D1B2A' }}>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)', marginBottom: '8px' }}>Entrega</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', color: '#F5F2EC', fontWeight: 600 }}>{listing.fecha_entrega}</div>
              </div>
            )}
            {listing.superficie_m2 && (
              <div className="p-6 lg:p-8" style={{ backgroundColor: '#0D1B2A' }}>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)', marginBottom: '8px' }}>Superficie</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', color: '#F5F2EC', fontWeight: 600 }}>{listing.superficie_m2} m²</div>
              </div>
            )}
            {hasUnidades && (
              <div className="p-6 lg:p-8" style={{ backgroundColor: '#0D1B2A' }}>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)', marginBottom: '8px' }}>Tipologías</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', color: '#F5F2EC', fontWeight: 600 }}>{listing.unidades!.length} opciones</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 flex flex-col gap-14">
            {/* Description */}
            {listing.descripcion && (
              <div>
                <div style={{ width: '28px', height: '1px', backgroundColor: '#B88E3A', marginBottom: '20px' }} />
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 600, color: '#0D1B2A', marginBottom: '16px' }}>
                  Descripción
                </h2>
                <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', lineHeight: 1.85 }}>
                  {listing.descripcion}
                </p>
              </div>
            )}

            {/* Gallery */}
            {images.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 600, color: '#0D1B2A', marginBottom: '16px' }}>
                  Galería
                </h2>
                <div className="relative overflow-hidden mb-3" style={{ height: '340px', backgroundColor: '#DCC8A3' }}>
                  <img
                    src={`${images[activeImage]}?w=1000&h=680&fit=crop&auto=format`}
                    alt={`${listing.titulo} imagen ${activeImage + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)` }}>
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className="relative overflow-hidden"
                        style={{ height: '72px', backgroundColor: '#DCC8A3', opacity: activeImage === i ? 1 : 0.55, transition: 'opacity 0.2s', border: activeImage === i ? '2px solid #B88E3A' : '2px solid transparent' }}
                      >
                        <img src={`${img}?w=200&h=144&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tipologías — only when unidades exist */}
            {hasUnidades && (
              <div>
                <div style={{ width: '28px', height: '1px', backgroundColor: '#B88E3A', marginBottom: '20px' }} />
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 600, color: '#0D1B2A', marginBottom: '20px' }}>
                  Tipologías disponibles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.unidades!
                    .slice()
                    .sort((a, b) => a.orden - b.orden)
                    .map(u => {
                      const uPrecio = displayUnidadPrecio(u)
                      const uEstado = unidadEstadoLabel[u.estado_comercial] ?? unidadEstadoLabel.DISPONIBLE
                      return (
                        <div key={u.id} style={{ border: '1px solid rgba(13,27,42,0.1)', padding: '20px', backgroundColor: '#F5F2EC' }}>
                          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '17px', fontWeight: 600, color: '#0D1B2A', marginBottom: '8px' }}>{u.nombre}</div>
                          {u.descripcion && (
                            <p style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B', lineHeight: 1.6, marginBottom: '10px' }}>{u.descripcion}</p>
                          )}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-10">
                            {u.superficie_m2 != null && <span style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B' }}>{u.superficie_m2} m²</span>}
                            {u.dormitorios != null && <span style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B' }}>{u.dormitorios} dorm.</span>}
                            {u.banos != null && <span style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B' }}>{u.banos} {u.banos === 1 ? 'baño' : 'baños'}</span>}
                            {u.cocheras != null && <span style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B' }}>{u.cocheras} cochera{u.cocheras > 1 ? 's' : ''}</span>}
                          </div>
                          <div className="flex items-end justify-between" style={{ borderTop: '1px solid rgba(13,27,42,0.08)', paddingTop: '12px' }}>
                            <div>
                              {uPrecio && <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px', color: '#0D1B2A', fontWeight: 600 }}>{uPrecio}</div>}
                              <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: uEstado.color, fontWeight: 600, marginTop: '3px' }}>
                                {uEstado.label}
                              </div>
                            </div>
                            {u.estado_comercial !== 'VENDIDO' && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.15em',
                                  textTransform: 'uppercase', fontWeight: 600, color: '#B88E3A',
                                  textDecoration: 'none', border: '1px solid rgba(184,142,58,0.4)',
                                  padding: '7px 12px',
                                }}
                              >
                                Consultar
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Financing */}
            {listing.financiamiento && (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 600, color: '#0D1B2A', marginBottom: '16px' }}>
                  Financiación
                </h2>
                <div style={{ backgroundColor: '#0D1B2A', padding: '24px', borderLeft: '3px solid #B88E3A' }}>
                  <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.7)', lineHeight: 1.7 }}>
                    {listing.financiamiento}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-5" style={{ backgroundColor: '#0D1B2A', padding: '32px' }}>
              {locationLabel && (
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500 }}>
                  {locationLabel}
                </div>
              )}
              {precio && (
                <div>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.4)', marginBottom: '5px' }}>
                    {listing.precio_desde ? 'Precio desde' : 'Precio'}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '26px', color: '#F5F2EC', fontWeight: 600 }}>{precio}</div>
                </div>
              )}
              <div style={{ height: '1px', backgroundColor: 'rgba(245,242,236,0.08)' }} />
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', color: '#F5F2EC', fontWeight: 600, lineHeight: 1.3 }}>
                ¿Querés conocer este emprendimiento?
              </h3>
              <p style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: 'rgba(245,242,236,0.4)', lineHeight: 1.6, fontStyle: 'italic', padding: '10px', backgroundColor: 'rgba(245,242,236,0.04)', border: '1px solid rgba(245,242,236,0.06)' }}>
                "{waMsg}"
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontWeight: 700, color: '#0D1B2A', backgroundColor: '#B88E3A', padding: '15px', textDecoration: 'none', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#B88E3A'; e.currentTarget.style.outline = '1px solid #B88E3A' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#B88E3A'; e.currentTarget.style.color = '#0D1B2A'; e.currentTarget.style.outline = 'none' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Consultar por WhatsApp
              </a>
              <button
                onClick={() => navigate('contact')}
                style={{
                  fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                  fontWeight: 600, color: 'rgba(245,242,236,0.5)', border: '1px solid rgba(245,242,236,0.15)',
                  padding: '13px', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#F5F2EC'; e.currentTarget.style.borderColor = 'rgba(245,242,236,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,242,236,0.5)'; e.currentTarget.style.borderColor = 'rgba(245,242,236,0.15)' }}
              >
                Solicitar información
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div style={{ backgroundColor: '#0D1B2A', padding: '64px 0' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#F5F2EC', marginBottom: '24px' }}>
            Ubicación
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              {locationLabel && (
                <div style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: 'rgba(245,242,236,0.55)', lineHeight: 1.7, marginBottom: '8px' }}>
                  {locationLabel}
                </div>
              )}
              {listing.direccion && (
                <div style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.4)' }}>
                  {listing.direccion}
                </div>
              )}
            </div>
            {(listing.latitud && listing.longitud) ? (
              <a
                href={`https://www.google.com/maps?q=${listing.latitud},${listing.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden flex items-center justify-center"
                style={{ height: '200px', backgroundColor: 'rgba(245,242,236,0.04)', border: '1px solid rgba(245,242,236,0.08)', textDecoration: 'none', display: 'flex' }}
              >
                <div className="text-center">
                  <div style={{ width: '32px', height: '32px', border: '2px solid #B88E3A', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#B88E3A', borderRadius: '50%' }} />
                  </div>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)' }}>
                    Ver en Google Maps
                  </div>
                </div>
              </a>
            ) : (
              <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{ height: '200px', backgroundColor: 'rgba(245,242,236,0.04)', border: '1px solid rgba(245,242,236,0.08)' }}
              >
                <div className="text-center">
                  <div style={{ width: '32px', height: '32px', border: '2px solid #B88E3A', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#B88E3A', borderRadius: '50%' }} />
                  </div>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)' }}>
                    {locationLabel}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* url_zonaprop secondary CTA */}
      {listing.url_zonaprop && (
        <div style={{ borderTop: '1px solid rgba(13,27,42,0.08)', padding: '24px 0' }}>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center gap-4">
            <span style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B' }}>También disponible en ZonaProp:</span>
            <a
              href={listing.url_zonaprop}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#B88E3A', textDecoration: 'underline' }}
            >
              Ver publicación →
            </a>
          </div>
        </div>
      )}

      {/* Sticky mobile CTA */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4"
        style={{ backgroundColor: '#0D1B2A', borderTop: '1px solid rgba(245,242,236,0.08)' }}
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full"
          style={{
            fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A',
            backgroundColor: '#B88E3A', padding: '14px', textDecoration: 'none',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          Consultar por WhatsApp
        </a>
      </div>
    </main>
  )
}
