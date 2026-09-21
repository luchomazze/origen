export interface WAConfig {
  number: string
  projectMsg: string
  propertyMsg: string
  landMsg: string
}

export const DEFAULT_CONFIG: WAConfig = {
  number: '5493515000000',
  projectMsg: 'Hola ORIGEN, quiero consultar por el emprendimiento {nombre}.',
  propertyMsg: 'Hola ORIGEN, quiero consultar por la propiedad {nombre}.',
  landMsg: 'Hola ORIGEN, quiero consultar por el terreno {nombre}.',
}

export function buildWAUrl(config: WAConfig, template: keyof Omit<WAConfig, 'number'>, name: string): string {
  const msg = config[template].replace('{nombre}', name)
  const num = config.number.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
}

export function resolveMsg(template: string, name: string): string {
  return template.replace('{nombre}', name)
}

export function loadConfig(): WAConfig {
  try {
    const raw = localStorage.getItem('origen_wa_config')
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {}
  return { ...DEFAULT_CONFIG }
}

export function saveConfig(config: WAConfig): void {
  localStorage.setItem('origen_wa_config', JSON.stringify(config))
}
