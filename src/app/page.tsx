import { AppShell } from '@/components/shell';
import { BirthdayList } from '@/components/birthday-list';
import { StatCard, SurfaceCard } from '@/components/cards';
import { formatMonthDay, getBirthdayStats, groupBirthdays } from '@/lib/birthdays';
import { getPeople } from '@/lib/people';

export default async function HomePage() {
  const people = await getPeople({ includeInactive: false });
  const buckets = groupBirthdays(people);
  const stats = getBirthdayStats(people);
  const nextUp = buckets.upcoming[0];

  return (
    <AppShell>
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <SurfaceCard className="p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">Upcoming family birthdays</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Hemsing Family Birthday Calendar
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              Because 22 kids turns into a lot of cake! 🎂 Keep every birthday easy to see, with today, this week, and this month all at a glance.
            </p>

            {nextUp ? (
              <div className="mt-8 rounded-3xl border border-violet-100 bg-violet-50/80 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">Next up</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{nextUp.full_name}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  {formatMonthDay(nextUp.birth_date)}
                  {nextUp.ageTurning !== null ? `, turning ${nextUp.ageTurning}` : ''}
                  {nextUp.daysUntil === 0 ? ' today.' : `, in ${nextUp.daysUntil} days.`}
                </div>
              </div>
            ) : null}
          </div>
        </SurfaceCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Birthdays today" value={stats.today} detail="Celebrations happening now" />
          <StatCard label="This week" value={stats.thisWeek} detail="Including today" />
          <StatCard label="This month" value={stats.thisMonth} detail="Remaining this month" />
          <StatCard label="Active people" value={stats.totalActive} detail="Shown on the dashboard" />
        </div>
      </section>

      <section className="grid gap-6">
        <BirthdayList title="Today" description="Family birthdays happening right now." entries={buckets.today} />
        <BirthdayList title="This Week" description="The next birthdays coming up soon." entries={buckets.thisWeek} />
        <BirthdayList title="This Month" description="The rest of the birthdays still ahead this month." entries={buckets.thisMonth} />
      </section>
    </AppShell>
  );
}
