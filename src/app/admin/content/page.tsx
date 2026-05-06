'use client';

import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';

interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea';
}

const CONTENT_FIELDS: ContentField[] = [
  { key: 'hero.badgeEs', label: 'Hero badge ES', type: 'text' },
  { key: 'hero.badgeEn', label: 'Hero badge EN', type: 'text' },
  { key: 'hero.titleEs', label: 'Hero title ES', type: 'textarea' },
  { key: 'hero.titleEn', label: 'Hero title EN', type: 'textarea' },
  { key: 'hero.subtitleEs', label: 'Hero subtitle ES', type: 'textarea' },
  { key: 'hero.subtitleEn', label: 'Hero subtitle EN', type: 'textarea' },
  { key: 'contact.email', label: 'Contact email', type: 'text' },
  { key: 'contact.whatsapp', label: 'Contact WhatsApp', type: 'text' },
  { key: 'contact.location', label: 'Contact location', type: 'text' },
  { key: 'stats.projects', label: 'Stats projects', type: 'text' },
  { key: 'stats.clients', label: 'Stats clients', type: 'text' },
  { key: 'stats.experience', label: 'Stats experience', type: 'text' },
];

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setValues(data ?? {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    return {
      hero: CONTENT_FIELDS.filter((f) => f.key.startsWith('hero.')),
      contact: CONTENT_FIELDS.filter((f) => f.key.startsWith('contact.')),
      stats: CONTENT_FIELDS.filter((f) => f.key.startsWith('stats.')),
    };
  }, []);

  const setValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = CONTENT_FIELDS.reduce<Record<string, string>>((acc, field) => {
        acc[field.key] = values[field.key] ?? '';
        return acc;
      }, {});

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Error al guardar contenido');
      }

      setSuccess('Contenido actualizado');
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

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contenido</h1>
          <p className="text-[#71717A] text-sm mt-1">Edita textos principales de Hero, Contacto y Stats.</p>
        </div>
        <div className="flex items-center gap-2">
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

      <Section title="Hero">
        {grouped.hero.map((field) => (
          <Field key={field.key} label={field.label}>
            {field.type === 'textarea' ? (
              <textarea
                rows={3}
                className="cms-input resize-none"
                value={values[field.key] ?? ''}
                onChange={(e) => setValue(field.key, e.target.value)}
              />
            ) : (
              <input
                className="cms-input"
                value={values[field.key] ?? ''}
                onChange={(e) => setValue(field.key, e.target.value)}
              />
            )}
          </Field>
        ))}
      </Section>

      <Section title="Contacto">
        {grouped.contact.map((field) => (
          <Field key={field.key} label={field.label}>
            <input
              className="cms-input"
              value={values[field.key] ?? ''}
              onChange={(e) => setValue(field.key, e.target.value)}
            />
          </Field>
        ))}
      </Section>

      <Section title="Stats">
        {grouped.stats.map((field) => (
          <Field key={field.key} label={field.label}>
            <input
              className="cms-input"
              value={values[field.key] ?? ''}
              onChange={(e) => setValue(field.key, e.target.value)}
            />
          </Field>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-5 space-y-4">
      <h2 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
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
