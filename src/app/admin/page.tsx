import Link from 'next/link';
import { AppShell } from '@/components/shell';
import { AdminTable } from '@/components/admin-table';
import { SurfaceCard } from '@/components/cards';
import { requireAdminSession } from '@/lib/auth';
import { hasSupabaseEnv } from '@/lib/env';
import { getPeople } from '@/lib/people';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; showArchived?: string }>;
}) {
  await requireAdminSession();
  const params = await searchParams;
  const query = params.query?.trim() ?? '';
  const showArchived = params.showArchived === 'true';
  const people = await getPeople({ includeInactive: showArchived, query });
  const configured = hasSupabaseEnv();

  return (
    <AppShell>
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Manage family birthdays</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Search, edit, archive, or add new family members without digging through spreadsheets.
          </p>
        </div>
        <Link href="/admin/new" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          Add person
        </Link>
      </section>

      {!configured ? (
        <SurfaceCard className="mb-6 border-violet-100 bg-violet-50/75 p-5">
          <p className="text-sm leading-7 text-violet-900">
            Preview mode is on. You can review the full admin experience now, then connect Supabase later for real records and login.
          </p>
        </SurfaceCard>
      ) : null}

      <form className="mb-6 grid gap-4 rounded-3xl border border-[color:var(--border)] bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <input
          type="search"
          name="query"
          defaultValue={query}
          placeholder="Search by name"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-300"
        />
        <label className="flex items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" name="showArchived" value="true" defaultChecked={showArchived} className="h-4 w-4 rounded border-slate-300 text-violet-600" />
          Show archived
        </label>
        <button type="submit" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Apply filters
        </button>
      </form>

      <AdminTable people={people} />
    </AppShell>
  );
}
