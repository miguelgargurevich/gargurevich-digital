import { db } from '@/lib/db';
import Link from 'next/link';
import { FolderOpen, Wrench, Image, ArrowRight, Zap } from 'lucide-react';
import SeedButton from './_components/SeedButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [projectCount, serviceCount, mediaCount, projects] = await Promise.all([
    db.portfolioProject.count(),
    db.service.count(),
    db.mediaFile.count(),
    db.portfolioProject.findMany({ orderBy: { order: 'asc' }, take: 4 }),
  ]);

  const stats = [
    { label: 'Proyectos', value: projectCount, icon: FolderOpen, href: '/admin/portfolio', color: '#00D4FF' },
    { label: 'Servicios', value: serviceCount, icon: Wrench, href: '/admin/services', color: '#8B5CF6' },
    { label: 'Archivos', value: mediaCount, icon: Image, href: '/admin/media', color: '#10B981' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#71717A] text-sm mt-1">Bienvenido al panel de administración de Gargurevich Digital</p>
      </div>

      {/* Seed banner */}
      {projectCount === 0 && (
        <SeedBanner />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="group bg-[#111111] border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-white/20 transition-all"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-[#71717A]">{label}</div>
            </div>
            <ArrowRight size={16} className="ml-auto text-[#52525B] group-hover:text-[#A1A1AA] transition-colors" />
          </Link>
        ))}
      </div>

      {/* Recent projects */}
      {projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">Proyectos recientes</h2>
            <Link href="/admin/portfolio" className="text-xs text-[#00D4FF] hover:underline">Ver todos</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/admin/portfolio/${p.id}`}
                className="bg-[#111111] border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-white/20 transition-all group"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">{p.titleEs}</div>
                  <div className="text-xs text-[#71717A] truncate">{p.slug}</div>
                </div>
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  {p.imageUrl && (
                    <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                      imagen
                    </span>
                  )}
                  <ArrowRight size={14} className="text-[#52525B] group-hover:text-[#A1A1AA] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/portfolio" className="cms-btn">Gestionar portfolio</Link>
          <Link href="/admin/media" className="cms-btn">Subir imágenes</Link>
          <Link href="/admin/content" className="cms-btn">Editar contenido</Link>
          <Link href="/admin/settings" className="cms-btn">Ajustes del sitio</Link>
          <div className="flex-1" />
          <SeedButton />
        </div>
      </div>
    </div>
  );
}

function SeedBanner() {
  return (
    <div className="bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-xl p-5 flex items-start gap-4">
      <div className="w-9 h-9 bg-[#00D4FF]/15 border border-[#00D4FF]/30 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Zap size={18} className="text-[#00D4FF]" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-white mb-1">Base de datos vacía</div>
        <p className="text-xs text-[#A1A1AA] mb-3">
          Haz clic en <strong className="text-white">Inicializar CMS</strong> para importar los proyectos y servicios actuales del sitio.
        </p>
        <SeedButton />
      </div>
    </div>
  );
}
