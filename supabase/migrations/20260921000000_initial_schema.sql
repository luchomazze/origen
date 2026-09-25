create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('propiedad', 'terreno', 'emprendimiento')),
  title text not null,
  description text,
  operation text check (operation in ('venta', 'alquiler')),
  address text, neighborhood text, city text,
  latitude numeric,
  longitude numeric,
  price numeric(14, 2) check (price is null or price >= 0),
  price_from boolean not null default false,
  currency text default 'USD' check (char_length(currency) between 3 and 4),
  financing boolean default false,
  delivery_date date,
  services text[],
  surface_m2 numeric(12, 2) check (surface_m2 is null or surface_m2 >= 0),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  garages integer check (garages is null or garages >= 0),
  rooms integer check (rooms is null or rooms >= 0),
  property_type text check (property_type in ('casa', 'departamento', 'ph', 'local', 'oficina', 'campo', 'cabana', 'otro')),
  financing_details text,
  mortgage_eligible boolean not null default false,
  publication_status text not null default 'borrador' check (publication_status in ('borrador', 'publicado', 'pausado')),
  commercial_status text not null default 'disponible' check (commercial_status in ('disponible', 'reservado', 'en_negociacion', 'vendido', 'alquilado')),
  whatsapp_enabled boolean default true,
  whatsapp_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_typologies (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  name text not null, description text,
  surface_m2 numeric(12, 2) check (surface_m2 is null or surface_m2 >= 0),
  price numeric(14, 2) check (price is null or price >= 0),
  currency text not null default 'USD' check (char_length(currency) between 3 and 4),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_url text not null,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  unique (listing_id, display_order)
);

create table if not exists public.site_settings (
  id text primary key default 'global' check (id = 'global'),
  site_name text not null default 'ORIGEN',
  whatsapp_number text not null default '5493515000000',
  instagram_url text not null default 'https://instagram.com/origeninversiones',
  whatsapp_enabled boolean not null default true,
  whatsapp_template_emprendimiento text not null default 'Hola ORIGEN, quiero consultar por el emprendimiento {nombre}.',
  whatsapp_template_propiedad text not null default 'Hola ORIGEN, quiero consultar por la propiedad {nombre}.',
  whatsapp_template_terreno text not null default 'Hola ORIGEN, quiero consultar por el terreno {nombre}.',
  site_description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists listings_type_idx on public.listings (type);
create index if not exists listings_publication_status_idx on public.listings (publication_status);
create index if not exists listings_commercial_status_idx on public.listings (commercial_status);
create index if not exists listings_neighborhood_idx on public.listings (neighborhood);
create index if not exists listing_typologies_listing_id_idx on public.listing_typologies (listing_id);
create index if not exists listing_images_listing_id_idx on public.listing_images (listing_id, display_order);

create or replace trigger listings_set_updated_at before update on public.listings for each row execute function public.set_updated_at();
create or replace trigger listing_typologies_set_updated_at before update on public.listing_typologies for each row execute function public.set_updated_at();
create or replace trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
create or replace trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

alter table public.listings enable row level security;
alter table public.listing_typologies enable row level security;
alter table public.listing_images enable row level security;
alter table public.site_settings enable row level security;
alter table public.profiles enable row level security;
