import { useState } from 'react'
import Logo from '../components/Logo'
import { useAuth } from '../auth/AuthProvider'
import { buildWAUrl, resolveMsg } from '../utils/whatsapp'
import type { NavProps } from '../types'
import type { WAConfig } from '../utils/whatsapp'
import { DEMO_LISTINGS, ALL_SERVICES } from '../data/listings'
import type { Listing } from '../data/listings'

type AdminSection = 'dashboard' | 'whatsapp' | 'publicaciones'

const LS_KEY = 'origen_listing_services'

function loadServiceOverrides(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}') } catch { return {} }
}

function saveServiceOverrides(data: Record<string, string[]>) {
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

const FIELD = {
  label: {
    fontFamily: "'Montserrat'",
    fontSize: '9px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'rgba(245,242,236,0.45)',
    fontWeight: 600,
    display: 'block',
    marginBottom: '8px',
  },
  input: {
    fontFamily: "'Montserrat'",
    fontSize: '13px',
    color: '#F5F2EC',
    backgroundColor: 'rgba(245,242,236,0.04)',
    border: '1px solid rgba(245,242,236,0.1)',
    padding: '12px 14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'none' as const,
  },
}

const NAV_ITEMS: { id: AdminSection; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'publicaciones', label: 'Publicaciones' },
]

export default function Admin({ navigate, waConfig, onConfigSave }: NavProps) {
  const { user, signOut } = useAuth()
  const [section, setSection] = useState<AdminSection>('whatsapp')
  const [draft, setDraft] = useState<WAConfig>({ ...waConfig })
  const [serviceOverrides, setServiceOverrides] = useState<Record<string, string[]>>(loadServiceOverrides)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [servicesSaved, setServicesSaved] = useState<string | null>(null)

  const getListingServices = (l: Listing): string[] =>
    serviceOverrides[l.id] ?? l.services ?? []

  const handleServicesToggle = (listingId: string, service: string) => {
    const current = serviceOverrides[listingId] ?? DEMO_LISTINGS.find(l => l.id === listingId)?.services ?? []
    const updated = current.includes(service)
      ? current.filter(s => s !== service)
      : [...current, service]
    setServiceOverrides(prev => ({ ...prev, [listingId]: updated }))
  }

  const handleServicesSave = (listingId: string) => {
    saveServiceOverrides(serviceOverrides)
    setServicesSaved(listingId)
    setTimeout(() => setServicesSaved(null), 2000)
  }
  const [saved, setSaved] = useState(false)
  const [testProject] = useState('Origen Park')

  const handleSave = () => {
    onConfigSave(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const previewProject = resolveMsg(draft.projectMsg, testProject)
  const previewProperty = resolveMsg(draft.propertyMsg, 'Casa en Manantiales')
  const previewLand = resolveMsg(draft.landMsg, 'Lote en Jardines del Jockey')
  const testUrl = buildWAUrl(draft, 'projectMsg', testProject)

  const fieldStyle = (focused: boolean) => ({
    ...FIELD.input,
    borderColor: focused ? 'rgba(184,142,58,0.5)' : 'rgba(245,242,236,0.1)',
  })

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#080f18', fontFamily: "'Montserrat', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="flex flex-col" style={{ width: '220px', minHeight: '100vh', backgroundColor: '#0D1B2A', borderRight: '1px solid rgba(245,242,236,0.06)', flexShrink: 0 }}>
        <div className="p-6" style={{ borderBottom: '1px solid rgba(245,242,236,0.06)' }}>
          <Logo size="sm" />
        </div>

        <div className="p-4 flex flex-col gap-1 flex-1">
          <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.25)', padding: '8px 10px 4px', marginTop: '8px' }}>
            General
          </div>
          {NAV_ITEMS.slice(0, 1).map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              style={{
                fontFamily: "'Montserrat'", fontSize: '11px', letterSpacing: '0.06em',
                color: section === item.id ? '#F5F2EC' : 'rgba(245,242,236,0.4)',
                backgroundColor: section === item.id ? 'rgba(245,242,236,0.06)' : 'transparent',
                border: 'none', padding: '9px 10px', cursor: 'pointer',
                textAlign: 'left', width: '100%', transition: 'all 0.2s',
              }}
            >
              {item.label}
            </button>
          ))}

          <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.25)', padding: '16px 10px 4px' }}>
            Contenido
          </div>
          <button
            onClick={() => setSection('publicaciones')}
            style={{
              fontFamily: "'Montserrat'", fontSize: '11px', letterSpacing: '0.06em',
              color: section === 'publicaciones' ? '#F5F2EC' : 'rgba(245,242,236,0.4)',
              backgroundColor: section === 'publicaciones' ? 'rgba(245,242,236,0.06)' : 'transparent',
              border: 'none', padding: '9px 10px', cursor: 'pointer',
              textAlign: 'left', width: '100%', transition: 'all 0.2s',
            }}
          >
            Publicaciones
          </button>

          <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.25)', padding: '16px 10px 4px' }}>
            Configuración
          </div>
          <button
            onClick={() => setSection('whatsapp')}
            className="flex items-center gap-2"
            style={{
              fontFamily: "'Montserrat'", fontSize: '11px', letterSpacing: '0.06em',
              color: section === 'whatsapp' ? '#B88E3A' : 'rgba(245,242,236,0.4)',
              backgroundColor: section === 'whatsapp' ? 'rgba(184,142,58,0.08)' : 'transparent',
              border: section === 'whatsapp' ? '1px solid rgba(184,142,58,0.15)' : '1px solid transparent',
              padding: '9px 10px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            WhatsApp
          </button>
        </div>

        <div className="p-4" style={{ borderTop: '1px solid rgba(245,242,236,0.06)' }}>
          <button
            onClick={() => { void signOut() }}
            style={{
              fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.12em',
              color: 'rgba(245,242,236,0.28)', background: 'none', border: 'none',
              cursor: 'pointer', display: 'block', marginBottom: '14px', padding: 0,
            }}
          >
            Cerrar sesión
          </button>
          <button
            onClick={() => navigate('home')}
            style={{
              fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.14em',
              color: 'rgba(245,242,236,0.35)', background: 'none', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#B88E3A')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,242,236,0.35)')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M5 12l7-7M5 12l7 7" /></svg>
            Ver sitio
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div style={{ height: '56px', backgroundColor: '#0D1B2A', borderBottom: '1px solid rgba(245,242,236,0.06)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '8px' }}>
          <span style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.3)' }}>Configuración</span>
          <span style={{ color: 'rgba(245,242,236,0.15)' }}>·</span>
          <span style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: section !== 'dashboard' ? '#B88E3A' : 'rgba(245,242,236,0.6)' }}>
            {section === 'whatsapp' ? 'WhatsApp' : section === 'publicaciones' ? 'Publicaciones' : 'Dashboard'}
          </span>
          {user?.email && <span style={{ marginLeft: 'auto', fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.35)' }}>{user.email}</span>}
        </div>

        <div style={{ padding: '40px 32px', maxWidth: '900px' }}>
          {section === 'dashboard' && (
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#F5F2EC', marginBottom: '8px' }}>Dashboard</h1>
              <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.4)', marginBottom: '40px' }}>Panel de administración de ORIGEN Inversiones Inmobiliarias.</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Propiedades', value: '8', note: 'activas' },
                  { label: 'Terrenos', value: '6', note: 'disponibles' },
                  { label: 'Emprendimientos', value: '3', note: 'en cartera' },
                ].map(s => (
                  <div key={s.label} style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '24px' }}>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', marginBottom: '12px' }}>{s.label}</div>
                    <div style={{ fontFamily: "'Playfair Display'", fontSize: '36px', color: '#F5F2EC', fontWeight: 600 }}>{s.value}</div>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: 'rgba(245,242,236,0.3)', marginTop: '4px' }}>{s.note}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(184,142,58,0.2)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#B88E3A', flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                <div>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', fontWeight: 600, color: '#F5F2EC', marginBottom: '2px' }}>Configuración de WhatsApp activa</div>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: 'rgba(245,242,236,0.4)' }}>Número: +{waConfig.number} · Plantillas configuradas</div>
                </div>
                <button onClick={() => setSection('whatsapp')} style={{ marginLeft: 'auto', fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B88E3A', border: '1px solid rgba(184,142,58,0.4)', padding: '8px 14px', background: 'none', cursor: 'pointer' }}>
                  Editar
                </button>
              </div>
            </div>
          )}

          {section === 'publicaciones' && (
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#F5F2EC', marginBottom: '6px' }}>Publicaciones</h1>
              <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.4)', marginBottom: '40px' }}>
                Administrá los servicios disponibles en cada publicación.
              </p>

              {(['PROPIEDAD', 'TERRENO', 'EMPRENDIMIENTO'] as const).map(tipo => {
                const items = DEMO_LISTINGS.filter(l => l.tipo === tipo)
                if (!items.length) return null
                const tipoLabel = tipo === 'PROPIEDAD' ? 'Propiedades' : tipo === 'TERRENO' ? 'Terrenos' : 'Emprendimientos'
                return (
                  <div key={tipo} style={{ marginBottom: '48px' }}>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '16px' }}>
                      {tipoLabel}
                    </div>
                    <div className="flex flex-col gap-3">
                      {items.map(listing => {
                        const isOpen = editingId === listing.id
                        const currentServices = getListingServices(listing)
                        const isSaved = servicesSaved === listing.id
                        return (
                          <div key={listing.id} style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)' }}>
                            <button
                              onClick={() => setEditingId(isOpen ? null : listing.id)}
                              className="w-full flex items-center justify-between"
                              style={{ padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            >
                              <div>
                                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px', fontWeight: 600, color: '#F5F2EC', marginBottom: '4px' }}>
                                  {listing.titulo}
                                </div>
                                <div style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.3)' }}>
                                  {currentServices.length > 0 ? currentServices.join(' · ') : 'Sin servicios configurados'}
                                </div>
                              </div>
                              <svg
                                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(245,242,236,0.4)" strokeWidth="1.5"
                                style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>

                            {isOpen && (
                              <div style={{ borderTop: '1px solid rgba(245,242,236,0.06)', padding: '20px 24px 24px' }}>
                                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)', marginBottom: '16px' }}>
                                  Servicios disponibles
                                </div>
                                <div className="flex flex-col gap-3 mb-6">
                                  {ALL_SERVICES.map(service => {
                                    const checked = currentServices.includes(service)
                                    return (
                                      <label
                                        key={service}
                                        className="flex items-center gap-3"
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                      >
                                        <div
                                          onClick={() => handleServicesToggle(listing.id, service)}
                                          style={{
                                            width: '16px', height: '16px', flexShrink: 0,
                                            border: `1px solid ${checked ? '#B88E3A' : 'rgba(245,242,236,0.2)'}`,
                                            backgroundColor: checked ? '#B88E3A' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.15s', cursor: 'pointer',
                                          }}
                                        >
                                          {checked && (
                                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0D1B2A" strokeWidth="3">
                                              <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                          )}
                                        </div>
                                        <span style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: checked ? '#F5F2EC' : 'rgba(245,242,236,0.5)', transition: 'color 0.15s' }}>
                                          {service}
                                        </span>
                                      </label>
                                    )
                                  })}
                                </div>
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() => handleServicesSave(listing.id)}
                                    style={{
                                      fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
                                      fontWeight: 700, color: '#0D1B2A', backgroundColor: '#B88E3A',
                                      border: '1px solid #B88E3A', padding: '10px 24px', cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                  >
                                    Guardar
                                  </button>
                                  {isSaved && (
                                    <div className="flex items-center gap-2" style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: '#B88E3A' }}>
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                      Guardado
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              <div style={{ padding: '16px 20px', border: '1px solid rgba(245,242,236,0.06)', backgroundColor: 'rgba(245,242,236,0.02)' }}>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.25)', marginBottom: '6px' }}>
                  Modelo de datos · LISTINGS
                </div>
                <code style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.25)' }}>services: TEXT[]</code>
              </div>
            </div>
          )}

          {section === 'whatsapp' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#F5F2EC', marginBottom: '6px' }}>Configuración de WhatsApp</h1>
                  <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.4)' }}>
                    Configurá el número y los mensajes que se enviarán automáticamente al hacer clic en los CTAs de WhatsApp.
                  </p>
                </div>
                {saved && (
                  <div className="flex items-center gap-2" style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#B88E3A', border: '1px solid rgba(184,142,58,0.3)', padding: '8px 14px', backgroundColor: 'rgba(184,142,58,0.06)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    Guardado
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-8">
                {/* Number */}
                <div style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '28px' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div style={{ width: '28px', height: '1px', backgroundColor: '#B88E3A' }} />
                    <h2 style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 600 }}>
                      Número comercial
                    </h2>
                  </div>
                  <label style={FIELD.label}>WhatsApp comercial</label>
                  <input
                    type="text"
                    value={draft.number}
                    onChange={e => setDraft({ ...draft, number: e.target.value })}
                    placeholder="+54 9 351 XXX XXXX"
                    style={FIELD.input}
                    onFocus={e => (e.target.style.borderColor = 'rgba(184,142,58,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(245,242,236,0.1)')}
                  />
                  <p style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.25)', marginTop: '8px', lineHeight: 1.6 }}>
                    Ingresá el número en formato internacional sin espacios ni guiones. Ej: 5493515000000
                  </p>
                </div>

                {/* Message templates */}
                <div style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '28px' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div style={{ width: '28px', height: '1px', backgroundColor: '#B88E3A' }} />
                    <h2 style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 600 }}>
                      Plantillas de mensajes
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6">
                    {[
                      { key: 'projectMsg' as keyof WAConfig, label: 'Emprendimientos', placeholder: 'Hola ORIGEN, quiero consultar por el emprendimiento {nombre}.' },
                      { key: 'propertyMsg' as keyof WAConfig, label: 'Propiedades', placeholder: 'Hola ORIGEN, quiero consultar por la propiedad {nombre}.' },
                      { key: 'landMsg' as keyof WAConfig, label: 'Terrenos', placeholder: 'Hola ORIGEN, quiero consultar por el terreno {nombre}.' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label style={FIELD.label}>{label}</label>
                        <textarea
                          rows={2}
                          value={draft[key] as string}
                          onChange={e => setDraft({ ...draft, [key]: e.target.value })}
                          placeholder={placeholder}
                          style={FIELD.input}
                          onFocus={e => (e.target.style.borderColor = 'rgba(184,142,58,0.5)')}
                          onBlur={e => (e.target.style.borderColor = 'rgba(245,242,236,0.1)')}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '16px', padding: '12px 14px', backgroundColor: 'rgba(245,242,236,0.03)', border: '1px solid rgba(245,242,236,0.06)' }}>
                    <p style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.35)', lineHeight: 1.7 }}>
                      Podés utilizar <code style={{ color: '#B88E3A', backgroundColor: 'rgba(184,142,58,0.1)', padding: '1px 5px', fontSize: '10px' }}>{'{nombre}'}</code> para insertar automáticamente el nombre del contenido que el visitante está consultando.
                    </p>
                  </div>
                </div>

                {/* Preview */}
                <div style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(184,142,58,0.2)', padding: '28px' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div style={{ width: '28px', height: '1px', backgroundColor: '#B88E3A' }} />
                    <h2 style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 600 }}>
                      Previsualización
                    </h2>
                  </div>

                  <div className="flex flex-col gap-4 mb-6">
                    {[
                      { label: 'Emprendimiento', preview: previewProject },
                      { label: 'Propiedad', preview: previewProperty },
                      { label: 'Terreno', preview: previewLand },
                    ].map(({ label, preview }) => (
                      <div key={label}>
                        <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.3)', marginBottom: '6px' }}>
                          {label}
                        </div>
                        <div style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: 'rgba(245,242,236,0.7)', lineHeight: 1.6, backgroundColor: 'rgba(245,242,236,0.03)', border: '1px solid rgba(245,242,236,0.07)', padding: '12px 14px', fontStyle: 'italic' }}>
                          "{preview}"
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href={testUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                    style={{
                      display: 'inline-flex', fontFamily: "'Montserrat'", fontSize: '9px',
                      letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
                      color: '#B88E3A', border: '1px solid rgba(184,142,58,0.4)',
                      padding: '10px 18px', textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#B88E3A'; e.currentTarget.style.color = '#0D1B2A' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#B88E3A' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Abrir WhatsApp de prueba
                  </a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSave}
                    style={{
                      fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em',
                      textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A',
                      backgroundColor: '#B88E3A', border: '1px solid #B88E3A',
                      padding: '14px 32px', cursor: 'pointer', transition: 'all 0.3s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#B88E3A' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#B88E3A'; e.currentTarget.style.color = '#0D1B2A' }}
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={() => setDraft({ ...waConfig })}
                    style={{
                      fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.18em',
                      textTransform: 'uppercase', fontWeight: 600, color: 'rgba(245,242,236,0.35)',
                      background: 'none', border: '1px solid rgba(245,242,236,0.1)',
                      padding: '14px 24px', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#F5F2EC' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,242,236,0.35)' }}
                  >
                    Cancelar
                  </button>
                </div>

                {/* Model reference */}
                <div style={{ padding: '20px 24px', border: '1px solid rgba(245,242,236,0.06)', backgroundColor: 'rgba(245,242,236,0.02)' }}>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.25)', marginBottom: '10px' }}>
                    Modelo de datos · SITE SETTINGS
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'whatsapp_number',
                      'whatsapp_message_project',
                      'whatsapp_message_property',
                      'whatsapp_message_land',
                    ].map(key => (
                      <div key={key} style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.25)', padding: '6px 10px', backgroundColor: 'rgba(245,242,236,0.02)', border: '1px solid rgba(245,242,236,0.06)' }}>
                        <code>{key}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
