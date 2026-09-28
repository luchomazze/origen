alter table public.listings
  add column if not exists zonaprop_id text;

create unique index if not exists listings_zonaprop_id_key
  on public.listings (zonaprop_id)
  where zonaprop_id is not null;
