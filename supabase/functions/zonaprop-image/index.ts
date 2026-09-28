// Proxy de imágenes de Zonaprop para el importador del Admin.
// El CDN de Zonaprop no envía cabeceras CORS, así que el navegador no puede
// descargar las fotos directamente. Esta función las descarga del lado del
// servidor y las devuelve como binario; la subida a Storage la hace el Admin
// con la misma lógica que el editor de imágenes.
import { createClient } from 'npm:@supabase/supabase-js@2'

const ALLOWED_HOST = 'imgar.zonapropcdn.com'
const MAX_BYTES = 10 * 1024 * 1024
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function fail(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })
  if (req.method !== 'POST') return fail(405, 'Method not allowed')

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  })
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin')
  if (adminError || !isAdmin) return fail(403, 'Only admins can import images')

  let url: URL
  try {
    const body = await req.json()
    url = new URL(String(body.url))
  } catch {
    return fail(400, 'Invalid url')
  }
  if (url.protocol !== 'https:' || url.hostname !== ALLOWED_HOST) return fail(400, 'Only Zonaprop images are allowed')

  const upstream = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (ORIGEN importer)' } })
  const contentType = upstream.headers.get('Content-Type') ?? ''
  if (!upstream.ok || !contentType.startsWith('image/')) return fail(502, `Image download failed (${upstream.status})`)

  const bytes = await upstream.arrayBuffer()
  if (bytes.byteLength > MAX_BYTES) return fail(413, 'Image too large')

  // octet-stream hace que supabase-js lo entregue como Blob; el Admin infiere el tipo por la extensión.
  return new Response(bytes, {
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/octet-stream' },
  })
})
