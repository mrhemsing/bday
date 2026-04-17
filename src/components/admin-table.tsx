import Link from 'next/link';
import { formatBirthday } from '@/lib/birthdays';
import type { Person } from '@/lib/types';
import { SurfaceCard } from './cards';

export function AdminTable({ people }: { people: Person[] }) {
  return (
    <SurfaceCard className="overflow-hidden">
      {people.length === 0 ? (
        <div className="px-6 py-10 text-sm text-slate-500">No family members match this view yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50/80 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Birthday</th>
                <th className="px-6 py-4 font-medium">Generation</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/70 text-sm text-slate-700">
              {people.map((person) => (
                <tr key={person.id} className="align-top transition hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{person.full_name}</div>
                    {person.notes ? <div className="mt-1 max-w-md text-slate-500">{person.notes}</div> : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatBirthday(person.birth_date)}</td>
                  <td className="px-6 py-4 capitalize">{person.generation}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${person.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {person.active ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/${person.id}`} className="font-medium text-violet-700 hover:text-violet-900">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SurfaceCard>
  );
}
