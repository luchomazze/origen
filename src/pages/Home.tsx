import { useEffect, useRef, useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import ProjectCard from '../components/ProjectCard'
import type { NavProps } from '../types'
import type { Page } from '../types'
import { buildWAUrl } from '../utils/whatsapp'
import { PROPIEDADES, EMPRENDIMIENTOS } from '../data/listings'

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1706164971302-e30c0640cc3b',
  propiedades: 'https://images.unsplash.com/photo-1721815693498-cc28507c0ba2',
  terrenos: 'https://images.unsplash.com/photo-1637071985253-e5417fa2a47b',
  emprendimientos: 'https://images.unsplash.com/photo-1624204386084-dd8c05e32226',
  vivir: 'https://images.unsplash.com/photo-1724582586529-62622e50c0b3',
  invertir: 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6',
  zona: 'https://images.unsplash.com/photo-1699375348655-c4564465969b',
  cta: 'https://images.unsplash.com/photo-1628012209120-d9db7abf7eab',
}

const featuredProjects = EMPRENDIMIENTOS.slice(0, 3)
const featuredProperties = PROPIEDADES.slice(0, 4)

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const ZONES = ['MANANTIALES', 'BARRIO JARDÍN', 'JARDINES DEL JOCKEY', 'CAMINO SAN CARLOS']
const VALUES = [
  { label: 'Profesionalismo', desc: 'Asesoramiento serio y comprometido en cada etapa de tu operación.' },
  { label: 'Transparencia', desc: 'Información clara y honesta para que tomes decisiones con confianza.' },
  { label: 'Confianza', desc: 'Construida operación a operación, con personas que vuelven.' },
  { label: 'Claridad', desc: 'Sin tecnicismos innecesarios. Directo al punto que importa.' },
]

export default function Home({ navigate, waConfig }: NavProps) {
  const heroWaUrl = buildWAUrl(waConfig, 'propertyMsg', 'Consulta general')
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex items-end" style={{ height: '100svh', minHeight: '600px', backgroundColor: '#0D1B2A' }}>
        <img
          src={`${IMAGES.hero}?w=1600&h=1100&fit=crop&auto=format`}
          alt="Arquitectura residencial premium Córdoba"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.3) 50%, transparent 100%)' }} />

        <div className="relative w-full max-w-screen-xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <div style={{ width: '32px', height: '1px', backgroundColor: '#B88E3A' }} />
              <span style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500 }}>
                Córdoba · Zona Sur
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 600, color: '#F5F2EC', lineHeight: 1.15, marginBottom: '20px' }}>
              Cada gran decisión inmobiliaria tiene un origen.
            </h1>
            <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: 'rgba(245,242,236,0.7)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '480px' }}>
              Propiedades, terrenos y emprendimientos seleccionados en Córdoba.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('projects')}
                style={{
                  fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontWeight: 600, color: '#0D1B2A',
                  backgroundColor: '#F5F2EC', border: '1px solid #F5F2EC',
                  padding: '14px 28px', cursor: 'pointer', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#F5F2EC' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F5F2EC'; e.currentTarget.style.color = '#0D1B2A' }}
              >
                Conocé nuestros proyectos
              </button>
              <a
                href={heroWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
                style={{
                  fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontWeight: 600, color: '#B88E3A',
                  backgroundColor: 'transparent', border: '1px solid rgba(184,142,58,0.6)',
                  padding: '14px 28px', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#B88E3A'; e.currentTarget.style.color = '#0D1B2A' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#B88E3A' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 lg:right-12 flex flex-col items-center gap-2" style={{ opacity: 0.5 }}>
          <div style={{ width: '1px', height: '40px', backgroundColor: '#F5F2EC' }} />
          <span style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5F2EC', writingMode: 'vertical-rl' }}>scroll</span>
        </div>
      </section>

      {/* ── ¿QUÉ ESTÁS BUSCANDO? ─────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F2EC', paddingTop: '96px', paddingBottom: '96px' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <FadeSection>
            <div className="mb-14">
              <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '12px' }}>
                Nuestros servicios
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 600, color: '#0D1B2A', marginBottom: '12px' }}>
                ¿Qué estás buscando?
              </h2>
              <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', lineHeight: 1.7, maxWidth: '480px' }}>
                Encontrá la alternativa que mejor se adapta a tu próximo proyecto.
              </p>
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(13,27,42,0.08)' }}>
            {[
              { num: '01', title: 'Propiedades', desc: 'Casas, departamentos y propiedades seleccionadas para vivir o invertir.', cta: 'Ver propiedades', page: 'properties' as Page, img: IMAGES.propiedades },
              { num: '02', title: 'Terrenos', desc: 'Lotes y terrenos con potencial para construir, invertir o desarrollar.', cta: 'Ver terrenos', page: 'lands' as Page, img: IMAGES.terrenos },
              { num: '03', title: 'Emprendimientos', desc: 'Proyectos inmobiliarios y oportunidades de inversión desde el pozo.', cta: 'Ver emprendimientos', page: 'projects' as Page, img: IMAGES.emprendimientos },
            ].map((item, i) => (
              <FadeSection key={item.num} delay={i * 120}>
                <div
                  className="group relative overflow-hidden cursor-pointer flex flex-col justify-end"
                  style={{ height: '440px', backgroundColor: '#0D1B2A' }}
                  onClick={() => navigate(item.page)}
                >
                  <img
                    src={`${item.img}?w=700&h=880&fit=crop&auto=format`}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ opacity: 0.5 }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.95) 0%, rgba(13,27,42,0.1) 70%)' }} />
                  <div className="relative p-8">
                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '48px', color: 'rgba(184,142,58,0.2)', fontWeight: 700, lineHeight: 1, marginBottom: '6px', letterSpacing: '-0.02em' }}>
                      {item.num}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 600, color: '#F5F2EC', marginBottom: '10px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: 'rgba(245,242,236,0.6)', lineHeight: 1.65, marginBottom: '20px' }}>
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-2 transition-all group-hover:gap-4">
                      <span style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#B88E3A' }}>
                        {item.cta}
                      </span>
                      <div style={{ width: '20px', height: '1px', backgroundColor: '#B88E3A', transition: 'width 0.3s' }} className="group-hover:w-8" />
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMPRENDIMIENTOS DESTACADOS ────────────────────────────────── */}
      <section style={{ backgroundColor: '#0D1B2A', paddingTop: '96px', paddingBottom: '96px' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <FadeSection>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6">
              <div>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '12px' }}>
                  Proyectos en desarrollo
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 600, color: '#F5F2EC', maxWidth: '500px', lineHeight: 1.2 }}>
                  Proyectos para mirar hacia adelante.
                </h2>
              </div>
              <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.5)', lineHeight: 1.7, maxWidth: '320px' }}>
                Conocé nuestros emprendimientos y descubrí nuevas oportunidades para vivir o invertir.
              </p>
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(245,242,236,0.06)' }}>
            {featuredProjects.map((project, i) => (
              <FadeSection key={project.id} delay={i * 100}>
                <ProjectCard listing={project} navigate={navigate} waConfig={waConfig} />
              </FadeSection>
            ))}
          </div>

          <FadeSection>
            <div className="mt-12 text-center">
              <button
                onClick={() => navigate('projects')}
                style={{
                  fontFamily: "'Montserrat'",
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#B88E3A',
                  border: '1px solid rgba(184,142,58,0.4)',
                  padding: '14px 36px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#B88E3A'; e.currentTarget.style.color = '#0D1B2A' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#B88E3A' }}
              >
                Ver todos los emprendimientos
              </button>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── VIVIR / INVERTIR ─────────────────────────────────────────── */}
      <section>
        <FadeSection>
          <div style={{ marginBottom: '2px', paddingTop: '96px', backgroundColor: '#F5F2EC', paddingLeft: '24px', paddingRight: '24px', maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 600, color: '#0D1B2A', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              Una propiedad puede ser mucho más que una propiedad.
            </h2>
          </div>
        </FadeSection>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {[
            { title: 'Para vivir', desc: 'Encontrá un lugar que acompañe la vida que querés construir.', cta: 'Encontrar mi propiedad', page: 'properties' as Page, img: IMAGES.vivir },
            { title: 'Para invertir', desc: 'Analizá oportunidades inmobiliarias pensadas para construir patrimonio.', cta: 'Ver oportunidades', page: 'projects' as Page, img: IMAGES.invertir },
          ].map(item => (
            <div
              key={item.title}
              className="group relative overflow-hidden flex items-end cursor-pointer"
              style={{ height: '480px', backgroundColor: '#0D1B2A' }}
              onClick={() => navigate(item.page)}
            >
              <img
                src={`${item.img}?w=800&h=960&fit=crop&auto=format`}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ opacity: 0.45 }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.92) 0%, transparent 60%)' }} />
              <div className="relative p-10 lg:p-14">
                <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '10px' }}>
                  ORIGEN
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '34px', fontWeight: 600, color: '#F5F2EC', marginBottom: '12px' }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.65)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '320px' }}>
                  {item.desc}
                </p>
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#B88E3A' }}>
                    {item.cta}
                  </span>
                  <div style={{ width: '24px', height: '1px', backgroundColor: '#B88E3A', transition: 'width 0.3s' }} className="group-hover:w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONOCEMOS CÓRDOBA SUR ─────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F2EC', paddingTop: '96px', paddingBottom: '96px' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeSection>
              <div>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '14px' }}>
                  Nuestra especialidad
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: '#0D1B2A', lineHeight: 1.2, marginBottom: '20px' }}>
                  Conocemos dónde empieza el crecimiento.
                </h2>
                <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', lineHeight: 1.8, marginBottom: '36px' }}>
                  Trabajamos principalmente en Córdoba Sur, acompañando a quienes buscan comprar, vender o invertir en una de las zonas de mayor desarrollo de la ciudad.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {ZONES.map(z => (
                    <div
                      key={z}
                      style={{
                        fontFamily: "'Montserrat'",
                        fontSize: '9px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        color: '#0D1B2A',
                        border: '1px solid rgba(13,27,42,0.15)',
                        padding: '12px 14px',
                        backgroundColor: 'transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      {z}
                    </div>
                  ))}
                </div>
              </div>
            </FadeSection>

            <FadeSection delay={150}>
              <div className="relative overflow-hidden" style={{ height: '480px', backgroundColor: '#DCC8A3' }}>
                <img
                  src={`${IMAGES.zona}?w=800&h=960&fit=crop&auto=format`}
                  alt="Córdoba Sur zona residencial"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,27,42,0.2) 0%, transparent 60%)' }} />
                <div className="absolute bottom-6 left-6 right-6 p-4" style={{ backgroundColor: 'rgba(13,27,42,0.85)', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '4px' }}>
                    Zona de foco
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px', color: '#F5F2EC', fontWeight: 600 }}>
                    Córdoba Sur
                  </div>
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ── PROPIEDADES SELECCIONADAS ─────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F2EC', paddingBottom: '96px' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div style={{ height: '1px', backgroundColor: 'rgba(13,27,42,0.08)', marginBottom: '64px' }} />
          <FadeSection>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6">
              <div>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '12px' }}>
                  Destacadas
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: '#0D1B2A' }}>
                  Propiedades seleccionadas
                </h2>
              </div>
              <button
                onClick={() => navigate('properties')}
                style={{
                  fontFamily: "'Montserrat'",
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#0D1B2A',
                  border: '1px solid rgba(13,27,42,0.25)',
                  padding: '11px 24px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0D1B2A'; e.currentTarget.style.color = '#F5F2EC' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0D1B2A' }}
              >
                Ver todas las propiedades
              </button>
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProperties.map((p, i) => (
              <FadeSection key={p.id} delay={i * 80}>
                <PropertyCard listing={p} waConfig={waConfig} navigate={navigate} />
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ORIGEN ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0D1B2A', paddingTop: '96px', paddingBottom: '96px' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <FadeSection>
            <div className="mb-16 text-center">
              <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '14px' }}>
                Por qué elegirnos
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: '#F5F2EC', maxWidth: '540px', margin: '0 auto', lineHeight: 1.25 }}>
                Decidir bien también es parte de la inversión.
              </h2>
              <p style={{ fontFamily: "'Montserrat'", fontSize: '13px', color: 'rgba(245,242,236,0.5)', lineHeight: 1.7, maxWidth: '440px', margin: '16px auto 0' }}>
                Acompañamos cada operación con información clara, atención personalizada y una mirada orientada al largo plazo.
              </p>
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(245,242,236,0.06)' }}>
            {VALUES.map((v, i) => (
              <FadeSection key={v.label} delay={i * 100}>
                <div className="p-8 lg:p-10" style={{ backgroundColor: '#0D1B2A' }}>
                  <div style={{ width: '28px', height: '1px', backgroundColor: '#B88E3A', marginBottom: '20px' }} />
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 600, color: '#F5F2EC', marginBottom: '12px' }}>
                    {v.label}
                  </h3>
                  <p style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: 'rgba(245,242,236,0.5)', lineHeight: 1.7 }}>
                    {v.desc}
                  </p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOSOTROS BRIEF ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F2EC', paddingTop: '96px', paddingBottom: '96px' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <FadeSection>
              <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '14px' }}>
                Quiénes somos
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: '#0D1B2A', marginBottom: '28px', lineHeight: 1.25 }}>
                El origen de una buena decisión.
              </h2>
              <p style={{ fontFamily: "'Montserrat'", fontSize: '15px', color: '#5C636B', lineHeight: 1.85, marginBottom: '18px' }}>
                En ORIGEN creemos que cada operación inmobiliaria comienza mucho antes de una firma. Comienza con una decisión, una necesidad o un proyecto.
              </p>
              <p style={{ fontFamily: "'Montserrat'", fontSize: '15px', color: '#5C636B', lineHeight: 1.85, marginBottom: '36px' }}>
                Nuestro objetivo es acompañarte con información, conocimiento y una mirada clara sobre cada oportunidad.
              </p>
              <button
                onClick={() => navigate('contact')}
                style={{
                  fontFamily: "'Montserrat'",
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#0D1B2A',
                  border: '1px solid rgba(13,27,42,0.3)',
                  padding: '13px 28px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0D1B2A'; e.currentTarget.style.color = '#F5F2EC' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0D1B2A' }}
              >
                Conocer más sobre Origen
              </button>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center" style={{ height: '520px', backgroundColor: '#0D1B2A' }}>
        <img
          src={`${IMAGES.cta}?w=1400&h=1040&fit=crop&auto=format`}
          alt="Arquitectura premium"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(13,27,42,0.72)' }} />
        <div className="relative text-center px-6">
          <FadeSection>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, color: '#F5F2EC', marginBottom: '12px', lineHeight: 1.15 }}>
              Todo proyecto tiene un origen.
            </h2>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(18px, 2.5vw, 26px)', fontStyle: 'italic', color: 'rgba(245,242,236,0.65)', marginBottom: '40px' }}>
              Encontrá el tuyo.
            </p>
            <a
              href="https://wa.me/5493515000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'Montserrat'",
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#0D1B2A',
                backgroundColor: '#B88E3A',
                border: '1px solid #B88E3A',
                padding: '16px 36px',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#B88E3A' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#B88E3A'; e.currentTarget.style.color = '#0D1B2A' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Hablar con Origen
            </a>
          </FadeSection>
        </div>
      </section>
    </main>
  )
}
