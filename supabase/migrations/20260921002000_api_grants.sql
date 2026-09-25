grant usage on schema public to anon, authenticated;

grant select on public.listings to anon, authenticated;
grant select on public.listing_typologies to anon, authenticated;
grant select on public.listing_images to anon, authenticated;
grant select on public.site_settings to anon, authenticated;

grant select, insert, update, delete on public.listings to authenticated;
grant select, insert, update, delete on public.listing_typologies to authenticated;
grant select, insert, update, delete on public.listing_images to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
