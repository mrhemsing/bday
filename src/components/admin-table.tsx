import type { Person } from '@/lib/types';
import { SurfaceCard } from './cards';
import { SwipeableAdminRow } from './swipeable-admin-row';

export function AdminTable({ people }: { people: Person[] }) {
  return (
    <div>
      {people.length === 0 ? (
        <SurfaceCard className="px-6 py-10 text-sm text-slate-500">No family members match this view yet.</SurfaceCard>
      ) : (
        <div className="space-y-3">
          {people.map((person) => (
            <SwipeableAdminRow key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
