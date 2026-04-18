'use client';

import { useMemo, useRef, useState } from 'react';
import { formatMonthDay, getMonthName } from '@/lib/birthdays';
import type { BirthdayEntry, Generation } from '@/lib/types';
import { SurfaceCard } from './cards';

const generationBadgeStyles: Record<Generation, string> = {
  child: 'bg-sky-50 text-sky-700 border-transparent',
  grandchild: 'bg-violet-50 text-violet-700 border-transparent',
  'great-grandchild': 'bg-emerald-50 text-emerald-700 border-transparent',
  other: 'bg-slate-100 text-slate-600 border-transparent',
};

const generationLabels: Record<Generation, string> = {
  child: 'Child',
  grandchild: 'Grandchild',
  'great-grandchild': 'Great-Grandchild',
  other: 'Other',
};

const SWIPE_THRESHOLD = 42;

export function MonthBrowser({ entriesByMonth, initialMonth }: { entriesByMonth: BirthdayEntry[][]; initialMonth: number }) {
  const [monthIndex, setMonthIndex] = useState(initialMonth - 1);
  const startXRef = useRef<number | null>(null);

  const entries = useMemo(() => entriesByMonth[monthIndex] ?? [], [entriesByMonth, monthIndex]);

  function moveMonth(direction: -1 | 1) {
    setMonthIndex((current) => (current + direction + 12) % 12);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    startXRef.current = event.clientX;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (startXRef.current === null) return;
    const delta = event.clientX - startXRef.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      moveMonth(delta < 0 ? 1 : -1);
    }
    startXRef.current = null;
  }

  return (
    <SurfaceCard className="p-6">
      <div
        className="rounded-[1.75rem] border border-slate-200 bg-white p-5"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          startXRef.current = null;
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-500 transition hover:text-slate-900"
            aria-label="Previous month"
          >
            ←
          </button>
          <div className="text-center text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            {getMonthName(monthIndex)} {new Date().getFullYear()}
          </div>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-500 transition hover:text-slate-900"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            No birthdays in {getMonthName(monthIndex)}.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{entry.full_name}</h3>
                <p className="mt-3 text-lg font-medium text-slate-700">
                  {entry.ageTurning !== null ? `Turning ${entry.ageTurning}` : 'Birthday'}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-base text-slate-500">
                  <span>{formatMonthDay(entry.birth_date)}</span>
                  <span>•</span>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-medium ${generationBadgeStyles[entry.generation]}`}>
                    {generationLabels[entry.generation]}
                  </span>
                </div>
                {entry.notes ? <p className="mt-4 text-base leading-7 text-slate-600">{entry.notes}</p> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}
