import { generationOptions, type Person } from '@/lib/types';
import { SurfaceCard } from './cards';

export function PersonForm({
  action,
  person,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  person?: Person;
  submitLabel: string;
}) {
  return (
    <SurfaceCard className="p-6 sm:p-8">
      <form action={action} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Full name" htmlFor="full_name">
            <input
              id="full_name"
              name="full_name"
              defaultValue={person?.full_name ?? ''}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-violet-300"
            />
          </Field>
          <Field label="Birth date" htmlFor="birth_date">
            <input
              id="birth_date"
              name="birth_date"
              type="date"
              defaultValue={person?.birth_date ?? ''}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-violet-300"
            />
          </Field>
        </div>

        <Field label="Generation" htmlFor="generation">
          <select
            id="generation"
            name="generation"
            defaultValue={person?.generation ?? 'other'}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-violet-300"
          >
            {generationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Notes" htmlFor="notes" optional>
          <textarea
            id="notes"
            name="notes"
            defaultValue={person?.notes ?? ''}
            rows={4}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-violet-300"
          />
        </Field>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" name="active" defaultChecked={person?.active ?? true} className="h-4 w-4 rounded border-slate-300 text-violet-600" />
          Keep this person active in upcoming birthday lists
        </label>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </SurfaceCard>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
        {optional ? <span className="ml-1 text-slate-400">(optional)</span> : null}
      </label>
      {children}
    </div>
  );
}
