'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { generationOptions, type Generation } from '@/lib/types';

const ALL_GENERATIONS = '__all__';

export function AdminSearch({
  initialQuery,
  initialGeneration = '',
  generationPlaceholder = 'All generations',
}: {
  initialQuery: string;
  initialGeneration?: '' | Generation;
  generationPlaceholder?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [generation, setGeneration] = useState(initialGeneration);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastCommittedRef = useRef({ query: initialQuery, generation: initialGeneration });

  useEffect(() => {
    setQuery(initialQuery);
    setGeneration(initialGeneration);
    lastCommittedRef.current = { query: initialQuery, generation: initialGeneration };
  }, [initialGeneration, initialQuery]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === lastCommittedRef.current.query && generation === lastCommittedRef.current.generation) {
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set('query', trimmed);
      } else {
        params.delete('query');
      }

      if (generation) {
        params.set('generation', generation);
      } else {
        params.delete('generation');
      }

      const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      lastCommittedRef.current = { query: trimmed, generation };
      router.replace(next);
    }, 180);

    return () => clearTimeout(timeout);
  }, [generation, pathname, query, router, searchParams]);

  function clearSearch() {
    setQuery('');
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search family names"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-20 text-slate-900 outline-none transition focus:border-violet-300"
        />
        {query.trim() ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            Clear
          </button>
        ) : null}
      </div>

      <select
        value={generation || ALL_GENERATIONS}
        onChange={(event) => setGeneration(event.target.value === ALL_GENERATIONS ? '' : (event.target.value as Generation))}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-violet-300"
      >
        <option value={ALL_GENERATIONS}>{generationPlaceholder}</option>
        {generationOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
