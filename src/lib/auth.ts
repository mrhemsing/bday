import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/session';

export async function requireAdminSession() {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect('/admin/login');
  }

  return { username: 'admin' };
}
