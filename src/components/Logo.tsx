import logoSrc from '../assets/logo-origen.png'
import { TEXTS } from '../content/texts'

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
      alt={TEXTS.brand.logoAlt}
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
