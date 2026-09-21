import { useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import { PROPIEDADES } from '../data/listings'
import type { TipoPropiedad } from '../data/listings'
import type { NavProps } from '../types'

const TIPO_LABELS: { value: TipoPropiedad | 'TODOS'; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'CASA', label: 'Casa' },
  { value: 'DEPARTAMENTO', label: 'Departamento' },
  { value: 'PH', label: 'PH' },
  { value: 'LOCAL', label: 'Local' },
  { value: 'OFICINA', label: 'Oficina' },
  { value: 'CAMPO', label: 'Campo' },
  { value: 'CABAÑA', label: 'Cabaña' },
  { value: 'OTRO', label: 'Otro' },
]

const ubicaciones = ['Todas', ...Array.from(new Set(PROPIEDADES.map(p => p.barrio).filter(Boolean) as string[]))]

export default function Properties({ navigate, waConfig }: NavProps) {
  const [ubicacion, setUbicacion] = useState('Todas')
  const [tipo, setTipo] = useState<TipoPropiedad | 'TODOS'>('TODOS')
  const [credito, setCredito] = useState<'todos' | 'si' | 'no'>('todos')

  const filtered = PROPIEDADES.filter(p => {
    if (ubicacion !== 'Todas' && p.barrio !== ubicacion) return false
    if (tipo !== 'TODOS' && p.tipo_propiedad !== tipo) return false
    if (credito === 'si' && !p.apto_credito) return false
    if (credito === 'no' && p.apto_credito) return false
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
            Catálogo
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, color: '#F5F2EC', marginBottom: '14px' }}>
            Propiedades
          </h1>
          <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: 'rgba(245,242,236,0.55)', lineHeight: 1.7, marginBottom: '48px' }}>
            Propiedades seleccionadas para vivir o invertir.
          </p>

          <div style={{ borderTop: '1px solid rgba(245,242,236,0.08)', paddingTop: '28px', paddingBottom: '32px' }}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)' }}>Ubicación</div>
                <div className="flex gap-2 flex-wrap">
                  {ubicaciones.map(u => <button key={u} onClick={() => setUbicacion(u)} style={filterStyle(ubicacion === u)}>{u}</button>)}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="flex flex-col gap-2">
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)' }}>Tipo de propiedad</div>
                  <div className="flex gap-2 flex-wrap">
                    {TIPO_LABELS.map(t => <button key={t.value} onClick={() => setTipo(t.value)} style={filterStyle(tipo === t.value)}>{t.label}</button>)}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.35)' }}>Apto crédito</div>
                  <div className="flex gap-2">
                    {(['todos', 'si', 'no'] as const).map(v => (
                      <button key={v} onClick={() => setCredito(v)} style={filterStyle(credito === v)}>
                        {v === 'todos' ? 'Todos' : v === 'si' ? 'Sí' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B', marginBottom: '24px', letterSpacing: '0.05em' }}>
          {filtered.length} {filtered.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(p => <PropertyCard key={p.id} listing={p} waConfig={waConfig} navigate={navigate} />)}
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
