import { AppShell } from '@/components/shell';
import { HomeContent } from '@/components/home-content';
import { getBirthdaysForMonth, getBirthdayStats, getMemorialBirthdaysForMonth, groupBirthdays } from '@/lib/birthdays';
import { getPeople } from '@/lib/people';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const people = await getPeople();
  const stats = getBirthdayStats(people);
  const buckets = groupBirthdays(people);
  const hasTodayBirthdays = buckets.today.length > 0;
  const nextUp = hasTodayBirthdays ? buckets.upcoming.find((entry) => !entry.isToday) ?? null : buckets.upcoming[0] ?? null;
  const currentMonth = new Date().getMonth() + 1;
  const entriesByMonth = Array.from({ length: 12 }, (_, index) => getBirthdaysForMonth(people, index + 1));
  const memorialEntriesByMonth = Array.from({ length: 12 }, (_, index) => getMemorialBirthdaysForMonth(people, index + 1));

  return (
    <AppShell memberCount={stats.totalActive}>
      <HomeContent
        totalMembers={stats.totalActive}
        entriesByMonth={entriesByMonth}
        memorialEntriesByMonth={memorialEntriesByMonth}
        todayEntries={buckets.today}
        nextUp={nextUp}
        initialMonth={currentMonth}
      />
    </AppShell>
  );
}
