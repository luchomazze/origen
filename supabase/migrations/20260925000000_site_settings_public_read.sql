-- Public site reads WhatsApp/Instagram config from site_settings (previously localStorage).
-- site_settings.id is a uuid in production (not 'global' as in initial_schema.sql),
-- and the table holds a single public config row, so no row filter is needed.
drop policy if exists "Public can read site settings" on public.site_settings;

create policy "Public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);
