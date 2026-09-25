alter table public.listings add column if not exists price_from boolean;
update public.listings set price_from = false where price_from is null;
alter table public.listings alter column price_from set default false;
alter table public.listings alter column price_from set not null;
