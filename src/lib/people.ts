import { cache } from 'react';
import type { Generation, Person } from './types';
import { createSupabaseAdminClient } from './supabase/server';

export interface PersonInput {
  full_name: string;
  birth_date: string;
  generation: Generation;
  notes?: string;
  active?: boolean;
}

export const getPeople = cache(async (options?: { includeInactive?: boolean; query?: string }) => {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from('people').select('*').order('birth_date', { ascending: true });

  if (!options?.includeInactive) {
    query = query.eq('active', true);
  }

  if (options?.query) {
    query = query.ilike('full_name', `%${options.query}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Person[];
});

export async function getPersonById(id: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('people').select('*').eq('id', id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Person;
}

export async function createPerson(input: PersonInput) {
  const supabase = createSupabaseAdminClient();
  const payload = {
    full_name: input.full_name.trim(),
    birth_date: input.birth_date,
    generation: input.generation,
    notes: input.notes?.trim() || null,
    active: input.active ?? true,
  };

  const { error } = await supabase.from('people').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updatePerson(id: string, input: PersonInput) {
  const supabase = createSupabaseAdminClient();
  const payload = {
    full_name: input.full_name.trim(),
    birth_date: input.birth_date,
    generation: input.generation,
    notes: input.notes?.trim() || null,
    active: input.active ?? true,
  };

  const { error } = await supabase.from('people').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function archivePerson(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('people').update({ active: false }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePerson(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('people').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
