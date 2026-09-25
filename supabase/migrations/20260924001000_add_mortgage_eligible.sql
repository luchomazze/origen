alter table public.listings
  add column if not exists mortgage_eligible boolean not null default false;
