import { redirect } from 'next/navigation';
import { env, hasSupabaseEnv } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function requireAdminSession() {
  if (!hasSupabaseEnv()) {
    return { email: 'demo@example.com' };
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user || (env.adminEmail && data.user.email !== env.adminEmail)) {
    redirect('/admin/login');
  }

  return data.user;
}
