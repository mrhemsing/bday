import { formatMonthDay } from '@/lib/birthdays';
import type { BirthdayEntry } from '@/lib/types';
import { SurfaceCard } from './cards';

export function BirthdayList({ title, description, entries }: { title: string; description: string; entries: BirthdayEntry[] }) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{entries.length}</div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-sm text-slate-500">
          Nothing here right now.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-2xl border px-4 py-4 ${entry.isToday ? 'border-violet-200 bg-violet-50/80' : 'border-slate-200 bg-white/70'}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{entry.full_name}</h3>
                    {entry.isToday ? <span className="rounded-full bg-violet-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">Today</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatMonthDay(entry.birth_date)} · {entry.generation.replace('-', ' ')}
                    {entry.ageTurning !== null ? ` · turning ${entry.ageTurning}` : ''}
                  </p>
                  {entry.notes ? <p className="mt-2 text-sm leading-6 text-slate-600">{entry.notes}</p> : null}
                </div>
                <div className="text-sm font-medium text-slate-500 sm:text-right">
                  {entry.daysUntil === 0 ? 'Today' : entry.daysUntil === 1 ? 'Tomorrow' : `In ${entry.daysUntil} days`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
