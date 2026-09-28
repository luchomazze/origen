// Bookmarklet "Importar a ORIGEN": se arrastra a la barra de favoritos desde el Admin
// y se ejecuta sobre una ficha abierta de Zonaprop. Lee las variables globales que la
// página ya trae (`avisoInfo`, `mainFeatures`, `dataLayerInfo`), arma un JSON con el
// formato que entiende `parseZonapropExport` (data/zonapropImport.ts) y abre el Admin
// con ese JSON en el hash; si la ventana se bloquea, lo copia al portapapeles.
// Corre fuera de la app (se serializa con toString), por eso no usa TEXTS ni imports.

declare const avisoInfo: any
declare const mainFeatures: any
declare const dataLayerInfo: any

function copyForOrigen() {
  const get = (fn: () => any) => { try { return fn() } catch { return null } }
  const aviso = get(() => avisoInfo)
  if (!aviso) { alert('ORIGEN: esta página no parece ser una ficha de Zonaprop.'); return }
  const main = get(() => mainFeatures) || {}
  const layer = get(() => dataLayerInfo) || {}

  const decodeHtml = (html: string) => {
    const t = document.createElement('textarea')
    t.innerHTML = String(html || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
    return t.value.trim()
  }
  const coord = (b64: string) => { const n = parseFloat(get(() => atob(b64))); return isNaN(n) ? null : n }

  const loc: Record<string, string> = {}
  for (let l = aviso.location; l; l = l.parent) loc[l.label] = l.name

  const features: Record<string, any> = {}
  Object.keys(main).forEach(k => { const f = main[k]; features[f.icon || k] = { label: f.label, value: f.value, measure: f.measure } })

  const general: string[] = []
  Object.keys(aviso.generalFeatures || {}).forEach(group => {
    const items = aviso.generalFeatures[group]
    Object.keys(items).forEach(k => { const f = items[k]; general.push(f.value ? f.label + ': ' + f.value : f.label) })
  })

  const priceBlock = (aviso.pricesData || [])[0] || {}
  const price = (priceBlock.prices || [])[0] || {}
  const h1 = document.querySelector('h1')

  const data = {
    source: 'zonaprop',
    version: 1,
    url: 'https://www.zonaprop.com.ar' + aviso.url,
    zonapropId: aviso.idAviso,
    title: h1 ? (h1.textContent || '').trim() : document.title,
    postingType: aviso.postingType,
    propertyType: layer.propertyType || null,
    operation: priceBlock.operationType ? priceBlock.operationType.name : null,
    currency: price.isoCode || null,
    price: price.amount != null ? price.amount : null,
    reserved: aviso.reserved === 'true',
    expenses: aviso.expenses || null,
    neighborhood: loc.ZONA || null,
    city: loc.CIUDAD || null,
    province: loc.PROVINCIA || null,
    address: aviso.address ? aviso.address.name : null,
    lat: coord(aviso.mapLat),
    lng: coord(aviso.mapLng),
    features,
    generalFeatures: general,
    description: decodeHtml(aviso.description),
    pictures: (aviso.pictures || [])
      .filter((p: any) => p.url1200x1200)
      .sort((a: any, b: any) => a.order - b.order)
      .map((p: any) => p.url1200x1200.split('?')[0]),
  }

  const json = JSON.stringify(data)
  // Abre el Admin con los datos en el hash (no viaja al servidor). Ver ZONAPROP_IMPORT_HASH en data/zonapropImport.ts.
  if (window.open('__ORIGEN_ADMIN_URL__#zonaprop=' + encodeURIComponent(json), '_blank')) return

  // Si el navegador bloqueó la ventana: mostrar y copiar los datos para pegarlos a mano.
  const box = document.createElement('div')
  box.style.cssText = 'position:fixed;inset:24px;z-index:2147483647;background:#0D1B2A;color:#fff;padding:16px;border-radius:12px;display:flex;flex-direction:column;gap:8px;font:14px system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.5)'
  const head = document.createElement('div')
  head.textContent = 'ORIGEN: ' + data.title + ' — ' + (data.currency || '') + ' ' + (data.price || '') + ' — ' + data.pictures.length + ' fotos'
  const ta = document.createElement('textarea')
  ta.value = json
  ta.style.cssText = 'flex:1;font:12px monospace;color:#0D1B2A;background:#fff;border-radius:8px;padding:8px'
  const close = document.createElement('button')
  close.textContent = 'Cerrar'
  close.onclick = () => box.remove()
  box.append(head, ta, close)
  document.body.appendChild(box)
  ta.select()

  const copied = () => { head.textContent += ' — ✔ copiado al portapapeles' }
  const fallback = () => { if (document.execCommand('copy')) copied(); else head.textContent += ' — copiá el texto con Ctrl+C' }
  if (navigator.clipboard) navigator.clipboard.writeText(json).then(copied, fallback); else fallback()
}

/** `adminUrl` queda fijo dentro del favorito: es el Admin que se abre al usarlo. React 19 bloquea `javascript:` en href desde JSX: asignarlo con setAttribute vía ref. */
export function zonapropBookmarkletHref(adminUrl: string): string {
  const source = copyForOrigen.toString().replace('__ORIGEN_ADMIN_URL__', adminUrl)
  return 'javascript:' + encodeURIComponent('(' + source + ')()')
}
