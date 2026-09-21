import { useState } from 'react'
import type { NavProps } from '../types'
import type { TipoListing, Listing } from '../data/listings'
import { DEMO_LISTINGS, displayPrecio, displayUnidadPrecio, isPubliclyVisible } from '../data/listings'
import { buildWAUrl, resolveMsg } from '../utils/whatsapp'
import PropertyCard from '../components/PropertyCard'
import LandCard from '../components/LandCard'
import ProjectCard from '../components/ProjectCard'

interface Props extends NavProps {
  slug: string
  tipo: TipoListing
}

const TIPO_LABEL: Record<string, string> = {
  CASA: 'Casa', DEPARTAMENTO: 'Departamento', PH: 'PH', LOCAL: 'Local',
  OFICINA: 'Oficina', CAMPO: 'Campo', CABAÑA: 'Cabaña', OTRO: 'Otro',
}

const UNIDAD_ESTADO: Record<string, { color: string; label: string }> = {
  DISPONIBLE: { color: '#B88E3A', label: 'Disponible' },
  RESERVADO: { color: '#DCC8A3', label: 'Reservado' },
  EN_NEGOCIACION: { color: '#5C636B', label: 'En negociación' },
  VENDIDO: { color: 'rgba(92,99,107,0.4)', label: 'Vendido' },
}

const WA_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function getChars(l: Listing) {
  const rows: { label: string; value: string }[] = []
  if (l.tipo === 'PROPIEDAD') {
    if (l.tipo_propiedad) rows.push({ label: 'Tipo', value: TIPO_LABEL[l.tipo_propiedad] ?? l.tipo_propiedad })
    if (l.superficie_m2) rows.push({ label: 'Superficie', value: `${l.superficie_m2} m²` })
    if (l.ambientes) rows.push({ label: 'Ambientes', value: String(l.ambientes) })
    if (l.dormitorios) rows.push({ label: 'Dormitorios', value: String(l.dormitorios) })
    if (l.banos) rows.push({ label: 'Baños', value: String(l.banos) })
    if (l.cocheras) rows.push({ label: 'Cocheras', value: String(l.cocheras) })
    if (l.apto_credito) rows.push({ label: 'Apto crédito', value: 'Sí' })
  } else if (l.tipo === 'TERRENO') {
    if (l.superficie_m2) rows.push({ label: 'Superficie', value: `${l.superficie_m2} m²` })
  } else {
    if (l.superficie_m2) rows.push({ label: 'Superficie', value: `${l.superficie_m2} m²` })
    if (l.fecha_entrega) rows.push({ label: 'Entrega', value: l.fecha_entrega })
  }
  return rows
}

const SectionLabel = ({ text }: { text: string }) => (
  <>
    <div style={{ width: '24px', height: '1px', backgroundColor: '#B88E3A', marginBottom: '18px' }} />
    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: 600, color: '#0D1B2A', marginBottom: '20px' }}>
      {text}
    </h2>
  </>
)

export default function Detail({ slug, tipo, navigate, waConfig }: Props) {
  const listing = DEMO_LISTINGS.find(l => l.slug === slug && l.tipo === tipo)
  const [activeImg, setActiveImg] = useState(0)

  const backPage = tipo === 'PROPIEDAD' ? 'properties' as const : tipo === 'TERRENO' ? 'lands' as const : 'projects' as const
  const backLabel = tipo === 'PROPIEDAD' ? 'Propiedades' : tipo === 'TERRENO' ? 'Terrenos' : 'Emprendimientos'
  const tipoNombre = tipo === 'PROPIEDAD' ? 'propiedad' : tipo === 'TERRENO' ? 'terreno' : 'emprendimiento'
  const waTemplateKey = tipo === 'PROPIEDAD' ? 'propertyMsg' as const : tipo === 'TERRENO' ? 'landMsg' as const : 'projectMsg' as const

  const related = DEMO_LISTINGS
    .filter(l => l.tipo === tipo && l.slug !== slug && isPubliclyVisible(l))
    .sort((a, b) => (b.barrio === listing?.barrio ? 1 : 0) - (a.barrio === listing?.barrio ? 1 : 0))
    .slice(0, 3)

  const relatedLabel = tipo === 'PROPIEDAD' ? 'Más propiedades' : tipo === 'TERRENO' ? 'Más terrenos' : 'Otros emprendimientos'

  // Not available
  if (!listing || !isPubliclyVisible(listing)) {
    return (
      <main style={{ paddingTop: '80px', backgroundColor: '#F5F2EC', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#0D1B2A', padding: '72px 0 56px' }}>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <button
              onClick={() => navigate(backPage)}
              style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              {backLabel}
            </button>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 600, color: '#F5F2EC', lineHeight: 1.2 }}>
              Este {tipoNombre} ya no se encuentra disponible.
            </h1>
          </div>
        </div>
        {related.length > 0 && (
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
            <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', marginBottom: '36px' }}>
              Quizás te interese alguna de estas opciones.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(r =>
                tipo === 'PROPIEDAD' ? <PropertyCard key={r.id} listing={r} waConfig={waConfig} navigate={navigate} /> :
                tipo === 'TERRENO' ? <LandCard key={r.id} listing={r} waConfig={waConfig} navigate={navigate} /> :
                <ProjectCard key={r.id} listing={r} navigate={navigate} waConfig={waConfig} />
              )}
            </div>
          </div>
        )}
      </main>
    )
  }

  const images = listing.imagenes ?? (listing.imagen ? [listing.imagen] : [])
  const locationLabel = [listing.barrio, listing.ciudad].filter(Boolean).join(' · ')
  const precio = displayPrecio(listing)
  const waUrl = buildWAUrl(waConfig, waTemplateKey, listing.titulo)
  const waMsg = resolveMsg(waConfig[waTemplateKey], listing.titulo)
  const waNum = waConfig.number.replace(/\D/g, '')
  const chars = getChars(listing)
  const hasUnidades = listing.unidades && listing.unidades.length > 0

  const prevImg = () => setActiveImg((activeImg - 1 + images.length) % images.length)
  const nextImg = () => setActiveImg((activeImg + 1) % images.length)

  return (
    <main style={{ paddingTop: '80px', backgroundColor: '#F5F2EC', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#0D1B2A', padding: '12px 0', borderBottom: '1px solid rgba(245,242,236,0.06)' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center gap-2">
          <button
            onClick={() => navigate(backPage)}
            style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.4)', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            {backLabel}
          </button>
          <span style={{ color: 'rgba(245,242,236,0.2)' }}>·</span>
          <span style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B88E3A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
            {listing.titulo}
          </span>
        </div>
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <div style={{ backgroundColor: '#0D1B2A' }}>
          <div style={{ position: 'relative', height: 'clamp(260px, 55vw, 560px)' }}>
            <img
              src={`${images[activeImg]}?w=1400&h=900&fit=crop&auto=format`}
              alt={listing.titulo}
              className="w-full h-full object-cover"
              style={{ opacity: 0.92 }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(13,27,42,0.65)', border: '1px solid rgba(245,242,236,0.2)', color: '#F5F2EC', width: '42px', height: '42px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(13,27,42,0.9)' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(13,27,42,0.65)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button
                  onClick={nextImg}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(13,27,42,0.65)', border: '1px solid rgba(245,242,236,0.2)', color: '#F5F2EC', width: '42px', height: '42px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(13,27,42,0.9)' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(13,27,42,0.65)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(245,242,236,0.7)', backgroundColor: 'rgba(13,27,42,0.55)', padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
                  {activeImg + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="hidden lg:flex gap-2 px-4 py-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{ width: '90px', height: '62px', flexShrink: 0, overflow: 'hidden', opacity: activeImg === i ? 1 : 0.45, border: activeImg === i ? '2px solid #B88E3A' : '2px solid transparent', transition: 'all 0.2s', cursor: 'pointer', padding: 0 }}
                >
                  <img src={`${img}?w=180&h=124&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post-gallery header */}
      <div style={{ backgroundColor: '#F5F2EC', padding: '40px 0 32px', borderBottom: '1px solid rgba(13,27,42,0.08)' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div>
              {locationLabel && (
                <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '10px' }}>
                  {locationLabel}
                </div>
              )}
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 600, color: '#0D1B2A', lineHeight: 1.15, marginBottom: '14px' }}>
                {listing.titulo}
              </h1>
              {listing.estado_comercial !== 'DISPONIBLE' && (
                <span style={{
                  fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
                  fontWeight: 700, display: 'inline-block', padding: '5px 12px',
                  color: listing.estado_comercial === 'RESERVADO' ? '#B88E3A' : '#5C636B',
                  border: `1px solid ${listing.estado_comercial === 'RESERVADO' ? 'rgba(184,142,58,0.4)' : 'rgba(92,99,107,0.3)'}`,
                }}>
                  {listing.estado_comercial === 'RESERVADO' ? 'Reservado' : 'En negociación'}
                </span>
              )}
            </div>
            {precio && (
              <div className="lg:text-right" style={{ flexShrink: 0 }}>
                {listing.precio_desde && (
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5C636B', marginBottom: '4px' }}>
                    Precio desde
                  </div>
                )}
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 600, color: '#0D1B2A' }}>
                  {precio}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Left: content */}
          <div className="lg:col-span-2 flex flex-col gap-14">

            {/* Descripción */}
            {listing.descripcion && (
              <div>
                <SectionLabel text="Descripción" />
                <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', lineHeight: 1.85 }}>
                  {listing.descripcion}
                </p>
              </div>
            )}

            {/* Características */}
            {chars.length > 0 && (
              <div>
                <SectionLabel text="Características" />
                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-1px' }}>
                  {chars.map((c, i) => (
                    <div
                      key={i}
                      style={{ padding: '20px 24px', border: '1px solid rgba(13,27,42,0.09)', margin: '1px', display: 'flex', flexDirection: 'column', gap: '8px', flex: '0 0 auto' }}
                    >
                      <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 600 }}>
                        {c.label}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: 600, color: '#0D1B2A', lineHeight: 1.1 }}>
                        {c.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios */}
            {listing.services && listing.services.length > 0 && (
              <div>
                <SectionLabel text="Servicios" />
                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-1px' }}>
                  {listing.services.map(s => (
                    <div
                      key={s}
                      style={{ padding: '14px 22px', border: '1px solid rgba(13,27,42,0.09)', margin: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <div style={{ width: '4px', height: '4px', backgroundColor: '#B88E3A', flexShrink: 0, borderRadius: '50%' }} />
                      <span style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: '#0D1B2A' }}>
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lotes disponibles — TERRENO con unidades */}
            {tipo === 'TERRENO' && hasUnidades && (
              <div>
                <SectionLabel text="Lotes disponibles" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'rgba(13,27,42,0.08)' }}>
                  {listing.unidades!
                    .slice()
                    .sort((a, b) => a.orden - b.orden)
                    .map(u => {
                      const uEstado = UNIDAD_ESTADO[u.estado_comercial] ?? UNIDAD_ESTADO.DISPONIBLE
                      const uPrecio = displayUnidadPrecio(u)
                      const uWaUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(`Hola, quisiera consultar por el ${u.nombre} de ${listing.titulo}.`)}`
                      return (
                        <div key={u.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5" style={{ backgroundColor: '#F5F2EC' }}>
                          <div className="flex flex-col gap-1">
                            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px', color: '#0D1B2A', fontWeight: 600 }}>{u.nombre}</span>
                            <div className="flex gap-5">
                              {u.superficie_m2 && (
                                <span style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: '#5C636B' }}>{u.superficie_m2} m²</span>
                              )}
                              {uPrecio && (
                                <span style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: '#0D1B2A', fontWeight: 600 }}>{uPrecio}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: uEstado.color }}>
                              {uEstado.label}
                            </span>
                            {u.estado_comercial !== 'VENDIDO' && (
                              <a
                                href={uWaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: '#B88E3A', border: '1px solid rgba(184,142,58,0.4)', padding: '6px 12px', textDecoration: 'none', whiteSpace: 'nowrap' }}
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

            {/* Tipologías — EMPRENDIMIENTO con unidades */}
            {tipo === 'EMPRENDIMIENTO' && hasUnidades && (
              <div>
                <SectionLabel text="Tipologías disponibles" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.unidades!
                    .slice()
                    .sort((a, b) => a.orden - b.orden)
                    .map(u => {
                      const uEstado = UNIDAD_ESTADO[u.estado_comercial] ?? UNIDAD_ESTADO.DISPONIBLE
                      const uPrecio = displayUnidadPrecio(u)
                      return (
                        <div key={u.id} style={{ border: '1px solid rgba(13,27,42,0.1)', padding: '20px' }}>
                          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '17px', fontWeight: 600, color: '#0D1B2A', marginBottom: '6px' }}>{u.nombre}</div>
                          {u.descripcion && (
                            <p style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B', lineHeight: 1.6, marginBottom: '10px' }}>{u.descripcion}</p>
                          )}
                          <div className="flex flex-wrap gap-x-4 gap-y-1" style={{ marginBottom: '40px', minHeight: '18px' }}>
                            {u.superficie_m2 != null && <span style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B' }}>{u.superficie_m2} m²</span>}
                            {u.dormitorios != null && <span style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B' }}>{u.dormitorios} dorm.</span>}
                            {u.banos != null && <span style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B' }}>{u.banos} {u.banos === 1 ? 'baño' : 'baños'}</span>}
                            {u.cocheras != null && <span style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B' }}>{u.cocheras} cochera{u.cocheras > 1 ? 's' : ''}</span>}
                          </div>
                          <div style={{ borderTop: '1px solid rgba(13,27,42,0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                              {uPrecio && <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px', color: '#0D1B2A', fontWeight: 600 }}>{uPrecio}</div>}
                              <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: uEstado.color, marginTop: '3px' }}>
                                {uEstado.label}
                              </div>
                            </div>
                            {u.estado_comercial !== 'VENDIDO' && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: '#B88E3A', border: '1px solid rgba(184,142,58,0.4)', padding: '7px 12px', textDecoration: 'none' }}
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

            {/* Financiamiento — EMPRENDIMIENTO */}
            {tipo === 'EMPRENDIMIENTO' && listing.financiamiento && (
              <div>
                <SectionLabel text="Financiación" />
                <div style={{ backgroundColor: '#0D1B2A', padding: '22px 24px', borderLeft: '3px solid #B88E3A' }}>
                  <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.7)', lineHeight: 1.75 }}>
                    {listing.financiamiento}
                  </p>
                </div>
              </div>
            )}

            {/* Ubicación */}
            {(listing.barrio || listing.ciudad || listing.direccion || (listing.latitud && listing.longitud)) && (
              <div>
                <SectionLabel text="Ubicación" />
                <div style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', lineHeight: 1.7, marginBottom: (listing.latitud && listing.longitud) ? '16px' : 0 }}>
                  {[listing.barrio, listing.ciudad].filter(Boolean).join(', ')}
                  {listing.direccion && (
                    <div style={{ marginTop: '4px', fontSize: '13px', color: 'rgba(92,99,107,0.7)' }}>{listing.direccion}</div>
                  )}
                </div>
                {listing.latitud && listing.longitud && (
                  <div style={{ overflow: 'hidden', border: '1px solid rgba(13,27,42,0.1)' }}>
                    <iframe
                      title="Mapa de ubicación"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.longitud - 0.009},${listing.latitud - 0.006},${listing.longitud + 0.009},${listing.latitud + 0.006}&layer=mapnik&marker=${listing.latitud},${listing.longitud}`}
                      style={{ width: '100%', height: '260px', border: 'none', display: 'block' }}
                      loading="lazy"
                    />
                    <a
                      href={`https://www.google.com/maps?q=${listing.latitud},${listing.longitud}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', padding: '10px 16px', fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5C636B', textDecoration: 'none', borderTop: '1px solid rgba(13,27,42,0.08)' }}
                    >
                      Abrir en Google Maps →
                    </a>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right: sticky CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-5" style={{ backgroundColor: '#0D1B2A', padding: '28px' }}>
              {locationLabel && (
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500 }}>
                  {locationLabel}
                </div>
              )}
              {precio && (
                <div>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.4)', marginBottom: '4px' }}>
                    {listing.precio_desde ? 'Precio desde' : 'Precio'}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', color: '#F5F2EC', fontWeight: 600 }}>
                    {precio}
                  </div>
                </div>
              )}
              <div style={{ height: '1px', backgroundColor: 'rgba(245,242,236,0.08)' }} />
              <p style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.3)', lineHeight: 1.65, fontStyle: 'italic', padding: '10px', backgroundColor: 'rgba(245,242,236,0.04)', border: '1px solid rgba(245,242,236,0.06)' }}>
                "{waMsg}"
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A', backgroundColor: '#B88E3A', padding: '14px', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a37d33' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#B88E3A' }}
              >
                {WA_ICON}
                Consultar por WhatsApp
              </a>
              {listing.url_zonaprop && (
                <a
                  href={listing.url_zonaprop}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(245,242,236,0.35)', textDecoration: 'none', paddingTop: '12px', borderTop: '1px solid rgba(245,242,236,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(245,242,236,0.6)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,242,236,0.35)' }}
                >
                  Ver en ZonaProp →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related listings */}
      {related.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(13,27,42,0.08)', padding: '80px 0' }}>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '8px' }}>
              También puede interesarte
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#0D1B2A', marginBottom: '36px' }}>
              {relatedLabel}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(r =>
                tipo === 'PROPIEDAD' ? <PropertyCard key={r.id} listing={r} waConfig={waConfig} navigate={navigate} /> :
                tipo === 'TERRENO' ? <LandCard key={r.id} listing={r} waConfig={waConfig} navigate={navigate} /> :
                <ProjectCard key={r.id} listing={r} navigate={navigate} waConfig={waConfig} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile sticky WA */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4"
        style={{ backgroundColor: '#0D1B2A', borderTop: '1px solid rgba(245,242,236,0.08)' }}
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full"
          style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A', backgroundColor: '#B88E3A', padding: '14px', textDecoration: 'none' }}
        >
          {WA_ICON}
          Consultar por WhatsApp
        </a>
      </div>

    </main>
  )
}
