create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- listings
create policy "Public can read visible listings"
on public.listings for select
to anon, authenticated
using (publication_status = 'publicado');

create policy "Admins can read listings"
on public.listings for select
to authenticated
using (public.is_admin());

create policy "Admins can insert listings"
on public.listings for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update listings"
on public.listings for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete listings"
on public.listings for delete
to authenticated
using (public.is_admin());

-- listing_typologies
create policy "Public can read typologies for visible listings"
on public.listing_typologies for select
to anon, authenticated
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_typologies.listing_id
      and listings.publication_status = 'publicado'
  )
);

create policy "Admins can read listing typologies"
on public.listing_typologies for select
to authenticated
using (public.is_admin());

create policy "Admins can insert listing typologies"
on public.listing_typologies for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update listing typologies"
on public.listing_typologies for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete listing typologies"
on public.listing_typologies for delete
to authenticated
using (public.is_admin());

-- listing_images
create policy "Public can read images for visible listings"
on public.listing_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and listings.publication_status = 'publicado'
  )
);

create policy "Admins can read listing images"
on public.listing_images for select
to authenticated
using (public.is_admin());

create policy "Admins can insert listing images"
on public.listing_images for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update listing images"
on public.listing_images for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete listing images"
on public.listing_images for delete
to authenticated
using (public.is_admin());

-- site_settings
-- Public select policy added in 20260925000000_site_settings_public_read.sql.
create policy "Admins can read site settings"
on public.site_settings for select
to authenticated
using (public.is_admin());

create policy "Admins can insert site settings"
on public.site_settings for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update site_settings"
on public.site_settings for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete site_settings"
on public.site_settings for delete
to authenticated
using (public.is_admin());

-- profiles
create policy "Admins can read profiles"
on public.profiles for select
to authenticated
using (public.is_admin() or id = auth.uid());

create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- storage
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do update set public = excluded.public;

-- NOTE: no public select policy on storage.objects. Not needed today since
-- the bucket itself is public and public URLs bypass object RLS on read.
create policy "Admins can upload listing images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'listing-images' and public.is_admin());

create policy "Admins can update listing images"
on storage.objects for update
to authenticated
using (bucket_id = 'listing-images' and public.is_admin())
with check (bucket_id = 'listing-images' and public.is_admin());

create policy "Admins can delete listing images"
on storage.objects for delete
to authenticated
using (bucket_id = 'listing-images' and public.is_admin());
