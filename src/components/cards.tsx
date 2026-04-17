import { cn } from '@/lib/utils';

export function SurfaceCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-[color:var(--border)] bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur',
        className,
      )}
      {...props}
    />
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <SurfaceCard className="p-5">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
    </SurfaceCard>
  );
}
