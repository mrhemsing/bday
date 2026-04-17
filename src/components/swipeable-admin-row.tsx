'use client';

import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import { deletePersonAction } from '@/app/actions';
import { formatBirthday } from '@/lib/birthdays';
import type { Person } from '@/lib/types';

const REVEAL_WIDTH = 104;

export function SwipeableAdminRow({ person }: { person: Person }) {
  const [translateX, setTranslateX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const startXRef = useRef<number | null>(null);
  const baseXRef = useRef(0);

  function clamp(value: number) {
    return Math.max(-REVEAL_WIDTH, Math.min(0, value));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    startXRef.current = event.clientX;
    baseXRef.current = translateX;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (startXRef.current === null) return;
    const delta = event.clientX - startXRef.current;
    setTranslateX(clamp(baseXRef.current + delta));
  }

  function finishGesture() {
    setDragging(false);
    setTranslateX((current) => (current <= -REVEAL_WIDTH / 2 ? -REVEAL_WIDTH : 0));
    startXRef.current = null;
  }

  function handleDelete() {
    const confirmed = window.confirm(`Delete ${person.full_name}? This cannot be undone.`);
    if (!confirmed) return;

    startTransition(async () => {
      await deletePersonAction(person.id);
    });
  }

  return (
    <div className="relative overflow-hidden border-b border-slate-100 last:border-b-0">
      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <div
        className="relative bg-white/70 transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${translateX}px)`, transitionDuration: dragging ? '0ms' : '200ms' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishGesture}
        onPointerCancel={finishGesture}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900 sm:text-base">{person.full_name}</div>
            <div className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
              {formatBirthday(person.birth_date)} · <span className="capitalize">{person.generation}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${person.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {person.active ? 'Active' : 'Archived'}
            </span>
            <Link href={`/admin/${person.id}`} className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2 sm:text-sm">
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
