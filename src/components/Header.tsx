import { useState, useEffect } from 'react'
import Logo from './Logo'
import type { Page } from '../types'

interface Props {
  page: Page
  navigate: (to: Page) => void
}

const navItems: { label: string; page: Page }[] = [
  { label: 'Inicio', page: 'home' },
  { label: 'Propiedades', page: 'properties' },
  { label: 'Terrenos', page: 'lands' },
  { label: 'Emprendimientos', page: 'projects' },
  { label: 'Nosotros', page: 'contact' },
  { label: 'Contacto', page: 'contact' },
]

export default function Header({ page, navigate }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isHome = page === 'home'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setScrolled(false)
  }, [page])

  const transparent = isHome && !scrolled

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: transparent ? 'transparent' : '#0D1B2A',
          boxShadow: transparent ? 'none' : '0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          <button onClick={() => navigate('home')}>
            <Logo />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.slice(0, -1).map(({ label, page: p }) => (
              <button
                key={label}
                onClick={() => navigate(p)}
                className="transition-colors duration-200"
                style={{
                  fontFamily: "'Montserrat', system-ui, sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: page === p ? '#B88E3A' : 'rgba(245,242,236,0.65)',
                }}
                onMouseEnter={e => { if (page !== p) (e.target as HTMLElement).style.color = '#B88E3A' }}
                onMouseLeave={e => { if (page !== p) (e.target as HTMLElement).style.color = 'rgba(245,242,236,0.65)' }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => navigate('contact')}
              style={{
                fontFamily: "'Montserrat', system-ui, sans-serif",
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#B88E3A',
                border: '1px solid #B88E3A',
                padding: '10px 20px',
                backgroundColor: 'transparent',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.backgroundColor = '#B88E3A'
                el.style.color = '#0D1B2A'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.backgroundColor = 'transparent'
                el.style.color = '#B88E3A'
              }}
            >
              Hablar con Origen
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2"
            style={{ color: '#F5F2EC' }}
            aria-label="Menú"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" />
                  <line x1="18" y1="4" x2="4" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="19" y2="7" />
                  <line x1="3" y1="13" x2="19" y2="13" />
                  <line x1="3" y1="19" x2="14" y2="19" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t" style={{ backgroundColor: '#0D1B2A', borderColor: 'rgba(245,242,236,0.08)' }}>
            <div className="px-6 py-6 flex flex-col gap-6">
              {navItems.map(({ label, page: p }) => (
                <button
                  key={label}
                  onClick={() => navigate(p)}
                  className="text-left transition-colors"
                  style={{
                    fontFamily: "'Montserrat', system-ui, sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    color: page === p ? '#B88E3A' : 'rgba(245,242,236,0.7)',
                  }}
                >
                  {label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => navigate('contact')}
                  style={{
                    fontFamily: "'Montserrat', system-ui, sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: '#B88E3A',
                    border: '1px solid #B88E3A',
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                  }}
                >
                  Hablar con Origen
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
