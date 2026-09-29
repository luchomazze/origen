import { useEffect, useState } from 'react'

/** Precarga la imagen anterior y la siguiente para que el cambio con las flechas sea instantáneo. */
export function usePreloadNeighbors(urls: string[], active: number, enabled = true) {
  useEffect(() => {
    if (!enabled || urls.length < 2) return
    for (const index of [active + 1, active - 1]) {
      new Image().src = urls[(index + urls.length) % urls.length]
    }
  }, [urls, active, enabled])
}

interface Props {
  images: string[]
  alt: string
  sizeParams: string
}

const ARROW_STYLE = {
  position: 'absolute' as const,
  top: '50%',
  transform: 'translateY(-50%)',
  width: '26px',
  height: '26px',
  backgroundColor: 'rgba(13,27,42,0.65)',
  border: '1px solid rgba(245,242,236,0.2)',
  color: '#F5F2EC',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
}

export default function ListingImageSlider({ images, alt, sizeParams }: Props) {
  const [active, setActive] = useState(0)
  // En los catálogos solo se precarga al pasar el mouse o tocar, para no bajar fotos de todas las tarjetas.
  const [warm, setWarm] = useState(false)
  usePreloadNeighbors(images.map(image => `${image}?${sizeParams}&fit=crop&auto=format`), active, warm)

  if (images.length === 0) return null

  const prev = (event: React.MouseEvent) => {
    event.stopPropagation()
    setWarm(true)
    setActive(a => (a - 1 + images.length) % images.length)
  }

  const next = (event: React.MouseEvent) => {
    event.stopPropagation()
    setWarm(true)
    setActive(a => (a + 1) % images.length)
  }

  return (
    <>
      <img
        src={`${images[active]}?${sizeParams}&fit=crop&auto=format`}
        alt={alt}
        onPointerEnter={() => setWarm(true)}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Imagen anterior"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ ...ARROW_STYLE, left: '8px' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Imagen siguiente"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ ...ARROW_STYLE, right: '8px' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ position: 'absolute', bottom: '8px', right: '8px', fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.05em', color: 'rgba(245,242,236,0.85)', backgroundColor: 'rgba(13,27,42,0.55)', padding: '3px 8px', backdropFilter: 'blur(4px)' }}
          >
            {active + 1} / {images.length}
          </div>
        </>
      )}
    </>
  )
}
