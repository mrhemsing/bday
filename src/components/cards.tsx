import { cn } from '@/lib/utils';

export function SurfaceCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur',
        className,
      )}
      {...props}
    />
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <SurfaceCard className="p-[19px]">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
      {detail ? <div className="mt-2 text-xs leading-5 text-slate-500">{detail}</div> : null}
    </SurfaceCard>
  );
}
