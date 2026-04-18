import { formatMonthDay } from '@/lib/birthdays';
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

export function BirthdayList({ title, description, entries }: { title: string; description: string; entries: BirthdayEntry[] }) {
  const showCount = entries.length > 0;
  const titleClassName = title === 'Today' ? 'text-slate-950' : title === 'This Month' ? 'text-slate-800' : 'text-slate-900';
  const descriptionClassName = title === 'This Month' ? 'text-slate-400' : 'text-slate-500';
  const emptyMessage = title === 'Today' ? 'No birthdays today 🎉' : title === 'This Month' ? 'You’re all caught up this month.' : 'Nothing here right now.';

  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-semibold tracking-[-0.03em] ${titleClassName}`}>{title}</h2>
          <p className={`mt-2 text-base leading-7 ${descriptionClassName}`}>{description}</p>
        </div>
        {showCount ? <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{entries.length}</div> : null}
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-5">
          {entries.map((entry) => {
            const relativeLabel = entry.daysUntil === 0 ? 'Today' : entry.daysUntil === 1 ? 'Tomorrow' : `In ${entry.daysUntil} days`;
            const ageLabel = entry.ageTurning !== null ? `Turning ${entry.ageTurning}` : null;

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
                  {ageLabel ? `${ageLabel} ${relativeLabel.toLowerCase()}` : relativeLabel}
                </p>

                <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 text-base text-slate-500">
                  <span>{formatMonthDay(entry.birth_date)}</span>
                  <span>•</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-medium ${generationBadgeStyles[entry.generation]}`}
                  >
                    {generationLabels[entry.generation]}
                  </span>
                  {entry.isToday ? <span className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">Today</span> : null}
                </div>

                {entry.notes ? <p className="relative z-10 mt-4 text-base leading-7 text-slate-600">{entry.notes}</p> : null}
              </div>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
