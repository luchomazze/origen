import { requireSupabase } from '../lib/supabase'
import { DEFAULT_CONFIG, type WAConfig } from '../utils/whatsapp'

interface SiteSettingsRow {
  id: string
  whatsapp_number: string
  whatsapp_template_emprendimiento: string
  whatsapp_template_propiedad: string
  whatsapp_template_terreno: string
  instagram_url: string
}

// site_settings holds a single row; its id is a uuid in production.
async function getSettingsRow(): Promise<SiteSettingsRow | null> {
  const { data, error } = await requireSupabase()
    .from('site_settings')
    .select('id, whatsapp_number, whatsapp_template_emprendimiento, whatsapp_template_propiedad, whatsapp_template_terreno, instagram_url')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<SiteSettingsRow>()

  if (error) throw error
  return data
}

export async function getWAConfig(): Promise<WAConfig> {
  const data = await getSettingsRow()
  if (!data) return { ...DEFAULT_CONFIG }

  return {
    number: data.whatsapp_number ?? '',
    projectMsg: data.whatsapp_template_emprendimiento ?? DEFAULT_CONFIG.projectMsg,
    propertyMsg: data.whatsapp_template_propiedad ?? DEFAULT_CONFIG.propertyMsg,
    landMsg: data.whatsapp_template_terreno ?? DEFAULT_CONFIG.landMsg,
    instagramUrl: data.instagram_url ?? DEFAULT_CONFIG.instagramUrl,
  }
}

export async function saveWAConfig(config: WAConfig): Promise<void> {
  const values = {
    whatsapp_number: config.number,
    whatsapp_template_emprendimiento: config.projectMsg,
    whatsapp_template_propiedad: config.propertyMsg,
    whatsapp_template_terreno: config.landMsg,
    instagram_url: config.instagramUrl,
  }
  const existing = await getSettingsRow()
  const supabase = requireSupabase()
  const { error } = existing
    ? await supabase.from('site_settings').update(values).eq('id', existing.id)
    : await supabase.from('site_settings').insert(values)

  if (error) throw error
}
