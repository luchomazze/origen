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

create policy "Public can read visible listings"
on public.listings for select
to anon, authenticated
using (estado_publicacion = 'PUBLICADO' and estado_comercial <> 'VENDIDO');

create policy "Admins can manage listings"
on public.listings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read units for visible listings"
on public.listing_units for select
to anon, authenticated
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_units.listing_id
      and listings.estado_publicacion = 'PUBLICADO'
      and listings.estado_comercial <> 'VENDIDO'
  )
);

create policy "Admins can manage units"
on public.listing_units for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read images for visible listings"
on public.listing_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and listings.estado_publicacion = 'PUBLICADO'
      and listings.estado_comercial <> 'VENDIDO'
  )
);

create policy "Admins can manage listing images"
on public.listing_images for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read site settings"
on public.site_settings for select
to anon, authenticated
using (id = 'global');

create policy "Admins can manage site settings"
on public.site_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read profiles"
on public.profiles for select
to authenticated
using (public.is_admin() or id = auth.uid());

create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do update set public = excluded.public;

create policy "Public can read listing image objects"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'listing-images');

create policy "Admins can upload listing image objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'listing-images' and public.is_admin());

create policy "Admins can update listing image objects"
on storage.objects for update
to authenticated
using (bucket_id = 'listing-images' and public.is_admin())
with check (bucket_id = 'listing-images' and public.is_admin());

create policy "Admins can delete listing image objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'listing-images' and public.is_admin());