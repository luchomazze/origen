import type { WAConfig } from './utils/whatsapp'

export type Page = 'home' | 'properties' | 'lands' | 'projects' | 'property-detail' | 'land-detail' | 'project-detail' | 'contact' | 'admin' | 'not-found'

export interface NavProps {
  navigate: (to: Page, project?: string) => void
  waConfig: WAConfig
  onConfigSave: (config: WAConfig) => Promise<void>
}
