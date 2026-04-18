alter table public.people
  add column if not exists order_number integer null;

create index if not exists people_order_number_idx on public.people (order_number);
