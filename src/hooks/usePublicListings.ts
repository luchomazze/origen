import { TEXTS } from '../content/texts'
import { useEffect, useState } from 'react'
import type { Listing, TipoListing } from '../data/listings'
import { getCachedPublicListings, getPublicListings } from '../data/listingsApi'

export function usePublicListings(tipo?: TipoListing) {
  const cached = getCachedPublicListings(tipo)
  const [listings, setListings] = useState<Listing[]>(cached ?? [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (!getCachedPublicListings(tipo)) setLoading(true)
    setError(null)

    getPublicListings(tipo)
      .then(data => {
        if (active) setListings(data)
      })
      .catch(reason => {
        if (active) setError(reason instanceof Error ? reason.message : TEXTS.listingsData.loadError)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [tipo])

  return { listings, loading, error }
}
