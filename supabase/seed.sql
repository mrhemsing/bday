insert into public.people (full_name, birth_date, generation, notes, active)
values
  ('Evelyn Hemsing', '1952-02-14', 'other', 'Family matriarch', true),
  ('Caleb Hemsing', '1984-06-02', 'other', 'Loves hosting the summer cookout', true),
  ('Mara Hemsing', '2012-04-18', 'child', 'Prefers strawberry cake', true),
  ('Owen Hemsing', '2016-11-09', 'grandchild', null, true),
  ('Ivy Hemsing', '2021-12-28', 'great-grandchild', 'Usually celebrates with pancakes', true)
on conflict do nothing;
