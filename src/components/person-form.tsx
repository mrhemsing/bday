'use client';

import Link from 'next/link';
import { useState } from 'react';

function normalizeNameInput(value: string) {
  return value.replace(/(^|[\s-'])([a-z])/g, (_, prefix: string, char: string) => `${prefix}${char.toUpperCase()}`);
}
import { generationOptions, type Person } from '@/lib/types';
import { SurfaceCard } from './cards';
import { BirthdayWheelPicker } from './birthday-wheel-picker';

function splitBirthDate(value?: string) {
  const [year = '', month = '', day = ''] = value?.split('-') ?? [];
  return { year, month, day };
}

export function PersonForm({
  action,
  person,
  submitLabel,
  cancelHref,
}: {
  action: (formData: FormData) => void | Promise<void>;
  person?: Person;
  submitLabel: string;
  cancelHref?: string;
}) {
  const initialBirthDate = splitBirthDate(person?.birth_date);
  const [fullName, setFullName] = useState(person?.full_name ?? '');
  const [birthDate, setBirthDate] = useState({
    month: initialBirthDate.month || '01',
    day: initialBirthDate.day || '01',
    year: initialBirthDate.year || String(new Date().getFullYear()),
  });

  return (
    <SurfaceCard className="p-6 sm:p-8">
      <form action={action} className="space-y-6">
        <input
          id="full_name"
          name="full_name"
          value={fullName}
          onChange={(event) => setFullName(normalizeNameInput(event.target.value))}
          placeholder="Full name"
          autoCapitalize="words"
          required
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-[color:var(--primary)]"
        />

        <div className="space-y-2">
          <BirthdayWheelPicker month={birthDate.month} day={birthDate.day} year={birthDate.year} onChange={setBirthDate} />
          <input type="hidden" id="birth_month" name="birth_month" value={birthDate.month} />
          <input type="hidden" name="birth_day" value={birthDate.day} />
          <input type="hidden" name="birth_year" value={birthDate.year} />
        </div>

        <Field htmlFor="generation">
          <select
            id="generation"
            name="generation"
            defaultValue={person?.generation ?? ''}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-[41px] text-slate-900 outline-none ring-0 transition focus:border-[color:var(--primary)]"
            required
          >
            <option value="" disabled>
              Select generation
            </option>
            {generationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-center justify-end gap-3">
          {cancelHref ? (
            <Link
              href={cancelHref}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          ) : null}
          <button
            type="submit"
            className="rounded-full bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--primary-hover)]"
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
  label?: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
          {label}
          {optional ? <span className="ml-1 text-slate-400">(optional)</span> : null}
        </label>
      ) : null}
      {children}
    </div>
  );
}
