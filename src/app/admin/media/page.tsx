'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Trash2, Upload, Check } from 'lucide-react';
import { useAdminAlert } from '@/components/providers/AdminAlertProvider';

interface MediaFile {
  id: string;
  filename: string;
  key: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const { push, confirm } = useAdminAlert();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () =>
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => { setFiles(Array.isArray(d) ? d : []); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Error al subir el archivo');
      await load();
      push({ kind: 'success', title: 'Archivo subido', message: file.name });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir';
      setError(message);
      push({ kind: 'error', title: 'Subida fallida', message });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (key: string) => {
    const accepted = await confirm({
      title: 'Eliminar archivo',
      message: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      danger: true,
    });
    if (!accepted) return;

    const response = await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    if (!response.ok) {
      push({ kind: 'error', title: 'No se pudo eliminar', message: 'Inténtalo nuevamente' });
      return;
    }
    setFiles((f) => f.filter((x) => x.key !== key));
    push({ kind: 'success', title: 'Archivo eliminado' });
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    push({ kind: 'info', title: 'URL copiada', message: 'Enlace copiado al portapapeles', durationMs: 1600 });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media</h1>
          <p className="text-[#71717A] text-sm mt-1">Archivos subidos a Cloudflare R2</p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00B8D9] text-background font-semibold px-4 py-2.5 rounded-lg text-sm transition-all disabled:opacity-60"
          >
            {uploading ? (
              <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            {uploading ? 'Subiendo…' : 'Subir imagen'}
          </button>
        </div>
      </div>

      {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#111111] border border-white/10 rounded-xl aspect-video animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="bg-[#111111] border border-white/10 rounded-xl p-16 text-center">
          <Upload size={32} className="text-[#52525B] mx-auto mb-3" />
          <p className="text-[#71717A] text-sm">No hay archivos. Sube tu primera imagen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((f) => (
            <div key={f.id} className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden group hover:border-white/20 transition-all">
              {/* Thumbnail */}
              <div className="aspect-video bg-[#0d0d0d] relative overflow-hidden">
                {f.mimeType.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.url} alt={f.filename} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#52525B] text-xs">{f.mimeType}</div>
                )}
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-white font-medium truncate mb-0.5" title={f.filename}>{f.filename}</p>
                <p className="text-[10px] text-[#71717A]">{fmtSize(f.size)}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    onClick={() => handleCopy(f.url)}
                    className="flex-1 flex items-center justify-center gap-1 text-[10px] bg-white/5 hover:bg-white/10 text-[#A1A1AA] py-1.5 rounded-lg transition-all"
                    title="Copiar URL"
                  >
                    {copied === f.url ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                    {copied === f.url ? 'Copiado' : 'Copiar URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(f.key)}
                    className="p-1.5 text-[#52525B] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
