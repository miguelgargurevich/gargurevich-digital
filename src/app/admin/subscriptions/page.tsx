'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Clock, Plus, RefreshCw } from 'lucide-react';
import { SubscriptionStatus } from '@prisma/client';
import { useAdminAlert } from '@/components/providers/AdminAlertProvider';

const PAGE_SIZE_OPTIONS = [6, 9, 12, 24] as const;

interface ClientSiteRow {
  id: string;
  slug: string;
  businessName: string;
  contractedService: string | null;
  serviceTier: string | null;
  recurringAmount: number | null;
  currency: string;
  billingEmail: string | null;
  status: SubscriptionStatus;
  setupFeePaidAt: string | null;
  subscriptionStartsAt: string | null;
  subscriptionEndsAt: string | null;
  renewals?: Array<{ plan: string; createdAt: string }>;
}

interface OfferOption {
  id: string;
  nameEs: string;
  price: string;
  renewalPrice: string | number;
  priceNoteEs: string;
}

export default function AdminSubscriptions() {
  const { push, confirm } = useAdminAlert();
  const [sites, setSites] = useState<ClientSiteRow[]>([]);
  const [offers, setOffers] = useState<OfferOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [contractedService, setContractedService] = useState('');
  const [serviceTier, setServiceTier] = useState('');
  const [recurringAmount, setRecurringAmount] = useState('');
  const [currency, setCurrency] = useState('PEN');
  const [billingEmail, setBillingEmail] = useState('');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const loadSites = async () => {
    try {
      setError('');
      const response = await fetch('/api/admin/subscriptions', { cache: 'no-store' });
      const data = await response.json();
      setSites(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError('Error cargando suscripciones');
      push({ kind: 'error', title: 'No se pudo cargar', message: 'Error cargando suscripciones' });
    } finally {
      setLoading(false);
    }
  };

  const loadOffers = async () => {
    try {
      const response = await fetch('/api/admin/offers', { cache: 'no-store' });
      const data = await response.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      push({ kind: 'error', title: 'No se pudieron cargar las ofertas', message: 'Revisa el catálogo de ofertas' });
    }
  };

  useEffect(() => {
    loadSites();
    loadOffers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, pageSize]);

  const applyOfferDefaults = (offerId: string) => {
    setSelectedOfferId(offerId);
    const offer = offers.find((item) => item.id === offerId);
    setContractedService(offer?.nameEs ?? '');
    setServiceTier('Oferta');
    setRecurringAmount(offer?.renewalPrice != null ? String(offer.renewalPrice) : '');
    setCurrency('PEN');
  };

  const filteredSites = sites.filter((site) => {
    const haystack = [
      site.businessName,
      site.slug,
      site.contractedService || '',
      site.serviceTier || '',
      site.billingEmail || '',
      site.currency,
      site.status,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query.trim().toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredSites.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedSites = filteredSites.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!businessName.trim() || !slug.trim() || !selectedOfferId) {
      setCreateError('Ingresa razón social, slug y selecciona una oferta');
      push({ kind: 'warning', title: 'Campos obligatorios', message: 'Ingresa razón social, slug y selecciona una oferta' });
      return;
    }

    setCreating(true);
    setCreateError('');

    try {
      const response = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          slug: slug.trim().toLowerCase(),
          contractedService: contractedService.trim() || undefined,
          serviceTier: serviceTier.trim() || undefined,
          recurringAmount: recurringAmount.trim() ? Number(recurringAmount) : undefined,
          currency: currency.trim() || 'PEN',
          billingEmail: billingEmail.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'No se pudo crear la suscripción');
      }

      setBusinessName('');
      setSlug('');
      setSelectedOfferId('');
      setContractedService('');
      setServiceTier('');
      setRecurringAmount('');
      setCurrency('PEN');
      setBillingEmail('');
      await loadSites();
      push({ kind: 'success', title: 'Suscripción creada', message: 'Setup activado por 12 meses' });
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Error creando suscripción';
      setCreateError(message);
      push({ kind: 'error', title: 'No se pudo crear', message });
    } finally {
      setCreating(false);
    }
  };

  const handleExpire = async () => {
    const accepted = await confirm({
      title: 'Expirar suscripciones vencidas',
      message: 'Esta acción marcará como INACTIVAS las que ya vencieron.',
      confirmText: 'Expirar ahora',
      cancelText: 'Cancelar',
      danger: true,
    });
    if (!accepted) return;

    try {
      const r = await fetch('/api/admin/subscriptions/expire', { method: 'POST' });
      if (!r.ok) throw new Error('No se pudo ejecutar expiración masiva');
      const data = await r.json();
      push({
        kind: 'success',
        title: 'Expiración ejecutada',
        message: `${data.deactivated || 0} suscripciones desactivadas`,
      });
      await loadSites();
    } catch (e) {
      console.error(e);
      push({ kind: 'error', title: 'Error al expirar', message: 'Inténtalo nuevamente' });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Suscripciones</h1>
          <p className="text-[#71717A] text-sm mt-1">Gestiona ciclos de setup, renovación y expiración</p>
        </div>
        <button
          onClick={handleExpire}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#F59E0B18] text-[#F59E0B] hover:bg-[#F59E0B25] transition-colors text-sm font-medium"
        >
          <RefreshCw size={16} />
          Expirar vencidas
        </button>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={16} className="text-[#00D4FF]" />
          <h2 className="text-white font-semibold">Nueva suscripción</h2>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className="block text-xs text-[#71717A] mb-1">Razón social</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ej: Talleres Andinos SAC"
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs text-[#71717A] mb-1">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Ej: talleres-andinos"
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-[#71717A] mb-1">Servicio contratado</label>
            <select
              value={selectedOfferId}
              onChange={(e) => applyOfferDefaults(e.target.value)}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40"
            >
              <option value="">Selecciona una oferta del catálogo</option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.nameEs} ({offer.price})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs text-[#71717A] mb-1">Plan/Tier</label>
            <input
              value={serviceTier}
              readOnly
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white/70"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs text-[#71717A] mb-1">Monto recurrente</label>
            <input
              value={recurringAmount}
              readOnly
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white/70"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs text-[#71717A] mb-1">Moneda</label>
            <input
              value={currency}
              readOnly
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white/70"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs text-[#71717A] mb-1">Email de facturación</label>
            <input
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="facturacion@cliente.com"
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40"
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={creating}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-[#00D4FF18] text-[#00D4FF] hover:bg-[#00D4FF25] transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Plus size={16} />
              {creating ? 'Creando...' : 'Crear suscripción'}
            </button>
          </div>
        </form>

        {createError && (
          <p className="mt-3 text-xs text-red-400">{createError}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#111111] border border-white/10 rounded-lg p-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-white font-semibold">Buscar y navegar</h2>
            <p className="text-xs text-[#71717A] mt-1">
              Filtra por nombre, slug, servicio, plan, moneda o email de facturación.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#71717A]">
            <span>{filteredSites.length} resultados</span>
            <span className="text-[#3F3F46]">•</span>
            <label className="flex items-center gap-2">
              <span>Página</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-md bg-[#18181B] border border-white/10 px-2 py-1 text-xs text-white"
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por razón social, slug, servicio o email..."
            className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40"
          />
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCurrentPage(1);
            }}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[#A1A1AA] hover:text-white hover:border-white/20 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#71717A]">Cargando...</div>
      ) : filteredSites.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
          <p className="text-[#71717A]">No hay suscripciones para este filtro</p>
          <p className="text-xs text-[#52525B] mt-1">Prueba con otro término o limpia el buscador</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pagedSites.map((site) => {
            const isActive = site.status === SubscriptionStatus.ACTIVE;
            const endsAt = site.subscriptionEndsAt ? new Date(site.subscriptionEndsAt) : null;
            const isExpiringSoon = endsAt && (endsAt.getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000;
            const lastRenewal = site.renewals?.[0];

            return (
              <Link
                key={site.id}
                href={`/admin/subscriptions/${site.id}`}
                className="bg-[#111111] border border-white/10 rounded-lg p-5 hover:border-white/20 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-[#10B98118]'
                        : 'bg-[#EF444418]'
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle2 size={20} className="text-[#10B981]" />
                    ) : (
                      <AlertCircle size={20} className="text-[#EF4444]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-white truncate">{site.businessName}</h3>
                        <p className="text-xs text-[#71717A] truncate">{site.slug}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                          isActive
                            ? 'bg-[#10B98130] text-[#10B981]'
                            : 'bg-[#EF444430] text-[#EF4444]'
                        }`}
                      >
                        {isActive ? 'ACTIVA' : 'INACTIVA'}
                      </span>
                      {isExpiringSoon && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#F59E0B30] text-[#F59E0B] shrink-0 flex items-center gap-1">
                          <Clock size={12} />
                          Vence pronto
                        </span>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[#52525B]">Activada:</span>
                        <p className="text-white font-mono text-[11px]">
                          {site.subscriptionStartsAt
                            ? new Date(site.subscriptionStartsAt).toLocaleDateString('es-PE')
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#52525B]">Vence:</span>
                        <p className="text-white font-mono text-[11px]">
                          {endsAt ? endsAt.toLocaleDateString('es-PE') : '—'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#52525B]">Último plan:</span>
                        <p className="text-white font-mono text-[11px]">
                          {lastRenewal?.plan || '—'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[#52525B]">Servicio:</span>
                        <p className="text-white text-[11px]">{site.contractedService || '—'}</p>
                      </div>
                      <div>
                        <span className="text-[#52525B]">Plan:</span>
                        <p className="text-white text-[11px]">{site.serviceTier || '—'}</p>
                      </div>
                      <div>
                        <span className="text-[#52525B]">Monto:</span>
                        <p className="text-white font-mono text-[11px]">
                          {site.recurringAmount !== null ? `${site.currency} ${site.recurringAmount}` : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {filteredSites.length > pageSize && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm">
              <p className="text-[#71717A]">
                Mostrando {Math.min((safePage - 1) * pageSize + 1, filteredSites.length)}-{Math.min(safePage * pageSize, filteredSites.length)} de {filteredSites.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                  disabled={safePage === 1}
                  className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 transition-colors"
                >
                  Anterior
                </button>
                <span className="text-xs text-[#A1A1AA]">
                  Página {safePage} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                  disabled={safePage === totalPages}
                  className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
