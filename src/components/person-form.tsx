'use client';

import Link from 'next/link';
import { useState } from 'react';
import { generationOptions, type Person } from '@/lib/types';
import { SurfaceCard } from './cards';
import { BirthdayWheelPicker } from './birthday-wheel-picker';

function normalizeNameInput(value: string) {
  return value.replace(/(^|[\s-'])([a-z])/g, (_, prefix: string, char: string) => `${prefix}${char.toUpperCase()}`);
}

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
  const [orderNumber, setOrderNumber] = useState(person?.order_number?.toString() ?? '');
  const [isDeceased, setIsDeceased] = useState(person?.deceased ?? false);
  const [showInMemorial, setShowInMemorial] = useState(person?.show_in_memorial ?? false);
  const [deceasedAt, setDeceasedAt] = useState(person?.deceased_at ?? '');
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

        <Field htmlFor="order_number" label="Order number" optional>
          <input
            id="order_number"
            name="order_number"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 55"
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-[color:var(--primary)]"
          />
        </Field>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="deceased"
              checked={isDeceased}
              onChange={(event) => {
                const checked = event.target.checked;
                setIsDeceased(checked);
                if (checked) {
                  setShowInMemorial(true);
                } else {
                  setDeceasedAt('');
                  setShowInMemorial(false);
                }
              }}
              className="h-4 w-4 rounded border-slate-300 text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
            />
            <span>Deceased</span>
          </label>
        </div>

        {isDeceased ? (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Field htmlFor="deceased_at" label="Date of passing">
              <input
                id="deceased_at"
                name="deceased_at"
                type="text"
                inputMode="numeric"
                placeholder="YYYY-MM-DD"
                value={deceasedAt}
                onChange={(event) => setDeceasedAt(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-[color:var(--primary)]"
                required={isDeceased}
              />
            </Field>

            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="show_in_memorial"
                checked={showInMemorial}
                onChange={(event) => setShowInMemorial(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
              />
              <span>Show in memorial section</span>
            </label>
          </div>
        ) : null}

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
