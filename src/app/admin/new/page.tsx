import { AppShell } from '@/components/shell';
import { PersonForm } from '@/components/person-form';
import { createPersonAction } from '@/app/actions';
import { requireAdminSession } from '@/lib/auth';
import { getPeople } from '@/lib/people';

export default async function NewPersonPage() {
  await requireAdminSession();
  const parentOptions = await getPeople({ generation: 'child' });

  return (
    <AppShell>
      <section className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Add a birthday</h1>
      </section>

      <div className="max-w-3xl">
        <PersonForm action={createPersonAction} parentOptions={parentOptions} submitLabel="Save member" cancelHref="/admin" />
      </div>
    </AppShell>
  );
}
