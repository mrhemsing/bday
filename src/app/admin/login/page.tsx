import { AppShell } from '@/components/shell';
import { loginAction } from '@/app/actions';

export default function AdminLoginPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">Admin login</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Sign in to manage birthdays</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Use the family admin email account connected to Supabase Auth.
          </p>
        </div>

        <div className="rounded-3xl border border-[color:var(--border)] bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <form action={loginAction} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input id="email" name="email" type="email" required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-300" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input id="password" name="password" type="password" required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-300" />
            </div>
            <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
