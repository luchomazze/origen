create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.listings (
  id text primary key,
  tipo text not null check (tipo in ('PROPIEDAD', 'TERRENO', 'EMPRENDIMIENTO')),
  titulo text not null,
  slug text not null unique,
  descripcion text,
  precio numeric(14, 2) check (precio is null or precio >= 0),
  moneda text not null default 'USD' check (char_length(moneda) between 3 and 4),
  precio_desde boolean not null default false,
  estado_publicacion text not null default 'BORRADOR' check (estado_publicacion in ('BORRADOR', 'PUBLICADO', 'OCULTO')),
  estado_comercial text not null default 'DISPONIBLE' check (estado_comercial in ('DISPONIBLE', 'RESERVADO', 'EN_NEGOCIACION', 'VENDIDO')),
  ciudad text,
  barrio text,
  direccion text,
  latitud double precision check (latitud is null or latitud between -90 and 90),
  longitud double precision check (longitud is null or longitud between -180 and 180),
  superficie_m2 numeric(12, 2) check (superficie_m2 is null or superficie_m2 >= 0),
  tipo_propiedad text check (tipo_propiedad is null or tipo_propiedad in ('CASA', 'DEPARTAMENTO', 'PH', 'LOCAL', 'OFICINA', 'CAMPO', 'CABAÑA', 'OTRO')),
  dormitorios integer check (dormitorios is null or dormitorios >= 0),
  banos integer check (banos is null or banos >= 0),
  cocheras integer check (cocheras is null or cocheras >= 0),
  ambientes integer check (ambientes is null or ambientes >= 0),
  apto_credito boolean,
  fecha_entrega text,
  financiamiento text,
  url_zonaprop text,
  services text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (tipo = 'PROPIEDAD' or tipo_propiedad is null),
  check (tipo = 'PROPIEDAD' or apto_credito is null)
);

create table if not exists public.listing_units (
  id text primary key,
  listing_id text not null references public.listings(id) on delete cascade,
  nombre text not null,
  descripcion text,
  superficie_m2 numeric(12, 2) check (superficie_m2 is null or superficie_m2 >= 0),
  dormitorios integer check (dormitorios is null or dormitorios >= 0),
  banos integer check (banos is null or banos >= 0),
  cocheras integer check (cocheras is null or cocheras >= 0),
  precio numeric(14, 2) check (precio is null or precio >= 0),
  moneda text not null default 'USD' check (char_length(moneda) between 3 and 4),
  estado_comercial text not null default 'DISPONIBLE' check (estado_comercial in ('DISPONIBLE', 'RESERVADO', 'EN_NEGOCIACION', 'VENDIDO')),
  orden integer not null default 0 check (orden >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null references public.listings(id) on delete cascade,
  storage_path text,
  external_url text,
  alt_text text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_cover boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  check (storage_path is not null or external_url is not null),
  unique (listing_id, sort_order)
);

create unique index if not exists listing_images_one_cover_per_listing
  on public.listing_images (listing_id)
  where is_cover = true;

create table if not exists public.site_settings (
  id text primary key default 'global' check (id = 'global'),
  whatsapp_number text not null default '5493515000000',
  whatsapp_message_project text not null default 'Hola ORIGEN, quiero consultar por el emprendimiento {nombre}.',
  whatsapp_message_property text not null default 'Hola ORIGEN, quiero consultar por la propiedad {nombre}.',
  whatsapp_message_land text not null default 'Hola ORIGEN, quiero consultar por el terreno {nombre}.',
  instagram_url text not null default 'https://instagram.com/origeninversiones',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists listings_tipo_idx on public.listings (tipo);
create index if not exists listings_estado_publicacion_idx on public.listings (estado_publicacion);
create index if not exists listings_estado_comercial_idx on public.listings (estado_comercial);
create index if not exists listings_barrio_idx on public.listings (barrio);
create index if not exists listing_units_listing_id_idx on public.listing_units (listing_id);
create index if not exists listing_units_order_idx on public.listing_units (listing_id, orden);
create index if not exists listing_images_listing_id_idx on public.listing_images (listing_id, sort_order);

create or replace trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

create or replace trigger listing_units_set_updated_at
before update on public.listing_units
for each row execute function public.set_updated_at();

create or replace trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.listings enable row level security;
alter table public.listing_units enable row level security;
alter table public.listing_images enable row level security;
alter table public.site_settings enable row level security;
alter table public.profiles enable row level security;
