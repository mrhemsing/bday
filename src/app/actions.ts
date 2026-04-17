'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { archivePerson, createPerson, deletePerson, updatePerson } from '@/lib/people';
import { env } from '@/lib/env';
import { clearAdminSession, createAdminSession } from '@/lib/session';
import { generationOptions, type Generation } from '@/lib/types';

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === 'on';
}

function validatePersonForm(formData: FormData) {
  const full_name = readString(formData, 'full_name');
  const birthYear = readString(formData, 'birth_year');
  const birthMonth = readString(formData, 'birth_month');
  const birthDay = readString(formData, 'birth_day');
  const generation = readString(formData, 'generation') as Generation;
  const notes = readString(formData, 'notes');
  const active = readBoolean(formData, 'active');

  if (!full_name) throw new Error('Please enter a full name.');
  if (!birthYear || !birthMonth || !birthDay) throw new Error('Please choose a complete birth date.');
  if (!generationOptions.includes(generation)) throw new Error('Please choose a valid generation.');

  const birth_date = `${birthYear.padStart(4, '0')}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
  const parsed = new Date(`${birth_date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) throw new Error('Please choose a valid birth date.');

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
  const username = readString(formData, 'username');
  const password = readString(formData, 'password');

  if (username !== env.adminUsername || password !== env.adminPassword) {
    throw new Error('Invalid username or password.');
  }

  await createAdminSession();
  redirect('/admin');
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/admin/login');
}
