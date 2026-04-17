import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

export async function requireAdminSession() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user || (env.adminEmail && data.user.email !== env.adminEmail)) {
    redirect('/admin/login');
  }

  return data.user;
}
