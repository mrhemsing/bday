alter table public.people
  add column if not exists parent_id uuid null references public.people(id) on delete set null;

create index if not exists people_parent_id_idx on public.people (parent_id);
