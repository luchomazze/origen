import { useState } from 'react'
import LandCard from '../components/LandCard'
import { TERRENOS, ALL_SERVICES } from '../data/listings'
import type { NavProps } from '../types'
import { buildWAUrl } from '../utils/whatsapp'

const ubicaciones = ['Todas', ...Array.from(new Set(TERRENOS.map(l => l.barrio).filter(Boolean) as string[]))]

export default function Lands({ navigate, waConfig }: NavProps) {
  const [ubicacion, setUbicacion] = useState('Todas')
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const toggleService = (s: string) =>
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const filtered = TERRENOS.filter(l => {
    if (ubicacion !== 'Todas' && l.barrio !== ubicacion) return false
    if (selectedServices.length > 0) {
      if (!l.services) return false
      if (!selectedServices.every(s => l.services!.includes(s))) return false
    }
    return true
  })

  const filterStyle = (active: boolean) => ({
    fontFamily: "'Montserrat'",
    fontSize: '9px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    color: active ? '#0D1B2A' : 'rgba(245,242,236,0.45)',
    backgroundColor: active ? '#B88E3A' : 'transparent',
    border: `1px solid ${active ? '#B88E3A' : 'rgba(245,242,236,0.15)'}`,
    padding: '9px 18px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  const ctaUrl = waConfig ? buildWAUrl(waConfig, 'landMsg', 'terreno') : 'https://wa.me/5493515000000'

  return (
    <main style={{ paddingTop: '80px', backgroundColor: '#F5F2EC', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#0D1B2A', padding: '72px 0 0' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '14px' }}>
            Catálogo
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, color: '#F5F2EC', marginBottom: '14px' }}>
            Terrenos
          </h1>
          <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: 'rgba(245,242,236,0.55)', lineHeight: 1.7, marginBottom: '48px' }}>
            Espacios para construir, desarrollar o invertir.
          </p>

          <div style={{ borderTop: '1px solid rgba(245,242,236,0.08)', paddingTop: '28px', paddingBottom: '32px' }}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)' }}>Ubicación</div>
                <div className="flex gap-2 flex-wrap">
                  {ubicaciones.map(u => <button key={u} onClick={() => setUbicacion(u)} style={filterStyle(ubicacion === u)}>{u}</button>)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)' }}>Servicios</div>
                <div className="flex gap-2 flex-wrap">
                  {ALL_SERVICES.map(s => (
                    <button key={s} onClick={() => toggleService(s)} style={filterStyle(selectedServices.includes(s))}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B', marginBottom: '24px' }}>
          {filtered.length} {filtered.length === 1 ? 'terreno' : 'terrenos'}
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(l => <LandCard key={l.id} listing={l} waConfig={waConfig} navigate={navigate} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div style={{ fontFamily: "'Playfair Display'", fontSize: '22px', color: '#0D1B2A', marginBottom: '10px' }}>Sin resultados</div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: '#5C636B' }}>Probá con otros filtros.</div>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#0D1B2A', padding: '64px 0', marginTop: '32px' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#F5F2EC', marginBottom: '8px' }}>
              ¿Buscás un terreno específico?
            </h3>
            <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.5)', lineHeight: 1.7 }}>
              Contanos qué necesitás y te acompañamos a encontrarlo.
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
            Hablar con ORIGEN
          </a>
        </div>
      </div>
    </main>
  )
}
