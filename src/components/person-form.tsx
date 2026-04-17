import { generationOptions, type Person } from '@/lib/types';
import { SurfaceCard } from './cards';

const monthOptions = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const dayOptions = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0'));
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 130 }, (_, index) => String(currentYear - index));

function splitBirthDate(value?: string) {
  const [year = '', month = '', day = ''] = value?.split('-') ?? [];
  return { year, month, day };
}

export function PersonForm({
  action,
  person,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  person?: Person;
  submitLabel: string;
}) {
  const birthDate = splitBirthDate(person?.birth_date);

  return (
    <SurfaceCard className="p-6 sm:p-8">
      <form action={action} className="space-y-6">
        <Field label="Full name" htmlFor="full_name">
          <input
            id="full_name"
            name="full_name"
            defaultValue={person?.full_name ?? ''}
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-violet-300"
          />
        </Field>

        <Field label="Birth date" htmlFor="birth_month">
          <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr_1fr]">
            <select
              id="birth_month"
              name="birth_month"
              defaultValue={birthDate.month || ''}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-violet-300"
            >
              <option value="">Month</option>
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              name="birth_day"
              defaultValue={birthDate.day || ''}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-violet-300"
            >
              <option value="">Day</option>
              {dayOptions.map((option) => (
                <option key={option} value={option}>
                  {Number(option)}
                </option>
              ))}
            </select>
            <select
              name="birth_year"
              defaultValue={birthDate.year || ''}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-violet-300"
            >
              <option value="">Year</option>
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs leading-5 text-slate-400">Month, day, and year each get their own picker so older birthdays are much faster to enter on mobile.</p>
        </Field>

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
