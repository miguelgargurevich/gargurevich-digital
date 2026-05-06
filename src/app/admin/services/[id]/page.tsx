'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

interface ServiceForm {
  id: string;
  slug: string;
  icon: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  featuresEs: string[];
  featuresEn: string[];
  order: number;
  published: boolean;
}

const ICONS = ['layout', 'globe', 'shopping-cart', 'monitor', 'cpu', 'server', 'code', 'smartphone', 'database', 'shield'];

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<ServiceForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch(`/api/admin/services/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const addItem = (field: 'featuresEs' | 'featuresEn') => set(field, [...(form?.[field] ?? []), '']);

  const updateItem = (field: 'featuresEs' | 'featuresEn', index: number, value: string) => {
    const items = [...(form?.[field] ?? [])];
    items[index] = value;
    set(field, items);
  };

  const removeItem = (field: 'featuresEs' | 'featuresEn', index: number) => {
    set(field, (form?.[field] ?? []).filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al guardar');
      }

      const updated = await res.json();
      setForm(updated);
      setSuccess('Guardado correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="space-y-4">
        <p className="text-red-400">No se encontro el servicio.</p>
        <button className="cms-btn" onClick={() => router.push('/admin/services')}>
          Volver a servicios
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/services" className="p-2 text-[#71717A] hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{form.titleEs}</h1>
          <p className="text-xs text-[#71717A]">slug: {form.slug}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {success && (
            <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
              {success}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00B8D9] text-background font-semibold px-4 py-2.5 rounded-lg text-sm transition-all disabled:opacity-60"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Guardar
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card title="Titulos">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Titulo ES">
                <input value={form.titleEs} onChange={(e) => set('titleEs', e.target.value)} className="cms-input" />
              </Field>
              <Field label="Title EN">
                <input value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} className="cms-input" />
              </Field>
            </div>
          </Card>

          <Card title="Descripciones">
            <Field label="Descripcion ES">
              <textarea
                value={form.descriptionEs}
                onChange={(e) => set('descriptionEs', e.target.value)}
                rows={4}
                className="cms-input resize-none"
              />
            </Field>
            <Field label="Description EN">
              <textarea
                value={form.descriptionEn}
                onChange={(e) => set('descriptionEn', e.target.value)}
                rows={4}
                className="cms-input resize-none"
              />
            </Field>
          </Card>

          <Card title="Caracteristicas">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DynamicList
                label="Features ES"
                items={form.featuresEs}
                onAdd={() => addItem('featuresEs')}
                onChange={(i, v) => updateItem('featuresEs', i, v)}
                onRemove={(i) => removeItem('featuresEs', i)}
                placeholder="Caracteristica..."
              />
              <DynamicList
                label="Features EN"
                items={form.featuresEn}
                onAdd={() => addItem('featuresEn')}
                onChange={(i, v) => updateItem('featuresEn', i, v)}
                onRemove={(i) => removeItem('featuresEn', i)}
                placeholder="Feature..."
              />
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Configuracion">
            <Field label="Icono">
              <select value={form.icon} onChange={(e) => set('icon', e.target.value)} className="cms-input">
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Orden">
              <input
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => set('order', Number(e.target.value))}
                className="cms-input"
              />
            </Field>

            <Field label="Publicado">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`relative w-10 h-5 rounded-full transition-all ${form.published ? 'bg-[#00D4FF]' : 'bg-white/10'}`}
                  onClick={() => set('published', !form.published)}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.published ? 'left-5' : 'left-0.5'}`}
                  />
                </div>
                <span className="text-sm text-[#A1A1AA]">{form.published ? 'Publicado' : 'Oculto'}</span>
              </label>
            </Field>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-5 space-y-4">
      <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function DynamicList({
  label,
  items,
  onAdd,
  onChange,
  onRemove,
  placeholder,
}: {
  label: string;
  items: string[];
  onAdd: () => void;
  onChange: (i: number, v: string) => void;
  onRemove: (i: number) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#A1A1AA]">{label}</span>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-[10px] text-[#00D4FF] hover:text-[#00B8D9] transition-colors"
        >
          <Plus size={12} />
          Agregar
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <input
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              className="cms-input flex-1 text-xs py-2"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1.5 text-[#52525B] hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-[#52525B]">Sin elementos.</p>}
      </div>
    </div>
  );
}
