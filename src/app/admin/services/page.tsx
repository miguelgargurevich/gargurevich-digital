'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceItem {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  featuresEs: string[];
  order: number;
  published: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/services')
      .then((r) => r.json())
      .then((d) => {
        setServices(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Servicios</h1>
        <p className="text-[#71717A] text-sm mt-1">Edita el contenido bilingue de los servicios que aparecen en la home.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/admin/services/${s.id}`}
            className="group bg-[#111111] border border-white/10 rounded-xl p-5 text-left hover:border-white/20 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white mb-1 truncate">{s.titleEs}</div>
                <div className="text-xs text-[#71717A] mb-3 truncate">{s.slug}</div>
                <div className="flex flex-wrap gap-1">
                  {s.featuresEs.slice(0, 2).map((f) => (
                    <span key={f} className="text-[10px] bg-white/5 text-[#71717A] px-1.5 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              </div>
              <ArrowRight size={14} className="ml-auto mt-0.5 text-[#52525B] group-hover:text-[#A1A1AA] transition-colors" />
            </div>
            <div className="mt-3 text-[11px] text-[#71717A] flex items-center justify-between">
              <span>Orden {s.order}</span>
              <span className={s.published ? 'text-green-400' : 'text-zinc-500'}>{s.published ? 'Publicado' : 'Oculto'}</span>
            </div>
          </Link>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-16 text-[#52525B] text-sm">
          No hay servicios. Inicializa el CMS desde el Dashboard.
        </div>
      )}
    </div>
  );
}
