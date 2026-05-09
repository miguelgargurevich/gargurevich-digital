'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  Image,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  Globe,
  FileText,
  Inbox,
  Tag,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { AdminAlertProvider } from '@/components/providers/AdminAlertProvider';

interface NotificationLead {
  id: string;
  name: string;
  projectType: string;
  createdAt: string;
}

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/offers', label: 'Ofertas', icon: Tag },
  { href: '/admin/subscriptions', label: 'Suscripciones', icon: CreditCard },
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
  const [newLeads, setNewLeads] = useState<NotificationLead[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) return;

    let cancelled = false;

    const fetchNewLeadCount = async () => {
      try {
        const response = await fetch('/api/admin/leads?status=NEW&limit=5', { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        if (!cancelled) {
          setNewLeadCount(typeof data.total === 'number' ? data.total : 0);
          setNewLeads(Array.isArray(data.leads) ? data.leads.slice(0, 5) : []);
        }
      } catch {
        if (!cancelled) {
          setNewLeadCount(0);
          setNewLeads([]);
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

  useEffect(() => {
    setNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <AdminAlertProvider>
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
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
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
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Nuevos leads</div>
                    <div className="text-[11px] text-[#71717A]">
                      {newLeadCount > 0 ? `${newLeadCount} por atender` : 'No hay leads nuevos'}
                    </div>
                  </div>
                  <Link
                    href="/admin/leads"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-[#00D4FF] hover:text-white transition-colors"
                  >
                    Ver todos
                  </Link>
                </div>

                {newLeads.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {newLeads.map((lead, index) => (
                      <Link
                        key={lead.id}
                        href="/admin/leads"
                        onClick={() => setNotificationsOpen(false)}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5 ${
                          index !== 0 ? 'border-t border-white/6' : ''
                        }`}
                      >
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F59E0B]" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-white">{lead.name}</div>
                          <div className="truncate text-xs text-[#A1A1AA]">{lead.projectType}</div>
                          <div className="mt-1 text-[11px] text-[#71717A]">
                            {new Date(lead.createdAt).toLocaleDateString('es-PE', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <ChevronRight size={14} className="mt-1 shrink-0 text-[#52525B]" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-[#71717A]">
                    No hay notificaciones pendientes.
                  </div>
                )}
              </div>
            )}
          </div>
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
    </AdminAlertProvider>
  );
}
