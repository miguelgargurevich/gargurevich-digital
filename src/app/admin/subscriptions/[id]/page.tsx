'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Plus, RotateCcw } from 'lucide-react';
import { SubscriptionStatus, RenewalPlan } from '@prisma/client';
import { useAdminAlert } from '@/components/providers/AdminAlertProvider';

const CURRENCY_OPTIONS = ['PEN', 'USD', 'EUR'] as const;

interface OfferOption {
  id: string;
  nameEs: string;
  price: string;
  renewalPrice: string | number | null;
}

interface SubscriptionDetail {
  id: string;
  slug: string;
  businessName: string;
  contractedService: string | null;
  serviceTier: string | null;
  setupFeeAmount: number | null;
  recurringAmount: number | null;
  currency: string;
  billingEmail: string | null;
  billingContactName: string | null;
  billingContactPhone: string | null;
  notes: string | null;
  status: SubscriptionStatus;
  setupFeePaidAt: string | null;
  subscriptionStartsAt: string | null;
  subscriptionEndsAt: string | null;
  graceIncludedMonths: number;
  lastRenewalPlan: RenewalPlan | null;
  renewals: Array<{
    id: string;
    plan: RenewalPlan;
    discountPercent: number;
    amount: number | null;
    startsAt: string;
    endsAt: string;
  }>;
}

export default function SubscriptionDetail() {
  const { push } = useAdminAlert();
  const params = useParams();
  const id = params.id as string;

  const [sub, setSub] = useState<SubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [offers, setOffers] = useState<OfferOption[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [contractedService, setContractedService] = useState('');
  const [serviceTier, setServiceTier] = useState('');
  const [setupFeeAmount, setSetupFeeAmount] = useState('');
  const [recurringAmount, setRecurringAmount] = useState('');
  const [currency, setCurrency] = useState('PEN');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingContactName, setBillingContactName] = useState('');
  const [billingContactPhone, setBillingContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  const extractPrice = (priceStr: string): number => {
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
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

  const applyOfferDefaults = (offerId: string) => {
    setSelectedOfferId(offerId);
    const offer = offers.find((item) => item.id === offerId);
    if (!offer) return;

    const fallbackPrice = offer.price ? extractPrice(offer.price) : 0;
    const renewal = offer.renewalPrice != null ? Number(offer.renewalPrice) : fallbackPrice;

    setContractedService(offer.nameEs);
    setServiceTier('Oferta');
    setRecurringAmount(String(renewal));
    setCurrency('PEN');
  };

  const loadSubscription = async () => {
    setError('');
    try {
      const r = await fetch(`/api/admin/subscriptions/${id}`, { cache: 'no-store' });
      const data = await r.json();
      setSub(data);
      setBusinessName(data.businessName ?? '');
      setSlug(data.slug ?? '');
      setContractedService(data.contractedService ?? '');
      setServiceTier(data.serviceTier ?? '');
      setSetupFeeAmount(data.setupFeeAmount != null ? String(data.setupFeeAmount) : '');
      setRecurringAmount(data.recurringAmount != null ? String(data.recurringAmount) : '');
      setCurrency(data.currency ?? 'PEN');
      setBillingEmail(data.billingEmail ?? '');
      setBillingContactName(data.billingContactName ?? '');
      setBillingContactPhone(data.billingContactPhone ?? '');
      setNotes(data.notes ?? '');
    } catch (e) {
      console.error(e);
      setError('Error cargando suscripción');
      push({ kind: 'error', title: 'No se pudo cargar', message: 'Error cargando suscripción' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
    loadSubscription();
  }, [id]);

  useEffect(() => {
    if (!offers.length || !contractedService) return;
    const matched = offers.find((offer) => offer.nameEs === contractedService);
    if (matched) {
      setSelectedOfferId(matched.id);
    }
  }, [offers, contractedService]);

  const handleSaveCommercialData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    try {
      const response = await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          slug: slug.trim(),
          contractedService: contractedService.trim() || null,
          serviceTier: serviceTier.trim() || null,
          setupFeeAmount: setupFeeAmount.trim() ? Number(setupFeeAmount) : null,
          recurringAmount: recurringAmount.trim() ? Number(recurringAmount) : null,
          currency: currency.trim() || 'PEN',
          billingEmail: billingEmail.trim() || null,
          billingContactName: billingContactName.trim() || null,
          billingContactPhone: billingContactPhone.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'No se pudo guardar');
      }

      setSaveMessage('Datos comerciales guardados');
      push({ kind: 'success', title: 'Datos guardados', message: 'La ficha comercial fue actualizada' });
      await loadSubscription();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error guardando';
      setSaveMessage(message);
      push({ kind: 'error', title: 'No se pudo guardar', message });
    } finally {
      setSaving(false);
    }
  };

  const handleRenew = async (plan: RenewalPlan) => {
    setAction(`renew_${plan}`);
    try {
      const r = await fetch(`/api/admin/subscriptions/${id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (!r.ok) throw new Error(await r.text());
      push({ kind: 'success', title: 'Renovación procesada', message: `Plan aplicado: ${plan}` });
      await loadSubscription();
    } catch (e) {
      push({
        kind: 'error',
        title: 'Error de renovación',
        message: e instanceof Error ? e.message : 'Error desconocido',
      });
    } finally {
      setAction('');
    }
  };

  const handleReactivateSetup = async () => {
    setAction('activate');
    try {
      const r = await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'activate_setup' }),
      });
      if (!r.ok) throw new Error(await r.text());
      push({ kind: 'success', title: 'Setup re-activado', message: 'Se renovó por 12 meses desde hoy' });
      await loadSubscription();
    } catch (e) {
      push({
        kind: 'error',
        title: 'Error de re-activación',
        message: e instanceof Error ? e.message : 'Error desconocido',
      });
    } finally {
      setAction('');
    }
  };

  if (loading) return <div className="text-center py-12 text-[#71717A]">Cargando...</div>;
  if (error || !sub)
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
        {error || 'No encontrado'}
      </div>
    );

  const isActive = sub.status === SubscriptionStatus.ACTIVE;
  const endsAt = sub.subscriptionEndsAt ? new Date(sub.subscriptionEndsAt) : null;
  const daysUntilExpiry = endsAt ? Math.ceil((endsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{sub.businessName}</h1>
        <p className="text-[#71717A] text-sm mt-1">{sub.slug}</p>
      </div>

      {/* Status card */}
      <div
        className={`rounded-lg p-6 border ${
          isActive
            ? 'bg-[#10B98110] border-[#10B98130]'
            : 'bg-[#EF444410] border-[#EF444430]'
        }`}
      >
        <div className="flex items-center gap-3">
          {isActive ? (
            <CheckCircle2 size={24} className="text-[#10B981]" />
          ) : (
            <AlertCircle size={24} className="text-[#EF4444]" />
          )}
          <div className="flex-1">
            <h2 className={`font-semibold ${isActive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {isActive ? 'Suscripción ACTIVA' : 'Suscripción INACTIVA'}
            </h2>
            {daysUntilExpiry !== null && (
              <p className="text-sm text-[#71717A] mt-1">
                {isActive
                  ? `Vence en ${daysUntilExpiry} días (${endsAt?.toLocaleDateString('es-PE')})`
                  : `Expiró hace ${Math.abs(daysUntilExpiry)} días`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dates info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-white/10 rounded-lg p-4">
          <div className="text-xs text-[#52525B] uppercase tracking-wider">Fee de Setup pagado</div>
          <div className="mt-2 font-mono text-white">
            {sub.setupFeePaidAt ? new Date(sub.setupFeePaidAt).toLocaleDateString('es-PE') : '—'}
          </div>
        </div>
        <div className="bg-[#111111] border border-white/10 rounded-lg p-4">
          <div className="text-xs text-[#52525B] uppercase tracking-wider">Inicio suscripción</div>
          <div className="mt-2 font-mono text-white">
            {sub.subscriptionStartsAt ? new Date(sub.subscriptionStartsAt).toLocaleDateString('es-PE') : '—'}
          </div>
        </div>
        <div className="bg-[#111111] border border-white/10 rounded-lg p-4">
          <div className="text-xs text-[#52525B] uppercase tracking-wider">Fin suscripción</div>
          <div className="mt-2 font-mono text-white">
            {endsAt ? endsAt.toLocaleDateString('es-PE') : '—'}
          </div>
        </div>
        <div className="bg-[#111111] border border-white/10 rounded-lg p-4">
          <div className="text-xs text-[#52525B] uppercase tracking-wider">Meses de gracia incluidos</div>
          <div className="mt-2 font-mono text-white">{sub.graceIncludedMonths}</div>
        </div>
      </div>

      {/* Commercial data */}
      <div className="bg-[#111111] border border-white/10 rounded-lg p-6">
        <h3 className="font-semibold text-white mb-4">Datos comerciales</h3>
        <form onSubmit={handleSaveCommercialData} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Razón social</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40"
              placeholder="Talleres Andinos SAC"
            />
          </div>
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40"
              placeholder="talleres-andinos"
            />
          </div>
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Servicio contratado</label>
            <select
              value={selectedOfferId}
              onChange={(e) => applyOfferDefaults(e.target.value)}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40"
            >
              <option value="">Selecciona una oferta</option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.nameEs} ({offer.price})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Plan / Tier</label>
            <input
              value={serviceTier}
              readOnly
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white/70"
            />
          </div>
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Setup fee ({currency})</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={setupFeeAmount}
              onChange={(e) => setSetupFeeAmount(e.target.value)}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Precio renovación (PEN)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={recurringAmount}
              onChange={(e) => setRecurringAmount(e.target.value)}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
              placeholder="0.00"
            />
            <p className="text-[11px] text-[#71717A] mt-1">Se toma del campo renewalPrice de la oferta seleccionada.</p>
          </div>
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Moneda</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40"
            >
              {CURRENCY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Email de facturación</label>
            <input
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40"
              placeholder="facturacion@cliente.com"
            />
          </div>
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Contacto de facturación</label>
            <input
              value={billingContactName}
              onChange={(e) => setBillingContactName(e.target.value)}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40"
              placeholder="Nombre y apellido"
            />
          </div>
          <div>
            <label className="block text-xs text-[#71717A] mb-1">Teléfono de facturación</label>
            <input
              value={billingContactPhone}
              onChange={(e) => setBillingContactPhone(e.target.value)}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40"
              placeholder="+51 999 999 999"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[#71717A] mb-1">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-[#18181B] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40"
              placeholder="Detalle operativo, alcance, observaciones o acuerdos comerciales"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg px-4 py-2 bg-[#00D4FF18] text-[#00D4FF] hover:bg-[#00D4FF25] transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar datos comerciales'}
            </button>
            {saveMessage && <span className="text-xs text-[#A1A1AA]">{saveMessage}</span>}
          </div>
        </form>
      </div>

      {/* Actions */}
      <div className="bg-[#111111] border border-white/10 rounded-lg p-6">
        <h3 className="font-semibold text-white mb-4">Acciones</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleRenew(RenewalPlan.MONTHLY)}
            disabled={action !== ''}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-[#00D4FF18] text-[#00D4FF] hover:bg-[#00D4FF25] disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Renovar mensual
          </button>
          <button
            onClick={() => handleRenew(RenewalPlan.ANNUAL_10)}
            disabled={action !== ''}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-[#8B5CF618] text-[#8B5CF6] hover:bg-[#8B5CF625] disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Anual (10%)
          </button>
          <button
            onClick={() => handleRenew(RenewalPlan.ANNUAL_15)}
            disabled={action !== ''}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-[#10B98118] text-[#10B981] hover:bg-[#10B98125] disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Anual (15%)
          </button>
          <button
            onClick={handleReactivateSetup}
            disabled={action !== ''}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-[#F59E0B18] text-[#F59E0B] hover:bg-[#F59E0B25] disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <RotateCcw size={16} />
            Re-activar setup
          </button>
        </div>
      </div>

      {/* Renewal history */}
      {sub.renewals.length > 0 && (
        <div className="bg-[#111111] border border-white/10 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-4">Historial de renovaciones</h3>
          <div className="space-y-2">
            {sub.renewals.map((renewal) => (
              <div key={renewal.id} className="flex items-center justify-between p-3 bg-[#18181B] rounded border border-white/5">
                <div className="text-sm">
                  <div className="text-white font-mono">{renewal.plan}</div>
                  <div className="text-xs text-[#71717A] mt-1">
                    {new Date(renewal.startsAt).toLocaleDateString('es-PE')} → {new Date(renewal.endsAt).toLocaleDateString('es-PE')}
                  </div>
                </div>
                <div className="text-right text-sm">
                  {renewal.amount && <div className="text-white font-mono">S/. {renewal.amount}</div>}
                  {renewal.discountPercent > 0 && (
                    <div className="text-xs text-[#10B981]">-{renewal.discountPercent}%</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
