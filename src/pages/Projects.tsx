import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import { EMPRENDIMIENTOS } from '../data/listings'
import type { NavProps } from '../types'

const ubicaciones = ['Todas', ...Array.from(new Set(EMPRENDIMIENTOS.map(e => e.barrio).filter(Boolean) as string[]))]

export default function Projects({ navigate, waConfig }: NavProps) {
  const [ubicacion, setUbicacion] = useState('Todas')

  const filtered = EMPRENDIMIENTOS.filter(e => {
    if (ubicacion !== 'Todas' && e.barrio !== ubicacion) return false
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

  return (
    <main style={{ paddingTop: '80px', backgroundColor: '#F5F2EC', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#0D1B2A', padding: '72px 0 0' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '14px' }}>
            Desarrollo
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, color: '#F5F2EC', marginBottom: '14px' }}>
            Emprendimientos
          </h1>
          <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: 'rgba(245,242,236,0.55)', lineHeight: 1.7, marginBottom: '48px' }}>
            Proyectos que abren nuevas oportunidades.
          </p>

          <div style={{ borderTop: '1px solid rgba(245,242,236,0.08)', paddingTop: '28px', paddingBottom: '32px' }}>
            <div className="flex flex-col gap-2">
              <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)' }}>Ubicación</div>
              <div className="flex gap-2 flex-wrap">
                {ubicaciones.map(u => (
                  <button key={u} onClick={() => setUbicacion(u)} style={filterStyle(ubicacion === u)}>{u}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B', marginBottom: '24px' }}>
          {filtered.length} {filtered.length === 1 ? 'emprendimiento' : 'emprendimientos'}
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(e => <ProjectCard key={e.id} listing={e} navigate={navigate} waConfig={waConfig} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div style={{ fontFamily: "'Playfair Display'", fontSize: '22px', color: '#0D1B2A', marginBottom: '10px' }}>Sin resultados</div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: '#5C636B' }}>Probá con otros filtros.</div>
          </div>
        )}
      </div>
    </main>
  )
}
