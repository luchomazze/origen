alter table public.listings drop constraint if exists listings_commercial_status_check;
alter table public.listings add constraint listings_commercial_status_check
  check (commercial_status in ('disponible', 'reservado', 'en_negociacion', 'vendido', 'alquilado'));
