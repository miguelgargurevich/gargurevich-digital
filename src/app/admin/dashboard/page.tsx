import { db } from '@/lib/db';
import Link from 'next/link';
import { FolderOpen, Wrench, Image, ArrowRight, Zap, Inbox, Tag, CreditCard } from 'lucide-react';
import { SubscriptionStatus } from '@prisma/client';
import SeedButton from './_components/SeedButton';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

type UsageLimits = {
  maxGenerationsPerMonth: number;
  maxInputTokensPerMonth: number;
  maxOutputTokensPerMonth: number;
};

type ClientUsageRecord = {
  month: string;
  generations: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  lastGenerationAt: string | null;
  limits?: Partial<UsageLimits> | null;
};

const FALLBACK_LIMITS: UsageLimits = {
  maxGenerationsPerMonth: 100,
  maxInputTokensPerMonth: 250000,
  maxOutputTokensPerMonth: 400000,
};

function toPercent(value: number, max: number): number {
  if (!max || max <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

function maxUsagePercent(record: ClientUsageRecord): number {
  const limits: UsageLimits = {
    ...FALLBACK_LIMITS,
    ...(record.limits || {}),
  };

  return Math.max(
    toPercent(record.generations, limits.maxGenerationsPerMonth),
    toPercent(record.estimatedInputTokens, limits.maxInputTokensPerMonth),
    toPercent(record.estimatedOutputTokens, limits.maxOutputTokensPerMonth)
  );
}

function usageStatus(percent: number): { label: string; className: string } {
  if (percent >= 95) return { label: 'Critico', className: 'bg-red-500/15 text-red-300 border border-red-500/30' };
  if (percent >= 80) return { label: 'Alto', className: 'bg-amber-500/15 text-amber-300 border border-amber-500/30' };
  return { label: 'Normal', className: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' };
}

function usageRiskKey(percent: number): 'normal' | 'alto' | 'critico' {
  if (percent >= 95) return 'critico';
  if (percent >= 80) return 'alto';
  return 'normal';
}

async function getAiUsageByClient(): Promise<Array<{ clientId: string; record: ClientUsageRecord; percent: number }>> {
  const usagePath = path.join(process.cwd(), 'mvp', 'site-generator', 'output', 'usage-state.json');

  try {
    const raw = await readFile(usagePath, 'utf8');
    const parsed = JSON.parse(raw) as { clients?: Record<string, ClientUsageRecord> };
    const clients = parsed.clients || {};

    return Object.entries(clients)
      .map(([clientId, record]) => ({
        clientId,
        record,
        percent: maxUsagePercent(record),
      }))
      .sort((a, b) => b.percent - a.percent);
  } catch {
    return [];
  }
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const monthFilter = String(resolvedSearchParams.month || 'all');
  const riskFilter = String(resolvedSearchParams.risk || 'all').toLowerCase();
  const queryFilter = String(resolvedSearchParams.q || '').trim().toLowerCase();

  const [projectCount, serviceCount, mediaCount, leadCount, newLeadCount, offerCount, projects, siteCount, activeSiteCount, aiUsage] = await Promise.all([
    db.portfolioProject.count(),
    db.service.count(),
    db.mediaFile.count(),
    db.lead.count(),
    db.lead.count({ where: { status: 'NEW' } }),
      db.offer.count({ where: { published: true } }),
    db.portfolioProject.findMany({ orderBy: { order: 'asc' }, take: 4 }),
    db.clientSite.count(),
    db.clientSite.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      getAiUsageByClient(),
  ]);

  const stats = [
    { label: 'Proyectos', value: projectCount, icon: FolderOpen, href: '/admin/portfolio', color: '#00D4FF' },
    { label: 'Servicios', value: serviceCount, icon: Wrench, href: '/admin/services', color: '#8B5CF6' },
    { label: 'Archivos', value: mediaCount, icon: Image, href: '/admin/media', color: '#10B981' },
    {
      label: 'Leads',
      value: leadCount,
      badge: newLeadCount > 0 ? `${newLeadCount} nuevo${newLeadCount > 1 ? 's' : ''}` : null,
      icon: Inbox,
      href: '/admin/leads',
      color: '#F59E0B',
    },
    { label: 'Ofertas', value: offerCount, icon: Tag, href: '/admin/offers', color: '#8B5CF6', badge: null },
    {
      label: 'Suscripciones',
      value: activeSiteCount,
      badge: activeSiteCount < siteCount ? `${siteCount - activeSiteCount} vencida${siteCount - activeSiteCount > 1 ? 's' : ''}` : null,
      icon: CreditCard,
      href: '/admin/subscriptions',
      color: '#00D4FF',
    },
  ];

  const availableMonths = Array.from(new Set(aiUsage.map(({ record }) => record.month))).sort((a, b) => b.localeCompare(a));
  const filteredAiUsage = aiUsage.filter(({ clientId, record, percent }) => {
    if (monthFilter !== 'all' && record.month !== monthFilter) return false;
    if (riskFilter !== 'all' && usageRiskKey(percent) !== riskFilter) return false;
    if (queryFilter && !clientId.toLowerCase().includes(queryFilter)) return false;
    return true;
  });

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color, ...rest }) => {
          const badge = (rest as { badge?: string | null }).badge;
          return (
            <Link
              key={label}
              href={href}
              className="group bg-[#111111] border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-white/20 transition-all relative overflow-hidden"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-[#71717A]">{label}</div>
                {badge && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F59E0B18] text-[#F59E0B]">
                    {badge}
                  </span>
                )}
              </div>
              <ArrowRight size={16} className="ml-auto text-[#52525B] group-hover:text-[#A1A1AA] transition-colors shrink-0" />
            </Link>
          );
        })}
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
          <Link href="/admin/site-generator" className="cms-btn">MVP Builder IA</Link>
          <div className="flex-1" />
          <SeedButton />
        </div>
      </div>

      {/* AI Usage monitor */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">Uso de IA por cliente</h2>
          <span className="text-xs text-[#71717A]">Fuente: mvp/site-generator/output/usage-state.json</span>
        </div>

        <form method="get" className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            name="q"
            defaultValue={queryFilter}
            placeholder="Buscar por clientId"
            className="w-full rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#00D4FF]/50"
          />
          <select
            name="month"
            defaultValue={monthFilter}
            className="w-full rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50"
          >
            <option value="all">Todos los meses</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            name="risk"
            defaultValue={riskFilter}
            className="w-full rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50"
          >
            <option value="all">Todos los riesgos</option>
            <option value="normal">Normal</option>
            <option value="alto">Alto</option>
            <option value="critico">Critico</option>
          </select>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-white hover:border-white/20 transition-colors"
            >
              Filtrar
            </button>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-transparent px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:border-white/20 transition-colors"
            >
              Limpiar
            </Link>
          </div>
        </form>

        {aiUsage.length === 0 ? (
          <div className="bg-[#111111] border border-white/10 rounded-xl p-4 text-sm text-[#A1A1AA]">
            Aun no hay consumo registrado. Genera una pagina en el MVP para empezar a medir uso de IA por cliente.
          </div>
        ) : filteredAiUsage.length === 0 ? (
          <div className="bg-[#111111] border border-white/10 rounded-xl p-4 text-sm text-[#A1A1AA]">
            No se encontraron resultados con los filtros actuales.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111111]">
            <table className="w-full min-w-190 text-sm">
              <thead className="bg-white/5 text-[#A1A1AA]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium">Mes</th>
                  <th className="text-left px-4 py-3 font-medium">Generaciones</th>
                  <th className="text-left px-4 py-3 font-medium">Input tokens</th>
                  <th className="text-left px-4 py-3 font-medium">Output tokens</th>
                  <th className="text-left px-4 py-3 font-medium">Riesgo</th>
                  <th className="text-left px-4 py-3 font-medium">Ultima actividad</th>
                </tr>
              </thead>
              <tbody>
                {filteredAiUsage.map(({ clientId, record, percent }) => {
                  const limits: UsageLimits = {
                    ...FALLBACK_LIMITS,
                    ...(record.limits || {}),
                  };
                  const status = usageStatus(percent);

                  return (
                    <tr key={clientId} className="border-t border-white/6">
                      <td className="px-4 py-3 text-white font-medium">{clientId}</td>
                      <td className="px-4 py-3 text-[#D4D4D8]">{record.month}</td>
                      <td className="px-4 py-3 text-[#D4D4D8]">
                        {record.generations}/{limits.maxGenerationsPerMonth}
                      </td>
                      <td className="px-4 py-3 text-[#D4D4D8]">
                        {record.estimatedInputTokens.toLocaleString('es-PE')}/{limits.maxInputTokensPerMonth.toLocaleString('es-PE')}
                      </td>
                      <td className="px-4 py-3 text-[#D4D4D8]">
                        {record.estimatedOutputTokens.toLocaleString('es-PE')}/{limits.maxOutputTokensPerMonth.toLocaleString('es-PE')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                          {status.label} ({percent}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#A1A1AA]">
                        {record.lastGenerationAt ? new Date(record.lastGenerationAt).toLocaleString('es-PE') : 'Sin actividad'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
