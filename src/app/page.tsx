import { AppShell } from '@/components/shell';
import { BirthdayList } from '@/components/birthday-list';
import { StatCard, SurfaceCard } from '@/components/cards';
import { getBirthdayStats, groupBirthdays } from '@/lib/birthdays';
import { getPeople } from '@/lib/people';

export default async function HomePage() {
  const people = await getPeople({ includeInactive: false });
  const buckets = groupBirthdays(people);
  const stats = getBirthdayStats(people);

  return (
    <AppShell>
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <SurfaceCard className="p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">Upcoming family birthdays</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Keep every Hemsing birthday easy to see.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              A clean family dashboard for today, this week, and this month, with ages and generations ready at a glance.
            </p>
          </div>
        </SurfaceCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Birthdays today" value={stats.today} />
          <StatCard label="This week" value={stats.thisWeek} />
          <StatCard label="This month" value={stats.thisMonth} />
          <StatCard label="Active people" value={stats.totalActive} />
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
