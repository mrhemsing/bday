import { AppShell } from '@/components/shell';
import { PersonForm } from '@/components/person-form';
import { archivePersonAction, deletePersonAction, updatePersonAction } from '@/app/actions';
import { requireAdminSession } from '@/lib/auth';
import { getPersonById } from '@/lib/people';

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const person = await getPersonById(id);

  return (
    <AppShell>
      <section className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">Edit person</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Update birthday details</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Edit details, archive when needed, or permanently delete if this record should be removed.
        </p>
      </section>

      <div className="max-w-3xl space-y-6">
        <PersonForm action={updatePersonAction.bind(null, id)} person={person} submitLabel="Save changes" />

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[color:var(--border)] bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <form action={archivePersonAction.bind(null, id)}>
            <button type="submit" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Archive person
            </button>
          </form>
          <form action={deletePersonAction.bind(null, id)}>
            <button type="submit" className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">
              Delete permanently
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
