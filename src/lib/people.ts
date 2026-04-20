import type { Generation, Person } from './types';
import { hasSupabaseEnv } from './env';
import { createSupabaseAdminClient } from './supabase/server';

const samplePeople: Person[] = [
  {
    id: 'sample-evelyn-hemsing',
    full_name: 'Evelyn Hemsing',
    birth_date: '1952-02-14',
    generation: 'other',
    order_number: null,
    parent_id: null,
    notes: 'Family matriarch',
    deceased: false,
    deceased_at: null,
    show_in_memorial: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-caleb-hemsing',
    full_name: 'Caleb Hemsing',
    birth_date: '1984-06-02',
    generation: 'other',
    order_number: null,
    parent_id: null,
    notes: 'Loves hosting the summer cookout',
    deceased: false,
    deceased_at: null,
    show_in_memorial: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-mara-hemsing',
    full_name: 'Mara Hemsing',
    birth_date: '2012-04-18',
    generation: 'child',
    order_number: null,
    parent_id: null,
    notes: 'Prefers strawberry cake',
    deceased: false,
    deceased_at: null,
    show_in_memorial: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-owen-hemsing',
    full_name: 'Owen Hemsing',
    birth_date: '2016-11-09',
    generation: 'grandchild',
    order_number: null,
    parent_id: null,
    notes: null,
    deceased: false,
    deceased_at: null,
    show_in_memorial: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-ivy-hemsing',
    full_name: 'Ivy Hemsing',
    birth_date: '2021-12-28',
    generation: 'great-grandchild',
    order_number: null,
    parent_id: null,
    notes: 'Usually celebrates with pancakes',
    deceased: false,
    deceased_at: null,
    show_in_memorial: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export interface PersonInput {
  full_name: string;
  birth_date: string;
  generation: Generation;
  order_number?: number | null;
  parent_id?: string | null;
  deceased?: boolean;
  deceased_at?: string | null;
  show_in_memorial?: boolean;
}

export async function getPeople(options?: { query?: string; generation?: Generation }) {
  if (!hasSupabaseEnv()) {
    return samplePeople
      .filter((person) => !options?.query || person.full_name.toLowerCase().includes(options.query.toLowerCase()))
      .filter((person) => !options?.generation || person.generation === options.generation)
      .sort((a, b) => a.full_name.localeCompare(b.full_name));
  }

  const supabase = createSupabaseAdminClient();
  let query = supabase.from('people').select('*, parent:parent_id(id, full_name)').order('full_name', { ascending: true });

  if (options?.query) {
    query = query.ilike('full_name', `%${options.query}%`);
  }

  if (options?.generation) {
    query = query.eq('generation', options.generation);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Person[];
}

export async function getPersonById(id: string) {
  if (!hasSupabaseEnv()) {
    const person = samplePeople.find((entry) => entry.id === id);
    if (!person) throw new Error('Person not found.');
    return person;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('people').select('*, parent:parent_id(id, full_name)').eq('id', id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Person;
}

export async function createPerson(input: PersonInput) {
  if (!hasSupabaseEnv()) {
    throw new Error('Supabase environment variables are required before creating records.');
  }

  const supabase = createSupabaseAdminClient();
  const payload = {
    full_name: input.full_name.trim(),
    birth_date: input.birth_date,
    generation: input.generation,
    order_number: input.order_number ?? null,
    parent_id: input.parent_id ?? null,
    deceased: input.deceased ?? false,
    deceased_at: input.deceased ? input.deceased_at ?? null : null,
    show_in_memorial: input.deceased ?? false,
  };

  const { error } = await supabase.from('people').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updatePerson(id: string, input: PersonInput) {
  if (!hasSupabaseEnv()) {
    throw new Error('Supabase environment variables are required before updating records.');
  }

  const supabase = createSupabaseAdminClient();
  const payload = {
    full_name: input.full_name.trim(),
    birth_date: input.birth_date,
    generation: input.generation,
    order_number: input.order_number ?? null,
    parent_id: input.parent_id ?? null,
    deceased: input.deceased ?? false,
    deceased_at: input.deceased ? input.deceased_at ?? null : null,
    show_in_memorial: input.deceased ?? false,
  };

  const { error } = await supabase.from('people').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePerson(id: string) {
  if (!hasSupabaseEnv()) {
    throw new Error('Supabase environment variables are required before deleting records.');
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('people').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
