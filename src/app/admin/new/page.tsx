import { AppShell } from '@/components/shell';
import { PersonForm } from '@/components/person-form';
import { createPersonAction } from '@/app/actions';
import { requireAdminSession } from '@/lib/auth';

export default async function NewPersonPage() {
  await requireAdminSession();

  return (
    <AppShell>
      <section className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">Add person</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Add a new family birthday</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Keep this simple. Add the basics, save, and the dashboard will update.
        </p>
      </section>

      <div className="max-w-3xl">
        <PersonForm action={createPersonAction} submitLabel="Save person" />
      </div>
    </AppShell>
  );
}
