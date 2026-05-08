'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Inbox,
  Mail,
  Phone,
  Building2,
  Calendar,
  ChevronDown,
  Trash2,
  StickyNote,
  X,
  Check,
  Loader2,
  RefreshCw,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

type LeadStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED_WON' | 'CLOSED_LOST';
type SortField = 'createdAt' | 'name' | 'status';
type SortOrder = 'asc' | 'desc';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  message: string;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
}

const STATUS_META: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  NEW:           { label: 'Nuevo',       color: '#00D4FF', bg: '#00D4FF18' },
  CONTACTED:     { label: 'Contactado',  color: '#F59E0B', bg: '#F59E0B18' },
  IN_PROGRESS:   { label: 'En progreso', color: '#8B5CF6', bg: '#8B5CF618' },
  CLOSED_WON:    { label: 'Ganado ✓',   color: '#10B981', bg: '#10B98118' },
  CLOSED_LOST:   { label: 'Perdido',     color: '#EF4444', bg: '#EF444418' },
};

const PLAN_LABELS: Record<string, string> = {
  'starter-digital': 'Starter Digital',
  'web-corporativa': 'Web Corporativa',
  'web-corporativa-pro': 'Web Corporativa PRO + CMS',
  'negocio-digital-completo': 'Negocio Digital Completo',
  otro: 'Otro',
};

const ALL_STATUSES = Object.keys(STATUS_META) as LeadStatus[];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | ''>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const fetchLeads = useCallback(async (cursor?: string | null, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const qs = new URLSearchParams({ limit: String(pageSize) });
    if (filterStatus) qs.set('status', filterStatus);
    if (search) qs.set('q', search);
    qs.set('sort', sortField);
    qs.set('order', sortOrder);
    if (cursor) qs.set('cursor', cursor);

    const res = await fetch(`/api/admin/leads?${qs}`);
    const data = await res.json();
    setLeads((prev) => (append ? [...prev, ...(data.leads ?? [])] : (data.leads ?? [])));
    setTotal(data.total ?? 0);
    setPageSize(data.limit ?? 20);
    setHasMore(Boolean(data.hasMore));
    setNextCursor(data.nextCursor ?? null);
    setLoading(false);
    setLoadingMore(false);
  }, [filterStatus, pageSize, search, sortField, sortOrder]);

  useEffect(() => {
    setNextCursor(null);
    fetchLeads(null, false);
  }, [fetchLeads]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    await fetch(`/api/admin/leads/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    setLeads(prev => prev.map(l => l.id === selected.id ? { ...l, notes } : l));
    setSelected(prev => prev ? { ...prev, notes } : null);
    setSaving(false);
  };

  const deleteLead = async (id: string) => {
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    setLeads(prev => prev.filter(l => l.id !== id));
    setTotal(t => t - 1);
    setConfirmDelete(null);
    if (selected?.id === id) setSelected(null);
  };

  const openDetail = (lead: Lead) => {
    setSelected(lead);
    setNotes(lead.notes ?? '');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortOrder(field === 'createdAt' ? 'desc' : 'asc');
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} className="text-[#52525B]" />;
    }

    return sortOrder === 'asc'
      ? <ArrowUp size={13} className="text-[#00D4FF]" />
      : <ArrowDown size={13} className="text-[#00D4FF]" />;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Inbox size={22} className="text-[#00D4FF]" />
            Leads
          </h1>
          <p className="text-[#71717A] text-sm mt-1">{total} contacto{total !== 1 ? 's' : ''} recibido{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative min-w-0 sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre, email, empresa o mensaje"
              className="w-full bg-[#111111] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#00D4FF]/50"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => {
                setFilterStatus(e.target.value as LeadStatus | '');
              }}
              className="appearance-none bg-[#111111] border border-white/10 rounded-lg px-3 py-2 pr-8 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50"
            >
              <option value="">Todos los estados</option>
              {ALL_STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
          </div>

          <button
            onClick={() => fetchLeads(null, false)}
            className="p-2 bg-[#111111] border border-white/10 rounded-lg hover:border-white/20 transition-colors text-[#71717A] hover:text-white"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-[#71717A]">
                <Loader2 size={20} className="animate-spin mr-2" />
                Cargando...
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#52525B]">
                <Inbox size={40} className="mb-3 opacity-40" />
                <p className="text-sm">No hay leads todavía</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-4 py-3 text-[#71717A] font-medium">
                      <button
                        type="button"
                        onClick={() => handleSort('name')}
                        className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                      >
                        Contacto
                        <SortIndicator field="name" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-[#71717A] font-medium hidden md:table-cell">Plan</th>
                    <th className="px-4 py-3 text-[#71717A] font-medium hidden lg:table-cell">
                      <button
                        type="button"
                        onClick={() => handleSort('createdAt')}
                        className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                      >
                        Fecha
                        <SortIndicator field="createdAt" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-[#71717A] font-medium">
                      <button
                        type="button"
                        onClick={() => handleSort('status')}
                        className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                      >
                        Estado
                        <SortIndicator field="status" />
                      </button>
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => {
                    const sm = STATUS_META[lead.status];
                    const isActive = selected?.id === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => openDetail(lead)}
                        className={`border-b border-white/5 cursor-pointer transition-colors hover:bg-white/3 ${isActive ? 'bg-white/5' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-white truncate max-w-40">{lead.name}</div>
                          <div className="text-[#71717A] text-xs truncate max-w-40">{lead.email}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-[#A1A1AA] text-xs">
                          {PLAN_LABELS[lead.projectType] ?? lead.projectType}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-[#71717A] text-xs whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                            style={{ color: sm.color, background: sm.bg }}
                          >
                            {sm.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={e => { e.stopPropagation(); setConfirmDelete(lead.id); }}
                            className="p-1.5 text-[#52525B] hover:text-[#EF4444] transition-colors rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-3 flex flex-col items-center gap-3 text-sm text-[#71717A]">
            <span>Mostrando {leads.length} de {total} leads</span>
            {hasMore && nextCursor && (
              <button
                onClick={() => fetchLeads(nextCursor, true)}
                disabled={loadingMore}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#111111] px-4 py-2 text-sm text-white hover:border-white/20 transition-colors disabled:opacity-50"
              >
                {loadingMore ? <Loader2 size={15} className="animate-spin" /> : null}
                {loadingMore ? 'Cargando...' : 'Cargar más'}
              </button>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 shrink-0 bg-[#111111] border border-white/10 rounded-xl p-5 space-y-5 self-start">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold text-white text-base">{selected.name}</h2>
                {selected.company && (
                  <p className="text-[#71717A] text-xs mt-0.5 flex items-center gap-1">
                    <Building2 size={11} />{selected.company}
                  </p>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="text-[#52525B] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Contact links */}
            <div className="space-y-2">
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#00D4FF] transition-colors"
              >
                <Mail size={14} />
                {selected.email}
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '51966918363'}?text=${encodeURIComponent(`Hola ${selected.name}, te contacto por tu consulta sobre ${PLAN_LABELS[selected.projectType] ?? selected.projectType}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#25D366] transition-colors"
              >
                <Phone size={14} />
                Escribir por WhatsApp
              </a>
            </div>

            {/* Plan + Date */}
            <div className="space-y-1 text-xs text-[#71717A]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#52525B]">Plan:</span>
                <span className="text-[#00D4FF]">{PLAN_LABELS[selected.projectType] ?? selected.projectType}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={11} />
                {new Date(selected.createdAt).toLocaleString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Message */}
            <div>
              <p className="text-xs text-[#71717A] mb-1.5 uppercase tracking-wide">Mensaje</p>
              <p className="text-sm text-[#A1A1AA] bg-background rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </p>
            </div>

            {/* Status selector */}
            <div>
              <p className="text-xs text-[#71717A] mb-2 uppercase tracking-wide">Estado</p>
              <div className="grid grid-cols-1 gap-1.5">
                {ALL_STATUSES.map(s => {
                  const sm = STATUS_META[s];
                  const active = selected.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all"
                      style={{
                        borderColor: active ? sm.color + '60' : '#ffffff12',
                        background: active ? sm.bg : 'transparent',
                        color: active ? sm.color : '#71717A',
                      }}
                    >
                      {sm.label}
                      {active && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-xs text-[#71717A] mb-1.5 uppercase tracking-wide flex items-center gap-1">
                <StickyNote size={11} /> Notas internas
              </p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Añade notas privadas sobre este lead..."
                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-[#A1A1AA] placeholder-[#52525B] focus:outline-none focus:border-[#00D4FF]/40 resize-none"
              />
              <button
                onClick={saveNotes}
                disabled={saving}
                className="mt-2 w-full flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-xs text-[#A1A1AA] transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                {saving ? 'Guardando...' : 'Guardar notas'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/15 rounded-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <h3 className="text-white font-semibold">¿Eliminar este lead?</h3>
            <p className="text-[#71717A] text-sm">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-[#A1A1AA] hover:border-white/20 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteLead(confirmDelete)}
                className="flex-1 py-2 rounded-lg bg-[#EF4444] text-white text-sm font-medium hover:bg-[#DC2626] transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
