import Logo from './Logo'
import { buildWAContactUrl, instagramHandle } from '../utils/whatsapp'
import type { WAConfig } from '../utils/whatsapp'
import type { Page } from '../types'
import { TEXTS } from '../content/texts'

interface Props {
  navigate: (to: Page) => void
  waConfig: WAConfig
}

export default function Footer({ navigate, waConfig }: Props) {
  return (
    <footer style={{ backgroundColor: '#0D1B2A', borderTop: '1px solid rgba(245,242,236,0.08)' }}>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Logo />
            <p style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: 'rgba(245,242,236,0.45)', lineHeight: 1.7, maxWidth: '220px' }}>
              {TEXTS.footer.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 600, marginBottom: '20px' }}>
              {TEXTS.footer.navigationTitle}
            </div>
            <div className="flex flex-col gap-3">
              {(['home', 'properties', 'lands', 'projects', 'contact'] as Page[]).map((p, i) => {
                const labels = [TEXTS.nav.home, TEXTS.nav.properties, TEXTS.nav.lands, TEXTS.nav.projects, TEXTS.nav.contact]
                return (
                  <button
                    key={p}
                    onClick={() => navigate(p)}
                    className="text-left transition-colors"
                    style={{ fontFamily: "'Montserrat'", fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(245,242,236,0.5)', fontWeight: 400 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#B88E3A')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,242,236,0.5)')}
                  >
                    {labels[i]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 600, marginBottom: '20px' }}>
              {TEXTS.footer.contactTitle}
            </div>
            <div className="flex flex-col gap-3">
              <div style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: 'rgba(245,242,236,0.5)' }}>{TEXTS.brand.city}</div>
              <a
                href={buildWAContactUrl(waConfig)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors"
                style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: 'rgba(245,242,236,0.5)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#B88E3A')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,242,236,0.5)')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                {TEXTS.common.whatsapp}
              </a>
              <a
                href={waConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors"
                style={{ fontFamily: "'Montserrat'", fontSize: '12px', color: 'rgba(245,242,236,0.5)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#B88E3A')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,242,236,0.5)')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                {instagramHandle(waConfig.instagramUrl)}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(245,242,236,0.08)' }}>
          <div style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.3)', letterSpacing: '0.12em' }}>
            {TEXTS.brand.copyright}
          </div>
          <div className="flex items-center gap-5">
            <div style={{ fontFamily: "'Montserrat'", fontSize: '10px', color: 'rgba(245,242,236,0.2)', letterSpacing: '0.1em' }}>
              {TEXTS.footer.cityUppercase}
            </div>
            <button
              onClick={() => navigate('admin')}
              style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(245,242,236,0.15)', background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,242,236,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,242,236,0.15)')}
            >
              {TEXTS.footer.adminLink}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
