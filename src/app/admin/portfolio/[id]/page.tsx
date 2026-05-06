'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react';

interface ProjectForm {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  featuresEs: string[];
  featuresEn: string[];
  tech: string[];
  github: string;
  live: string;
  color: string;
  imageUrl: string;
  order: number;
  published: boolean;
}

const EMPTY: Omit<ProjectForm, 'id' | 'slug'> = {
  titleEs: '',
  titleEn: '',
  descriptionEs: '',
  descriptionEn: '',
  featuresEs: [],
  featuresEn: [],
  tech: [],
  github: '#',
  live: '#',
  color: '#00D4FF',
  imageUrl: '',
  order: 0,
  published: true,
};

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProjectForm>({ id: '', slug: '', ...EMPTY });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/portfolio/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setForm({ ...data, imageUrl: data.imageUrl ?? '' });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ── Dynamic list helpers ──
  const addItem = (field: 'featuresEs' | 'featuresEn' | 'tech') =>
    set(field, [...form[field], '']);

  const updateItem = (field: 'featuresEs' | 'featuresEn' | 'tech', i: number, val: string) => {
    const arr = [...form[field]];
    arr[i] = val;
    set(field, arr);
  };

  const removeItem = (field: 'featuresEs' | 'featuresEn' | 'tech', i: number) =>
    set(field, form[field].filter((_, idx) => idx !== i));

  // ── Image upload ──
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      // 1. Get presigned URL
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
      });
      const { uploadUrl, publicUrl, key } = await res.json();
      if (!uploadUrl) throw new Error('No se pudo obtener URL de subida');

      // 2. Upload directly to R2
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Error al subir el archivo a R2');

      // 3. Register in media library after successful upload.
      const finalizeRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalize: true,
          key,
          filename: file.name,
          contentType: file.type,
          size: file.size,
          publicUrl,
        }),
      });
      if (!finalizeRes.ok) throw new Error('No se pudo registrar la imagen en CMS');

      set('imageUrl', publicUrl);

      // 4. Persist image URL immediately for existing projects.
      if (!isNew) {
        const patchRes = await fetch(`/api/admin/portfolio/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: publicUrl }),
        });
        if (!patchRes.ok) throw new Error('La imagen se subio, pero no se pudo guardar en el proyecto');
        setSuccess('Imagen subida y guardada en el proyecto');
      } else {
        setSuccess('Imagen subida. Guarda el proyecto para persistirla');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  // ── Save ──
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let res: Response;
      if (isNew) {
        res = await fetch('/api/admin/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, imageUrl: form.imageUrl || null }),
        });
      } else {
        res = await fetch(`/api/admin/portfolio/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, imageUrl: form.imageUrl || null }),
        });
      }

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Error al guardar');
      }

      setSuccess('Guardado correctamente');
      if (isNew) {
        const created = await res.json();
        router.push(`/admin/portfolio/${created.id}`);
      }
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
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/portfolio" className="p-2 text-[#71717A] hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">
            {isNew ? 'Nuevo proyecto' : form.titleEs || form.slug}
          </h1>
          {!isNew && <p className="text-xs text-[#71717A]">slug: {form.slug}</p>}
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
        {/* ── Left column: content ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Titles */}
          <Card title="Títulos">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Título (ES)" required>
                <input
                  value={form.titleEs}
                  onChange={(e) => set('titleEs', e.target.value)}
                  className="cms-input"
                  placeholder="Nombre del proyecto"
                />
              </Field>
              <Field label="Title (EN)" required>
                <input
                  value={form.titleEn}
                  onChange={(e) => set('titleEn', e.target.value)}
                  className="cms-input"
                  placeholder="Project name"
                />
              </Field>
            </div>
          </Card>

          {/* Descriptions */}
          <Card title="Descripciones">
            <Field label="Descripción (ES)" required>
              <textarea
                value={form.descriptionEs}
                onChange={(e) => set('descriptionEs', e.target.value)}
                rows={4}
                className="cms-input resize-none"
                placeholder="Descripción detallada del proyecto…"
              />
            </Field>
            <Field label="Description (EN)" required>
              <textarea
                value={form.descriptionEn}
                onChange={(e) => set('descriptionEn', e.target.value)}
                rows={4}
                className="cms-input resize-none"
                placeholder="Detailed project description…"
              />
            </Field>
          </Card>

          {/* Features */}
          <Card title="Características destacadas">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DynamicList
                label="Features ES"
                items={form.featuresEs}
                onAdd={() => addItem('featuresEs')}
                onChange={(i, v) => updateItem('featuresEs', i, v)}
                onRemove={(i) => removeItem('featuresEs', i)}
                placeholder="Característica…"
              />
              <DynamicList
                label="Features EN"
                items={form.featuresEn}
                onAdd={() => addItem('featuresEn')}
                onChange={(i, v) => updateItem('featuresEn', i, v)}
                onRemove={(i) => removeItem('featuresEn', i)}
                placeholder="Feature…"
              />
            </div>
          </Card>

          {/* Tech stack */}
          <Card title="Tech Stack">
            <DynamicList
              label="Tecnologías"
              items={form.tech}
              onAdd={() => addItem('tech')}
              onChange={(i, v) => updateItem('tech', i, v)}
              onRemove={(i) => removeItem('tech', i)}
              placeholder="Next.js 15…"
            />
          </Card>

          {/* Links */}
          <Card title="Links">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="GitHub URL">
                <input
                  value={form.github}
                  onChange={(e) => set('github', e.target.value)}
                  className="cms-input"
                  placeholder="https://github.com/…"
                />
              </Field>
              <Field label="Live URL">
                <input
                  value={form.live}
                  onChange={(e) => set('live', e.target.value)}
                  className="cms-input"
                  placeholder="https://… (o # si no aplica)"
                />
              </Field>
            </div>
          </Card>
        </div>

        {/* ── Right column: image + meta ── */}
        <div className="space-y-5">
          {/* Image upload */}
          <Card title="Imagen del proyecto">
            <div
              className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 border border-white/10"
              style={{ background: `linear-gradient(135deg, ${form.color}18, #0d0d0d)` }}
            >
              {form.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover object-top"
                  />
                  <button
                    type="button"
                    onClick={() => set('imageUrl', '')}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-[#52525B]">
                  <Upload size={24} />
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[#A1A1AA] hover:text-white py-2.5 rounded-lg text-sm transition-all disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#A1A1AA]/30 border-t-[#A1A1AA] rounded-full animate-spin" />
                  Subiendo a R2…
                </>
              ) : (
                <>
                  <Upload size={14} />
                  {form.imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
                </>
              )}
            </button>

            {form.imageUrl && (
              <p className="text-[10px] text-[#52525B] mt-2 truncate" title={form.imageUrl}>
                {form.imageUrl}
              </p>
            )}
          </Card>

          {/* Meta */}
          <Card title="Metadatos">
            {isNew && (
              <Field label="Slug" required>
                <input
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  className="cms-input"
                  placeholder="mi-proyecto"
                />
              </Field>
            )}

            <Field label="Color del proyecto">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                  className="w-10 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                />
                <input
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                  className="cms-input flex-1"
                  placeholder="#00D4FF"
                />
              </div>
            </Field>

            <Field label="Orden">
              <input
                type="number"
                value={form.order}
                onChange={(e) => set('order', Number(e.target.value))}
                className="cms-input"
                min={0}
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

// ── Shared sub-components ──────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-5 space-y-4">
      <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
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
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              value={item}
              onChange={(e) => onChange(i, e.target.value)}
              className="cms-input flex-1 text-xs py-2"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="p-1.5 text-[#52525B] hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-[#52525B] py-1">Sin elementos. Haz clic en &quot;Agregar&quot;.</p>
        )}
      </div>
    </div>
  );
}
