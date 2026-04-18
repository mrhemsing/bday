'use client';

import { useMemo, useRef, useState } from 'react';
import { BirthdayList } from '@/components/birthday-list';
import { SurfaceCard } from '@/components/cards';
import { formatMonthDay, getMonthName } from '@/lib/birthdays';
import type { BirthdayEntry } from '@/lib/types';

const SWIPE_THRESHOLD = 42;


export function HomeContent({
  totalMembers,
  entriesByMonth,
  todayEntries,
  nextUp,
  initialMonth,
}: {
  totalMembers: number;
  entriesByMonth: BirthdayEntry[][];
  todayEntries: BirthdayEntry[];
  nextUp: BirthdayEntry | null;
  initialMonth: number;
}) {
  const [monthIndex, setMonthIndex] = useState(initialMonth - 1);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);

  const entries = useMemo(() => entriesByMonth[monthIndex] ?? [], [entriesByMonth, monthIndex]);
  const monthName = getMonthName(monthIndex);
  const year = new Date().getFullYear();
  const isCurrentMonth = monthIndex === initialMonth - 1;

  function moveMonth(direction: -1 | 1) {
    setMonthIndex((current) => (current + direction + 12) % 12);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    if (!touch) return;
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.changedTouches[0];
    if (!touch || startXRef.current === null || startYRef.current === null) return;
    const deltaX = touch.clientX - startXRef.current;
    const deltaY = touch.clientY - startYRef.current;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      moveMonth(deltaX < 0 ? 1 : -1);
    }
    startXRef.current = null;
    startYRef.current = null;
  }

  function handleTouchCancel() {
    startXRef.current = null;
    startYRef.current = null;
  }

  return (
    <div
      className="grid gap-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <SurfaceCard className="p-8">
        <div className="max-w-2xl">
          <div className="mt-5">
            <div className="month-header-nudge text-left text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:hidden">
              {monthName} {year}
            </div>
            <div className="mt-4 hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-500 transition hover:text-slate-900"
                aria-label="Previous month"
              >
                ←
              </button>
              <div className="text-left text-4xl font-semibold tracking-[-0.03em] text-slate-950">
                {monthName} {year}
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
          </div>
        </div>
      </SurfaceCard>

      {isCurrentMonth && (todayEntries.length > 0 || nextUp) ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {todayEntries.length > 0 ? <BirthdayList title="Today" description="" entries={todayEntries} /> : <div className="hidden lg:block" />}

          {nextUp ? (
            <SurfaceCard className="bg-orange-50 p-6">
              <div className="flex h-full flex-col gap-2 sm:justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Next up</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{nextUp.full_name}</div>
                </div>
                <div className="text-base font-medium text-slate-600">
                  {nextUp.ageTurning !== null ? `Turning ${nextUp.ageTurning} • ` : ''}
                  {formatMonthDay(nextUp.birth_date)}
                  <div className="mt-1 font-semibold text-orange-600">
                    {nextUp.daysUntil === 0 ? 'Today' : nextUp.daysUntil === 1 ? 'Tomorrow' : `In ${nextUp.daysUntil} days`}
                  </div>
                </div>
              </div>
            </SurfaceCard>
          ) : (
            <div className="hidden lg:block" />
          )}
        </div>
      ) : null}

      <BirthdayList title="This Month" description={`All birthdays in ${monthName}.`} entries={entries} mode="month" viewedMonth={monthIndex + 1} />
    </div>
  );
}
