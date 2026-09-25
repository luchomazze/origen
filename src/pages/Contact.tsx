import type { NavProps } from '../types'
import { buildWAMessageUrl, instagramHandle } from '../utils/whatsapp'
import { usePageMeta } from '../hooks/usePageMeta'
import { buildPath } from '../utils/routing'
import { TEXTS } from '../content/texts'

export default function Contact({ navigate: _, waConfig }: NavProps) {
  const waUrl = buildWAMessageUrl(waConfig, TEXTS.common.generalInquiryMessage)
  usePageMeta({ title: `${TEXTS.contact.title} | ORIGEN`, description: TEXTS.contact.intro, path: buildPath('contact') })

  return (
    <main style={{ paddingTop: '80px', backgroundColor: '#F5F2EC', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0D1B2A', padding: '72px 0 56px' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '14px' }}>
            {TEXTS.contact.eyebrow}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, color: '#F5F2EC', marginBottom: '14px' }}>
            {TEXTS.contact.title}
          </h1>
          <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: 'rgba(245,242,236,0.55)', lineHeight: 1.7, maxWidth: '520px' }}>
            {TEXTS.contact.intro}
          </p>
        </div>
      </div>

      {/* About section */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div style={{ width: '28px', height: '1px', backgroundColor: '#B88E3A', marginBottom: '24px' }} />
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#0D1B2A', marginBottom: '20px', lineHeight: 1.25 }}>
              {TEXTS.contact.aboutTitle}
            </h2>
            <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', lineHeight: 1.85, marginBottom: '18px' }}>
              {TEXTS.contact.aboutParagraph1}
            </p>
            <p style={{ fontFamily: "'Montserrat'", fontSize: '14px', color: '#5C636B', lineHeight: 1.85, marginBottom: '36px' }}>
              {TEXTS.contact.aboutParagraph2}
            </p>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4">
              {TEXTS.contact.values.map(v => (
                <div key={v.title} style={{ borderLeft: '2px solid #B88E3A', paddingLeft: '14px' }}>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A', marginBottom: '5px' }}>
                    {v.title}
                  </div>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: '#5C636B', lineHeight: 1.6 }}>
                    {v.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B88E3A', fontWeight: 500, marginBottom: '24px' }}>
              {TEXTS.contact.howToReachUs}
            </div>

            <div className="flex flex-col gap-5 mb-10">
              <div style={{ borderBottom: '1px solid rgba(13,27,42,0.08)', paddingBottom: '20px' }}>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5C636B', marginBottom: '6px' }}>{TEXTS.common.whatsapp}</div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', color: '#0D1B2A', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#B88E3A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#0D1B2A')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#B88E3A', flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  {TEXTS.contact.whatsappLink}
                </a>
              </div>

              <div style={{ borderBottom: '1px solid rgba(13,27,42,0.08)', paddingBottom: '20px' }}>
                <div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5C636B', marginBottom: '6px' }}>{TEXTS.common.instagram}</div>
                <a
                  href={waConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', color: '#0D1B2A', fontWeight: 600, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#B88E3A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#0D1B2A')}
                >
                  {instagramHandle(waConfig.instagramUrl)}
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
