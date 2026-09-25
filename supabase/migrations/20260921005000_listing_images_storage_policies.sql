-- Apply after 20260921004000_create_listing_images_bucket.sql.
-- Recreates the admin policies required by the image editor on existing projects.

alter table public.listing_images enable row level security;

drop policy if exists "Admins can manage listing images" on public.listing_images;
create policy "Admins can manage listing images"
on public.listing_images for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can upload listing image objects" on storage.objects;
create policy "Admins can upload listing image objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'listing-images' and public.is_admin());

drop policy if exists "Admins can update listing image objects" on storage.objects;
create policy "Admins can update listing image objects"
on storage.objects for update
to authenticated
using (bucket_id = 'listing-images' and public.is_admin())
with check (bucket_id = 'listing-images' and public.is_admin());

drop policy if exists "Admins can delete listing image objects" on storage.objects;
create policy "Admins can delete listing image objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'listing-images' and public.is_admin());
