export type TipoListing = 'PROPIEDAD' | 'TERRENO' | 'EMPRENDIMIENTO'
export type EstadoPublicacion = 'BORRADOR' | 'PUBLICADO' | 'OCULTO'
export type EstadoComercial = 'DISPONIBLE' | 'RESERVADO' | 'EN_NEGOCIACION' | 'VENDIDO'
export type TipoPropiedad = 'CASA' | 'DEPARTAMENTO' | 'PH' | 'LOCAL' | 'OFICINA' | 'CAMPO' | 'CABAÑA' | 'OTRO'

export interface ListingUnidad {
  id: string
  nombre: string
  descripcion?: string
  superficie_m2?: number
  dormitorios?: number
  banos?: number
  cocheras?: number
  precio?: number
  moneda?: string
  estado_comercial: EstadoComercial
  orden: number
}

export interface Listing {
  id: string
  tipo: TipoListing
  titulo: string
  slug: string
  descripcion?: string
  precio?: number
  moneda?: string
  precio_desde?: boolean
  estado_publicacion: EstadoPublicacion
  estado_comercial: EstadoComercial
  ciudad?: string
  barrio?: string
  direccion?: string
  latitud?: number
  longitud?: number
  superficie_m2?: number
  tipo_propiedad?: TipoPropiedad
  dormitorios?: number
  banos?: number
  cocheras?: number
  ambientes?: number
  apto_credito?: boolean
  fecha_entrega?: string
  financiamiento?: string
  url_zonaprop?: string
  services?: string[]
  imagen?: string
  imagenes?: string[]
  unidades?: ListingUnidad[]
}

export const ALL_SERVICES = [
  'Gas natural',
  'Agua corriente',
  'Electricidad',
  'Cloacas',
  'Internet',
  'Fibra óptica',
  'Seguridad',
] as const

/** Format price following Argentine convention: moneda + thousands dot separator */
export function formatPrecio(precio: number, moneda = 'USD'): string {
  return `${moneda} ${precio.toLocaleString('es-AR')}`
}

/** Returns price string with optional "Desde" prefix */
export function displayPrecio(listing: Listing): string | null {
  if (!listing.precio) return null
  const base = formatPrecio(listing.precio, listing.moneda ?? 'USD')
  return listing.precio_desde ? `Desde ${base}` : base
}

/** Returns price string for a unit */
export function displayUnidadPrecio(u: ListingUnidad): string | null {
  if (!u.precio) return null
  return formatPrecio(u.precio, u.moneda ?? 'USD')
}

/** Only PUBLICADO + not VENDIDO listings should appear publicly */
export function isPubliclyVisible(l: Listing): boolean {
  return l.estado_publicacion === 'PUBLICADO' && l.estado_comercial !== 'VENDIDO'
}

/* ─── Demo data ──────────────────────────────────────────────────────────── */

const IMGS = {
  h1: 'https://images.unsplash.com/photo-1721815693498-cc28507c0ba2',
  h2: 'https://images.unsplash.com/photo-1722421492323-eaf9c401befe',
  h3: 'https://images.unsplash.com/photo-1698994705178-d244d73ea573',
  h4: 'https://images.unsplash.com/photo-1748063578185-3d68121b11ff',
  h5: 'https://images.unsplash.com/photo-1756706718604-ef4af3970e33',
  h6: 'https://images.unsplash.com/photo-1706164971302-e30c0640cc3b',
  a1: 'https://images.unsplash.com/photo-1624204386084-dd8c05e32226',
  a2: 'https://images.unsplash.com/photo-1515263487990-61b07816b324',
  a3: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
  t1: 'https://images.unsplash.com/photo-1699375348655-c4564465969b',
  t2: 'https://images.unsplash.com/photo-1637071985253-e5417fa2a47b',
  t3: 'https://images.unsplash.com/photo-1592113690727-36218027ff4f',
  i1: 'https://images.unsplash.com/photo-1724582586529-62622e50c0b3',
  i2: 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6',
}

export const DEMO_LISTINGS: Listing[] = [
  /* ── PROPIEDADES ────────────────────────────── */
  {
    id: 'p1', tipo: 'PROPIEDAD', titulo: 'Casa en Manantiales', slug: 'casa-en-manantiales-p1',
    descripcion: 'Amplia casa en uno de los barrios más consolidados de Córdoba Sur. Planta baja y primer piso con amplios espacios, jardín y cochera cubierta.',
    precio: 245000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Manantiales',
    superficie_m2: 185, tipo_propiedad: 'CASA',
    dormitorios: 3, banos: 2, cocheras: 2, ambientes: 5, apto_credito: false,
    services: ['Gas natural', 'Agua corriente', 'Electricidad', 'Cloacas', 'Internet'],
    imagen: IMGS.h1, imagenes: [IMGS.h1, IMGS.i1, IMGS.i2],
    latitud: -31.46, longitud: -64.22,
  },
  {
    id: 'p2', tipo: 'PROPIEDAD', titulo: 'Departamento en Barrio Jardín', slug: 'departamento-barrio-jardin-p2',
    descripcion: 'Departamento luminoso con balcón orientado al norte. Edificio con amenities. Ideal para inversión o vivienda propia.',
    precio: 118000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Barrio Jardín',
    superficie_m2: 78, tipo_propiedad: 'DEPARTAMENTO',
    dormitorios: 2, banos: 1, cocheras: 1, ambientes: 3, apto_credito: true,
    services: ['Gas natural', 'Agua corriente', 'Electricidad', 'Cloacas', 'Internet', 'Fibra óptica'],
    imagen: IMGS.h2, imagenes: [IMGS.h2, IMGS.i1],
    latitud: -31.40, longitud: -64.18,
  },
  {
    id: 'p3', tipo: 'PROPIEDAD', titulo: 'Casa en Jardines del Jockey', slug: 'casa-jardines-del-jockey-p3',
    descripcion: 'Casa de categoría en barrio cerrado con acceso controlado. Amplio jardín, pileta y terminaciones de primera calidad.',
    precio: 380000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Jardines del Jockey',
    superficie_m2: 280, tipo_propiedad: 'CASA',
    dormitorios: 4, banos: 3, cocheras: 2, ambientes: 7, apto_credito: false,
    imagen: IMGS.h3, imagenes: [IMGS.h3, IMGS.i2, IMGS.i1],
    latitud: -31.44, longitud: -64.20,
  },
  {
    id: 'p4', tipo: 'PROPIEDAD', titulo: 'PH en Camino San Carlos', slug: 'ph-camino-san-carlos-p4',
    descripcion: 'PH en planta alta con terraza propia. Diseño moderno, cocina integrada y excelente iluminación natural.',
    precio: 85000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Camino San Carlos',
    superficie_m2: 52, tipo_propiedad: 'PH',
    dormitorios: 1, banos: 1, cocheras: 1, ambientes: 2, apto_credito: true,
    imagen: IMGS.h4, imagenes: [IMGS.h4],
    latitud: -31.50, longitud: -64.25,
  },
  {
    id: 'p5', tipo: 'PROPIEDAD', titulo: 'Casa en Manantiales', slug: 'casa-manantiales-p5',
    descripcion: 'Residencia de categoría superior en Manantiales. Amplísimos espacios interiores y exteriores.',
    precio: 520000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Manantiales',
    superficie_m2: 340, tipo_propiedad: 'CASA',
    dormitorios: 5, banos: 4, cocheras: 3, ambientes: 9, apto_credito: false,
    imagen: IMGS.h5, imagenes: [IMGS.h5, IMGS.i1],
    latitud: -31.46, longitud: -64.23,
  },
  {
    id: 'p6', tipo: 'PROPIEDAD', titulo: 'Departamento en Barrio Jardín', slug: 'departamento-barrio-jardin-p6',
    descripcion: 'Departamento de 3 ambientes en edificio de categoría. Se encuentra reservado — consultá disponibilidad.',
    precio: 175000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'RESERVADO',
    ciudad: 'Córdoba', barrio: 'Barrio Jardín',
    superficie_m2: 110, tipo_propiedad: 'DEPARTAMENTO',
    dormitorios: 3, banos: 2, cocheras: 1, ambientes: 4, apto_credito: true,
    imagen: IMGS.a1, imagenes: [IMGS.a1],
    latitud: -31.41, longitud: -64.19,
  },
  {
    id: 'p7', tipo: 'PROPIEDAD', titulo: 'Casa en Jardines del Jockey', slug: 'casa-jardines-del-jockey-p7',
    descripcion: 'Casa en uno de los barrios más buscados del sur de la ciudad. Buen estado de conservación.',
    precio: 295000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'EN_NEGOCIACION',
    ciudad: 'Córdoba', barrio: 'Jardines del Jockey',
    superficie_m2: 210, tipo_propiedad: 'CASA',
    dormitorios: 3, banos: 2, cocheras: 2, ambientes: 6, apto_credito: false,
    imagen: IMGS.h6, imagenes: [IMGS.h6, IMGS.i2],
    latitud: -31.45, longitud: -64.21,
  },
  {
    id: 'p8', tipo: 'PROPIEDAD', titulo: 'Departamento en Camino San Carlos', slug: 'departamento-camino-san-carlos-p8',
    descripcion: 'Departamento de 2 dormitorios en un complejo tranquilo con amplios espacios verdes.',
    precio: 138000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Camino San Carlos',
    superficie_m2: 88, tipo_propiedad: 'DEPARTAMENTO',
    dormitorios: 2, banos: 2, cocheras: 1, ambientes: 3, apto_credito: true,
    imagen: IMGS.h2, imagenes: [IMGS.h2],
    latitud: -31.51, longitud: -64.26,
  },

  /* ── TERRENOS ────────────────────────────────── */
  {
    id: 't1', tipo: 'TERRENO', titulo: 'Lote en Manantiales', slug: 'lote-manantiales-t1',
    descripcion: 'Lote en ubicación privilegiada dentro de Manantiales. Todos los servicios disponibles.',
    precio: 42000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Manantiales',
    superficie_m2: 600,
    services: ['Agua corriente', 'Electricidad', 'Cloacas', 'Gas natural'],
    imagen: IMGS.t1, imagenes: [IMGS.t1],
    latitud: -31.47, longitud: -64.22,
  },
  {
    id: 't2', tipo: 'TERRENO', titulo: 'Lote en Barrio Jardín', slug: 'lote-barrio-jardin-t2',
    descripcion: 'Terreno en Barrio Jardín, zona consolidada y con fácil acceso.',
    precio: 35000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Barrio Jardín',
    superficie_m2: 450,
    services: ['Agua corriente', 'Electricidad'],
    imagen: IMGS.t2, imagenes: [IMGS.t2],
    latitud: -31.41, longitud: -64.18,
  },
  {
    id: 't3', tipo: 'TERRENO', titulo: 'Loteo Los Álamos', slug: 'loteo-los-alamos-t3',
    descripcion: 'Loteo residencial en Docta, una de las zonas de mayor crecimiento de Córdoba Sur. Lotes de diferentes medidas con todos los servicios.',
    precio: 35000, moneda: 'USD', precio_desde: true,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Docta',
    services: ['Agua corriente', 'Electricidad', 'Cloacas', 'Gas natural', 'Internet'],
    imagen: IMGS.t3, imagenes: [IMGS.t3, IMGS.t1],
    latitud: -31.52, longitud: -64.28,
    unidades: [
      { id: 'u-t3-1', nombre: 'Lote 01', superficie_m2: 360, precio: 35000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 1 },
      { id: 'u-t3-2', nombre: 'Lote 02', superficie_m2: 420, precio: 42000, moneda: 'USD', estado_comercial: 'RESERVADO', orden: 2 },
      { id: 'u-t3-3', nombre: 'Lote 03', superficie_m2: 380, precio: 37000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 3 },
      { id: 'u-t3-4', nombre: 'Lote 04', superficie_m2: 460, precio: 46000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 4 },
      { id: 'u-t3-5', nombre: 'Lote 05', superficie_m2: 390, precio: 39000, moneda: 'USD', estado_comercial: 'VENDIDO', orden: 5 },
    ],
  },
  {
    id: 't4', tipo: 'TERRENO', titulo: 'Terreno en Jardines del Jockey', slug: 'terreno-jardines-del-jockey-t4',
    descripcion: 'Terreno amplio en zona residencial consolidada.',
    precio: 55000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Jardines del Jockey',
    superficie_m2: 800,
    services: ['Agua corriente', 'Electricidad', 'Cloacas', 'Seguridad'],
    imagen: IMGS.t2, imagenes: [IMGS.t2],
    latitud: -31.44, longitud: -64.20,
  },
  {
    id: 't5', tipo: 'TERRENO', titulo: 'Terreno en Manantiales', slug: 'terreno-manantiales-t5',
    descripcion: 'Gran terreno en Manantiales con excelente ubicación y frente generoso.',
    precio: 72000, moneda: 'USD', precio_desde: false,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Manantiales',
    superficie_m2: 950,
    services: ['Agua corriente', 'Electricidad', 'Cloacas', 'Gas natural', 'Internet', 'Fibra óptica'],
    imagen: IMGS.t1, imagenes: [IMGS.t1],
    latitud: -31.48, longitud: -64.23,
  },

  /* ── EMPRENDIMIENTOS ─────────────────────────── */
  {
    id: 'e1', tipo: 'EMPRENDIMIENTO', titulo: 'Origen Park', slug: 'origen-park',
    descripcion: 'Un nuevo concepto residencial en el corazón de Manantiales. Proyecto pensado para quienes buscan combinar calidad de vida, ubicación y una oportunidad de inversión. Arquitectura contemporánea que prioriza la luz natural y los espacios bien resueltos.',
    precio: 75000, moneda: 'USD', precio_desde: true,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Manantiales', direccion: 'Manantiales, Córdoba Sur',
    fecha_entrega: 'Diciembre 2028',
    financiamiento: 'Anticipo del 30% + cuotas en pesos ajustadas por índice. Datos de carácter demostrativo.',
    services: ['Gas natural', 'Agua corriente', 'Electricidad', 'Cloacas', 'Internet', 'Fibra óptica', 'Seguridad'],
    imagen: IMGS.a1, imagenes: [IMGS.a1, IMGS.i1, IMGS.i2, IMGS.a3],
    latitud: -31.46, longitud: -64.22,
    unidades: [
      { id: 'u-e1-1', nombre: '1 dormitorio', descripcion: 'Unidad de 1 dormitorio con cocina integrada y balcón.', superficie_m2: 48, dormitorios: 1, banos: 1, precio: 75000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 1 },
      { id: 'u-e1-2', nombre: '1 dormitorio premium', descripcion: 'Unidad de 1 dormitorio en piso superior con vista privilegiada.', superficie_m2: 55, dormitorios: 1, banos: 1, precio: 88000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 2 },
      { id: 'u-e1-3', nombre: '2 dormitorios', descripcion: 'Unidad de 2 dormitorios con living-comedor amplio.', superficie_m2: 68, dormitorios: 2, banos: 1, precio: 105000, moneda: 'USD', estado_comercial: 'RESERVADO', orden: 3 },
      { id: 'u-e1-4', nombre: '2 dormitorios suite', descripcion: 'Unidad de 2 dormitorios con suite y toilette.', superficie_m2: 75, dormitorios: 2, banos: 2, precio: 118000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 4 },
    ],
  },
  {
    id: 'e2', tipo: 'EMPRENDIMIENTO', titulo: 'Altos del Sur', slug: 'altos-del-sur',
    descripcion: 'Un proyecto de gran escala que redefine el horizonte residencial en la zona sur de Córdoba. Vistas panorámicas únicas y unidades amplias diseñadas para quienes buscan una vivienda de calidad o una inversión de largo plazo.',
    precio: 95000, moneda: 'USD', precio_desde: true,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'DISPONIBLE',
    ciudad: 'Córdoba', barrio: 'Córdoba Sur', direccion: 'Zona Sur, Córdoba',
    fecha_entrega: 'Junio 2027',
    financiamiento: 'Anticipo del 25% + cuotas en pesos. Datos de carácter demostrativo.',
    imagen: IMGS.a2, imagenes: [IMGS.a2, IMGS.i2, IMGS.i1],
    latitud: -31.49, longitud: -64.25,
    unidades: [
      { id: 'u-e2-1', nombre: '2 dormitorios', superficie_m2: 68, dormitorios: 2, banos: 1, precio: 95000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 1 },
      { id: 'u-e2-2', nombre: '2 dormitorios amplio', superficie_m2: 82, dormitorios: 2, banos: 2, precio: 115000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 2 },
      { id: 'u-e2-3', nombre: '3 dormitorios', superficie_m2: 95, dormitorios: 3, banos: 2, precio: 138000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 3 },
      { id: 'u-e2-4', nombre: '3 dormitorios suite', superficie_m2: 110, dormitorios: 3, banos: 3, cocheras: 1, precio: 162000, moneda: 'USD', estado_comercial: 'RESERVADO', orden: 4 },
    ],
  },
  {
    id: 'e3', tipo: 'EMPRENDIMIENTO', titulo: 'La Arboleda', slug: 'la-arboleda',
    descripcion: 'Proyecto finalizado y entregado. Un entorno natural privilegiado con unidades diseñadas para quienes priorizan calidad de vida. Unidades disponibles para entrega inmediata.',
    precio: 135000, moneda: 'USD', precio_desde: true,
    estado_publicacion: 'PUBLICADO', estado_comercial: 'EN_NEGOCIACION',
    ciudad: 'Córdoba', barrio: 'Camino San Carlos', direccion: 'Camino San Carlos, Córdoba Sur',
    fecha_entrega: 'Entregado',
    imagen: IMGS.a3, imagenes: [IMGS.a3, IMGS.i1, IMGS.i2],
    latitud: -31.51, longitud: -64.27,
    unidades: [
      { id: 'u-e3-1', nombre: '2 dormitorios', superficie_m2: 72, dormitorios: 2, banos: 1, precio: 135000, moneda: 'USD', estado_comercial: 'DISPONIBLE', orden: 1 },
      { id: 'u-e3-2', nombre: '3 dormitorios', superficie_m2: 98, dormitorios: 3, banos: 2, cocheras: 1, precio: 168000, moneda: 'USD', estado_comercial: 'EN_NEGOCIACION', orden: 2 },
    ],
  },
]

export const PROPIEDADES = DEMO_LISTINGS.filter(l => l.tipo === 'PROPIEDAD' && isPubliclyVisible(l))
export const TERRENOS = DEMO_LISTINGS.filter(l => l.tipo === 'TERRENO' && isPubliclyVisible(l))
export const EMPRENDIMIENTOS = DEMO_LISTINGS.filter(l => l.tipo === 'EMPRENDIMIENTO' && isPubliclyVisible(l))
