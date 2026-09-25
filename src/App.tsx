import { useEffect, useState } from 'react'
import { getPublicListings } from './data/listingsApi'
import { buildPath, parsePath } from './utils/routing'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Lands from './pages/Lands'
import Projects from './pages/Projects'
import Detail from './pages/Detail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { getWAConfig, saveWAConfig } from './data/siteSettingsApi'
import { DEFAULT_CONFIG } from './utils/whatsapp'
import type { WAConfig } from './utils/whatsapp'
import type { Page } from './types'
import { TEXTS } from './content/texts'

interface AdminRouteProps {
  navigate: (to: Page, slug?: string) => void
  waConfig: WAConfig
  onConfigSave: (config: WAConfig) => Promise<void>
}

function AdminRoute({ navigate, waConfig, onConfigSave }: AdminRouteProps) {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#080f18', color: '#B88E3A', fontFamily: "'Montserrat', system-ui, sans-serif", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{TEXTS.admin.loadingSession}</div>
  }

  if (!session) return <AdminLogin navigate={navigate} />

  return <Admin navigate={navigate} waConfig={waConfig} onConfigSave={onConfigSave} />
}

const initialRoute = parsePath(window.location.pathname)

export default function App() {
  const [page, setPage] = useState<Page>(initialRoute.page)
  const [selectedSlug, setSelectedSlug] = useState<string>(initialRoute.slug ?? 'origen-park')
  const [waConfig, setWaConfig] = useState<WAConfig>(DEFAULT_CONFIG)

  const navigate = (to: Page, slug?: string) => {
    if (slug) setSelectedSlug(slug)
    setPage(to)
    window.scrollTo({ top: 0 })
    const path = buildPath(to, slug)
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
  }

  useEffect(() => {
    const onPopState = () => {
      const route = parsePath(window.location.pathname)
      setPage(route.page)
      if (route.slug) setSelectedSlug(route.slug)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handleConfigSave = async (config: WAConfig) => {
    await saveWAConfig(config)
    setWaConfig(config)
  }

  const isAdmin = page === 'admin'

  useEffect(() => {
    getWAConfig().then(setWaConfig).catch(() => {})
    getPublicListings('PROPIEDAD')
    getPublicListings('TERRENO')
    getPublicListings('EMPRENDIMIENTO')
  }, [])

  return (
    <AuthProvider>
      <div className="min-h-screen" style={{ fontFamily: "'Montserrat', system-ui, sans-serif", backgroundColor: '#F5F2EC' }}>
        {!isAdmin && <Header page={page} navigate={navigate} />}
        {page === 'home' && <Home navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {page === 'properties' && <Properties navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {page === 'lands' && <Lands navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {page === 'projects' && <Projects navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {page === 'property-detail' && <Detail slug={selectedSlug} tipo="PROPIEDAD" navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {page === 'land-detail' && <Detail slug={selectedSlug} tipo="TERRENO" navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {page === 'project-detail' && <Detail slug={selectedSlug} tipo="EMPRENDIMIENTO" navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {page === 'contact' && <Contact navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {page === 'not-found' && <NotFound navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {page === 'admin' && <AdminRoute navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {!isAdmin && <Footer navigate={navigate} waConfig={waConfig} />}
      </div>
    </AuthProvider>
  )
}
