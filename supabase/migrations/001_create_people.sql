create extension if not exists pgcrypto;

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  birth_date date not null,
  generation text not null check (generation in ('child', 'grandchild', 'great-grandchild', 'other')),
  notes text null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
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

create trigger set_people_updated_at
before update on public.people
for each row
execute function public.set_updated_at();

create index if not exists people_birth_date_idx on public.people (extract(month from birth_date), extract(day from birth_date));
create index if not exists people_active_idx on public.people (active);
create index if not exists people_name_idx on public.people (full_name);
