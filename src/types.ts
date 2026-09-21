import type { WAConfig } from './utils/whatsapp'

export type Page = 'home' | 'properties' | 'lands' | 'projects' | 'property-detail' | 'land-detail' | 'project-detail' | 'contact' | 'admin'

export interface NavProps {
  navigate: (to: Page, project?: string) => void
  waConfig: WAConfig
  onConfigSave: (config: WAConfig) => void
}
