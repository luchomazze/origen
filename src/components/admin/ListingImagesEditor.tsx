import { useEffect, useId, useState } from 'react'
import {
  deleteListingImage,
  getListingImages,
  reorderListingImages,
  uploadListingImage,
  validateImageFile,
  type ListingImage,
} from '../../data/listingImagesApi'
import { TEXTS } from '../../content/texts'

const BUTTON = { fontFamily: "'Montserrat'", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: 'none', padding: '8px 10px', cursor: 'pointer' }

export default function ListingImagesEditor({ listingId }: { listingId: string }) {
  const inputId = useId()
  const [images, setImages] = useState<ListingImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getListingImages(listingId)
      .then(setImages)
      .catch(reason => setError(reason instanceof Error ? reason.message : TEXTS.admin.images.loadError))
      .finally(() => setLoading(false))
  }

  useEffect(load, [listingId])

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return
    const fileError = files.map(validateImageFile).find(Boolean)
    if (fileError) {
      setError(fileError)
      return
    }
    setUploading(true)
    setError(null)
    try {
      let nextOrder = images.length
      for (const file of files) {
        await uploadListingImage(listingId, file, nextOrder)
        nextOrder += 1
      }
      load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : TEXTS.admin.images.uploadError)
    } finally {
      setUploading(false)
    }
  }

  const move = async (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const reordered = [...images]
    const [image] = reordered.splice(from, 1)
    reordered.splice(to, 0, image)
    setImages(reordered)
    setError(null)
    try {
      await reorderListingImages(reordered)
      load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : TEXTS.admin.images.reorderError)
      load()
    }
  }

  const remove = async (image: ListingImage) => {
    if (!window.confirm(TEXTS.admin.images.confirmDelete)) return
    setError(null)
    try {
      await deleteListingImage(image)
      const remaining = images.filter(current => current.id !== image.id)
      await reorderListingImages(remaining)
      load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : TEXTS.admin.images.deleteError)
    }
  }

  return (
    <section className="lg:col-span-2" style={{ borderTop: '1px solid rgba(245,242,236,0.1)', paddingTop: '22px', marginTop: '4px' }}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div><div style={{ fontFamily: "'Montserrat'", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B88E3A', marginBottom: '7px' }}>{TEXTS.admin.images.title}</div><p style={{ fontFamily: "'Montserrat'", fontSize: '11px', color: 'rgba(245,242,236,0.45)' }}>{TEXTS.admin.images.instructions}</p></div>
        <label htmlFor={inputId} style={{ ...BUTTON, color: '#0D1B2A', backgroundColor: '#DCC8A3', border: '1px solid #DCC8A3', display: 'inline-block', width: 'fit-content' }}>{uploading ? TEXTS.admin.images.uploading : TEXTS.admin.images.addButton}</label>
        <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={upload} disabled={uploading} className="sr-only" />
      </div>
      {error && <p role="alert" style={{ color: '#F0B0B0', fontSize: '11px', marginBottom: '12px' }}>{error}</p>}
      {loading ? <p style={{ color: 'rgba(245,242,236,0.45)', fontSize: '11px' }}>{TEXTS.admin.images.loading}</p> : !images.length ? <p style={{ color: 'rgba(245,242,236,0.45)', fontSize: '11px' }}>{TEXTS.admin.images.empty}</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <article key={image.id} style={{ border: '1px solid rgba(245,242,236,0.12)', backgroundColor: 'rgba(245,242,236,0.03)' }}>
              <div className="relative aspect-[4/3]" style={{ backgroundColor: '#080f18' }}><img src={image.image_url} alt={index === 0 ? TEXTS.admin.images.coverAlt : TEXTS.admin.images.imageAlt(index + 1)} className="w-full h-full object-cover" />{index === 0 && <span style={{ position: 'absolute', top: '8px', left: '8px', padding: '5px 7px', backgroundColor: '#B88E3A', color: '#0D1B2A', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>{TEXTS.admin.images.coverBadge}</span>}</div>
              <div className="flex flex-wrap gap-1 p-2"><button type="button" disabled={index === 0} onClick={() => void move(index, index - 1)} style={{ ...BUTTON, color: index === 0 ? 'rgba(245,242,236,0.2)' : '#DCC8A3', border: '1px solid rgba(220,200,163,0.35)' }}>←</button><button type="button" disabled={index === images.length - 1} onClick={() => void move(index, index + 1)} style={{ ...BUTTON, color: index === images.length - 1 ? 'rgba(245,242,236,0.2)' : '#DCC8A3', border: '1px solid rgba(220,200,163,0.35)' }}>→</button><button type="button" onClick={() => void remove(image)} style={{ ...BUTTON, marginLeft: 'auto', color: '#F0B0B0', border: '1px solid rgba(220,100,100,0.35)' }}>{TEXTS.common.delete}</button></div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
