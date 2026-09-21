import logoSrc from '../imports/00_guia_identidad_ORIGEN.png'

interface Props {
  size?: 'sm' | 'md'
  /** Use on light backgrounds (no filter). Default is dark-background (white filter). */
  onLight?: boolean
}

export default function Logo({ size = 'md', onLight = false }: Props) {
  const height = size === 'sm' ? 34 : 42

  return (
    <img
      src={logoSrc}
      alt="ORIGEN Inversiones Inmobiliarias"
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        filter: onLight ? 'none' : 'brightness(0) invert(1)',
      }}
    />
  )
}
