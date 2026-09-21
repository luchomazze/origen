import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Lands from './pages/Lands'
import Projects from './pages/Projects'
import Detail from './pages/Detail'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { loadConfig, saveConfig } from './utils/whatsapp'
import type { WAConfig } from './utils/whatsapp'
import type { Page } from './types'

interface AdminRouteProps {
  navigate: (to: Page, slug?: string) => void
  waConfig: WAConfig
  onConfigSave: (config: WAConfig) => void
}

function AdminRoute({ navigate, waConfig, onConfigSave }: AdminRouteProps) {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#080f18', color: '#B88E3A', fontFamily: "'Montserrat', system-ui, sans-serif", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Cargando sesión...</div>
  }

  if (!session) return <AdminLogin />

  return <Admin navigate={navigate} waConfig={waConfig} onConfigSave={onConfigSave} />
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [selectedSlug, setSelectedSlug] = useState<string>('origen-park')
  const [waConfig, setWaConfig] = useState<WAConfig>(() => loadConfig())

  const navigate = (to: Page, slug?: string) => {
    if (slug) setSelectedSlug(slug)
    setPage(to)
    window.scrollTo({ top: 0 })
  }

  const handleConfigSave = (config: WAConfig) => {
    saveConfig(config)
    setWaConfig(config)
  }

  const isAdmin = page === 'admin'

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
        {page === 'admin' && <AdminRoute navigate={navigate} waConfig={waConfig} onConfigSave={handleConfigSave} />}
        {!isAdmin && <Footer navigate={navigate} />}
      </div>
    </AuthProvider>
  )
}
