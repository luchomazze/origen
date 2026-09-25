import type { NavProps } from '../types'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound({ navigate }: NavProps) {
  usePageMeta({ title: 'Página no encontrada | ORIGEN', description: 'La página que buscás no existe o fue movida.', path: window.location.pathname })

  return (
    <main style={{ paddingTop: '80px', backgroundColor: '#F5F2EC', minHeight: '100vh' }}>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12" style={{ padding: '160px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '18px' }}>
          Error 404
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, color: '#0D1B2A', marginBottom: '16px' }}>
          Esta página no existe.
        </h1>
        <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 40px' }}>
          Puede que el link esté mal escrito o que la publicación ya no esté disponible.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('home')}
            style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A', backgroundColor: '#B88E3A', border: '1px solid #B88E3A', padding: '13px 24px', cursor: 'pointer' }}
          >
            Ir al inicio
          </button>
          <button
            onClick={() => navigate('properties')}
            style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: '#0D1B2A', background: 'none', border: '1px solid rgba(13,27,42,0.2)', padding: '13px 24px', cursor: 'pointer' }}
          >
            Propiedades
          </button>
          <button
            onClick={() => navigate('lands')}
            style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: '#0D1B2A', background: 'none', border: '1px solid rgba(13,27,42,0.2)', padding: '13px 24px', cursor: 'pointer' }}
          >
            Terrenos
          </button>
          <button
            onClick={() => navigate('projects')}
            style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: '#0D1B2A', background: 'none', border: '1px solid rgba(13,27,42,0.2)', padding: '13px 24px', cursor: 'pointer' }}
          >
            Emprendimientos
          </button>
        </div>
      </div>
    </main>
  )
}
