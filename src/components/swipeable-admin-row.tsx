'use client';

import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deletePersonAction } from '@/app/actions';
import { formatBirthday } from '@/lib/birthdays';
import type { Generation, Person } from '@/lib/types';

const REVEAL_WIDTH = 80;
const SWIPE_THRESHOLD = 18;

const generationBadgeStyles: Record<Generation, string> = {
  child: 'bg-sky-100 text-sky-700',
  grandchild: 'bg-violet-100 text-violet-700',
  'great-grandchild': 'bg-emerald-100 text-emerald-700',
  other: 'bg-slate-100 text-slate-600',
};

export function SwipeableAdminRow({ person }: { person: Person }) {
  const [translateX, setTranslateX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const startXRef = useRef<number | null>(null);
  const baseXRef = useRef(0);
  const hasMovedRef = useRef(false);
  const router = useRouter();

  function clamp(value: number) {
    return Math.max(-REVEAL_WIDTH, Math.min(0, value));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    startXRef.current = event.clientX;
    baseXRef.current = translateX;
    hasMovedRef.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (startXRef.current === null) return;
    const delta = event.clientX - startXRef.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      hasMovedRef.current = true;
    }
    setTranslateX(clamp(baseXRef.current + delta));
  }

  function finishGesture() {
    setDragging(false);
    setTranslateX((current) => (current <= -REVEAL_WIDTH / 2 ? -REVEAL_WIDTH : 0));
    startXRef.current = null;
  }

  function handleRowClick() {
    if (dragging || hasMovedRef.current) return;
    router.push(`/admin/${person.id}`);
  }

  function handleDelete() {
    const confirmed = window.confirm(`Delete ${person.full_name}? This cannot be undone.`);
    if (!confirmed) return;

    startTransition(async () => {
      await deletePersonAction(person.id);
    });
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] touch-pan-y">
      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 transition-opacity duration-150 ${translateX < -12 ? 'opacity-100' : 'opacity-0'}`}>
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${person.full_name}`}
          title={`Delete ${person.full_name}`}
          disabled={isPending || translateX > -12}
          className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-0"
        >
          <span aria-hidden="true" className="text-[11px] leading-none text-white">🗑️</span>
        </button>
      </div>

      <div
        className="relative bg-white transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${translateX}px)`, transitionDuration: dragging ? '0ms' : '200ms', touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishGesture}
        onPointerCancel={finishGesture}
        onClick={handleRowClick}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900 sm:text-base">{person.full_name}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
              <span className="truncate">{formatBirthday(person.birth_date)}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${generationBadgeStyles[person.generation]}`}>
                {person.generation.replace('-', ' ')}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href={`/admin/${person.id}`} className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] sm:px-4 sm:py-2 sm:text-sm">
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
