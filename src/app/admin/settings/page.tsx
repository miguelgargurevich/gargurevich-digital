'use client';

import { useEffect, useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

interface KV { key: string; value: string }

const SUGGESTED_KEYS: { key: string; label: string; section: string }[] = [
  { key: 'hero.badgeEs', label: 'Badge (ES)', section: 'Hero' },
  { key: 'hero.badgeEn', label: 'Badge (EN)', section: 'Hero' },
  { key: 'hero.titleEs', label: 'Título principal (ES)', section: 'Hero' },
  { key: 'hero.titleEn', label: 'Título principal (EN)', section: 'Hero' },
  { key: 'hero.subtitleEs', label: 'Subtítulo (ES)', section: 'Hero' },
  { key: 'hero.subtitleEn', label: 'Subtítulo (EN)', section: 'Hero' },
  { key: 'contact.email', label: 'Email de contacto', section: 'Contacto' },
  { key: 'contact.whatsapp', label: 'WhatsApp (número)', section: 'Contacto' },
  { key: 'contact.location', label: 'Ubicación', section: 'Contacto' },
  { key: 'stats.projects', label: 'Proyectos completados', section: 'Stats' },
  { key: 'stats.clients', label: 'Clientes satisfechos', section: 'Stats' },
  { key: 'stats.experience', label: 'Años de experiencia', section: 'Stats' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<KV[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d: Record<string, string>) => {
        const kvs = Object.entries(d).map(([key, value]) => ({ key, value }));
        setSettings(kvs.length > 0 ? kvs : SUGGESTED_KEYS.map((k) => ({ key: k.key, value: '' })));
        setLoading(false);
      });
  }, []);

  const set = (index: number, field: 'key' | 'value', v: string) =>
    setSettings((prev) => prev.map((item, i) => i === index ? { ...item, [field]: v } : item));

  const addRow = () => setSettings((prev) => [...prev, { key: '', value: '' }]);
  const removeRow = (index: number) => setSettings((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    const valid = settings.filter((s) => s.key.trim());
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(valid.map((s) => [s.key, s.value]))),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setSuccess('Ajustes guardados');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  // Group by section
  const sections = Array.from(new Set(SUGGESTED_KEYS.map((k) => k.section)));
  const getLabel = (key: string) => SUGGESTED_KEYS.find((k) => k.key === key)?.label ?? key;
  const getSection = (key: string) => SUGGESTED_KEYS.find((k) => k.key === key)?.section;

  // Separate known vs custom settings
  const knownKeys = new Set(SUGGESTED_KEYS.map((k) => k.key));
  const knownSettings = settings.filter((s) => knownKeys.has(s.key));
  const customSettings = settings.filter((s) => !knownKeys.has(s.key));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ajustes del sitio</h1>
          <p className="text-[#71717A] text-sm mt-1">Textos y configuraciones globales</p>
        </div>
        <div className="flex items-center gap-2">
          {success && <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">{success}</span>}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00B8D9] text-background font-semibold px-4 py-2.5 rounded-lg text-sm transition-all disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <Save size={15} />}
            Guardar
          </button>
        </div>
      </div>

      {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</div>}

      {/* Known settings by section */}
      {sections.map((section) => {
        const sectionItems = knownSettings.filter((s) => getSection(s.key) === section);
        if (sectionItems.length === 0) return null;
        return (
          <div key={section} className="bg-[#111111] border border-white/10 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">{section}</h3>
            <div className="space-y-3">
              {sectionItems.map((s) => {
                const globalIdx = settings.findIndex((x) => x.key === s.key);
                const isLong = s.value.length > 60 || s.key.includes('title') || s.key.includes('subtitle');
                return (
                  <div key={s.key}>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">{getLabel(s.key)}</label>
                    {isLong ? (
                      <textarea value={s.value} onChange={(e) => set(globalIdx, 'value', e.target.value)} rows={2} className="cms-input resize-none text-sm" placeholder={s.key} />
                    ) : (
                      <input value={s.value} onChange={(e) => set(globalIdx, 'value', e.target.value)} className="cms-input text-sm" placeholder={s.key} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Custom settings */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">Campos personalizados</h3>
          <button type="button" onClick={addRow} className="flex items-center gap-1 text-[10px] text-[#00D4FF] hover:text-[#00B8D9] transition-colors">
            <Plus size={12} />Agregar campo
          </button>
        </div>
        <div className="space-y-2">
          {customSettings.map((s) => {
            const globalIdx = settings.findIndex((x) => x.key === s.key);
            return (
              <div key={globalIdx} className="flex items-center gap-2">
                <input value={s.key} onChange={(e) => set(globalIdx, 'key', e.target.value)} className="cms-input w-40 text-xs" placeholder="clave" />
                <input value={s.value} onChange={(e) => set(globalIdx, 'value', e.target.value)} className="cms-input flex-1 text-xs" placeholder="valor" />
                <button type="button" onClick={() => removeRow(globalIdx)} className="p-1.5 text-[#52525B] hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
          {customSettings.length === 0 && (
            <p className="text-xs text-[#52525B]">Sin campos personalizados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
