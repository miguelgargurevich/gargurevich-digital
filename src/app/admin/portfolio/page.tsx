'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';

interface Project {
  id: string;
  slug: string;
  titleEs: string;
  color: string;
  published: boolean;
  imageUrl: string | null;
  tech: string[];
  order: number;
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/portfolio')
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        console.log(`CMS Portfolio Page: Found ${data.length} projects in DB:`, data.map((p: Project) => p.slug).join(', '));
        setLoading(false);
      });
  }, []);

  const togglePublish = async (id: string, current: boolean) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    await fetch(`/api/admin/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...project, published: !current }),
    });
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !current } : p))
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-[#71717A] text-sm mt-1">Gestiona los proyectos destacados</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00B8D9] text-background font-semibold px-4 py-2.5 rounded-lg text-sm transition-all"
        >
          <Plus size={16} />
          Nuevo proyecto
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#111111] border border-white/10 rounded-xl h-40 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#111111] border border-white/10 rounded-xl p-10 text-center">
          <p className="text-[#71717A] text-sm mb-4">No hay proyectos. Ve al Dashboard e inicializa el CMS primero.</p>
          <Link href="/admin/dashboard" className="cms-btn">Ir al Dashboard</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
            >
              {/* Image preview */}
              <div
                className="h-28 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${p.color}18 0%, #0d0d0d 100%)` }}
              >
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.titleEs}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#52525B] text-xs">
                    Sin imagen
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#111111] to-transparent" />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-sm font-semibold text-white truncate">{p.titleEs}</span>
                    </div>
                    <span className="text-xs text-[#71717A]">{p.slug}</span>
                  </div>
                  <button
                    onClick={() => togglePublish(p.id, p.published)}
                    className={`shrink-0 p-1.5 rounded-lg transition-all ${
                      p.published
                        ? 'text-green-400 bg-green-500/10 hover:bg-green-500/20'
                        : 'text-[#52525B] bg-white/5 hover:bg-white/10'
                    }`}
                    title={p.published ? 'Publicado' : 'Oculto'}
                  >
                    {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tech.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] bg-white/5 text-[#71717A] px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                  {p.tech.length > 3 && (
                    <span className="text-[10px] bg-white/5 text-[#71717A] px-1.5 py-0.5 rounded">
                      +{p.tech.length - 3}
                    </span>
                  )}
                </div>

                <Link
                  href={`/admin/portfolio/${p.id}`}
                  className="flex items-center gap-1.5 text-xs text-[#00D4FF] hover:text-[#00B8D9] transition-colors"
                >
                  <Pencil size={12} />
                  Editar proyecto
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
