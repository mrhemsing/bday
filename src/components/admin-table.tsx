import type { Person } from '@/lib/types';
import { SurfaceCard } from './cards';
import { SwipeableAdminRow } from './swipeable-admin-row';

export function AdminTable({ people }: { people: Person[] }) {
  return (
    <SurfaceCard className="overflow-hidden">
      {people.length === 0 ? (
        <div className="px-6 py-10 text-sm text-slate-500">No family members match this view yet.</div>
      ) : (
        <div className="bg-white/70">
          {people.map((person) => (
            <SwipeableAdminRow key={person.id} person={person} />
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
