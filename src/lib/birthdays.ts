import type { BirthdayBuckets, BirthdayEntry, BirthdayStats, Person } from './types';

const PACIFIC_TIME_ZONE = 'America/Los_Angeles';
const DAY_IN_MS = 1000 * 60 * 60 * 24;

function getPacificDateParts(referenceDate = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: PACIFIC_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(referenceDate);
  const year = Number(parts.find((part) => part.type === 'year')?.value ?? 0);
  const month = Number(parts.find((part) => part.type === 'month')?.value ?? 0);
  const day = Number(parts.find((part) => part.type === 'day')?.value ?? 0);

  return { year, month, day };
}

function getPacificStartOfDay(referenceDate = new Date()) {
  const { year, month, day } = getPacificDateParts(referenceDate);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function getMonthName(monthIndex: number) {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2026, monthIndex, 1));
}

function parseBirthDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
}

export function getNextBirthdayDate(birthDate: string, referenceDate = new Date()) {
  const { month, day } = parseBirthDate(birthDate);
  const { year } = getPacificDateParts(referenceDate);
  const reference = getPacificStartOfDay(referenceDate);
  let nextBirthday = new Date(Date.UTC(year, month - 1, day, 12));

  if (nextBirthday < reference) {
    nextBirthday = new Date(Date.UTC(year + 1, month - 1, day, 12));
  }

  return nextBirthday;
}

export function getAgeTurning(birthDate: string, referenceDate = new Date()) {
  const { year } = parseBirthDate(birthDate);
  if (!year || Number.isNaN(year)) return null;

  const nextBirthday = getNextBirthdayDate(birthDate, referenceDate);
  return nextBirthday.getFullYear() - year;
}

export function getDaysUntilBirthday(birthDate: string, referenceDate = new Date()) {
  const reference = getPacificStartOfDay(referenceDate);
  const nextBirthday = getNextBirthdayDate(birthDate, referenceDate);
  return Math.round((nextBirthday.getTime() - reference.getTime()) / DAY_IN_MS);
}

export function toBirthdayEntry(person: Person, referenceDate = new Date()): BirthdayEntry {
  const { month, day } = parseBirthDate(person.birth_date);
  const nextBirthday = getNextBirthdayDate(person.birth_date, referenceDate);
  const daysUntil = getDaysUntilBirthday(person.birth_date, referenceDate);
  const pacificToday = getPacificDateParts(referenceDate);

  return {
    ...person,
    month,
    day,
    nextBirthday,
    ageTurning: getAgeTurning(person.birth_date, referenceDate),
    daysUntil,
    isToday: month === pacificToday.month && day === pacificToday.day,
    isThisWeek: daysUntil >= 0 && daysUntil <= 7,
    isThisMonth: nextBirthday.getMonth() === pacificToday.month - 1,
  };
}

export function getUpcomingBirthdays(people: Person[], referenceDate = new Date()) {
  return people
    .filter((person) => !person.deceased)
    .map((person) => toBirthdayEntry(person, referenceDate))
    .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime() || a.full_name.localeCompare(b.full_name));
}

export function getMemorialBirthdaysForMonth(people: Person[], month: number, referenceDate = new Date()) {
  return people
    .filter((person) => person.deceased && person.show_in_memorial)
    .map((person) => {
      const entry = toBirthdayEntry(person, referenceDate);
      const memorialMonth = person.deceased_at ? parseBirthDate(person.deceased_at).month : entry.month;
      const memorialDay = person.deceased_at ? parseBirthDate(person.deceased_at).day : entry.day;

      return {
        ...entry,
        memorialMonth,
        memorialDay,
      };
    })
    .filter((entry) => entry.memorialMonth === month)
    .sort((a, b) => a.memorialDay - b.memorialDay || a.full_name.localeCompare(b.full_name));
}

export function groupBirthdays(people: Person[], referenceDate = new Date()): BirthdayBuckets {
  const upcoming = getUpcomingBirthdays(people, referenceDate);
  const today = upcoming.filter((entry) => entry.isToday);
  const thisWeek = upcoming.filter((entry) => entry.daysUntil > 0 && entry.daysUntil <= 7);
  const thisMonth = upcoming.filter((entry) => entry.daysUntil > 7 && entry.isThisMonth);

  return {
    today,
    thisWeek,
    thisMonth,
    upcoming,
  };
}

export function getBirthdayStats(people: Person[], referenceDate = new Date()): BirthdayStats {
  const buckets = groupBirthdays(people, referenceDate);
  return {
    today: buckets.today.length,
    thisWeek: buckets.today.length + buckets.thisWeek.length,
    thisMonth: buckets.today.length + buckets.thisWeek.length + buckets.thisMonth.length,
    totalActive: people.filter((person) => !person.deceased).length,
  };
}

export function formatBirthday(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`));
}

export function formatMonthDay(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`));
}

export function formatWeekdayMonthDay(date: Date) {
  const safeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: PACIFIC_TIME_ZONE,
  }).format(safeDate);
}

export function getBirthdaysForMonth(people: Person[], month: number, referenceDate = new Date()) {
  return people
    .filter((person) => !person.deceased)
    .map((person) => toBirthdayEntry(person, referenceDate))
    .filter((entry) => entry.month === month)
    .sort((a, b) => a.day - b.day || a.full_name.localeCompare(b.full_name));
}
