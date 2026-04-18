'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BAverageBadge } from '@/components/b-average-badge';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen">
      <header className="border-b border-[color:var(--border)] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link href="/" className="text-[1.27rem] font-semibold tracking-tight text-slate-900 sm:text-[1.95rem]">
              Hemsing Family Birthday Calendar
            </Link>
            <p className="mt-1 text-[1.02rem] text-slate-500 sm:text-[1.29rem]">Because 22 kids turns into a lot of cake! 🎂</p>
            <p className="mt-1 text-sm text-slate-500">(DB count: 87 members)</p>
          </div>
          <nav className="flex w-full items-center gap-2 rounded-full border border-[color:var(--border)] bg-[#E2E8F0] p-1 text-sm text-[#64748B] shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:w-auto">
            <NavLink href="/" active={pathname === '/'}>Upcoming</NavLink>
            <NavLink href="/admin" active={pathname.startsWith('/admin')}>Admin</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6 lg:px-8">{children}</main>
    </div>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex-1 rounded-full px-4 py-2 text-center font-medium transition lg:flex-none',
        active ? 'bg-white !text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-white hover:!text-[#0F172A]' : 'bg-transparent text-[#64748B] hover:text-[#0F172A]',
      )}
    >
      {children}
    </Link>
  );
}
