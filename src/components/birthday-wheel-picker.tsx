'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const ROW_HEIGHT = 40;
const VISIBLE_ROWS = 5.5;
const VIEW_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;
const PAD_ROWS = (VISIBLE_ROWS - 1) / 2;
const PAD_HEIGHT = ROW_HEIGHT * PAD_ROWS;
const CENTER_LINE_OFFSET = ROW_HEIGHT / 2;

type WheelOption = {
  value: string;
  label: string;
};

export function BirthdayWheelPicker({
  month,
  day,
  year,
  onChange,
}: {
  month: string;
  day: string;
  year: string;
  onChange: (next: { month: string; day: string; year: string }) => void;
}) {
  const monthOptions = useMemo(
    () => [
      { value: '01', label: 'January' },
      { value: '02', label: 'February' },
      { value: '03', label: 'March' },
      { value: '04', label: 'April' },
      { value: '05', label: 'May' },
      { value: '06', label: 'June' },
      { value: '07', label: 'July' },
      { value: '08', label: 'August' },
      { value: '09', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' },
    ],
    [],
  );

  const dayOptions = useMemo(
    () => Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1).padStart(2, '0'), label: String(index + 1).padStart(2, '0') })),
    [],
  );

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 130 }, (_, index) => {
      const value = String(currentYear - index);
      return { value, label: value };
    });
  }, []);

  return (
    <div className="birthday-picker-unified relative overflow-hidden rounded-[30px] border border-slate-300 bg-white px-3 py-1.5 text-slate-900 shadow-sm">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 bg-slate-100" style={{ height: `${ROW_HEIGHT}px`, transform: 'translateY(-50%)' }} />
      <div className="wheel-focus-line pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[1px] bg-slate-300/90" style={{ transform: `translateY(-${CENTER_LINE_OFFSET}px)` }} />
      <div className="wheel-focus-line pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[1px] bg-slate-300/90" style={{ transform: `translateY(${CENTER_LINE_OFFSET}px)` }} />
      <div className="wheel-fade-top pointer-events-none absolute inset-x-0 top-0 z-20 h-12" />
      <div className="wheel-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12" />
      <div className="grid grid-cols-[1.35fr_0.75fr_1fr] gap-2 sm:gap-3">
        <WheelScroller label="Month" options={monthOptions} value={month} onChange={(value) => onChange({ month: value, day, year })} />
        <WheelScroller label="Day" options={dayOptions} value={day} onChange={(value) => onChange({ month, day: value, year })} />
        <WheelScroller label="Year" options={yearOptions} value={year} onChange={(value) => onChange({ month, day, year: value })} />
      </div>
    </div>
  );
}

function WheelScroller({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: WheelOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const index = options.findIndex((option) => option.value === value);
    if (index < 0) return;
    const targetTop = Math.max(0, index * ROW_HEIGHT);

    const applyPosition = () => {
      scroller.scrollTop = targetTop;
      setScrollTop(targetTop);
    };

    applyPosition();
    requestAnimationFrame(applyPosition);
  }, [options, value]);

  function settle() {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const rawIndex = scroller.scrollTop / ROW_HEIGHT;
    const nextIndex = Math.max(0, Math.min(options.length - 1, Math.round(rawIndex)));
    const nextValue = options[nextIndex]?.value;

    if (nextValue && nextValue !== value) {
      onChange(nextValue);
    }
  }

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      setScrollTop(scroller.scrollTop);
      const rawIndex = scroller.scrollTop / ROW_HEIGHT;
      const nearestIndex = Math.max(0, Math.min(options.length - 1, Math.round(rawIndex)));
      const nearestValue = options[nearestIndex]?.value;
      if (nearestValue && nearestValue !== value) {
        onChange(nearestValue);
      }
    });

    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = setTimeout(() => {
      settle();
    }, 360);
  }

  return (
    <section className="wheel-section min-w-0">
      <h3 className="wheel-label mb-[-22px] px-2 text-sm font-semibold text-slate-400 sm:text-base">{label}</h3>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="no-scrollbar wheel-scroll overflow-y-auto overscroll-contain"
        style={{
          height: `${VIEW_HEIGHT}px`,
          scrollSnapType: 'y proximity',
          paddingTop: `${PAD_HEIGHT}px`,
          paddingBottom: `${PAD_HEIGHT}px`,
          touchAction: 'pan-y',
        }}
      >
        {options.map((option, index) => {
          const optionCenter = index * ROW_HEIGHT;
          const rawDistance = Math.abs((scrollTop - optionCenter) / ROW_HEIGHT);
          const distance = Math.min(3, rawDistance);
          const easedDistance = Math.min(1, rawDistance);
          const influence = Math.max(0, 1 - easedDistance * easedDistance * easedDistance);
          const fontSize = 0.94 + influence * 0.28;
          const opacity =
            distance <= 0.6
              ? 1
              : distance <= 1.15
                ? 0.68
                : distance <= 2.15
                  ? 0.44
                  : 0.18;
          const scale =
            distance <= 0.6
              ? 1.08
              : distance <= 1.15
                ? 0.99
                : distance <= 2.15
                  ? 0.94
                  : 0.9;
          const translateY =
            scrollTop > optionCenter
              ? distance <= 2.15
                ? distance * 1.5
                : 4
              : distance <= 2.15
                ? distance * -1.5
                : -4;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="wheel-option flex w-full items-center justify-start px-3 text-left text-slate-900 transition-none"
              style={{
                height: `${ROW_HEIGHT}px`,
                scrollSnapAlign: 'center',
                fontSize: `${fontSize}rem`,
                fontWeight: distance <= 0.6 ? 600 : 500,
                letterSpacing: '-0.02em',
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
