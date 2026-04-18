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
  const generation = params.generation?.trim() ?? '';
  const people = await getPeople({
    includeInactive: false,
    query,
    generation: generation ? (generation as 'child' | 'grandchild' | 'great-grandchild' | 'other') : undefined,
  });

  return (
    <AppShell>
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Manage birthdays</h1>
          <p className="mt-3 max-w-2xl text-sm leading-5 sm:leading-7 text-slate-500">
            See the full family list, add people quickly, and keep birthday records tidy in one place.
          </p>
        </div>
        <Link href="/admin/new" className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition hover:bg-[color:var(--primary-hover)]" style={{ color: '#ffffff' }}>
          <span aria-hidden="true">+</span>
          <span>Add member</span>
        </Link>
      </section>

      <SurfaceCard className="mb-6 p-5">
        <AdminSearch initialQuery={query} initialGeneration={generation as '' | 'child' | 'grandchild' | 'great-grandchild' | 'other'} generationPlaceholder="All generations" />
      </SurfaceCard>

      <AdminTable people={people} emptyMessage={generation ? `No ${generation}s found.` : 'No family members match this view yet.'} />
    </AppShell>
  );
}
