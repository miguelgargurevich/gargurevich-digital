'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  Image,
  Settings,
  LogOut,
  Menu,
  Globe,
  FileText,
  Inbox,
  Tag,
  Bell,
} from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
    { href: '/admin/offers', label: 'Ofertas', icon: Tag },
  { href: '/admin/portfolio', label: 'Portfolio', icon: FolderOpen },
  { href: '/admin/services', label: 'Servicios', icon: Wrench },
  { href: '/admin/content', label: 'Contenido', icon: FileText },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/settings', label: 'Ajustes', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [newLeadCount, setNewLeadCount] = useState(0);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) return;

    let cancelled = false;

    const fetchNewLeadCount = async () => {
      try {
        const response = await fetch('/api/admin/leads?status=NEW&page=1', { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        if (!cancelled) {
          setNewLeadCount(typeof data.total === 'number' ? data.total : 0);
        }
      } catch {
        if (!cancelled) {
          setNewLeadCount(0);
        }
      }
    };

    fetchNewLeadCount();
    const intervalId = window.setInterval(fetchNewLeadCount, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isLogin, pathname]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-white/10 flex flex-col
          transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#00D4FF] to-[#8B5CF6] flex items-center justify-center shrink-0">
              <span className="text-background font-bold text-sm">G</span>
              <span className="text-[#14213D] font-bold text-sm">D</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">Gargurevich CMS</div>
              <div className="text-[11px] text-[#71717A]">Panel de administración</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            const showLeadBadge = href === '/admin/leads' && newLeadCount > 0;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={17} />
                <span>{label}</span>
                {showLeadBadge && (
                  <span className="ml-auto inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/25 px-1.5 text-[10px] font-semibold text-[#F59E0B]">
                    {newLeadCount > 99 ? '99+' : newLeadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe size={17} />
            Ver sitio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-[#111111]/90 backdrop-blur border-b border-white/10 flex items-center px-5 gap-3">
          <button
            className="lg:hidden p-1.5 text-[#A1A1AA] hover:text-white transition-colors"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
          <span className="text-sm text-[#71717A] font-medium truncate hidden sm:block">
            {NAV.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`))?.label ?? 'Admin'}
          </span>
          <div className="flex-1" />
          <Link
            href="/admin/leads"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#A1A1AA] transition-all hover:border-white/20 hover:text-white"
            aria-label="Notificaciones de leads"
            title={newLeadCount > 0 ? `${newLeadCount} lead${newLeadCount > 1 ? 's' : ''} nuevo${newLeadCount > 1 ? 's' : ''}` : 'Sin nuevos leads'}
          >
            <Bell size={17} className={newLeadCount > 0 ? 'text-[#F59E0B]' : undefined} />
            {newLeadCount > 0 && (
              <>
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-[#F59E0B] px-1 text-[10px] font-bold text-[#111111]">
                  {newLeadCount > 99 ? '99+' : newLeadCount}
                </span>
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />
              </>
            )}
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/30 flex items-center justify-center text-[11px] font-bold text-[#00D4FF]">
              A
            </div>
            <span className="text-xs text-[#71717A] hidden sm:block">admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-7">{children}</main>
      </div>
    </div>
  );
}
