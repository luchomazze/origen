import { TEXTS } from '../content/texts'
import { useEffect, useState } from 'react'
import Logo from '../components/Logo'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminPublications, { EMPTY_FILTERS, type AdminListingFilters } from '../components/admin/AdminPublications'
import { useAuth } from '../auth/AuthProvider'
import { buildWAUrl, instagramHandle, resolveMsg } from '../utils/whatsapp'
import type { NavProps } from '../types'
import type { WAConfig } from '../utils/whatsapp'

type AdminSection = 'dashboard' | 'whatsapp' | 'publicaciones'

const FIELD_LABEL = { fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(245,242,236,0.45)', fontWeight: 600, display: 'block', marginBottom: '8px' }
const FIELD_INPUT = { fontFamily: "'Montserrat'", fontSize: '13px', color: '#F5F2EC', backgroundColor: 'rgba(245,242,236,0.04)', border: '1px solid rgba(245,242,236,0.1)', padding: '12px 14px', width: '100%', outline: 'none', resize: 'none' as const }

export default function Admin({ navigate, waConfig, onConfigSave }: NavProps) {
  const { user, signOut } = useAuth()
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [publicationsFilter, setPublicationsFilter] = useState<Partial<AdminListingFilters>>(EMPTY_FILTERS)
  const [draft, setDraft] = useState<WAConfig>({ ...waConfig })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setDraft({ ...waConfig })
  }, [waConfig])
  const testProject = TEXTS.admin.whatsappSettings.sampleProjectName
  const previewProject = resolveMsg(draft.projectMsg, testProject)
  const previewProperty = resolveMsg(draft.propertyMsg, TEXTS.admin.whatsappSettings.samplePropertyName)
  const previewLand = resolveMsg(draft.landMsg, TEXTS.admin.whatsappSettings.sampleLandName)
  const testUrl = buildWAUrl(draft, 'projectMsg', testProject)

  const handleSave = async () => {
    if (!draft.number.replace(/\D/g, '')) {
      setSaveError(TEXTS.admin.whatsappSettings.numberRequired)
      return
    }
    if (!/^https:\/\/(www\.)?instagram\.com\/[^/\s]+\/?$/.test(draft.instagramUrl.trim())) {
      setSaveError(TEXTS.admin.whatsappSettings.instagramUrlInvalid)
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      await onConfigSave(draft)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : TEXTS.admin.whatsappSettings.saveError)
    } finally {
      setSaving(false)
    }
  }

  const goToSection = (id: AdminSection) => {
    if (id === 'publicaciones') setPublicationsFilter(EMPTY_FILTERS)
    setSection(id)
  }

  const goToPublicationsFiltered = (filters: Partial<AdminListingFilters>) => {
    setPublicationsFilter(filters)
    setSection('publicaciones')
  }

  const navButton = (id: AdminSection, label: string) => (
    <button onClick={() => goToSection(id)} title={sidebarCollapsed ? label : undefined} style={{ fontFamily: "'Montserrat'", fontSize: '11px', letterSpacing: '0.06em', color: section === id ? (id === 'whatsapp' ? '#B88E3A' : '#F5F2EC') : 'rgba(245,242,236,0.4)', backgroundColor: section === id ? 'rgba(245,242,236,0.06)' : 'transparent', border: section === id && id === 'whatsapp' ? '1px solid rgba(184,142,58,0.15)' : '1px solid transparent', padding: '9px 10px', cursor: 'pointer', textAlign: 'left', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sidebarCollapsed ? label.slice(0, 1) : label}</button>
  )

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#080f18', fontFamily: "'Montserrat', system-ui, sans-serif" }}>
      <aside className="flex flex-col" style={{ width: sidebarCollapsed ? '60px' : '220px', minHeight: '100vh', backgroundColor: '#0D1B2A', borderRight: '1px solid rgba(245,242,236,0.06)', flexShrink: 0, transition: 'width 0.2s' }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(245,242,236,0.06)' }}>
          {!sidebarCollapsed && <Logo size="sm" />}
          <button onClick={() => setSidebarCollapsed(c => !c)} title={sidebarCollapsed ? TEXTS.admin.shell.expandMenu : TEXTS.admin.shell.collapseMenu} style={{ color: 'rgba(245,242,236,0.4)', background: 'none', border: '1px solid rgba(245,242,236,0.15)', width: '28px', height: '28px', cursor: 'pointer', flexShrink: 0, fontSize: '12px' }}>{sidebarCollapsed ? '»' : '«'}</button>
        </div>
        <div className="p-4 flex flex-col gap-1 flex-1">
          {!sidebarCollapsed && <div style={{ ...FIELD_LABEL, padding: '8px 10px 4px', marginTop: '8px' }}>{TEXTS.admin.shell.sectionGroupGeneral}</div>}
          {navButton('dashboard', TEXTS.admin.shell.dashboard)}
          {!sidebarCollapsed && <div style={{ ...FIELD_LABEL, padding: '16px 10px 4px' }}>{TEXTS.admin.shell.sectionGroupContent}</div>}
          {navButton('publicaciones', TEXTS.admin.shell.publications)}
          {!sidebarCollapsed && <div style={{ ...FIELD_LABEL, padding: '16px 10px 4px' }}>{TEXTS.admin.shell.sectionGroupSettings}</div>}
          {navButton('whatsapp', TEXTS.admin.shell.whatsapp)}
        </div>
        <div className="p-4" style={{ borderTop: '1px solid rgba(245,242,236,0.06)' }}>
          <button onClick={() => { void signOut() }} title={sidebarCollapsed ? TEXTS.admin.shell.signOut : undefined} style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(245,242,236,0.28)', background: 'none', border: 'none', cursor: 'pointer', display: 'block', marginBottom: '14px', padding: 0, whiteSpace: 'nowrap' }}>{sidebarCollapsed ? '⏻' : TEXTS.admin.shell.signOut}</button>
          <button onClick={() => navigate('home')} title={sidebarCollapsed ? TEXTS.admin.shell.viewSite : undefined} style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(245,242,236,0.35)', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>{sidebarCollapsed ? '←' : TEXTS.admin.shell.viewSiteWithArrow}</button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div style={{ minHeight: '56px', backgroundColor: '#0D1B2A', borderBottom: '1px solid rgba(245,242,236,0.06)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '8px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,242,236,0.3)' }}>{TEXTS.admin.shell.breadcrumbRoot}</span>
          <span style={{ color: 'rgba(245,242,236,0.15)' }}>·</span>
          <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B88E3A' }}>{section === 'whatsapp' ? TEXTS.admin.shell.whatsapp : section === 'publicaciones' ? TEXTS.admin.shell.publications : TEXTS.admin.shell.dashboard}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user?.email && <span style={{ fontSize: '10px', color: 'rgba(245,242,236,0.35)' }}>{user.email}</span>}
            <button onClick={() => navigate('home')} title={TEXTS.admin.shell.homeButtonTooltip} style={{ fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B88E3A', background: 'none', border: '1px solid rgba(184,142,58,0.4)', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{TEXTS.admin.shell.homeButton}</button>
          </div>
        </div>

        <div style={{ padding: '40px 32px', maxWidth: '1100px' }}>
          {section === 'dashboard' && <AdminDashboard onSelectFilter={goToPublicationsFiltered} />}
          {section === 'publicaciones' && <AdminPublications waConfig={waConfig} navigate={navigate} initialFilters={publicationsFilter} />}
          {section === 'whatsapp' && (
            <div>
              <div className="flex items-center justify-between mb-8"><div><h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 600, color: '#F5F2EC', marginBottom: '6px' }}>{TEXTS.admin.whatsappSettings.title}</h1><p style={{ fontSize: '13px', color: 'rgba(245,242,236,0.4)' }}>{TEXTS.admin.whatsappSettings.subtitle}</p></div>{saved && <span style={{ color: '#B88E3A', fontSize: '11px' }}>{TEXTS.admin.whatsappSettings.savedNotice}</span>}</div>
              <div className="flex flex-col gap-8">
                <div style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '28px' }}><label style={FIELD_LABEL}>{TEXTS.admin.whatsappSettings.numberLabel}</label><input value={draft.number} onChange={event => setDraft({ ...draft, number: event.target.value })} style={FIELD_INPUT} /></div>
                <div style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '28px' }}><label style={FIELD_LABEL}>{TEXTS.admin.whatsappSettings.instagramLabel}</label><input value={draft.instagramUrl} onChange={event => setDraft({ ...draft, instagramUrl: event.target.value })} placeholder={TEXTS.admin.whatsappSettings.instagramPlaceholder} style={FIELD_INPUT} /><p style={{ marginTop: '10px', fontSize: '10px', color: 'rgba(245,242,236,0.35)' }}>{TEXTS.admin.whatsappSettings.instagramHint(instagramHandle(draft.instagramUrl))}</p></div>
                <div style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(245,242,236,0.08)', padding: '28px' }}><div className="flex flex-col gap-6">{([['projectMsg', TEXTS.admin.whatsappSettings.projectTemplateLabel], ['propertyMsg', TEXTS.admin.whatsappSettings.propertyTemplateLabel], ['landMsg', TEXTS.admin.whatsappSettings.landTemplateLabel]] as const).map(([key, label]) => <label key={key}><span style={FIELD_LABEL}>{label}</span><textarea rows={2} value={draft[key]} onChange={event => setDraft({ ...draft, [key]: event.target.value })} style={FIELD_INPUT} /></label>)}</div><p style={{ marginTop: '16px', fontSize: '10px', color: 'rgba(245,242,236,0.35)' }}>{TEXTS.admin.whatsappSettings.templateHint}</p></div>
                <div style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(184,142,58,0.2)', padding: '28px' }}><div style={{ ...FIELD_LABEL, color: '#B88E3A' }}>{TEXTS.admin.whatsappSettings.previewTitle}</div><div className="flex flex-col gap-3" style={{ color: 'rgba(245,242,236,0.7)', fontSize: '12px' }}><div>{previewProject}</div><div>{previewProperty}</div><div>{previewLand}</div></div><a href={testUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '20px', color: '#B88E3A', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{TEXTS.admin.whatsappSettings.openTestWhatsapp}</a></div>
                {saveError && <p style={{ fontSize: '12px', color: '#E07A5F' }}>{saveError}</p>}
                <button onClick={() => { void handleSave() }} disabled={saving} style={{ width: 'fit-content', fontFamily: "'Montserrat'", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#0D1B2A', backgroundColor: '#B88E3A', border: '1px solid #B88E3A', padding: '14px 26px', cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? TEXTS.common.saving : TEXTS.common.saveChanges}</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
