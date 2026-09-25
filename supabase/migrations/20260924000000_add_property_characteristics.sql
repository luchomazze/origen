alter table public.listings
  add column if not exists surface_m2 numeric(12, 2) check (surface_m2 is null or surface_m2 >= 0),
  add column if not exists bedrooms integer check (bedrooms is null or bedrooms >= 0),
  add column if not exists bathrooms integer check (bathrooms is null or bathrooms >= 0),
  add column if not exists garages integer check (garages is null or garages >= 0),
  add column if not exists rooms integer check (rooms is null or rooms >= 0),
  add column if not exists property_type text check (property_type in ('casa', 'departamento', 'ph', 'local', 'oficina', 'campo', 'cabana', 'otro')),
  add column if not exists financing_details text;
