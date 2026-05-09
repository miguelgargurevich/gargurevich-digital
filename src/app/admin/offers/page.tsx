'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  ChevronUp,
  ChevronDown,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Offer {
  id: string;
  planKey: string;
  icon: string;
  nameEs: string;
  nameEn: string;
  price: string;
  renewalPrice: string | number;
  priceNoteEs: string;
  priceNoteEn: string;
  descriptionEs: string;
  descriptionEn: string;
  itemsEs: string[];
  itemsEn: string[];
  ctaEs: string;
  ctaEn: string;
  forWhoEs: string;
  forWhoEn: string;
  popular: boolean;
  order: number;
  published: boolean;
}

type OfferFormData = Omit<Offer, 'id'>;

const EMPTY_FORM: OfferFormData = {
  planKey: '',
  icon: 'zap',
  nameEs: '',
  nameEn: '',
  price: '',
  renewalPrice: 0,
  priceNoteEs: '',
  priceNoteEn: '',
  descriptionEs: '',
  descriptionEn: '',
  itemsEs: [],
  itemsEn: [],
  ctaEs: 'Quiero este plan',
  ctaEn: 'I want this plan',
  forWhoEs: '',
  forWhoEn: '',
  popular: false,
  order: 0,
  published: true,
};

const ICON_OPTIONS = ['zap', 'star', 'sparkles', 'rocket', 'briefcase', 'globe'];

function ItemsEditor({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const trimmed = draft.trim();
    if (trimmed) { onChange([...items, trimmed]); setDraft(''); }
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#00D4FF]/40"
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-lg text-[#00D4FF] hover:bg-[#00D4FF]/20 transition-colors">
          <Plus size={14} />
        </button>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-[#A1A1AA] bg-[#111111] rounded-lg px-3 py-2">
            <span className="flex-1">{item}</span>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-[#52525B] hover:text-[#EF4444] transition-colors">
              <X size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OfferModal({
  offer,
  onSave,
  onClose,
}: {
  offer: Offer | null;
  onSave: (data: OfferFormData, id?: string) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<OfferFormData>(offer ? { ...offer } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'es' | 'en'>('es');

  const set = (key: keyof OfferFormData, val: unknown) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form, offer?.id);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111111] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#111111] z-10">
          <h2 className="text-white font-semibold">{offer ? 'Editar oferta' : 'Nueva oferta'}</h2>
          <button onClick={onClose} className="text-[#71717A] hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Common fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#71717A] mb-1.5 block">Plan Key <span className="text-[#EF4444]">*</span></label>
              <input required value={form.planKey} onChange={e => set('planKey', e.target.value)} placeholder="web-corporativa-pro"
                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40" />
            </div>
            <div>
              <label className="text-xs text-[#71717A] mb-1.5 block">Price</label>
              <input value={form.price} onChange={e => set('price', e.target.value)} placeholder="S/ 900 – 1200"
                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40" />
            </div>
            <div>
              <label className="text-xs text-[#71717A] mb-1.5 block">Renewal Price (PEN)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.renewalPrice}
                onChange={e => set('renewalPrice', Number(e.target.value || 0))}
                placeholder="150"
                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[#71717A] mb-1.5 block">Icon</label>
              <select value={form.icon} onChange={e => set('icon', e.target.value)}
                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40">
                {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#71717A] mb-1.5 block">Order</label>
              <input type="number" value={form.order} onChange={e => set('order', parseInt(e.target.value, 10))}
                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40" />
            </div>
            <div className="flex flex-col gap-2 pt-5">
              <label className="flex items-center gap-2 text-sm text-[#A1A1AA] cursor-pointer">
                <input type="checkbox" checked={form.popular} onChange={e => set('popular', e.target.checked)} className="accent-[#00D4FF]" />
                Popular
              </label>
              <label className="flex items-center gap-2 text-sm text-[#A1A1AA] cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="accent-[#00D4FF]" />
                Publicado
              </label>
            </div>
          </div>

          {/* Language tabs */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="flex border-b border-white/10">
              {(['es', 'en'] as const).map(l => (
                <button key={l} type="button" onClick={() => setTab(l)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === l ? 'bg-[#00D4FF]/10 text-[#00D4FF]' : 'text-[#71717A] hover:text-white'}`}>
                  {l === 'es' ? '🇵🇪 Español' : '🇺🇸 English'}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#71717A] mb-1.5 block">Nombre</label>
                  <input value={tab === 'es' ? form.nameEs : form.nameEn}
                    onChange={e => set(tab === 'es' ? 'nameEs' : 'nameEn', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40" />
                </div>
                <div>
                  <label className="text-xs text-[#71717A] mb-1.5 block">Nota de precio</label>
                  <input value={tab === 'es' ? form.priceNoteEs : form.priceNoteEn}
                    onChange={e => set(tab === 'es' ? 'priceNoteEs' : 'priceNoteEn', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40" />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#71717A] mb-1.5 block">Descripción</label>
                <textarea rows={2} value={tab === 'es' ? form.descriptionEs : form.descriptionEn}
                  onChange={e => set(tab === 'es' ? 'descriptionEs' : 'descriptionEn', e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40 resize-none" />
              </div>

              <div>
                <label className="text-xs text-[#71717A] mb-1.5 block">Items incluidos</label>
                <ItemsEditor
                  items={tab === 'es' ? form.itemsEs : form.itemsEn}
                  onChange={v => set(tab === 'es' ? 'itemsEs' : 'itemsEn', v)}
                  placeholder="Añadir item y presionar Enter..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#71717A] mb-1.5 block">CTA</label>
                  <input value={tab === 'es' ? form.ctaEs : form.ctaEn}
                    onChange={e => set(tab === 'es' ? 'ctaEs' : 'ctaEn', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40" />
                </div>
                <div>
                  <label className="text-xs text-[#71717A] mb-1.5 block">Para quién</label>
                  <input value={tab === 'es' ? form.forWhoEs : form.forWhoEn}
                    onChange={e => set(tab === 'es' ? 'forWhoEs' : 'forWhoEn', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/40" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-[#A1A1AA] hover:border-white/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-[#00D4FF] text-background font-semibold text-sm hover:bg-[#00BFE8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OffersAdminPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; offer: Offer | null }>({ open: false, offer: null });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/offers');
    const data = await res.json();
    setOffers(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const handleSave = async (data: OfferFormData, id?: string) => {
    if (id) {
      await fetch(`/api/admin/offers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    setModal({ open: false, offer: null });
    fetchOffers();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/offers/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const togglePublished = async (offer: Offer) => {
    await fetch(`/api/admin/offers/${offer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !offer.published }),
    });
    setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, published: !o.published } : o));
  };

  const moveOrder = async (offer: Offer, dir: 'up' | 'down') => {
    const sorted = [...offers].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(o => o.id === offer.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swap = sorted[swapIdx];
    const newOrder = swap.order;
    const swapOrder = offer.order;
    await Promise.all([
      fetch(`/api/admin/offers/${offer.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: newOrder }) }),
      fetch(`/api/admin/offers/${swap.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: swapOrder }) }),
    ]);
    setOffers(prev => prev.map(o => {
      if (o.id === offer.id) return { ...o, order: newOrder };
      if (o.id === swap.id) return { ...o, order: swapOrder };
      return o;
    }));
  };

  const sorted = [...offers].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag size={22} className="text-[#8B5CF6]" />
            Ofertas
          </h1>
          <p className="text-[#71717A] text-sm mt-1">{offers.length} paquete{offers.length !== 1 ? 's' : ''} configurado{offers.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setModal({ open: true, offer: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Nueva oferta
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#71717A]">
          <Loader2 size={20} className="animate-spin mr-2" />
          Cargando...
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((offer, idx) => (
            <div
              key={offer.id}
              className={`bg-[#111111] border rounded-xl p-5 flex items-start gap-4 ${offer.popular ? 'border-[#00D4FF]/30' : 'border-white/10'}`}
            >
              {/* Order controls */}
              <div className="flex flex-col gap-1 pt-0.5">
                <button onClick={() => moveOrder(offer, 'up')} disabled={idx === 0}
                  className="text-[#52525B] hover:text-white disabled:opacity-20 transition-colors">
                  <ChevronUp size={14} />
                </button>
                <span className="text-[#52525B] text-xs text-center">{offer.order}</span>
                <button onClick={() => moveOrder(offer, 'down')} disabled={idx === sorted.length - 1}
                  className="text-[#52525B] hover:text-white disabled:opacity-20 transition-colors">
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{offer.nameEs}</span>
                  {offer.nameEn !== offer.nameEs && (
                    <span className="text-[#71717A] text-sm">/ {offer.nameEn}</span>
                  )}
                  {offer.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00D4FF]/15 text-[#00D4FF] text-xs font-medium">
                      <Star size={10} className="fill-current" /> Popular
                    </span>
                  )}
                  {!offer.published && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-[#71717A] text-xs">
                      Oculto
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[#00D4FF] font-semibold text-sm">{offer.price}</span>
                  <span className="text-[#71717A] text-xs">Renovación: S/ {offer.renewalPrice}</span>
                  <span className="text-[#52525B] text-xs">·</span>
                  <span className="text-[#71717A] text-xs font-mono">{offer.planKey}</span>
                  <span className="text-[#52525B] text-xs">·</span>
                  <span className="text-[#71717A] text-xs">{offer.itemsEs.length} items</span>
                </div>
                <p className="text-[#71717A] text-xs mt-1.5 line-clamp-1">{offer.descriptionEs}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublished(offer)}
                  className={`p-2 rounded-lg border transition-colors ${offer.published ? 'border-white/10 text-[#71717A] hover:text-white' : 'border-[#52525B]/40 text-[#52525B] hover:text-white'}`}>
                  {offer.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => setModal({ open: true, offer })}
                  className="p-2 rounded-lg border border-white/10 text-[#71717A] hover:text-white transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setConfirmDelete(offer.id)}
                  className="p-2 rounded-lg border border-white/10 text-[#71717A] hover:text-[#EF4444] transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <OfferModal
          offer={modal.offer}
          onSave={handleSave}
          onClose={() => setModal({ open: false, offer: null })}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/15 rounded-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <h3 className="text-white font-semibold">¿Eliminar esta oferta?</h3>
            <p className="text-[#71717A] text-sm">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-[#A1A1AA] hover:border-white/20 transition-colors">
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2 rounded-lg bg-[#EF4444] text-white text-sm font-medium hover:bg-[#DC2626] transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
