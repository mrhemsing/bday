'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { archivePerson, createPerson, deletePerson, updatePerson } from '@/lib/people';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { generationOptions, type Generation } from '@/lib/types';

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === 'on';
}

function validatePersonForm(formData: FormData) {
  const full_name = readString(formData, 'full_name');
  const birth_date = readString(formData, 'birth_date');
  const generation = readString(formData, 'generation') as Generation;
  const notes = readString(formData, 'notes');
  const active = readBoolean(formData, 'active');

  if (!full_name) throw new Error('Please enter a full name.');
  if (!birth_date) throw new Error('Please choose a birth date.');
  if (!generationOptions.includes(generation)) throw new Error('Please choose a valid generation.');

  return { full_name, birth_date, generation, notes, active };
}

export async function createPersonAction(formData: FormData) {
  const payload = validatePersonForm(formData);
  await createPerson(payload);
  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/admin');
}

export async function updatePersonAction(id: string, formData: FormData) {
  const payload = validatePersonForm(formData);
  await updatePerson(id, payload);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath(`/admin/${id}`);
  redirect('/admin');
}

export async function archivePersonAction(id: string) {
  await archivePerson(id);
  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/admin');
}

export async function deletePersonAction(id: string) {
  await deletePerson(id);
  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/admin');
}

export async function loginAction(formData: FormData) {
  const email = readString(formData, 'email');
  const password = readString(formData, 'password');
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }

  redirect('/admin');
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
}
