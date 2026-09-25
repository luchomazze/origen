grant usage on schema public to anon, authenticated;
grant select on public.listings to anon, authenticated;
grant select on public.listing_typologies to anon, authenticated;
grant select on public.listing_images to anon, authenticated;
grant select on public.site_settings to anon, authenticated;

drop policy if exists "Public can read visible listings" on public.listings;
create policy "Public can read visible listings"
on public.listings for select
to anon, authenticated
using (
  publication_status = 'publicado'
  and commercial_status <> 'vendido'
);

drop policy if exists "Public can read units for visible listings" on public.listing_typologies;
create policy "Public can read units for visible listings"
on public.listing_typologies for select
to anon, authenticated
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_typologies.listing_id
      and listings.publication_status = 'publicado'
      and listings.commercial_status <> 'vendido'
  )
);

drop policy if exists "Public can read images for visible listings" on public.listing_images;
create policy "Public can read images for visible listings"
on public.listing_images for select
to anon, authenticated
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.publication_status = 'publicado'
      and listings.commercial_status <> 'vendido'
  )
);

select schemaname, tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename in ('listings', 'listing_typologies', 'listing_images');
