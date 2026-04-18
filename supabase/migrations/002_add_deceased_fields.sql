alter table public.people
  add column if not exists deceased boolean not null default false,
  add column if not exists deceased_at date null,
  add column if not exists show_in_memorial boolean not null default false;

alter table public.people
  drop constraint if exists people_deceased_date_check;

alter table public.people
  add constraint people_deceased_date_check
  check ((deceased = false and deceased_at is null and show_in_memorial = false) or (deceased = true and deceased_at is not null));
