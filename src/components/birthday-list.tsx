"use client";

import { useState } from 'react';
import { formatBirthday, formatMonthDay } from '@/lib/birthdays';
import type { BirthdayEntry, Generation } from '@/lib/types';
import { SurfaceCard } from './cards';

const generationBadgeStyles: Record<Generation, string> = {
  child: 'bg-sky-50 text-sky-700 border-transparent',
  grandchild: 'bg-violet-50 text-slate-700 border-transparent',
  'great-grandchild': 'bg-emerald-50 text-emerald-700 border-transparent',
  other: 'bg-slate-100 text-slate-600 border-transparent',
};

const generationLabels: Record<Generation, string> = {
  child: 'Child',
  grandchild: 'Grandchild',
  'great-grandchild': 'Great-Grandchild',
  other: 'Other',
};

function getGenerationLabel(entry: { generation: Generation; order_number: number | null }) {
  const label = generationLabels[entry.generation];
  return entry.order_number ? `${label} (${entry.order_number})` : label;
}

export function BirthdayList({
  title,
  description,
  entries,
  memorialEntries = [],
  mode = 'upcoming',
  viewedMonth,
  currentMonth,
  currentDay,
}: {
  title: string;
  description: string;
  entries: BirthdayEntry[];
  memorialEntries?: BirthdayEntry[];
  mode?: 'upcoming' | 'month';
  viewedMonth?: number;
  currentMonth?: number;
  currentDay?: number;
}) {
  const showCount = entries.length > 0;
  const resolvedCurrentMonth = currentMonth ?? new Date().getMonth() + 1;
  const resolvedCurrentDay = currentDay ?? new Date().getDate();
  const effectiveMonth = viewedMonth ?? resolvedCurrentMonth;
  const isPastViewedMonth = effectiveMonth < resolvedCurrentMonth;
  const isFutureViewedMonth = effectiveMonth > resolvedCurrentMonth;
  const upcomingEntries = mode === 'month'
    ? isPastViewedMonth
      ? []
      : isFutureViewedMonth
        ? entries
        : entries.filter((entry) => entry.day >= resolvedCurrentDay)
    : entries;
  const pastEntries = mode === 'month'
    ? isPastViewedMonth
      ? [...entries].sort((a, b) => b.day - a.day)
      : isFutureViewedMonth
        ? []
        : entries
            .filter((entry) => entry.day < resolvedCurrentDay)
            .sort((a, b) => b.day - a.day)
    : [];
  const titleClassName = title === 'Today' ? 'text-slate-950' : title === 'This Month' ? 'text-slate-800' : 'text-slate-900';
  const descriptionClassName = title === 'This Month' ? 'text-slate-400' : 'text-slate-500';
  const emptyMessage = title === 'Today' ? 'No birthdays today 🎉' : title === 'This Month' ? 'You’re all caught up this month.' : 'Nothing here right now.';

  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-semibold tracking-[-0.03em] ${titleClassName}`}>{title}</h2>
          {description ? <p className={`mt-2 text-base leading-7 ${descriptionClassName}`}>{description}</p> : null}
        </div>
        {showCount ? <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{entries.length}</div> : null}
      </div>

      {entries.length === 0 && memorialEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : mode === 'month' ? (
        <div className="space-y-6">
          {upcomingEntries.length > 0 ? (
            <BirthdaySection
              label="Upcoming Birthdays"
              labelClassName="text-emerald-700"
              containerClassName="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/60 p-4"
              entries={upcomingEntries}
              emptyMessage="No upcoming birthdays this month."
              mode={mode}
              currentMonth={resolvedCurrentMonth}
              currentDay={resolvedCurrentDay}
            />
          ) : null}
          {pastEntries.length > 0 ? (
            <BirthdaySection
              label="Past Birthdays"
              labelClassName="text-slate-500"
              containerClassName="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4"
              entries={pastEntries}
              emptyMessage="No past birthdays this month."
              mode={mode}
              currentMonth={resolvedCurrentMonth}
              currentDay={resolvedCurrentDay}
            />
          ) : null}
          {memorialEntries.length > 0 ? <MemorialSection entries={memorialEntries} /> : null}
        </div>
      ) : (
        <BirthdayEntries entries={entries} mode={mode} currentMonth={resolvedCurrentMonth} currentDay={resolvedCurrentDay} />
      )}
    </SurfaceCard>
  );
}

function BirthdaySection({
  label,
  labelClassName,
  containerClassName,
  entries,
  emptyMessage,
  mode,
  currentMonth,
  currentDay,
}: {
  label: string;
  labelClassName: string;
  containerClassName: string;
  entries: BirthdayEntry[];
  emptyMessage: string;
  mode: 'upcoming' | 'month';
  currentMonth: number;
  currentDay: number;
}) {
  return (
    <div className={containerClassName}>
      <div className={`mb-4 text-sm font-semibold uppercase tracking-[0.22em] ${labelClassName}`}>{label}</div>
      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-5 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <BirthdayEntries entries={entries} mode={mode} currentMonth={currentMonth} currentDay={currentDay} />
      )}
    </div>
  );
}

function BirthdayEntries({
  entries,
  mode,
  currentMonth,
  currentDay,
}: {
  entries: BirthdayEntry[];
  mode: 'upcoming' | 'month';
  currentMonth: number;
  currentDay: number;
}) {
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  function toggleParent(id: string) {
    setExpandedParents((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <div className="space-y-5">
      {entries.map((entry) => {
        const isMonthMode = mode === 'month';
        const hasPassedThisYear = entry.month < currentMonth || (entry.month === currentMonth && entry.day < currentDay);
        const relativeLabel = entry.daysUntil === 0 ? 'Today' : entry.daysUntil === 1 ? 'Tomorrow' : `In ${entry.daysUntil} days`;
        const ageLabel = entry.ageTurning !== null ? `Turning ${entry.ageTurning}` : null;
        const monthModeLabel =
          entry.ageTurning !== null && hasPassedThisYear
            ? `Turned ${entry.ageTurning - 1} on ${formatMonthDay(entry.birth_date)}`
            : entry.ageTurning !== null
              ? `Turning ${entry.ageTurning} on ${formatMonthDay(entry.birth_date)}`
              : formatMonthDay(entry.birth_date);

        const hasParent = entry.generation === 'grandchild' && !!entry.parent?.full_name;
        const isParentExpanded = !!expandedParents[entry.id];

        return (
          <div
            key={entry.id}
            className={`relative overflow-hidden rounded-[1.5rem] border p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${entry.isToday ? 'border-orange-200 bg-orange-50' : 'border-slate-200 bg-white'}`}
          >
            {entry.isToday ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-14 top-2 h-[220px] w-[220px] bg-[url('/cake-watermark.svg')] bg-contain bg-no-repeat opacity-15"
              />
            ) : null}

            <h3 className="relative z-10 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{entry.full_name}</h3>

            <p className={`relative z-10 mt-3 text-lg font-medium ${relativeLabel === 'Today' || relativeLabel === 'Tomorrow' ? 'text-orange-600' : 'text-slate-700'}`}>
              {isMonthMode ? monthModeLabel : ageLabel ? `${ageLabel} ${relativeLabel.toLowerCase()}` : relativeLabel}
            </p>

            <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 text-base text-slate-500">
              {!isMonthMode ? <span>{formatMonthDay(entry.birth_date)}</span> : null}
              {!isMonthMode ? <span>•</span> : null}
              {hasParent ? (
                <button
                  type="button"
                  onClick={() => toggleParent(entry.id)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm font-medium ${generationBadgeStyles[entry.generation]}`}
                >
                  <span>{getGenerationLabel(entry)}</span>
                  <span className={`transition-transform ${isParentExpanded ? 'rotate-90' : ''}`}>▸</span>
                </button>
              ) : (
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-medium ${generationBadgeStyles[entry.generation]}`}
                >
                  {getGenerationLabel(entry)}
                </span>
              )}
              {entry.isToday && !isMonthMode ? <span className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">Today</span> : null}
            </div>

            {hasParent && isParentExpanded ? <p className="relative z-10 mt-3 text-sm font-medium text-slate-500">{entry.parent?.full_name}</p> : null}

            {entry.notes ? <p className="relative z-10 mt-4 text-base leading-7 text-slate-600">{entry.notes}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

function MemorialSection({ entries }: { entries: BirthdayEntry[] }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 p-4" style={{ backgroundColor: '#F5F3FF' }}>
      <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">In Loving Memory</div>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">{entry.full_name}</h3>
            <p className="mt-3 text-lg font-medium text-slate-700">
              {entry.ageTurning !== null ? `Would have turned ${entry.ageTurning} on ${formatMonthDay(entry.birth_date)}` : `Remembered on ${formatMonthDay(entry.birth_date)}`}
            </p>
            {entry.deceased_at ? <p className="mt-2 text-base text-slate-500">Passed {formatBirthday(entry.deceased_at)}</p> : null}
            <div className="mt-3">
              <span className="inline-flex items-center rounded-full border border-transparent bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-500">
                {getGenerationLabel(entry)}
              </span>
            </div>
            {entry.notes ? <p className="mt-4 text-base leading-7 text-slate-600">{entry.notes}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
