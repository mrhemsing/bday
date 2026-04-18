'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPerson, deletePerson, updatePerson } from '@/lib/people';
import { env } from '@/lib/env';
import { clearAdminSession, createAdminSession } from '@/lib/session';
import { generationOptions, type Generation } from '@/lib/types';

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00`);
  return !Number.isNaN(parsed.getTime());
}

function validatePersonForm(formData: FormData) {
  const full_name = readString(formData, 'full_name');
  const birthYear = readString(formData, 'birth_year');
  const birthMonth = readString(formData, 'birth_month');
  const birthDay = readString(formData, 'birth_day');
  const generation = readString(formData, 'generation') as Generation;
  const order_number_raw = readString(formData, 'order_number');
  const deceased = formData.get('deceased') === 'on';
  const deceased_at = readString(formData, 'deceased_at');

  if (!full_name) throw new Error('Please enter a full name.');
  if (!birthYear || !birthMonth || !birthDay) throw new Error('Please choose a complete birth date.');
  if (!generationOptions.includes(generation)) throw new Error('Please choose a valid generation.');

  const birth_date = `${birthYear.padStart(4, '0')}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
  if (!isValidDateString(birth_date)) throw new Error('Please choose a valid birth date.');

  const order_number = order_number_raw ? Number(order_number_raw) : null;
  const hasValidOrderNumber = order_number !== null && Number.isInteger(order_number) && order_number > 0;
  if (order_number_raw && !hasValidOrderNumber) {
    throw new Error('Please enter a valid positive order number.');
  }

  if (deceased && !deceased_at) {
    throw new Error('Please enter a date of passing.');
  }

  if (deceased_at && !isValidDateString(deceased_at)) {
    throw new Error('Please enter the passing date as YYYY-MM-DD.');
  }

  return {
    full_name,
    birth_date,
    generation,
    order_number,
    deceased,
    deceased_at: deceased ? deceased_at : null,
    show_in_memorial: deceased,
  };
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
