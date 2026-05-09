'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, Plus, RotateCcw } from 'lucide-react';
import { SubscriptionStatus, RenewalPlan } from '@prisma/client';

interface SubscriptionDetail {
  id: string;
  slug: string;
  businessName: string;
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
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [sub, setSub] = useState<SubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    fetch(`/api/admin/subscriptions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSub(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError('Error cargando suscripción');
        setLoading(false);
      });
  }, [id]);

  const handleRenew = async (plan: RenewalPlan) => {
    setAction(`renew_${plan}`);
    try {
      const r = await fetch(`/api/admin/subscriptions/${id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (!r.ok) throw new Error(await r.text());
      alert('Renovación procesada');
      window.location.reload();
    } catch (e) {
      alert('Error: ' + (e instanceof Error ? e.message : 'desconocido'));
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
      alert('Setup re-activado: 12 meses desde hoy');
      window.location.reload();
    } catch (e) {
      alert('Error: ' + (e instanceof Error ? e.message : 'desconocido'));
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
