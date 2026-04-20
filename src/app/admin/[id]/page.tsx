import { AppShell } from '@/components/shell';
import { PersonForm } from '@/components/person-form';
import { deletePersonAction, updatePersonAction } from '@/app/actions';
import { requireAdminSession } from '@/lib/auth';
import { getPeople, getPersonById } from '@/lib/people';

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const person = await getPersonById(id);
  const parentOptions = await getPeople({ generation: 'child' });

  return (
    <AppShell>
      <section className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Update birthday details</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Edit details or permanently delete if this record should be removed.
        </p>
      </section>

      <div className="max-w-3xl space-y-6">
        <PersonForm action={updatePersonAction.bind(null, id)} person={person} parentOptions={parentOptions} submitLabel="Save changes" cancelHref="/admin" />

        <div className="flex justify-end rounded-3xl border border-[color:var(--border)] bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <form action={deletePersonAction.bind(null, id)}>
            <button type="submit" className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">
              Delete person
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
