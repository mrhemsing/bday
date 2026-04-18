import Link from 'next/link';
import { AdminSearch } from '@/components/admin-search';
import { AppShell } from '@/components/shell';
import { AdminTable } from '@/components/admin-table';
import { SurfaceCard } from '@/components/cards';
import { requireAdminSession } from '@/lib/auth';
import { getPeople } from '@/lib/people';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; generation?: string }>;
}) {
  await requireAdminSession();
  const params = await searchParams;
  const query = params.query?.trim() ?? '';
  const people = await getPeople({ includeInactive: false, query });
  const generation = params.generation?.trim() ?? '';

  return (
    <AppShell>
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Manage birthdays</h1>
          <p className="mt-3 max-w-2xl text-sm leading-5 sm:leading-7 text-slate-500">
            See the full family list, add people quickly, and keep birthday records tidy in one place.
          </p>
        </div>
        <Link href="/admin/new" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700" style={{ color: '#ffffff' }}>
          Add person
        </Link>
      </section>

      <SurfaceCard className="mb-6 p-5">
        <AdminSearch initialQuery={query} initialGeneration={generation as '' | 'child' | 'grandchild' | 'great-grandchild' | 'other'} generationPlaceholder="Select generation" />
      </SurfaceCard>

      <AdminTable people={people} />
    </AppShell>
  );
}
