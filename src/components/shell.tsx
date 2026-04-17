import Link from 'next/link';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
              Hemsing Birthday Tracker
            </Link>
            <p className="mt-1 text-sm text-slate-500">A simple place to keep family birthdays close.</p>
          </div>
          <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 p-1 text-sm text-slate-600 shadow-sm">
            <NavLink href="/">Upcoming</NavLink>
            <NavLink href="/admin">Admin</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-full px-4 py-2 font-medium transition hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      {children}
    </Link>
  );
}
