-- Run this SQL in Supabase SQL editor
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_by uuid,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
before update on public.site_content
for each row
execute procedure public.set_updated_at();

alter table public.site_content enable row level security;

-- Public users (website visitors) can read content
create policy if not exists "Public can read site content"
on public.site_content
for select
using (true);

-- Authenticated users can edit content (admin app uses auth session)
create policy if not exists "Authenticated users can edit site content"
on public.site_content
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
