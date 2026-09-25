import { TEXTS } from '../content/texts'

export interface WAConfig {
  number: string
  projectMsg: string
  propertyMsg: string
  landMsg: string
  instagramUrl: string
}

export const DEFAULT_CONFIG: WAConfig = {
  number: '',
  projectMsg: 'Hola ORIGEN, quiero consultar por el emprendimiento {nombre}.',
  propertyMsg: 'Hola ORIGEN, quiero consultar por la propiedad {nombre}.',
  landMsg: 'Hola ORIGEN, quiero consultar por el terreno {nombre}.',
  instagramUrl: 'https://instagram.com/origeninversiones',
}

export function instagramHandle(url: string): string {
  const handle = url.replace(/\/+$/, '').split('/').pop()
  return handle ? `@${handle}` : TEXTS.common.instagram
}

export function buildWAUrl(config: WAConfig, template: 'projectMsg' | 'propertyMsg' | 'landMsg', name: string): string {
  const msg = config[template].replace('{nombre}', name)
  const num = config.number.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
}

export function resolveMsg(template: string, name: string): string {
  return template.replace('{nombre}', name)
}

export function buildWAContactUrl(config: WAConfig): string {
  return `https://wa.me/${config.number.replace(/\D/g, '')}`
}

/** Para mensajes que no encajan en ninguna de las 3 plantillas configurables (consulta general, por unidad, etc.). */
export function buildWAMessageUrl(config: WAConfig, message: string): string {
  const num = config.number.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
}
