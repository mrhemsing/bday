import type { BirthdayBuckets, BirthdayEntry, BirthdayStats, Person } from './types';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseBirthDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
}

export function getNextBirthdayDate(birthDate: string, referenceDate = new Date()) {
  const { month, day } = parseBirthDate(birthDate);
  const reference = startOfDay(referenceDate);
  let nextBirthday = new Date(reference.getFullYear(), month - 1, day);

  if (nextBirthday < reference) {
    nextBirthday = new Date(reference.getFullYear() + 1, month - 1, day);
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
  const reference = startOfDay(referenceDate);
  const nextBirthday = getNextBirthdayDate(birthDate, referenceDate);
  return Math.round((nextBirthday.getTime() - reference.getTime()) / DAY_IN_MS);
}

export function toBirthdayEntry(person: Person, referenceDate = new Date()): BirthdayEntry {
  const { month, day } = parseBirthDate(person.birth_date);
  const nextBirthday = getNextBirthdayDate(person.birth_date, referenceDate);
  const daysUntil = getDaysUntilBirthday(person.birth_date, referenceDate);

  return {
    ...person,
    month,
    day,
    nextBirthday,
    ageTurning: getAgeTurning(person.birth_date, referenceDate),
    daysUntil,
    isToday: daysUntil === 0,
    isThisWeek: daysUntil >= 0 && daysUntil <= 7,
    isThisMonth: nextBirthday.getFullYear() === referenceDate.getFullYear()
      ? nextBirthday.getMonth() === referenceDate.getMonth()
      : nextBirthday.getMonth() === referenceDate.getMonth() || (referenceDate.getMonth() === 11 && nextBirthday.getMonth() === 0),
  };
}

export function getUpcomingBirthdays(people: Person[], referenceDate = new Date()) {
  return people
    .filter((person) => person.active)
    .map((person) => toBirthdayEntry(person, referenceDate))
    .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime() || a.full_name.localeCompare(b.full_name));
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
    totalActive: people.filter((person) => person.active).length,
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
