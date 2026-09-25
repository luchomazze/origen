-- Apply this migration to existing Supabase projects created before image uploads.
-- It is safe to run more than once.
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do update set public = excluded.public;
