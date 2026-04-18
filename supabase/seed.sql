insert into public.people (full_name, birth_date, generation, notes, active, deceased, deceased_at, show_in_memorial)
values
  ('Evelyn Hemsing', '1952-02-14', 'other', 'Family matriarch', true, false, null, false),
  ('Caleb Hemsing', '1984-06-02', 'other', 'Loves hosting the summer cookout', true, false, null, false),
  ('Mara Hemsing', '2012-04-18', 'child', 'Prefers strawberry cake', true, false, null, false),
  ('Owen Hemsing', '2016-11-09', 'grandchild', null, true, false, null, false),
  ('Ivy Hemsing', '2021-12-28', 'great-grandchild', 'Usually celebrates with pancakes', true, false, null, false)
on conflict do nothing;
