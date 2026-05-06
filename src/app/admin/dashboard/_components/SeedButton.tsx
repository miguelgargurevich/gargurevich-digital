'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.refresh(), 800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading || done}
      className="text-xs bg-[#00D4FF] hover:bg-[#00B8D9] text-background font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-60"
    >
      {done ? '✓ Importado' : loading ? 'Importando…' : 'Inicializar CMS'}
    </button>
  );
}
